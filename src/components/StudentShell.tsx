import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  Flame,
  LogOut,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type {
  BadgeDefinition,
  Chapter,
  ClassRoom,
  EvaluationFeedback,
  Exercise,
  HintRecord,
  Session,
  StudentProfile,
  StudentSubmission,
} from '../types/algolab';
import { DigitalNotebook } from './DigitalNotebook';
import { ExerciseWorkspace } from './ExerciseWorkspace';

interface StudentShellProps {
  student: StudentProfile;
  classRoom?: ClassRoom;
  session?: Session;
  chapters: Chapter[];
  badges: BadgeDefinition[];
  submissions: StudentSubmission[];
  hintsHistory: HintRecord[];
  tutorConfig: {
    aiEnabled: boolean;
    maxHintLevel: 1 | 2 | 3 | 4;
    hintsBeforeSubmission: boolean;
    aiFeedbackEnabled: boolean;
    allowRetry: boolean;
    revealSolutionAfterCompletion: boolean;
  };
  onUpdateStudent: (student: StudentProfile) => void;
  onAddSubmission: (sub: StudentSubmission) => void;
  onAddHint: (hint: HintRecord) => void;
  onSwitchStudent: () => void;
  onOpenTeacherPortal: () => void;
}

type MainTab = 'notebook' | 'exercises' | 'progress';

