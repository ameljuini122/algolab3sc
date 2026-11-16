import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeAlgorithmCode,
  computeNewBadges,
  evaluateExerciseAttempt,
  translatePythonErrorToFrench,
} from './evaluators';
import { findExerciseById } from '../data/curriculum.ts';

test('analyzeAlgorithmCode validates complete algorithm and detects missing Fin/Tant Que update', () => {
  const validAlgo = `Algorithme PairImpair
Début
  Lire(n)
  Si (n MOD 2 = 0) Alors
    Ecrire("Pair")
  Sinon
    Ecrire("Impair")
  FinSi
Fin`;
  const okRes = analyzeAlgorithmCode(validAlgo, {
    requireBeginEnd: true,
    requireInput: true,
    requireOutput: true,
    requiredStructures: ['si', 'sinon'],
    criteriaNotes: [],
  });
  assert.equal(okRes.isValid, true);
  assert.equal(okRes.issues.length, 0);

  const infiniteTantQue = `Algorithme BoucleInf
Début
  i ← 1
  Tant Que (i <= 5) Faire
    Ecrire(i)
  Fin Tant Que
Fin`;
  const infRes = analyzeAlgorithmCode(infiniteTantQue, {
    requireBeginEnd: true,
    requiredStructures: ['tant_que'],
    criteriaNotes: [],
  });
  assert.equal(infRes.isValid, false);
  assert.ok(infRes.issues.some((m) => m.includes('boucle infinie')));
});

test('analyzeAlgorithmCode catches missing Retourner in Fonction and uninitialized accumulators', () => {
  const badFunc = `Fonction Somme(n : Entier) : Entier
Début
  Pour i de 1 à n Faire
    S ← S + i
  FinPour
Fin`;
  const res = analyzeAlgorithmCode(badFunc, {
    requireSubprogram: true,
    criteriaNotes: [],
  });
  assert.equal(res.isValid, false);
  assert.ok(res.issues.some((i) => i.includes('Retourner')));
  assert.ok(res.issues.some((i) => i.includes('Initialisation manquante')));
});

test('evaluateExerciseAttempt scores QCM and word search accurately', () => {
  const qcmEx = findExerciseById('ex-p3-2');
  assert.ok(qcmEx, 'ex-p3-2 must exist');
  const questions = qcmEx.workspaceConfig.questions || [];
  const allRight: Record<string, string> = {};
  for (const q of questions) {
    allRight[q.id] = q.correctValue;
  }
  const feedbackOk = evaluateExerciseAttempt(qcmEx, { answers: allRight });
  assert.equal(feedbackOk.status, 'correct');
  assert.equal(feedbackOk.scorePercent, 100);

  const partial = { ...allRight, [questions[0].id]: 'wrong_val' };
  const feedbackPartial = evaluateExerciseAttempt(qcmEx, { answers: partial });
  assert.equal(feedbackPartial.status, 'partial');
});

test('translatePythonErrorToFrench translates common errors clearly in French', () => {
  assert.match(translatePythonErrorToFrench('ZeroDivisionError: division by zero (line 4)'), /Division par zéro/);
  assert.match(translatePythonErrorToFrench("NameError: name 'x' is not defined (line 2)"), /inconnue/);
  assert.match(translatePythonErrorToFrench('IndentationError: unexpected indent (line 5)'), /indentation/);
  assert.match(translatePythonErrorToFrench('SyntaxError: invalid syntax (line 3)'), /syntaxe/);
});

test('computeNewBadges unlocks Premier pas and Algorithmicien when criteria are met', () => {
  const badges = computeNewBadges({
    completedExercises: ['ex-p15-1', 'ex-p15-2', 'ex-p15-3'],
    completedLessons: ['les-ch0-intro'],
    submissions: [
      {
        id: 's1',
        studentId: 'st1',
        studentName: 'Yassine',
        classId: 'c1',
        sessionId: 'sess1',
        exerciseId: 'ex-p15-1',
        exerciseTitle: 'Ex 1',
        chapterId: 'ch2-conditionnelles',
        status: 'correct',
        latestAnswer: { algo: 'Algorithme A\nDébut\nLire(x)\nEcrire(x)\nFin' },
        latestFeedback: {
          status: 'correct',
          scorePercent: 100,
          whatIsCorrect: [],
          whatNeedsImprovement: [],
          errorExplanation: '',
          progressiveHint: '',
          recommendedLessonTitle: 'Test',
          xpAwarded: 50,
        },
        attempts: [],
        hintsRequested: 0,
        updatedAt: '',
        createdAt: '',
      },
      {
        id: 's2',
        studentId: 'st1',
        studentName: 'Yassine',
        classId: 'c1',
        sessionId: 'sess1',
        exerciseId: 'ex-p15-2',
        exerciseTitle: 'Ex 2',
        chapterId: 'ch2-conditionnelles',
        status: 'correct',
        latestAnswer: { algo: 'Algorithme B\nDébut\nLire(x)\nEcrire(x)\nFin' },
        latestFeedback: {
          status: 'correct',
          scorePercent: 100,
          whatIsCorrect: [],
          whatNeedsImprovement: [],
          errorExplanation: '',
          progressiveHint: '',
          recommendedLessonTitle: 'Test',
          xpAwarded: 50,
        },
        attempts: [],
        hintsRequested: 0,
        updatedAt: '',
        createdAt: '',
      },
      {
        id: 's3',
        studentId: 'st1',
        studentName: 'Yassine',
        classId: 'c1',
        sessionId: 'sess1',
        exerciseId: 'ex-p15-3',
        exerciseTitle: 'Ex 3',
        chapterId: 'ch2-conditionnelles',
        status: 'correct',
        latestAnswer: { algo: 'Algorithme C\nDébut\nLire(x)\nEcrire(x)\nFin' },
        latestFeedback: {
          status: 'correct',
          scorePercent: 100,
          whatIsCorrect: [],
          whatNeedsImprovement: [],
          errorExplanation: '',
          progressiveHint: '',
          recommendedLessonTitle: 'Test',
          xpAwarded: 50,
        },
        attempts: [],
        hintsRequested: 0,
        updatedAt: '',
        createdAt: '',
      },
    ],
    currentBadges: [],
  });
  assert.ok(badges.includes('premier-pas'));
  assert.ok(badges.includes('algorithmicien'));
});
