export type Difficulty = 'Découverte' | 'Entraînement' | 'Application' | 'Défi';

export type ExerciseKind =
  | 'word_search'
  | 'qcm'
  | 'true_false'
  | 'fill_blanks'
  | 'expression_table'
  | 'trace_table'
  | 'code_debug'
  | 'algorithm'
  | 'python'
  | 'algorithm_and_python'
  | 'short_answer'
  | 'modular_design';

export interface SyntaxComparison {
  title: string;
  algo: string;
  python: string;
  note?: string;
}

export interface InteractiveDemoStep {
  label: string;
  highlightLine: number;
  variables: Record<string, string | number | boolean>;
  conditionEvaluated?: string;
  conditionResult?: boolean;
  output?: string;
  explanation: string;
}

export interface LessonInteractiveDemo {
  title: string;
  description: string;
  codeLines: string[];
  steps: InteractiveDemoStep[];
}

export interface ComprehensionQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  sourcePages: string;
  objectives: string[];
  definitions: { term: string; meaning: string }[];
  contentSections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
  syntaxExamples: SyntaxComparison[];
  workedExample?: {
    title: string;
    statement: string;
    algo?: string;
    python?: string;
    walkthrough: string[];
  };
  interactiveDemo?: LessonInteractiveDemo;
  comprehensionCheck: ComprehensionQuestion;
}

export interface QcmQuestion {
  id: string;
  prompt: string;
  options: { label: string; value: string }[];
  correctValue: string;
  explanation: string;
}

export interface TrueFalseItem {
  id: string;
  statement: string;
  expectedValue: 'V' | 'F';
  needsCorrectionIfFalse?: boolean;
  expectedCorrection?: string;
  explanation: string;
}

export interface BlankField {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  acceptedAnswers: string[];
}

export interface TableRowSpec {
  id: string;
  cells: {
    key: string;
    label?: string;
    prefilled?: string;
    editable?: boolean;
    acceptedAnswers?: string[];
  }[];
}

export interface PythonTestCase {
  id: string;
  label: string;
  inputs: string[];
  expectedOutputs: string[];
  description?: string;
}

export interface AlgorithmCriteria {
  requireBeginEnd?: boolean;
  requireSubprogram?: boolean;
  requireInput?: boolean;
  requireOutput?: boolean;
  requiredStructures?: ('si' | 'sinon' | 'selon' | 'pour' | 'tant_que' | 'repeter')[];
  requiredKeywords?: string[];
  forbidDirectAnswerLeak?: boolean;
  criteriaNotes: string[];
}

export interface ExerciseWorkspaceConfig {
  // Word search
  grid?: string[][];
  targetWords?: string[];
  // QCM
  questions?: QcmQuestion[];
  // True / False
  trueFalseItems?: TrueFalseItem[];
  // Fill blanks
  blanksTemplate?: string;
  blankFields?: BlankField[];
  // Table (expression_table, trace_table, code_debug)
  tableHeaders?: string[];
  tableRows?: TableRowSpec[];
  codeSnippet?: string;
  // Algorithm / Python / Short answer
  starterAlgo?: string;
  starterPython?: string;
  defaultInputs?: string[];
  subQuestions?: { id: string; prompt: string; placeholder?: string; keyPoints?: string[] }[];
}

export interface Exercise {
  id: string;
  chapterId: string;
  lessonId?: string;
  numberLabel: string;
  title: string;
  category: 'Activité' | 'Exercice guidé' | 'Exercice d’application' | 'Projet' | 'Évaluation';
  sourcePage: number;
  sourcePageNote?: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  kind: ExerciseKind;
  originalStatement: string;
  understandWork: string; // « Comprendre le travail demandé »
  objectives: string[];
  reflectionQuestions: string[];
  workspaceConfig: ExerciseWorkspaceConfig;
  algorithmCriteria?: AlgorithmCriteria;
  testCases?: PythonTestCase[];
  presetHints: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  conceptToReview: string;
  needsTeacherReview?: boolean;
  reviewNote?: string;
  active: boolean;
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  sourcePages: string;
  description: string;
  lessons: Lesson[];
  exercises: Exercise[];
}

export interface EvaluationFeedback {
  status: 'correct' | 'partial' | 'incorrect' | 'pending_review';
  scorePercent: number;
  whatIsCorrect: string[];
  whatNeedsImprovement: string[];
  errorExplanation: string;
  progressiveHint: string;
  recommendedLessonTitle: string;
  recommendedLessonId?: string;
  xpAwarded: number;
  aiGenerated?: boolean;
  teacherOverrideNote?: string;
}

export interface AttemptRecord {
  id: string;
  timestamp: string;
  answerPayload: Record<string, unknown>;
  feedback: EvaluationFeedback;
}

export interface HintRecord {
  id: string;
  exerciseId: string;
  level: 1 | 2 | 3 | 4;
  question?: string;
  hintText: string;
  timestamp: string;
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  sessionId: string;
  exerciseId: string;
  exerciseTitle: string;
  chapterId: string;
  status: 'correct' | 'partial' | 'incorrect' | 'pending_review';
  latestAnswer: Record<string, unknown>;
  latestFeedback: EvaluationFeedback;
  attempts: AttemptRecord[];
  hintsRequested: number;
  updatedAt: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  normalizedName: string;
  classId: string;
  sessionId: string;
  sessionCode: string;
  xp: number;
  streak: number;
  completedLessons: string[];
  completedExercises: string[];
  unlockedBadges: string[];
  drafts: Record<string, Record<string, unknown>>;
  lastActiveAt: string;
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  level: string;
  schoolYear: string;
  createdAt: string;
}

export interface Session {
  id: string;
  classId: string;
  title: string;
  code: string;
  active: boolean;
  createdAt: string;
}

export interface TutorConfig {
  aiEnabled: boolean;
  maxHintLevel: 1 | 2 | 3 | 4;
  hintsBeforeSubmission: boolean;
  aiFeedbackEnabled: boolean;
  allowRetry: boolean;
  revealSolutionAfterCompletion: boolean;
  customTeacherInstructions: string;
  pendingHintsToReview: {
    id: string;
    exerciseId: string;
    exerciseTitle: string;
    level: 1 | 2 | 3 | 4;
    hintText: string;
    approved: boolean;
    createdAt: string;
  }[];
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteria: string;
  xpBonus: number;
}
