import {
  ALL_EXERCISES,
  ALL_LESSONS,
  BADGE_DEFINITIONS,
  CURRICULUM_CHAPTERS,
} from '../data/curriculum';
import {
  analyzeAlgorithmCode,
  computeNewBadges,
  evaluateExerciseAttempt,
  type PythonExecutionOutcome,
} from './evaluators';
import type {
  AttemptRecord,
  BadgeDefinition,
  Chapter,
  ClassRoom,
  Difficulty,
  EvaluationFeedback,
  Exercise,
  HintRecord,
  Session,
  StudentProfile,
  StudentSubmission,
  TutorConfig,
} from '../types/algolab';
import { auth, syncTeacherClassesToFirestore } from '../firebase';

const LOCAL_STORE_KEY = 'algolab_static_store_v1';

interface LocalStore {
  classes: ClassRoom[];
  sessions: Session[];
  students: Record<string, StudentProfile>;
  submissions: Record<string, StudentSubmission>;
  hints: HintRecord[];
  exerciseOverrides: Record<string, Partial<Exercise>>;
  customExercises: Exercise[];
  tutorConfig: TutorConfig;
}

let memoryStoreFallback: string | null = null;

function readStorageRaw(): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(LOCAL_STORE_KEY);
    }
  } catch {
    // Ignore storage quota / privacy mode errors
  }
  return memoryStoreFallback;
}

function writeStorageRaw(raw: string): void {
  memoryStoreFallback = raw;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_STORE_KEY, raw);
    }
  } catch {
    // Keep memory fallback
  }
}

export function resetLocalFallbackStore(): void {
  memoryStoreFallback = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(LOCAL_STORE_KEY);
    }
  } catch {
    // Ignore
  }
}

function createInitialLocalStore(): LocalStore {
  const now = new Date().toISOString();
  return {
    classes: [
      {
        id: 'cls-3sc-a',
        name: '3ème Sc. Expérimentales — Groupe A',
        level: '3ème Année Sciences Expérimentales',
        schoolYear: '2025-2026',
        createdAt: now,
      },
    ],
    sessions: [
      {
        id: 'sess-algo3sc',
        classId: 'cls-3sc-a',
        title: 'Séance Algorithmique & Python',
        code: 'ALGO3SC',
        active: true,
        createdAt: now,
      },
    ],
    students: {},
    submissions: {},
    hints: [],
    exerciseOverrides: {},
    customExercises: [],
    tutorConfig: {
      aiEnabled: true,
      maxHintLevel: 4,
      hintsBeforeSubmission: true,
      aiFeedbackEnabled: true,
      allowRetry: true,
      revealSolutionAfterCompletion: false,
      customTeacherInstructions:
        'Adapter les explications au programme tunisien de 3ème année Sciences Expérimentales (Lycée Mongi Slim Siliana). Employer la terminologie officielle du cahier : T.D.O., DIV, MOD, Répéter...Jusqu’à, Tant Que...Faire, sous-programmes (Fonction / Procédure).',
      pendingHintsToReview: [],
    },
  };
}

