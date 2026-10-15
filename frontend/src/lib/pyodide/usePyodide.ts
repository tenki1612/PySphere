"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface TestResult {
  name: string;
  passed: boolean;
  actual?: any;
  expected?: any;
  error?: string;
}

export interface PyodideRunOutput {
  stdout: string;
  stderr: string;
  error: string | null;
  testResults: TestResult[];
  executionTimeMs: number;
}

export function usePyodide() {
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<PyodideRunOutput>({
    stdout: "",
    stderr: "",
    error: null,
    testResults: [],
    executionTimeMs: 0,
  });

  const workerRef = useRef<Worker | null>(null);
  const pendingResolverRef = useRef<((value: PyodideRunOutput) => void) | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const workerScript = `
      let pyodide = null;
      let isInitializing = false;

      async function init() {
        if (pyodide || isInitializing) return;
        isInitializing = true;
        try {
          importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
          pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
          self.postMessage({ type: "READY" });
        } catch (err) {
          self.postMessage({ type: "INIT_ERROR", error: err.message || String(err) });
        } finally {
          isInitializing = false;
        }
      }

      self.onmessage = async (e) => {
        const { type, code, testCases } = e.data;
        if (type === "INIT") {
          await init();
          return;
        }
        if (type === "RUN") {
          if (!pyodide) await init();
          const t0 = performance.now();
          let outBuf = [];
          let errBuf = [];
          try {
            pyodide.setStdout({ batched: (msg) => outBuf.push(msg) });
            pyodide.setStderr({ batched: (msg) => errBuf.push(msg) });
            
            // Execute main code
            await pyodide.runPythonAsync(code);

            // Execute test assertions
            const testResults = [];
            if (Array.isArray(testCases)) {
              for (const tc of testCases) {
                let pyResult = null;
                try {
                  const rawRes = await pyodide.runPythonAsync(tc.call);
                  if (rawRes && typeof rawRes.toJs === "function") {
                    pyResult = rawRes.toJs({ dict_converter: Object.fromEntries });
                    if (typeof rawRes.destroy === "function") rawRes.destroy();
                  } else {
                    pyResult = rawRes;
                  }

                  const passed = JSON.stringify(pyResult) === JSON.stringify(tc.expected);
                  testResults.push({
                    name: tc.name,
                    passed,
                    actual: pyResult,
                    expected: tc.expected
                  });
                } catch (tcErr) {
                  testResults.push({
                    name: tc.name,
                    passed: false,
                    error: tcErr.message || String(tcErr),
                    expected: tc.expected
                  });
                }
              }
            }

            self.postMessage({
              type: "SUCCESS",
              stdout: outBuf.join("\\n"),
              stderr: errBuf.join("\\n"),
              testResults,
              executionTimeMs: Math.round(performance.now() - t0)
            });
          } catch (err) {
            self.postMessage({
              type: "ERROR",
              error: err.message || String(err),
              stdout: outBuf.join("\\n"),
              stderr: errBuf.join("\\n")
            });
          }
        }
      };
      init();
    `;

    const blob = new Blob([workerScript], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { type, stdout, stderr, error, testResults, executionTimeMs } = event.data;

      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }

      if (type === "READY") {
        setIsReady(true);
      } else if (type === "SUCCESS") {
        setIsRunning(false);
        const res: PyodideRunOutput = {
          stdout: stdout || "",
          stderr: stderr || "",
          error: null,
          testResults: testResults || [],
          executionTimeMs: executionTimeMs || 0,
        };
        setOutput(res);
        if (pendingResolverRef.current) {
          pendingResolverRef.current(res);
          pendingResolverRef.current = null;
        }
      } else if (type === "ERROR") {
        setIsRunning(false);
        const res: PyodideRunOutput = {
          stdout: stdout || "",
          stderr: stderr || "",
          error: error || "Runtime error",
          testResults: [],
          executionTimeMs: 0,
        };
        setOutput(res);
        if (pendingResolverRef.current) {
          pendingResolverRef.current(res);
          pendingResolverRef.current = null;
        }
      }
    };

    return () => {
      worker.terminate();
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    };
  }, []);

  const runCodeAsync = useCallback(
    (code: string, testCases: any[] = []): Promise<PyodideRunOutput> => {
      return new Promise((resolve) => {
        if (!workerRef.current) {
          resolve({
            stdout: "",
            stderr: "",
            error: "Web Worker chưa sẵn sàng",
            testResults: [],
            executionTimeMs: 0,
          });
          return;
        }

        setIsRunning(true);
        setOutput((prev) => ({ ...prev, error: null }));
        pendingResolverRef.current = resolve;

        // 10s watchdog timer in case user code hits infinite loop
        if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = setTimeout(() => {
          setIsRunning(false);
          const timeoutRes: PyodideRunOutput = {
            stdout: "",
            stderr: "Execution Timeout: Mã nguồn chạy vượt quá 10 giây (khả năng vòng lặp vô tận).",
            error: "Execution Timeout (> 10s)",
            testResults: [],
            executionTimeMs: 10000,
          };
          setOutput(timeoutRes);
          if (pendingResolverRef.current) {
            pendingResolverRef.current(timeoutRes);
            pendingResolverRef.current = null;
          }
        }, 10000);

        workerRef.current.postMessage({
          type: "RUN",
          code,
          testCases,
        });
      });
    },
    []
  );

  return {
    isReady,
    isRunning,
    output,
    runCode: (code: string, testCases: any[] = []) => {
      runCodeAsync(code, testCases);
    },
    runCodeAsync,
  };
}

