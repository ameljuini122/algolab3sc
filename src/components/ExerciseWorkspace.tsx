import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Save,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type {
  Chapter,
  EvaluationFeedback,
  Exercise,
  HintRecord,
  StudentSubmission,
} from '../types/algolab';
import type { PythonExecutionOutcome } from '../utils/evaluators';
import { AlgorithmIDE } from './AlgorithmIDE';
import { PythonIDE } from './PythonIDE';
import { AiTutorPanel } from './AiTutorPanel';

interface ExerciseWorkspaceProps {
  studentId: string;
  exercise: Exercise;
  chapter?: Chapter;
  submission?: StudentSubmission;
  draft?: Record<string, unknown>;
  tutorConfig: {
    aiEnabled: boolean;
    maxHintLevel: 1 | 2 | 3 | 4;
    hintsBeforeSubmission: boolean;
    allowRetry: boolean;
  };
  hintsHistory: HintRecord[];
  onHintReceived: (hint: HintRecord) => void;
  onSubmitted: (result: {
    feedback: EvaluationFeedback;
    submission: StudentSubmission;
    student: import('../types/algolab').StudentProfile;
  }) => void;
  onNavigateToLesson: (lessonId: string, chapterId?: string) => void;
}

function buildInitialPayload(
  exercise: Exercise,
  draft?: Record<string, unknown>,
  submission?: StudentSubmission
): Record<string, unknown> {
  if (draft && Object.keys(draft).length > 0) return draft;
  if (submission?.latestAnswer && Object.keys(submission.latestAnswer).length > 0) {
    return submission.latestAnswer;
  }
  return {
    algo: exercise.workspaceConfig.starterAlgo || '',
    python: exercise.workspaceConfig.starterPython || '',
    answers: {},
    blanks: {},
    table: {},
    subQuestions: {},
    foundWords: [],
  };
}