function loadLocalStore(): LocalStore {
  const defaults = createInitialLocalStore();
  try {
    const raw = readStorageRaw();
    if (!raw) {
      writeStorageRaw(JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    return {
      classes:
        Array.isArray(parsed.classes) && parsed.classes.length > 0
          ? parsed.classes
          : defaults.classes,
      sessions:
        Array.isArray(parsed.sessions) && parsed.sessions.length > 0
          ? parsed.sessions
          : defaults.sessions,
      students: parsed.students || {},
      submissions: parsed.submissions || {},
      hints: Array.isArray(parsed.hints) ? parsed.hints : [],
      exerciseOverrides: parsed.exerciseOverrides || {},
      customExercises: Array.isArray(parsed.customExercises) ? parsed.customExercises : [],
      tutorConfig: { ...defaults.tutorConfig, ...(parsed.tutorConfig || {}) },
    };
  } catch {
    writeStorageRaw(JSON.stringify(defaults));
    return defaults;
  }
}

function saveLocalStore(store: LocalStore): void {
  writeStorageRaw(JSON.stringify(store));
}

function getMergedLocalExercises(store: LocalStore): Exercise[] {
  const base = ALL_EXERCISES.map((ex) => {
    const ov = store.exerciseOverrides[ex.id];
    return ov ? { ...ex, ...ov } : ex;
  });
  const custom = store.customExercises.map((ex) => {
    const ov = store.exerciseOverrides[ex.id];
    return ov ? { ...ex, ...ov } : ex;
  });
  return [...base, ...custom];
}

function getMergedLocalChapters(store: LocalStore): Chapter[] {
  const all = getMergedLocalExercises(store);
  return CURRICULUM_CHAPTERS.map((ch) => ({
    ...ch,
    exercises: all.filter((ex) => ex.chapterId === ch.id),
  }));
}

function resolveApiUrl(path: string): string {
  const metaEnv =
    typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env
      ? (import.meta as unknown as { env: Record<string, string> }).env
      : undefined;
  const base = metaEnv?.VITE_API_BASE_URL?.trim().replace(/\/+$/, '');
  return base ? `${base}${path}` : path;
}

type BackendCallResult<T> =
  | { kind: 'ok'; status: number; data: T }
  | { kind: 'api_error'; status: number; error: string }
  | { kind: 'unreachable' };

async function tryBackendJson<T>(path: string, init?: RequestInit): Promise<BackendCallResult<T>> {
  try {
    const resp = await fetch(resolveApiUrl(path), init);
    const contentType = (resp.headers.get('content-type') || '').toLowerCase();
    // Static hosts (e.g. Netlify) return 404 HTML or 200 index.html for /api/* routes.
    if (!contentType.includes('application/json')) {
      return { kind: 'unreachable' };
    }
    const data = (await resp.json()) as T & { error?: string };
    if (!resp.ok) {
      return {
        kind: 'api_error',
        status: resp.status,
        error: data?.error || `Erreur serveur (${resp.status}).`,
      };
    }
    return { kind: 'ok', status: resp.status, data };
  } catch {
    return { kind: 'unreachable' };
  }
}

async function getTeacherHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Jeton Google manquant');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// ---------- Public / Student APIs with Seamless Static Fallback ----------

export interface CurriculumPayload {
  chapters: Chapter[];
  badges: BadgeDefinition[];
  tutorConfig: {
    aiEnabled: boolean;
    maxHintLevel: 1 | 2 | 3 | 4;
    hintsBeforeSubmission: boolean;
    aiFeedbackEnabled: boolean;
    allowRetry: boolean;
    revealSolutionAfterCompletion: boolean;
  };
}

export async function apiFetchCurriculum(): Promise<CurriculumPayload> {
  const remote = await tryBackendJson<CurriculumPayload>('/api/curriculum');
  if (remote.kind === 'ok') return remote.data;

  const store = loadLocalStore();
  const chapters = getMergedLocalChapters(store).map((ch) => ({
    ...ch,
    exercises: ch.exercises.filter((ex) => ex.active !== false),
  }));
  return {
    chapters,
    badges: BADGE_DEFINITIONS,
    tutorConfig: {
      aiEnabled: store.tutorConfig.aiEnabled,
      maxHintLevel: store.tutorConfig.maxHintLevel,
      hintsBeforeSubmission: store.tutorConfig.hintsBeforeSubmission,
      aiFeedbackEnabled: store.tutorConfig.aiFeedbackEnabled,
      allowRetry: store.tutorConfig.allowRetry,
      revealSolutionAfterCompletion: store.tutorConfig.revealSolutionAfterCompletion,
    },
  };
}

export interface JoinStudentResult {
  student: StudentProfile;
  classRoom?: ClassRoom;
  session?: Session;
  submissions: StudentSubmission[];
  reconnected?: boolean;
}

export async function apiJoinStudent(
  name: string,
  code: string
): Promise<{ ok: true; data: JoinStudentResult } | { ok: false; error: string }> {
  const cleanName = name.trim();
  const cleanCode = code.trim().toUpperCase();

  const remote = await tryBackendJson<JoinStudentResult>('/api/student/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: cleanName, code: cleanCode }),
  });

  if (remote.kind === 'ok') return { ok: true, data: remote.data };
  if (remote.kind === 'api_error') return { ok: false, error: remote.error };

  // Static / Netlify client-side fallback
  if (cleanName.length < 2 || cleanName.length > 40) {
    return { ok: false, error: 'Entre ton prénom (entre 2 et 40 caractères).' };
  }
  if (!cleanCode) {
    return { ok: false, error: 'Entre le code de classe fourni par ton enseignante.' };
  }

  const store = loadLocalStore();
  const session = store.sessions.find((s) => s.code.toUpperCase() === cleanCode && s.active);
  if (!session) {
    return {
      ok: false,
      error: `Le code de classe « ${cleanCode} » est introuvable ou clôturé. Utilise le code ALGO3SC ou vérifie auprès de Mme Amel Juini.`,
    };
  }

  const normalizedName = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

  const existing = Object.values(store.students).find(
    (st) => st.sessionId === session.id && st.normalizedName === normalizedName
  );
  const now = new Date().toISOString();

  if (existing) {
    existing.lastActiveAt = now;
    saveLocalStore(store);
    const submissions = Object.values(store.submissions).filter(
      (sub) => sub.studentId === existing.id
    );
    const classRoom = store.classes.find((c) => c.id === existing.classId);
    return {
      ok: true,
      data: {
        student: existing,
        classRoom,
        session,
        submissions,
        reconnected: true,
      },
    };
  }

  const studentId = `stu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const profile: StudentProfile = {
    id: studentId,
    name: cleanName,
    normalizedName,
    classId: session.classId,
    sessionId: session.id,
    sessionCode: session.code,
    xp: 0,
    streak: 1,
    completedLessons: [],
    completedExercises: [],
    unlockedBadges: [],
    drafts: {},
    lastActiveAt: now,
    createdAt: now,
  };
  store.students[studentId] = profile;
  saveLocalStore(store);

  const classRoom = store.classes.find((c) => c.id === session.classId);
  return {
    ok: true,
    data: {
      student: profile,
      classRoom,
      session,
      submissions: [],
      reconnected: false,
    },
  };
}

export interface StudentStateResult {
  student: StudentProfile;
  session?: Session;
  classRoom?: ClassRoom;
  submissions: StudentSubmission[];
  hints: HintRecord[];
}

export async function apiFetchStudentState(studentId: string): Promise<StudentStateResult | null> {
  const remote = await tryBackendJson<StudentStateResult>(
    `/api/student/state?studentId=${encodeURIComponent(studentId)}`
  );
  if (remote.kind === 'ok') return remote.data;
  if (remote.kind === 'api_error') return null;

  const store = loadLocalStore();
  const student = store.students[studentId];
  if (!student) return null;

  const session = store.sessions.find((s) => s.id === student.sessionId);
  const classRoom = store.classes.find((c) => c.id === student.classId);
  const submissions = Object.values(store.submissions).filter(
    (sub) => sub.studentId === student.id
  );
  const hints = store.hints.filter((h) => h.id.startsWith(`${student.id}__`));
  return { student, session, classRoom, submissions, hints };
}

export async function apiUpdateLessonProgress(
  studentId: string,
  lessonId: string,
  completed: boolean
): Promise<StudentProfile | null> {
  const remote = await tryBackendJson<{ student: StudentProfile }>('/api/student/lesson-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, lessonId, completed }),
  });
  if (remote.kind === 'ok') return remote.data.student;
  if (remote.kind === 'api_error') return null;

  const store = loadLocalStore();
  const student = store.students[studentId];
  if (!student) return null;
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return null;

  const already = student.completedLessons.includes(lesson.id);
  if (completed && !already) {
    student.completedLessons.push(lesson.id);
    student.xp += 25;
  } else if (!completed && already) {
    student.completedLessons = student.completedLessons.filter((id) => id !== lesson.id);
  }

  const studentSubs = Object.values(store.submissions).filter((s) => s.studentId === student.id);
  const prevBadges = new Set(student.unlockedBadges);
  const nextBadges = computeNewBadges({
    completedExercises: student.completedExercises,
    completedLessons: student.completedLessons,
    submissions: studentSubs,
    currentBadges: student.unlockedBadges,
  });
  for (const bId of nextBadges) {
    if (!prevBadges.has(bId)) {
      const def = BADGE_DEFINITIONS.find((b) => b.id === bId);
      if (def) student.xp += def.xpBonus;
    }
  }
  student.unlockedBadges = nextBadges;
  student.lastActiveAt = new Date().toISOString();
  saveLocalStore(store);
  return student;
}

export async function apiSaveDraft(
  studentId: string,
  exerciseId: string,
  answerPayload: Record<string, unknown>
): Promise<boolean> {
  const remote = await tryBackendJson<{ ok: boolean }>('/api/student/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, exerciseId, answerPayload }),
  });
  if (remote.kind === 'ok') return true;
  if (remote.kind === 'api_error') return false;

  const store = loadLocalStore();
  const student = store.students[studentId];
  if (!student) return false;
  student.drafts[exerciseId] = answerPayload;
  student.lastActiveAt = new Date().toISOString();
  saveLocalStore(store);
  return true;
}

export interface SubmitExerciseResult {
  feedback: EvaluationFeedback;
  submission: StudentSubmission;
  student: StudentProfile;
}

export async function apiSubmitExercise(params: {
  studentId: string;
  exerciseId: string;
  answerPayload: Record<string, unknown>;
  pythonOutcome?: PythonExecutionOutcome;
  hintsRequested: number;
}): Promise<{ ok: true; data: SubmitExerciseResult } | { ok: false; error: string }> {
  const remote = await tryBackendJson<SubmitExerciseResult>('/api/student/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (remote.kind === 'ok') return { ok: true, data: remote.data };
  if (remote.kind === 'api_error') return { ok: false, error: remote.error };

  const store = loadLocalStore();
  const student = store.students[params.studentId];
  if (!student) return { ok: false, error: 'Élève introuvable.' };

  const exercise = getMergedLocalExercises(store).find((ex) => ex.id === params.exerciseId);
  if (!exercise) return { ok: false, error: 'Exercice introuvable.' };

  const safePayload = params.answerPayload || {};
  let feedback = evaluateExerciseAttempt(exercise, safePayload, params.pythonOutcome);

  if (exercise.kind === 'short_answer') {
    const subValues = (safePayload.subQuestions || {}) as Record<string, string>;
    const sqs = exercise.workspaceConfig.subQuestions || [];
    let hits = 0;
    const ok: string[] = [];
    const bad: string[] = [];
    for (const sq of sqs) {
      const val = (subValues[sq.id] || '').trim().toLowerCase();
      const kps = sq.keyPoints || [];
      if (val.length >= 4 && (kps.length === 0 || kps.some((kp) => val.includes(kp.toLowerCase())))) {
        hits++;
        ok.push(`Bonne réponse pour « ${sq.prompt.slice(0, 40)}... »`);
      } else {
        bad.push(`Précise ta réponse pour « ${sq.prompt.slice(0, 45)}... »`);
      }
    }
    const ratio = sqs.length > 0 ? Math.round((hits / sqs.length) * 100) : 70;
    feedback = {
      ...feedback,
      status: hits === sqs.length && sqs.length > 0 ? 'correct' : hits > 0 ? 'partial' : 'incorrect',
      scorePercent: ratio,
      whatIsCorrect: ok,
      whatNeedsImprovement: bad,
      xpAwarded: hits === sqs.length ? 45 : hits > 0 ? 15 : 0,
    };
  }

  const now = new Date().toISOString();
  const subKey = `${student.id}__${exercise.id}`;
  const existingSub = store.submissions[subKey];
  const attempt: AttemptRecord = {
    id: `att-${Date.now().toString(36)}`,
    timestamp: now,
    answerPayload: safePayload,
    feedback,
  };

  const prevXp = existingSub?.latestFeedback?.xpAwarded || 0;
  const xpDelta = Math.max(0, feedback.xpAwarded - prevXp);
  student.xp += xpDelta;
  student.drafts[exercise.id] = safePayload;

  if (feedback.status === 'correct' && !student.completedExercises.includes(exercise.id)) {
    student.completedExercises.push(exercise.id);
  }

  const submission: StudentSubmission = existingSub
    ? {
        ...existingSub,
        status: feedback.status,
        latestAnswer: safePayload,
        latestFeedback: feedback,
        attempts: [...existingSub.attempts, attempt],
        hintsRequested: Math.max(existingSub.hintsRequested, params.hintsRequested || 0),
        updatedAt: now,
      }
    : {
        id: subKey,
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        sessionId: student.sessionId,
        exerciseId: exercise.id,
        exerciseTitle: `${exercise.numberLabel} — ${exercise.title}`,
        chapterId: exercise.chapterId,
        status: feedback.status,
        latestAnswer: safePayload,
        latestFeedback: feedback,
        attempts: [attempt],
        hintsRequested: params.hintsRequested || 0,
        createdAt: now,
        updatedAt: now,
      };

  store.submissions[subKey] = submission;

  const studentSubs = Object.values(store.submissions).filter((s) => s.studentId === student.id);
  const prevBadges = new Set(student.unlockedBadges);
  const nextBadges = computeNewBadges({
    completedExercises: student.completedExercises,
    completedLessons: student.completedLessons,
    submissions: studentSubs,
    currentBadges: student.unlockedBadges,
  });
  for (const bId of nextBadges) {
    if (!prevBadges.has(bId)) {
      const def = BADGE_DEFINITIONS.find((b) => b.id === bId);
      if (def) student.xp += def.xpBonus;
    }
  }
  student.unlockedBadges = nextBadges;
  student.lastActiveAt = now;
  saveLocalStore(store);

  return { ok: true, data: { feedback, submission, student } };
}

export async function apiRequestAiTutorHint(params: {
  studentId: string;
  exerciseId: string;
  level: 1 | 2 | 3 | 4;
  question?: string;
  currentAttempt: Record<string, unknown>;
  previousHints: string[];
}): Promise<{ ok: true; hint: HintRecord } | { ok: false; error: string }> {
  const remote = await tryBackendJson<{ hint: HintRecord }>('/api/ai/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (remote.kind === 'ok') return { ok: true, hint: remote.data.hint };
  if (remote.kind === 'api_error') return { ok: false, error: remote.error };

  const store = loadLocalStore();
  if (!store.tutorConfig.aiEnabled) {
    return { ok: false, error: 'Le Tuteur IA est actuellement désactivé par ton enseignante.' };
  }

  const exercise = getMergedLocalExercises(store).find((ex) => ex.id === params.exerciseId);
  if (!exercise) return { ok: false, error: 'Exercice introuvable.' };

  const lvl = Math.min(Math.max(params.level, 1), store.tutorConfig.maxHintLevel) as 1 | 2 | 3 | 4;
  const baseHint =
    lvl === 1
      ? exercise.presetHints.level1
      : lvl === 2
      ? exercise.presetHints.level2
      : lvl === 3
      ? exercise.presetHints.level3
      : exercise.presetHints.level4;

  const algoTxt = typeof params.currentAttempt?.algo === 'string' ? params.currentAttempt.algo : '';
  const pyTxt = typeof params.currentAttempt?.python === 'string' ? params.currentAttempt.python : '';
  let contextualAddendum = '';

  if (lvl === 4 && algoTxt.trim()) {
    const analysis = analyzeAlgorithmCode(algoTxt, exercise.algorithmCriteria);
    if (analysis.issues.length > 0) {
      contextualAddendum = `\n\nObservation sur ton algorithme : ${analysis.issues[0]} ${analysis.hint}`;
    } else if (analysis.strengths.length > 0) {
      contextualAddendum = `\n\nObservation sur ton algorithme : ${analysis.strengths[0]} Vérifie maintenant chaque cas particulier avec un exemple concret.`;
    }
  } else if (params.question?.trim()) {
    contextualAddendum = `\n\nPour répondre à ta question (« ${params.question.trim()} ») : relis « ${exercise.conceptToReview} » puis vérifie les entrées et sorties attendues étape par étape.`;
  } else if (lvl === 4 && pyTxt.trim() && !pyTxt.includes('print')) {
    contextualAddendum = `\n\nObservation Python : pense à afficher le résultat attendu avec \`print(...)\` pour tester ton programme sur un cas concret.`;
  }

  const hint: HintRecord = {
    id: `${params.studentId}__${Date.now().toString(36)}`,
    exerciseId: exercise.id,
    level: lvl,
    question: params.question?.trim() || undefined,
    hintText: `${baseHint}${contextualAddendum}`,
    timestamp: new Date().toISOString(),
  };

  store.hints.push(hint);
  saveLocalStore(store);
  return { ok: true, hint };
}

