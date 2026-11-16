import type {
  AlgorithmCriteria,
  EvaluationFeedback,
  Exercise,
  StudentSubmission,
} from '../types/algolab';

function normalizeToken(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function normalizeCodeExpr(val: string): string {
  return val
    .trim()
    .replace(/\s+/g, '')
    .replace(/['"]/g, '"')
    .replace(/←/g, '=')
    .toLowerCase();
}

export interface AlgorithmAnalysisResult {
  isValid: boolean;
  score: number;
  strengths: string[];
  issues: string[];
  hint: string;
}

export function analyzeAlgorithmCode(
  code: string,
  criteria?: AlgorithmCriteria
): AlgorithmAnalysisResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      isValid: false,
      score: 0,
      strengths: [],
      issues: ['Ton algorithme est encore vide.'],
      hint: 'Commence par écrire le squelette : Algorithme Nom / Début / ... / Fin.',
    };
  }

  const lines = trimmed.split('\n').map((l) => l.trim());
  const lowerFull = trimmed.toLowerCase();
  const normalizedFull = normalizeToken(trimmed);
  const strengths: string[] = [];
  const issues: string[] = [];

  const hasDebut = /\bd[ée]but\b/i.test(trimmed);
  const hasFin = /\bfin\b/i.test(trimmed);

  if (criteria?.requireBeginEnd) {
    if (hasDebut && hasFin) {
      strengths.push('La structure générale Début ... Fin est présente.');
    } else {
      if (!hasDebut) issues.push('Il manque le mot-clé « Début » pour ouvrir le bloc d’instructions.');
      if (!hasFin) issues.push('Il manque le mot-clé « Fin » pour fermer l’algorithme.');
    }
  }

  if (criteria?.requireSubprogram) {
    const hasSub = /\b(fonction|proc[ée]dure)\b/i.test(trimmed);
    if (hasSub) {
      strengths.push('Déclaration de sous-programme (Fonction ou Procédure) détectée.');
    } else {
      issues.push('Cet exercice attend une décomposition en sous-programme (Fonction ou Procédure).');
    }
    if (/\bfonction\b/i.test(trimmed) && !/\bretourner\b/i.test(trimmed)) {
      issues.push('Une Fonction doit obligatoirement contenir une instruction « Retourner ... ».');
    }
  }

  if (criteria?.requireInput) {
    if (/\blire\s*\(/i.test(trimmed) || /\bsaisi/i.test(normalizedFull)) {
      strengths.push('La saisie des données d’entrée (Lire) est bien prévue.');
    } else {
      issues.push('Aucune instruction de saisie « Lire(...) » n’a été détectée.');
    }
  }

  if (criteria?.requireOutput) {
    if (/\b(ecrire|[ée]crire|afficher|retourner)\b/i.test(trimmed)) {
      strengths.push('L’affichage ou le renvoi du résultat est bien présent.');
    } else {
      issues.push('Pense à afficher le résultat attendu avec « Ecrire(...) ».');
    }
  }

  // Check matching Si / FinSi
  const siCount = (lowerFull.match(/\bsi\b/g) || []).length - (lowerFull.match(/\bfinsi\b/g) || []).length - (lowerFull.match(/\bsinon\s+si\b/g) || []).length;
  const finSiCount = (lowerFull.match(/\bfin\s*si\b/g) || []).length;
  if (siCount > 0 && finSiCount === 0) {
    issues.push('Une structure « Si ... Alors » n’est pas fermée par « FinSi ».');
  }

  // Check required structures
  if (criteria?.requiredStructures) {
    for (const st of criteria.requiredStructures) {
      if (st === 'si' && !/\bsi\b/i.test(trimmed)) {
        issues.push('Une structure conditionnelle « Si ... Alors » est attendue pour prendre une décision.');
      }
      if (st === 'sinon' && !/\bsinon\b/i.test(trimmed)) {
        issues.push('Pense à utiliser la branche « Sinon » pour traiter le cas alternatif.');
      }
      if (st === 'selon' && !/\bselon\b/i.test(trimmed)) {
        issues.push('Une structure à choix multiple « Selon ... Fin_Selon » est recommandée ici.');
      }
      if (st === 'pour' && !/\bpour\b/i.test(trimmed)) {
        issues.push('Une boucle bornée « Pour ... de ... à ... Faire » est nécessaire pour parcourir les éléments.');
      }
      if (st === 'tant_que' && !/\btant\s+que\b/i.test(trimmed)) {
        issues.push('Une boucle « Tant Que (...) Faire » est adaptée lorsque la condition doit être testée avant d’entrer.');
      }
      if (st === 'repeter' && !/\br[ée]p[ée]ter\b/i.test(trimmed)) {
        issues.push('Une boucle « Répéter ... Jusqu’à (...) » est adaptée lorsqu’on exécute au moins une fois.');
      }
    }
  }

  // Infinite loop risk detection for Tant Que / Répéter
  const tantQueMatch = trimmed.match(/tant\s+que\s*\(([^)]+)\)\s*faire([\s\S]*?)fin\s*tant\s*que/i);
  if (tantQueMatch) {
    const condVars = (tantQueMatch[1].match(/\b[a-zA-Z_]\w*\b/g) || []).filter(
      (w) => !['et', 'ou', 'non', 'mod', 'div', 'vrai', 'faux'].includes(w.toLowerCase())
    );
    const body = tantQueMatch[2];
    const anyUpdated = condVars.some((v) =>
      new RegExp(`\\b${v}\\b\\s*(←|=)|lire\\s*\\(\\s*${v}\\s*\\)`, 'i').test(body)
    );
    if (condVars.length > 0 && !anyUpdated) {
      issues.push(
        `Risque de boucle infinie : aucune des variables de la condition (${condVars.join(', ')}) ne semble mise à jour dans le bloc Tant Que.`
      );
    } else if (condVars.length > 0) {
      strengths.push('Les variables de la condition Tant Que sont bien mises à jour dans la boucle.');
    }
  }

  // Uninitialized accumulator detection (e.g. S ← S + ... without prior S ← ...)
  for (let idx = 0; idx < lines.length; idx++) {
    const m = lines[idx].match(/^([a-zA-Z_]\w*)\s*(?:←|=)\s*([a-zA-Z_]\w*)\s*[+*]/);
    if (m && m[1].toLowerCase() === m[2].toLowerCase()) {
      const varName = m[1];
      const priorText = lines.slice(0, idx).join('\n');
      const initialized = new RegExp(
        `\\b${varName}\\b\\s*(←|=)|lire\\s*\\([^)]*\\b${varName}\\b|\\(${varName}\\s*:`,
        'i'
      ).test(priorText);
      if (!initialized) {
        issues.push(
          `Initialisation manquante : la variable « ${varName} » est utilisée dans « ${lines[idx]} » avant d’avoir reçu une valeur initiale.`
        );
      }
    }
  }

  // Meaningful instructions beyond skeleton
  const meaningfulLines = lines.filter(
    (l) =>
      l.length > 0 &&
      !l.startsWith('//') &&
      !/^(algorithme|d[ée]but|fin|fin\s*si|fin\s*pour|fin\s*tant\s*que)$/i.test(l)
  );
  if (meaningfulLines.length < 2) {
    issues.push('Le corps de ton algorithme est encore incomplet : ajoute les instructions de traitement.');
  }

  const totalChecks = Math.max(issues.length + strengths.length, 1);
  const score = Math.max(
    0,
    Math.min(100, Math.round(((strengths.length / totalChecks) * 100) - issues.length * 10))
  );

  return {
    isValid: issues.length === 0 && strengths.length > 0,
    score: issues.length === 0 ? Math.max(score, 85) : score,
    strengths,
    issues,
    hint:
      issues[0] ||
      'Vérifie ton algorithme avec un petit jeu d’essai à la main pour confirmer la logique.',
  };
}

