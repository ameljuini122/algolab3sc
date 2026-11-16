import React, { useMemo, useRef, useState } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle2, XCircle, FlaskConical } from 'lucide-react';
import type { PythonTestCase } from '../types/algolab';
import { translatePythonErrorToFrench, type PythonExecutionOutcome } from '../utils/evaluators';
import { runPythonCode, runPythonTestCases } from '../utils/pythonRunner';

interface PythonIDEProps {
  value: string;
  onChange: (next: string) => void;
  starter?: string;
  defaultInputs?: string[];
  testCases?: PythonTestCase[];
  onTestOutcome?: (outcome: PythonExecutionOutcome) => void;
}

const PY_SNIPPETS: { label: string; insert: string }[] = [
  { label: 'input()', insert: 'int(input("Donner un entier : "))' },
  { label: 'print()', insert: 'print()' },
  { label: 'if / else', insert: 'if :\n    \nelse:\n    ' },
  { label: 'for range', insert: 'for i in range(1, n + 1):\n    ' },
  { label: 'while', insert: 'while :\n    ' },
  { label: 'def', insert: 'def ma_fonction(n):\n    return ' },
  { label: 'match / case', insert: 'match x:\n    case 1:\n        \n    case _:\n        ' },
];

export const PythonIDE: React.FC<PythonIDEProps> = ({
  value,
  onChange,
  starter = '',
  defaultInputs = [],
  testCases = [],
  onTestOutcome,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputsRaw, setInputsRaw] = useState(defaultInputs.join('\n'));
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [runtimeLabel, setRuntimeLabel] = useState<'pyodide' | 'sandbox' | null>(null);
  const [testOutcome, setTestOutcome] = useState<PythonExecutionOutcome | null>(null);

  const lineCount = useMemo(() => Math.max(value.split('\n').length, 10), [value]);

  const insertSnippet = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value ? `${value}\n${snippet}` : snippet);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.slice(0, start) + snippet + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertSnippet('    ');
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setStderr('');
    setStdout('');
    setTestOutcome(null);
    try {
      const inputs = inputsRaw
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const res = await runPythonCode(value, inputs);
      setStdout(res.stdout);
      setStderr(res.stderr ? translatePythonErrorToFrench(res.stderr) : '');
      setRuntimeLabel(res.runtime);
    } finally {
      setRunning(false);
    }
  };

  const handleRunTests = async () => {
    setRunning(true);
    setStderr('');
    try {
      const outcome = await runPythonTestCases(value, testCases);
      setTestOutcome(outcome);
      onTestOutcome?.(outcome);
      if (outcome.caseResults[0]) {
        setStdout(outcome.caseResults[0].output);
        if (outcome.caseResults[0].error) {
          setStderr(translatePythonErrorToFrench(outcome.caseResults[0].error));
        }
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-[#0F172A] text-slate-100 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
          Éditeur & Console Python 3
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0D9488] hover:bg-teal-700 disabled:opacity-60 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{running ? 'Exécution...' : 'Exécuter Python'}</span>
          </button>

          {testCases.length > 0 && (
            <button
              type="button"
              onClick={handleRunTests}
              disabled={running}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tester ({testCases.length} cas)</span>
            </button>
          )}

          {starter && (
            <button
              type="button"
              onClick={() => {
                onChange(starter);
                setStdout('');
                setStderr('');
                setTestOutcome(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Snippets */}
      <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex flex-wrap gap-1.5">
        {PY_SNIPPETS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => insertSnippet(item.insert)}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex font-mono text-sm leading-6">
        <div
          aria-hidden="true"
          className="select-none py-3 px-3 text-right text-slate-500 bg-slate-950/50 border-r border-slate-800 tabular-nums min-w-[3rem]"
        >
          {Array.from({ length: lineCount }, (_, idx) => (
            <div key={idx + 1}>{idx + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          aria-label="Éditeur de code Python"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.max(10, Math.min(18, lineCount + 1))}
          spellCheck={false}
          placeholder="# Écris ton programme Python ici&#10;"
          className="flex-1 p-3 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none resize-y font-mono text-sm leading-6"
        />
      </div>

      {/* Inputs & Output Console */}
      <div className="border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 bg-slate-950">
        <div className="md:col-span-4 p-3 border-b md:border-b-0 md:border-r border-slate-800">
          <label htmlFor="python-stdin" className="block text-xs font-medium text-slate-400 mb-1.5">
            Entrées pour input() (1 valeur par ligne)
          </label>
          <textarea
            id="python-stdin"
            value={inputsRaw}
            onChange={(e) => setInputsRaw(e.target.value)}
            rows={3}
            placeholder="Ex :&#10;12&#10;5"
            className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#0D9488]"
          />
        </div>

        <div className="md:col-span-8 p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Console de sortie</span>
            </span>
            {runtimeLabel && (
              <span className="text-slate-500">
                Exécuteur : {runtimeLabel === 'pyodide' ? 'Python WebAssembly' : 'Interpréteur 3SC'}
              </span>
            )}
          </div>

          <div className="min-h-[4.5rem] p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs whitespace-pre-wrap break-words">
            {stdout ? (
              <div className="text-emerald-300">{stdout}</div>
            ) : !stderr ? (
              <span className="text-slate-500">
                Clique sur « Exécuter Python » pour observer le résultat de ton programme.
              </span>
            ) : null}
            {stderr && <div className="text-rose-300 mt-1">{stderr}</div>}
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      {testOutcome && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 tabular-nums">
            <span>Résultats des cas de test</span>
            <span>
              {testOutcome.passedCount} / {testOutcome.totalCount} réussi(s)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {testOutcome.caseResults.map((c, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs ${
                  c.passed
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {c.label} — {c.passed ? 'Réussi' : 'À corriger'}
                  </span>
                </div>
                {c.error ? (
                  <p className="mt-1 text-rose-300">{translatePythonErrorToFrench(c.error)}</p>
                ) : (
                  <p className="mt-1 text-slate-300 font-mono truncate">
                    Sortie : {c.output.trim() || '(vide)'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
