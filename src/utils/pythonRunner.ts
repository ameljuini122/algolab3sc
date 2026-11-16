import type { PythonTestCase } from '../types/algolab';
import type { PythonExecutionOutcome } from './evaluators';
import { runEducationalPythonSandbox, type PythonRunResult } from './pythonFallback';

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (key: string, value: unknown) => void;
  };
}

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<PyodideInstance>;
  }
}

let pyodidePromise: Promise<PyodideInstance | null> | null = null;
const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

async function loadPyodideWithTimeout(timeoutMs = 4500): Promise<PyodideInstance | null> {
  if (typeof window === 'undefined') return null;
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise<PyodideInstance | null>((resolve) => {
    const timer = setTimeout(() => {
      resolve(null);
    }, timeoutMs);

    const init = async () => {
      try {
        if (!window.loadPyodide) {
          await new Promise<void>((resScript, rejScript) => {
            const script = document.createElement('script');
            script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
            script.async = true;
            script.onload = () => resScript();
            script.onerror = () => rejScript(new Error('Pyodide script load failed'));
            document.head.appendChild(script);
          });
        }
        if (window.loadPyodide) {
          const instance = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
          clearTimeout(timer);
          resolve(instance);
          return;
        }
      } catch {
        // Fallback smoothly to sandbox
      }
      clearTimeout(timer);
      resolve(null);
    };

    void init();
  });

  return pyodidePromise;
}

export async function runPythonCode(
  code: string,
  inputs: string[] = []
): Promise<PythonRunResult> {
  const start = Date.now();
  const pyodide = await loadPyodideWithTimeout();

  if (pyodide) {
    try {
      const escapedCode = JSON.stringify(code);
      const escapedInputs = JSON.stringify(inputs);
      const wrapper = `
import sys, io, builtins
_algolab_inputs = iter(${escapedInputs})
def _algolab_input(prompt=""):
    try:
        return next(_algolab_inputs)
    except StopIteration:
        return ""
builtins.input = _algolab_input
_algolab_stdout = io.StringIO()
_old_stdout = sys.stdout
sys.stdout = _algolab_stdout
_algolab_err = ""
try:
    exec(compile(${escapedCode}, "<student_code>", "exec"), {})
except Exception as e:
    import traceback
    _algolab_err = f"{type(e).__name__}: {e}"
finally:
    sys.stdout = _old_stdout
(_algolab_stdout.getvalue(), _algolab_err)
`;
      const result = (await pyodide.runPythonAsync(wrapper)) as {
        toJs?: () => [string, string];
      };
      const pair =
        result && typeof result.toJs === 'function'
          ? result.toJs()
          : Array.isArray(result)
          ? (result as [string, string])
          : ['', ''];
      return {
        stdout: String(pair[0] ?? '').replace(/\n$/, ''),
        stderr: String(pair[1] ?? ''),
        runtime: 'pyodide',
        durationMs: Date.now() - start,
      };
    } catch {
      // Fall back to sandbox if Pyodide execution fails unexpectedly
    }
  }

  return runEducationalPythonSandbox(code, inputs);
}

function normalizeOutputLines(raw: string): string {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join('\n')
    .toLowerCase();
}

export async function runPythonTestCases(
  code: string,
  testCases: PythonTestCase[]
): Promise<PythonExecutionOutcome> {
  if (!testCases || testCases.length === 0) {
    const res = await runPythonCode(code, []);
    return {
      passedCount: res.stderr ? 0 : 1,
      totalCount: 1,
      caseResults: [
        {
          label: 'Exécution libre',
          passed: !res.stderr && res.stdout.trim().length > 0,
          output: res.stdout,
          error: res.stderr || undefined,
        },
      ],
    };
  }

  const caseResults: PythonExecutionOutcome['caseResults'] = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const res = await runPythonCode(code, tc.inputs);
    if (res.stderr) {
      caseResults.push({
        label: tc.label,
        passed: false,
        output: res.stdout,
        error: res.stderr,
      });
      continue;
    }

    const normStdout = normalizeOutputLines(res.stdout);
    const passed = tc.expectedOutputs.every((exp) =>
      normStdout.includes(exp.trim().toLowerCase())
    );
    if (passed) passedCount++;
    caseResults.push({
      label: tc.label,
      passed,
      output: res.stdout,
    });
  }

  return {
    passedCount,
    totalCount: testCases.length,
    caseResults,
  };
}