export function translatePythonErrorToFrench(rawError: string): string {
  const lineMatch = rawError.match(/line\s+(\d+)/i);
  const linePart = lineMatch ? `à la ligne ${lineMatch[1]} ` : '';

  if (/IndentationError/i.test(rawError)) {
    return `Erreur d’indentation ${linePart}: vérifie que les instructions à l’intérieur d’un bloc (if, for, while, def) sont bien décalées de 4 espaces.`;
  }
  if (/SyntaxError/i.test(rawError)) {
    return `Erreur de syntaxe ${linePart}: vérifie la présence du « : » en fin de ligne (if, elif, else, for, while, def), des parenthèses et des guillemets, ou que tu as bien écrit == pour une comparaison.`;
  }
  if (/NameError.*'(\w+)'/i.test(rawError)) {
    const m = rawError.match(/NameError.*'(\w+)'/i);
    return `Variable ou fonction inconnue ${linePart}: « ${m?.[1] || ''} » n’a pas encore été définie ou initialisée avant d’être utilisée.`;
  }
  if (/TypeError/i.test(rawError)) {
    return `Erreur de type ${linePart}: tu essaies probablement d’additionner une chaîne et un nombre, ou d’utiliser une chaîne dans range(). Pense à int(), float() ou str().`;
  }
  if (/ZeroDivisionError/i.test(rawError)) {
    return `Division par zéro détectée ${linePart}: vérifie que ton dénominateur n’est jamais égal à 0.`;
  }
  if (/IndexError/i.test(rawError)) {
    return `Indice hors limites ${linePart}: l’indice dépasse la taille de la chaîne ou du tableau (rappel : le dernier indice est len - 1).`;
  }
  if (/ValueError/i.test(rawError)) {
    return `Erreur de valeur ${linePart}: la donnée fournie ne peut pas être convertie dans le type attendu (ex : int("abc")).`;
  }
  if (/Temps d’exécution dépassé|Boucle infinie/i.test(rawError)) {
    return rawError;
  }
  return `Erreur d’exécution ${linePart}: ${rawError}`;
}

