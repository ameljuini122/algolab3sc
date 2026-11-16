import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Edit3,
  KeyRound,
  LogOut,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  AUTHORIZED_TEACHER_EMAIL,
  auth,
  onAuthStateChanged,
  signInTeacherWithGoogle,
  signOutTeacher,
  syncTeacherClassesToFirestore,
  type User,
} from '../firebase';
import type {
  Chapter,
  ClassRoom,
  Difficulty,
  Exercise,
  Session,
  StudentProfile,
  StudentSubmission,
  TutorConfig,
} from '../types/algolab';

interface TeacherPortalProps {
  chapters: Chapter[];
  onBackToStudent: () => void;
  onCurriculumUpdated: () => Promise<void>;
}

interface OverviewPayload {
  kpis: {
    totalClasses: number;
    activeSessions: number;
    totalStudents: number;
    totalSubmissions: number;
    totalAttempts: number;
    successRate: number;
    flaggedExercisesCount: number;
  };
  classes: ClassRoom[];
  sessions: Session[];
  students: StudentProfile[];
  submissions: StudentSubmission[];
  exerciseAnalytics: {
    exerciseId: string;
    title: string;
    chapterId: string;
    submissionsCount: number;
    attemptsCount: number;
    solvedCount: number;
    failureRate: number;
    hintsTotal: number;
    topErrors: { message: string; count: number }[];
  }[];
  studentsAtRisk: {
    studentId: string;
    name: string;
    sessionCode: string;
    completedCount: number;
    failedOrPartial: number;
    hintsUsed: number;
    xp: number;
    lastActiveAt: string;
  }[];
  flaggedExercises: Exercise[];
  tutorConfig: TutorConfig;
  exercises: Exercise[];
}

