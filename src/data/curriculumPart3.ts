import type { Chapter } from '../types/algolab';

export const CHAPTERS_PART_3: Chapter[] = [
  {
    id: 'ch6-sous-programmes',
    order: 6,
    title: 'Chapitre 6 : Les Sous-Programmes',
    subtitle: 'Analyse modulaire, Fonctions (TDOL), Procédures (@ vs valeur), Programme principal (TDOG)',
    sourcePages: 'Pages 44–58',
    description:
      'Découvrir la décomposition modulaire, concevoir des fonctions et procédures avec paramètres formels/effectifs, distinguer passage par valeur et passage par adresse (@), et maîtriser la portée TDOG/TDOL.',
    lessons: [
      {
        id: 'les-6-1-modularite',
        chapterId: 'ch6-sous-programmes',
        order: 1,
        title: 'Introduction à l’analyse modulaire (Situation robloxi)',
        sourcePages: 'Pages 44–45',
        objectives: [
          'Comprendre pourquoi décomposer un grand problème en sous-problèmes',
          'Distinguer une Fonction (retourne 1 résultat) d’une Procédure (traitement / 0 ou plusieurs résultats)',
        ],
        definitions: [
          {
            term: 'Analyse modulaire',
            meaning: 'Diviser un problème complexe en sous-problèmes plus simples jusqu’à atteindre un niveau abordable : Repérer → Isoler → Nommer → Réutiliser.',
          },
          {
            term: 'Fonction vs Procédure',
            meaning: 'Une fonction retourne un seul résultat de type simple ; une procédure exécute un traitement et ne retourne pas de résultat unique (mais peut modifier ses paramètres par adresse).',
          },
        ],
        contentSections: [
          {
            heading: 'Situation-problème : Calcul de surface de 7 cubes (robloxi)',
            body: 'Au lieu de réécrire 7 ou 20 fois le calcul S = 6 × côté², on isole cette action répétée dans un sous-programme réutilisable.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Les 4 étapes de modularité',
            algo: '1. Repérer la tâche répétée\n2. Isoler la tâche dans un module\n3. Donner un nom au module\n4. Réutiliser le module par appel',
            python: 'def surface_cube(cote):\n    return 6 * cote * cote',
          },
        ],
        comprehensionCheck: {
          prompt: 'Quelle est la différence principale entre une fonction et une procédure en algorithmique 3SC ?',
          options: [
            'La fonction n’a jamais de paramètres',
            'La fonction renvoie un résultat unique avec Retourner, contrairement à la procédure',
            'La procédure ne peut pas contenir de boucles',
            'La fonction ne peut pas être appelée depuis le programme principal',
          ],
          correctIndex: 1,
          explanation: 'Une fonction renvoie une valeur unique (de type simple) via Retourner ; une procédure réalise un traitement (affichage, saisie, modification).',
        },
      },
      {
        id: 'les-6-2-fonctions',
        chapterId: 'ch6-sous-programmes',
        order: 2,
        title: 'Les Fonctions en Algorithmique et en Python (TDOL)',
        sourcePages: 'Pages 46–47',
        objectives: [
          'Écrire l’entête d’une fonction avec ses paramètres formels et son type de retour',
          'Dresser le TDOL (Tableau de Déclaration des Objets Locaux)',
        ],
        definitions: [
          {
            term: 'Objet local (TDOL)',
            meaning: 'Tout nouvel objet utilisé dans une fonction n’est accessible qu’à l’intérieur de cette fonction.',
          },
        ],
        contentSections: [
          {
            heading: 'Syntaxe de déclaration d’une fonction',
            body: 'En algorithme : Fonction Nom_fonction(pf1 : type, ...) : type_résultat / Début ... Retourner valeur / Fin. En Python : def nom_fonction(pf1, ...): ... return valeur.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Exemple : Fonction Somme(A, B)',
            algo: 'Fonction Somme(A : entier, B : entier) : entier\nDébut\n    S ← A + B\n    Retourner S\nFin\n// TDOL : S (entier)',
            python: 'def somme(a, b):\n    s = a + b\n    return s',
          },
        ],
        comprehensionCheck: {
          prompt: 'Où déclare-t-on une variable locale S utilisée uniquement dans une fonction ?',
          options: ['Dans le TDOG', 'Dans le TDOL de la fonction', 'Dans le TDNT', 'On ne la déclare pas'],
          correctIndex: 1,
          explanation: 'Les variables créées à l’intérieur d’un sous-programme se déclarent dans son T.D.O.L (Tableau de Déclaration des Objets Locaux).',
        },
      },
      {
        id: 'les-6-3-procedures',
        chapterId: 'ch6-sous-programmes',
        order: 3,
        title: 'Les Procédures & Modes de passage des paramètres (@ vs valeur)',
        sourcePages: 'Pages 48–50',
        objectives: [
          'Déclarer et appeler une procédure en algorithme et en Python',
          'Distinguer passage par valeur (copie) et passage par adresse/référence (@)',
        ],
        definitions: [
          {
            term: 'Passage par adresse (@)',
            meaning: 'Le transfert s’effectue dans les deux sens : toute modification du paramètre formel modifie la variable effective dans le programme appelant (symbole @ devant le paramètre formel).',
          },
          {
            term: 'Passage par valeur',
            meaning: 'Transfert dans un seul sens (copie) : la variable d’origine reste inchangée chez l’appelant.',
          },
        ],
        contentSections: [
          {
            heading: 'Règle importante (page 48–49)',
            body: 'Si la procédure doit modifier une variable (ex : Procédure saisie(@n : entier)), on utilise @. Si elle ne la modifie pas (ex : affichage), on passe par valeur. Une fonction utilise toujours ses paramètres par valeur.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Exemple : Procédure saisie(@n : entier)',
            algo: 'Procédure saisie(@n : entier)\nDébut\n    Répéter\n        Ecrire("donner n")\n        Lire(n)\n    Jusqu\'à (n > 0)\nFin',
            python: 'def saisie():\n    n = 0\n    while not (n > 0):\n        n = int(input("donner n : "))\n    return n',
            note: 'En Python, un entier étant immuable, une saisie contrôlée se traduit souvent en retournant la valeur saisie.',
          },
        ],
        comprehensionCheck: {
          prompt: 'Dans `Procédure Calcul(@x : entier, y : entier)`, quelle variable appelante sera modifiée après l’appel ?',
          options: ['Uniquement celle associée à y', 'Uniquement celle associée à x', 'Les deux', 'Aucune'],
          correctIndex: 1,
          explanation: 'Seul le paramètre précédé de `@` est passé par adresse (référence) et modifie la variable effective correspondante.',
        },
      },
      {
        id: 'les-6-4-prog-principal',
        chapterId: 'ch6-sous-programmes',
        order: 4,
        title: 'Algorithme Programme Principal & Fiche Mémo (TDOG vs TDOL)',
        sourcePages: 'Pages 51–52',
        objectives: [
          'Orchestrer les appels de modules depuis le programme principal',
          'Accorder paramètres formels et effectifs en nombre, type et ordre',
          'Distinguer objets globaux (TDOG) et objets locaux (TDOL)',
        ],
        definitions: [
          {
            term: 'Paramètres formels vs effectifs',
            meaning: 'Les paramètres formels figurent dans l’entête de définition du module ; les paramètres effectifs sont les valeurs/variables fournies lors de l’appel.',
          },
          {
            term: 'TDOG (Objets Globaux)',
            meaning: 'Objets déclarés dans le programme principal : visibles et accessibles partout.',
          },
        ],
        contentSections: [
          {
            heading: 'Bonne pratique : pas d’E/S dans une fonction',
            body: 'Dans une fonction, on évite les actions d’entrée (Lire) et de sortie (Ecrire) : les données arrivent par les paramètres et le résultat sort par Retourner.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Appel de fonction vs appel de procédure',
            algo: '// Appel fonction :\ns ← somme(5, 3)\nEcrire(s)\n// Appel procédure :\nafficher(n)',
            python: 's = somme(5, 3)\nprint(s)\nafficher(n)',
          },
        ],
        comprehensionCheck: {
          prompt: 'Lors de l’appel d’un sous-programme `s ← somme(5, 3)`, que sont `5` et `3` ?',
          options: ['Des paramètres formels', 'Des paramètres effectifs', 'Des objets locaux', 'Des types'],
          correctIndex: 1,
          explanation: 'Lors de l’appel, les valeurs concrètes transmises (5 et 3) sont les paramètres effectifs.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p46-app1',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-2-fonctions',
        numberLabel: 'Application 1 (p. 46)',
        title: 'Fonction Somme des diviseurs d’un entier N',
        category: 'Activité',
        sourcePage: 46,
        sourcePageNote: 'Page 46 (51)',
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'algorithm',
        originalStatement:
          'Écrire l’algorithme d’une fonction qui permet de calculer la somme des diviseurs d’un entier N.\nExemple : N = 8 | la somme de ces diviseurs : 1 + 2 + 4 + 8 = 15 (note : le texte source écrit "diviseurs propres" mais additionne 1+2+4+8=15).',
        understandWork:
          'Tu dois écrire uniquement la fonction (entête + corps + Retourner), sans Lire(N) ni Ecrire(S) à l’intérieur : N arrive en paramètre formel et la fonction retourne la somme `S` calculée avec une boucle Pour de 1 à N.',
        objectives: [
          'Écrire une fonction algorithmique avec paramètre, TDOL et Retourner',
        ],
        reflectionQuestions: [
          'Quel est le type du paramètre N et le type de retour de la fonction ?',
          'Quelles variables locales composent le TDOL ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Fonction Somme_Diviseurs(N : entier) : entier\nDébut\n    \nFin',
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['pour', 'si'],
          requiredKeywords: ['fonction', 'retourner'],
          criteriaNotes: ['Entête Fonction avec paramètre N : entier et retour : entier', 'Boucle Pour i de 1 à N', 'Retourner s'],
        },
        presetHints: {
          level1: 'L’entête commence par `Fonction Somme_Div(N : entier) : entier`.',
          level2: 'Initialise `s ← 0`, puis parcours `i` de 1 à N.',
          level3: 'Si `N mod i = 0`, fais `s ← s + i`.',
          level4: 'Termine par `Retourner s` avant `Fin`.',
        },
        conceptToReview: 'Déclaration d’une fonction (page 46)',
        needsTeacherReview: true,
        reviewNote: 'Page 46 Application 1 : Le PDF indique N=8 et somme 1+2+4+8=15 tout en écrivant « diviseurs propres ». L’enseignante peut préciser si N est inclus ou exclu.',
        active: true,
      },
      {
        id: 'ex-p47-2',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-2-fonctions',
        numberLabel: 'Exercice 2 (p. 47)',
        title: 'Tournage à la main : Fonction Quoi(T, N)',
        category: 'Exercice guidé',
        sourcePage: 47,
        sourcePageNote: 'Page 47 (52)',
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'trace_table',
        originalStatement:
          'Soit T un tableau de type TAB rempli par N réels positifs et la fonction Quoi suivante :\nFonction Quoi(T : TAB, N : entier) : ............\nDébut\n    S ← 0\n    Pour i de 0 à N-1 Faire\n        S ← S + T[i]\n    FinPour\n    Retourner (S)\nFin\nRépondre aux questions 2 à 6 (type de résultat, TDOL, valeur retournée pour T=[14., 5.5, 2.5, 3.2, 0.8, 10.], rôle, traduction Python).',
        understandWork:
          'Analyse cette fonction étape par étape : puisque T contient des réels, la somme S est de type Réel ! Calcule ensuite la somme exacte des 6 éléments de T, dresse le TDOL et écris l’équivalent Python.',
        objectives: [
          'Déduire le type de retour et le TDOL d’une fonction',
          'Traduire une fonction algorithmique en Python avec def et return',
        ],
        reflectionQuestions: [
          'Pourquoi le type de retour de Quoi est-il Réel et non Entier ?',
          'Quels sont les objets locaux déclarés dans le corps de Quoi (hors paramètres) ?',
        ],
        workspaceConfig: {
          codeSnippet: 'Fonction Quoi(T : TAB, N : entier) : ...\nDébut\n    S ← 0\n    Pour i de 0 à N-1 Faire\n        S ← S + T[i]\n    FinPour\n    Retourner (S)\nFin',
          tableHeaders: ['Question', 'Réponse attendue'],
          tableRows: [
            { id: 'q2', cells: [{ key: 'q', prefilled: '2) Type de résultat retourné par Quoi', editable: false }, { key: 'a', label: 'Type de retour', editable: true, acceptedAnswers: ['Réel', 'réel', 'Reel', 'reel', 'float'] }] },
            { id: 'q3', cells: [{ key: 'q', prefilled: '3) Objets du TDOL (noms séparés par virgule)', editable: false }, { key: 'a', label: 'TDOL', editable: true, acceptedAnswers: ['S, i', 'i, S', 'S (Réel), i (Entier)', 'S : Réel, i : Entier'] }] },
            { id: 'q4', cells: [{ key: 'q', prefilled: '4) Valeur retournée pour [14., 5.5, 2.5, 3.2, 0.8, 10.]', editable: false }, { key: 'a', label: 'Somme', editable: true, acceptedAnswers: ['36', '36.0'] }] },
          ],
          subQuestions: [
            { id: 'q5', prompt: '5) Quel est le rôle de la fonction Quoi ?', placeholder: 'Elle calcule...', keyPoints: ['somme', 'tableau'] },
            { id: 'q6', prompt: '6) Traduction Python de la fonction Quoi :', placeholder: 'def quoi(T, N):\n    ...', keyPoints: ['def', 'return'] },
          ],
        },
        presetHints: {
          level1: 'Additionne 14 + (5.5 + 2.5) + (3.2 + 0.8) + 10.',
          level2: '5.5 + 2.5 = 8 et 3.2 + 0.8 = 4, donc 14 + 8 + 4 + 10 = 36.0.',
          level3: 'Les objets locaux (TDOL) sont les variables créées dans la fonction : `S` (Réel) et `i` (Entier).',
          level4: 'En Python : `def Quoi(T, N): s = 0; for i in range(N): s = s + T[i]; return s`.',
        },
        conceptToReview: 'Fonctions et TDOL (page 46)',
        active: true,
      },
      {
        id: 'ex-p47-3',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-2-fonctions',
        numberLabel: 'Exercice 3 (p. 47)',
        title: 'Bêtisier des fonctions Python — Trouver les erreurs',
        category: 'Activité',
        sourcePage: 47,
        sourcePageNote: 'Page 47 (52)',
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'code_debug',
        originalStatement:
          'Voici un bêtisier qui génère à chaque fois une erreur, donner la cause de l’erreur dans chaque cas :\n1) def f()\n2) def fonction() : return (\'Python\')\n3) def puis(x,y): i=1; p=1; for i in range(1,y+1): p=p*x\n4) def pair(x): if k%2 == 0: return True else: return False',
        understandWork:
          'Observe attentivement les 4 définitions de fonctions Python et repère ce qui provoque une erreur de syntaxe, une erreur de variable non définie ou une valeur de retour manquante.',
        objectives: [
          'Repérer une erreur de syntaxe (: manquant), un oubli de return, et un NameError',
        ],
        reflectionQuestions: [
          'Que manque-t-il après `def f()` ? Et que retourne `puis(x, y)` ?',
          'D’où vient la variable `k` dans `pair(x)` ?',
        ],
        workspaceConfig: {
          codeSnippet:
            "1) def f()\n2) def fonction() :\n     return ('Python')\n3) def puis(x,y):\n     i=1\n     p=1\n     for i in range(1,y+1):\n         p=p*x\n4) def pair(x):\n     if k%2 == 0:\n         return True\n     else:\n         return False",
          tableHeaders: ['Cas', 'Cause de l’erreur / anomalie'],
          tableRows: [
            { id: 'b1', cells: [{ key: 'c', prefilled: '1) def f()', editable: false }, { key: 'r', label: 'Erreur cas 1', editable: true, acceptedAnswers: ['manque :', 'deux-points manquant', 'manque le corps de la fonction', 'syntaxe : manquant'] }] },
            { id: 'b2', cells: [{ key: 'c', prefilled: "2) def fonction() : return ('Python')", editable: false }, { key: 'r', label: 'Remarque / anomalie cas 2', editable: true, acceptedAnswers: ['pas de paramètre', 'parenthèses inutiles', 'return sur la même ligne', 'retourne une chaîne constante'] }] },
            { id: 'b3', cells: [{ key: 'c', prefilled: '3) def puis(x,y): ... p=p*x', editable: false }, { key: 'r', label: 'Erreur cas 3', editable: true, acceptedAnswers: ['manque return p', 'pas de return', 'return manquant'] }] },
            { id: 'b4', cells: [{ key: 'c', prefilled: '4) def pair(x): if k%2 == 0:', editable: false }, { key: 'r', label: 'Erreur cas 4', editable: true, acceptedAnswers: ['k non défini', 'il faut x au lieu de k', 'variable k inconnue', 'NameError k'] }] },
          ],
        },
        presetHints: {
          level1: 'Regarde la ponctuation du cas 1 et l’instruction finale du cas 3.',
          level2: 'Dans le cas 3, `p` est calculé mais jamais renvoyé avec `return p` !',
          level3: 'Dans le cas 4, le paramètre s’appelle `x`, mais la condition teste `k` qui n’existe pas.',
          level4: 'Pour le cas 2, la fonction n’a pas de paramètre ou présente une syntaxe atypique (parenthèses superflues autour de "Python").',
        },
        conceptToReview: 'Syntaxe Python des fonctions (page 46)',
        needsTeacherReview: true,
        reviewNote: 'Page 47 Exercice 3 cas 2 : `def fonction(): return (\'Python\')` est syntaxiquement valide en Python (icône ! dans le PDF) mais retourne une constante sans paramètre ni indentation standard.',
        active: true,
      },
      {
        id: 'ex-p50-app12',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-3-procedures',
        numberLabel: 'Applications 1 & 2 (p. 50)',
        title: 'Procédures saisie(@ch) et afficher(N)',
        category: 'Exercice d’application',
        sourcePage: 50,
        sourcePageNote: 'Page 50 (55)',
        difficulty: 'Entraînement',
        estimatedMinutes: 18,
        kind: 'algorithm_and_python',
        originalStatement:
          'Application 1 : Écrire l’algorithme de la procédure `saisie` qui permet de saisir une chaîne non vide de taille maximale 20 (et son équivalent Python).\nApplication 2 : Écrire l’algorithme de la procédure `afficher` qui permet d’afficher tous les nombres multiples de 5 entre 1 et N (et son équivalent Python).',
        understandWork:
          'Dans l’Application 1, la procédure `saisie(@ch : chaîne)` modifie `ch` : elle utilise donc le passage par adresse `@` et une boucle Répéter jusqu’à `1 ≤ long(ch) ≤ 20`. Dans l’Application 2, `afficher(N : entier)` ne modifie pas `N` (passage par valeur) et utilise une boucle Pour.',
        objectives: [
          'Choisir correctement passage par adresse (@) vs passage par valeur',
          'Écrire et traduire une procédure en Python',
        ],
        reflectionQuestions: [
          'Pourquoi `@ch` porte-t-il `@` dans `saisie` mais pas `N` dans `afficher` ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Procédure saisie(@ch : chaîne)\nDébut\n    \nFin\n\nProcédure afficher(N : entier)\nDébut\n    \nFin',
          starterPython:
            'def saisie():\n    ch = ""\n    while not (1 <= len(ch) <= 20):\n        ch = input("Chaîne : ")\n    return ch\n\ndef afficher(N):\n    for i in range(1, N + 1):\n        if i % 5 == 0:\n            print(i)\n',
          defaultInputs: ['Bonjour', '20'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['repeter', 'pour', 'si'],
          requiredKeywords: ['procédure', '@'],
          criteriaNotes: ['Procédure saisie(@ch : chaîne) avec boucle Répéter 1 <= long(ch) <= 20', 'Procédure afficher(N : entier) avec Pour i de 1 à N et Si i mod 5 = 0'],
        },
        presetHints: {
          level1: 'Une chaîne non vide de taille max 20 vérifie `1 <= long(ch) <= 20`.',
          level2: 'N’oublie pas le `@` devant `ch` dans l’entête de `saisie` car la procédure doit renvoyer la chaîne saisie.',
          level3: 'Dans `afficher(N : entier)`, parcours `i` de 1 à N et teste `Si i mod 5 = 0 Alors Ecrire(i)`.',
          level4: 'En Python, `afficher(N)` ne contient pas de `return`, elle fait simplement `print(i)`.',
        },
        conceptToReview: 'Les procédures et modes de passage (pages 48–49)',
        active: true,
      },
      {
        id: 'ex-p51-1',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Exercice 1 (p. 51)',
        title: 'Vrai ou Faux : Sous-programmes et paramètres',
        category: 'Exercice d’application',
        sourcePage: 51,
        sourcePageNote: 'Page 51 (56)',
        difficulty: 'Découverte',
        estimatedMinutes: 8,
        kind: 'true_false',
        originalStatement: 'Compléter ce tableau par V si la proposition est correcte et par F sinon (5 propositions).',
        understandWork:
          'Teste tes connaissances sur la portée des objets (local/global), les paramètres formels/effectifs et la différence entre fonction et procédure.',
        objectives: ['Maîtriser le vocabulaire des sous-programmes'],
        reflectionQuestions: ['Un objet local est-il visible depuis le programme principal ?'],
        workspaceConfig: {
          trueFalseItems: [
            { id: 'p1', statement: 'La décomposition modulaire facilite la résolution des problèmes.', expectedValue: 'V', explanation: 'Elle découpe un grand problème en sous-problèmes simples.' },
            { id: 'p2', statement: 'Une fonction peut retourner un tableau.', expectedValue: 'F', explanation: 'Selon le cours 3SC (p. 46), une fonction renvoie une seule valeur de type simple (en Python c’est possible mais en algo 3SC la règle du cahier impose un type simple — note : voir p.46). ' },
            { id: 'p3', statement: 'Un objet local est visible par le programme principal.', expectedValue: 'F', explanation: 'Un objet local n’est accessible qu’à l’intérieur de son module.' },
            { id: 'p4', statement: 'Une procédure permet de renvoyer zéro, un ou plusieurs résultats.', expectedValue: 'V', explanation: 'Définition exacte page 48 : « renvoie zéro, un ou plusieurs résultats ».' },
            { id: 'p5', statement: 'Lors de l’appel d’un sous-programme, on utilise des paramètres formels.', expectedValue: 'F', explanation: 'Lors de l’appel, on utilise des paramètres effectifs.' },
          ],
        },
        presetHints: {
          level1: 'Relis la page 46 (définition d’une fonction) et la page 48 (définition d’une procédure).',
          level2: 'Local = réservé uniquement au sous-programme ; Global = visible partout.',
          level3: 'Lors de l’appel, ce sont les paramètres EFFECTIFS ; dans l’entête, ce sont les paramètres FORMELS.',
          level4: 'Vérifie la phrase exacte page 48 : « Une procédure est un sous-programme qui renvoie zéro, un ou plusieurs résultats ».',
        },
        conceptToReview: 'Fiche Mémo Sous-programmes (pages 51–52)',
        active: true,
      },
      {
        id: 'ex-p53-234',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Exercices 2, 3 & 4 (p. 53)',
        title: 'Nature des modules, TDOL de Quoi et Nombre de Harshad',
        category: 'Exercice d’application',
        sourcePage: 53,
        sourcePageNote: 'Page 53 (58)',
        difficulty: 'Application',
        estimatedMinutes: 25,
        kind: 'modular_design',
        originalStatement:
          'Exercice 2 : Compléter la nature et les paramètres de 4 modules (Saisir taille n ; Calculer somme chiffres de n ; Remplir tableau T de n éléments ; Vérifier si un nombre est premier).\nExercice 3 : Soit `...... Quoi(T:tab, n:entier) : entier` — déterminer nature, objet local, paramètre formel, TDOL et proposer un appel.\nExercice 4 : Écrire un algorithme modulaire qui permet de saisir un entier n > 0 et calculer la somme de ses chiffres puis vérifier et afficher s’il est un nombre harshad (divisible par la somme de ses chiffres, ex : 18 → 1+8=9, 18÷9=2).',
        understandWork:
          'Cet ensemble fait le pont entre l’analyse modulaire (savoir choisir Fonction vs Procédure et passage par valeur vs @) et l’écriture d’un programme complet découpé en modules pour les nombres de Harshad.',
        objectives: [
          'Choisir entre Fonction et Procédure selon le rôle du module',
          'Décomposer le problème du nombre de Harshad en modules (saisie, somme_chiffres, programme principal)',
        ],
        reflectionQuestions: [
          'Le module « Vérifier si un nombre est premier » renvoie-t-il un booléen (Fonction) ou modifie-t-il une variable (Procédure) ?',
          'Dans l’Exercice 4, quels sous-programmes peux-tu isoler ?',
        ],
        workspaceConfig: {
          subQuestions: [
            { id: 'ex2_1', prompt: 'Ex 2.1) Saisir la taille d’un tableau n — Nature & Paramètres :', placeholder: 'Procédure, @n : entier', keyPoints: ['Procédure', '@n'] },
            { id: 'ex2_2', prompt: 'Ex 2.2) Calculer la somme des chiffres d’un nombre n — Nature & Paramètres :', placeholder: 'Fonction, n : entier → entier', keyPoints: ['Fonction', 'n'] },
            { id: 'ex2_3', prompt: 'Ex 2.3) Remplir un tableau T de n éléments — Nature & Paramètres :', placeholder: 'Procédure, @T : Tab, n : entier', keyPoints: ['Procédure', '@T', 'n'] },
            { id: 'ex2_4', prompt: 'Ex 2.4) Vérifier si un nombre est premier — Nature & Paramètres :', placeholder: 'Fonction, n : entier → booléen', keyPoints: ['Fonction', 'booléen'] },
            { id: 'ex3', prompt: 'Ex 3) Nature de Quoi, Objets locaux (TDOL), Paramètres formels et exemple d’appel :', placeholder: 'Nature: Fonction | Locaux: s, i | Formels: T, n | Appel: res ← Quoi(T, n)', keyPoints: ['Fonction', 's', 'i', 'T', 'n'] },
          ],
          starterAlgo:
            '// Exercice 4 : Algorithme modulaire Nombre de Harshad\nAlgorithme Harshad_Principal\nDébut\n    saisie(n)\n    sc ← somme_chiffres(n)\n    Si (n mod sc = 0) Alors\n        Ecrire(n, " est un nombre de Harshad")\n    Sinon\n        Ecrire(n, " n\'est pas un nombre de Harshad")\n    FinSi\nFin\n\n// Écris ci-dessous les modules saisie et somme_chiffres :\n',
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['si', 'tant_que'],
          requiredKeywords: ['fonction', 'procédure', 'retourner'],
          criteriaNotes: ['Procédure saisie(@n : entier)', 'Fonction somme_chiffres(n : entier) : entier', 'Test n mod sc = 0 dans le programme principal'],
        },
        presetHints: {
          level1: 'Pour l’Ex 2 : tout module qui saisit ou remplit modifie une donnée → Procédure avec `@`. Tout calcul/vérification qui renvoie une valeur unique → Fonction.',
          level2: 'Pour l’Ex 3 : `Quoi` a un type de retour `: entier` et fait `Retourner S`, c’est donc une Fonction !',
          level3: 'Pour Harshad (Ex 4) : réutilise la boucle Tant Que (N ≠ 0) avec `mod 10` et `div 10` dans `Fonction somme_chiffres(n : entier) : entier`.',
          level4: 'Attention à copier `n` dans une variable locale si tu modifies `n` dans `somme_chiffres` (en passage par valeur c’est automatique !).',
        },
        conceptToReview: 'Modularité, TDOL et passage par adresse (pages 48–52)',
        active: true,
      },
      {
        id: 'ex-p54-s1',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Série 1 — Activités 1 à 4 (p. 54)',
        title: 'Modules sur chaînes et arithmétique (Alphabétique, Inverse, Palindrome, Factorielle)',
        category: 'Activité',
        sourcePage: 54,
        sourcePageNote: 'Page 54 (59)',
        difficulty: 'Application',
        estimatedMinutes: 25,
        kind: 'algorithm_and_python',
        originalStatement:
          'Série 1 — Les sous-programmes :\n• Activité 1 : Écrire l’algorithme d’un module qui permet de vérifier si une chaîne ch est alphabétique ou non (ex : "Bonjour" → Alphabétique, "Bonjour123" → Non alphabétique).\n• Activité 2 : Module qui permet d’inverser une chaîne ("Bonjour" → "ruojnoB").\n• Activité 3 : Module qui permet de vérifier si une chaîne est palindrome ou non ("radar" → Palindrome, "maison" → Non palindrome).\n• Activité 4 : Module qui permet de calculer la factorielle d’un entier n (5! = 120).',
        understandWork:
          'Écris 4 fonctions modulaires propres (en algorithme et en Python). Astuce brillante : dans l’Activité 3 (`est_palindrome`), tu peux directement réutiliser le module `inverser(ch)` de l’Activité 2 et vérifier si `ch == inverser(ch)` !',
        objectives: [
          'Concevoir une bibliothèque de 4 fonctions réutilisables',
          'Réutiliser une fonction (inverser) à l’intérieur d’une autre fonction (palindrome)',
        ],
        reflectionQuestions: [
          'Comment vérifier qu’un caractère ch[i] est alphabétique avec son code ASCII ?',
          'Comment tester si une chaîne est un palindrome en une seule ligne grâce à l’Activité 2 ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Fonction est_alphabetique(ch : chaîne) : booléen\nDébut\n    \nFin\n\nFonction inverser(ch : chaîne) : chaîne\nDébut\n    \nFin\n\nFonction est_palindrome(ch : chaîne) : booléen\nDébut\n    \nFin\n\nFonction factorielle(n : entier) : entier\nDébut\n    \nFin',
          starterPython:
            'def est_alphabetique(ch):\n    for c in ch:\n        if not (("A" <= c <= "Z") or ("a" <= c <= "z")):\n            return False\n    return len(ch) > 0\n\ndef inverser(ch):\n    # À compléter\n    pass\n\ndef est_palindrome(ch):\n    # Réutiliser inverser(ch)\n    pass\n\ndef factorielle(n):\n    # À compléter\n    pass\n\nprint(est_alphabetique("Bonjour"), inverser("Bonjour"), est_palindrome("radar"), factorielle(5))\n',
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredKeywords: ['fonction', 'retourner'],
          criteriaNotes: ['4 fonctions distinctes', 'Test alphabétique avec "A".."Z" et "a".."z"', 'Palindrome réutilise inverser ou compare extrémités'],
        },
        testCases: [
          { id: 'tc1', label: 'Tests des 4 fonctions', inputs: [], expectedOutputs: ['True', 'ruojnoB', 'True', '120'] },
        ],
        presetHints: {
          level1: 'Pour `est_alphabetique`, parcours chaque caractère : dès qu’un caractère n’est pas une lettre, la réponse est Faux.',
          level2: 'Pour `inverser(ch)`, initialise `res = ""` et ajoute chaque caractère au début : `res = c + res`.',
          level3: 'Pour `est_palindrome(ch)`, il suffit de retourner `ch == inverser(ch)` !',
          level4: 'Pour `factorielle(n)`, initialise `f = 1` et multiplie par `i` de 1 à `n`.',
        },
        conceptToReview: 'Fonctions réutilisables (pages 45–46)',
        active: true,
      },
      {
        id: 'ex-p55-s2',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Série 2 — Applications 1, 2 & 3 (p. 55)',
        title: 'Nombres premiers/parfaits, Nombres amis (220, 284) et Analyse de APP3',
        category: 'Projet',
        sourcePage: 55,
        sourcePageNote: 'Page 55 (60)',
        difficulty: 'Défi',
        estimatedMinutes: 30,
        kind: 'modular_design',
        originalStatement:
          'Application 1 : Rechercher et afficher les nombres premiers et parfaits compris entre a et b (0 ≤ a ≤ b ≤ 5000) de façon modulaire.\nApplication 2 : Deux nombres a et b (< 5000) sont amis si somme_div_propres(a) = b ET somme_div_propres(b) = a (ex : 220 et 284).\nApplication 3 : Soient f3(n,m), f1(n) [somme chiffres], f2(n) [somme diviseurs propres] et ALGORITHME APP3 (lire n ; x←f1(n) ; y←f2(n) ; z←f2(f3(x,y)) ; Ecrire(x,"/",y,"/",z)) : 1) Déclarations nécessaires ; 2) Exécuter pour N=26 ; 3) Donner le rôle des 3 fonctions.',
        understandWork:
          'Remarque le génie de la modularité : une seule fonction `somme_diviseurs_propres(n)` permet de résoudre à la fois les nombres parfaits (`somme == n`), les nombres premiers (`somme == 1` pour n > 1) ET les nombres amis (`somme(a) == b and somme(b) == a`) ! Et dans APP3, trace minutieusement `f1(26)`, `f2(26)` et `f2(f3(x, y))`.',
        objectives: [
          'Factoriser une fonction commune (somme des diviseurs propres)',
          'Tracer des appels imbriqués de fonctions (APP3)',
        ],
        reflectionQuestions: [
          'Pour N = 26, que vaut x = f1(26) (somme des chiffres) ? Que vaut y = f2(26) (diviseurs propres 1+2+13) ?',
          'Dans f3(n, m), si n = 8 et m = 16, que retourne f3(8, 16) (multiples successifs jusqu’à divisibilité) ?',
        ],
        workspaceConfig: {
          subQuestions: [
            { id: 'app3_exec', prompt: 'Application 3 — Exécution de APP3 pour N = 26 (valeurs de x, y et z affichées) :', placeholder: 'x = 8 / y = 16 / z = 15', keyPoints: ['8', '16', '15'] },
            { id: 'app3_roles', prompt: 'Application 3 — Rôle de f1, f2 et f3 :', placeholder: 'f1: ..., f2: ..., f3: ...', keyPoints: ['chiffres', 'diviseurs', 'PPCM'] },
          ],
          starterAlgo:
            '// Solution modulaire Applications 1 & 2\nFonction somme_div_propres(n : entier) : entier\nDébut\n    \nFin\n\nFonction sont_amis(a : entier, b : entier) : booléen\nDébut\n    \nFin',
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredKeywords: ['fonction', 'retourner'],
          criteriaNotes: ['Fonction somme_div_propres', 'Réutilisation pour premier / parfait / amis'],
        },
        presetHints: {
          level1: 'Dans APP3 pour N = 26 : f1(26) additionne les chiffres 2 + 6 = 8.',
          level2: 'f2(26) additionne les diviseurs propres de 26 (1 + 2 + 13 = 16).',
          level3: 'f3(8, 16) calcule le PPCM de 8 et 16, soit 16. Puis z = f2(16) = 1 + 2 + 4 + 8 = 15 !',
          level4: 'Pour App 2 (amis) : `Retourner (somme_div_propres(a) = b) et (somme_div_propres(b) = a)`.',
        },
        conceptToReview: 'Modularité avancée et appels de fonctions',
        active: true,
      },
      {
        id: 'ex-p56-prob1',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Problème 1 (p. 56)',
        title: 'Suite mathématique Sn = Sn-1 + 3 et Tableau T',
        category: 'Exercice d’application',
        sourcePage: 56,
        sourcePageNote: 'Page 56 (61)',
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'trace_table',
        originalStatement:
          'Soit la suite mathématique Sn définie par : S0 = 2 ; Sn = Sn-1 + 3 (n ≥ 1).\n2) Déterminer S1, S2, S3 et S4.\n3) Écrire un algorithme nommé `suite` qui permet de saisir un entier n (entre 1 et 100), de remplir un tableau T avec les n premiers termes de la suite S (à partir de S0), puis d’afficher le tableau résultant.\n4) Quelle instruction génère aléatoirement un entier E entre le 1er élément et le Nème élément du tableau T ?',
        understandWork:
          'Calcule d’abord les 4 termes S1 à S4 en ajoutant 3 à chaque fois. Puis écris l’algorithme `suite` (T[0] ← 2, et pour i de 1 à n-1, T[i] ← T[i-1] + 3) et choisis la bonne instruction Aléa.',
        objectives: [
          'Traduire une suite récurrente en remplissage de tableau',
          'Utiliser correctement les bornes d’indice T[0] et T[N-1] dans Aléa',
        ],
        reflectionQuestions: ['Pourquoi la dernière case d’un tableau de N termes est-elle T[N-1] et non T[N] ?'],
        workspaceConfig: {
          tableHeaders: ['Terme', 'Valeur'],
          tableRows: [
            { id: 's0', cells: [{ key: 't', prefilled: 'S0', editable: false }, { key: 'v', prefilled: '2', editable: false }] },
            { id: 's1', cells: [{ key: 't', prefilled: 'S1', editable: false }, { key: 'v', label: 'S1', editable: true, acceptedAnswers: ['5'] }] },
            { id: 's2', cells: [{ key: 't', prefilled: 'S2', editable: false }, { key: 'v', label: 'S2', editable: true, acceptedAnswers: ['8'] }] },
            { id: 's3', cells: [{ key: 't', prefilled: 'S3', editable: false }, { key: 'v', label: 'S3', editable: true, acceptedAnswers: ['11'] }] },
            { id: 's4', cells: [{ key: 't', prefilled: 'S4', editable: false }, { key: 'v', label: 'S4', editable: true, acceptedAnswers: ['14'] }] },
          ],
          subQuestions: [
            { id: 'q3_algo', prompt: '3) Algorithme `suite` (saisie n ∈ [1,100], remplir et afficher T) :', placeholder: 'Algorithme suite\nDébut\n...', keyPoints: ['T[0]', 'T[i-1] + 3', 'Pour'] },
            { id: 'q4_qcm', prompt: '4) Bonne proposition pour E (1: Aléa(T[0], T[N-1]) ; 2: Aléa(T[N], T[0]) ; 3: Aléa(T[0], T[N-1]) ) :', placeholder: 'E ← Aléa(T[0], T[N-1])', keyPoints: ['T[0]', 'T[N-1]'] },
          ],
        },
        presetHints: {
          level1: 'S0 = 2, donc S1 = 2 + 3 = 5, etc.',
          level2: 'Dans l’algorithme, contrôle d’abord que `1 <= n <= 100` avec Répéter...Jusqu’à.',
          level3: 'Initialise `T[0] ← 2`, puis pour `i` de `1` à `n - 1` fais `T[i] ← T[i - 1] + 3`.',
          level4: 'Le 1er élément est `T[0]` et le Nème élément est `T[N-1]`, donc `E ← Aléa(T[0], T[N-1])`.',
        },
        conceptToReview: 'Suites récurrentes dans un tableau',
        needsTeacherReview: true,
        reviewNote: 'Page 56 Question 4 : Les cases 1 et 3 du QCM imprimé affichent toutes deux « E ← Aléa(T[0], T[N-1]) » dans le document source.',
        active: true,
      },
      {
        id: 'ex-p57-1',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Série 3 — Exercice 1 (p. 57)',
        title: 'Analyse de la fonction « Inconnu(n) »',
        category: 'Exercice d’application',
        sourcePage: 57,
        sourcePageNote: 'Page 57 (62)',
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'trace_table',
        originalStatement:
          'Soit la fonction "Inconnu" :\nFonction Inconnu (n : Entier) : ...........\nDébut\n    S ← n\n    Pour i de 1 à n div 2 faire\n        Si (n mod i = 0) alors\n            S ← S - i\n        FinSi\n    Fin pour\n    Retourner S\nFin\n1) Compléter l’entête ; 2) TDOL ; 3) Résultat affiché pour 15, 30 et 10 ; 4) En déduire le rôle.',
        understandWork:
          'La fonction part de `n` et soustrait chacun de ses diviseurs propres `i`. Trace-la pour 15, 30 et 10 : que vaut `n - somme_des_diviseurs_propres` ?',
        objectives: ['Comprendre le rôle d’une fonction par traçage'],
        reflectionQuestions: ['Que valent les diviseurs propres de 15 (1, 3, 5) ? Donc 15 - (1+3+5) = ?'],
        workspaceConfig: {
          codeSnippet: 'S ← n\nPour i de 1 à n div 2 faire\n    Si (n mod i = 0) alors S ← S - i FinSi\nFin pour\nRetourner S',
          tableHeaders: ['Instruction / Question', 'Réponse'],
          tableRows: [
            { id: 'entete', cells: [{ key: 'q', prefilled: '1) Type de retour de Inconnu', editable: false }, { key: 'a', label: 'Type', editable: true, acceptedAnswers: ['Entier', 'entier', 'int'] }] },
            { id: 'tdol', cells: [{ key: 'q', prefilled: '2) Objets locaux (TDOL)', editable: false }, { key: 'a', label: 'Objets', editable: true, acceptedAnswers: ['S, i', 'i, S'] }] },
            { id: 'r15', cells: [{ key: 'q', prefilled: '3a) Ecrire(Inconnu(15))', editable: false }, { key: 'a', label: 'Résultat', editable: true, acceptedAnswers: ['6'] }] },
            { id: 'r30', cells: [{ key: 'q', prefilled: '3b) Ecrire(Inconnu(30))', editable: false }, { key: 'a', label: 'Résultat', editable: true, acceptedAnswers: ['-12'] }] },
            { id: 'r10', cells: [{ key: 'q', prefilled: '3c) Ecrire(Inconnu(10))', editable: false }, { key: 'a', label: 'Résultat', editable: true, acceptedAnswers: ['2'] }] },
          ],
          subQuestions: [
            { id: 'role', prompt: '4) Rôle de la fonction Inconnu :', placeholder: 'Elle calcule la différence entre n et...', keyPoints: ['différence', 'diviseurs'] },
          ],
        },
        presetHints: {
          level1: 'Pour 15 : ses diviseurs entre 1 et 7 sont 1, 3 et 5. Calcule 15 - 1 - 3 - 5.',
          level2: 'Pour 30 : ses diviseurs entre 1 et 15 sont 1, 2, 3, 5, 6, 10, 15 (somme = 42). Donc 30 - 42 = -12.',
          level3: 'Pour 10 : diviseurs propres = 1, 2, 5 → 10 - 8 = 2.',
          level4: 'Rôle : calculer la différence entre n et la somme de ses diviseurs propres (permet notamment de tester si n est parfait quand elle vaut 0).',
        },
        conceptToReview: 'Trace de fonction et diviseurs',
        active: true,
      },
      {
        id: 'ex-p57-prob',
        chapterId: 'ch6-sous-programmes',
        lessonId: 'les-6-4-prog-principal',
        numberLabel: 'Problème 13 pts (p. 57–58)',
        title: 'Génération automatique d’identifiants (Tid)',
        category: 'Évaluation',
        sourcePage: 57,
        sourcePageNote: 'Pages 57–58 (62–63)',
        difficulty: 'Défi',
        estimatedMinutes: 35,
        kind: 'algorithm_and_python',
        originalStatement:
          'Pour générer automatiquement des identifiants pour N utilisateurs (1 ≤ N ≤ 9) :\n1) On remplit T par les N noms (≤ 20 lettres majuscules).\n2) On génère Tid où chaque identifiant est la concaténation de :\n• Les deux premières lettres du nom.\n• L’indice de la case dans T.\n• Le caractère dont le code ASCII vaut ord(nom[0]) + nb_voyelles(nom). Si la somme est > 90, ajouter automatiquement "a".\nExemple : "RAOUF" (indice 0, 3 voyelles A,O,U) → "RA0U" (82+3=85="U"). "ZERIEB" (indice 1, 3 voyelles) → 90+3=93 > 90 → "ZE1a".\nTravail demandé : Programme principal modulaire + algorithmes et TDO des modules envisagés.',
        understandWork:
          'Découpe ce problème en modules clairs : 1) `saisie_n(@N)` ; 2) `remplir_T(@T, N)` avec validation lettres majuscules ; 3) `nb_voyelles(ch) : entier` ; 4) `generer_Tid(T, @Tid, N)` ; 5) `afficher_Tid(Tid, N)`. Teste ensuite ton implémentation Python sur l’exemple RAOUF / ZERIEB / AZIZA !',
        objectives: [
          'Décomposer un problème de synthèse complet en sous-programmes',
          'Manipuler tableaux de chaînes, tranches, codes ASCII et concaténations',
        ],
        reflectionQuestions: [
          'Quelles sont les voyelles en majuscules (A, E, I, O, U, Y) ?',
          'Comment transformer l’indice entier `i` en caractère pour le concaténer à la chaîne identifiant ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Algorithme Identifiants_Principal\nDébut\n    saisie_n(N)\n    remplir(T, N)\n    generer(T, Tid, N)\n    afficher(Tid, N)\nFin\n\n// Définir les modules ci-dessous :\n',
          starterPython:
            'def nb_voyelles(ch):\n    cpt = 0\n    for c in ch:\n        if c in "AEIOUY":\n            cpt = cpt + 1\n    return cpt\n\ndef generer_id(nom, idx):\n    # À compléter\n    pass\n\nN = int(input("N = "))\nT = [input() for _ in range(N)]\nTid = [generer_id(T[i], i) for i in range(N)]\nprint(" | ".join(Tid))\n',
          defaultInputs: ['6', 'RAOUF', 'ZERIEB', 'AZIZA', 'FATMA', 'RAYEN', 'NADIA'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['pour', 'si'],
          requiredKeywords: ['fonction', 'procédure', 'ord', 'chr'],
          criteriaNotes: ['Module de comptage des voyelles', 'Extraction 2 premières lettres', 'Calcul code ASCII ord(nom[0]) + nbv et test > 90 -> "a"'],
        },
        testCases: [
          {
            id: 'tc1',
            label: 'Exemple cahier (6 noms)',
            inputs: ['6', 'RAOUF', 'ZERIEB', 'AZIZA', 'FATMA', 'RAYEN', 'NADIA'],
            expectedOutputs: ['RA0U', 'ZE1a', 'AZ2D', 'FA3H', 'RA4U', 'NA5Q'],
          },
        ],
        presetHints: {
          level1: 'Isole d’abord une fonction `nb_voyelles(ch)` qui compte les lettres appartenant à `{"A","E","I","O","U","Y"}`.',
          level2: 'Les 2 premières lettres de `nom` sont `sous_Chaîne(nom, 0, 2)` (`nom[0:2]`).',
          level3: 'Calcule `code = ord(nom[0]) + nb_voyelles(nom)`. Si `code > 90` alors `car = "a"`, sinon `car = chr(code)`.',
          level4: 'Assemble `nom[:2] + str(idx) + car` (`convch(idx)` en algo) !',
        },
        conceptToReview: 'Conception modulaire complète & ASCII',
        active: true,
      },
    ],
  },
  {
    id: 'ch7-synthese',
    order: 7,
    title: 'Chapitre 7 : Séries de Synthèse & Problèmes Avancés',
    subtitle: 'Arithmétique (Forts, Narcissiques, Sophie Germain), Tableaux (Olympique, ADN) & Cryptographie',
    sourcePages: 'Pages 59–66',
    description:
      'Maîtriser les problèmes de synthèse de fin d’année : algorithmes arithmétiques célèbres, traitement de tableaux (moyenne olympique, ADN/ARN), passage de paramètres, et cryptographie.',
    lessons: [
      {
        id: 'les-7-1-synthese',
        chapterId: 'ch7-synthese',
        order: 1,
        title: 'Méthodologie des problèmes de synthèse',
        sourcePages: 'Pages 59–66',
        objectives: [
          'Assembler toutes les compétences du programme 3SC dans des problèmes réalistes',
          'Concevoir une architecture modulaire avant de coder',
        ],
        definitions: [
          {
            term: 'Nombre fort (Strong)',
            meaning: 'Entier égal à la somme des factorielles de ses chiffres (ex : 145 = 1! + 4! + 5! = 145).',
          },
          {
            term: 'Nombre narcissique (Armstrong)',
            meaning: 'Entier non nul égal à la somme de ses chiffres élevés à la puissance égale au nombre de chiffres (ex : 153 = 1³ + 5³ + 3³).',
          },
          {
            term: 'Nombre de Sophie Germain',
            meaning: 'Nombre premier p tel que 2p + 1 est également premier (ex : 2 → 5, 3 → 7).',
          },
        ],
        contentSections: [
          {
            heading: 'Stratégie gagnante face à un problème long',
            body: '1) Identifier les entrées/sorties ; 2) Repérer les sous-tâches indépendantes (ex : est_premier, somme_chiffres, factorielle, crypter_lettre) ; 3) Tester chaque module sur les exemples chiffrés du cahier.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Cryptage circulaire majuscule (décalage P)',
            algo: '// Pour une lettre majuscule c avec décalage P :\ncode ← ord(c) + P\nSi code > 90 Alors code ← code - 26 FinSi\nc_crypte ← chr(code)',
            python: 'code = ord(c) + P\nif code > 90:\n    code = code - 26\nc_crypte = chr(code)',
          },
        ],
        comprehensionCheck: {
          prompt: 'Pourquoi 7 n’est-il pas un nombre de Sophie Germain ?',
          options: [
            'Car 7 n’est pas premier',
            'Car 2×7 + 1 = 15 n’est pas premier',
            'Car 7 est impair',
            'Car 7 < 10',
          ],
          correctIndex: 1,
          explanation: '7 est bien premier, mais 2×7 + 1 = 15 = 3×5 n’est pas premier.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p59-s1',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Série 1 — Ex 3 & 4 (p. 59)',
        title: 'Les nombres forts (145) et les nombres narcissiques (153)',
        category: 'Exercice d’application',
        sourcePage: 59,
        sourcePageNote: 'Page 59 (64)',
        difficulty: 'Défi',
        estimatedMinutes: 25,
        kind: 'algorithm_and_python',
        originalStatement:
          'Série 1 — Algorithmes arithmétiques (p. 59) :\n• Ex 1 & 2 : Binaire et Facteurs premiers (voir modules Ch. 5).\n• Ex 3 (Nombres forts) : Écrire un module qui reçoit un entier N (1 < N < 5) et affiche les N premiers nombres forts (ex : N=3 → 1, 2, 145).\n• Ex 4 (Nombres narcissiques) : Écrire l’algorithme qui affiche tous les nombres narcissiques strictement inférieurs à 100000 (ex : 153, 370, 1634).',
        understandWork:
          'Choisis l’un des deux défis (ou écris les fonctions `est_fort(n)` et `est_narcissique(n)` dans l’IDE Python). Pour les deux, il faut extraire chaque chiffre de `n` par `mod 10` et `div 10` (sur une copie `temp = n` afin de ne pas perdre `n` !).',
        objectives: [
          'Extraire les chiffres sans altérer le nombre original (copie temp)',
          'Combiner extraction de chiffres, factorielle et puissance',
        ],
        reflectionQuestions: [
          'Comment connaître le nombre de chiffres d’un entier n pour l’exposant des nombres narcissiques ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Fonction est_fort(n : entier) : booléen\nDébut\n    \nFin\n\nProcédure premiers_forts(N : entier)\nDébut\n    \nFin',
          starterPython:
            'def fact(k):\n    f = 1\n    for i in range(1, k + 1):\n        f *= i\n    return f\n\ndef est_fort(n):\n    # À compléter\n    pass\n\nN = int(input("N (1 < N < 5) : "))\ncpt = 0\nx = 1\nwhile cpt < N:\n    if est_fort(x):\n        print(x)\n        cpt += 1\n    x += 1\n',
          defaultInputs: ['3'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['tant_que', 'si'],
          criteriaNotes: ['Copier n dans temp avant division par 10', 'Somme des factorielles des chiffres == n'],
        },
        testCases: [
          { id: 'tc1', label: '3 premiers nombres forts', inputs: ['3'], expectedOutputs: ['1', '2', '145'] },
        ],
        presetHints: {
          level1: 'Dans `est_fort(n)`, fais `temp = n` et `s = 0` avant `while temp > 0:`.',
          level2: 'À chaque tour : `s = s + fact(temp % 10)` puis `temp = temp // 10`.',
          level3: 'Retourne `s == n`.',
          level4: 'Pour les nombres narcissiques, le nombre de chiffres vaut `len(str(n))` (ou compte avec une boucle `div 10`).',
        },
        conceptToReview: 'Extraction de chiffres et sous-programmes',
        active: true,
      },
      {
        id: 'ex-p60-1',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Série 2 — Ex 1 (p. 60)',
        title: 'La Moyenne Olympique d’un tableau',
        category: 'Exercice d’application',
        sourcePage: 60,
        sourcePageNote: 'Page 60 (65)',
        difficulty: 'Application',
        estimatedMinutes: 20,
        kind: 'algorithm_and_python',
        originalStatement:
          'On appelle moyenne olympique d’un ensemble de nombres la moyenne arithmétique de tous les nombres de cet ensemble sauf le plus petit et le plus grand.\nTravail demandé : Écrire un algorithme modulaire qui permet de remplir un tableau T par n réels distincts (3 ≤ n ≤ 100) et afficher la Moyenne olympique, puis l’implémenter en Python.\nExemple : n=6, T=[11.24, 13.45, 14.56, 12.87, 19.04, 13.78] → Moyenne olympique = 13.665.',
        understandWork:
          'Au lieu de supprimer les cases du tableau, calcule la somme totale `S`, le minimum `mini`, et le maximum `maxi` de `T`. La moyenne olympique vaut tout simplement `(S - mini - maxi) / (n - 2)` !',
        objectives: [
          'Calculer une moyenne élaguée (sans min ni max) efficacement',
          'Valider la taille 3 ≤ n ≤ 100 et la distinction des valeurs saisies',
        ],
        reflectionQuestions: [
          'Combien de valeurs restent dans le calcul après avoir retiré le minimum et le maximum ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Moyenne_Olympique\nDébut\n    \nFin',
          starterPython:
            'n = int(input("Taille n : "))\nT = [float(input()) for _ in range(n)]\n',
          defaultInputs: ['6', '11.24', '13.45', '14.56', '12.87', '19.04', '13.78'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['pour', 'si'],
          criteriaNotes: ['Trouver somme, min et max de T', 'Calculer (somme - min - max) / (n - 2)'],
        },
        testCases: [
          { id: 'tc1', label: 'Exemple cahier -> 13.665', inputs: ['6', '11.24', '13.45', '14.56', '12.87', '19.04', '13.78'], expectedOutputs: ['13.665'] },
        ],
        presetHints: {
          level1: 'Tu sais déjà trouver le min, le max et la somme d’un tableau !',
          level2: 'En retirant le plus petit et le plus grand, il reste exactement `n - 2` nombres.',
          level3: 'Formule : `moy_olymp = (somme - mini - maxi) / (n - 2)`.',
          level4: 'Vérifie avec l’exemple du cahier : somme=84.94, min=11.24, max=19.04 → (84.94-30.28)/4 = 13.665.',
        },
        conceptToReview: 'Tableaux et statistiques (pages 26 et 60)',
        active: true,
      },
      {
        id: 'ex-p60-2',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Série 2 — Ex 2 (p. 60)',
        title: 'Transcription ADN → ARN (Tableaux de caractères)',
        category: 'Exercice d’application',
        sourcePage: 60,
        sourcePageNote: 'Page 60 (65)',
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'python',
        originalStatement:
          'Écrire un programme qui permet de saisir un code d’ADN sous forme d’un tableau t de n caractères alphabétiques (n ≥ 2), de déterminer et d’afficher le code d’ARN correspondant (sous forme d’un tableau) par correspondance : A → U, T → A, C → G, G → C.\nExemple : t = [\'T\', \'A\', \'C\', \'G\', \'T\'] → [\'A\', \'U\', \'G\', \'C\', \'A\'].',
        understandWork:
          'Parcours chaque case `t[i]` du tableau ADN et remplis un tableau `arn` de même taille selon les 4 correspondances (`match t[i]:` ou `if/elif`).',
        objectives: [
          'Appliquer une table de correspondance sur un tableau de caractères (lien Biologie 3SC)',
        ],
        reflectionQuestions: [
          'Quelle structure est la plus lisible pour associer A, T, C, G à U, A, G, C ?',
        ],
        workspaceConfig: {
          starterPython: 'n = int(input("Taille n (>=2) : "))\nt = [input() for _ in range(n)]\narn = [""] * n\n',
          defaultInputs: ['5', 'T', 'A', 'C', 'G', 'T'],
        },
        testCases: [
          { id: 'tc1', label: 'TACGT -> AUGCA', inputs: ['5', 'T', 'A', 'C', 'G', 'T'], expectedOutputs: ['A', 'U', 'G', 'C', 'A'] },
        ],
        presetHints: {
          level1: 'Utilise une boucle `for i in range(n):`.',
          level2: 'À l’intérieur, `match t[i]:` avec `case "A": arn[i] = "U"`, etc.',
          level3: 'Pense à afficher `arn` à la fin avec `print("Le code ARN est :", arn)`.',
          level4: 'Vérifie l’exemple : T→A, A→U, C→G, G→C, T→A.',
        },
        conceptToReview: 'Tableaux et match...case',
        active: true,
      },
      {
        id: 'ex-p60-3',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Série 2 — Ex 3 (p. 60)',
        title: 'Cryptage ASCII par permutation des unités et dizaines',
        category: 'Exercice d’application',
        sourcePage: 60,
        sourcePageNote: 'Page 60 (65)',
        difficulty: 'Application',
        estimatedMinutes: 18,
        kind: 'python',
        originalStatement:
          'Écrire un programme qui permet de remplir un tableau t par n caractères alphabétiques (n ≥ 2) et de crypter les données figurant dans t comme suit :\n• Convertir chaque caractère en sa représentation en code ASCII.\n• Permuter les chiffres des unités avec ceux des dizaines.\n• Insérer le caractère correspondant à ce nouveau code ASCII dans un tableau r.\n• Afficher le tableau r obtenu.\nExemple : t = [\'a\', \'b\', \'c\', \'d\', \'e\'] → [\'O\', \'Y\', \'c\', \'d\', \'n\'].',
        understandWork:
          'Prenons `\'a\'` (ASCII 97) : dizaines = `9`, unités = `7`, le nouveau code vaut `79` = `\'O\'` ! Mais attention à `\'d\'` (ASCII 100) ou `\'e\'` (ASCII 101) : on permute UNIQUEMENT le chiffre des unités (`code % 10`) et celui des dizaines (`(code // 10) % 10`), en gardant le chiffre des centaines (`code // 100`) intact (`100` → `100` = `\'d\'`, `101` → `110` = `\'n\'`) !',
        objectives: [
          'Extraire centaines, dizaines et unités d’un code ASCII à 2 ou 3 chiffres',
          'Reconstruire le nouveau code et convertir avec chr()',
        ],
        reflectionQuestions: [
          'Pour code = 101 (\'e\'), que valent centaines (101//100), dizaines ((101//10)%10) et unités (101%10) ?',
          'Quelle formule recompose `centaines * 100 + unites * 10 + dizaines` ?',
        ],
        workspaceConfig: {
          starterPython: 'n = int(input("Taille n (>=2) : "))\nt = [input() for _ in range(n)]\nr = [""] * n\n',
          defaultInputs: ['5', 'a', 'b', 'c', 'd', 'e'],
        },
        testCases: [
          { id: 'tc1', label: 'a,b,c,d,e -> O,Y,c,d,n', inputs: ['5', 'a', 'b', 'c', 'd', 'e'], expectedOutputs: ['O', 'Y', 'c', 'd', 'n'] },
        ],
        presetHints: {
          level1: 'Calcule `code = ord(t[i])`.',
          level2: 'Extrais `c = code // 100`, `d = (code // 10) % 10`, `u = code % 10`.',
          level3: 'Le nouveau code est `nouveau = c * 100 + u * 10 + d` ! (Ça marche pour 2 chiffres car c=0, et pour 3 chiffres comme 101 -> 110).',
          level4: 'Insère `r[i] = chr(nouveau)` puis affiche `r`.',
        },
        conceptToReview: 'DIV / MOD et conversions ASCII',
        active: true,
      },
      {
        id: 'ex-p61-1',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Série 3 — Exercice 1 (p. 61)',
        title: 'Passage par valeur vs adresse (@) sur la procédure Calcul',
        category: 'Exercice guidé',
        sourcePage: 61,
        sourcePageNote: 'Page 61 (66)',
        difficulty: 'Application',
        estimatedMinutes: 18,
        kind: 'trace_table',
        originalStatement:
          'Soit le programme principal Exercice (S ← 0 ; N ← 1358 ; P ← 1 ; Calcul(N, P, S) ; Ecrire("N=", N, "P=", P, "S=", S)) et la procédure Calcul(x, y, z) qui calcule nb, z ← z + x mod 10, y ← y * (x mod 10), x ← x Div 10 jusqu’à x = 0.\n1) Déterminer les valeurs en sortie de N, P et S selon les 3 entêtes proposées.\n2) Identifier expression booléenne, appel, paramètre formel, effectif, objet local, objet global.\n3) Donner le rôle de nb.',
        understandWork:
          'Pendant son exécution sur 1358, la procédure calcule `z = 1+3+5+8 = 17`, `y = 1*3*5*8 = 120`, et réduit `x` à `0`. À toi de déterminer ce qui revient réellement dans `N`, `P` et `S` selon l’emplacement du symbole `@` dans chaque entête !',
        objectives: [
          'Prédire l’effet exact du passage par valeur vs par adresse (@) sur des variables globales',
        ],
        reflectionQuestions: [
          'Si un paramètre n’a pas `@`, la variable du programme principal retrouve-t-elle sa valeur de départ après l’appel ?',
        ],
        workspaceConfig: {
          codeSnippet:
            'Exercice : S ← 0 ; N ← 1358 ; P ← 1 ; Calcul(N, P, S)\nCalcul : Répéter nb←nb+1; z←z+x mod 10; y←y*(x mod 10); x←x div 10 Jusqu\'à (x=0)',
          tableHeaders: ['Entête de Calcul', 'N en sortie', 'P en sortie', 'S en sortie'],
          tableRows: [
            { id: 'h1', cells: [{ key: 'e', prefilled: 'Procédure Calcul(@x : Entier, y : Entier, @z : Entier)', editable: false }, { key: 'n', label: 'N', editable: true, acceptedAnswers: ['0'] }, { key: 'p', label: 'P', editable: true, acceptedAnswers: ['1'] }, { key: 's', label: 'S', editable: true, acceptedAnswers: ['17'] }] },
            { id: 'h2', cells: [{ key: 'e', prefilled: 'Procédure Calcul(@x : Entier, @y : Entier, @z : Entier)', editable: false }, { key: 'n', label: 'N', editable: true, acceptedAnswers: ['0'] }, { key: 'p', label: 'P', editable: true, acceptedAnswers: ['120'] }, { key: 's', label: 'S', editable: true, acceptedAnswers: ['17'] }] },
            { id: 'h3', cells: [{ key: 'e', prefilled: 'Procédure Calcul(x : Entier, @y : Entier, @z : Entier)', editable: false }, { key: 'n', label: 'N', editable: true, acceptedAnswers: ['1358'] }, { key: 'p', label: 'P', editable: true, acceptedAnswers: ['120'] }, { key: 's', label: 'S', editable: true, acceptedAnswers: ['17'] }] },
          ],
          subQuestions: [
            { id: 'q2_id', prompt: '2) Cite un exemple de chaque : Expression booléenne, Appel, Paramètre formel, Paramètre effectif, Objet local, Objet global :', placeholder: 'Expr bool: x = 0 | Appel: Calcul(N, P, S) | ...', keyPoints: ['x = 0', 'Calcul', 'nb'] },
            { id: 'q3_nb', prompt: '3) Rôle de la variable nb dans la procédure Calcul :', placeholder: 'nb compte...', keyPoints: ['nombre de chiffres', 'N'] },
          ],
        },
        presetHints: {
          level1: 'Sans `@`, la variable d’origine garde sa valeur initiale (N=1358, P=1, S=0).',
          level2: 'Avec `@`, la variable d’origine reçoit la valeur finale calculée dans Calcul (x=0, y=120, z=17).',
          level3: 'Objet local = `nb` (déclaré uniquement dans Calcul) ; Objets globaux = `N, P, S`.',
          level4: '`nb` s’incrémente à chaque division par 10 : il compte le nombre de chiffres de x.',
        },
        conceptToReview: 'Passage par adresse vs valeur (pages 48 et 52)',
        active: true,
      },
      {
        id: 'ex-p62-24',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Série 3 — Ex 2 & 4 (p. 62)',
        title: 'Trace de Inconnue(x) et Comparaison F1, F2, F3, F4',
        category: 'Exercice guidé',
        sourcePage: 62,
        sourcePageNote: 'Page 62 (67)',
        difficulty: 'Application',
        estimatedMinutes: 18,
        kind: 'trace_table',
        originalStatement:
          'Exercice 2 : Fonction Inconnue(x : Entier) convertit x en chaîne CH, garde dans R les chiffres impairs (`Valeur(CH[i]) Mod 2 = 1`), et retourne Valeur(R) si Long(R) > 0, sinon -1. Donner type de retour, TDOL, résultats pour 15472, 9931, 2462, et rôle.\nExercice 4 : Parmi F1 (p←0, x de 2 à n), F2 (p←1, i de 1 à n, p←p*x), F3 (p←1, x de 2 à n, p←p*x), F4 (p←1, i de 2 à n, p←p*x), déterminer celle qui correspond à Fact(n) et celle qui correspond à Puiss(x, n).',
        understandWork:
          'Dans l’Ex 2, observe que Inconnue garde uniquement les chiffres impairs dans leur ordre d’apparition. Dans l’Ex 4, compare attentivement les bornes de boucle et l’initialisation de p dans F1..F4 pour éviter les pièges !',
        objectives: [
          'Tracer une fonction manipulant chaîne et entier',
          'Détecter les erreurs subtiles de boucle et d’initialisation (p←0, i de 2 à n)',
        ],
        reflectionQuestions: [
          'Dans 2462, y a-t-il au moins un chiffre impair ?',
          'Entre F1 et F3, laquelle initialise correctement le produit ?',
          'Entre F2 et F4, laquelle fait exactement n multiplications par x ?',
        ],
        workspaceConfig: {
          tableHeaders: ['Question', 'Réponse'],
          tableRows: [
            { id: 'ex2_type', cells: [{ key: 'q', prefilled: 'Ex 2.1) Type de retour de Inconnue', editable: false }, { key: 'a', label: 'Type', editable: true, acceptedAnswers: ['Entier', 'entier', 'int'] }] },
            { id: 'ex2_tdol', cells: [{ key: 'q', prefilled: 'Ex 2.2) Objets du TDOL', editable: false }, { key: 'a', label: 'TDOL', editable: true, acceptedAnswers: ['R, CH, i', 'CH, R, i', 'R, ch, i'] }] },
            { id: 'ex2_15472', cells: [{ key: 'q', prefilled: 'Ex 2.3a) Inconnue(15472)', editable: false }, { key: 'a', label: 'Résultat', editable: true, acceptedAnswers: ['157'] }] },
            { id: 'ex2_9931', cells: [{ key: 'q', prefilled: 'Ex 2.3b) Inconnue(9931)', editable: false }, { key: 'a', label: 'Résultat', editable: true, acceptedAnswers: ['9931'] }] },
            { id: 'ex2_2462', cells: [{ key: 'q', prefilled: 'Ex 2.3c) Inconnue(2462)', editable: false }, { key: 'a', label: 'Résultat', editable: true, acceptedAnswers: ['-1'] }] },
            { id: 'ex4_fact', cells: [{ key: 'q', prefilled: 'Ex 4) Fonction correspondant à Fact(n)', editable: false }, { key: 'a', label: 'F?', editable: true, acceptedAnswers: ['F3', 'f3'] }] },
            { id: 'ex4_puiss', cells: [{ key: 'q', prefilled: 'Ex 4) Fonction correspondant à Puiss(x, n)', editable: false }, { key: 'a', label: 'F?', editable: true, acceptedAnswers: ['F2', 'f2'] }] },
          ],
          subQuestions: [
            { id: 'ex2_role', prompt: 'Ex 2.4) Rôle de la fonction Inconnue :', placeholder: 'Elle extrait les chiffres impairs...', keyPoints: ['impairs'] },
          ],
        },
        presetHints: {
          level1: 'Dans 15472, les chiffres impairs sont 1, 5 et 7 → 157.',
          level2: 'Dans 2462, aucun chiffre n’est impair donc Long(R) = 0 → retourne -1.',
          level3: 'F1 a `p ← 0`, ce qui donne toujours 0 ! C’est donc F3 qui calcule `n!`.',
          level4: 'F4 commence à `i = 2` (il manque 1 tour), c’est donc F2 (`i de 1 à n`) qui calcule `x^n`.',
        },
        conceptToReview: 'Débogage de fonctions et trace',
        needsTeacherReview: true,
        reviewNote: 'Page 62 : La numérotation du PDF passe directement de Exercice 2 à Exercice 4 (pas d’Exercice 3 sur la page).',
        active: true,
      },
      {
        id: 'ex-p63-prob1',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Problème 1 (p. 63)',
        title: 'Les nombres de Sophie Germain (T1 → T2 par chiffres)',
        category: 'Projet',
        sourcePage: 63,
        sourcePageNote: 'Page 63 (68)',
        difficulty: 'Défi',
        estimatedMinutes: 30,
        kind: 'algorithm_and_python',
        originalStatement:
          'Un nombre p est dit nombre de Sophie Germain s’il est premier et 2p + 1 est aussi premier.\nÉcrire un programme modulaire qui permet de :\n• Remplir T1 par N entiers distincts de 1 à 4 chiffres (1..9999) avec 5 ≤ N ≤ 20.\n• Générer T2 contenant les éléments de T1 qui sont des nombres de Sophie Germain.\n• Afficher les éléments de T2 regroupés selon leur nombre de chiffres (1, 2, 3, 4 chiffres), ou "Aucun nombre Sophie germain de k chiffres".\nExemple : T1=[2, 3, 5, 11, 23, 29, 42, 100, 359, 1000] → T2=[2, 3, 5, 11, 23, 29, 359].',
        understandWork:
          'Crée une fonction `est_premier(x)` puis une fonction `est_sophie_germain(p)` qui retourne `est_premier(p) and est_premier(2 * p + 1)`. Regroupe ensuite l’affichage de T2 en testant 4 tranches (1..9, 10..99, 100..999, 1000..9999).',
        objectives: [
          'Combiner test de primalité et filtrage de tableau',
          'Regrouper des résultats par nombre de chiffres',
        ],
        reflectionQuestions: [
          'Pourquoi 1 n’est-il pas un nombre premier ?',
          'Comment vérifier que T1 ne contient que des entiers distincts lors du remplissage ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Fonction est_premier(x : entier) : booléen\nDébut\n    \nFin\n\nFonction sophie_germain(p : entier) : booléen\nDébut\n    \nFin',
          starterPython:
            'def est_premier(x):\n    if x < 2:\n        return False\n    for d in range(2, x // 2 + 1):\n        if x % d == 0:\n            return False\n    return True\n\ndef est_sophie(p):\n    return est_premier(p) and est_premier(2 * p + 1)\n\nT1 = [2, 3, 5, 11, 23, 29, 42, 100, 359, 1000]\nT2 = [x for x in T1 if est_sophie(x)]\nprint("T2 =", T2)\n',
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['pour', 'si'],
          requiredKeywords: ['fonction', 'retourner'],
          criteriaNotes: ['Fonction est_premier', 'Fonction sophie_germain testant p et 2*p+1', 'Affichage groupé par 1, 2, 3, 4 chiffres'],
        },
        presetHints: {
          level1: 'Attention : `est_premier(1)` doit renvoyer `False` (1 n’a qu’un seul diviseur).',
          level2: 'Pour regrouper par k chiffres (k=1..4), tu peux tester `len(str(x)) == k` ou les bornes [1..9], [10..99], etc.',
          level3: 'Si la liste filtrée pour k chiffres est vide, affiche "Aucun nombre Sophie germain de k chiffres".',
          level4: 'Vérifie avec l’exemple : T2 = [2, 3, 5, 11, 23, 29, 359].',
        },
        conceptToReview: 'Modularité et nombres premiers',
        active: true,
      },
      {
        id: 'ex-p64-prob2',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Problème 2 (p. 64)',
        title: 'Sécurisation des messages : Cryptage par nombre de mots P',
        category: 'Projet',
        sourcePage: 64,
        sourcePageNote: 'Page 64 (69)',
        difficulty: 'Défi',
        estimatedMinutes: 30,
        kind: 'algorithm_and_python',
        originalStatement:
          'Sous forme modulaire, écrire l’algorithme d’un programme intitulé CRYPTAGE qui permet de saisir un message M formé uniquement de lettres et d’espaces (en supprimant d’abord les espaces superflus), puis de le crypter en remplaçant chaque lettre par celle qui la suit de P positions dans l’alphabet (où P est le nombre de mots de M ; Z suivi de A, z suivi de a, espace inchangé).\nExemple : "Examen Pratique En Informatique" (4 mots, P=4) → "Ibeqir Tvexmuyi Ir Mrjsvqexmuyi".',
        understandWork:
          'Décompose le travail en 4 modules : 1) `saisie(@M)` ; 2) `nettoyer_espaces(M)` (supprimer début, fin et doubles espaces) ; 3) `compter_mots(M)` ; 4) `crypter(M, P)` en utilisant le modulo 26 pour boucler de Z vers A et de z vers a !',
        objectives: [
          'Supprimer les espaces superflus dans une chaîne',
          'Implémenter un chiffrement de César circulaire avec modulo 26',
        ],
        reflectionQuestions: [
          'Comment calculer P (le nombre de mots) une fois les espaces superflus supprimés ?',
          'Comment faire revenir "Z" (90) + 4 sur "D" (68) avec `% 26` ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Algorithme CRYPTAGE\nDébut\n    saisie(M)\n    M ← nettoyer(M)\n    P ← nb_mots(M)\n    Ecrire(crypter(M, P))\nFin',
          starterPython:
            'M = input("Message : ")\n# Nettoyer les espaces superflus, compter P mots, puis décaler de P\n',
          defaultInputs: ['Examen Pratique En Informatique'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireSubprogram: true,
          requiredStructures: ['pour', 'tant_que', 'si'],
          requiredKeywords: ['ord', 'chr'],
          criteriaNotes: ['Nettoyer espaces superflus', 'Compter P = nb_espaces + 1', 'Décaler majuscules (65..90) et minuscules (97..122) modulo 26'],
        },
        testCases: [
          {
            id: 'tc1',
            label: 'Exemple cahier (4 mots)',
            inputs: ['Examen Pratique En Informatique'],
            expectedOutputs: ['Ibeqir Tvexmuyi Ir Mrjsvqexmuyi'],
          },
        ],
        presetHints: {
          level1: 'Une fois les doubles espaces et espaces de bord supprimés, `P` est égal au nombre d’espaces restants + 1 (si message non vide).',
          level2: 'Pour une majuscule `c` : `base = ord("A")` (65). Le nouveau caractère est `chr(base + (ord(c) - base + P) % 26)`.',
          level3: 'Pour une minuscule `c` : même formule avec `base = ord("a")` (97).',
          level4: 'Si `c == " "`, on le laisse inchangé !',
        },
        conceptToReview: 'Chiffrement ASCII et modulo 26',
        active: true,
      },
      {
        id: 'ex-p65-crypt',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Exercice p. 65',
        title: 'Les messages cryptés (Rang alphabet + 35)',
        category: 'Exercice d’application',
        sourcePage: 65,
        sourcePageNote: 'Page 65 (71)',
        difficulty: 'Application',
        estimatedMinutes: 15,
        kind: 'python',
        originalStatement:
          'Écrire un programme Python qui permet de crypter un message donné (formé uniquement de lettres majuscules séparées par un seul espace) selon le procédé :\n1) Remplacer chaque lettre par son rang dans l’alphabet (1 pour A à 26 pour Z), et l’espace par 0.\n2) Ajouter 35 à chaque nombre obtenu (résultat entre 35 et 61).\n3) Associer le caractère correspondant à ce code ASCII.\nExemple : "VERS LA VICTOIRE" → "9(56#/$#9,&72,5(".',
        understandWork:
          'Calcule le rang d’une lettre majuscule `c` grâce à `ord(c) - ord("A") + 1` (ou `ord(c) - 64`), ajoute `35`, et convertis avec `chr(...)`. Pour l’espace, `0 + 35 = 35` donne `chr(35) = "#"` !',
        objectives: [
          'Traduire une correspondance mathématique avec ord() et chr() en Python',
        ],
        reflectionQuestions: [
          'Si ord("A") = 65, quelle valeur faut-il soustraire pour obtenir rang = 1 ?',
        ],
        workspaceConfig: {
          starterPython: 'msg = input("Message en majuscules : ")\ncrypte = ""\n',
          defaultInputs: ['VERS LA VICTOIRE'],
        },
        testCases: [
          { id: 'tc1', label: 'VERS LA VICTOIRE', inputs: ['VERS LA VICTOIRE'], expectedOutputs: ['9(56#/$#9,&72,5('] },
        ],
        presetHints: {
          level1: 'Parcours chaque caractère `c` de `msg` avec `for c in msg:`.',
          level2: 'Si `c == " "`: `rang = 0`. Sinon : `rang = ord(c) - 64` (car 65 - 64 = 1).',
          level3: 'Ajoute 35 puis concatène `chr(rang + 35)` à `crypte`.',
          level4: 'Affiche `crypte` à la fin et vérifie qu’il produit bien `9(56#/$#9,&72,5(` pour `VERS LA VICTOIRE`.',
        },
        conceptToReview: 'Conversions ASCII ord() / chr() (page 10)',
        active: true,
      },
      {
        id: 'ex-p66-pal',
        chapterId: 'ch7-synthese',
        lessonId: 'les-7-1-synthese',
        numberLabel: 'Exercice p. 66',
        title: 'Les nombres palindromes (Suite palindromique)',
        category: 'Projet',
        sourcePage: 66,
        sourcePageNote: 'Page 66 (71)',
        difficulty: 'Défi',
        estimatedMinutes: 20,
        kind: 'python',
        originalStatement:
          'Écrire un programme Python qui, à partir d’un entier naturel N donné (avec N ≥ 10), détermine et affiche sa suite palindromique (on inverse les chiffres de N et on l’ajoute à N jusqu’à obtenir un palindrome).\n• Afficher les termes suivi de "Cette suite est palindromique" si le nombre de termes est ≤ 10.\n• Si on arrive à 11 termes sans trouver de palindrome, afficher les termes et le message "le calcul de 11 termes ne donne pas une suite palindromique pour ce nombre".\nExemples : 64 → 64, 110, 121 | 1048 → 1048, 9449.',
        understandWork:
          'Écris deux petites fonctions : `inverser_nb(n)` (qui retourne `int(str(n)[::-1])` ou via boucle `mod 10`) et `est_palindrome(n)` (`str(n) == str(n)[::-1]`). Ensuite, avec une boucle `while`, construis les termes jusqu’à ce que `est_palindrome(N)` soit vrai OU que le compteur atteigne 11 termes.',
        objectives: [
          'Combiner boucle à double condition d’arrêt et fonctions utilitaires',
          'Gérer le garde-fou d’arrêt à 11 termes (cas de 196)',
        ],
        reflectionQuestions: [
          'Quelles sont les deux conditions d’arrêt de la boucle ?',
          'Combien de termes contient la suite pour N = 64 ? Et pour N = 196 ?',
        ],
        workspaceConfig: {
          starterPython:
            'def est_pal(n):\n    s = str(n)\n    return s == s[::-1]\n\ndef inverser_nb(n):\n    return int(str(n)[::-1])\n\nN = int(input("N (>= 10) : "))\n',
          defaultInputs: ['64'],
        },
        testCases: [
          { id: 'tc1', label: 'N = 64 -> 64, 110, 121', inputs: ['64'], expectedOutputs: ['64', '110', '121', 'Cette suite est palindromique'] },
          { id: 'tc2', label: 'N = 1048 -> 1048, 9449', inputs: ['1048'], expectedOutputs: ['1048', '9449', 'Cette suite est palindromique'] },
          { id: 'tc3', label: 'N = 196 -> 11 termes sans palindrome', inputs: ['196'], expectedOutputs: ['le calcul de 11 termes ne donne pas une suite palindromique pour ce nombre'] },
        ],
        presetHints: {
          level1: 'Stocke les termes dans une liste `termes = [N]` (donc `nb_termes = 1` au départ).',
          level2: 'Boucle `while not est_pal(N) and len(termes) < 11:` : calcule `N = N + inverser_nb(N)` et ajoute `N` à `termes`.',
          level3: 'Après la boucle : si `est_pal(N)` (et `len(termes) <= 10`), affiche "Cette suite est palindromique".',
          level4: 'Sinon affiche "le calcul de 11 termes ne donne pas une suite palindromique pour ce nombre".',
        },
        conceptToReview: 'Boucles while à double condition et palindromes',
        active: true,
      },
    ],
  },
];
