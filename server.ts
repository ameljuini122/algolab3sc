import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  ALL_EXERCISES,
  ALL_LESSONS,
  BADGE_DEFINITIONS,
  CURRICULUM_CHAPTERS,
} from './src/data/curriculum.ts';
import {
  analyzeAlgorithmCode,
  computeNewBadges,
  evaluateExerciseAttempt,
  type PythonExecutionOutcome,
} from './src/utils/evaluators.ts';
import type {
  AttemptRecord,
  ClassRoom,
  EvaluationFeedback,
  Exercise,
  HintRecord,
  Session,
  StudentProfile,
  StudentSubmission,
  TutorConfig,
} from './src/types/algolab.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const AUTHORIZED_TEACHER_EMAIL = 'amelijuini3@gmail.com';

const firebaseConfigPath = path.resolve(__dirname, 'firebase-applet-config.json');
const firebaseConfig = fs.existsSync(firebaseConfigPath)
  ? (JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8')) as { apiKey?: string; projectId?: string })
  : {};

// ---------- Persistent JSON Store ----------
interface AlgoLabStore {
  classes: ClassRoom[];
  sessions: Session[];
  students: Record<string, StudentProfile>;
  submissions: Record<string, StudentSubmission>;
  hints: HintRecord[];
  exerciseOverrides: Record<string, Partial<Exercise>>;
  customExercises: Exercise[];
  tutorConfig: TutorConfig;
}

const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'algolab-store.json');

function createInitialStore(): AlgoLabStore {
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

function loadStore(): AlgoLabStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      const initial = createInitialStore();
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const parsed = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as Partial<AlgoLabStore>;
    const defaults = createInitialStore();
    return {
      classes: Array.isArray(parsed.classes) && parsed.classes.length > 0 ? parsed.classes : defaults.classes,
      sessions: Array.isArray(parsed.sessions) && parsed.sessions.length > 0 ? parsed.sessions : defaults.sessions,
      students: parsed.students || {},
      submissions: parsed.submissions || {},
      hints: Array.isArray(parsed.hints) ? parsed.hints : [],
      exerciseOverrides: parsed.exerciseOverrides || {},
      customExercises: Array.isArray(parsed.customExercises) ? parsed.customExercises : [],
      tutorConfig: { ...defaults.tutorConfig, ...(parsed.tutorConfig || {}) },
    };
  } catch (err) {
    console.error('Failed to load store, resetting defaults:', err);
    return createInitialStore();
  }
}

let store: AlgoLabStore = loadStore();

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist AlgoLab store:', err);
  }
}

function getMergedExercises(): Exercise[] {
  const mergedBase = ALL_EXERCISES.map((ex) => {
    const ov = store.exerciseOverrides[ex.id];
    return ov ? { ...ex, ...ov } : ex;
  });
  const mergedCustom = store.customExercises.map((ex) => {
    const ov = store.exerciseOverrides[ex.id];
    return ov ? { ...ex, ...ov } : ex;
  });
  return [...mergedBase, ...mergedCustom];
}

function getMergedChapters() {
  const mergedExercises = getMergedExercises();
  return CURRICULUM_CHAPTERS.map((ch) => ({
    ...ch,
    exercises: mergedExercises.filter((ex) => ex.chapterId === ch.id),
  }));
}

function findEffectiveExercise(exerciseId: string): Exercise | undefined {
  return getMergedExercises().find((ex) => ex.id === exerciseId);
}

// ---------- Gemini Client (Server-Side Only) ----------
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Simple rate limiter for AI endpoints
const aiRateBuckets = new Map<string, number[]>();
function checkAiRateLimit(key: string, maxRequests = 30, windowMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = (aiRateBuckets.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    aiRateBuckets.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  aiRateBuckets.set(key, timestamps);
  return true;
}

// ---------- Teacher Auth Middleware ----------
async function verifyTeacherAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    res.status(401).json({ error: 'Authentification requise pour accéder à l’espace enseignant.' });
    return;
  }

  if (!firebaseConfig.apiKey) {
    res.status(500).json({ error: 'Configuration Firebase manquante sur le serveur.' });
    return;
  }

  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );
    if (!resp.ok) {
      res.status(401).json({ error: 'Session enseignant expirée ou invalide.' });
      return;
    }
    const data = (await resp.json()) as {
      users?: { localId?: string; email?: string; emailVerified?: boolean; displayName?: string }[];
    };
    const user = data.users?.[0];
    if (
      !user ||
      !user.emailVerified ||
      user.email?.toLowerCase() !== AUTHORIZED_TEACHER_EMAIL
    ) {
      res.status(403).json({
        error: `Accès réservé à l’enseignante autorisée (${AUTHORIZED_TEACHER_EMAIL}).`,
      });
      return;
    }
    (req as Request & { teacherUser?: typeof user }).teacherUser = user;
    next();
  } catch (err) {
    console.error('Teacher auth verification error:', err);
    res.status(500).json({ error: 'Impossible de vérifier le compte Google enseignant.' });
  }
}

