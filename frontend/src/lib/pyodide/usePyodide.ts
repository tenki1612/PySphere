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

  useEffect(() => {
    // Instantiate web worker via inline blob script to avoid bundler path issues
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
            
            await pyodide.runPythonAsync(code);

            const testResults = [];
            if (Array.isArray(testCases)) {
              for (const tc of testCases) {
                try {
                  const res = await pyodide.runPythonAsync(tc.call);
                  const jsRes = res && typeof res.toJs === "function" ? res.toJs() : res;
                  const passed = JSON.stringify(jsRes) === JSON.stringify(tc.expected);
                  testResults.push({ name: tc.name, passed, actual: jsRes, expected: tc.expected });
                } catch (tcErr) {
                  testResults.push({ name: tc.name, passed: false, error: tcErr.message, expected: tc.expected });
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
      if (type === "READY") {
        setIsReady(true);
      } else if (type === "SUCCESS") {
        setIsRunning(false);
        setOutput({
          stdout: stdout || "",
          stderr: stderr || "",
          error: null,
          testResults: testResults || [],
          executionTimeMs: executionTimeMs || 0,
        });
      } else if (type === "ERROR") {
        setIsRunning(false);
        setOutput({
          stdout: stdout || "",
          stderr: stderr || "",
          error: error || "Runtime error",
          testResults: [],
          executionTimeMs: 0,
        });
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const runCode = useCallback((code: string, testCases: any[] = []) => {
    if (!workerRef.current) return;
    setIsRunning(true);
    setOutput((prev) => ({ ...prev, error: null }));
    workerRef.current.postMessage({
      type: "RUN",
      code,
      testCases,
    });
  }, []);

  return {
    isReady,
    isRunning,
    output,
    runCode,
  };
}