export const StudentShell: React.FC<StudentShellProps> = ({
  student,
  classRoom,
  session,
  chapters,
  badges,
  submissions,
  hintsHistory,
  tutorConfig,
  onUpdateStudent,
  onAddSubmission,
  onAddHint,
  onSwitchStudent,
  onOpenTeacherPortal,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('notebook');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || 'ch0-revision');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    chapters[0]?.lessons[0]?.id || 'les-ch0-intro'
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    chapters[0]?.exercises[0]?.id || ''
  );

  const [exFilterChapter, setExFilterChapter] = useState<string>('all');
  const [exFilterStatus, setExFilterStatus] = useState<'all' | 'todo' | 'done' | 'retry'>('all');
  const [exSearch, setExSearch] = useState('');

  const allLessonsCount = useMemo(
    () => chapters.reduce((acc, ch) => acc + ch.lessons.length, 0),
    [chapters]
  );
  const allExercises = useMemo(() => chapters.flatMap((ch) => ch.exercises), [chapters]);

  const submissionByEx = useMemo(() => {
    const map = new Map<string, StudentSubmission>();
    for (const s of submissions) {
      map.set(s.exerciseId, s);
    }
    return map;
  }, [submissions]);

  const activeExercise: Exercise | undefined = useMemo(
    () => allExercises.find((e) => e.id === selectedExerciseId) || allExercises[0],
    [allExercises, selectedExerciseId]
  );

  const activeExChapter = useMemo(
    () => chapters.find((ch) => ch.id === activeExercise?.chapterId),
    [chapters, activeExercise]
  );

  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      if (exFilterChapter !== 'all' && ex.chapterId !== exFilterChapter) return false;
      const done = student.completedExercises.includes(ex.id);
      const sub = submissionByEx.get(ex.id);
      if (exFilterStatus === 'done' && !done) return false;
      if (exFilterStatus === 'todo' && (done || sub)) return false;
      if (exFilterStatus === 'retry' && (!sub || sub.status === 'correct')) return false;
      if (exSearch.trim()) {
        const q = exSearch.trim().toLowerCase();
        const hay = `${ex.title} ${ex.numberLabel} ${ex.conceptToReview}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allExercises, exFilterChapter, exFilterStatus, exSearch, student.completedExercises, submissionByEx]);

  const handleToggleLessonComplete = async (lessonId: string, completed: boolean) => {
    const resp = await fetch('/api/student/lesson-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: student.id, lessonId, completed }),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.student) onUpdateStudent(data.student);
    }
  };

  const handleOpenExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setActiveTab('exercises');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToLesson = (lessonId: string, chapterId?: string) => {
    if (chapterId) setSelectedChapterId(chapterId);
    setSelectedLessonId(lessonId);
    setActiveTab('notebook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitted = (result: {
    feedback: EvaluationFeedback;
    submission: StudentSubmission;
    student: StudentProfile;
  }) => {
    onAddSubmission(result.submission);
    onUpdateStudent(result.student);
  };

  const completionPercent = Math.round(
    ((student.completedLessons.length + student.completedExercises.length) /
      Math.max(allLessonsCount + allExercises.length, 1)) *
      100
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones on desktop, clean compact stack on mobile */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('notebook')}
            className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            AlgoLab
          </button>

          <nav aria-label="Navigation élève" className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('notebook')}
              className={`text-sm font-medium pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'notebook'
                  ? 'border-[#2563EB] text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Cahier numérique
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exercises')}
              className={`text-sm font-medium pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'exercises'
                  ? 'border-[#2563EB] text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Exercices
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className={`text-sm font-medium pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'progress'
                  ? 'border-[#2563EB] text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Progression
            </button>
            <button
              type="button"
              onClick={onOpenTeacherPortal}
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Enseignant</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenTeacherPortal}
              className="md:hidden px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Enseignant
            </button>
            <button
              type="button"
              onClick={onSwitchStudent}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Changer d’élève</span>
              <span className="sm:hidden">Quitter</span>
            </button>
          </div>
        </div>

        {/* Mobile Secondary Nav Strip */}
        <nav
          aria-label="Navigation mobile élève"
          className="md:hidden border-t border-slate-100 px-3 py-1.5 grid grid-cols-3 gap-1 bg-slate-50/70"
        >
          <button
            type="button"
            onClick={() => setActiveTab('notebook')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'notebook'
                ? 'bg-white text-[#2563EB] shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Cahier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exercises')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'exercises'
                ? 'bg-white text-[#2563EB] shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Exercices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-white text-[#2563EB] shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Progression
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Student Context & Progress Strip */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{classRoom?.name || '3ème Sciences Expérimentales'}</span>
              <span aria-hidden="true">·</span>
              <span>Séance {session?.code || student.sessionCode}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              Bonjour, {student.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-center">
            <div>
              <div className="text-xs text-slate-500">Points XP</div>
              <div className="font-display text-lg font-bold text-[#EA580C] tabular-nums flex items-center gap-1">
                <Flame className="w-4 h-4" aria-hidden="true" />
                <span>{student.xp} XP</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Leçons</div>
              <div className="font-display text-lg font-bold text-slate-900 tabular-nums">
                {student.completedLessons.length} / {allLessonsCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Exercices validés</div>
              <div className="font-display text-lg font-bold text-[#0D9488] tabular-nums">
                {student.completedExercises.length} / {allExercises.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1 flex justify-between tabular-nums">
                <span>Avancement</span>
                <span className="font-semibold text-slate-800">{completionPercent}%</span>
              </div>
              <div className="w-28 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#0D9488] transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* TAB 1: DIGITAL NOTEBOOK */}
        {activeTab === 'notebook' && (
          <DigitalNotebook
            chapters={chapters}
            selectedChapterId={selectedChapterId}
            selectedLessonId={selectedLessonId}
            completedLessons={student.completedLessons}
            completedExercises={student.completedExercises}
            onSelectChapter={setSelectedChapterId}
            onSelectLesson={setSelectedLessonId}
            onToggleLessonComplete={handleToggleLessonComplete}
            onOpenExercise={handleOpenExercise}
          />
        )}

        {/* TAB 2: EXERCISES */}
        {activeTab === 'exercises' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Exercise Selector Sidebar */}
            <aside className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="space-y-2">
                <h2 className="font-display text-base font-bold text-slate-900">
                  Exercices du cahier ({filteredExercises.length})
                </h2>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Rechercher un exercice"
                    value={exSearch}
                    onChange={(e) => setExSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <select
                  aria-label="Filtrer par chapitre"
                  value={exFilterChapter}
                  onChange={(e) => setExFilterChapter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="all">Tous les chapitres</option>
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch.{ch.order} : {ch.title.replace(/^Chapitre \d+\s*:\s*/i, '')}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                  {(
                    [
                      ['all', 'Tous'],
                      ['todo', 'À faire'],
                      ['done', 'Validés'],
                      ['retry', 'À revoir'],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setExFilterStatus(val)}
                      className={`py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        exFilterStatus === val
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 max-h-[34rem] overflow-y-auto pr-1">
                {filteredExercises.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Aucun exercice ne correspond à ce filtre.
                  </p>
                ) : (
                  filteredExercises.map((ex) => {
                    const isSel = activeExercise?.id === ex.id;
                    const done = student.completedExercises.includes(ex.id);
                    const sub = submissionByEx.get(ex.id);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => setSelectedExerciseId(ex.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                          isSel
                            ? 'bg-blue-50 border-[#2563EB]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 tabular-nums">
                          <span>
                            {ex.numberLabel} · p.{ex.sourcePage}
                          </span>
                          {done ? (
                            <span className="text-[#0D9488] font-semibold inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                              Validé
                            </span>
                          ) : sub ? (
                            <span className="text-[#EA580C] font-semibold">En cours</span>
                          ) : null}
                        </div>
                        <div className="text-xs font-semibold text-slate-900 mt-1 line-clamp-2">
                          {ex.title}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Active Exercise Workspace */}
            <div className="xl:col-span-9">
              {activeExercise ? (
                <ExerciseWorkspace
                  studentId={student.id}
                  exercise={activeExercise}
                  chapter={activeExChapter}
                  submission={submissionByEx.get(activeExercise.id)}
                  draft={student.drafts[activeExercise.id]}
                  tutorConfig={tutorConfig}
                  hintsHistory={hintsHistory}
                  onHintReceived={onAddHint}
                  onSubmitted={handleSubmitted}
                  onNavigateToLesson={handleNavigateToLesson}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-600">
                  Sélectionne un exercice dans la liste à gauche pour commencer.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROGRESS & BADGES */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Chapter Progress Grid */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Avancement par chapitre
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapters.map((ch) => {
                  const totalItems = ch.lessons.length + ch.exercises.length;
                  const doneItems =
                    ch.lessons.filter((l) => student.completedLessons.includes(l.id)).length +
                    ch.exercises.filter((e) => student.completedExercises.includes(e.id)).length;
                  const pct = Math.round((doneItems / Math.max(totalItems, 1)) * 100);
                  return (
                    <div key={ch.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900">{ch.title}</span>
                        <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                          {doneItems}/{totalItems} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-[#2563EB]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Badges */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#EA580C]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Badges d’apprentissage ({student.unlockedBadges.length} / {badges.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((b) => {
                  const unlocked = student.unlockedBadges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-4 rounded-xl border space-y-1.5 ${
                        unlocked
                          ? 'bg-orange-50/50 border-orange-300'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-bold text-slate-900">{b.title}</span>
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            unlocked ? 'text-[#EA580C]' : 'text-slate-500'
                          }`}
                        >
                          {unlocked ? `Obtenu (+${b.xpBonus} XP)` : `+${b.xpBonus} XP`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
                      <p className="text-[11px] text-slate-500">Critère : {b.criteria}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Submissions */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#0D9488]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Historique de mes soumissions
                </h2>
              </div>
              {submissions.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500 space-y-3">
                  <p>Tu n’as pas encore soumis d’exercice dans cette séance.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('exercises')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>Aller aux exercices</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500">
                        <th className="py-2.5 px-3 font-semibold">Exercice</th>
                        <th className="py-2.5 px-3 font-semibold">Statut</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Score</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Essais</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{sub.exerciseTitle}</td>
                          <td className="py-2.5 px-3 text-xs font-semibold">
                            {sub.status === 'correct' ? (
                              <span className="text-[#0D9488]">Validé</span>
                            ) : sub.status === 'partial' ? (
                              <span className="text-[#EA580C]">Partiel</span>
                            ) : (
                              <span className="text-rose-600">À retravailler</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                            {sub.latestFeedback.scorePercent}%
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                            {sub.attempts.length}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenExercise(sub.exerciseId)}
                              className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                            >
                              Ouvrir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