export const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({
  studentId,
  exercise,
  chapter,
  submission,
  draft,
  tutorConfig,
  hintsHistory,
  onHintReceived,
  onSubmitted,
  onNavigateToLesson,
}) => {
  const [payload, setPayload] = useState<Record<string, unknown>>(() =>
    buildInitialPayload(exercise, draft, submission)
  );
  const [feedback, setFeedback] = useState<EvaluationFeedback | null>(
    submission?.latestFeedback || null
  );
  const [pyOutcome, setPyOutcome] = useState<PythonExecutionOutcome | undefined>(undefined);
  const [ideTab, setIdeTab] = useState<'algo' | 'python'>('algo');
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Word search cell selection state
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  useEffect(() => {
    setPayload(buildInitialPayload(exercise, draft, submission));
    setFeedback(submission?.latestFeedback || null);
    setPyOutcome(undefined);
    setIdeTab('algo');
    setDraftMessage('');
    setSubmitError('');
    setSelectedCells([]);
  }, [exercise.id]);

  const exerciseHints = useMemo(
    () => hintsHistory.filter((h) => h.exerciseId === exercise.id),
    [hintsHistory, exercise.id]
  );

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setDraftMessage('');
    try {
      const resp = await fetch('/api/student/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          exerciseId: exercise.id,
          answerPayload: payload,
        }),
      });
      if (resp.ok) {
        setDraftMessage('Brouillon enregistré');
        setTimeout(() => setDraftMessage(''), 2500);
      }
    } finally {
      setSavingDraft(false);
    }
  };

  const handleVerify = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const resp = await fetch('/api/student/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          exerciseId: exercise.id,
          answerPayload: payload,
          pythonOutcome: pyOutcome,
          hintsRequested: exerciseHints.length,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setSubmitError(data.error || 'Erreur lors de l’évaluation.');
        return;
      }
      setFeedback(data.feedback);
      onSubmitted(data);
    } catch {
      setSubmitError('Impossible de vérifier la réponse pour le moment.');
    } finally {
      setSubmitting(false);
    }
  };

  // Word search helpers
  const foundWords = Array.isArray(payload.foundWords) ? (payload.foundWords as string[]) : [];
  const handleWordGridCellClick = (r: number, c: number) => {
    const key = `${r}-${c}`;
    const nextCells = selectedCells.includes(key)
      ? selectedCells.filter((k) => k !== key)
      : [...selectedCells, key];

    setSelectedCells(nextCells);

    const grid = exercise.workspaceConfig.grid || [];
    const targets = exercise.workspaceConfig.targetWords || [];

    // Check if cells selected on any single row form a target word
    const byRow = new Map<number, number[]>();
    for (const cellKey of nextCells) {
      const [rr, cc] = cellKey.split('-').map(Number);
      const list = byRow.get(rr) || [];
      list.push(cc);
      byRow.set(rr, list);
    }

    const newlyFound: string[] = [...foundWords];
    let matchedWord = false;
    for (const [rowIdx, cols] of byRow.entries()) {
      const sortedCols = [...cols].sort((a, b) => a - b);
      // Check contiguous sequence
      const isContiguous = sortedCols.every((val, i) => i === 0 || val === sortedCols[i - 1] + 1);
      if (isContiguous && sortedCols.length >= 3) {
        const word = sortedCols.map((colIdx) => grid[rowIdx]?.[colIdx] || '').join('');
        const targetHit = targets.find((t) => t.toUpperCase() === word.toUpperCase());
        if (targetHit) {
          if (!newlyFound.includes(targetHit)) {
            newlyFound.push(targetHit);
          }
          matchedWord = true;
        }
      }
    }

    if (matchedWord) {
      setPayload((prev) => ({ ...prev, foundWords: newlyFound }));
      setSelectedCells([]);
    }
  };

  const toggleWordDirectly = (word: string) => {
    const exists = foundWords.includes(word);
    const next = exists ? foundWords.filter((w) => w !== word) : [...foundWords, word];
    setPayload((prev) => ({ ...prev, foundWords: next }));
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <header className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          {chapter && <span>{chapter.title}</span>}
          {chapter && <span aria-hidden="true">·</span>}
          <span>{exercise.numberLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">Page {exercise.sourcePage}</span>
          <span aria-hidden="true">·</span>
          <span>{exercise.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">~{exercise.estimatedMinutes} min</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-slate-900 text-balance">
            {exercise.title}
          </h1>
          {exercise.lessonId && (
            <button
              type="button"
              onClick={() => onNavigateToLesson(exercise.lessonId!, exercise.chapterId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>Revoir : {exercise.conceptToReview}</span>
            </button>
          )}
        </div>

        {exercise.needsTeacherReview && exercise.reviewNote && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Note pédagogique :</strong> {exercise.reviewNote}
            </span>
          </div>
        )}
      </header>

      {/* Main Split: Workspace (8 cols) + AI Tutor (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Pedagogical Framing Card */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <h2 className="font-display text-base font-bold text-slate-900">
                1. Énoncé de l’exercice
              </h2>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line">
                {exercise.originalStatement}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h2 className="font-display text-base font-bold text-[#2563EB]">
                2. Comprendre le travail demandé
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{exercise.understandWork}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Objectifs pédagogiques</h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {exercise.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Méthode de réflexion</h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {exercise.reflectionQuestions.map((rq, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-[#7C3AED] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{rq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Interactive Workspace Card */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-slate-900">
                3. Espace de travail
              </h2>
              {draftMessage && (
                <span className="text-xs font-medium text-[#0D9488]">{draftMessage}</span>
              )}
            </div>

            {/* CODE SNIPPET IF ANY */}
            {exercise.workspaceConfig.codeSnippet && (
              <pre className="p-4 rounded-xl bg-[#0F172A] text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
                {exercise.workspaceConfig.codeSnippet}
              </pre>
            )}

            {/* WORD SEARCH */}
            {exercise.kind === 'word_search' && exercise.workspaceConfig.grid && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Clique sur les lettres consécutives d’une ligne pour former le nom d’une fonction prédéfinie,
                  ou valide directement ci-dessous celles que tu as repérées dans la grille.
                </p>
                <div className="overflow-x-auto">
                  <div className="inline-grid grid-cols-7 gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    {exercise.workspaceConfig.grid.map((row, rIdx) =>
                      row.map((letter, cIdx) => {
                        const key = `${rIdx}-${cIdx}`;
                        const active = selectedCells.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleWordGridCellClick(rIdx, cIdx)}
                            className={`w-10 h-10 rounded-lg font-mono font-bold text-sm border transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                : 'bg-white text-slate-800 border-slate-300 hover:border-[#2563EB]'
                            }`}
                          >
                            {letter}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold">
                      Fonctions trouvées ({foundWords.length} / {(exercise.workspaceConfig.targetWords || []).length})
                    </span>
                    {selectedCells.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCells([])}
                        className="text-[#2563EB] hover:underline"
                      >
                        Effacer la sélection
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(exercise.workspaceConfig.targetWords || []).map((word) => {
                      const hit = foundWords.includes(word);
                      return (
                        <button
                          key={word}
                          type="button"
                          onClick={() => toggleWordDirectly(word)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                            hit
                              ? 'bg-teal-50 border-[#0D9488] text-[#0D9488]'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {hit ? `✓ ${word}` : `Repérer : ${word}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* QCM */}
            {exercise.kind === 'qcm' && exercise.workspaceConfig.questions && (
              <div className="space-y-4">
                {exercise.workspaceConfig.questions.map((q, qIdx) => {
                  const ansMap = (payload.answers || {}) as Record<string, string>;
                  return (
                    <fieldset key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <legend className="text-sm font-semibold text-slate-900">
                        {qIdx + 1}. {q.prompt}
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => {
                          const checked = ansMap[q.id] === opt.value;
                          return (
                            <label
                              key={opt.value}
                              className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                                checked
                                  ? 'bg-blue-50 border-[#2563EB] text-slate-900 font-medium'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`qcm-${q.id}`}
                                value={opt.value}
                                checked={checked}
                                onChange={() =>
                                  setPayload((prev) => ({
                                    ...prev,
                                    answers: {
                                      ...((prev.answers as Record<string, string>) || {}),
                                      [q.id]: opt.value,
                                    },
                                  }))
                                }
                                className="accent-[#2563EB]"
                              />
                              <span className="font-mono text-xs sm:text-sm">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            )}

            {/* TRUE / FALSE */}
            {exercise.kind === 'true_false' && exercise.workspaceConfig.trueFalseItems && (
              <div className="space-y-3">
                {exercise.workspaceConfig.trueFalseItems.map((item, idx) => {
                  const ansMap = (payload.answers || {}) as Record<
                    string,
                    { choice?: string; correction?: string }
                  >;
                  const cur = ansMap[item.id] || {};
                  return (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-900">
                          <span className="tabular-nums text-slate-500 mr-1.5">{idx + 1}.</span>
                          {item.statement}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {(['V', 'F'] as const).map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() =>
                                setPayload((prev) => ({
                                  ...prev,
                                  answers: {
                                    ...((prev.answers as Record<string, unknown>) || {}),
                                    [item.id]: { ...cur, choice },
                                  },
                                }))
                              }
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                                cur.choice === choice
                                  ? choice === 'V'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {choice === 'V' ? 'Vrai (V)' : 'Faux (F)'}
                            </button>
                          ))}
                        </div>
                      </div>
                      {cur.choice === 'F' && item.needsCorrectionIfFalse && (
                        <div>
                          <label
                            htmlFor={`tf-corr-${item.id}`}
                            className="block text-xs font-medium text-slate-600 mb-1"
                          >
                            Correction attendue :
                          </label>
                          <input
                            id={`tf-corr-${item.id}`}
                            type="text"
                            value={cur.correction || ''}
                            onChange={(e) =>
                              setPayload((prev) => ({
                                ...prev,
                                answers: {
                                  ...((prev.answers as Record<string, unknown>) || {}),
                                  [item.id]: { ...cur, correction: e.target.value },
                                },
                              }))
                            }
                            placeholder="Écris la séquence ou justification corrigée..."
                            className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* FILL BLANKS */}
            {exercise.kind === 'fill_blanks' && (
              <div className="space-y-4">
                {exercise.workspaceConfig.blanksTemplate && (
                  <pre className="p-4 rounded-xl bg-[#0F172A] text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
                    {exercise.workspaceConfig.blanksTemplate}
                  </pre>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(exercise.workspaceConfig.blankFields || []).map((field) => {
                    const blanks = (payload.blanks || {}) as Record<string, string>;
                    return (
                      <div key={field.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <label htmlFor={`blank-${field.id}`} className="block text-xs font-semibold text-slate-800">
                          {field.label}
                        </label>
                        <input
                          id={`blank-${field.id}`}
                          type="text"
                          value={blanks[field.id] || ''}
                          onChange={(e) =>
                            setPayload((prev) => ({
                              ...prev,
                              blanks: {
                                ...((prev.blanks as Record<string, string>) || {}),
                                [field.id]: e.target.value,
                              },
                            }))
                          }
                          placeholder={field.placeholder || 'Complète...'}
                          className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TABLES (expression_table, trace_table, code_debug) */}
            {(exercise.kind === 'expression_table' ||
              exercise.kind === 'trace_table' ||
              exercise.kind === 'code_debug') &&
              exercise.workspaceConfig.tableHeaders &&
              exercise.workspaceConfig.tableRows && (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        {exercise.workspaceConfig.tableHeaders.map((h, i) => (
                          <th key={i} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {exercise.workspaceConfig.tableRows.map((row) => {
                        const tableMap = (payload.table || {}) as Record<string, string>;
                        return (
                          <tr key={row.id} className="hover:bg-slate-50/70">
                            {row.cells.map((cell) => {
                              const cellKey = `${row.id}__${cell.key}`;
                              return (
                                <td key={cell.key} className="px-3 py-2 align-middle">
                                  {cell.editable ? (
                                    <input
                                      type="text"
                                      aria-label={`${cell.label || cell.key} (${row.id})`}
                                      value={tableMap[cellKey] || ''}
                                      onChange={(e) =>
                                        setPayload((prev) => ({
                                          ...prev,
                                          table: {
                                            ...((prev.table as Record<string, string>) || {}),
                                            [cellKey]: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Réponse..."
                                      className="w-full min-w-[7rem] px-2.5 py-1.5 font-mono text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    />
                                  ) : (
                                    <span className="font-mono text-xs text-slate-800 whitespace-pre-wrap">
                                      {cell.prefilled}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            {/* ALGORITHM & PYTHON IDEs */}
            {exercise.kind === 'algorithm_and_python' && (
              <div className="space-y-4">
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIdeTab('algo')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      ideTab === 'algo'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1. Algorithme (T.D.O / Pseudo-code)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdeTab('python')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      ideTab === 'python'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    2. Programme Python
                  </button>
                </div>

                {ideTab === 'algo' ? (
                  <AlgorithmIDE
                    value={String(payload.algo || '')}
                    onChange={(next) => setPayload((prev) => ({ ...prev, algo: next }))}
                    starter={exercise.workspaceConfig.starterAlgo}
                    criteria={exercise.algorithmCriteria}
                  />
                ) : (
                  <PythonIDE
                    value={String(payload.python || '')}
                    onChange={(next) => setPayload((prev) => ({ ...prev, python: next }))}
                    starter={exercise.workspaceConfig.starterPython}
                    defaultInputs={exercise.workspaceConfig.defaultInputs}
                    testCases={exercise.testCases}
                    onTestOutcome={setPyOutcome}
                  />
                )}
              </div>
            )}

            {(exercise.kind === 'algorithm' || exercise.kind === 'modular_design') && (
              <AlgorithmIDE
                value={String(payload.algo || '')}
                onChange={(next) => setPayload((prev) => ({ ...prev, algo: next }))}
                starter={exercise.workspaceConfig.starterAlgo}
                criteria={exercise.algorithmCriteria}
              />
            )}

            {exercise.kind === 'python' && (
              <PythonIDE
                value={String(payload.python || '')}
                onChange={(next) => setPayload((prev) => ({ ...prev, python: next }))}
                starter={exercise.workspaceConfig.starterPython}
                defaultInputs={exercise.workspaceConfig.defaultInputs}
                testCases={exercise.testCases}
                onTestOutcome={setPyOutcome}
              />
            )}

            {/* SUB-QUESTIONS (present in short_answer or alongside tables/code) */}
            {exercise.workspaceConfig.subQuestions &&
              exercise.workspaceConfig.subQuestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  {exercise.workspaceConfig.subQuestions.map((sq) => {
                    const sqMap = (payload.subQuestions || {}) as Record<string, string>;
                    return (
                      <div key={sq.id} className="space-y-1.5">
                        <label
                          htmlFor={`sq-${sq.id}`}
                          className="block text-sm font-semibold text-slate-800"
                        >
                          {sq.prompt}
                        </label>
                        <textarea
                          id={`sq-${sq.id}`}
                          rows={2}
                          value={sqMap[sq.id] || ''}
                          onChange={(e) =>
                            setPayload((prev) => ({
                              ...prev,
                              subQuestions: {
                                ...((prev.subQuestions as Record<string, string>) || {}),
                                [sq.id]: e.target.value,
                              },
                            }))
                          }
                          placeholder={sq.placeholder || 'Rédige ta réponse ici...'}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

            {submitError && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
                {submitError}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>{savingDraft ? 'Enregistrement...' : 'Enregistrer brouillon'}</span>
                </button>
                {feedback && tutorConfig.allowRetry && (
                  <button
                    type="button"
                    onClick={() => setFeedback(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Réessayer</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>{submitting ? 'Analyse en cours...' : 'Vérifier ma réponse'}</span>
              </button>
            </div>
          </section>

          {/* Structured Pedagogical Feedback */}
          {feedback && (
            <section
              aria-live="polite"
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  {feedback.status === 'correct' ? (
                    <CheckCircle2 className="w-6 h-6 text-[#0D9488]" aria-hidden="true" />
                  ) : feedback.status === 'partial' ? (
                    <AlertTriangle className="w-6 h-6 text-[#EA580C]" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" aria-hidden="true" />
                  )}
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {feedback.status === 'correct'
                        ? 'Réponse validée !'
                        : feedback.status === 'partial'
                        ? 'Presque ! Continue à affiner'
                        : 'À retravailler étape par étape'}
                    </h3>
                    <p className="text-xs text-slate-500 tabular-nums">
                      Score estimé : {feedback.scorePercent}% · +{feedback.xpAwarded} XP
                    </p>
                  </div>
                </div>
              </div>

              {feedback.whatIsCorrect.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-emerald-800">Ce qui est juste</h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {feedback.whatIsCorrect.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.whatNeedsImprovement.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-amber-800">Ce qui doit être amélioré</h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {feedback.whatNeedsImprovement.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#EA580C] mt-0.5 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.errorExplanation && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  <strong className="text-slate-900">Explication : </strong>
                  {feedback.errorExplanation}
                </div>
              )}

              {feedback.progressiveHint && (
                <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 text-sm text-violet-950">
                  <strong className="text-[#7C3AED]">Indice progressif : </strong>
                  {feedback.progressiveHint}
                </div>
              )}

              {feedback.teacherOverrideNote && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-950">
                  <strong>Remarque de Mme Amel Juini : </strong>
                  {feedback.teacherOverrideNote}
                </div>
              )}

              {feedback.recommendedLessonId && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToLesson(feedback.recommendedLessonId!, exercise.chapterId)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>Revoir la leçon recommandée : {feedback.recommendedLessonTitle}</span>
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column: Contextual AI Tutor */}
        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <AiTutorPanel
            studentId={studentId}
            exercise={exercise}
            currentAttempt={payload}
            maxHintLevel={tutorConfig.maxHintLevel}
            aiEnabled={tutorConfig.aiEnabled}
            hintsBeforeSubmission={tutorConfig.hintsBeforeSubmission}
            hasSubmittedAtLeastOnce={Boolean(submission && submission.attempts.length > 0)}
            hintsHistory={exerciseHints}
            onHintReceived={onHintReceived}
          />
        </div>
      </div>
    </div>
  );
};