export interface PythonExecutionOutcome {
  passedCount: number;
  totalCount: number;
  caseResults: { label: string; passed: boolean; output: string; error?: string }[];
}

export function evaluateExerciseAttempt(
  exercise: Exercise,
  answerPayload: Record<string, unknown>,
  pythonOutcome?: PythonExecutionOutcome
): EvaluationFeedback {
  const lessonRef = exercise.lessonId;
  const lessonTitle = exercise.conceptToReview;

  // 1. Word Search
  if (exercise.kind === 'word_search') {
    const targets = exercise.workspaceConfig.targetWords || [];
    const foundRaw = Array.isArray(answerPayload.foundWords) ? (answerPayload.foundWords as string[]) : [];
    const normalizedFound = new Set(foundRaw.map((w) => normalizeToken(w)));
    const matched = targets.filter((t) => normalizedFound.has(normalizeToken(t)));
    const missing = targets.filter((t) => !normalizedFound.has(normalizeToken(t)));

    if (matched.length === targets.length) {
      return {
        status: 'correct',
        scorePercent: 100,
        whatIsCorrect: [`Tu as retrouvé toutes les ${targets.length} fonctions prédéfinies : ${targets.join(', ')}.`],
        whatNeedsImprovement: [],
        errorExplanation: '',
        progressiveHint: 'Bravo ! Tu peux passer à l’exercice suivant.',
        recommendedLessonTitle: lessonTitle,
        recommendedLessonId: lessonRef,
        xpAwarded: 40,
      };
    }
    return {
      status: matched.length > 0 ? 'partial' : 'incorrect',
      scorePercent: Math.round((matched.length / Math.max(targets.length, 1)) * 100),
      whatIsCorrect: matched.length > 0 ? [`Fonctions déjà trouvées (${matched.length}/${targets.length}) : ${matched.join(', ')}.`] : [],
      whatNeedsImprovement: [`Il reste ${missing.length} fonction(s) horizontale(s) à repérer dans la grille.`],
      errorExplanation: 'Parcours chaque ligne de gauche à droite : certaines lignes contiennent une fonction complète, la dernière en contient deux.',
      progressiveHint: matched.length === 0 ? exercise.presetHints.level1 : exercise.presetHints.level2,
      recommendedLessonTitle: lessonTitle,
      recommendedLessonId: lessonRef,
      xpAwarded: matched.length > 0 ? 10 : 0,
    };
  }

  // 2. QCM
  if (exercise.kind === 'qcm') {
    const questions = exercise.workspaceConfig.questions || [];
    const answers = (answerPayload.answers || {}) as Record<string, string>;
    let correctCount = 0;
    const wrongDetails: string[] = [];
    const okDetails: string[] = [];

    for (const q of questions) {
      if (answers[q.id] === q.correctValue) {
        correctCount++;
        okDetails.push(`Question ${q.id.toUpperCase()} correcte.`);
      } else if (!answers[q.id]) {
        wrongDetails.push(`Question « ${q.prompt.slice(0, 45)}... » non répondue.`);
      } else {
        wrongDetails.push(`Question « ${q.prompt.slice(0, 45)}... » : vérifie le résultat attendu.`);
      }
    }

    const pct = Math.round((correctCount / Math.max(questions.length, 1)) * 100);
    if (correctCount === questions.length) {
      return {
        status: 'correct',
        scorePercent: 100,
        whatIsCorrect: [`Toutes tes ${questions.length} réponses sont exactes !`],
        whatNeedsImprovement: [],
        errorExplanation: '',
        progressiveHint: 'Excellente maîtrise des notions de ce QCM.',
        recommendedLessonTitle: lessonTitle,
        recommendedLessonId: lessonRef,
        xpAwarded: 45,
      };
    }

    return {
      status: correctCount > 0 ? 'partial' : 'incorrect',
      scorePercent: pct,
      whatIsCorrect: okDetails.slice(0, 3),
      whatNeedsImprovement: wrongDetails,
      errorExplanation: 'Revois chaque expression pas à pas (priorité des opérateurs, indices commençant à 0, ou syntaxe exacte).',
      progressiveHint: exercise.presetHints.level2,
      recommendedLessonTitle: lessonTitle,
      recommendedLessonId: lessonRef,
      xpAwarded: correctCount > 0 ? 10 : 0,
    };
  }

  // 3. True / False
  if (exercise.kind === 'true_false') {
    const items = exercise.workspaceConfig.trueFalseItems || [];
    const answers = (answerPayload.answers || {}) as Record<string, { choice?: string; correction?: string }>;
    let correctCount = 0;
    const improvements: string[] = [];
    const strengths: string[] = [];

    for (const item of items) {
      const userAns = answers[item.id];
      const choiceOk = userAns?.choice === item.expectedValue;
      let corrOk = true;
      if (item.expectedValue === 'F' && item.needsCorrectionIfFalse) {
        const normUser = normalizeCodeExpr(userAns?.correction || '');
        const normExp = normalizeCodeExpr(item.expectedCorrection || '');
        corrOk = normUser.length > 0 && (normUser === normExp || normUser.includes(normExp) || (normExp === 'aucune' && /aucun|vide|rien/i.test(normUser)));
      }
      if (choiceOk && corrOk) {
        correctCount++;
        strengths.push(`« ${item.statement.slice(0, 40)}... » validée.`);
      } else if (choiceOk && !corrOk) {
        improvements.push(`Pour « ${item.statement.slice(0, 42)}... », tu as bien repéré Faux, mais précise la correction attendue.`);
      } else {
        improvements.push(`Revois la proposition : « ${item.statement.slice(0, 52)}... »`);
      }
    }

    const pct = Math.round((correctCount / Math.max(items.length, 1)) * 100);
    if (correctCount === items.length) {
      return {
        status: 'correct',
        scorePercent: 100,
        whatIsCorrect: [`Parfait ! Les ${items.length} propositions sont toutes correctement analysées.`],
        whatNeedsImprovement: [],
        errorExplanation: '',
        progressiveHint: 'Tu as parfaitement compris ces règles.',
        recommendedLessonTitle: lessonTitle,
        recommendedLessonId: lessonRef,
        xpAwarded: 50,
      };
    }

    return {
      status: correctCount >= Math.ceil(items.length / 2) ? 'partial' : 'incorrect',
      scorePercent: pct,
      whatIsCorrect: strengths.slice(0, 3),
      whatNeedsImprovement: improvements.slice(0, 4),
      errorExplanation: 'Attention aux bornes exclues dans range() et aux règles sur les types d’indices ou paramètres.',
      progressiveHint: exercise.presetHints.level1,
      recommendedLessonTitle: lessonTitle,
      recommendedLessonId: lessonRef,
      xpAwarded: correctCount > 0 ? 15 : 0,
    };
  }

  // 4. Fill Blanks
  if (exercise.kind === 'fill_blanks') {
    const fields = exercise.workspaceConfig.blankFields || [];
    const values = (answerPayload.blanks || {}) as Record<string, string>;
    let ok = 0;
    const wrong: string[] = [];
    const good: string[] = [];

    for (const f of fields) {
      const userNorm = normalizeCodeExpr(values[f.id] || '');
      const matched =
        userNorm.length > 0 &&
        f.acceptedAnswers.some((acc) => normalizeCodeExpr(acc) === userNorm);
      if (matched) {
        ok++;
        good.push(`${f.label} correct.`);
      } else {
        wrong.push(`Vérifie le champ « ${f.label} ».`);
      }
    }

    const pct = Math.round((ok / Math.max(fields.length, 1)) * 100);
    if (ok === fields.length) {
      return {
        status: 'correct',
        scorePercent: 100,
        whatIsCorrect: [`Tous les blancs (${fields.length}/${fields.length}) sont complétés avec exactitude.`],
        whatNeedsImprovement: [],
        errorExplanation: '',
        progressiveHint: 'Excellent travail !',
        recommendedLessonTitle: lessonTitle,
        recommendedLessonId: lessonRef,
        xpAwarded: 50,
      };
    }
    return {
      status: ok > 0 ? 'partial' : 'incorrect',
      scorePercent: pct,
      whatIsCorrect: good,
      whatNeedsImprovement: wrong,
      errorExplanation: 'Vérifie les opérateurs (= vs ==, mod vs %), les bornes ou la condition de validité.',
      progressiveHint: exercise.presetHints.level2,
      recommendedLessonTitle: lessonTitle,
      recommendedLessonId: lessonRef,
      xpAwarded: ok > 0 ? 15 : 0,
    };
  }

  // 5. Tables (expression_table, trace_table, code_debug)
  if (
    exercise.kind === 'expression_table' ||
    exercise.kind === 'trace_table' ||
    exercise.kind === 'code_debug'
  ) {
    const rows = exercise.workspaceConfig.tableRows || [];
    const tableValues = (answerPayload.table || {}) as Record<string, string>;
    const subValues = (answerPayload.subQuestions || {}) as Record<string, string>;

    let totalEditable = 0;
    let okEditable = 0;
    const good: string[] = [];
    const bad: string[] = [];

    for (const row of rows) {
      for (const cell of row.cells) {
        if (!cell.editable) continue;
        totalEditable++;
        const cellKey = `${row.id}__${cell.key}`;
        const raw = tableValues[cellKey] || '';
        const norm = normalizeCodeExpr(raw);
        const normTxt = normalizeToken(raw);
        const accepted = cell.acceptedAnswers || [];
        const matched =
          norm.length > 0 &&
          accepted.some(
            (acc) =>
              normalizeCodeExpr(acc) === norm ||
              normalizeToken(acc) === normTxt ||
              (normTxt.length >= 4 && normalizeToken(acc).includes(normTxt)) ||
              (normalizeToken(acc).length >= 4 && normTxt.includes(normalizeToken(acc)))
          );
        if (matched) {
          okEditable++;
          good.push(`${cell.label || cell.key} (${row.id}) est juste.`);
        } else {
          bad.push(`Vérifie « ${cell.label || cell.key} » sur la ligne ${row.id}.`);
        }
      }
    }

    const subQuestions = exercise.workspaceConfig.subQuestions || [];
    let subOk = 0;
    for (const sq of subQuestions) {
      totalEditable++;
      const ans = normalizeToken(subValues[sq.id] || '');
      const kps = sq.keyPoints || [];
      const hit =
        ans.length >= 3 &&
        (kps.length === 0 || kps.some((kp) => ans.includes(normalizeToken(kp))));
      if (hit) {
        okEditable++;
        subOk++;
        good.push(`Réponse structurée enregistrée pour : ${sq.prompt.slice(0, 38)}...`);
      } else {
        bad.push(`Complète ou précise ta réponse pour : ${sq.prompt.slice(0, 45)}...`);
      }
    }

    const pct = Math.round((okEditable / Math.max(totalEditable, 1)) * 100);
    if (okEditable === totalEditable && totalEditable > 0) {
      return {
        status: 'correct',
        scorePercent: 100,
        whatIsCorrect: [`Toutes les cases du tableau et les questions complémentaires (${totalEditable}/${totalEditable}) sont validées !`],
        whatNeedsImprovement: [],
        errorExplanation: '',
        progressiveHint: 'Trace et analyse irréprochables.',
        recommendedLessonTitle: lessonTitle,
        recommendedLessonId: lessonRef,
        xpAwarded: 60,
      };
    }

    return {
      status: okEditable > 0 ? 'partial' : 'incorrect',
      scorePercent: pct,
      whatIsCorrect: good.slice(0, 3),
      whatNeedsImprovement: bad.slice(0, 5),
      errorExplanation: 'Reprends l’exécution pas à pas depuis la ligne précédente pour vérifier chaque variable et condition.',
      progressiveHint: okEditable === 0 ? exercise.presetHints.level1 : exercise.presetHints.level3,
      recommendedLessonTitle: lessonTitle,
      recommendedLessonId: lessonRef,
      xpAwarded: subOk > 0 || okEditable > 0 ? 15 : 0,
    };
  }

  // 6. Python / Algorithm / Both / Modular
  const algoCode = typeof answerPayload.algo === 'string' ? answerPayload.algo : '';
  const pyCode = typeof answerPayload.python === 'string' ? answerPayload.python : '';

  const needsAlgo =
    exercise.kind === 'algorithm' ||
    exercise.kind === 'algorithm_and_python' ||
    exercise.kind === 'modular_design';
  const needsPy =
    exercise.kind === 'python' || exercise.kind === 'algorithm_and_python';

  const strengths: string[] = [];
  const improvements: string[] = [];
  let scoreAcc = 0;
  let scoreParts = 0;

  if (needsAlgo) {
    scoreParts++;
    const algoRes = analyzeAlgorithmCode(algoCode, exercise.algorithmCriteria);
    scoreAcc += algoRes.score;
    strengths.push(...algoRes.strengths);
    improvements.push(...algoRes.issues);
  }

  if (needsPy) {
    scoreParts++;
    if (!pyCode.trim()) {
      improvements.push('Le programme Python est encore vide.');
    } else if (pythonOutcome && pythonOutcome.totalCount > 0) {
      const pyPct = Math.round((pythonOutcome.passedCount / pythonOutcome.totalCount) * 100);
      scoreAcc += pyPct;
      if (pythonOutcome.passedCount === pythonOutcome.totalCount) {
        strengths.push(`Tous les cas de test Python (${pythonOutcome.passedCount}/${pythonOutcome.totalCount}) ont réussi !`);
      } else {
        if (pythonOutcome.passedCount > 0) {
          strengths.push(`${pythonOutcome.passedCount}/${pythonOutcome.totalCount} cas de test Python réussis.`);
        }
        for (const c of pythonOutcome.caseResults.filter((x) => !x.passed)) {
          if (c.error) {
            improvements.push(`${c.label} : ${translatePythonErrorToFrench(c.error)}`);
          } else {
            improvements.push(`${c.label} : sortie obtenue « ${c.output.trim() || '(vide)'} » ne correspond pas au résultat attendu.`);
          }
        }
      }
    } else if (pythonOutcome && pythonOutcome.caseResults[0]?.error) {
      improvements.push(translatePythonErrorToFrench(pythonOutcome.caseResults[0].error));
    } else if (pyCode.trim().length > 15) {
      scoreAcc += 70;
      strengths.push('Ton script Python a été exécuté sans erreur bloquante.');
    }
  }

  const finalPct = Math.round(scoreAcc / Math.max(scoreParts, 1));
  const isSuccess = improvements.length === 0 && finalPct >= 80;

  return {
    status: isSuccess ? 'correct' : finalPct >= 45 || strengths.length > 0 ? 'partial' : 'incorrect',
    scorePercent: isSuccess ? 100 : finalPct,
    whatIsCorrect: strengths,
    whatNeedsImprovement: improvements,
    errorExplanation:
      improvements.length > 0
        ? 'Identifie d’abord le premier point ci-dessus, teste sur un petit exemple à la main, puis réessaye.'
        : '',
    progressiveHint: isSuccess
      ? 'Bravo ! Solution validée.'
      : improvements.length > 0
      ? exercise.presetHints.level2
      : exercise.presetHints.level1,
    recommendedLessonTitle: lessonTitle,
    recommendedLessonId: lessonRef,
    xpAwarded: isSuccess ? 75 : strengths.length > 0 ? 20 : 0,
  };
}

