// Pyodide Web Worker for safe, client-side Python execution

/* eslint-disable no-restricted-globals */
declare const importScripts: (...urls: string[]) => void;
declare const loadPyodide: (config?: any) => Promise<any>;

let pyodide: any = null;
let isInitializing = false;

async function initPyodide() {
  if (pyodide) return pyodide;
  if (isInitializing) return;
  isInitializing = true;

  try {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });

    self.postMessage({ type: "READY" });
  } catch (err: any) {
    self.postMessage({ type: "INIT_ERROR", error: err.message || String(err) });
  } finally {
    isInitializing = false;
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, code, testCases } = event.data;

  if (type === "INIT") {
    await initPyodide();
    return;
  }

  if (type === "RUN") {
    if (!pyodide) {
      await initPyodide();
    }

    const startTime = performance.now();
    let stdoutBuffer: string[] = [];
    let stderrBuffer: string[] = [];

    try {
      // Set stdout and stderr redirection
      pyodide.setStdout({
        batched: (text: string) => stdoutBuffer.push(text),
      });
      pyodide.setStderr({
        batched: (text: string) => stderrBuffer.push(text),
      });

      // Execute user code
      await pyodide.runPythonAsync(code);

      // Evaluate test cases if present
      const testResults = [];
      if (Array.isArray(testCases) && testCases.length > 0) {
        for (const tc of testCases) {
          try {
            // Evaluate expression in Python environment
            const result = await pyodide.runPythonAsync(tc.call);
            const pyResult = result && typeof result.toJs === "function" ? result.toJs() : result;
            
            // Compare result
            const passed = JSON.stringify(pyResult) === JSON.stringify(tc.expected);
            testResults.push({
              name: tc.name,
              passed,
              actual: pyResult,
              expected: tc.expected,
            });
          } catch (tcErr: any) {
            testResults.push({
              name: tc.name,
              passed: false,
              error: tcErr.message || String(tcErr),
              expected: tc.expected,
            });
          }
        }
      }

      const executionTimeMs = Math.round(performance.now() - startTime);

      self.postMessage({
        type: "SUCCESS",
        stdout: stdoutBuffer.join("\n"),
        stderr: stderrBuffer.join("\n"),
        testResults,
        executionTimeMs,
      });
    } catch (err: any) {
      self.postMessage({
        type: "ERROR",
        error: err.message || String(err),
        stdout: stdoutBuffer.join("\n"),
        stderr: stderrBuffer.join("\n"),
      });
    }
  }
};