type TeacherTab = 'overview' | 'classes' | 'students' | 'content' | 'ai';

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  chapters,
  onBackToStudent,
  onCurriculumUpdated,
}) => {
  const [fbUser, setFbUser] = useState<User | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<TeacherTab>('overview');
  const [overview, setOverview] = useState<OverviewPayload | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Class & session forms
  const [newClassName, setNewClassName] = useState('');
  const [newSessTitle, setNewSessTitle] = useState('');
  const [newSessClassId, setNewSessClassId] = useState('');
  const [newSessCode, setNewSessCode] = useState('');

  // Students inspector
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [overrideSub, setOverrideSub] = useState<StudentSubmission | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<StudentSubmission['status']>('correct');
  const [overrideScore, setOverrideScore] = useState<number>(100);
  const [overrideNote, setOverrideNote] = useState('');

  // Content editor
  const [contentFilter, setContentFilter] = useState<'all' | 'flagged'>('all');
  const [contentChapter, setContentChapter] = useState<string>('all');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [newExTitle, setNewExTitle] = useState('');
  const [newExChapter, setNewExChapter] = useState(chapters[0]?.id || 'ch0-revision');
  const [newExStatement, setNewExStatement] = useState('');
  const [newExUnderstand, setNewExUnderstand] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const isAuthorized =
    Boolean(fbUser?.emailVerified) &&
    fbUser?.email?.toLowerCase() === AUTHORIZED_TEACHER_EMAIL;

  const authedFetch = async (url: string, options?: RequestInit) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Jeton Google manquant');
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers || {}),
      },
    });
  };

  const loadOverview = async () => {
    if (!isAuthorized) return;
    setLoadingData(true);
    setActionError('');
    try {
      const resp = await authedFetch('/api/teacher/overview');
      const data = await resp.json();
      if (!resp.ok) {
        setActionError(data.error || 'Impossible de charger les données enseignant.');
        return;
      }
      setOverview(data);
      if (data.classes?.[0] && !newSessClassId) {
        setNewSessClassId(data.classes[0].id);
      }
      if (fbUser?.uid && data.classes && data.sessions) {
        syncTeacherClassesToFirestore(fbUser.uid, data.classes, data.sessions).catch(() => {
          // Non-blocking mirror sync
        });
      }
    } catch {
      setActionError('Erreur réseau lors du chargement du tableau de bord.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      void loadOverview();
    }
  }, [isAuthorized]);

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      const user = await signInTeacherWithGoogle();
      if (user.email?.toLowerCase() !== AUTHORIZED_TEACHER_EMAIL) {
        setAuthError(
          `Compte « ${user.email} » non autorisé. Seul le compte ${AUTHORIZED_TEACHER_EMAIL} (Mme Amel Juini) peut accéder à l’espace enseignant.`
        );
      }
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? `Connexion Google annulée ou bloquée (${err.message}).`
          : 'Impossible d’ouvrir la fenêtre de connexion Google.'
      );
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setActionError('');
    const resp = await authedFetch('/api/teacher/classes', {
      method: 'POST',
      body: JSON.stringify({ name: newClassName.trim() }),
    });
    if (resp.ok) {
      setNewClassName('');
      setActionSuccess('Classe créée avec succès.');
      await loadOverview();
    } else {
      const d = await resp.json();
      setActionError(d.error || 'Erreur création classe.');
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessTitle.trim()) return;
    setActionError('');
    const resp = await authedFetch('/api/teacher/sessions', {
      method: 'POST',
      body: JSON.stringify({
        classId: newSessClassId || overview?.classes[0]?.id,
        title: newSessTitle.trim(),
        code: newSessCode.trim(),
      }),
    });
    if (resp.ok) {
      setNewSessTitle('');
      setNewSessCode('');
      setActionSuccess('Séance créée et activée.');
      await loadOverview();
    } else {
      const d = await resp.json();
      setActionError(d.error || 'Erreur création séance.');
    }
  };

  const handleToggleSession = async (sess: Session) => {
    const resp = await authedFetch(`/api/teacher/sessions/${sess.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !sess.active }),
    });
    if (resp.ok) {
      await loadOverview();
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideSub) return;
    const resp = await authedFetch(`/api/teacher/submissions/${overrideSub.id}/override`, {
      method: 'POST',
      body: JSON.stringify({
        status: overrideStatus,
        scorePercent: overrideScore,
        teacherOverrideNote: overrideNote,
      }),
    });
    if (resp.ok) {
      setOverrideSub(null);
      setActionSuccess('Évaluation mise à jour par l’enseignante.');
      await loadOverview();
    }
  };

  const handleSaveExerciseEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise) return;
    const resp = await authedFetch(`/api/teacher/exercises/${editingExercise.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: editingExercise.title,
        originalStatement: editingExercise.originalStatement,
        understandWork: editingExercise.understandWork,
        difficulty: editingExercise.difficulty,
        active: editingExercise.active,
        presetHints: editingExercise.presetHints,
        needsTeacherReview: editingExercise.needsTeacherReview,
        reviewNote: editingExercise.reviewNote,
      }),
    });
    if (resp.ok) {
      setEditingExercise(null);
      setActionSuccess('Exercice mis à jour dans le programme.');
      await onCurriculumUpdated();
      await loadOverview();
    }
  };

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await authedFetch('/api/teacher/exercises', {
      method: 'POST',
      body: JSON.stringify({
        title: newExTitle,
        chapterId: newExChapter,
        originalStatement: newExStatement,
        understandWork: newExUnderstand,
      }),
    });
    if (resp.ok) {
      setShowCreateExercise(false);
      setNewExTitle('');
      setNewExStatement('');
      setNewExUnderstand('');
      setActionSuccess('Nouvel exercice ajouté au cahier.');
      await onCurriculumUpdated();
      await loadOverview();
    }
  };

  const handleUpdateAiConfig = async (patch: Record<string, unknown>) => {
    const resp = await authedFetch('/api/teacher/ai-config', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    if (resp.ok) {
      setActionSuccess('Configuration du Tuteur IA enregistrée.');
      await onCurriculumUpdated();
      await loadOverview();
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const resp = await authedFetch(`/api/teacher/export?format=${format}`);
      if (!resp.ok) return;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'csv' ? 'algolab-3sc-progression.csv' : 'algolab-3sc-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setActionError('Impossible d’exporter le fichier.');
    }
  };

  const filteredStudents = useMemo(() => {
    if (!overview) return [];
    const q = studentSearch.trim().toLowerCase();
    return overview.students.filter((st) => {
      if (!q) return true;
      return (
        st.name.toLowerCase().includes(q) || st.sessionCode.toLowerCase().includes(q)
      );
    });
  }, [overview, studentSearch]);

  const selectedStudent = useMemo(
    () =>
      overview?.students.find((s) => s.id === selectedStudentId) ||
      filteredStudents[0] ||
      null,
    [overview, selectedStudentId, filteredStudents]
  );

  const selectedStudentSubmissions = useMemo(() => {
    if (!overview || !selectedStudent) return [];
    return overview.submissions.filter((s) => s.studentId === selectedStudent.id);
  }, [overview, selectedStudent]);

  const filteredExercises = useMemo(() => {
    if (!overview) return [];
    return overview.exercises.filter((ex) => {
      if (contentFilter === 'flagged' && !ex.needsTeacherReview) return false;
      if (contentChapter !== 'all' && ex.chapterId !== contentChapter) return false;
      return true;
    });
  }, [overview, contentFilter, contentChapter]);

  // ---------- UNAUTHENTICATED / UNAUTHORIZED SCREEN ----------
  if (!authLoading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <span className="font-display text-xl font-bold text-slate-900 whitespace-nowrap">
              AlgoLab · Enseignant
            </span>
            <button
              type="button"
              onClick={onBackToStudent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Retour Élève</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Espace Enseignant
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Accès réservé à <strong>Mme Amel Juini</strong> ({AUTHORIZED_TEACHER_EMAIL}) pour gérer les séances,
                suivre les élèves, modifier le cahier et configurer le Tuteur IA.
              </p>
            </div>

            {fbUser && !isAuthorized && (
              <div role="alert" className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Compte connecté non autorisé : {fbUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void signOutTeacher()}
                  className="text-[#2563EB] font-semibold underline"
                >
                  Se déconnecter et choisir un autre compte Google
                </button>
              </div>
            )}

            {authError && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Se connecter avec Google</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------- TEACHER DASHBOARD ----------
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Bar Contract */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
          <span className="font-display text-xl font-bold text-slate-900 whitespace-nowrap shrink-0">
            AlgoLab Enseignant
          </span>

          <nav aria-label="Navigation enseignant" className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
            {(
              [
                ['overview', 'Vue générale'],
                ['classes', 'Classes & Séances'],
                ['students', 'Élèves'],
                ['content', 'Contenu & PDF'],
                ['ai', 'Tuteur IA'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`text-sm font-medium pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  tab === key
                    ? 'border-[#2563EB] text-slate-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onBackToStudent}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 whitespace-nowrap cursor-pointer"
            >
              Vue Élève
            </button>
            <button
              type="button"
              onClick={() => void signOutTeacher()}
              aria-label="Déconnexion enseignant"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {actionError && (
          <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
            {actionError}
          </div>
        )}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-center justify-between">
            <span>{actionSuccess}</span>
            <button type="button" onClick={() => setActionSuccess('')} className="text-xs font-semibold underline">
              Fermer
            </button>
          </div>
        )}

        {loadingData && !overview ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-sm text-slate-600">
            Chargement du tableau de bord enseignant...
          </div>
        ) : overview ? (
          <>
            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-slate-900">
                      Tableau de bord · Mme Amel Juini
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Données en temps réel calculées à partir des séances et tentatives enregistrées
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleExport('csv')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Exporter CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleExport('json')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Exporter JSON</span>
                    </button>
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="text-xs text-slate-500">Élèves connectés</div>
                    <div className="font-display text-2xl font-bold text-slate-900 tabular-nums mt-1">
                      {overview.kpis.totalStudents}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 tabular-nums">
                      {overview.kpis.activeSessions} séance(s) active(s)
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="text-xs text-slate-500">Soumissions évaluées</div>
                    <div className="font-display text-2xl font-bold text-slate-900 tabular-nums mt-1">
                      {overview.kpis.totalSubmissions}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 tabular-nums">
                      {overview.kpis.totalAttempts} tentative(s) au total
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="text-xs text-slate-500">Taux de réussite</div>
                    <div className="font-display text-2xl font-bold text-[#0D9488] tabular-nums mt-1">
                      {overview.kpis.successRate}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Sur les exercices soumis</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="text-xs text-slate-500">Notes PDF à vérifier</div>
                    <div className="font-display text-2xl font-bold text-[#EA580C] tabular-nums mt-1">
                      {overview.kpis.flaggedExercisesCount}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setContentFilter('flagged');
                        setTab('content');
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:underline mt-1 cursor-pointer"
                    >
                      Examiner dans Contenu
                    </button>
                  </div>
                </div>

                {/* Two-column Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Élèves nécessitant un accompagnement
                    </h2>
                    {overview.studentsAtRisk.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Aucune difficulté signalée pour le moment. Les données apparaîtront dès que les élèves soumettront leurs exercices.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {overview.studentsAtRisk.map((st) => (
                          <div key={st.studentId} className="py-3 flex items-center justify-between gap-3 text-sm">
                            <div>
                              <div className="font-semibold text-slate-900">{st.name}</div>
                              <div className="text-xs text-slate-500 tabular-nums">
                                Séance {st.sessionCode} · {st.failedOrPartial} à revoir · {st.hintsUsed} indices
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(st.studentId);
                                setTab('students');
                              }}
                              className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                            >
                              Inspecter
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Analyse par exercice & erreurs fréquentes
                    </h2>
                    {overview.exerciseAnalytics.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Pas encore de soumissions enregistrées pour calculer les erreurs fréquentes.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {overview.exerciseAnalytics.slice(0, 6).map((item) => (
                          <div key={item.exerciseId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-sm">
                              <span className="font-semibold text-slate-900 truncate">{item.title}</span>
                              <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums shrink-0">
                                Échec {item.failureRate}% · {item.attemptsCount} essais
                              </span>
                            </div>
                            {item.topErrors.length > 0 && (
                              <ul className="text-xs text-slate-600 space-y-0.5">
                                {item.topErrors.map((err, i) => (
                                  <li key={i}>
                                    • {err.message} ({err.count}×)
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}

            {/* CLASSES & SESSIONS TAB */}
            {tab === 'classes' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                  <form onSubmit={handleCreateClass} className="space-y-3">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Créer une classe
                    </h2>
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Ex : 3ème Sc. Expérimentales — Groupe B"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>Ajouter la classe</span>
                    </button>
                  </form>

                  <form onSubmit={handleCreateSession} className="pt-5 border-t border-slate-200 space-y-3">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Ouvrir une séance (Code élève)
                    </h2>
                    <select
                      aria-label="Classe associée"
                      value={newSessClassId}
                      onChange={(e) => setNewSessClassId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white"
                    >
                      {overview.classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newSessTitle}
                      onChange={(e) => setNewSessTitle(e.target.value)}
                      placeholder="Titre séance (ex : TP Boucles Tant Que)"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                    <input
                      type="text"
                      value={newSessCode}
                      onChange={(e) => setNewSessCode(e.target.value.toUpperCase())}
                      placeholder="Code personnalisé (optionnel, ex : BOUG3)"
                      className="w-full px-3.5 py-2.5 text-sm font-mono uppercase rounded-xl border border-slate-300"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>Générer et activer la séance</span>
                    </button>
                  </form>
                </section>

                <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Séances actives et historiques
                  </h2>
                  <div className="divide-y divide-slate-200">
                    {overview.sessions.map((sess) => {
                      const cls = overview.classes.find((c) => c.id === sess.classId);
                      const count = overview.students.filter((st) => st.sessionId === sess.id).length;
                      return (
                        <div key={sess.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{sess.title}</div>
                            <div className="text-xs text-slate-500 tabular-nums">
                              {cls?.name} · Code : <strong className="font-mono text-slate-900">{sess.code}</strong> · {count} élève(s)
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleToggleSession(sess)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                              sess.active
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-slate-100 border-slate-300 text-slate-600'
                            }`}
                          >
                            {sess.active ? 'Active (Cliquer pour fermer)' : 'Clôturée (Réactiver)'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* STUDENTS DETAIL TAB */}
            {tab === 'students' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                    <h2 className="font-display text-base font-bold text-slate-900">
                      Liste des élèves ({filteredStudents.length})
                    </h2>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
                    <input
                      type="search"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Filtrer par prénom ou code..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-[32rem] overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        Aucun élève inscrit pour le moment.
                      </p>
                    ) : (
                      filteredStudents.map((st) => {
                        const sel = selectedStudent?.id === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSelectedStudentId(st.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                              sel
                                ? 'bg-blue-50 border-[#2563EB]'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                              <span>{st.name}</span>
                              <span className="text-xs font-mono text-[#EA580C] tabular-nums">{st.xp} XP</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                              Code {st.sessionCode} · {st.completedExercises.length} exo(s) · {st.completedLessons.length} leçon(s)
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </aside>

                <section className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                  {!selectedStudent ? (
                    <p className="text-sm text-slate-500">
                      Sélectionne un élève pour consulter ses réponses, son code et ses feedbacks.
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <h2 className="font-display text-xl font-bold text-slate-900">
                            {selectedStudent.name}
                          </h2>
                          <p className="text-xs text-slate-500 tabular-nums">
                            Séance {selectedStudent.sessionCode} · {selectedStudent.xp} XP · {selectedStudent.completedExercises.length} exercices validés
                          </p>
                        </div>
                      </div>

                      {selectedStudentSubmissions.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          Cet élève n’a pas encore soumis de réponse.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedStudentSubmissions.map((sub) => (
                            <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <div className="text-sm font-bold text-slate-900">{sub.exerciseTitle}</div>
                                  <div className="text-xs text-slate-500 tabular-nums">
                                    Statut : <strong>{sub.status}</strong> · Score : {sub.latestFeedback.scorePercent}% · {sub.attempts.length} essai(s) · {sub.hintsRequested} indice(s)
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOverrideSub(sub);
                                    setOverrideStatus(sub.status);
                                    setOverrideScore(sub.latestFeedback.scorePercent);
                                    setOverrideNote(sub.latestFeedback.teacherOverrideNote || '');
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Corriger / Annoter</span>
                                </button>
                              </div>

                              {typeof sub.latestAnswer.algo === 'string' && sub.latestAnswer.algo.trim() && (
                                <pre className="p-3 rounded-lg bg-[#0F172A] text-slate-100 font-mono text-xs overflow-x-auto">
                                  {sub.latestAnswer.algo}
                                </pre>
                              )}
                              {typeof sub.latestAnswer.python === 'string' && sub.latestAnswer.python.trim() && (
                                <pre className="p-3 rounded-lg bg-[#0F172A] text-teal-200 font-mono text-xs overflow-x-auto">
                                  {sub.latestAnswer.python}
                                </pre>
                              )}
                              <div className="text-xs text-slate-700">
                                <strong>Feedback :</strong> {sub.latestFeedback.progressiveHint || sub.latestFeedback.errorExplanation || 'Validé'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </section>
              </div>
            )}

            {/* CONTENT & PDF REVIEW TAB */}
            {tab === 'content' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex p-1 rounded-lg bg-slate-100">
                      <button
                        type="button"
                        onClick={() => setContentFilter('all')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          contentFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        Tous ({overview.exercises.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentFilter('flagged')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          contentFilter === 'flagged' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        À vérifier PDF ({overview.flaggedExercises.length})
                      </button>
                    </div>
                    <select
                      aria-label="Filtrer exercices par chapitre"
                      value={contentChapter}
                      onChange={(e) => setContentChapter(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="all">Tous les chapitres</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateExercise(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Nouvel exercice</span>
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
                  {filteredExercises.map((ex) => (
                    <div key={ex.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{ex.numberLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">Page {ex.sourcePage}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ex.difficulty}</span>
                          <span aria-hidden="true">·</span>
                          <span className={ex.active !== false ? 'text-[#0D9488] font-semibold' : 'text-slate-400'}>
                            {ex.active !== false ? 'Actif' : 'Masqué'}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{ex.title}</div>
                        {ex.needsTeacherReview && ex.reviewNote && (
                          <div className="text-xs text-amber-800 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
                            <span>{ex.reviewNote}</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingExercise({ ...ex })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Modifier</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI CONFIG TAB */}
            {tab === 'ai' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7C3AED]" aria-hidden="true" />
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Paramètres du Tuteur IA
                    </h2>
                  </div>

                  <div className="space-y-3 text-sm">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <span>Activer le Tuteur IA pour les élèves</span>
                      <input
                        type="checkbox"
                        checked={overview.tutorConfig.aiEnabled}
                        onChange={(e) => void handleUpdateAiConfig({ aiEnabled: e.target.checked })}
                        className="accent-[#7C3AED] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <span>Autoriser les indices avant la première soumission</span>
                      <input
                        type="checkbox"
                        checked={overview.tutorConfig.hintsBeforeSubmission}
                        onChange={(e) =>
                          void handleUpdateAiConfig({ hintsBeforeSubmission: e.target.checked })
                        }
                        className="accent-[#7C3AED] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <span>Activer l’analyse sémantique IA des algorithmes</span>
                      <input
                        type="checkbox"
                        checked={overview.tutorConfig.aiFeedbackEnabled}
                        onChange={(e) =>
                          void handleUpdateAiConfig({ aiFeedbackEnabled: e.target.checked })
                        }
                        className="accent-[#7C3AED] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <span>Autoriser les élèves à réessayer</span>
                      <input
                        type="checkbox"
                        checked={overview.tutorConfig.allowRetry}
                        onChange={(e) => void handleUpdateAiConfig({ allowRetry: e.target.checked })}
                        className="accent-[#7C3AED] w-4 h-4"
                      />
                    </label>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <label htmlFor="max-hint-level" className="block text-xs font-semibold text-slate-800">
                        Niveau maximal d’indice autorisé (1 à 4)
                      </label>
                      <select
                        id="max-hint-level"
                        value={overview.tutorConfig.maxHintLevel}
                        onChange={(e) =>
                          void handleUpdateAiConfig({ maxHintLevel: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                      >
                        <option value={1}>Niveau 1 uniquement (Orientation)</option>
                        <option value={2}>Jusqu’au Niveau 2 (Raisonnement)</option>
                        <option value={3}>Jusqu’au Niveau 3 (Guidance conceptuelle)</option>
                        <option value={4}>Jusqu’au Niveau 4 (Débogage ciblé)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="teacher-instructions" className="block text-xs font-semibold text-slate-800">
                        Directives pédagogiques personnalisées pour le Tuteur IA
                      </label>
                      <textarea
                        id="teacher-instructions"
                        rows={4}
                        defaultValue={overview.tutorConfig.customTeacherInstructions}
                        onBlur={(e) =>
                          void handleUpdateAiConfig({ customTeacherInstructions: e.target.value })
                        }
                        className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </section>

                <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Indices IA récents à vérifier
                  </h2>
                  {overview.tutorConfig.pendingHintsToReview.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Aucun indice généré par Gemini à passer en revue pour le moment.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[30rem] overflow-y-auto">
                      {overview.tutorConfig.pendingHintsToReview.map((h) => (
                        <div key={h.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-900">
                            <span>{h.exerciseTitle} · Niv.{h.level}</span>
                            {h.approved && (
                              <span className="text-[#0D9488] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                Approuvé
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 leading-relaxed">{h.hintText}</p>
                          {!h.approved && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => void handleUpdateAiConfig({ approveHintId: h.id })}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-semibold cursor-pointer"
                              >
                                Approuver
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleUpdateAiConfig({ rejectHintId: h.id })}
                                className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-semibold cursor-pointer"
                              >
                                Retirer
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* MODAL: Override Submission */}
      {overrideSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveOverride}
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-slate-900">
              Corriger : {overrideSub.exerciseTitle}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as StudentSubmission['status'])}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="correct">Validé</option>
                  <option value="partial">Partiel</option>
                  <option value="incorrect">À retravailler</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Score (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remarque de l’enseignante
              </label>
              <textarea
                rows={3}
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                placeholder="Ex : Bonne démarche, pense juste à initialiser ton compteur..."
                className="w-full p-3 text-sm rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOverrideSub(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Edit Exercise */}
      {editingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveExerciseEdit}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-slate-900">
              Modifier : {editingExercise.numberLabel} — {editingExercise.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={editingExercise.title}
                  onChange={(e) => setEditingExercise({ ...editingExercise, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulté</label>
                <select
                  value={editingExercise.difficulty}
                  onChange={(e) =>
                    setEditingExercise({ ...editingExercise, difficulty: e.target.value as Difficulty })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Découverte">Découverte</option>
                  <option value="Entraînement">Entraînement</option>
                  <option value="Application">Application</option>
                  <option value="Défi">Défi</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Énoncé</label>
              <textarea
                rows={4}
                value={editingExercise.originalStatement}
                onChange={(e) =>
                  setEditingExercise({ ...editingExercise, originalStatement: e.target.value })
                }
                className="w-full p-3 text-sm rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Comprendre le travail demandé
              </label>
              <textarea
                rows={2}
                value={editingExercise.understandWork}
                onChange={(e) =>
                  setEditingExercise({ ...editingExercise, understandWork: e.target.value })
                }
                className="w-full p-3 text-sm rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingExercise.active !== false}
                  onChange={(e) =>
                    setEditingExercise({ ...editingExercise, active: e.target.checked })
                  }
                  className="accent-[#2563EB]"
                />
                <span>Visible aux élèves</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editingExercise.needsTeacherReview)}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      needsTeacherReview: e.target.checked,
                    })
                  }
                  className="accent-[#EA580C]"
                />
                <span>Marqué pour révision PDF</span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingExercise(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold cursor-pointer"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Create Exercise */}
      {showCreateExercise && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateExercise}
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-slate-900">
              Ajouter un nouvel exercice
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chapitre</label>
              <select
                value={newExChapter}
                onChange={(e) => setNewExChapter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
              <input
                type="text"
                required
                value={newExTitle}
                onChange={(e) => setNewExTitle(e.target.value)}
                placeholder="Ex : Somme des nombres impairs"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Énoncé</label>
              <textarea
                rows={4}
                required
                value={newExStatement}
                onChange={(e) => setNewExStatement(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Comprendre le travail demandé
              </label>
              <textarea
                rows={2}
                value={newExUnderstand}
                onChange={(e) => setNewExUnderstand(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateExercise(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold cursor-pointer"
              >
                Créer l’exercice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
