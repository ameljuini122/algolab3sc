import type { BadgeDefinition, Chapter, Exercise, Lesson } from '../types/algolab';

// Bundled revision content from page 3 of the supplied cahier. The API may
// provide a larger curriculum; these records also support the offline fallback.
const chapterId = 'ch0-revision';
const lessonId = 'les-ch0-intro';

const revisionLesson: Lesson = {
  id: lessonId,
  chapterId,
  order: 1,
  title: 'Structures de données et fonctions prédéfinies',
  sourcePages: '3',
  objectives: [
    'Reconnaître les fonctions prédéfinies sur les nombres et les chaînes.',
    'Évaluer une expression avec DIV et MOD.',
  ],
  definitions: [
    { term: 'Chaîne de caractères', meaning: 'Une suite ordonnée de caractères, écrite entre guillemets.' },
    { term: 'DIV', meaning: 'Le quotient entier de la division de deux entiers.' },
    { term: 'MOD', meaning: 'Le reste de la division entière.' },
  ],
  contentSections: [
    {
      heading: 'Fonctions prédéfinies',
      body: 'Une fonction prédéfinie effectue une opération disponible dans le langage et renvoie un résultat.',
      bullets: [
        'long(ch) donne la longueur de ch ; en Python, on utilise len(ch).',
        'abs(x) donne la valeur absolue de x.',
        'ord(c) donne le code du caractère c ; chr(n) donne le caractère de code n.',
        'pos(motif, ch) recherche la position du motif dans ch ; en Python, on utilise ch.find(motif).',
      ],
    },
    {
      heading: 'Division entière',
      body: 'Pour des entiers positifs a et b, avec b non nul : a = (a DIV b) × b + (a MOD b). En Python, // calcule le quotient entier et % le reste.',
    },
  ],
  syntaxExamples: [
    { title: 'Longueur', algo: 'n ← long("Sciences")', python: 'n = len("Sciences")' },
    { title: 'Quotient et reste', algo: 'q ← 23 DIV 5\nr ← 23 MOD 5', python: 'q = 23 // 5\nr = 23 % 5' },
  ],
  comprehensionCheck: {
    prompt: 'Quelle est la valeur de 17 MOD 5 ?',
    options: ['2', '3', '5'],
    correctIndex: 0,
    explanation: '17 = 3 × 5 + 2 : le reste est donc 2.',
  },
};

const revisionDefaults = {
  chapterId,
  lessonId,
  category: 'Activité' as const,
  sourcePage: 3,
  difficulty: 'Découverte' as const,
  objectives: ['Utiliser les fonctions prédéfinies et vérifier le type du résultat.'],
  reflectionQuestions: ['Quels sont les paramètres de la fonction ?', 'Quel est le type du résultat ?'],
  presetHints: {
    level1: 'Identifie les données et l’opération demandée.',
    level2: 'Rappelle-toi le rôle de chaque fonction avant de calculer.',
    level3: 'Pour une chaîne, compte les caractères à partir de la position zéro.',
    level4: 'Teste une expression similaire avec une courte chaîne ou un petit entier, puis reprends la question.',
  },
  conceptToReview: revisionLesson.title,
  active: true,
};