export function computeNewBadges(params: {
  completedExercises: string[];
  completedLessons: string[];
  submissions: StudentSubmission[];
  currentBadges: string[];
}): string[] {
  const { completedExercises, completedLessons, submissions, currentBadges } = params;
  const unlocked = new Set(currentBadges);
  const doneSet = new Set(completedExercises);

  if (completedExercises.length >= 1 || completedLessons.length >= 1) {
    unlocked.add('premier-pas');
  }

  const ch01Count = completedExercises.filter(
    (id) => id.startsWith('ex-p3-') || id.startsWith('ex-p4-') || id.startsWith('ex-p5-') || id.startsWith('ex-p12-')
  ).length;
  if (ch01Count >= 3) unlocked.add('maitre-variables');

  const ch2Count = completedExercises.filter(
    (id) => id.startsWith('ex-p15-') || id.startsWith('ex-p17-')
  ).length;
  if (ch2Count >= 4) unlocked.add('expert-conditions');

  const loopCount = completedExercises.filter(
    (id) =>
      id.startsWith('ex-p18-') ||
      id.startsWith('ex-p19-') ||
      id.startsWith('ex-p20-') ||
      id.startsWith('ex-p21-') ||
      id.startsWith('ex-p3') ||
      id.startsWith('ex-p4')
  ).length;
  if (loopCount >= 5) unlocked.add('explorateur-boucles');

  const debugSolved =
    doneSet.has('ex-p17-4') ||
    doneSet.has('ex-p20-6') ||
    doneSet.has('ex-p47-3') ||
    submissions.some((s) => s.status === 'correct' && s.attempts.length >= 2);
  if (debugSolved) unlocked.add('detective-erreurs');

  const algoSolvedCount = submissions.filter(
    (s) => s.status === 'correct' && typeof s.latestAnswer.algo === 'string' && (s.latestAnswer.algo as string).length > 20
  ).length;
  if (algoSolvedCount >= 3) unlocked.add('algorithmicien');

  const pySolvedCount = submissions.filter(
    (s) => s.status === 'correct' && typeof s.latestAnswer.python === 'string' && (s.latestAnswer.python as string).length > 15
  ).length;
  if (pySolvedCount >= 3) unlocked.add('python-starter');

  return Array.from(unlocked);
}
