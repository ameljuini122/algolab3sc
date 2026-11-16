import type { Chapter } from '../types/algolab';

export const CHAPTERS_PART_1: Chapter[] = [
  {
    id: 'ch0-revision',
    order: 0,
    title: 'Chapitre 0 : Série de Révision N°1',
    subtitle: 'Structures de données, fonctions prédéfinies & structures conditionnelles',
    sourcePages: 'Pages 3–6',
    description:
      'Série diagnostique et de consolidation du Lycée Mongi Slim Siliana (Durée : 1h 30min) couvrant les types de données, les fonctions prédéfinies sur les nombres et chaînes, et les structures conditionnelles.',
    lessons: [
      {
        id: 'les-ch0-rappel',
        chapterId: 'ch0-revision',
        order: 1,
        title: 'Méthodologie de révision : expressions, types et conditions',
        sourcePages: 'Pages 3–6',
        objectives: [
          'Mobiliser les fonctions prédéfinies de manipulation de chaînes et de nombres',
          'Évaluer une expression arithmétique ou logique en respectant les priorités',
          'Traduire une règle métier en structure conditionnelle complète',
        ],
        definitions: [
          {
            term: 'Évaluation d’expression',
            meaning:
              'Calcul étape par étape de la valeur d’une expression en tenant compte des types (Entier, Réel, Caractère, Chaîne, Booléen) et de la priorité des opérateurs.',
          },
          {
            term: 'Structure conditionnelle',
            meaning:
              'Instruction permettant d’orienter l’exécution d’un algorithme selon la valeur vraie ou fausse d’une condition.',
          },
        ],
        contentSections: [
          {
            heading: 'Rappel des fonctions prédéfinies essentielles',
            body: 'Pour réussir la série de révision, vérifiez la correspondance exacte entre la notation algorithmique du cahier et la syntaxe Python.',
            bullets: [
              'long(ch) en algorithme correspond à len(ch) en Python.',
              'pos(ch1, ch2) en algorithme correspond à ch2.find(ch1) en Python (indices à partir de 0, renvoie -1 si absent).',
              'ord(c) renvoie le code ASCII du caractère c, et chr(n) renvoie le caractère de code n.',
              'DIV et MOD en algorithme correspondent à // et % en Python.',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Recherche et conversion',
            algo: 'p ← pos("sci", "sciences")\nc ← chr(ord("A") + 3)',
            python: 'p = "sciences".find("sci")\nc = chr(ord("A") + 3)',
            note: 'Les indices commencent toujours à 0.',
          },
        ],
        comprehensionCheck: {
          prompt: 'Que renvoie l’expression Python "sciences".find("sci") ?',
          options: ['1', '0', '-1', '3'],
          correctIndex: 1,
          explanation: 'La sous-chaîne "sci" commence dès le premier caractère, donc à l’indice 0.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p3-1',
        chapterId: 'ch0-revision',
        lessonId: 'les-ch0-rappel',
        numberLabel: 'Exercice 1',
        title: 'Les structures de données & fonctions prédéfinies (Mots cachés)',
        category: 'Activité',
        sourcePage: 3,
        difficulty: 'Découverte',
        estimatedMinutes: 10,
        kind: 'word_search',
        originalStatement:
          'Jouons au jeu des mots cachés ! Dans cette grille, 7 fonctions prédéfinies sont cachées horizontalement. Retrouvez-les toutes.',
        understandWork:
          'Tu dois observer chaque ligne de la grille de lettres (de gauche à droite) pour repérer 7 noms de fonctions prédéfinies étudiées en algorithmique (sur les nombres, les caractères et les chaînes). Clique sur les mots ou saisis les 7 fonctions trouvées.',
        objectives: [
          'Reconnaître les fonctions prédéfinies de l’algorithmique',
          'Associer chaque fonction à son domaine d’utilisation (numérique, caractère, chaîne)',
        ],
        reflectionQuestions: [
          'Quelles fonctions prédéfinies permettent de travailler sur des chaînes de caractères ?',
          'Quelles fonctions manipulent les codes ASCII ou les valeurs numériques aléatoires ?',
        ],
        workspaceConfig: {
          grid: [
            ['I', 'N', 'O', 'A', 'L', 'É', 'A'],
            ['L', 'O', 'N', 'G', 'P', 'Y', 'S'],
            ['O', 'J', 'U', 'F', 'A', 'B', 'S'],
            ['E', 'I', 'O', 'R', 'D', 'U', 'C'],
            ['E', 'F', 'F', 'A', 'C', 'E', 'R'],
            ['G', 'O', 'C', 'F', 'U', 'S', 'I'],
            ['P', 'O', 'S', 'C', 'H', 'R', 'M'],
          ],
          targetWords: ['ALÉA', 'LONG', 'ABS', 'ORD', 'EFFACER', 'POS', 'CHR'],
        },
        presetHints: {
          level1: 'Parcours la grille ligne par ligne de gauche à droite : chaque ligne contient une ou deux fonctions.',
          level2: 'Regarde la ligne 1 (4 lettres à la fin) et la ligne 5 entière (7 lettres).',
          level3: 'Les fonctions sur les caractères utilisent le code ASCII (3 lettres chacune), et deux fonctions de 3 lettres se suivent sur la dernière ligne.',
          level4: 'Vérifie tes 7 entrées : il y a ALÉA, LONG, ABS, ORD, EFFACER, et deux fonctions sur la ligne 7 (POS et CHR).',
        },
        conceptToReview: 'Fonctions prédéfinies (pages 9, 10 et 12)',
        active: true,
      },
      {
        id: 'ex-p3-2',
        chapterId: 'ch0-revision',
        lessonId: 'les-ch0-rappel',
        numberLabel: 'Exercice 2',
        title: 'Questions à choix multiples (QCM)',
        category: 'Exercice guidé',
        sourcePage: 3,
        sourcePageNote: 'Pages 3–4',
        difficulty: 'Découverte',
        estimatedMinutes: 15,
        kind: 'qcm',
        originalStatement:
          'Consigne : Entourer ou cocher la lettre correspondant à la bonne réponse pour chaque question (1 à 6).',
        understandWork:
          'Pour chacune des 6 questions, tu dois évaluer mentalement (sans exécuter aveuglément) ce que renvoie l’instruction Python ou algorithmique proposée : longueur de chaîne, valeur absolue, code ASCII, division entière/modulo, position de sous-chaîne et conversion en chaîne.',
        objectives: [
          'Déterminer le résultat de len(), abs(), chr() et str()',
          'Distinguer la division entière // du reste % en Python',
          'Appliquer pos(ch1, ch2) avec des indices commençant à 0',
        ],
        reflectionQuestions: [
          'Combien de caractères compte le mot "Sciences" ?',
          'Quelle est la différence entre 23 // 5 (quotient) et 23 % 5 (reste) ?',
          'À quel indice démarre la sous-chaîne "tech" dans "info_techno" ?',
        ],
        workspaceConfig: {
          questions: [
            {
              id: 'q1',
              prompt: '1) Que renvoie l’instruction Python len("Sciences") ?',
              options: [
                { label: 'A. 7', value: 'A' },
                { label: 'B. 8', value: 'B' },
                { label: 'C. 9', value: 'C' },
                { label: 'D. Erreur', value: 'D' },
              ],
              correctValue: 'B',
              explanation: 'Le mot "Sciences" comporte exactement 8 lettres (S-c-i-e-n-c-e-s).',
            },
            {
              id: 'q2',
              prompt: '2) Pour obtenir la valeur absolue d’un nombre réel x = -15.8, quelle fonction utilise-t-on ?',
              options: [
                { label: 'A. abs(-15.8)', value: 'A' },
                { label: 'B. int(-15.8)', value: 'B' },
                { label: 'C. round(-15.8)', value: 'C' },
                { label: 'D. sqr(-15.8)', value: 'D' },
              ],
              correctValue: 'A',
              explanation: 'La fonction abs(x) renvoie la valeur absolue d’un nombre.',
            },
            {
              id: 'q3',
              prompt: "3) Sachant que ord('A') = 65, quelle est la valeur retournée par chr(67) ?",
              options: [
                { label: "A. 'a'", value: 'A' },
                { label: "B. 'B'", value: 'B' },
                { label: "C. 'C'", value: 'C' },
                { label: 'D. 67', value: 'D' },
              ],
              correctValue: 'C',
              explanation: "65 -> 'A', 66 -> 'B', donc 67 -> 'C'.",
            },
            {
              id: 'q4',
              prompt: '4) Quel est le résultat de l’expression Python 23 // 5 + 23 % 5 ?',
              options: [
                { label: 'A. 4', value: 'A' },
                { label: 'B. 3', value: 'B' },
                { label: 'C. 7', value: 'C' },
                { label: 'D. 4.6', value: 'D' },
              ],
              correctValue: 'C',
              explanation: '23 // 5 vaut 4 (quotient entier) et 23 % 5 vaut 3 (reste), donc 4 + 3 = 7.',
            },
            {
              id: 'q5',
              prompt: '5) Que renvoie l’instruction algorithmique pos("tech", "info_techno") ?',
              options: [
                { label: 'A. 0', value: 'A' },
                { label: 'B. 1', value: 'B' },
                { label: 'C. -1', value: 'C' },
                { label: 'D. 5', value: 'D' },
              ],
              correctValue: 'D',
              explanation: 'Les indices sont i(0), n(1), f(2), o(3), _(4), t(5). "tech" commence donc à l’indice 5.',
            },
            {
              id: 'q6',
              prompt: '6) Que fait l’instruction str(2027) en Python ?',
              options: [
                { label: 'A. Convertit en chaîne "2027"', value: 'A' },
                { label: 'B. Convertit en entier', value: 'B' },
                { label: 'C. Renvoie la longueur 4', value: 'C' },
                { label: 'D. Renvoie Vrai', value: 'D' },
              ],
              correctValue: 'A',
              explanation: 'str(x) convertit une valeur numérique en chaîne de caractères.',
            },
          ],
        },
        presetHints: {
          level1: 'Traite chaque question calmement en comptant les caractères et les indices à partir de 0.',
          level2: 'Pour la question 4, calcule séparément 23 // 5 et 23 % 5 avant d’additionner.',
          level3: 'Rappelle-toi que chr(n) est l’opération inverse de ord(c), et que str() transforme un nombre en texte.',
          level4: 'Vérifie notamment l’indice du caractère "t" dans "info_techno" (n’oublie pas de compter le "_").',
        },
        conceptToReview: 'Types simples, opérateurs DIV/MOD et fonctions ASCII/chaînes',
        active: true,
      },
      {
        id: 'ex-p4-3',
        chapterId: 'ch0-revision',
        lessonId: 'les-ch0-rappel',
        numberLabel: 'Exercice 3',
        title: 'Évaluation d’expressions & traduction Algo / Python',
        category: 'Exercice guidé',
        sourcePage: 4,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'expression_table',
        originalStatement:
          '1) Compléter le tableau suivant en évaluant chaque expression (Valeur de X et Type de X, et l’instruction algorithme manquante). 2) Compléter le tableau pour chaque tâche proposée : lettre majuscule au hasard, calcul de E = |x³ + 5| / √(16) + 2, nombre de caractères d’une chaîne ch.',
        understandWork:
          'Dans la partie 1, tu dois trouver la valeur exacte et le type de la variable X pour 4 expressions, et écrire l’équivalent algorithmique manquant à la 2e ligne. Dans la partie 2, tu dois traduire 3 tâches concrètes en une seule instruction algorithmique et son équivalent Python.',
        objectives: [
          'Appliquer l’ordre de priorité des opérateurs',
          'Déterminer le type résultant d’une expression (Entier, Réel, Booléen, Caractère)',
          'Traduire entre syntaxe algorithmique et syntaxe Python',
        ],
        reflectionQuestions: [
          'Dans 18 - 4 * 3 + 12 / 4, quelle opération s’exécute en premier ?',
          'Quels sont les codes ASCII des lettres majuscules de "A" à "Z" ?',
          'Quelle fonction mathématique calcule la racine carrée et la valeur absolue ?',
        ],
        workspaceConfig: {
          tableHeaders: ['Instruction / Tâche', 'Algorithme', 'Python', 'Valeur / Résultat', 'Type'],
          tableRows: [
            {
              id: 'r1',
              cells: [
                { key: 'label', prefilled: 'Expression 1', editable: false },
                { key: 'algo', prefilled: 'X ← 18 - 4 * 3 + 12 / 4', editable: false },
                { key: 'python', prefilled: 'X = 18 - 4 * 3 + 12 // 4', editable: false },
                { key: 'val', label: 'Valeur de X', editable: true, acceptedAnswers: ['9', '9.0'] },
                { key: 'type', label: 'Type de X', editable: true, acceptedAnswers: ['Entier', 'Réel', 'entier', 'réel', 'reel', 'int', 'float'] },
              ],
            },
            {
              id: 'r2',
              cells: [
                { key: 'label', prefilled: 'Expression 2', editable: false },
                { key: 'algo', label: 'Instruction Algo', editable: true, acceptedAnswers: ["X ← (15 mod 4 > 2) et non('A' > 'B')", 'X<-(15 mod 4>2) et non("A">"B")', "X ← (15 MOD 4 > 2) ET NON ('A' > 'B')"] },
                { key: 'python', prefilled: "X = (15 % 4 > 2) and not('A' > 'B')", editable: false },
                { key: 'val', label: 'Valeur de X', editable: true, acceptedAnswers: ['Vrai', 'True', 'vrai', 'true'] },
                { key: 'type', prefilled: 'Booléen', editable: false },
              ],
            },
            {
              id: 'r3',
              cells: [
                { key: 'label', prefilled: 'Expression 3', editable: false },
                { key: 'algo', prefilled: 'X ← pos("sci","sciences")', editable: false },
                { key: 'python', prefilled: 'X = "sciences".find("sci")', editable: false },
                { key: 'val', label: 'Valeur de X', editable: true, acceptedAnswers: ['0'] },
                { key: 'type', label: 'Type de X', editable: true, acceptedAnswers: ['Entier', 'entier', 'int'] },
              ],
            },
            {
              id: 'r4',
              cells: [
                { key: 'label', prefilled: 'Expression 4', editable: false },
                { key: 'algo', prefilled: "X ← chr(ord('A') + 3)", editable: false },
                { key: 'python', prefilled: "X = chr(ord('A') + 3)", editable: false },
                { key: 'val', label: 'Valeur de X', editable: true, acceptedAnswers: ["'D'", '"D"', 'D'] },
                { key: 'type', label: 'Type de X', editable: true, acceptedAnswers: ['Caractère', 'caractère', 'caractere', 'str'] },
              ],
            },
            {
              id: 't1',
              cells: [
                { key: 'label', prefilled: 'Tâche 1 : Lettre majuscule au hasard dans C', editable: false },
                { key: 'algo', label: 'Instruction Algo', editable: true, acceptedAnswers: ['C ← chr(Aléa(65,90))', 'C ← chr(Alea(65, 90))'] },
                { key: 'python', label: 'Instruction Python', editable: true, acceptedAnswers: ['C = chr(randint(65, 90))', 'C = chr(randint(65,90))'] },
                { key: 'val', prefilled: '—', editable: false },
                { key: 'type', prefilled: 'Caractère', editable: false },
              ],
            },
            {
              id: 't2',
              cells: [
                { key: 'label', prefilled: 'Tâche 2 : Calculer E = |x³ + 5| / √(16) + 2', editable: false },
                { key: 'algo', label: 'Instruction Algo', editable: true, acceptedAnswers: ['E ← Abs(x*x*x + 5) / Racinecarré(16) + 2', 'E ← Abs(x**3 + 5) / Racinecarré(16) + 2'] },
                { key: 'python', label: 'Instruction Python', editable: true, acceptedAnswers: ['E = abs(x**3 + 5) / sqrt(16) + 2', 'E = abs(x**3+5)/sqrt(16)+2'] },
                { key: 'val', prefilled: '—', editable: false },
                { key: 'type', prefilled: 'Réel', editable: false },
              ],
            },
            {
              id: 't3',
              cells: [
                { key: 'label', prefilled: 'Tâche 3 : Nombre de caractères de ch', editable: false },
                { key: 'algo', label: 'Instruction Algo', editable: true, acceptedAnswers: ['n ← long(ch)', 'long(ch)'] },
                { key: 'python', label: 'Instruction Python', editable: true, acceptedAnswers: ['n = len(ch)', 'len(ch)'] },
                { key: 'val', prefilled: '—', editable: false },
                { key: 'type', prefilled: 'Entier', editable: false },
              ],
            },
          ],
        },
        presetHints: {
          level1: 'Respecte toujours la priorité : parenthèses, puis *, /, //, % avant + et -.',
          level2: 'Pour l’expression 2 : % correspond à mod, and à et, not à non.',
          level3: 'Une lettre majuscule a un code ASCII compris entre 65 (A) et 90 (Z). Utilise Aléa(65,90) puis chr(...).',
          level4: 'Vérifie que dans E = |x³+5| / √(16) + 2, la division porte bien uniquement sur √(16) avant d’ajouter 2.',
        },
        conceptToReview: 'Priorité des opérateurs et fonctions prédéfinies (pages 8–10)',
        active: true,
      },
      {
        id: 'ex-p4-4',
        chapterId: 'ch0-revision',
        lessonId: 'les-ch0-rappel',
        numberLabel: 'Exercice 4',
        title: 'Structures conditionnelles & trace d’exécution',
        category: 'Exercice guidé',
        sourcePage: 4,
        sourcePageNote: 'Pages 4–5',
        difficulty: 'Entraînement',
        estimatedMinutes: 20,
        kind: 'trace_table',
        originalStatement:
          'On considère le fragment d’algorithme ci-contre :\n// Structure Conditionnelle ......\nSi (A >= B) Alors\n    Diff ← A - B\nSinon\n    Diff ← B - A\nFinSi\n\n// Structure Conditionnelle ......\nSi (Diff Mod 2 = 0) Alors\n    Etat ← "PARITÉ PAIR"\nFinSi\n\nQ1) Compléter le tableau de trace d’exécution pour les trois jeux d’essais.\nQ2) Traduire la règle suivante en forme complète (Algorithme et Python) : Si la moyenne M d’un élève est ≥ 10, alors la Décision est "Admis", sinon la Décision est "Ajourné".',
        understandWork:
          'Tu dois d’abord dérouler à la main ce fragment d’algorithme pour 3 paires de valeurs (A, B) afin de trouver Diff et Etat. Ensuite, tu dois écrire la structure conditionnelle complète (en algorithme et en Python) qui attribue "Admis" ou "Ajourné" selon la moyenne M.',
        objectives: [
          'Distinguer une structure conditionnelle complète d’une forme réduite',
          'Exécuter un algorithme pas à pas sur des jeux d’essais',
          'Écrire une conditionnelle complète en Algorithme et en Python',
        ],
        reflectionQuestions: [
          'Que calcule la première structure conditionnelle pour Diff ?',
          'Que se passe-t-il pour la variable Etat si Diff est impair (par exemple Diff = 7) ?',
          'Quelle est la syntaxe exacte du Sinon en algorithme et en Python ?',
        ],
        workspaceConfig: {
          codeSnippet:
            'Si (A >= B) Alors\n    Diff ← A - B\nSinon\n    Diff ← B - A\nFinSi\nSi (Diff Mod 2 = 0) Alors\n    Etat ← "PARITÉ PAIR"\nFinSi',
          tableHeaders: ['Cas d’essai', 'Valeurs initiales (A, B)', 'Valeur de Diff', 'Valeur finale de Etat'],
          tableRows: [
            {
              id: 'cas1',
              cells: [
                { key: 'cas', prefilled: 'Cas N°1', editable: false },
                { key: 'init', prefilled: 'A = 15 , B = 7', editable: false },
                { key: 'diff', label: 'Diff', editable: true, acceptedAnswers: ['8'] },
                { key: 'etat', label: 'Etat', editable: true, acceptedAnswers: ['"PARITÉ PAIR"', 'PARITÉ PAIR', 'PARITE PAIR'] },
              ],
            },
            {
              id: 'cas2',
              cells: [
                { key: 'cas', prefilled: 'Cas N°2', editable: false },
                { key: 'init', prefilled: 'A = 4 , B = 11', editable: false },
                { key: 'diff', label: 'Diff', editable: true, acceptedAnswers: ['7'] },
                { key: 'etat', label: 'Etat', editable: true, acceptedAnswers: ['inchangée', 'non définie', 'vide', 'aucune', '-', 'rien'] },
              ],
            },
            {
              id: 'cas3',
              cells: [
                { key: 'cas', prefilled: 'Cas N°3', editable: false },
                { key: 'init', prefilled: 'A = 8 , B = 8', editable: false },
                { key: 'diff', label: 'Diff', editable: true, acceptedAnswers: ['0'] },
                { key: 'etat', label: 'Etat', editable: true, acceptedAnswers: ['"PARITÉ PAIR"', 'PARITÉ PAIR', 'PARITE PAIR'] },
              ],
            },
          ],
          subQuestions: [
            {
              id: 'q2_algo',
              prompt: 'Q2a) Structure Algorithmique (Forme Complète) pour la décision :',
              placeholder: 'Si (...) Alors\n  ...\nSinon\n  ...\nFinSi',
              keyPoints: ['Si (M >= 10) Alors', 'Décision ← "Admis"', 'Sinon', 'Décision ← "Ajourné"', 'FinSi'],
            },
            {
              id: 'q2_py',
              prompt: 'Q2b) Structure Python correspondante :',
              placeholder: 'if ...:\n    ...\nelse:\n    ...',
              keyPoints: ['if M >= 10:', 'Decision = "Admis"', 'else:', 'Decision = "Ajourné"'],
            },
          ],
        },
        presetHints: {
          level1: 'Compare d’abord A et B pour choisir entre A - B et B - A.',
          level2: 'Dans le cas N°2, Diff vaut 7. Est-ce que 7 Mod 2 = 0 est vrai ? Comme il n’y a pas de Sinon, Etat ne reçoit aucune nouvelle valeur.',
          level3: 'Attention au Cas N°3 : 0 Mod 2 vaut bien 0 ! Donc 0 est considéré pair ici.',
          level4: 'Pour Q2, utilise bien la forme complète avec Sinon / else pour couvrir les deux cas M >= 10 et M < 10.',
        },
        conceptToReview: 'Forme réduite vs Forme alternative complète (page 13)',
        active: true,
      },
      {
        id: 'ex-p5-5',
        chapterId: 'ch0-revision',
        lessonId: 'les-ch0-rappel',
        numberLabel: 'Exercice 5',
        title: 'Problème d’application — Code Promo',
        category: 'Projet',
        sourcePage: 5,
        sourcePageNote: 'Pages 5–6',
        difficulty: 'Défi',
        estimatedMinutes: 25,
        kind: 'algorithm',
        originalStatement:
          'Une plateforme de commerce en ligne propose une offre promotionnelle. Le client saisit son code promo de 8 caractères (ex : "VIP25X3A") composé de lettres et de chiffres pour calculer sa réduction finale.\n• Taux de remise (%) : Déterminé par les 2 chiffres extraits du code (ex : "25" → remise = 25%).\n• Nombre de cadeaux : Représenté par le chiffre extrait en avant-dernière position ou dernière position (ex : \'3\' → 3 cadeaux).\n• Frais de livraison : Gratuit (0 DT) si le code contient la lettre \'A\', sinon facturés à 8 DT.\n\nTravail Demandé :\n1) Compléter le tableau d’analyse d’exemples (SUM15X2B, ELE20X1A, PRO30X3B).\n2) Écrire l’algorithme d’un programme qui permet de saisir le prix unitaire, la quantité et le code promo, d’extraire la remise, les cadeaux et la livraison, de calculer le montant brut, la remise et le net à payer, et d’afficher le net à payer et le nombre de cadeaux.',
        understandWork:
          'Tu dois combiner la manipulation de chaînes (extraire des sous-chaînes à des positions précises, convertir en entier avec valeur(), vérifier si "A" existe avec pos()) et le calcul commercial avec une structure conditionnelle pour les frais de livraison.',
        objectives: [
          'Analyser un problème complet avec données, traitement et résultats',
          'Extraire et convertir des sous-chaînes d’un code structuré',
          'Utiliser une conditionnelle pour déterminer les frais de livraison',
        ],
        reflectionQuestions: [
          'À quels indices se trouvent les 2 chiffres de remise dans "VIP25X3A" (indices 0 à 7) ?',
          'À quel indice se trouve le chiffre des cadeaux (avant-dernière position) ?',
          'Comment tester si la lettre "A" appartient au code promo avec pos() ?',
        ],
        workspaceConfig: {
          tableHeaders: ['Code Promo', 'Prix Total Brut', 'Taux Remise', 'Montant Remise', 'Livraison', 'Net à Payer', 'Cadeaux'],
          tableRows: [
            {
              id: 'p1',
              cells: [
                { key: 'code', prefilled: 'SUM15X2B', editable: false },
                { key: 'brut', prefilled: '100 DT', editable: false },
                { key: 'taux', prefilled: '15 %', editable: false },
                { key: 'rem', prefilled: '15 DT', editable: false },
                { key: 'liv', prefilled: '8 DT', editable: false },
                { key: 'net', prefilled: '93 DT', editable: false },
                { key: 'cad', prefilled: '2', editable: false },
              ],
            },
            {
              id: 'p2',
              cells: [
                { key: 'code', prefilled: 'ELE20X1A', editable: false },
                { key: 'brut', prefilled: '200 DT', editable: false },
                { key: 'taux', label: 'Taux Remise', editable: true, acceptedAnswers: ['20%', '20 %', '20'] },
                { key: 'rem', label: 'Montant Remise', editable: true, acceptedAnswers: ['40 DT', '40'] },
                { key: 'liv', label: 'Livraison', editable: true, acceptedAnswers: ['0 DT', '0'] },
                { key: 'net', label: 'Net à Payer', editable: true, acceptedAnswers: ['160 DT', '160'] },
                { key: 'cad', label: 'Cadeaux', editable: true, acceptedAnswers: ['1'] },
              ],
            },
            {
              id: 'p3',
              cells: [
                { key: 'code', prefilled: 'PRO30X3B', editable: false },
                { key: 'brut', prefilled: '50 DT', editable: false },
                { key: 'taux', label: 'Taux Remise', editable: true, acceptedAnswers: ['30%', '30 %', '30'] },
                { key: 'rem', label: 'Montant Remise', editable: true, acceptedAnswers: ['15 DT', '15'] },
                { key: 'liv', label: 'Livraison', editable: true, acceptedAnswers: ['8 DT', '8'] },
                { key: 'net', label: 'Net à Payer', editable: true, acceptedAnswers: ['43 DT', '43'] },
                { key: 'cad', label: 'Cadeaux', editable: true, acceptedAnswers: ['3'] },
              ],
            },
          ],
          starterAlgo:
            'Algorithme Code_Promo\nDébut\n    // 1. Saisie des données (pu, qte, code)\n    \n    // 2. Extraction (taux, cadeaux, livraison)\n    \n    // 3. Calculs (brut, remise, net)\n    \n    // 4. Affichage\n    \nFin',
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['si'],
          requiredKeywords: ['sous_chaîne', 'valeur', 'pos'],
          criteriaNotes: [
            'Saisir prix unitaire, quantité et code promo',
            'Extraire le taux de remise (indices 3..5) et le convertir en entier',
            'Extraire le nombre de cadeaux (indice 6) et le convertir',
            'Tester la présence de "A" dans le code avec pos("A", code) ≠ -1',
            'Calculer net = brut - remise + livraison et afficher net et cadeaux',
          ],
        },
        presetHints: {
          level1: 'Commence par repérer les indices de chaque caractère dans "VIP25X3A" : V(0) I(1) P(2) 2(3) 5(4) X(5) 3(6) A(7).',
          level2: 'Utilise sous_Chaîne(code, 3, 5) puis valeur(...) pour récupérer le taux en nombre.',
          level3: 'Pour savoir si "A" est dans code, rappelle-toi que pos("A", code) retourne -1 s’il n’existe pas, et >= 0 sinon.',
          level4: 'Vérifie le calcul final : Net = Brut - Montant_Remise + Livraison (où Montant_Remise = Brut * Taux / 100).',
        },
        conceptToReview: 'Chaînes de caractères (sous_Chaîne, pos, valeur) et conditionnelles',
        active: true,
      },
    ],
  },
  {
    id: 'ch1-simples-donnees',
    order: 1,
    title: 'Chapitre 1 : Instructions Simples & Structures de Données',
    subtitle: 'Break Savoir 1 & 2, Type Caractère (ASCII) et Chaîne de caractères',
    sourcePages: 'Pages 7–12',
    description:
      'Maîtriser le squelette algorithmique, le T.D.O., les entrées/sorties, les 5 types simples, la priorité des opérateurs, les codes ASCII et les 8 fonctions prédéfinies sur les chaînes.',
    lessons: [
      {
        id: 'les-1-1-simples',
        chapterId: 'ch1-simples-donnees',
        order: 1,
        title: 'Break Savoir 1 : Les instructions simples',
        sourcePages: 'Page 7',
        objectives: [
          'Connaître les 4 étapes de résolution d’un problème',
          'Structurer un algorithme avec Algorithme / Début / Fin et son T.D.O.',
          'Utiliser Lire, Ecrire et l’affectation ← en Algorithme et Python',
        ],
        definitions: [
          {
            term: 'T.D.O. (Tableau de Déclaration des Objets)',
            meaning: 'Tableau recensant chaque objet utilisé dans l’algorithme avec sa nature ou son type.',
          },
          {
            term: 'Affectation (← / =)',
            meaning: 'Instruction qui stocke une valeur ou le résultat d’une expression dans une variable.',
          },
        ],
        contentSections: [
          {
            heading: 'Les 4 étapes et le schéma Entrée / Traitement / Sortie',
            body: 'Tout programme suit une logique claire : Comprendre le problème → Planifier la solution → Exécuter le plan → Vérifier le résultat.',
            bullets: [
              'Entrée : Lire(variable) ou input() pour recevoir les données de l’utilisateur.',
              'Traitement : Calculs et transformations des données.',
              'Sortie : Ecrire(...) ou print(...) pour afficher le résultat.',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Saisie typée (chaîne, entier, réel)',
            algo: 'Ecrire("Donner votre âge : ")\nLire(Age)\nEcrire("La somme est : ", S)',
            python: 'Age = int(input("Donner votre âge : "))\nnote = float(input("Donner votre note : "))\nprint("La somme est :", S)',
          },
        ],
        workedExample: {
          title: 'Calcul de la somme A + B',
          statement: 'Lire deux entiers A = 5 et B = 7, calculer Somme = A + B puis afficher 12.',
          algo: 'Algorithme Somme_AB\nDébut\n    Lire(A)\n    Lire(B)\n    Somme ← A + B\n    Ecrire(Somme)\nFin',
          python: 'A = int(input("A = "))\nB = int(input("B = "))\nSomme = A + B\nprint(Somme)',
          walkthrough: [
            'Entrée : l’utilisateur fournit A = 5 et B = 7.',
            'Traitement : Somme reçoit 5 + 7 = 12.',
            'Sortie : l’écran affiche 12.',
          ],
        },
        comprehensionCheck: {
          prompt: 'Quelle instruction Python permet de saisir une note décimale (réelle) ?',
          options: [
            'note = input("Note : ")',
            'note = int(input("Note : "))',
            'note = float(input("Note : "))',
            'print(input("Note : "))',
          ],
          correctIndex: 2,
          explanation: 'float(input(...)) convertit la saisie texte en nombre réel (à virgule).',
        },
      },
      {
        id: 'les-1-2-donnees',
        chapterId: 'ch1-simples-donnees',
        order: 2,
        title: 'Break Savoir 2 : Objets, types simples, opérateurs & booléens',
        sourcePages: 'Pages 8–9',
        objectives: [
          'Distinguer une constante d’une variable',
          'Identifier les 5 types simples (Entier, Réel, Caractère, Chaîne, Booléen)',
          'Maîtriser les opérateurs arithmétiques (DIV, MOD), relationnels et logiques (NON, ET, OU)',
        ],
        definitions: [
          {
            term: 'Constante',
            meaning: 'Objet dont la valeur est fixe et ne change jamais durant l’exécution (ex : PI = 3.14).',
          },
          {
            term: 'Variable',
            meaning: 'Case mémoire nommée dont la valeur peut évoluer au cours de l’algorithme.',
          },
          {
            term: 'Ordre de priorité',
            meaning: '1) Parenthèses () → 2) *, /, //, % → 3) +, - (de gauche à droite à priorité égale).',
          },
        ],
        contentSections: [
          {
            heading: 'Les 5 types simples et opérateurs',
            body: 'En algorithmique 3SC, chaque variable possède un type précis : Entier (int), Réel (float), Caractère (str 1 symbole), Chaîne (str), Booléen (bool : Vrai/Faux).',
            bullets: [
              'Division entière : 5 DIV 2 = 2 (Python : 5 // 2).',
              'Modulo (reste) : 5 MOD 2 = 1 (Python : 5 % 2).',
              'Appartenance à un intervalle : v1 ≤ x ≤ vn (Python : v1 <= x <= vn).',
              'Fonctions numériques : Arrondi / round, Racinecarré / sqrt, Aléa / randint, Ent / int, Abs / abs.',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Opérateurs logiques et appartenance',
            algo: 'test ← (n >= 5) et (n <= 20)\nres ← non(A) ou B',
            python: 'test = 5 <= n <= 20\nres = (not A) or B',
          },
        ],
        comprehensionCheck: {
          prompt: 'Que vaut l’expression Python round(2.5) selon la règle d’arrondi de Python vue page 9 ?',
          options: ['3', '2', '2.5', 'Erreur'],
          correctIndex: 1,
          explanation: 'En Python, lorsque la partie fractionnaire vaut exactement .5, round() retourne l’entier pair le plus proche (ici 2).',
        },
      },
      {
        id: 'les-1-3-caractere',
        chapterId: 'ch1-simples-donnees',
        order: 3,
        title: 'Le type Caractère (str) & Code ASCII',
        sourcePages: 'Page 10',
        objectives: [
          'Représenter un caractère entre guillemets ou apostrophes',
          'Utiliser les codes ASCII ("0"=48, "9"=57, "A"=65, "Z"=90, "a"=97, "z"=122)',
          'Manipuler ord(c) et chr(n) pour convertir caractère ↔ code ASCII',
        ],
        definitions: [
          {
            term: 'Code ASCII',
            meaning: 'Entier entre 0 et 255 associé à chaque caractère (American Standard Code for Information Interchange).',
          },
          {
            term: 'ord(c) et chr(n)',
            meaning: 'ord(c) renvoie le code ASCII du caractère c ; chr(n) renvoie le caractère dont le code ASCII est n.',
          },
        ],
        contentSections: [
          {
            heading: 'Repères ASCII indispensables',
            body: 'Les comparaisons entre caractères (<, >, <=, >=) s’effectuent selon leur code ASCII.',
            bullets: [
              'Chiffres : "0" → 48 jusqu’à "9" → 57.',
              'Majuscules : "A" → 65 jusqu’à "Z" → 90.',
              'Minuscules : "a" → 97 jusqu’à "z" → 122.',
              'Exemple : "B" < "b" donne True car 66 < 98.',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Manipulation ASCII',
            algo: "n ← ord('A')   // 65\nc ← chr(65)    // 'A'",
            python: "n = ord('A')   # 65\nc = chr(65)    # 'A'",
          },
        ],
        comprehensionCheck: {
          prompt: "Quelle est la valeur de l’expression 'B' < 'b' en Python ?",
          options: ['False', 'True', 'Erreur', '66'],
          correctIndex: 1,
          explanation: "Le code ASCII de 'B' (66) est strictement inférieur à celui de 'b' (98), donc c’est True.",
        },
      },
      {
        id: 'les-1-4-chaine',
        chapterId: 'ch1-simples-donnees',
        order: 4,
        title: 'Le type Chaîne de caractères & fonctions prédéfinies',
        sourcePages: 'Pages 11–12',
        objectives: [
          'Accéder au premier (ch[0]) et au dernier caractère (ch[long(ch)-1])',
          'Comprendre l’immutabilité des chaînes en Python',
          'Utiliser long, pos, convch, estnum, valeur, sous_Chaîne, effacer et majus',
        ],
        definitions: [
          {
            term: 'Immutabilité',
            meaning: 'En Python, une chaîne ne peut pas être modifiée directement case par case (ch[0] = "P" est interdit).',
          },
          {
            term: 'Sous-chaîne et effacement',
            meaning: 'sous_Chaîne(ch, d, f) extrait de l’indice d à f exclu (ch[d:f]) ; effacer(ch, d, f) supprime cette tranche (ch[:d]+ch[f:]).',
          },
        ],
        contentSections: [
          {
            heading: 'Tests classiques sur une chaîne ch',
            body: 'Les indices d’une chaîne ch vont toujours de 0 à long(ch) - 1.',
            bullets: [
              'Chaîne vide "" : longueur = 0 ; chaîne espace " " : longueur = 1.',
              'Commence par une majuscule : "A" <= ch[0] <= "Z".',
              'Se termine par un point : ch[len(ch)-1] == ".".',
              'Ne se termine pas par un espace : ch[len(ch)-1] != " ".',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Tableau récapitulatif des 8 fonctions chaînes',
            algo: 'l ← long(ch)\np ← pos(ch1, ch2)\nch ← convch(X)\na ← estnum(ch)\nn ← valeur(ch)\nch1 ← sous_Chaîne(ch, d, f)\nch1 ← effacer(ch, d, f)\nch1 ← majus(ch)',
            python: 'l = len(ch)\np = ch2.find(ch1)\nch = str(X)\na = ch.isdigit()\nn = int(ch)  # ou float(ch)\nch1 = ch[d:f]\nch1 = ch[:d] + ch[f:]\nch1 = ch.upper()',
          },
        ],
        comprehensionCheck: {
          prompt: 'Si ch = "Bonjour", quel est l’indice du dernier caractère "r" ?',
          options: ['7', '6', '5', '1'],
          correctIndex: 1,
          explanation: 'len("Bonjour") vaut 7, donc le dernier caractère est à l’indice 7 - 1 = 6.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p12-1',
        chapterId: 'ch1-simples-donnees',
        lessonId: 'les-1-4-chaine',
        numberLabel: 'Activité p. 12',
        title: 'Compléter les exemples des fonctions sur les chaînes',
        category: 'Activité',
        sourcePage: 12,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'expression_table',
        originalStatement:
          'Compléter la colonne « Exemple » du tableau des fonctions prédéfinies sur les chaînes de caractères (page 12) : long("2020"), pos("Z/", "20/20"), pos("3", "20/20"), convch(2020), estnum("25"), estnum("a25"), valeur("2020"), valeur("12.8"), sous_Chaîne("baccalauréat 2023", 5, 12), majus("Devoir").',
        understandWork:
          'Tu dois prévoir la valeur exacte stockée dans la variable après exécution de chacune de ces fonctions prédéfinies sur les chaînes. Fais bien attention aux guillemets pour distinguer un nombre d’une chaîne de caractères !',
        objectives: [
          'Distinguer une chaîne numérique ("2020") d’un entier (2020)',
          'Maîtriser pos(), estnum(), valeur(), sous_Chaîne() et majus()',
        ],
        reflectionQuestions: [
          'Que renvoie pos(ch1, ch2) quand ch1 n’existe pas dans ch2 ?',
          'Quelle est la différence entre convch(2020) et valeur("2020") ?',
          'Dans sous_Chaîne(ch, 5, 12), la position 12 est-elle incluse ou exclue ?',
        ],
        workspaceConfig: {
          tableHeaders: ['Instruction algorithmique', 'Description', 'Résultat (contient)'],
          tableRows: [
            {
              id: 's1',
              cells: [
                { key: 'inst', prefilled: 'ch ← "2020" ; l ← long(ch)', editable: false },
                { key: 'desc', prefilled: 'Nombre de caractères', editable: false },
                { key: 'res', label: 'l contient', editable: true, acceptedAnswers: ['4'] },
              ],
            },
            {
              id: 's2',
              cells: [
                { key: 'inst', prefilled: 'p ← pos("Z/", "20/20")', editable: false },
                { key: 'desc', prefilled: 'Position de "Z/" dans "20/20"', editable: false },
                { key: 'res', label: 'p contient', editable: true, acceptedAnswers: ['-1'] },
              ],
            },
            {
              id: 's3',
              cells: [
                { key: 'inst', prefilled: 'p ← pos("3", "20/20")', editable: false },
                { key: 'desc', prefilled: 'Position de "3" dans "20/20"', editable: false },
                { key: 'res', label: 'p contient', editable: true, acceptedAnswers: ['-1'] },
              ],
            },
            {
              id: 's4',
              cells: [
                { key: 'inst', prefilled: 'ch ← convch(2020)', editable: false },
                { key: 'desc', prefilled: 'Conversion nombre → chaîne', editable: false },
                { key: 'res', label: 'ch contient', editable: true, acceptedAnswers: ['"2020"', "'2020'"] },
              ],
            },
            {
              id: 's5',
              cells: [
                { key: 'inst', prefilled: 'a ← estnum("25")', editable: false },
                { key: 'desc', prefilled: 'Vérifier si convertible en numérique', editable: false },
                { key: 'res', label: 'a contient', editable: true, acceptedAnswers: ['Vrai', 'True', 'vrai', 'true'] },
              ],
            },
            {
              id: 's6',
              cells: [
                { key: 'inst', prefilled: 'a ← estnum("a25")', editable: false },
                { key: 'desc', prefilled: 'Vérifier si convertible en numérique', editable: false },
                { key: 'res', label: 'a contient', editable: true, acceptedAnswers: ['Faux', 'False', 'faux', 'false'] },
              ],
            },
            {
              id: 's7',
              cells: [
                { key: 'inst', prefilled: 'n ← valeur("2020")', editable: false },
                { key: 'desc', prefilled: 'Conversion chaîne → entier', editable: false },
                { key: 'res', label: 'n contient', editable: true, acceptedAnswers: ['2020'] },
              ],
            },
            {
              id: 's8',
              cells: [
                { key: 'inst', prefilled: 'n ← valeur("12.8")', editable: false },
                { key: 'desc', prefilled: 'Conversion chaîne → réel', editable: false },
                { key: 'res', label: 'n contient', editable: true, acceptedAnswers: ['12.8'] },
              ],
            },
            {
              id: 's9',
              cells: [
                { key: 'inst', prefilled: 'ch1 ← sous_Chaîne("baccalauréat 2023", 5, 12)', editable: false },
                { key: 'desc', prefilled: 'Tranche d’indices 5 à 11 (12 exclu)', editable: false },
                { key: 'res', label: 'ch1 contient', editable: true, acceptedAnswers: ['"lauréat"', "'lauréat'", 'lauréat'] },
              ],
            },
            {
              id: 's10',
              cells: [
                { key: 'inst', prefilled: 'ch1 ← majus("Devoir")', editable: false },
                { key: 'desc', prefilled: 'Conversion en majuscules', editable: false },
                { key: 'res', label: 'ch1 contient', editable: true, acceptedAnswers: ['"DEVOIR"', "'DEVOIR'", 'DEVOIR'] },
              ],
            },
          ],
        },
        presetHints: {
          level1: 'Lis attentivement la colonne Description pour savoir si le résultat attendu est un nombre, un booléen ou une chaîne.',
          level2: 'Si une sous-chaîne n’est pas trouvée par pos(), le résultat est toujours -1.',
          level3: 'Dans "baccalauréat 2023" : b(0) a(1) c(2) c(3) a(4) l(5)... compte jusqu’à l’indice 11 inclus !',
          level4: 'Attention sur la ligne convch(2020) : le résultat doit être entouré de guillemets ("2020") car c’est une chaîne.',
        },
        conceptToReview: 'Fonctions prédéfinies sur les chaînes (page 12)',
        needsTeacherReview: true,
        reviewNote:
          'Page 12 : Dans le PDF source, la ligne "effacer(ch, d, f)" affiche comme exemple "ch1 ← sous_Chaîne(\"baccalauréat 2023\", 5, 12)" au lieu d’un exemple effacer(), et la ligne valeur() montre un deuxième cas "2/info2" sans résultat numérique.',
        active: true,
      },
    ],
  },
  {
    id: 'ch2-conditionnelles',
    order: 2,
    title: 'Chapitre 2 : Les Structures Conditionnelles',
    subtitle: 'Forme réduite, alternative, généralisée (if...elif...else) & choix multiple (match...case)',
    sourcePages: 'Pages 13–17',
    description:
      'Choisir et écrire la structure conditionnelle la plus adaptée à un problème : réduite, alternative complète, généralisée imbriquée et structure à choix multiple.',
    lessons: [
      {
        id: 'les-2-1-rappel',
        chapterId: 'ch2-conditionnelles',
        order: 1,
        title: 'Rappel : Formes réduite et alternative (complète)',
        sourcePages: 'Page 13',
        objectives: [
          'Consolider les acquis de 2ème année (Forme réduite et Forme alternative)',
          'Lire et construire un diagramme de flux conditionnel',
        ],
        definitions: [
          {
            term: 'Forme réduite',
            meaning: 'Exécute un traitement uniquement si la condition est vraie (Si condition Alors Traitement FinSi).',
          },
          {
            term: 'Forme alternative (complète)',
            meaning: 'Choix binaire : exécute Traitement 1 si Vrai, sinon Traitement 2.',
          },
        ],
        contentSections: [
          {
            heading: 'Application : Contrôle de majorité (âge ≥ 18)',
            body: 'Si l’âge saisi est supérieur ou égal à 18, on affiche "Majeur", sinon on affiche "Mineur".',
          },
        ],
        syntaxExamples: [
          {
            title: 'Forme alternative en Algo et Python',
            algo: 'Si (age >= 18) Alors\n    Ecrire("Majeur")\nSinon\n    Ecrire("Mineur")\nFinSi',
            python: "age = int(input('Entrez votre âge : '))\nif age >= 18:\n    print('Majeur')\nelse:\n    print('Mineur')",
          },
        ],
        comprehensionCheck: {
          prompt: 'Quand utilise-t-on une structure conditionnelle de forme réduite ?',
          options: [
            'Quand il y a exactement deux traitements opposés',
            'Quand il y a un traitement à exécuter uniquement si la condition est vraie',
            'Quand il y a plus de 5 cas possibles',
            'Pour répéter une instruction 10 fois',
          ],
          correctIndex: 1,
          explanation: 'La forme réduite n’a pas de branche Sinon : elle agit seulement si la condition est vraie.',
        },
      },
      {
        id: 'les-2-2-generalisee',
        chapterId: 'ch2-conditionnelles',
        order: 2,
        title: 'La structure conditionnelle généralisée (if...elif...else)',
        sourcePages: 'Page 14',
        objectives: [
          'Comprendre pourquoi un seul if...else ne suffit pas pour plusieurs paliers',
          'Maîtriser la structure généralisée Si...Alors...Sinon Si...Sinon...FinSi (if...elif...else)',
        ],
        definitions: [
          {
            term: 'Structure conditionnelle généralisée',
            meaning: 'Permet de tester une suite de conditions. Dès qu’une condition est vraie, son bloc est exécuté et on sort immédiatement de la structure.',
          },
        ],
        contentSections: [
          {
            heading: 'Situation-problème N°1 : Mention au Baccalauréat',
            body: 'Selon la moyenne M : Très Bien (M ≥ 16), Bien (12 ≤ M < 16), Passable (10 ≤ M < 12), Refusé (M < 10).',
            bullets: [
              'Les conditions sont testées dans l’ordre de haut en bas.',
              'Dès qu’un test est Vrai, les autres branches elif/else ne sont pas évaluées.',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Syntaxe généralisée',
            algo: 'Si condition1 Alors\n    Traitement 1\nSinon Si condition2 Alors\n    Traitement 2\nSinon\n    Traitement par défaut\nFinSi',
            python: 'if condition_1:\n    traitement1\nelif condition_2:\n    traitement2\nelse:\n    traitement_defaut',
          },
        ],
        interactiveDemo: {
          title: 'Simulation pas à pas : Mention au Baccalauréat (M = 13.5)',
          description: 'Observe comment Python évalue les conditions de haut en bas et sort dès la première branche vraie.',
          codeLines: [
            'M = 13.5',
            'if M >= 16:',
            '    print("Très Bien")',
            'elif M >= 12:',
            '    print("Bien")',
            'elif M >= 10:',
            '    print("Passable")',
            'else:',
            '    print("Refusé")',
          ],
          steps: [
            {
              label: 'Initialisation',
              highlightLine: 0,
              variables: { M: 13.5 },
              explanation: 'On dispose de la moyenne M = 13.5.',
            },
            {
              label: 'Test 1 : M >= 16',
              highlightLine: 1,
              variables: { M: 13.5 },
              conditionEvaluated: '13.5 >= 16',
              conditionResult: false,
              explanation: '13.5 >= 16 est FAUX : on passe au elif suivant.',
            },
            {
              label: 'Test 2 : M >= 12',
              highlightLine: 3,
              variables: { M: 13.5 },
              conditionEvaluated: '13.5 >= 12',
              conditionResult: true,
              explanation: '13.5 >= 12 est VRAI : on entre dans cette branche !',
            },
            {
              label: 'Exécution et sortie',
              highlightLine: 4,
              variables: { M: 13.5 },
              output: 'Bien',
              explanation: 'Le programme affiche "Bien" et ignore les tests M >= 10 et else.',
            },
          ],
        },
        comprehensionCheck: {
          prompt: 'Dans if M >= 16 ... elif M >= 12 ... si M = 17, combien de branches sont exécutées ?',
          options: ['Deux branches (16 et 12)', 'Une seule branche (Très Bien)', 'Aucune', 'Toutes'],
          correctIndex: 1,
          explanation: 'Dès que M >= 16 est vrai, on exécute "Très Bien" et on quitte la structure conditionnelle.',
        },
      },
      {
        id: 'les-2-3-choix-multiple',
        chapterId: 'ch2-conditionnelles',
        order: 3,
        title: 'La structure à choix multiple (Selon / match...case)',
        sourcePages: 'Page 16',
        objectives: [
          'Utiliser la structure à choix multiple lorsque la décision dépend de la valeur exacte d’une variable',
          'Respecter la règle impérative sur le sélecteur (type scalaire)',
        ],
        definitions: [
          {
            term: 'Sélecteur scalaire',
            meaning: 'Le sélecteur doit être de type Entier (int), Caractère (str de longueur 1) ou Booléen (bool). Les réels sont interdits.',
          },
        ],
        contentSections: [
          {
            heading: 'Situation-problème N°2 : Jour de la semaine & Calculatrice',
            body: 'À partir de Python 3.10, l’instruction match...case remplace élégamment une longue suite de elif d’égalité.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Selon (Algorithme) vs match...case (Python 3.10+)',
            algo: 'Selon selecteur\n    Val1 : Traitement 1\n    Val2 : Traitement 2\n    Sinon : Traitement_defaut\nFin_Selon',
            python: 'match selecteur:\n    case val1:\n        traitement1\n    case val2:\n        traitement2\n    case _:\n        traitement_defaut',
          },
        ],
        comprehensionCheck: {
          prompt: 'Quel symbole représente le cas par défaut ("Sinon") dans match...case en Python ?',
          options: ['case else:', 'case default:', 'case _:', 'case *:'],
          correctIndex: 2,
          explanation: 'En Python, le joker underscore `case _:` capture toutes les autres valeurs non traitées.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p15-1',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Exercice 1 (p. 15)',
        title: 'Les états de l’eau selon la température',
        category: 'Exercice guidé',
        sourcePage: 15,
        difficulty: 'Découverte',
        estimatedMinutes: 12,
        kind: 'python',
        originalStatement:
          'Écrire un programme qui permet de lire les températures de l’eau puis afficher son état.\nLes trois formes de l’eau sont :\n• Si la température est strictement inférieure à 0° : l’eau est à l’état « glace ».\n• Si la température est comprise entre 0° et 100° inclus : l’eau est à l’état « liquide ».\n• Si la température est strictement supérieure à 100° : l’eau est à l’état « gaz ».\nExemples : -5° → Eau = glace | 50° → Eau = liquide | 120° → Eau = gaz',
        understandWork:
          'Tu dois traduire l’organigramme de la page 15 en programme Python : demander la température T (nombre réel ou entier), puis utiliser if / elif / else pour afficher exactement le message correspondant à l’état de l’eau.',
        objectives: [
          'Traduire un diagramme de flux en structure if...elif...else',
          'Saisir une valeur numérique avec float(input(...))',
        ],
        reflectionQuestions: [
          'La température peut-elle être décimale ? Quel type utiliser (int ou float) ?',
          'Si T < 0 est faux, que suffit-il de tester pour le cas liquide ?',
        ],
        workspaceConfig: {
          starterPython: 'T = float(input("Température : "))\n# Écris la structure conditionnelle ci-dessous\n',
          defaultInputs: ['50'],
        },
        testCases: [
          { id: 'tc1', label: 'Glace (-5°)', inputs: ['-5'], expectedOutputs: ['Eau = glace'] },
          { id: 'tc2', label: 'Liquide (50°)', inputs: ['50'], expectedOutputs: ['Eau = liquide'] },
          { id: 'tc3', label: 'Limite liquide (100°)', inputs: ['100'], expectedOutputs: ['Eau = liquide'] },
          { id: 'tc4', label: 'Gaz (120°)', inputs: ['120'], expectedOutputs: ['Eau = gaz'] },
        ],
        presetHints: {
          level1: 'Commence par tester le premier losange du diagramme : if T < 0:.',
          level2: 'Si T < 0 est faux, T est déjà >= 0. Il suffit donc de tester elif T <= 100:.',
          level3: 'Pour les valeurs > 100, la branche else: suffit sans avoir besoin de réécrire la condition.',
          level4: 'Vérifie que l’affichage respecte la forme attendue : print("Eau = glace"), print("Eau = liquide"), print("Eau = gaz").',
        },
        conceptToReview: 'Structure conditionnelle généralisée (page 14)',
        active: true,
      },
      {
        id: 'ex-p15-2',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Exercice 2 (p. 15)',
        title: 'Résolution d’une équation du second degré',
        category: 'Exercice guidé',
        sourcePage: 15,
        difficulty: 'Entraînement',
        estimatedMinutes: 18,
        kind: 'python',
        originalStatement:
          'Une équation de second degré s’écrit sous la forme : ax² + bx + c = 0.\nDémarche : 1) Saisir les coefficients a, b et c ; 2) Calculer le discriminant Δ = b² - 4ac ; 3) Afficher la solution en se basant sur la valeur du discriminant (Δ > 0 : deux solutions x1, x2 ; Δ = 0 : une solution -b/(2a) ; Δ < 0 : aucune solution).\nTravail demandé : Faire le programme Python permettant de résoudre une équation de second degré.',
        understandWork:
          'Tu dois importer la racine carrée (`from math import sqrt`), lire les 3 coefficients a, b et c, calculer delta = b**2 - 4*a*c, puis traiter les 3 cas possibles avec `if / elif / else`. Pense aussi au cas où a == 0 (ou garde l’hypothèse a ≠ 0 en vérifiant les parenthèses dans `(-b + sqrt(delta)) / (2 * a)`).',
        objectives: [
          'Importer et utiliser math.sqrt en Python',
          'Écrire correctement les parenthèses dans les formules mathématiques',
          'Distinguer les 3 branches selon le signe du discriminant Δ',
        ],
        reflectionQuestions: [
          'Dans la formule (-b + √Δ) / (2a), pourquoi les parenthèses autour de (2 * a) sont-elles indispensables ?',
          'Dans quel cas faut-il calculer sqrt(delta) pour éviter une erreur sur nombre négatif ?',
        ],
        workspaceConfig: {
          starterPython:
            'from math import sqrt\na = float(input("a = "))\nb = float(input("b = "))\nc = float(input("c = "))\n# Calculer delta puis traiter les 3 cas\n',
          defaultInputs: ['1', '-3', '2'],
        },
        testCases: [
          { id: 'tc1', label: 'Δ > 0 (x² - 3x + 2 = 0)', inputs: ['1', '-3', '2'], expectedOutputs: ['2.0', '1.0'] },
          { id: 'tc2', label: 'Δ = 0 (x² - 2x + 1 = 0)', inputs: ['1', '-2', '1'], expectedOutputs: ['1.0'] },
          { id: 'tc3', label: 'Δ < 0 (x² + 1 = 0)', inputs: ['1', '0', '1'], expectedOutputs: ['Aucune solution'] },
        ],
        presetHints: {
          level1: 'Calcule d’abord delta = b**2 - 4 * a * c avant le premier if.',
          level2: 'Ne calcule sqrt(delta) que dans la branche if delta > 0:, sinon Python déclenchera une erreur si delta < 0 !',
          level3: 'Écris bien / (2 * a) avec des parenthèses autour de 2 * a.',
          level4: 'Pour delta == 0, la solution double est -b / (2 * a) ; pour delta < 0, affiche "Aucune solution".',
        },
        conceptToReview: 'Fonctions numériques (sqrt) et conditionnelle généralisée',
        active: true,
      },
      {
        id: 'ex-p15-3',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Exercice 3 (p. 15)',
        title: 'Calcul du montant des impôts d’un salarié',
        category: 'Exercice guidé',
        sourcePage: 15,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'python',
        originalStatement:
          'On veut calculer le montant des impôts d’un salarié selon la grille :\n• sb < 150 : 5%\n• sb < 300 : 10%\n• sb < 600 : 20%\n• sb >= 600 : 25%\nÉcrire un programme qui permet de saisir le salaire brut (sb) et d’afficher le montant des impôts et le salaire net.\nExemple : Salaire brut : 700 → Impôts= 175.0  Salaire net= 525.0',
        understandWork:
          'Tu dois lire le salaire brut sb, déterminer le taux d’impôt applicable grâce à une structure conditionnelle généralisée par tranches, puis calculer impots = sb * taux et salaire_net = sb - impots.',
        objectives: [
          'Modéliser un barème par tranches avec if...elif...else',
          'Calculer un pourcentage et une valeur nette',
        ],
        reflectionQuestions: [
          'Dans quel ordre dois-tu tester les seuils 150, 300 et 600 ?',
          'Comment obtenir le salaire net à partir du salaire brut et du montant des impôts ?',
        ],
        workspaceConfig: {
          starterPython: 'sb = float(input("Salaire brut : "))\n',
          defaultInputs: ['700'],
        },
        testCases: [
          { id: 'tc1', label: 'Tranche >= 600 (700)', inputs: ['700'], expectedOutputs: ['175.0', '525.0'] },
          { id: 'tc2', label: 'Tranche < 150 (100)', inputs: ['100'], expectedOutputs: ['5.0', '95.0'] },
          { id: 'tc3', label: 'Tranche < 300 (200)', inputs: ['200'], expectedOutputs: ['20.0', '180.0'] },
        ],
        presetHints: {
          level1: 'Définis d’abord une variable taux selon la tranche du salaire sb.',
          level2: 'En testant sb < 150, puis elif sb < 300, puis elif sb < 600, chaque tranche est bien isolée.',
          level3: 'Une fois taux déterminé (0.05, 0.10, 0.20 ou 0.25), calcule impots = sb * taux et net = sb - impots.',
          level4: 'Affiche le résultat comme dans l’exemple : print("Impôts=", impots, "Salaire net=", net).',
        },
        conceptToReview: 'Conditionnelle généralisée (page 14)',
        active: true,
      },
      {
        id: 'ex-p17-1',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Série — Exercice 1 (p. 17)',
        title: 'Traçage à la main (Conditionnelle généralisée)',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Découverte',
        estimatedMinutes: 10,
        kind: 'trace_table',
        originalStatement:
          'Sans exécuter le programme, compléter le tableau pour x = 7, x = 12 et x = 18 :\nif x < 10:\n    y = x + 2\nelif x < 15:\n    y = x * 2\nelse:\n    y = x - 3\nprint(y)',
        understandWork:
          'Pour chacune des 3 valeurs de x (7, 12 et 18), tu dois indiquer quelle condition est testée jusqu’à trouver la branche vraie, la valeur obtenue pour y et ce que print(y) affiche.',
        objectives: [
          'Suivre le flux d’exécution d’un bloc if...elif...else sans ordinateur',
        ],
        reflectionQuestions: [
          'Si x = 7, le programme vérifie-t-il elif x < 15 ?',
        ],
        workspaceConfig: {
          codeSnippet: 'if x < 10:\n    y = x + 2\nelif x < 15:\n    y = x * 2\nelse:\n    y = x - 3\nprint(y)',
          tableHeaders: ['x', 'Condition testée jusqu’à la branche vraie', 'y', 'Affichage'],
          tableRows: [
            {
              id: 't7',
              cells: [
                { key: 'x', prefilled: '7', editable: false },
                { key: 'cond', label: 'Condition vraie', editable: true, acceptedAnswers: ['x < 10', '7 < 10'] },
                { key: 'y', label: 'y', editable: true, acceptedAnswers: ['9'] },
                { key: 'out', label: 'Affichage', editable: true, acceptedAnswers: ['9'] },
              ],
            },
            {
              id: 't12',
              cells: [
                { key: 'x', prefilled: '12', editable: false },
                { key: 'cond', label: 'Condition vraie', editable: true, acceptedAnswers: ['x < 15', '12 < 15', 'x < 10 (Faux) puis x < 15'] },
                { key: 'y', label: 'y', editable: true, acceptedAnswers: ['24'] },
                { key: 'out', label: 'Affichage', editable: true, acceptedAnswers: ['24'] },
              ],
            },
            {
              id: 't18',
              cells: [
                { key: 'x', prefilled: '18', editable: false },
                { key: 'cond', label: 'Condition vraie', editable: true, acceptedAnswers: ['else', 'aucune (else)', 'x < 10 (Faux), x < 15 (Faux) -> else'] },
                { key: 'y', label: 'y', editable: true, acceptedAnswers: ['15'] },
                { key: 'out', label: 'Affichage', editable: true, acceptedAnswers: ['15'] },
              ],
            },
          ],
        },
        presetHints: {
          level1: 'Teste toujours la première condition if x < 10 en premier.',
          level2: 'Pour x = 12, 12 < 10 est Faux, donc Python évalue elif x < 15.',
          level3: 'Pour x = 18, les deux conditions sont Fausses : c’est la branche else qui s’exécute.',
          level4: 'Vérifie tes calculs : 7+2, 12*2, 18-3.',
        },
        conceptToReview: 'Exécution pas à pas de if...elif...else',
        active: true,
      },
      {
        id: 'ex-p17-2',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-3-choix-multiple',
        numberLabel: 'Série — Exercice 2 (p. 17)',
        title: 'QCM : Syntaxe conditionnelle Python',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Découverte',
        estimatedMinutes: 8,
        kind: 'qcm',
        originalStatement: 'Répondre aux 4 questions à choix multiples sur les structures conditionnelles en Python.',
        understandWork:
          'Vérifie ta connaissance précise des mots-clés Python : elif, ==, match...case et la version minimale de Python pour match...case.',
        objectives: [
          'Maîtriser les mots-clés exacts de la sélection en Python',
        ],
        reflectionQuestions: [
          'Quel mot-clé sert à tester une autre condition lorsque la précédente est fausse ?',
        ],
        workspaceConfig: {
          questions: [
            {
              id: 'q1',
              prompt: '1) Quelle instruction Python commence une branche alternative si toutes les conditions précédentes sont fausses ?',
              options: [
                { label: 'A. otherwise', value: 'A' },
                { label: 'B. elif', value: 'B' },
                { label: 'C. else', value: 'C' },
                { label: 'D. then', value: 'D' },
              ],
              correctValue: 'C',
              explanation: '`else:` représente le cas par défaut si toutes les conditions précédentes sont fausses.',
            },
            {
              id: 'q2',
              prompt: '2) Quel opérateur Python teste l’égalité ?',
              options: [
                { label: 'A. =', value: 'A' },
                { label: 'B. ==', value: 'B' },
                { label: 'C. :=', value: 'C' },
                { label: 'D. <>', value: 'D' },
              ],
              correctValue: 'B',
              explanation: '`=` sert à l’affectation et `==` sert à comparer deux valeurs.',
            },
            {
              id: 'q3',
              prompt: '3) Quelle forme est la plus lisible pour associer les valeurs 1, 2, 3 à trois traitements distincts ?',
              options: [
                { label: 'A. match...case', value: 'A' },
                { label: 'B. if...elif...else', value: 'B' },
                { label: 'C. for', value: 'C' },
                { label: 'D. while', value: 'D' },
              ],
              correctValue: 'A',
              explanation: 'Pour des égalités exactes sur une variable scalaire, `match...case` est la plus lisible.',
            },
            {
              id: 'q4',
              prompt: '4) À partir de quelle version Python match...case est-il disponible ?',
              options: [
                { label: 'A. 3.6', value: 'A' },
                { label: 'B. 3.8', value: 'B' },
                { label: 'C. 3.9', value: 'C' },
                { label: 'D. 3.10', value: 'D' },
              ],
              correctValue: 'D',
              explanation: 'Le filtrage par motif (`match...case`) a été introduit dans Python 3.10 (voir p. 16).',
            },
          ],
        },
        presetHints: {
          level1: 'Relis la fiche page 16 si tu hésites sur match...case.',
          level2: 'Ne confonds pas `elif` (sinon si, avec condition) et `else` (sinon, sans condition).',
          level3: 'En Python, `=` affecte une valeur alors que `==` compare.',
          level4: 'Python 3.10 est la version mentionnée explicitement dans le cours page 16.',
        },
        conceptToReview: 'Syntaxe conditionnelle Python (pages 13–16)',
        active: true,
      },
      {
        id: 'ex-p17-3',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Série — Exercice 3 (p. 17)',
        title: 'Compléter les blancs (Positif / Nul / Négatif)',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Découverte',
        estimatedMinutes: 8,
        kind: 'fill_blanks',
        originalStatement:
          'Compléter les blancs afin d’afficher « Positif » si n > 0, « Nul » si n = 0, et « Négatif » sinon :\nif n ___ 0:\n    print("Positif")\n____ n ___ 0:\n    print("Nul")\n____:\n    print("Négatif")',
        understandWork:
          'Tu dois remplir les 5 trous du programme Python avec les bons opérateurs de comparaison et les bons mots-clés de structure conditionnelle généralisée.',
        objectives: [
          'Compléter correctement la syntaxe if...elif...else et les comparateurs',
        ],
        reflectionQuestions: [
          'Quel opérateur traduit « strictement supérieur à » et quel opérateur teste l’égalité ?',
        ],
        workspaceConfig: {
          blanksTemplate:
            'if n [b1] 0:\n    print("Positif")\n[b2] n [b3] 0:\n    print("Nul")\n[b4]:\n    print("Négatif")',
          blankFields: [
            { id: 'b1', label: '1er comparateur (Positif)', placeholder: '>', acceptedAnswers: ['>'] },
            { id: 'b2', label: 'Mot-clé branche 2', placeholder: 'elif', acceptedAnswers: ['elif'] },
            { id: 'b3', label: '2e comparateur (Nul)', placeholder: '==', acceptedAnswers: ['=='] },
            { id: 'b4', label: 'Mot-clé branche finale', placeholder: 'else', acceptedAnswers: ['else'] },
          ],
        },
        presetHints: {
          level1: 'Relis la condition demandée pour "Positif" : n > 0.',
          level2: 'En Python, le « Sinon Si » s’écrit en un seul mot : elif.',
          level3: 'Attention : pour tester l’égalité n = 0 en Python, on utilise le double égal ==.',
          level4: 'La dernière branche sans condition est else:.',
        },
        conceptToReview: 'if...elif...else (page 14)',
        active: true,
      },
      {
        id: 'ex-p17-4',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-1-rappel',
        numberLabel: 'Série — Exercice 4 (p. 17)',
        title: 'Corriger un programme Python erroné',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Entraînement',
        estimatedMinutes: 10,
        kind: 'python',
        originalStatement:
          'Le programme ci-dessous contient des erreurs. Les repérer et proposer une version correcte.\nif note = 10\n    print("Admis")\nelse:\n    print("Non admis")',
        understandWork:
          'Observe attentivement la première ligne du programme donné : il y manque un symbole de comparaison correct et le deux-points en fin de ligne. Saisis aussi une variable `note` (ou garde l’entrée utilisateur) et vérifie que le programme s’exécute sans erreur de syntaxe.',
        objectives: [
          'Identifier et corriger une erreur d’opérateur d’égalité (= vs ==)',
          'Repérer un deux-points manquant en fin d’instruction if',
        ],
        reflectionQuestions: [
          'Que manque-t-il à la fin de la ligne `if ...` ?',
          'Pour être admis, la note doit-elle être exactement égale à 10 ou >= 10 ?',
        ],
        workspaceConfig: {
          starterPython:
            'note = float(input("Note : "))\nif note = 10\n    print("Admis")\nelse:\n    print("Non admis")',
          defaultInputs: ['12'],
        },
        testCases: [
          { id: 'tc1', label: 'Note 10 (Admis)', inputs: ['10'], expectedOutputs: ['Admis'] },
          { id: 'tc2', label: 'Note 7 (Non admis)', inputs: ['7'], expectedOutputs: ['Non admis'] },
        ],
        presetHints: {
          level1: 'Regarde la ligne 2 : il y a deux erreurs de syntaxe Python sur cette seule ligne.',
          level2: 'En Python, `=` est une affectation, pas une comparaison.',
          level3: 'Toute instruction `if` doit se terminer par deux-points `:`.',
          level4: 'Utilise `if note >= 10:` (ou `== 10` si test exact, `>= 10` pour une moyenne d’admission) et vérifie l’indentation.',
        },
        conceptToReview: 'Opérateur == et syntaxe if/else',
        active: true,
      },
      {
        id: 'ex-p17-5',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Série — Exercice 5 (p. 17)',
        title: 'Remise au supermarché',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'python',
        originalStatement:
          'Écrire un programme qui lit un montant m et calcule le taux de remise : 0 % si m < 50 ; 5 % si 50 ≤ m ≤ 100 ; 10 % si 100 < m ≤ 200 ; 15 % si m > 200. Afficher le taux et le montant à payer. Vérifier que m n’est pas négatif.',
        understandWork:
          'Tu dois d’abord vérifier que le montant saisi m est valide (m >= 0). S’il est négatif, affiche un message d’erreur ; sinon, applique la structure conditionnelle généralisée pour trouver le taux de remise et calculer le montant final à payer.',
        objectives: [
          'Valider une donnée en entrée avant le traitement (m < 0)',
          'Enchaîner correctement les bornes d’intervalles en Python',
        ],
        reflectionQuestions: [
          'Comment traiter le cas d’erreur m < 0 dès le début du programme ?',
          'Si m = 100, quelle remise doit s’appliquer (5 % ou 10 %) ?',
        ],
        workspaceConfig: {
          starterPython: 'm = float(input("Montant m : "))\n',
          defaultInputs: ['150'],
        },
        testCases: [
          { id: 'tc1', label: 'Montant négatif (-10)', inputs: ['-10'], expectedOutputs: ['invalide'] },
          { id: 'tc2', label: 'm = 100 (5%)', inputs: ['100'], expectedOutputs: ['5', '95'] },
          { id: 'tc3', label: 'm = 250 (15%)', inputs: ['250'], expectedOutputs: ['15', '212.5'] },
        ],
        presetHints: {
          level1: 'Teste d’abord `if m < 0:` pour rejeter un montant négatif (affiche par exemple "Montant invalide").',
          level2: 'Dans la branche `else:` (ou avec `elif`), traite les tranches dans l’ordre croissant : `m < 50`, `m <= 100`, `m <= 200`, `else`.',
          level3: 'Montant à payer = m * (1 - taux / 100).',
          level4: 'Vérifie les bornes exactes : 100 est dans la tranche 5 % (≤ 100), 101 est dans la tranche 10 %.',
        },
        conceptToReview: 'Validation d’entrée et structure généralisée',
        active: true,
      },
      {
        id: 'ex-p17-6',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-3-choix-multiple',
        numberLabel: 'Série — Exercice 6 (p. 17)',
        title: 'Choix multiple — Code de menu (match...case)',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'python',
        originalStatement:
          'Écrire un programme avec match...case qui lit un code de menu : 1 → « Thé » ; 2 → « Café » ; 3 ou 4 → « Jus » ; autre valeur → « Choix invalide ».',
        understandWork:
          'Tu dois lire un entier `code`, puis utiliser l’instruction `match code:` avec un cas combiné `case 3 | 4:` pour afficher « Jus », et `case _:` pour « Choix invalide ».',
        objectives: [
          'Écrire une structure match...case en Python',
          'Regrouper deux valeurs dans un même case avec `|`',
        ],
        reflectionQuestions: [
          'Comment regroupe-t-on deux cas (3 ou 4) dans une seule clause `case` en Python ?',
        ],
        workspaceConfig: {
          starterPython: 'code = int(input("Code menu : "))\nmatch code:\n    ',
          defaultInputs: ['3'],
        },
        testCases: [
          { id: 'tc1', label: 'Code 1 -> Thé', inputs: ['1'], expectedOutputs: ['Thé'] },
          { id: 'tc2', label: 'Code 3 -> Jus', inputs: ['3'], expectedOutputs: ['Jus'] },
          { id: 'tc3', label: 'Code 4 -> Jus', inputs: ['4'], expectedOutputs: ['Jus'] },
          { id: 'tc4', label: 'Code 9 -> Choix invalide', inputs: ['9'], expectedOutputs: ['Choix invalide'] },
        ],
        presetHints: {
          level1: 'N’oublie pas de convertir la saisie en entier avec `int(input(...))`.',
          level2: 'En Python, pour tester 3 ou 4 dans match...case, on écrit `case 3 | 4:`.',
          level3: 'Le cas par défaut s’écrit `case _:`.',
          level4: 'Vérifie l’orthographe exacte des messages : "Thé", "Café", "Jus", "Choix invalide".',
        },
        conceptToReview: 'match...case (page 16)',
        active: true,
      },
      {
        id: 'ex-p17-7',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-3-choix-multiple',
        numberLabel: 'Série — Exercice 7 (p. 17)',
        title: 'Problème de synthèse : Calculatrice complète',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Application',
        estimatedMinutes: 18,
        kind: 'python',
        originalStatement:
          'Lire deux nombres a et b puis un opérateur parmi +, -, *, /. Afficher le résultat correspondant. Si l’opérateur est inconnu, afficher « Opérateur invalide ». Si l’opérateur est / et b = 0, afficher « Division impossible ». Utiliser une structure à choix multiple si la version de Python le permet.',
        understandWork:
          'Tu reprends la calculatrice de la page 16 en y ajoutant la division `/`. Il faut particulièrement protéger la division par zéro en testant `if b == 0:` à l’intérieur du cas `/` !',
        objectives: [
          'Combiner match...case et conditionnelle imbriquée',
          'Gérer le cas d’erreur division par zéro',
        ],
        reflectionQuestions: [
          'Dans quel cas précis la division est-elle impossible ?',
          'De quel type doivent être a et b ?',
        ],
        workspaceConfig: {
          starterPython:
            'a = float(input("a = "))\nb = float(input("b = "))\nop = input("Opérateur (+, -, *, /) : ")\n',
          defaultInputs: ['10', '0', '/'],
        },
        testCases: [
          { id: 'tc1', label: 'Division par 0', inputs: ['10', '0', '/'], expectedOutputs: ['Division impossible'] },
          { id: 'tc2', label: 'Multiplication 4 * 5', inputs: ['4', '5', '*'], expectedOutputs: ['20'] },
          { id: 'tc3', label: 'Opérateur inconnu %', inputs: ['4', '5', '%'], expectedOutputs: ['Opérateur invalide'] },
        ],
        presetHints: {
          level1: 'Lis a et b en `float`, et op en chaîne (`input(...)`).',
          level2: 'Utilise `match op:` avec `case "+":`, `case "-":`, `case "*":`, `case "/":` et `case _:`.',
          level3: 'Dans `case "/":`, imbrique un `if b == 0:` pour afficher "Division impossible", sinon `else: print(a / b)`.',
          level4: 'Vérifie que l’ordre des `input` correspond bien à a, b puis opérateur.',
        },
        conceptToReview: 'Structure à choix multiple et cas particuliers',
        active: true,
      },
      {
        id: 'ex-p17-8',
        chapterId: 'ch2-conditionnelles',
        lessonId: 'les-2-2-generalisee',
        numberLabel: 'Série — Exercice 8 (p. 17)',
        title: 'Problème de synthèse : Qualification de température',
        category: 'Exercice d’application',
        sourcePage: 17,
        difficulty: 'Application',
        estimatedMinutes: 12,
        kind: 'python',
        originalStatement:
          'Afficher « Valeur invalide » si T < -50 ou T > 60 ; sinon afficher « Froid » si T < 10, « Agréable » si T < 25, et « Chaud » dans les autres cas.',
        understandWork:
          'Écris un programme Python qui lit une température T puis teste d’abord la plage de validité (-50 ≤ T ≤ 60) avec `or` avant de classifier la température en Froid, Agréable ou Chaud.',
        objectives: [
          'Utiliser l’opérateur logique `or` pour contrôler une plage invalide',
          'Ordonner correctement les conditions d’un if...elif...else',
        ],
        reflectionQuestions: [
          'Que se passe-t-il si on teste T < 10 avant T < -50 ?',
        ],
        workspaceConfig: {
          starterPython: 'T = float(input("Température T : "))\n',
          defaultInputs: ['18'],
        },
        testCases: [
          { id: 'tc1', label: 'Invalide (-60)', inputs: ['-60'], expectedOutputs: ['Valeur invalide'] },
          { id: 'tc2', label: 'Froid (5)', inputs: ['5'], expectedOutputs: ['Froid'] },
          { id: 'tc3', label: 'Agréable (18)', inputs: ['18'], expectedOutputs: ['Agréable'] },
          { id: 'tc4', label: 'Chaud (32)', inputs: ['32'], expectedOutputs: ['Chaud'] },
        ],
        presetHints: {
          level1: 'Le test d’invalidité `if T < -50 or T > 60:` doit impérativement être placé en premier !',
          level2: 'Ensuite `elif T < 10:` capture les températures entre -50 et 10.',
          level3: 'Puis `elif T < 25:` capture [10, 25[, et `else:` capture [25, 60].',
          level4: 'Vérifie l’orthographe exacte : "Valeur invalide", "Froid", "Agréable", "Chaud".',
        },
        conceptToReview: 'Opérateurs logiques et ordre des conditions',
        active: true,
      },
    ],
  },
  {
    id: 'ch3-boucle-pour',
    order: 3,
    title: 'Chapitre 3 : Les Structures Itératives Complètes (Boucle « Pour »)',
    subtitle: 'Série 3 — Boucle Pour, fonction range(), chaînes, arithmétique et Projet 1',
    sourcePages: 'Pages 18–21',
    description:
      'Maîtriser la boucle bornée Pour / for...in range() lorsque le nombre de répétitions est connu à l’avance, et l’appliquer aux chaînes, calculs mathématiques, débogage et combinaisons.',
    lessons: [
      {
        id: 'les-3-1-pour',
        chapterId: 'ch3-boucle-pour',
        order: 1,
        title: 'La boucle « Pour » et la fonction range()',
        sourcePages: 'Page 18',
        objectives: [
          'Comprendre la syntaxe Pour i de Vi à Vf (pas) Faire',
          'Maîtriser range(n), range(n, m) et range(n, m, p) en Python',
        ],
        definitions: [
          {
            term: 'Boucle bornée (Pour)',
            meaning: 'Structure itérative utilisée lorsque le nombre de répétitions est connu à l’avance.',
          },
          {
            term: 'range(Vi, Vf+1, pas)',
            meaning: 'Génère une suite d’entiers de Vi jusqu’à Vf inclus (car la borne de fin de range est exclue en Python).',
          },
        ],
        contentSections: [
          {
            heading: 'Les trois formes de range() en Python',
            body: 'Attention : la borne de fin dans range() est toujours exclue !',
            bullets: [
              'range(n) : parcourt 0, 1, 2, ..., n - 1.',
              'range(n, m) : parcourt n, n+1, ..., m - 1.',
              'range(n, m, p) : parcourt n, n+p, n+2p, ... tant que l’on n’atteint pas m.',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Exemple du cours (page 18)',
            algo: 'Pour i de 1 à 5 Faire\n    Ecrire("Prog", i)\nFin Pour',
            python: 'for i in range(1, 6):\n    print("Prog", i)',
            note: 'Affiche Prog 1 jusqu’à Prog 5 (pas = 1).',
          },
        ],
        interactiveDemo: {
          title: 'Visualisation pas à pas : Boucle Pour de 1 à 4',
          description: 'Observe l’évolution automatique du compteur i et la construction d’une somme S.',
          codeLines: [
            'S = 0',
            'for i in range(1, 5):',
            '    S = S + i',
            'print(S)',
          ],
          steps: [
            { label: 'Initialisation', highlightLine: 0, variables: { S: 0 }, explanation: 'S est initialisé à 0 avant la boucle.' },
            { label: 'Tour 1 (i=1)', highlightLine: 2, variables: { i: 1, S: 1 }, explanation: 'i prend 1, S devient 0 + 1 = 1.' },
            { label: 'Tour 2 (i=2)', highlightLine: 2, variables: { i: 2, S: 3 }, explanation: 'i prend 2, S devient 1 + 2 = 3.' },
            { label: 'Tour 3 (i=3)', highlightLine: 2, variables: { i: 3, S: 6 }, explanation: 'i prend 3, S devient 3 + 3 = 6.' },
            { label: 'Tour 4 (i=4)', highlightLine: 2, variables: { i: 4, S: 10 }, explanation: 'i prend 4 (dernier avant 5), S devient 6 + 4 = 10.' },
            { label: 'Sortie', highlightLine: 3, variables: { i: 4, S: 10 }, output: '10', explanation: 'La boucle est terminée, print(S) affiche 10.' },
          ],
        },
        comprehensionCheck: {
          prompt: 'Quelles valeurs génère range(2, 11, 3) ?',
          options: ['2, 5, 8, 11', '2, 5, 8', '2, 3, 4, ..., 10', '3, 6, 9'],
          correctIndex: 1,
          explanation: 'On part de 2 avec un pas de 3 : 2, 5, 8. Le suivant serait 11, or 11 est exclu.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p18-1',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 1 (p. 18)',
        title: 'La fonction range() — Vrai ou Faux et correction',
        category: 'Activité',
        sourcePage: 18,
        difficulty: 'Découverte',
        estimatedMinutes: 12,
        kind: 'true_false',
        originalStatement:
          'On vous demande de cocher la bonne réponse (Vrai ou Faux) pour chaque instruction et de donner le résultat correct si le résultat proposé est Faux.',
        understandWork:
          'Examine chacune des 7 boucles `for i in range(...)`. Vérifie si la liste des valeurs proposées pour `i` correspond exactement à ce que Python génère. Si c’est Faux, indique les vraies valeurs générées (ou « Aucune valeur » si la boucle ne tourne pas).',
        objectives: [
          'Prévoir exactement les bornes et le pas de range()',
          'Identifier un intervalle vide lorsque le sens du pas ne correspond pas aux bornes',
        ],
        reflectionQuestions: [
          'Dans range(5, 2), quel est le pas par défaut (+1 ou -1) ?',
          'La borne finale dans range(0, 4) est-elle incluse ?',
        ],
        workspaceConfig: {
          trueFalseItems: [
            {
              id: 'tf1',
              statement: 'for i in range(5):  →  Valeurs de i : 0,1,2,3,4',
              expectedValue: 'V',
              explanation: 'range(5) va de 0 à 4 inclus.',
            },
            {
              id: 'tf2',
              statement: 'for i in range(0,4):  →  Valeurs de i : 0,1,2,3,4',
              expectedValue: 'F',
              needsCorrectionIfFalse: true,
              expectedCorrection: '0,1,2,3',
              explanation: '4 est exclu dans range(0,4).',
            },
            {
              id: 'tf3',
              statement: 'for i in range(5,2):  →  Valeurs de i : 5,4,3,2',
              expectedValue: 'F',
              needsCorrectionIfFalse: true,
              expectedCorrection: 'Aucune',
              explanation: 'Sans pas négatif (-1), range(5,2) utilise le pas +1 et est donc vide.',
            },
            {
              id: 'tf4',
              statement: 'for i in range(5,2,-1):  →  Valeurs de i : 5,4,3,2',
              expectedValue: 'F',
              needsCorrectionIfFalse: true,
              expectedCorrection: '5,4,3',
              explanation: 'La borne d’arrêt 2 est toujours exclue, donc 5, 4, 3.',
            },
            {
              id: 'tf5',
              statement: 'for i in range(2,11,3):  →  Valeurs de i : 2,5,8',
              expectedValue: 'V',
              explanation: '2, 2+3=5, 5+3=8 (11 est exclu).',
            },
            {
              id: 'tf6',
              statement: 'for i in range(10,-10,-5):  →  Valeurs de i : 10,5,0,-5',
              expectedValue: 'V',
              explanation: '10, 5, 0, -5 (-10 est exclu).',
            },
            {
              id: 'tf7',
              statement: 'for i in range(0,len("Python")):  →  Valeurs de i : 0,1,2,3,4,5',
              expectedValue: 'V',
              explanation: 'len("Python") = 6, donc les indices de 0 à 5.',
            },
          ],
        },
        presetHints: {
          level1: 'Rappelle-toi la règle d’or : le second argument de range(a, b) n’est JAMAIS atteint.',
          level2: 'Si a > b et qu’il n’y a pas de 3e argument négatif, Python ne recule pas tout seul.',
          level3: 'Pour range(5, 2, -1), on s’arrête juste avant 2.',
          level4: 'Vérifie range(0,4) et range(5,2,-1) : dans les deux cas la borne de fin est exclue.',
        },
        conceptToReview: 'Fonction range() (page 18)',
        active: true,
      },
      {
        id: 'ex-p19-2',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 2 (p. 19)',
        title: 'Inverse d’une chaîne de caractères',
        category: 'Exercice d’application',
        sourcePage: 19,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire un algorithme d’un programme qui permet de saisir une chaîne de caractères ch, puis d’afficher cette chaîne dans l’ordre inverse.\nExemples : Si ch = "Python", le programme affiche "nohtyP". Si ch = "2eme SC", le programme affiche "CS eme2".',
        understandWork:
          'Tu dois construire une nouvelle chaîne inversée `ch_inv` (initialisée à `""`) en parcourant les caractères de `ch` avec une boucle Pour (soit de la fin vers le début, soit du début vers la fin en ajoutant chaque lettre devant `ch_inv`).',
        objectives: [
          'Parcourir une chaîne par indice avec une boucle Pour',
          'Construire une chaîne par concaténation progressive',
        ],
        reflectionQuestions: [
          'Quelle est l’initialisation de la chaîne résultat avant la boucle ?',
          'Si tu parcours i de 0 à long(ch)-1, faut-il écrire inv ← inv + ch[i] ou inv ← ch[i] + inv ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Inverse_Chaine\nDébut\n    Ecrire("Donner une chaîne : ")\n    Lire(ch)\n    \nFin',
          starterPython: 'ch = input("Donner une chaîne : ")\ninv = ""\n',
          defaultInputs: ['Python'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour'],
          criteriaNotes: ['Initialiser la chaîne résultat à ""', 'Parcourir la chaîne avec Pour', 'Concaténer dans l’ordre inverse et afficher'],
        },
        testCases: [
          { id: 'tc1', label: '"Python" -> "nohtyP"', inputs: ['Python'], expectedOutputs: ['nohtyP'] },
          { id: 'tc2', label: '"2eme SC" -> "CS eme2"', inputs: ['2eme SC'], expectedOutputs: ['CS eme2'] },
        ],
        presetHints: {
          level1: 'Crée d’abord une variable chaîne vide `inv ← ""` avant la boucle.',
          level2: 'Deux méthodes marchent : parcourir à l’envers de long(ch)-1 à 0 (pas -1), OU parcourir à l’endroit et placer ch[i] devant inv.',
          level3: 'Avec le parcours à l’endroit : `inv = ch[i] + inv` place chaque nouveau caractère au début.',
          level4: 'N’oublie pas d’afficher `inv` après la fin de la boucle, pas à l’intérieur.',
        },
        conceptToReview: 'Parcours de chaîne avec boucle Pour',
        active: true,
      },
      {
        id: 'ex-p19-3',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 3 (p. 19)',
        title: 'Calcul de la factorielle n!',
        category: 'Exercice d’application',
        sourcePage: 19,
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire un algorithme qui permet de saisir un entier n ≥ 0 puis calculer et afficher n!.\nn! = 1 * 2 * 3 * 4 * ... * n\nExemples : n=0 → 0! = 1 | n=1 → 1! = 1 | n=4 → 4! = 1*2*3*4 = 24',
        understandWork:
          'Tu dois calculer le produit cumulatif des entiers de 1 à n. Fais très attention à la valeur initiale de l’accumulateur de produit `f` pour que 0! donne bien 1 !',
        objectives: [
          'Initialiser un accumulateur multiplicatif à 1 (élément neutre)',
          'Gérer le cas particulier n = 0',
        ],
        reflectionQuestions: [
          'Que se passe-t-il si on initialise f à 0 au lieu de 1 ?',
          'Si f = 1 et que n = 0, la boucle Pour i de 1 à 0 tourne-t-elle ? Que vaut alors f ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Factorielle\nDébut\n    \nFin',
          starterPython: 'n = int(input("n = "))\n',
          defaultInputs: ['4'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour'],
          criteriaNotes: ['Initialiser f à 1 (pas à 0)', 'Boucle Pour i de 1 à n (ou 2 à n)', 'f ← f * i et afficher f'],
        },
        testCases: [
          { id: 'tc1', label: '0! = 1', inputs: ['0'], expectedOutputs: ['1'] },
          { id: 'tc2', label: '4! = 24', inputs: ['4'], expectedOutputs: ['24'] },
        ],
        presetHints: {
          level1: 'Pour une somme on initialise à 0, mais pour un produit il faut choisir l’élément neutre de la multiplication.',
          level2: 'Initialise `f ← 1` avant la boucle.',
          level3: 'Avec `for i in range(1, n + 1): f = f * i`, si n vaut 0, `range(1, 1)` est vide et f reste égal à 1 !',
          level4: 'Vérifie la borne de fin : `range(1, n + 1)` pour que n soit bien inclus.',
        },
        conceptToReview: 'Boucle Pour et accumulateur multiplicatif',
        active: true,
      },
      {
        id: 'ex-p19-4',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 4 (p. 19)',
        title: 'Calcul de x puissance y (sans opérateur **)',
        category: 'Exercice d’application',
        sourcePage: 19,
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire un algorithme qui permet de saisir deux entiers x et y (x > 0, y > 0) puis calculer et afficher x puissance y. Implémenter cette solution en Python.\nExemple : x = 2, y = 5 → 2^5 = 32',
        understandWork:
          'Calculer x puissance y avec une boucle revient à multiplier x par lui-même exactement y fois. Initialise un résultat `p` à 1 puis multiplie `p` par `x` à chaque tour de la boucle Pour.',
        objectives: [
          'Traduire une puissance répétée en boucle Pour',
          'Implémenter un algorithme itératif en Python',
        ],
        reflectionQuestions: [
          'Combien de fois doit-on multiplier par x pour obtenir x^y ?',
          'Quelle variable sert de compteur de boucle (1 à y) et quelle variable est multipliée ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Puissance\nDébut\n    \nFin',
          starterPython: 'x = int(input("x = "))\ny = int(input("y = "))\n',
          defaultInputs: ['2', '5'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour'],
          criteriaNotes: ['Initialiser p à 1', 'Répéter y fois : p ← p * x', 'Afficher p'],
        },
        testCases: [
          { id: 'tc1', label: '2^5 = 32', inputs: ['2', '5'], expectedOutputs: ['32'] },
          { id: 'tc2', label: '3^3 = 27', inputs: ['3', '3'], expectedOutputs: ['27'] },
        ],
        presetHints: {
          level1: '2^5 signifie 2 * 2 * 2 * 2 * 2 : on multiplie par x, y fois.',
          level2: 'Initialise `p = 1`, puis fais tourner `i` de `1` à `y` (`range(y)` ou `range(1, y + 1)`).',
          level3: 'Attention à ne pas écrire `p = p * i` ! On multiplie par `x`, pas par le compteur `i`.',
          level4: 'Affiche `p` une fois la boucle terminée.',
        },
        conceptToReview: 'Boucle Pour et accumulation',
        active: true,
      },
      {
        id: 'ex-p19-5',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 5 (p. 19)',
        title: 'Nombre parfait',
        category: 'Exercice d’application',
        sourcePage: 19,
        difficulty: 'Application',
        estimatedMinutes: 15,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire un algorithme qui permet de saisir un entier n > 0 puis afficher s’il est parfait ou non.\nUn nombre n est dit parfait s’il est égal à la somme de ses diviseurs sauf lui-même.\nExemple : n = 6, les diviseurs de 6 sauf lui-même : 1, 2 et 3 → 1 + 2 + 3 = 6 → 6 est parfait.',
        understandWork:
          'Tu dois parcourir tous les diviseurs potentiels `i` de `1` jusqu’à `n div 2` (ou `n - 1`), tester si `n mod i = 0`, et si oui ajouter `i` à une somme `s`. Après la boucle, compare `s` et `n` avec une conditionnelle.',
        objectives: [
          'Tester la divisibilité avec MOD (%)',
          'Combiner une boucle Pour avec une structure conditionnelle',
        ],
        reflectionQuestions: [
          'Quel est le plus grand diviseur propre possible d’un entier n (autre que lui-même) ?',
          'Comment tester si i divise n ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Nombre_Parfait\nDébut\n    \nFin',
          starterPython: 'n = int(input("n = "))\n',
          defaultInputs: ['6'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour', 'si'],
          criteriaNotes: ['Initialiser s ← 0', 'Tester les diviseurs de 1 à n div 2 (ou n-1)', 'Si n mod i = 0 alors s ← s + i', 'Comparer s = n après la boucle'],
        },
        testCases: [
          { id: 'tc1', label: '6 est parfait', inputs: ['6'], expectedOutputs: ['parfait'] },
          { id: 'tc2', label: '28 est parfait', inputs: ['28'], expectedOutputs: ['parfait'] },
          { id: 'tc3', label: '10 non parfait', inputs: ['10'], expectedOutputs: ['non', 'pas parfait'] },
        ],
        presetHints: {
          level1: 'Commence par initialiser une variable somme `s ← 0`.',
          level2: 'Un diviseur propre de n est compris entre 1 et n // 2 (car aucun entier > n/2 ne divise n sauf n lui-même).',
          level3: 'À l’intérieur de la boucle : `if n % i == 0: s = s + i`.',
          level4: 'C’est seulement APRÈS la boucle qu’on compare `if s == n:`.',
        },
        conceptToReview: 'Opérateur MOD et boucle Pour avec test',
        active: true,
      },
      {
        id: 'ex-p20-6',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 6 (p. 20)',
        title: 'Débogage d’un programme Python (inconnu.py)',
        category: 'Activité',
        sourcePage: 20,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'code_debug',
        originalStatement:
          'Repérer les lignes contenant des erreurs dans le programme suivant, expliquer leur cause et proposer la correction appropriée, puis déduire son rôle :\n1  x=input("donner un entier x")\n2  f=0\n3  for i in range(2,x):\n4      f=f*i\n5  print(f)',
        understandWork:
          'Analyse chacune des 5 lignes de ce programme qui doit calculer une opération mathématique célèbre. Trois lignes contiennent des erreurs (type de saisie, initialisation du produit, borne de fin de range). Identifie-les, explique pourquoi elles posent problème et corrige le code.',
        objectives: [
          'Diagnostiquer une erreur de type (str vs int)',
          'Repérer une erreur d’initialisation absorbante (f=0 dans un produit)',
          'Corriger une borne de range() manquante (x au lieu de x+1)',
        ],
        reflectionQuestions: [
          'Que renvoie `input(...)` sans `int(...)` ?',
          'Que vaut `0 * i` à chaque tour si `f = 0` ?',
          'Si x = 5, `range(2, 5)` va jusqu’à 4 ou 5 ?',
        ],
        workspaceConfig: {
          codeSnippet: '1  x=input("donner un entier x")\n2  f=0\n3  for i in range(2,x):\n4      f=f*i\n5  print(f)',
          tableHeaders: ['N° ligne', 'Contient erreur ?', 'Cause de l’erreur', 'Correction appropriée'],
          tableRows: [
            {
              id: 'l1',
              cells: [
                { key: 'num', prefilled: '1', editable: false },
                { key: 'err', label: 'Erreur ?', editable: true, acceptedAnswers: ['Oui', 'oui'] },
                { key: 'cause', label: 'Cause', editable: true, acceptedAnswers: ['x est une chaîne', 'manque int', 'type str'] },
                { key: 'fix', label: 'Correction', editable: true, acceptedAnswers: ['x = int(input("donner un entier x"))', 'x=int(input("donner un entier x"))'] },
              ],
            },
            {
              id: 'l2',
              cells: [
                { key: 'num', prefilled: '2', editable: false },
                { key: 'err', label: 'Erreur ?', editable: true, acceptedAnswers: ['Oui', 'oui'] },
                { key: 'cause', label: 'Cause', editable: true, acceptedAnswers: ['f=0 annule le produit', 'élément absorbant', 'produit nul'] },
                { key: 'fix', label: 'Correction', editable: true, acceptedAnswers: ['f = 1', 'f=1'] },
              ],
            },
            {
              id: 'l3',
              cells: [
                { key: 'num', prefilled: '3', editable: false },
                { key: 'err', label: 'Erreur ?', editable: true, acceptedAnswers: ['Oui', 'oui'] },
                { key: 'cause', label: 'Cause', editable: true, acceptedAnswers: ['x est exclu', 'manque +1', 'x non atteint'] },
                { key: 'fix', label: 'Correction', editable: true, acceptedAnswers: ['for i in range(2, x + 1):', 'for i in range(2,x+1):'] },
              ],
            },
            {
              id: 'l4',
              cells: [
                { key: 'num', prefilled: '4', editable: false },
                { key: 'err', label: 'Erreur ?', editable: true, acceptedAnswers: ['Non', 'non'] },
                { key: 'cause', prefilled: '—', editable: false },
                { key: 'fix', prefilled: '—', editable: false },
              ],
            },
            {
              id: 'l5',
              cells: [
                { key: 'num', prefilled: '5', editable: false },
                { key: 'err', label: 'Erreur ?', editable: true, acceptedAnswers: ['Non', 'non'] },
                { key: 'cause', prefilled: '—', editable: false },
                { key: 'fix', prefilled: '—', editable: false },
              ],
            },
          ],
          subQuestions: [
            {
              id: 'role',
              prompt: '4) Quel est le rôle de ce programme une fois corrigé ?',
              placeholder: 'Ce programme calcule...',
              keyPoints: ['factorielle', 'x!'],
            },
          ],
        },
        presetHints: {
          level1: 'Teste mentalement ce que fait le code pour x = 4.',
          level2: 'Ligne 1 : `range(2, x)` attend un entier, pas une chaîne de caractères.',
          level3: 'Ligne 2 : si `f = 0`, alors `f * i` vaudra toujours 0 !',
          level4: 'Ligne 3 : pour multiplier jusqu’à `x` inclus, la borne supérieure de `range` doit être `x + 1`. Le rôle est le calcul de la factorielle de x.',
        },
        conceptToReview: 'Saisie int(input), initialisation et bornes de range()',
        active: true,
      },
      {
        id: 'ex-p20-7',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 7 (p. 20)',
        title: 'Force d’un mot de passe',
        category: 'Exercice d’application',
        sourcePage: 20,
        difficulty: 'Application',
        estimatedMinutes: 18,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire un algorithme qui permet de saisir un mot de passe mdp, de calculer sa force selon la formule suivante, puis d’afficher s’il est fort ou faible :\nForce_mdp = nombre de lettres + nombre de chiffres × 2 + nombre de symboles × 3.\nSi Force_mdp > 30, afficher « Mot de passe fort », sinon afficher « Mot de passe faible ».\nExemples : "abc123!!" → 3+3×2+2×3 = 15 (faible) | "Abcdef1234567890!!!" → 6+10×2+3×3 = 35 (fort).',
        understandWork:
          'Tu dois parcourir chaque caractère `c` de la chaîne `mdp`, classer `c` parmi trois catégories (lettre, chiffre ou symbole) en utilisant les intervalles ASCII ("A".."Z", "a".."z", "0".."9"), compter chaque catégorie, puis appliquer la formule de Force_mdp.',
        objectives: [
          'Classifier les caractères d’une chaîne par intervalles ASCII',
          'Maintenir plusieurs compteurs dans une boucle Pour',
        ],
        reflectionQuestions: [
          'Comment reconnaître qu’un caractère c est une lettre (majuscule ou minuscule) ?',
          'Si c n’est ni une lettre ni un chiffre, qu’est-ce que c’est ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Force_Mot_De_Passe\nDébut\n    \nFin',
          starterPython: 'mdp = input("Mot de passe : ")\n',
          defaultInputs: ['Abcdef1234567890!!!'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour', 'si', 'sinon'],
          criteriaNotes: ['Initialiser 3 compteurs à 0', 'Parcourir mdp de 0 à long(mdp)-1', 'Tester lettre / chiffre / symbole', 'Calculer Force_mdp et comparer à 30'],
        },
        testCases: [
          { id: 'tc1', label: '"abc123!!" -> faible', inputs: ['abc123!!'], expectedOutputs: ['Mot de passe faible'] },
          { id: 'tc2', label: '"Abcdef1234567890!!!" -> fort', inputs: ['Abcdef1234567890!!!'], expectedOutputs: ['Mot de passe fort'] },
        ],
        presetHints: {
          level1: 'Initialise trois compteurs : `nb_l = 0`, `nb_c = 0`, `nb_s = 0`.',
          level2: 'Pour chaque caractère `c = mdp[i]`, vérifie `"A" <= c <= "Z" or "a" <= c <= "z"` pour les lettres.',
          level3: 'Vérifie `"0" <= c <= "9"` pour les chiffres ; tout autre caractère (`else:`) est compté comme symbole !',
          level4: 'Calcule `force = nb_l + nb_c * 2 + nb_s * 3` après la boucle puis compare `force > 30`.',
        },
        conceptToReview: 'Comparaison ASCII (page 10) et boucle Pour',
        active: true,
      },
      {
        id: 'ex-p20-8',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Exercice 8 (p. 20)',
        title: 'Caractère ayant le plus grand code ASCII',
        category: 'Exercice d’application',
        sourcePage: 20,
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire l’algorithme d’un programme qui permet de saisir une chaîne ch et afficher le caractère qui a le plus grand code ASCII.\nExemple : ch = "Python" → Caractère ayant le plus grand code ASCII : y (Note : dans l’illustration PDF, le texte exemple indique n, alors que ord("y")=121 > ord("n")=110 — vérifions selon le code ASCII réel).',
        understandWork:
          'Pour trouver le maximum dans une chaîne (comme dans un tableau), initialise `c_max ← ch[0]`, puis parcours la chaîne à partir de l’indice 1 : dès que `ord(ch[i]) > ord(c_max)` (ou `ch[i] > c_max`), remplace `c_max` par `ch[i]`.',
        objectives: [
          'Appliquer l’algorithme de recherche du maximum sur une chaîne',
          'Utiliser ord() ou la comparaison ASCII directe',
        ],
        reflectionQuestions: [
          'Pourquoi est-il préférable d’initialiser le maximum avec ch[0] plutôt qu’avec un caractère arbitraire ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Max_ASCII\nDébut\n    \nFin',
          starterPython: 'ch = input("Chaîne ch : ")\n',
          defaultInputs: ['Python'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour', 'si'],
          criteriaNotes: ['Initialiser max avec ch[0]', 'Parcourir de 1 à long(ch)-1', 'Mettre à jour si ord(ch[i]) > ord(max)'],
        },
        testCases: [
          { id: 'tc1', label: '"Python" -> y (121)', inputs: ['Python'], expectedOutputs: ['y'] },
          { id: 'tc2', label: '"ABCD" -> D', inputs: ['ABCD'], expectedOutputs: ['D'] },
        ],
        presetHints: {
          level1: 'Initialise `cmax = ch[0]` (en supposant ch non vide).',
          level2: 'Parcours les indices `i` de `1` à `len(ch) - 1`.',
          level3: 'Si `ord(ch[i]) > ord(cmax)`, alors `cmax = ch[i]`.',
          level4: 'Affiche `cmax` après la boucle.',
        },
        conceptToReview: 'Code ASCII (page 10) et recherche de maximum',
        needsTeacherReview: true,
        reviewNote:
          'Page 20 Exercice 8 : L’encadré exemple du PDF indique ch="Python" → "n", alors que ord("y")=121 > ord("t")=116 > ord("o")=111 > ord("n")=110. L’algorithme évalue correctement le maximum ASCII réel ("y").',
        active: true,
      },
      {
        id: 'ex-p21-proj1',
        chapterId: 'ch3-boucle-pour',
        lessonId: 'les-3-1-pour',
        numberLabel: 'Projet 1 (p. 21)',
        title: 'Calcul du nombre de combinaisons C(n, p)',
        category: 'Projet',
        sourcePage: 21,
        difficulty: 'Défi',
        estimatedMinutes: 25,
        kind: 'algorithm_and_python',
        originalStatement:
          'Un enseignant dispose d’une boîte contenant n billes (ex : 5 billes de couleurs différentes) et souhaite choisir p billes (ex : 2 billes) sans tenir compte de l’ordre.\nFormule : C(n, p) = n! / (p! * (n - p)!).\nTravail demandé : Écrire un algorithme, puis réaliser un programme Python permettant de : 1) Calculer le nombre de combinaisons de p éléments parmi n éléments ; 2) Afficher le résultat obtenu.\nExemple : Pour n = 5 et p = 2 → C = 120 / (2 * 6) = 10.',
        understandWork:
          'Tu dois d’abord lire n et p (avec 0 <= p <= n), puis calculer trois factorielles : fn = n!, fp = p! et fnp = (n - p)!. Enfin, applique la formule C = fn // (fp * fnp) et affiche le résultat.',
        objectives: [
          'Décomposer un calcul mathématique en trois boucles de factorielle',
          'Mettre en place la formule des combinaisons en Algorithme et Python',
        ],
        reflectionQuestions: [
          'Quelles sont les trois factorielles nécessaires pour calculer C(n, p) ?',
          'Quelle contrainte relie p et n ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Combinaison\nDébut\n    \nFin',
          starterPython: 'n = int(input("n = "))\np = int(input("p = "))\n',
          defaultInputs: ['5', '2'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour'],
          criteriaNotes: ['Calculer n!, p! et (n-p)!', 'Calculer C = fn DIV (fp * fnp)', 'Afficher C'],
        },
        testCases: [
          { id: 'tc1', label: 'C(5, 2) = 10', inputs: ['5', '2'], expectedOutputs: ['10'] },
          { id: 'tc2', label: 'C(6, 3) = 20', inputs: ['6', '3'], expectedOutputs: ['20'] },
        ],
        presetHints: {
          level1: 'Tu sais déjà calculer la factorielle d’un entier grâce à l’exercice 3 !',
          level2: 'Utilise trois boucles Pour (ou une fonction si tu connais déjà les sous-programmes) pour calculer fn, fp et fnp.',
          level3: 'Attention aux parenthèses au dénominateur : écris bien `fn // (fp * fnp)`.',
          level4: 'Vérifie ton résultat avec l’exemple du cahier : pour n=5 et p=2, tu dois obtenir 10.',
        },
        conceptToReview: 'Boucle Pour et factorielle (pages 18–19)',
        active: true,
      },
    ],
  },
];