// ---------- Teacher Portal APIs with Local/Firestore Fallback ----------

export interface TeacherOverviewData {
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

function buildLocalTeacherOverview(store: LocalStore): TeacherOverviewData {
  const students = Object.values(store.students).sort((a, b) =>
    b.lastActiveAt.localeCompare(a.lastActiveAt)
  );
  const submissions = Object.values(store.submissions).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  const exercises = getMergedLocalExercises(store);

  const totalAttempts = submissions.reduce((sum, s) => sum + s.attempts.length, 0);
  const correctSubs = submissions.filter((s) => s.status === 'correct').length;
  const successRate =
    submissions.length > 0 ? Math.round((correctSubs / submissions.length) * 100) : 0;

  const exerciseAnalytics = exercises
    .map((ex) => {
      const exSubs = submissions.filter((s) => s.exerciseId === ex.id);
      const solved = exSubs.filter((s) => s.status === 'correct').length;
      const attempts = exSubs.reduce((sum, s) => sum + s.attempts.length, 0);
      const hintsTotal = exSubs.reduce((sum, s) => sum + s.hintsRequested, 0);
      const failureRate =
        exSubs.length > 0 ? Math.round(((exSubs.length - solved) / exSubs.length) * 100) : 0;
      const errCounts = new Map<string, number>();
      for (const s of exSubs) {
        for (const msg of s.latestFeedback?.whatNeedsImprovement || []) {
          errCounts.set(msg, (errCounts.get(msg) || 0) + 1);
        }
      }
      const topErrors = Array.from(errCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([message, count]) => ({ message, count }));
      return {
        exerciseId: ex.id,
        title: `${ex.numberLabel} — ${ex.title}`,
        chapterId: ex.chapterId,
        submissionsCount: exSubs.length,
        attemptsCount: attempts,
        solvedCount: solved,
        failureRate,
        hintsTotal,
        topErrors,
      };
    })
    .filter((a) => a.submissionsCount > 0)
    .sort((a, b) => b.failureRate - a.failureRate || b.attemptsCount - a.attemptsCount);

  const studentsAtRisk = students
    .map((st) => {
      const stSubs = submissions.filter((s) => s.studentId === st.id);
      const failedOrPartial = stSubs.filter(
        (s) => s.status === 'incorrect' || s.status === 'partial'
      ).length;
      const hintsUsed = stSubs.reduce((sum, s) => sum + s.hintsRequested, 0);
      return {
        studentId: st.id,
        name: st.name,
        sessionCode: st.sessionCode,
        completedCount: st.completedExercises.length,
        failedOrPartial,
        hintsUsed,
        xp: st.xp,
        lastActiveAt: st.lastActiveAt,
      };
    })
    .filter((r) => r.failedOrPartial >= 1 || r.hintsUsed >= 2)
    .sort((a, b) => b.failedOrPartial - a.failedOrPartial);

  const flaggedExercises = exercises.filter((ex) => ex.needsTeacherReview);

  return {
    kpis: {
      totalClasses: store.classes.length,
      activeSessions: store.sessions.filter((s) => s.active).length,
      totalStudents: students.length,
      totalSubmissions: submissions.length,
      totalAttempts,
      successRate,
      flaggedExercisesCount: flaggedExercises.length,
    },
    classes: store.classes,
    sessions: store.sessions,
    students,
    submissions,
    exerciseAnalytics,
    studentsAtRisk,
    flaggedExercises,
    tutorConfig: store.tutorConfig,
    exercises,
  };
}

export async function apiTeacherOverview(): Promise<
  { ok: true; data: TeacherOverviewData } | { ok: false; error: string }
> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson<TeacherOverviewData>('/api/teacher/overview', { headers });
    if (remote.kind === 'ok') return { ok: true, data: remote.data };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Authentification requise.',
    };
  }

  const store = loadLocalStore();
  return { ok: true, data: buildLocalTeacherOverview(store) };
}