const revisionExercises: Exercise[] = [
  {
    ...revisionDefaults,
    id: 'ex-p3-1',
    numberLabel: 'Exercice 1',
    title: 'Les structures de données et fonctions prédéfinies',
    kind: 'word_search',
    estimatedMinutes: 10,
    originalStatement: 'Dans cette grille, 7 fonctions prédéfinies sont cachées horizontalement. Retrouvez-les toutes.',
    understandWork: 'Lis chaque ligne et repère les noms des fonctions prédéfinies.',
    workspaceConfig: {
      grid: ['INOALÉA', 'LONGPYS', 'OJUFABS', 'EIORDUC', 'EFFACER', 'GOCFUSI', 'POSCHRM'].map((row) => [...row]),
      targetWords: ['ALÉA', 'LONG', 'ABS', 'ORD', 'EFFACER', 'POS', 'CHR'],
    },
  },
  {
    ...revisionDefaults,
    id: 'ex-p3-2',
    numberLabel: 'Exercice 2',
    title: 'Questions à choix multiples',
    kind: 'qcm',
    estimatedMinutes: 15,
    originalStatement: 'Entourer ou cocher la lettre correspondant à la bonne réponse pour chaque question.',
    understandWork: 'Évalue chaque expression et sélectionne une seule réponse.',
    workspaceConfig: {
      questions: [
        {
          id: 'q1', prompt: 'Que renvoie len("Sciences") ?',
          options: [{ label: '7', value: 'a' }, { label: '8', value: 'b' }, { label: '9', value: 'c' }, { label: 'Erreur', value: 'd' }],
          correctValue: 'b', explanation: 'La chaîne Sciences contient huit caractères.',
        },
        {
          id: 'q2', prompt: 'Pour obtenir la valeur absolue de x = -15.8, quelle fonction utilise-t-on ?',
          options: [{ label: 'abs(-15.8)', value: 'a' }, { label: 'int(-15.8)', value: 'b' }, { label: 'round(-15.8)', value: 'c' }, { label: 'sqr(-15.8)', value: 'd' }],
          correctValue: 'a', explanation: 'abs renvoie la valeur absolue : ici 15.8.',
        },
        {
          id: 'q3', prompt: "Sachant que ord('A') = 65, quelle est la valeur retournée par chr(67) ?",
          options: [{ label: "'a'", value: 'a' }, { label: "'B'", value: 'b' }, { label: "'C'", value: 'c' }, { label: '67', value: 'd' }],
          correctValue: 'c', explanation: 'Les codes 65, 66 et 67 correspondent à A, B et C.',
        },
        {
          id: 'q4', prompt: 'Quel est le résultat de 23 // 5 + 23 % 5 ?',
          options: [{ label: '4', value: 'a' }, { label: '3', value: 'b' }, { label: '7', value: 'c' }, { label: '4.6', value: 'd' }],
          correctValue: 'c', explanation: '23 // 5 vaut 4 et 23 % 5 vaut 3, donc leur somme vaut 7.',
        },
        {
          id: 'q5', prompt: 'Que renvoie pos("tech", "info_techno") ?',
          options: [{ label: '0', value: 'a' }, { label: '1', value: 'b' }, { label: '-1', value: 'c' }, { label: '5', value: 'd' }],
          correctValue: 'd', explanation: 'Le motif tech commence à la position 5, en comptant depuis zéro.',
        },
      ],
    },
  },
];

export const CURRICULUM_CHAPTERS: Chapter[] = [
  {
    id: chapterId,
    order: 0,
    title: 'Révision',
    subtitle: 'Structures de données et fonctions prédéfinies',
    sourcePages: '3',
    description: 'Réviser les fonctions prédéfinies et les expressions numériques du cahier.',
    lessons: [revisionLesson],
    exercises: revisionExercises,
  },
];

export const ALL_LESSONS: Lesson[] = CURRICULUM_CHAPTERS.flatMap((chapter) => chapter.lessons);
export const ALL_EXERCISES: Exercise[] = CURRICULUM_CHAPTERS.flatMap((chapter) => chapter.exercises);

export function findExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((exercise) => exercise.id === id);
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'premier-pas', title: 'Premier pas', description: 'Une première étape réussie.', criteria: 'Terminer une leçon ou un exercice.', xpBonus: 10 },
  { id: 'maitre-variables', title: 'Maître des variables', description: 'Les bases sont acquises.', criteria: 'Réussir trois exercices sur les données et les variables.', xpBonus: 30 },
  { id: 'expert-conditions', title: 'Expert des conditions', description: 'Choisir la bonne branche.', criteria: 'Réussir quatre exercices sur les conditions.', xpBonus: 40 },
  { id: 'explorateur-boucles', title: 'Explorateur des boucles', description: 'Maîtriser les répétitions.', criteria: 'Réussir cinq exercices de la sélection sur les boucles.', xpBonus: 50 },
  { id: 'detective-erreurs', title: 'Détective des erreurs', description: 'Corriger et progresser.', criteria: 'Réussir un exercice de débogage ou réussir après plusieurs tentatives.', xpBonus: 30 },
  { id: 'algorithmicien', title: 'Algorithmicien', description: 'Concevoir des algorithmes.', criteria: 'Réussir trois exercices avec un algorithme.', xpBonus: 50 },
  { id: 'python-starter', title: 'Python starter', description: 'Programmer en Python.', criteria: 'Réussir trois exercices avec du code Python.', xpBonus: 50 },
];