// ---------- Express App Setup ----------
const app = express();
app.use(express.json({ limit: '2mb' }));

// Public Curriculum & Config
app.get('/api/curriculum', (_req, res) => {
  const chapters = getMergedChapters().map((ch) => ({
    ...ch,
    exercises: ch.exercises.filter((ex) => ex.active !== false),
  }));
  res.json({
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
  });
});

// ---------- Student Endpoints ----------
app.post('/api/student/join', (req, res) => {
  const rawName = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const rawCode = typeof req.body?.code === 'string' ? req.body.code.trim().toUpperCase() : '';

  if (rawName.length < 2 || rawName.length > 40) {
    res.status(400).json({ error: 'Entre ton prénom (entre 2 et 40 caractères).' });
    return;
  }
  if (!rawCode) {
    res.status(400).json({ error: 'Entre le code de classe fourni par ton enseignante.' });
    return;
  }

  const session = store.sessions.find((s) => s.code.toUpperCase() === rawCode && s.active);
  if (!session) {
    res.status(404).json({
      error: `Le code de classe « ${rawCode} » est introuvable ou clôturé. Vérifie auprès de Mme Amel Juini.`,
    });
    return;
  }

  const normalizedName = rawName
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
    saveStore();
    const studentSubmissions = Object.values(store.submissions).filter(
      (sub) => sub.studentId === existing.id
    );
    const cls = store.classes.find((c) => c.id === existing.classId);
    res.json({
      student: existing,
      classRoom: cls,
      session,
      submissions: studentSubmissions,
      reconnected: true,
    });
    return;
  }

  const studentId = `stu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const profile: StudentProfile = {
    id: studentId,
    name: rawName,
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
  saveStore();

  const cls = store.classes.find((c) => c.id === session.classId);
  res.status(201).json({
    student: profile,
    classRoom: cls,
    session,
    submissions: [],
    reconnected: false,
  });
});

app.get('/api/student/state', (req, res) => {
  const studentId = typeof req.query.studentId === 'string' ? req.query.studentId : '';
  const student = store.students[studentId];
  if (!student) {
    res.status(404).json({ error: 'Profil élève introuvable.' });
    return;
  }
  const session = store.sessions.find((s) => s.id === student.sessionId);
  const cls = store.classes.find((c) => c.id === student.classId);
  const submissions = Object.values(store.submissions).filter((sub) => sub.studentId === student.id);
  const hints = store.hints.filter((h) => h.id.startsWith(`${student.id}__`));
  res.json({ student, session, classRoom: cls, submissions, hints });
});

app.post('/api/student/lesson-progress', (req, res) => {
  const { studentId, lessonId, completed } = req.body || {};
  const student = store.students[String(studentId || '')];
  if (!student) {
    res.status(404).json({ error: 'Élève introuvable.' });
    return;
  }
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) {
    res.status(404).json({ error: 'Leçon introuvable.' });
    return;
  }

  const already = student.completedLessons.includes(lesson.id);
  if (completed && !already) {
    student.completedLessons.push(lesson.id);
    student.xp += 25;
  } else if (completed === false && already) {
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
  saveStore();

  res.json({ student });
});

app.post('/api/student/draft', (req, res) => {
  const { studentId, exerciseId, answerPayload } = req.body || {};
  const student = store.students[String(studentId || '')];
  if (!student) {
    res.status(404).json({ error: 'Élève introuvable.' });
    return;
  }
  if (!exerciseId || typeof answerPayload !== 'object') {
    res.status(400).json({ error: 'Données de brouillon invalides.' });
    return;
  }
  student.drafts[String(exerciseId)] = answerPayload as Record<string, unknown>;
  student.lastActiveAt = new Date().toISOString();
  saveStore();
  res.json({ ok: true, savedAt: student.lastActiveAt });
});

app.post('/api/student/submit', async (req, res) => {
  const { studentId, exerciseId, answerPayload, pythonOutcome, hintsRequested } = req.body || {};
  const student = store.students[String(studentId || '')];
  if (!student) {
    res.status(404).json({ error: 'Élève introuvable.' });
    return;
  }
  const exercise = findEffectiveExercise(String(exerciseId || ''));
  if (!exercise) {
    res.status(404).json({ error: 'Exercice introuvable.' });
    return;
  }

  const safePayload =
    answerPayload && typeof answerPayload === 'object'
      ? (answerPayload as Record<string, unknown>)
      : {};

  // Deterministic evaluation first
  let feedback: EvaluationFeedback = evaluateExerciseAttempt(
    exercise,
    safePayload,
    pythonOutcome as PythonExecutionOutcome | undefined
  );

  // Semantic Gemini enrichment for open/algorithm/python/short_answer exercises when enabled
  const openKinds = ['algorithm', 'python', 'algorithm_and_python', 'short_answer', 'modular_design'];
  if (
    store.tutorConfig.aiEnabled &&
    store.tutorConfig.aiFeedbackEnabled &&
    openKinds.includes(exercise.kind) &&
    checkAiRateLimit(`eval:${student.id}`)
  ) {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const algoTxt = typeof safePayload.algo === 'string' ? safePayload.algo : '';
        const pyTxt = typeof safePayload.python === 'string' ? safePayload.python : '';
        const subQ =
          safePayload.subQuestions && typeof safePayload.subQuestions === 'object'
            ? JSON.stringify(safePayload.subQuestions)
            : '';

        if (algoTxt.trim() || pyTxt.trim() || subQ) {
          const prompt = `Tu es un tuteur pédagogique bienveillant d'informatique pour des élèves tunisiens de 3ème année Sciences Expérimentales.
Évalue la tentative de l'élève SANS JAMAIS donner la solution complète ni écrire le programme/algorithme corrigé complet.
Instructions de l'enseignante (Mme Amel Juini) : ${store.tutorConfig.customTeacherInstructions}

Exercice (${exercise.numberLabel} - ${exercise.title}, page ${exercise.sourcePage}) :
Énoncé : ${exercise.originalStatement}
Travail demandé : ${exercise.understandWork}
Critères attendus : ${(exercise.algorithmCriteria?.criteriaNotes || exercise.objectives).join(' ; ')}

Réponse de l'élève :
${algoTxt ? `--- Algorithme ---\n${algoTxt}\n` : ''}
${pyTxt ? `--- Python ---\n${pyTxt}\n` : ''}
${subQ ? `--- Réponses écrites ---\n${subQ}\n` : ''}
${pythonOutcome ? `--- Résultat exécution tests Python ---\n${JSON.stringify(pythonOutcome)}\n` : ''}
Analyse statique préalable : ${JSON.stringify({ whatIsCorrect: feedback.whatIsCorrect, whatNeedsImprovement: feedback.whatNeedsImprovement })}`;

          const aiRes = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: prompt,
            config: {
              systemInstruction:
                'Réponds uniquement en français pédagogique encourageant, au format JSON strict. Interdiction absolue de donner la solution finale prête à copier.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  whatIsCorrect: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  whatNeedsImprovement: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  errorExplanation: { type: Type.STRING },
                  progressiveHint: { type: Type.STRING },
                  recommendedLessonTitle: { type: Type.STRING },
                  suggestedStatus: { type: Type.STRING },
                },
              },
            },
          });

          const parsed = JSON.parse(aiRes.text || '{}') as {
            whatIsCorrect?: string[];
            whatNeedsImprovement?: string[];
            errorExplanation?: string;
            progressiveHint?: string;
            recommendedLessonTitle?: string;
            suggestedStatus?: string;
          };

          // Respect deterministic Python test failure if tests ran and failed
          const pyFailedTests =
            pythonOutcome &&
            pythonOutcome.totalCount > 0 &&
            pythonOutcome.passedCount < pythonOutcome.totalCount;

          const statusMap: Record<string, EvaluationFeedback['status']> = {
            correct: pyFailedTests ? 'partial' : 'correct',
            partial: 'partial',
            incorrect: 'incorrect',
          };
          const mergedStatus =
            exercise.kind === 'short_answer' || exercise.kind === 'algorithm' || exercise.kind === 'modular_design'
              ? statusMap[parsed.suggestedStatus || ''] || feedback.status
              : feedback.status;

          feedback = {
            ...feedback,
            status: mergedStatus,
            scorePercent:
              mergedStatus === 'correct'
                ? 100
                : mergedStatus === 'partial'
                ? Math.max(feedback.scorePercent, 55)
                : feedback.scorePercent,
            whatIsCorrect:
              Array.isArray(parsed.whatIsCorrect) && parsed.whatIsCorrect.length > 0
                ? parsed.whatIsCorrect
                : feedback.whatIsCorrect,
            whatNeedsImprovement:
              mergedStatus === 'correct' && !pyFailedTests
                ? []
                : Array.isArray(parsed.whatNeedsImprovement) && parsed.whatNeedsImprovement.length > 0
                ? parsed.whatNeedsImprovement
                : feedback.whatNeedsImprovement,
            errorExplanation: parsed.errorExplanation || feedback.errorExplanation,
            progressiveHint: parsed.progressiveHint || feedback.progressiveHint,
            recommendedLessonTitle:
              parsed.recommendedLessonTitle || feedback.recommendedLessonTitle,
            aiGenerated: true,
          };
        }
      } catch (err) {
        console.warn('Gemini semantic evaluation fallback triggered:', err);
      }
    } else if (exercise.kind === 'short_answer') {
      // Heuristic non-AI evaluation for short_answer when no Gemini key is set
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
          ok.push(`Bonne piste pour « ${sq.prompt.slice(0, 40)}... »`);
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
  } else if (exercise.kind === 'short_answer') {
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

  if (existingSub) {
    existingSub.attempts.push(attempt);
    existingSub.latestAnswer = safePayload;
    existingSub.latestFeedback = feedback;
    existingSub.status = feedback.status;
    existingSub.hintsRequested = Math.max(
      existingSub.hintsRequested,
      Number(hintsRequested || 0)
    );
    existingSub.updatedAt = now;
  } else {
    store.submissions[subKey] = {
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
      hintsRequested: Number(hintsRequested || 0),
      createdAt: now,
      updatedAt: now,
    };
  }

  // Update XP and completed exercises (avoid double-counting XP on already solved exercise)
  const wasCompleted = student.completedExercises.includes(exercise.id);
  if (feedback.status === 'correct' && !wasCompleted) {
    student.completedExercises.push(exercise.id);
    student.xp += feedback.xpAwarded || 50;
  } else if (!wasCompleted && feedback.xpAwarded > 0 && (!existingSub || existingSub.attempts.length === 1)) {
    student.xp += feedback.xpAwarded;
  }

  // Save draft too
  student.drafts[exercise.id] = safePayload;

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
  saveStore();

  res.json({
    feedback,
    submission: store.submissions[subKey],
    student,
  });
});

// ---------- AI Tutor Endpoint ----------
app.post('/api/ai/tutor', async (req, res) => {
  const { studentId, exerciseId, level, question, currentAttempt, previousHints } = req.body || {};
  if (!store.tutorConfig.aiEnabled) {
    res.status(403).json({
      error: 'L’assistant Tuteur IA est temporairement désactivé par ton enseignante.',
    });
    return;
  }

  const exercise = findEffectiveExercise(String(exerciseId || ''));
  if (!exercise) {
    res.status(404).json({ error: 'Exercice introuvable.' });
    return;
  }

  const reqLevel = Math.min(
    Math.max(Number(level) || 1, 1),
    store.tutorConfig.maxHintLevel
  ) as 1 | 2 | 3 | 4;

  const rateKey = `tutor:${String(studentId || req.ip)}`;
  if (!checkAiRateLimit(rateKey)) {
    res.status(429).json({
      error: 'Tu demandes beaucoup d’indices en peu de temps. Relis le dernier indice et teste une idée avant de redemander.',
    });
    return;
  }

  const levelDescriptions: Record<1 | 2 | 3 | 4, string> = {
    1: 'Niveau 1 (Orientation) : Aide l’élève à identifier les données d’entrée, le résultat attendu et le but général, sans mentionner la structure de contrôle précise.',
    2: 'Niveau 2 (Raisonnement) : Guide l’élève sur le choix logique de structure (conditionnelle, boucle bornée, Tant Que/Répéter, tableau ou sous-programme) et l’ordre des étapes.',
    3: 'Niveau 3 (Guidance conceptuelle) : Donne un rappel ciblé sur la syntaxe algorithmique/Python ou la condition limite sans écrire la solution.',
    4: 'Niveau 4 (Débogage ciblé) : Analyse la tentative actuelle de l’élève et signale précisément l’erreur logique ou syntaxique à corriger par lui-même.',
  };

  const presetFallback =
    reqLevel === 1
      ? exercise.presetHints.level1
      : reqLevel === 2
      ? exercise.presetHints.level2
      : reqLevel === 3
      ? exercise.presetHints.level3
      : exercise.presetHints.level4;

  let hintText = presetFallback;
  let usedAi = false;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const staticAlgoHint =
        currentAttempt && typeof currentAttempt.algo === 'string' && currentAttempt.algo.trim()
          ? analyzeAlgorithmCode(currentAttempt.algo, exercise.algorithmCriteria)
          : null;

      const prompt = `Tu es le Tuteur IA bienveillant de « AlgoLab — Informatique 3SC » (programme tunisien, 3ème Sciences Expérimentales).
RÈGLE D'OR ABSOLUE : NE DONNE JAMAIS la solution complète, ni le code Python final, ni l'algorithme complet corrigé. Tu dois uniquement guider l'élève à réfléchir et à trouver par lui-même.

Directives de l'enseignante (Mme Amel Juini) : ${store.tutorConfig.customTeacherInstructions}
Niveau demandé : ${levelDescriptions[reqLevel]}

Contexte de l'exercice (${exercise.numberLabel} — ${exercise.title}, PDF page ${exercise.sourcePage}) :
Énoncé : ${exercise.originalStatement}
Travail demandé : ${exercise.understandWork}
Notions à mobiliser : ${exercise.conceptToReview}
Indice de référence niveau ${reqLevel} : ${presetFallback}

${question ? `Question posée par l'élève : « ${question} »` : 'L’élève demande un indice progressif pour débloquer sa réflexion.'}
${currentAttempt ? `Tentative actuelle de l'élève : ${JSON.stringify(currentAttempt).slice(0, 1200)}` : ''}
${staticAlgoHint && staticAlgoHint.issues.length > 0 ? `Points détectés dans l'algorithme : ${staticAlgoHint.issues.join(' | ')}` : ''}
${Array.isArray(previousHints) && previousHints.length > 0 ? `Indices déjà donnés : ${previousHints.join(' / ')}` : ''}

Formule une réponse claire en français (3 à 5 phrases maximum), encourageante, précise, et termine par une petite question de réflexion qui pousse l'élève à agir.`;

      const aiRes = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Tu es un tuteur socratique d’algorithmique et Python. Réponds en français clair. Ne fournis jamais la solution complète ni un bloc de code résolvant l’exercice.',
        },
      });
      if (aiRes.text && aiRes.text.trim().length > 10) {
        hintText = aiRes.text.trim();
        usedAi = true;
      }
    } catch (err) {
      console.warn('Gemini tutor fallback triggered:', err);
    }
  } else if (reqLevel === 4 && currentAttempt && typeof currentAttempt.algo === 'string') {
    const analysis = analyzeAlgorithmCode(currentAttempt.algo, exercise.algorithmCriteria);
    if (analysis.issues.length > 0) {
      hintText = `${analysis.issues[0]} — ${presetFallback}`;
    }
  }

  const now = new Date().toISOString();
  const studentIdStr = String(studentId || 'anon');
  const hintRecord: HintRecord = {
    id: `${studentIdStr}__${Date.now().toString(36)}`,
    exerciseId: exercise.id,
    level: reqLevel,
    question: typeof question === 'string' ? question : undefined,
    hintText,
    timestamp: now,
  };
  store.hints.push(hintRecord);

  // Track hint count on existing submission if present
  const subKey = `${studentIdStr}__${exercise.id}`;
  if (store.submissions[subKey]) {
    store.submissions[subKey].hintsRequested =
      (store.submissions[subKey].hintsRequested || 0) + 1;
  }

  if (usedAi) {
    store.tutorConfig.pendingHintsToReview = [
      {
        id: `ph-${Date.now().toString(36)}`,
        exerciseId: exercise.id,
        exerciseTitle: `${exercise.numberLabel} — ${exercise.title}`,
        level: reqLevel,
        hintText,
        approved: false,
        createdAt: now,
      },
      ...store.tutorConfig.pendingHintsToReview,
    ].slice(0, 30);
  }
  saveStore();

  res.json({
    hint: hintRecord,
    usedAi,
    maxHintLevel: store.tutorConfig.maxHintLevel,
  });
});