export async function apiTeacherCreateClass(
  name: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson('/api/teacher/classes', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  const cls: ClassRoom = {
    id: `cls-${Date.now().toString(36)}`,
    name: name.trim(),
    level: '3ème Année Sciences Expérimentales',
    schoolYear: '2025-2026',
    createdAt: new Date().toISOString(),
  };
  store.classes.push(cls);
  saveLocalStore(store);
  if (auth.currentUser?.uid) {
    syncTeacherClassesToFirestore(auth.currentUser.uid, store.classes, store.sessions).catch(
      () => {}
    );
  }
  return { ok: true };
}

export async function apiTeacherCreateSession(params: {
  classId: string;
  title: string;
  code?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson('/api/teacher/sessions', {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  const rawCode = (params.code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const code =
    rawCode.length >= 4
      ? rawCode
      : `ALG${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const sess: Session = {
    id: `sess-${Date.now().toString(36)}`,
    classId: params.classId || store.classes[0]?.id || 'cls-3sc-a',
    title: params.title.trim(),
    code,
    active: true,
    createdAt: new Date().toISOString(),
  };
  store.sessions.push(sess);
  saveLocalStore(store);
  if (auth.currentUser?.uid) {
    syncTeacherClassesToFirestore(auth.currentUser.uid, store.classes, store.sessions).catch(
      () => {}
    );
  }
  return { ok: true };
}

export async function apiTeacherToggleSession(
  sess: Session
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson(`/api/teacher/sessions/${sess.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ active: !sess.active }),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  const target = store.sessions.find((s) => s.id === sess.id);
  if (target) {
    target.active = !target.active;
    saveLocalStore(store);
  }
  return { ok: true };
}

export async function apiTeacherOverrideSubmission(
  submissionId: string,
  payload: {
    status: StudentSubmission['status'];
    scorePercent: number;
    teacherOverrideNote: string;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson(`/api/teacher/submissions/${submissionId}/override`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  const sub = store.submissions[submissionId];
  if (!sub) return { ok: false, error: 'Soumission introuvable.' };
  sub.status = payload.status;
  sub.latestFeedback = {
    ...sub.latestFeedback,
    status: payload.status,
    scorePercent: payload.scorePercent,
    teacherOverrideNote: payload.teacherOverrideNote,
  };
  sub.updatedAt = new Date().toISOString();
  const st = store.students[sub.studentId];
  if (st && payload.status === 'correct' && !st.completedExercises.includes(sub.exerciseId)) {
    st.completedExercises.push(sub.exerciseId);
    st.xp += 30;
  }
  saveLocalStore(store);
  return { ok: true };
}

export async function apiTeacherUpdateExercise(
  exerciseId: string,
  patch: Partial<Exercise>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson(`/api/teacher/exercises/${exerciseId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(patch),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  store.exerciseOverrides[exerciseId] = {
    ...(store.exerciseOverrides[exerciseId] || {}),
    ...patch,
  };
  saveLocalStore(store);
  return { ok: true };
}

export async function apiTeacherCreateExercise(payload: {
  title: string;
  chapterId: string;
  originalStatement: string;
  understandWork: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson('/api/teacher/exercises', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  const newEx: Exercise = {
    id: `ex-custom-${Date.now().toString(36)}`,
    chapterId: payload.chapterId,
    numberLabel: 'Exercice ajouté',
    title: payload.title.trim(),
    category: 'Exercice d’application',
    sourcePage: 0,
    difficulty: 'Entraînement' as Difficulty,
    estimatedMinutes: 15,
    kind: 'algorithm',
    originalStatement: payload.originalStatement.trim(),
    understandWork: payload.understandWork.trim(),
    objectives: ['Analyser le problème et rédiger un algorithme structuré.'],
    reflectionQuestions: ['Quelles sont les entrées, le traitement et les sorties ?'],
    workspaceConfig: { starterAlgo: 'Algorithme Exercice\nDébut\n    \nFin' },
    algorithmCriteria: {
      requireBeginEnd: true,
      criteriaNotes: ['Structure Début/Fin attendue'],
    },
    presetHints: {
      level1: 'Identifie d’abord les données à lire et le résultat à afficher.',
      level2: 'Choisis la structure de contrôle adaptée à la situation.',
      level3: 'Rédige ton T.D.O. puis complète étape par étape.',
      level4: 'Vérifie ton algorithme sur un exemple numérique simple.',
    },
    conceptToReview: 'Méthodologie de résolution de problèmes',
    active: true,
  };
  store.customExercises.push(newEx);
  saveLocalStore(store);
  return { ok: true };
}

export async function apiTeacherUpdateAiConfig(
  patch: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const headers = await getTeacherHeaders();
    const remote = await tryBackendJson('/api/teacher/ai-config', {
      method: 'PATCH',
      headers,
      body: JSON.stringify(patch),
    });
    if (remote.kind === 'ok') return { ok: true };
    if (remote.kind === 'api_error') return { ok: false, error: remote.error };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur auth.' };
  }

  const store = loadLocalStore();
  if (typeof patch.approveHintId === 'string') {
    store.tutorConfig.pendingHintsToReview = store.tutorConfig.pendingHintsToReview.map((h) =>
      h.id === patch.approveHintId ? { ...h, approved: true } : h
    );
  }
  const { approveHintId: _ignored, ...rest } = patch;
  store.tutorConfig = { ...store.tutorConfig, ...rest };
  saveLocalStore(store);
  return { ok: true };
}

export async function apiTeacherExportBlob(format: 'csv' | 'json'): Promise<Blob | null> {
  try {
    const headers = await getTeacherHeaders();
    const resp = await fetch(resolveApiUrl(`/api/teacher/export?format=${format}`), { headers });
    const ct = (resp.headers.get('content-type') || '').toLowerCase();
    if (resp.ok && (ct.includes('text/csv') || ct.includes('application/json'))) {
      return await resp.blob();
    }
  } catch {
    // Fallback to local export
  }

  const store = loadLocalStore();
  if (format === 'json') {
    return new Blob([JSON.stringify(store, null, 2)], { type: 'application/json;charset=utf-8' });
  }
  const rows = [
    ['Eleve', 'CodeSeance', 'XP', 'LeconsCompletees', 'ExercicesReussis', 'Badges', 'DerniereActivite'].join(
      ','
    ),
  ];
  for (const st of Object.values(store.students)) {
    rows.push(
      [
        `"${st.name.replace(/"/g, '""')}"`,
        st.sessionCode,
        st.xp,
        st.completedLessons.length,
        st.completedExercises.length,
        `"${st.unlockedBadges.join(';')}"`,
        st.lastActiveAt,
      ].join(',')
    );
  }
  return new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
}
