import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import type { Chapter, Exercise, Lesson } from '../types/algolab';

const SHORT_CHAPTER_LABELS: Record<string, string> = {
  'ch0-revision': 'Ch.0 · Révision N°1',
  'ch1-instructions': 'Ch.1 · Instructions & Chaînes',
  'ch2-conditionnelles': 'Ch.2 · Conditionnelles',
  'ch3-boucle-pour': 'Ch.3 · Boucle Pour',
  'ch4-tableaux': 'Ch.4 · Tableaux 1D',
  'ch5-boucles-condition': 'Ch.5 · Tant Que / Répéter',
  'ch6-sous-programmes': 'Ch.6 · Sous-Programmes',
  'ch7-synthese': 'Ch.7 · Synthèse & Problèmes',
};

interface DigitalNotebookProps {
  chapters: Chapter[];
  selectedChapterId: string;
  selectedLessonId: string;
  completedLessons: string[];
  completedExercises: string[];
  onSelectChapter: (chapterId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onToggleLessonComplete: (lessonId: string, completed: boolean) => Promise<void>;
  onOpenExercise: (exerciseId: string) => void;
}

export const DigitalNotebook: React.FC<DigitalNotebookProps> = ({
  chapters,
  selectedChapterId,
  selectedLessonId,
  completedLessons,
  completedExercises,
  onSelectChapter,
  onSelectLesson,
  onToggleLessonComplete,
  onOpenExercise,
}) => {
  const activeChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const activeLesson: Lesson | undefined =
    activeChapter?.lessons.find((l) => l.id === selectedLessonId) || activeChapter?.lessons[0];

  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
    setQuizChoice(null);
    setQuizChecked(false);
  }, [activeLesson?.id]);

  useEffect(() => {
    if (!playing || !activeLesson?.interactiveDemo) return;
    const total = activeLesson.interactiveDemo.steps.length;
    if (stepIdx >= total - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, total - 1));
    }, 1500);
    return () => clearTimeout(timer);
  }, [playing, stepIdx, activeLesson]);

  if (!activeChapter || !activeLesson) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-2xl text-slate-600">
        Sélectionne un chapitre pour consulter le cours numérique.
      </div>
    );
  }

  const isLessonDone = completedLessons.includes(activeLesson.id);
  const demo = activeLesson.interactiveDemo;
  const currentStep = demo?.steps[stepIdx];
  const chapterExercises: Exercise[] = activeChapter.exercises || [];

  const handleToggleDone = async () => {
    setSavingProgress(true);
    try {
      await onToggleLessonComplete(activeLesson.id, !isLessonDone);
    } finally {
      setSavingProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chapter Selector Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Cahier numérique interactif — Programme 3SC
            </h2>
            <p className="text-xs text-slate-500">
              8 chapitres alignés sur ton cahier d’activités officiel
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chapters.map((ch) => {
            const isSel = ch.id === activeChapter.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectChapter(ch.id);
                  if (ch.lessons[0]) onSelectLesson(ch.lessons[0].id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {SHORT_CHAPTER_LABELS[ch.id] || `Ch.${ch.order} · ${ch.title.replace(/^Chapitre \d+\s*:\s*/i, '')}`}
              </button>
            );
          })}
        </div>

        {/* Lessons within selected chapter */}
        {activeChapter.lessons.length > 1 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            {activeChapter.lessons.map((les) => {
              const active = les.id === activeLesson.id;
              const done = completedLessons.includes(les.id);
              return (
                <button
                  key={les.id}
                  type="button"
                  onClick={() => onSelectLesson(les.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />}
                  <span>
                    Leçon {les.order} : {les.title}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Lesson Card */}
      <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Lesson Header */}
        <header className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span>{activeChapter.title}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{activeLesson.sourcePages}</span>
            <span aria-hidden="true">·</span>
            <span>{isLessonDone ? 'Leçon terminée' : 'En cours d’étude'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
              {activeLesson.title}
            </h1>
            <button
              type="button"
              onClick={handleToggleDone}
              disabled={savingProgress}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLessonDone
                  ? 'bg-teal-50 text-[#0D9488] border border-teal-200 hover:bg-teal-100'
                  : 'bg-[#0D9488] text-white hover:bg-teal-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>
                {isLessonDone ? 'Leçon validée' : 'Marquer comme terminée (+25 XP)'}
              </span>
            </button>
          </div>
        </header>

        {/* Objectives & Definitions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 p-5 rounded-xl bg-slate-50 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              Objectifs de la séance
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              {activeLesson.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold tabular-nums">{idx + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-span-7 p-5 rounded-xl bg-slate-50 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              Notions et définitions clés
            </h2>
            <dl className="divide-y divide-slate-200">
              {activeLesson.definitions.map((def, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <dt className="font-semibold text-slate-900">{def.term}</dt>
                  <dd className="sm:col-span-2 text-slate-600 leading-relaxed">{def.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Content Sections */}
        <section className="space-y-5">
          {activeLesson.contentSections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="font-display text-lg font-bold text-slate-900">{sec.heading}</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{sec.body}</p>
              {sec.bullets && sec.bullets.length > 0 && (
                <ul className="pl-5 list-disc space-y-1 text-sm text-slate-700">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* Side-by-Side Syntax Comparison (Algo vs Python) */}
        {activeLesson.syntaxExamples.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Correspondance Algorithme ↔ Python
            </h2>
            <div className="space-y-4">
              {activeLesson.syntaxExamples.map((ex, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{ex.title}</span>
                    {ex.note && <span className="text-xs text-slate-500">{ex.note}</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-[#0F172A] text-slate-100">
                    <div className="p-4">
                      <div className="text-[11px] font-semibold text-blue-300 mb-2">Algorithme</div>
                      <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {ex.algo}
                      </pre>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] font-semibold text-teal-300 mb-2">Python</div>
                      <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {ex.python}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Step-by-Step Execution Demo */}
        {demo && currentStep && (
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Simulation pas à pas : {demo.title}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">{demo.description}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStepIdx((s) => Math.max(0, s - 1));
                  }}
                  disabled={stepIdx === 0}
                  aria-label="Étape précédente"
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                >
                  {playing ? (
                    <>
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Animer</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStepIdx((s) => Math.min(demo.steps.length - 1, s + 1));
                  }}
                  disabled={stepIdx >= demo.steps.length - 1}
                  aria-label="Étape suivante"
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStepIdx(0);
                  }}
                  aria-label="Réinitialiser la simulation"
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Left Stage: Code Lines */}
              <div className="lg:col-span-6 rounded-xl bg-[#0F172A] text-slate-100 p-4 font-mono text-xs sm:text-sm space-y-1">
                {demo.codeLines.map((line, idx) => {
                  const isActive = idx === currentStep.highlightLine;
                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded flex items-center gap-3 transition-colors ${
                        isActive ? 'bg-blue-600/35 text-white font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-500 tabular-nums w-5 text-right select-none">
                        {idx + 1}
                      </span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </div>

              {/* Right Control & Variable Deck */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                    <span className="font-semibold text-slate-900">{currentStep.label}</span>
                    <span>
                      Étape {stepIdx + 1} / {demo.steps.length}
                    </span>
                  </div>

                  <p className="text-sm text-slate-800 leading-relaxed">{currentStep.explanation}</p>

                  {currentStep.conditionEvaluated && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                      <span className="font-mono text-slate-800">{currentStep.conditionEvaluated}</span>
                      <span
                        className={`font-semibold ${
                          currentStep.conditionResult ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {currentStep.conditionResult ? 'Condition VRAIE' : 'Condition FAUSSE'}
                      </span>
                    </div>
                  )}

                  {/* Variables State */}
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1.5">
                      État des variables en mémoire
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(currentStep.variables).map(([k, v]) => (
                        <div
                          key={k}
                          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between font-mono text-xs"
                        >
                          <span className="text-slate-600">{k}</span>
                          <span className="font-bold text-slate-900 tabular-nums">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {currentStep.output !== undefined && (
                  <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs">
                    Sortie écran : {currentStep.output}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Worked Example */}
        {activeLesson.workedExample && (
          <section className="rounded-xl border border-slate-200 p-5 space-y-3 bg-white">
            <h2 className="font-display text-base font-bold text-slate-900">
              Exemple commenté : {activeLesson.workedExample.title}
            </h2>
            <p className="text-sm text-slate-700">{activeLesson.workedExample.statement}</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
              {activeLesson.workedExample.walkthrough.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ol>
          </section>
        )}

        {/* Comprehension Check */}
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#7C3AED]" aria-hidden="true" />
            <h2 className="font-display text-base font-bold text-slate-900">
              Vérifie ta compréhension
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-800">{activeLesson.comprehensionCheck.prompt}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeLesson.comprehensionCheck.options.map((opt, idx) => {
              const selected = quizChoice === idx;
              const isCorrect = idx === activeLesson.comprehensionCheck.correctIndex;
              let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-violet-300';
              if (quizChecked && selected && isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
              } else if (quizChecked && selected && !isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
              } else if (selected) {
                btnStyle = 'bg-violet-100 border-[#7C3AED] text-slate-900 font-semibold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuizChoice(idx);
                    setQuizChecked(true);
                  }}
                  className={`text-left p-3 rounded-xl border text-sm transition-colors cursor-pointer ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {quizChecked && quizChoice !== null && (
            <div
              className={`p-3.5 rounded-xl border text-sm ${
                quizChoice === activeLesson.comprehensionCheck.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <span className="font-semibold">
                {quizChoice === activeLesson.comprehensionCheck.correctIndex
                  ? 'Exact ! '
                  : 'Pas tout à fait. '}
              </span>
              {activeLesson.comprehensionCheck.explanation}
            </div>
          )}
        </section>

        {/* Practice Exercises of this Chapter */}
        {chapterExercises.length > 0 && (
          <section className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Passer à la pratique ({chapterExercises.length} exercices)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chapterExercises.map((ex) => {
                const done = completedExercises.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onOpenExercise(ex.id)}
                    className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-[#2563EB] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{ex.numberLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>p.{ex.sourcePage}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ex.difficulty}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {ex.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {done && (
                        <CheckCircle2 className="w-4 h-4 text-[#0D9488]" aria-label="Validé" />
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