// ---------- Teacher Protected Endpoints ----------
app.get('/api/teacher/overview', verifyTeacherAuth, (_req, res) => {
  const studentsList = Object.values(store.students);
  const submissionsList = Object.values(store.submissions);
  const effectiveExercises = getMergedExercises();

  const totalAttempts = submissionsList.reduce((acc, s) => acc + s.attempts.length, 0);
  const solvedCount = submissionsList.filter((s) => s.status === 'correct').length;
  const successRate =
    submissionsList.length > 0
      ? Math.round((solvedCount / submissionsList.length) * 100)
      : 0;

  // Compute common errors & hardest exercises from real submissions
  const exerciseStatsMap = new Map<
    string,
    {
      exerciseId: string;
      title: string;
      chapterId: string;
      attempts: number;
      solved: number;
      partial: number;
      incorrect: number;
      hintsTotal: number;
      errorCounts: Map<string, number>;
    }
  >();

  for (const sub of submissionsList) {
    const existing = exerciseStatsMap.get(sub.exerciseId) || {
      exerciseId: sub.exerciseId,
      title: sub.exerciseTitle,
      chapterId: sub.chapterId,
      attempts: 0,
      solved: 0,
      partial: 0,
      incorrect: 0,
      hintsTotal: 0,
      errorCounts: new Map<string, number>(),
    };
    existing.attempts += sub.attempts.length;
    existing.hintsTotal += sub.hintsRequested || 0;
    if (sub.status === 'correct') existing.solved++;
    else if (sub.status === 'partial') existing.partial++;
    else existing.incorrect++;

    for (const issue of sub.latestFeedback.whatNeedsImprovement || []) {
      const shortKey = issue.slice(0, 90);
      existing.errorCounts.set(shortKey, (existing.errorCounts.get(shortKey) || 0) + 1);
    }
    exerciseStatsMap.set(sub.exerciseId, existing);
  }

  const exerciseAnalytics = Array.from(exerciseStatsMap.values()).map((st) => {
    const totalSub = st.solved + st.partial + st.incorrect;
    return {
      exerciseId: st.exerciseId,
      title: st.title,
      chapterId: st.chapterId,
      submissionsCount: totalSub,
      attemptsCount: st.attempts,
      solvedCount: st.solved,
      failureRate: totalSub > 0 ? Math.round(((st.partial + st.incorrect) / totalSub) * 100) : 0,
      hintsTotal: st.hintsTotal,
      topErrors: Array.from(st.errorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([message, count]) => ({ message, count })),
    };
  });

  // Students needing help
  const studentsAtRisk = studentsList
    .map((st) => {
      const subs = submissionsList.filter((s) => s.studentId === st.id);
      const failedOrPartial = subs.filter((s) => s.status !== 'correct').length;
      const hintsUsed = subs.reduce((a, b) => a + (b.hintsRequested || 0), 0);
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
    .filter((s) => s.failedOrPartial > 0 || s.hintsUsed >= 3)
    .sort((a, b) => b.failedOrPartial - a.failedOrPartial);

  const flaggedExercises = effectiveExercises.filter((ex) => ex.needsTeacherReview);

  res.json({
    kpis: {
      totalClasses: store.classes.length,
      activeSessions: store.sessions.filter((s) => s.active).length,
      totalStudents: studentsList.length,
      totalSubmissions: submissionsList.length,
      totalAttempts,
      successRate,
      flaggedExercisesCount: flaggedExercises.length,
    },
    classes: store.classes,
    sessions: store.sessions,
    students: studentsList,
    submissions: submissionsList,
    exerciseAnalytics,
    studentsAtRisk,
    flaggedExercises,
    tutorConfig: store.tutorConfig,
    exercises: effectiveExercises,
  });
});

app.post('/api/teacher/classes', verifyTeacherAuth, (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const level =
    typeof req.body?.level === 'string' && req.body.level.trim()
      ? req.body.level.trim()
      : '3ème Année Sciences Expérimentales';
  const schoolYear =
    typeof req.body?.schoolYear === 'string' && req.body.schoolYear.trim()
      ? req.body.schoolYear.trim()
      : '2025-2026';

  if (name.length < 2) {
    res.status(400).json({ error: 'Le nom de la classe doit contenir au moins 2 caractères.' });
    return;
  }

  const cls: ClassRoom = {
    id: `cls-${Date.now().toString(36)}`,
    name,
    level,
    schoolYear,
    createdAt: new Date().toISOString(),
  };
  store.classes.push(cls);
  saveStore();
  res.status(201).json({ classRoom: cls });
});

app.post('/api/teacher/sessions', verifyTeacherAuth, (req, res) => {
  const classId = typeof req.body?.classId === 'string' ? req.body.classId : store.classes[0]?.id;
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  let code =
    typeof req.body?.code === 'string' && req.body.code.trim()
      ? req.body.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
      : `INFO${Math.floor(100 + Math.random() * 900)}`;

  if (!classId || !store.classes.some((c) => c.id === classId)) {
    res.status(400).json({ error: 'Classe sélectionnée invalide.' });
    return;
  }
  if (title.length < 2) {
    res.status(400).json({ error: 'Le titre de la séance est requis.' });
    return;
  }
  if (store.sessions.some((s) => s.code.toUpperCase() === code)) {
    code = `${code}${Math.floor(10 + Math.random() * 89)}`;
  }

  const sess: Session = {
    id: `sess-${Date.now().toString(36)}`,
    classId,
    title,
    code,
    active: true,
    createdAt: new Date().toISOString(),
  };
  store.sessions.push(sess);
  saveStore();
  res.status(201).json({ session: sess });
});

app.patch('/api/teacher/sessions/:id', verifyTeacherAuth, (req, res) => {
  const sess = store.sessions.find((s) => s.id === req.params.id);
  if (!sess) {
    res.status(404).json({ error: 'Séance introuvable.' });
    return;
  }
  if (typeof req.body?.active === 'boolean') sess.active = req.body.active;
  if (typeof req.body?.title === 'string' && req.body.title.trim()) sess.title = req.body.title.trim();
  saveStore();
  res.json({ session: sess });
});

app.post('/api/teacher/submissions/:id/override', verifyTeacherAuth, (req, res) => {
  const sub = store.submissions[req.params.id];
  if (!sub) {
    res.status(404).json({ error: 'Soumission introuvable.' });
    return;
  }
  const { status, scorePercent, teacherOverrideNote } = req.body || {};
  if (status && ['correct', 'partial', 'incorrect', 'pending_review'].includes(status)) {
    sub.status = status;
    sub.latestFeedback.status = status;
  }
  if (typeof scorePercent === 'number') {
    sub.latestFeedback.scorePercent = Math.min(100, Math.max(0, scorePercent));
  }
  if (typeof teacherOverrideNote === 'string') {
    sub.latestFeedback.teacherOverrideNote = teacherOverrideNote.trim();
  }
  sub.updatedAt = new Date().toISOString();

  const student = store.students[sub.studentId];
  if (student) {
    if (sub.status === 'correct' && !student.completedExercises.includes(sub.exerciseId)) {
      student.completedExercises.push(sub.exerciseId);
      student.xp += 50;
    } else if (sub.status !== 'correct') {
      student.completedExercises = student.completedExercises.filter((id) => id !== sub.exerciseId);
    }
  }
  saveStore();
  res.json({ submission: sub, student });
});

app.patch('/api/teacher/exercises/:id', verifyTeacherAuth, (req, res) => {
  const ex = findEffectiveExercise(req.params.id);
  if (!ex) {
    res.status(404).json({ error: 'Exercice introuvable.' });
    return;
  }
  const allowedFields = [
    'title',
    'originalStatement',
    'understandWork',
    'difficulty',
    'active',
    'presetHints',
    'objectives',
    'reflectionQuestions',
    'needsTeacherReview',
    'reviewNote',
  ] as const;

  const patch: Partial<Exercise> = { ...(store.exerciseOverrides[ex.id] || {}) };
  for (const field of allowedFields) {
    if (req.body?.[field] !== undefined) {
      (patch as Record<string, unknown>)[field] = req.body[field];
    }
  }
  store.exerciseOverrides[ex.id] = patch;
  saveStore();
  res.json({ exercise: { ...ex, ...patch } });
});

app.post('/api/teacher/exercises', verifyTeacherAuth, (req, res) => {
  const b = req.body || {};
  if (!b.title || !b.chapterId || !b.originalStatement) {
    res.status(400).json({ error: 'Titre, chapitre et énoncé sont obligatoires.' });
    return;
  }
  const newEx: Exercise = {
    id: `ex-custom-${Date.now().toString(36)}`,
    chapterId: String(b.chapterId),
    numberLabel: String(b.numberLabel || 'Exercice personnalisé'),
    title: String(b.title).trim(),
    category: b.category || 'Exercice guidé',
    sourcePage: Number(b.sourcePage || 1),
    difficulty: b.difficulty || 'Entraînement',
    estimatedMinutes: Number(b.estimatedMinutes || 15),
    kind: b.kind || 'algorithm_and_python',
    originalStatement: String(b.originalStatement).trim(),
    understandWork:
      String(b.understandWork || '').trim() ||
      'Identifie les entrées, le traitement demandé et la sortie attendue avant de rédiger.',
    objectives: Array.isArray(b.objectives) && b.objectives.length > 0 ? b.objectives : ['Concevoir la solution étape par étape'],
    reflectionQuestions:
      Array.isArray(b.reflectionQuestions) && b.reflectionQuestions.length > 0
        ? b.reflectionQuestions
        : ['Quelles sont les variables nécessaires en entrée et en sortie ?'],
    workspaceConfig: {
      starterAlgo: 'Algorithme ExercicePersonnalise\nDébut\n  \nFin',
      starterPython: '# Écris ton programme ici\n',
    },
    algorithmCriteria: {
      requireBeginEnd: true,
      requireInput: true,
      requireOutput: true,
      criteriaNotes: ['Structure Début ... Fin et logique adaptée à l’énoncé'],
    },
    presetHints: b.presetHints || {
      level1: 'Relis l’énoncé pour repérer les données fournies par l’utilisateur.',
      level2: 'Choisis la structure de contrôle adaptée (conditionnelle ou boucle).',
      level3: 'Vérifie l’initialisation de tes variables avant tout calcul.',
      level4: 'Teste ton algorithme avec un petit exemple concret à la main.',
    },
    conceptToReview: String(b.conceptToReview || 'Méthodologie algorithmique'),
    active: true,
  };
  store.customExercises.push(newEx);
  saveStore();
  res.status(201).json({ exercise: newEx });
});

app.patch('/api/teacher/ai-config', verifyTeacherAuth, (req, res) => {
  const b = req.body || {};
  if (typeof b.aiEnabled === 'boolean') store.tutorConfig.aiEnabled = b.aiEnabled;
  if ([1, 2, 3, 4].includes(Number(b.maxHintLevel))) {
    store.tutorConfig.maxHintLevel = Number(b.maxHintLevel) as 1 | 2 | 3 | 4;
  }
  if (typeof b.hintsBeforeSubmission === 'boolean') {
    store.tutorConfig.hintsBeforeSubmission = b.hintsBeforeSubmission;
  }
  if (typeof b.aiFeedbackEnabled === 'boolean') {
    store.tutorConfig.aiFeedbackEnabled = b.aiFeedbackEnabled;
  }
  if (typeof b.allowRetry === 'boolean') {
    store.tutorConfig.allowRetry = b.allowRetry;
  }
  if (typeof b.revealSolutionAfterCompletion === 'boolean') {
    store.tutorConfig.revealSolutionAfterCompletion = b.revealSolutionAfterCompletion;
  }
  if (typeof b.customTeacherInstructions === 'string') {
    store.tutorConfig.customTeacherInstructions = b.customTeacherInstructions;
  }
  if (typeof b.approveHintId === 'string') {
    const h = store.tutorConfig.pendingHintsToReview.find((p) => p.id === b.approveHintId);
    if (h) h.approved = true;
  }
  if (typeof b.rejectHintId === 'string') {
    store.tutorConfig.pendingHintsToReview = store.tutorConfig.pendingHintsToReview.filter(
      (p) => p.id !== b.rejectHintId
    );
  }
  saveStore();
  res.json({ tutorConfig: store.tutorConfig });
});

app.get('/api/teacher/export', verifyTeacherAuth, (req, res) => {
  const format = String(req.query.format || 'csv').toLowerCase();
  const studentsList = Object.values(store.students);
  const submissionsList = Object.values(store.submissions);

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="algolab-3sc-export.json"');
    res.send(
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          classes: store.classes,
          sessions: store.sessions,
          students: studentsList,
          submissions: submissionsList,
        },
        null,
        2
      )
    );
    return;
  }

  const header = [
    'Élève',
    'Code séance',
    'XP',
    'Leçons terminées',
    'Exercices réussis',
    'Tentatives totales',
    'Indices demandés',
    'Dernière activité',
  ].join(',');
  const rows = studentsList.map((st) => {
    const subs = submissionsList.filter((s) => s.studentId === st.id);
    const totalAtt = subs.reduce((a, b) => a + b.attempts.length, 0);
    const totalHints = subs.reduce((a, b) => a + (b.hintsRequested || 0), 0);
    return [
      `"${st.name.replace(/"/g, '""')}"`,
      st.sessionCode,
      st.xp,
      st.completedLessons.length,
      st.completedExercises.length,
      totalAtt,
      totalHints,
      st.lastActiveAt,
    ].join(',');
  });
  const csv = [header, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="algolab-3sc-progression.csv"');
  res.send('\uFEFF' + csv);
});

// ---------- Vite Dev Middleware / Production Static Hosting ----------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AlgoLab 3SC server running on http://localhost:${PORT}`);
  });
}

startServer();
