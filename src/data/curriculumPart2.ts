import type { Chapter } from '../types/algolab';

export const CHAPTERS_PART_2: Chapter[] = [
  {
    id: 'ch4-tableaux',
    order: 4,
    title: 'Chapitre 4 : Le Type Tableau à une Dimension',
    subtitle: 'Déclaration (TDNT / TDO / numpy.array), remplissage, affichage et traitement',
    sourcePages: 'Pages 22–27',
    description:
      'Comprendre pourquoi utiliser un tableau pour gérer de nombreuses valeurs homogènes, déclarer un tableau en algorithme et en Python, le remplir et effectuer des calculs statistiques.',
    lessons: [
      {
        id: 'les-4-1-tableau',
        chapterId: 'ch4-tableaux',
        order: 1,
        title: 'Découverte et déclaration d’un tableau à une dimension',
        sourcePages: 'Pages 22–23',
        objectives: [
          'Comprendre pourquoi on utilise un tableau plutôt que 1000 variables séparées',
          'Connaître les composants d’un tableau (nom, type des éléments, indices)',
          'Déclarer un tableau dans le TDNT/TDO et en Python avec numpy.array',
        ],
        definitions: [
          {
            term: 'Tableau (ou vecteur)',
            meaning:
              'Structure de données permettant de ranger un nombre fini d’éléments de même type (entier, réel, caractère, chaîne, booléen).',
          },
          {
            term: 'Indice d’un tableau',
            meaning: 'Position d’une case du tableau (de type scalaire : entier, caractère ou booléen). En Python et en 3SC, les indices commencent à 0.',
          },
        ],
        contentSections: [
          {
            heading: 'Déclaration en Algorithme (T.D.N.T et T.D.O.)',
            body: 'On déclare d’abord le nouveau type dans le T.D.N.T (Tableau de Déclaration des Nouveaux Types), puis la variable tableau dans le T.D.O.',
            bullets: [
              'T.D.N.T : Tab1 : tableau de 30 chaînes de caractères.',
              'T.D.O : Tnom : Tab1 ; Tpénom : Tab1 ; Tsal : Tab2.',
              'En Python : from numpy import array puis t = array([int()] * 20) (ou liste Python [0]*20).',
            ],
          },
        ],
        syntaxExamples: [
          {
            title: 'Déclaration et accès aux éléments',
            algo: 'T.D.N.T :\n  Tab : tableau de 20 entiers\nT.D.O :\n  t : Tab\nt[0] ← 14',
            python: 'from numpy import array\nt = array([int()] * 20)\nt[0] = 14',
            note: 'Les indices d’un tableau de taille N vont de 0 à N - 1.',
          },
        ],
        interactiveDemo: {
          title: 'Parcours mémoire d’un tableau b de buts (page 22)',
          description: 'Visualise comment une boucle Pour remplit et lit chaque case b[i] d’indice 0 à 4.',
          codeLines: [
            'b = [2, 1, 3, 0, 4]',
            'total = 0',
            'for i in range(5):',
            '    total = total + b[i]',
            'print(total)',
          ],
          steps: [
            { label: 'Départ', highlightLine: 1, variables: { total: 0 }, explanation: 'Le tableau b contient 5 scores et total = 0.' },
            { label: 'i = 0 → b[0]=2', highlightLine: 3, variables: { i: 0, 'b[0]': 2, total: 2 }, explanation: 'On ajoute b[0] (2) à total.' },
            { label: 'i = 1 → b[1]=1', highlightLine: 3, variables: { i: 1, 'b[1]': 1, total: 3 }, explanation: 'On ajoute b[1] (1) à total.' },
            { label: 'i = 2 → b[2]=3', highlightLine: 3, variables: { i: 2, 'b[2]': 3, total: 6 }, explanation: 'On ajoute b[2] (3) à total.' },
            { label: 'i = 3 → b[3]=0', highlightLine: 3, variables: { i: 3, 'b[3]': 0, total: 6 }, explanation: 'On ajoute b[3] (0) à total.' },
            { label: 'i = 4 → b[4]=4', highlightLine: 3, variables: { i: 4, 'b[4]': 4, total: 10 }, explanation: 'On ajoute b[4] (4), total vaut 10.' },
          ],
        },
        comprehensionCheck: {
          prompt: 'Si un tableau T contient N éléments à partir de l’indice 0, quel est l’indice de sa dernière case ?',
          options: ['N', 'N + 1', 'N - 1', '1'],
          correctIndex: 2,
          explanation: 'En commençant à 0, les N cases sont numérotées 0, 1, ..., N - 1.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p24-1',
        chapterId: 'ch4-tableaux',
        lessonId: 'les-4-1-tableau',
        numberLabel: 'Exercice 1 (p. 24)',
        title: 'Remplir et déclarer les tableaux t et v',
        category: 'Exercice guidé',
        sourcePage: 24,
        difficulty: 'Entraînement',
        estimatedMinutes: 15,
        kind: 'trace_table',
        originalStatement:
          'Soit les tableaux t et v et soit ch = "python123".\nRemplir t et v avec les séquences suivantes :\nt[0] ← long(ch)\nt[1] ← pos("t", ch)\nt[2] ← t[0] mod 4\nv[0] ← sous-chaine(ch, 6, 8)\nt[3] ← valeur(v[0])\nv[1] ← convch(t[2])\nv[2] ← "langage " + ch\n2) Déclarer les deux tableaux t et v en algorithme et en Python.',
        understandWork:
          'Exécute les 7 instructions ligne par ligne en partant de ch = "python123" (longueur 9 : p(0)y(1)t(2)h(3)o(4)n(5)1(6)2(7)3(8)), remplis les 4 cases de t et les 3 cases de v, puis écris leurs déclarations.',
        objectives: [
          'Évaluer des instructions affectant des cases d’un tableau',
          'Déclarer deux tableaux de types différents (entiers et chaînes)',
        ],
        reflectionQuestions: [
          'Que vaut long("python123") ?',
          'Quels caractères extrait sous-chaine("python123", 6, 8) ?',
        ],
        workspaceConfig: {
          tableHeaders: ['Case', 'Expression', 'Valeur finale'],
          tableRows: [
            { id: 't0', cells: [{ key: 'c', prefilled: 't[0]', editable: false }, { key: 'e', prefilled: 'long(ch)', editable: false }, { key: 'v', label: 't[0]', editable: true, acceptedAnswers: ['9'] }] },
            { id: 't1', cells: [{ key: 'c', prefilled: 't[1]', editable: false }, { key: 'e', prefilled: 'pos("t", ch)', editable: false }, { key: 'v', label: 't[1]', editable: true, acceptedAnswers: ['2'] }] },
            { id: 't2', cells: [{ key: 'c', prefilled: 't[2]', editable: false }, { key: 'e', prefilled: 't[0] mod 4', editable: false }, { key: 'v', label: 't[2]', editable: true, acceptedAnswers: ['1'] }] },
            { id: 'v0', cells: [{ key: 'c', prefilled: 'v[0]', editable: false }, { key: 'e', prefilled: 'sous-chaine(ch,6,8)', editable: false }, { key: 'v', label: 'v[0]', editable: true, acceptedAnswers: ['"12"', "'12'", '12'] }] },
            { id: 't3', cells: [{ key: 'c', prefilled: 't[3]', editable: false }, { key: 'e', prefilled: 'valeur(v[0])', editable: false }, { key: 'v', label: 't[3]', editable: true, acceptedAnswers: ['12'] }] },
            { id: 'v1', cells: [{ key: 'c', prefilled: 'v[1]', editable: false }, { key: 'e', prefilled: 'convch(t[2])', editable: false }, { key: 'v', label: 'v[1]', editable: true, acceptedAnswers: ['"1"', "'1'"] }] },
            { id: 'v2', cells: [{ key: 'c', prefilled: 'v[2]', editable: false }, { key: 'e', prefilled: '"langage " + ch', editable: false }, { key: 'v', label: 'v[2]', editable: true, acceptedAnswers: ['"langage python123"', "'langage python123'", 'langage python123'] }] },
          ],
          subQuestions: [
            {
              id: 'decl_algo',
              prompt: '2a) Déclaration en algorithme (TDNT / TDO) :',
              placeholder: 'Tab1 : tableau de 4 entiers...',
              keyPoints: ['4 entiers', '3 chaînes'],
            },
            {
              id: 'decl_py',
              prompt: '2b) Déclaration en Python :',
              placeholder: 'from numpy import array\nt = array([int()]*4)...',
              keyPoints: ['array', '4', '3'],
            },
          ],
        },
        presetHints: {
          level1: 'Compte d’abord le nombre exact de caractères de "python123" (6 lettres + 3 chiffres).',
          level2: 'Les indices 6 et 7 correspondent aux deux premiers chiffres ("1" et "2"), 8 est exclu.',
          level3: 't contient uniquement des entiers (4 cases), v contient uniquement des chaînes (3 cases).',
          level4: 'Attention : v[1] ← convch(t[2]) donne la chaîne "1" (avec guillemets), pas l’entier 1.',
        },
        conceptToReview: 'Tableaux et fonctions chaînes (pages 12 et 23)',
        active: true,
      },
      {
        id: 'ex-p24-2',
        chapterId: 'ch4-tableaux',
        lessonId: 'les-4-1-tableau',
        numberLabel: 'Exercice 2 (p. 24)',
        title: 'Expressions algorithmiques pour remplir un tableau T',
        category: 'Exercice guidé',
        sourcePage: 24,
        difficulty: 'Entraînement',
        estimatedMinutes: 12,
        kind: 'fill_blanks',
        originalStatement:
          'Soit les variables suivantes : X ← 12.5 ; Y ← "FIFA 2021".\nSoit le tableau T = [12, 13, 65, 9, 2021].\n1) Écrire les expressions algorithmiques qui permettent d’aboutir aux valeurs mentionnées dans le tableau ci-dessus en utilisant les variables X et Y pour T[0], T[1], T[2] (et optionnellement T[3], T[4]).',
        understandWork:
          'Tu dois trouver quelles fonctions prédéfinies appliquées à X (12.5) et Y ("FIFA 2021") produisent 12, 13 et 65 ! Pense aux fonctions Ent(), Arrondi() et ord().',
        objectives: [
          'Relier les fonctions Ent, Arrondi, ord, long, valeur aux valeurs produites',
        ],
        reflectionQuestions: [
          'Quelle fonction transforme 12.5 en 12 ? Et en 13 ?',
          'Quel caractère de Y a pour code ASCII 65 ?',
        ],
        workspaceConfig: {
          blanksTemplate: 'T[0] ← [t0]\nT[1] ← [t1]\nT[2] ← [t2]',
          blankFields: [
            { id: 't0', label: 'T[0] (vaut 12)', placeholder: 'Ent(X)', acceptedAnswers: ['Ent(X)', 'ent(X)', 'Ent(x)', 'int(X)'] },
            { id: 't1', label: 'T[1] (vaut 13)', placeholder: 'Arrondi(X)', acceptedAnswers: ['Arrondi(X)', 'arrondi(X)', 'Arrondi(x)', 'Ent(X)+1', 'round(X)+1'] },
            { id: 't2', label: 'T[2] (vaut 65)', placeholder: 'ord(Y[3])', acceptedAnswers: ['ord(Y[3])', "ord('A')", 'ord(Y[long(Y)-6])'] },
          ],
        },
        presetHints: {
          level1: 'Regarde X = 12.5 : comment obtenir la partie entière 12 ?',
          level2: 'En algorithme, Arrondi(12.5) donne 13 (ou Ent(X) + 1).',
          level3: 'Pour 65, cherche dans Y = "FIFA 2021" la lettre majuscule "A" (indice 3) et utilise ord().',
          level4: 'Y[0]="F", Y[1]="I", Y[2]="F", Y[3]="A" → ord(Y[3]) = 65 !',
        },
        conceptToReview: 'Fonctions numériques et ASCII (pages 9–10)',
        active: true,
      },
      {
        id: 'ex-p25-app1',
        chapterId: 'ch4-tableaux',
        lessonId: 'les-4-1-tableau',
        numberLabel: 'Application 1 (p. 25)',
        title: 'Saisir n, remplir et afficher un tableau T',
        category: 'Activité',
        sourcePage: 25,
        difficulty: 'Découverte',
        estimatedMinutes: 12,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire un algorithme d’un programme qui permet de saisir un entier n représentant le nombre des cases d’un tableau T, puis remplir le tableau T par des entiers, puis afficher le tableau.',
        understandWork:
          'C’est le schéma de base de tout exercice sur les tableaux : 1) Lire n ; 2) Utiliser une boucle Pour i de 0 à n-1 Faire Lire(T[i]) ; 3) Utiliser une deuxième boucle Pour i de 0 à n-1 Faire Ecrire(T[i]).',
        objectives: [
          'Écrire les boucles standards de remplissage et d’affichage d’un tableau',
        ],
        reflectionQuestions: [
          'De quel indice à quel indice varie i pour parcourir toutes les n cases ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Remplir_Afficher\nDébut\n    Ecrire("Donner n : ")\n    Lire(n)\n    // Remplissage\n    \n    // Affichage\n    \nFin',
          starterPython: 'n = int(input("Donner n : "))\nT = [0] * n\n# Remplissage et affichage\n',
          defaultInputs: ['3', '10', '20', '30'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour'],
          criteriaNotes: ['Lire n', 'Boucle Pour i de 0 à n-1 : Lire(T[i])', 'Boucle Pour i de 0 à n-1 : Ecrire(T[i])'],
        },
        testCases: [
          { id: 'tc1', label: 'Tableau [10, 20, 30]', inputs: ['3', '10', '20', '30'], expectedOutputs: ['10', '20', '30'] },
        ],
        presetHints: {
          level1: 'Souviens-toi : pour n cases, les indices vont de 0 à n - 1.',
          level2: 'Utilise `Pour i de 0 à n - 1 Faire` avec `Lire(T[i])` pour remplir.',
          level3: 'Utilise une seconde boucle `Pour i de 0 à n - 1 Faire` avec `Ecrire(T[i])` pour afficher.',
          level4: 'En Python : `for i in range(n): T[i] = int(input())`.',
        },
        conceptToReview: 'Manipulation d’un tableau (page 25)',
        active: true,
      },
      {
        id: 'ex-p26-2',
        chapterId: 'ch4-tableaux',
        lessonId: 'les-4-1-tableau',
        numberLabel: 'Exercice 2 (p. 26)',
        title: 'Validation de propositions sur les tableaux (V / F)',
        category: 'Exercice d’application',
        sourcePage: 26,
        difficulty: 'Découverte',
        estimatedMinutes: 10,
        kind: 'true_false',
        originalStatement:
          'Pour chacune des propositions suivantes, valider chaque proposition en mettant V si elle est correcte ou F dans le cas contraire (groupes a, b, c, d).',
        understandWork:
          'Vérifie les règles fondamentales du type Tableau : homogénéité des éléments, types possibles pour les indices, syntaxe du TDNT, et bornes de la boucle de remplissage.',
        objectives: [
          'Identifier les types autorisés pour les indices d’un tableau',
          'Éviter l’erreur classique d’indice allant jusqu’à n au lieu de n-1',
        ],
        reflectionQuestions: [
          'Un indice peut-il être de type Réel ou Chaîne de caractères ?',
          'Combien d’itérations fait Pour i de 0 à n Faire ?',
        ],
        workspaceConfig: {
          trueFalseItems: [
            { id: 'a1', statement: 'a) Un tableau en algorithme : Permet de ranger des éléments de même type', expectedValue: 'V', explanation: 'Tous les éléments d’un tableau ont le même type.' },
            { id: 'a2', statement: 'a) Un tableau en algorithme : Permet de ranger des éléments de types différents', expectedValue: 'F', explanation: 'Un tableau est homogène (même type).' },
            { id: 'a3', statement: 'a) Un tableau en algorithme : Commence toujours par l’indice 0', expectedValue: 'V', explanation: 'En Python et dans ce cours, l’indice initial est 0.' },
            { id: 'b1', statement: 'b) Les indices d’un tableau peuvent être de type : Caractère', expectedValue: 'V', explanation: 'Le type caractère est un type scalaire.' },
            { id: 'b2', statement: 'b) Les indices d’un tableau peuvent être de type : Chaîne de caractère', expectedValue: 'F', explanation: 'Chaîne de caractères n’est pas un type scalaire.' },
            { id: 'b3', statement: 'b) Les indices d’un tableau peuvent être de type : Réels', expectedValue: 'F', explanation: 'Réel n’est pas un type scalaire.' },
            { id: 'c1', statement: 'c) TDNT pour 20 codes : Tab un tableau de 20 chaînes', expectedValue: 'V', explanation: 'On déclare un nom de type (Tab), puis la variable T est de type Tab.' },
            { id: 'c2', statement: 'c) TDNT pour 20 codes : T est un tableau de 20 chaînes', expectedValue: 'F', explanation: 'Dans le TDNT on déclare le type (Tab), pas la variable T.' },
            { id: 'c3', statement: 'c) TDNT pour 20 codes : Tab un tableau de 20 entiers', expectedValue: 'F', explanation: '"Lettrechiffre" est une chaîne, pas un entier.' },
            { id: 'd1', statement: 'd) Remplir n entiers : Pour i de 0 à n-1 faire Lire(t[i]) Fin pour', expectedValue: 'V', explanation: '0 à n-1 parcourt exactement n cases.' },
            { id: 'd2', statement: 'd) Remplir n entiers : Pour i de 0 à n faire Lire(t[i]) Fin pour', expectedValue: 'F', explanation: '0 à n donne n+1 cases (débordement).' },
            { id: 'd3', statement: 'd) Remplir n entiers : Pour i de 1 à n faire Lire(t[i]) Fin pour', expectedValue: 'F', explanation: 'L’indice commence à 0 et non à 1.' },
          ],
        },
        presetHints: {
          level1: 'Relis la page 23 : les indices sont de type scalaire (entier, caractère, booléen).',
          level2: 'Dans le TDNT, on déclare le nom du nouveau type (ex : Tab), et dans le TDO on déclare la variable T.',
          level3: 'Un code sous forme "Lettrechiffre" mélange lettre et chiffre : c’est donc une chaîne de caractères.',
          level4: 'Pour n cases indexées à partir de 0, la boucle va toujours de 0 à n - 1.',
        },
        conceptToReview: 'Déclaration et indices d’un tableau (page 23)',
        active: true,
      },
      {
        id: 'ex-p26-3',
        chapterId: 'ch4-tableaux',
        lessonId: 'les-4-1-tableau',
        numberLabel: 'Exercice 3 (p. 26)',
        title: 'Gestion des notes d’une classe (Max, Min, Moyenne)',
        category: 'Exercice d’application',
        sourcePage: 26,
        difficulty: 'Application',
        estimatedMinutes: 20,
        kind: 'algorithm_and_python',
        originalStatement:
          'Un enseignant souhaite réaliser un programme permettant de gérer les notes des élèves d’une classe.\nÉcrire un algorithme d’un programme qui permet de :\n1) Saisir le nombre N de notes à traiter.\n2) Remplir un tableau T par les N notes des élèves.\n3) Afficher tous les éléments du tableau T.\n4) Déterminer et afficher la note maximale et la note minimale.\n5) Calculer et afficher la moyenne des notes.\nExemple pour N = 5 : [14.5, 10.75, 16.25, 12.5, 9.75] → Max : 16.25, Min : 9.75, Moyenne : 12.75.',
        understandWork:
          'Tu dois structurer le programme en étapes claires : saisie de N, remplissage du tableau T de réels, affichage des notes, puis calcul du maximum, du minimum (initialisés tous les deux à T[0]) et de la somme pour obtenir la moyenne S / N.',
        objectives: [
          'Manipuler un tableau de réels',
          'Rechercher le maximum et le minimum dans un tableau',
          'Calculer la moyenne des éléments d’un tableau',
        ],
        reflectionQuestions: [
          'Pourquoi doit-on initialiser note_max et note_min à T[0] plutôt qu’à 0 ?',
          'Que se passerait-il pour note_min si on l’initialisait à 0 ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Gestion_Notes\nDébut\n    \nFin',
          starterPython: 'N = int(input("Nombre de notes N : "))\nT = [0.0] * N\n',
          defaultInputs: ['5', '14.5', '10.75', '16.25', '12.5', '9.75'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour', 'si'],
          criteriaNotes: ['Initialiser max ← T[0], min ← T[0], s ← 0', 'Parcourir T avec Pour', 'Afficher max, min et s / N'],
        },
        testCases: [
          { id: 'tc1', label: 'Exemple cahier (N=5)', inputs: ['5', '14.5', '10.75', '16.25', '12.5', '9.75'], expectedOutputs: ['16.25', '9.75', '12.75'] },
        ],
        presetHints: {
          level1: 'Commence par remplir T avec une boucle `for i in range(N): T[i] = float(input(...))`.',
          level2: 'Initialise `maxi = T[0]`, `mini = T[0]` et `somme = 0` avant la boucle de calcul.',
          level3: 'Dans la boucle de calcul : `if T[i] > maxi: maxi = T[i]`, `if T[i] < mini: mini = T[i]`, et `somme = somme + T[i]`.',
          level4: 'La moyenne est `somme / N` après la boucle.',
        },
        conceptToReview: 'Tableaux et recherche de min/max/moyenne',
        active: true,
      },
      {
        id: 'ex-p27-4',
        chapterId: 'ch4-tableaux',
        lessonId: 'les-4-1-tableau',
        numberLabel: 'Exercice 4 (p. 27)',
        title: 'Gestion des tableaux et chaînes (T, V, W, K)',
        category: 'Projet',
        sourcePage: 27,
        difficulty: 'Défi',
        estimatedMinutes: 25,
        kind: 'algorithm_and_python',
        originalStatement:
          'Partie 1 : Un programme doit manipuler plusieurs tableaux :\n1) Saisir la taille d’un tableau n.\n2) Remplir T contenant n entiers.\n3) Remplir V contenant n entiers aléatoires composés de 2 chiffres.\n4) Remplir W contenant n chaînes non vides.\n5) Remplir K par la somme de T, V et la longueur de chaque chaîne de W.\n6) Afficher la somme des nombres pairs de K.\n7) Afficher les entiers multiples de 5 de K.\n8) Afficher le maximum de K.',
        understandWork:
          'Cet exercice de synthèse combine 4 tableaux parallèles de même taille n. Pour chaque indice i de 0 à n-1, K[i] = T[i] + V[i] + long(W[i]). Ensuite tu parcours K pour calculer la somme des pairs (K[i] mod 2 = 0), afficher les multiples de 5 (K[i] mod 5 = 0) et trouver le maximum.',
        objectives: [
          'Gérer plusieurs tableaux parallèles de même taille',
          'Combiner nombres aléatoires (Aléa(10, 99)), chaînes et filtres MOD',
        ],
        reflectionQuestions: [
          'Entre quelles bornes se situent les entiers positifs composés de 2 chiffres ?',
          'Comment vérifier que chaque chaîne saisie dans W[i] est non vide ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Gestion_Tableaux_Chaines\nDébut\n    \nFin',
          starterPython:
            'from random import randint\nn = int(input("Taille n : "))\nT = [0] * n\nV = [0] * n\nW = [""] * n\nK = [0] * n\n',
          defaultInputs: ['3', '10', '9', '17', 'mouna', 'ali', 'bonbon'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour', 'si'],
          criteriaNotes: ['V[i] ← Aléa(10, 99)', 'K[i] ← T[i] + V[i] + long(W[i])', 'Somme pairs (mod 2 = 0), multiples de 5 (mod 5 = 0), max de K'],
        },
        presetHints: {
          level1: 'Un entier de 2 chiffres est généré par `Aléa(10, 99)` (`randint(10, 99)`).',
          level2: 'Pour chaque indice i, `K[i] = T[i] + V[i] + len(W[i])`.',
          level3: 'Un entier est pair si `K[i] % 2 == 0` et multiple de 5 si `K[i] % 5 == 0`.',
          level4: 'Initialise `maxi = K[0]` avant la boucle qui cherche le maximum de K.',
        },
        conceptToReview: 'Tableaux parallèles, Aléa et DIV/MOD',
        active: true,
      },
    ],
  },
  {
    id: 'ch5-boucles-condition',
    order: 5,
    title: 'Chapitre 5 : Les Structures Itératives à Condition d’Arrêt',
    subtitle: 'Boucle « Répéter ... Jusqu’à » (while not) & Boucle « Tant Que ... Faire » (while)',
    sourcePages: 'Pages 28–43',
    description:
      'Savoir quand la boucle Pour atteint ses limites, choisir entre Répéter...Jusqu’à (au moins 1 fois) et Tant Que...Faire (0 à N fois), et résoudre des problèmes classiques (contrôle de saisie, PGCD, PPCM, Syracuse, binaire).',
    lessons: [
      {
        id: 'les-5-1-repeter',
        chapterId: 'ch5-boucles-condition',
        order: 1,
        title: 'La boucle « Répéter ... Jusqu’à » & traduction Python (while not)',
        sourcePages: 'Pages 28–31',
        objectives: [
          'Identifier les limites de la boucle Pour (exemple du code PIN)',
          'Comprendre le fonctionnement de Répéter ... Jusqu’à (exécutée au moins 1 fois)',
          'Traduire Répéter ... Jusqu’à en Python avec while not (Condition_d_arrêt):',
        ],
        definitions: [
          {
            term: 'Boucle Répéter ... Jusqu’à',
            meaning: 'Le bloc est exécuté au moins une fois, puis la condition d’arrêt est testée à la fin de chaque tour : si Fausse → on répète ; si Vraie → on sort.',
          },
          {
            term: 'Règle d’initialisation en Python',
            meaning: 'Comme while teste dès l’entrée, il faut initialiser la variable avant la boucle avec une valeur qui rend la condition d’arrêt Fausse pour forcer le 1er tour.',
          },
        ],
        contentSections: [
          {
            heading: 'Situation problème : Déverrouillage d’un téléphone (Code PIN 1234)',
            body: 'Avec Pour i de 1 à 3, si l’utilisateur tape 1234 au 1er essai le programme continue inutilement, et s’il se trompe 3 fois il déverrouille quand même ! Le nombre de répétitions est inconnu à l’avance : l’arrêt doit dépendre d’une condition.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Algorithme Code_Repeter vs Python while not',
            algo: 'Répéter\n    Ecrire("Donner le code PIN : ")\n    Lire(code)\nJusqu\'à (code = 1234)\nEcrire("Téléphone déverrouillé !")',
            python: 'code = 0  # Initialisation pour entrer au 1er tour\nwhile not (code == 1234):\n    code = int(input("Donner le code PIN : "))\nprint("Téléphone déverrouillé !")',
          },
        ],
        interactiveDemo: {
          title: 'Trace pas à pas : Activité page 30 (N ← 3, S ← 0)',
          description: 'Observe comment Répéter exécute le corps avant de vérifier S >= 15.',
          codeLines: [
            'N ← 3 ; S ← 0',
            'Répéter',
            '    S ← S + N',
            '    N ← N + 2',
            'Jusqu\'à (S >= 15)',
            'Ecrire("S = ", S, " N = ", N)',
          ],
          steps: [
            { label: 'Départ', highlightLine: 0, variables: { S: 0, N: 3 }, explanation: 'S = 0 et N = 3.' },
            { label: 'Tour 1', highlightLine: 4, variables: { S: 3, N: 5 }, conditionEvaluated: '3 >= 15', conditionResult: false, explanation: 'S = 0+3 = 3, N = 3+2 = 5. 3 >= 15 est FAUX → on continue.' },
            { label: 'Tour 2', highlightLine: 4, variables: { S: 8, N: 7 }, conditionEvaluated: '8 >= 15', conditionResult: false, explanation: 'S = 3+5 = 8, N = 5+2 = 7. 8 >= 15 est FAUX → on continue.' },
            { label: 'Tour 3', highlightLine: 4, variables: { S: 15, N: 9 }, conditionEvaluated: '15 >= 15', conditionResult: true, explanation: 'S = 8+7 = 15, N = 7+2 = 9. 15 >= 15 est VRAI → Arrêt !' },
            { label: 'Affichage final', highlightLine: 5, variables: { S: 15, N: 9 }, output: 'S = 15  N = 9', explanation: 'Fin de boucle après 3 tours.' },
          ],
        },
        comprehensionCheck: {
          prompt: 'Combien de fois au minimum s’exécute le bloc d’une boucle « Répéter ... Jusqu’à » ?',
          options: ['0 fois', '1 fois', '2 fois', 'Infini'],
          correctIndex: 1,
          explanation: 'Le test étant placé à la fin, le bloc est toujours exécuté au moins 1 fois.',
        },
      },
      {
        id: 'les-5-2-tantque',
        chapterId: 'ch5-boucles-condition',
        order: 2,
        title: 'La boucle « Tant Que ... Faire » (while) & Comparaison',
        sourcePages: 'Pages 37–40',
        objectives: [
          'Comprendre pourquoi tester la condition AVANT d’agir (situation carte prépayée)',
          'Appliquer la règle des 3 Piliers I-C-M (Initialisation, Condition, Mise à jour)',
          'Comparer Répéter...Jusqu’à et Tant Que...Faire (while not vs while)',
        ],
        definitions: [
          {
            term: 'Règle des 3 Piliers (I - C - M)',
            meaning: '1) [I] Initialisation avant la boucle ; 2) [C] Condition de maintien testée au début ; 3) [M] Mise à jour dans la boucle pour éviter une boucle infinie.',
          },
          {
            term: 'Condition d’arrêt vs Condition de maintien',
            meaning: 'Cond_Arrêt = NON(Cond_Maintien). Exemple : Jusqu’à (X >= 10) équivaut à Tant Que (X < 10) Faire.',
          },
        ],
        contentSections: [
          {
            heading: 'Situation problème : Carte prépayée (5 DT par ticket)',
            body: 'Si le solde initial vaut 2 DT (< 5), une boucle Répéter distribuerait un ticket par erreur et laisserait un solde de -3 DT ! Avec Tant Que (solde >= 5), le bloc peut s’exécuter 0 fois.',
          },
        ],
        syntaxExamples: [
          {
            title: 'Algorithme Achat_Correct vs Python while',
            algo: 'Lire(solde)\nTant Que (solde >= 5) Faire\n    solde ← solde - 5\n    Ecrire("Ticket distribué !")\nFin Tant Que\nEcrire("Solde restant : ", solde)',
            python: 'solde = int(input("Donner le solde : "))\nwhile (solde >= 5):\n    solde = solde - 5\n    print("Ticket distribué !")\nprint("Solde restant :", solde)',
          },
        ],
        interactiveDemo: {
          title: 'Trace pas à pas : Tant Que (X > 3) (page 39)',
          description: 'Observe que la condition est testée AVANT le corps à chaque tour (y compris le test de sortie).',
          codeLines: [
            'X = 20 ; Cpt = 0',
            'while (X > 3):',
            '    X = X // 2',
            '    Cpt = Cpt + 1',
            'print("X =", X, "Cpt =", Cpt)',
          ],
          steps: [
            { label: 'Init', highlightLine: 0, variables: { X: 20, Cpt: 0 }, explanation: 'Avant la boucle : X = 20, Cpt = 0.' },
            { label: 'Tour 1', highlightLine: 2, variables: { X: 10, Cpt: 1 }, conditionEvaluated: '20 > 3', conditionResult: true, explanation: '20 > 3 (Vrai) → X = 10, Cpt = 1.' },
            { label: 'Tour 2', highlightLine: 2, variables: { X: 5, Cpt: 2 }, conditionEvaluated: '10 > 3', conditionResult: true, explanation: '10 > 3 (Vrai) → X = 5, Cpt = 2.' },
            { label: 'Tour 3', highlightLine: 2, variables: { X: 2, Cpt: 3 }, conditionEvaluated: '5 > 3', conditionResult: true, explanation: '5 > 3 (Vrai) → X = 2, Cpt = 3.' },
            { label: 'Sortie', highlightLine: 4, variables: { X: 2, Cpt: 3 }, conditionEvaluated: '2 > 3', conditionResult: false, output: 'X = 2 Cpt = 3', explanation: '2 > 3 (Faux → Arrêt !). 4 tests effectués, 3 tours.' },
          ],
        },
        comprehensionCheck: {
          prompt: 'Pour traduire une boucle « Tant Que (Cond) Faire » en Python, faut-il ajouter `not` ?',
          options: [
            'Oui, toujours while not (Cond):',
            'Non, on garde exactement la même condition de maintien while (Cond):',
            'Seulement si Cond contient <',
            'On utilise for à la place',
          ],
          correctIndex: 1,
          explanation: 'Tant Que utilise une condition de maintien tout comme `while` en Python : pas besoin de `not`.',
        },
      },
    ],
    exercises: [
      {
        id: 'ex-p30-trace',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-1-repeter',
        numberLabel: 'Activité Trace (p. 30)',
        title: 'Tournage à la main : Répéter ... Jusqu’à (S ≥ 15)',
        category: 'Activité',
        sourcePage: 30,
        sourcePageNote: 'Page 30 (numérotée 210 dans le PDF)',
        difficulty: 'Découverte',
        estimatedMinutes: 10,
        kind: 'trace_table',
        originalStatement:
          'Faites tourner à la main l’algorithme ci-dessous et complétez le tableau de trace étape par étape :\nN ← 3 ; S ← 0\nRépéter\n    S ← S + N\n    N ← N + 2\nJusqu\'à (S ≥ 15)\nEcrire("S = ", S) ; Ecrire("N = ", N)',
        understandWork:
          'Complète les valeurs de S, N et l’évaluation de la condition d’arrêt (S ≥ 15) pour les Tours 1, 2 et 3, puis donne l’affichage final.',
        objectives: ['Tracer manuellement une boucle Répéter...Jusqu’à'],
        reflectionQuestions: ['À quel moment S atteint-il ou dépasse-t-il 15 ?'],
        workspaceConfig: {
          codeSnippet: 'N ← 3 ; S ← 0\nRépéter\n    S ← S + N\n    N ← N + 2\nJusqu\'à (S ≥ 15)',
          tableHeaders: ['Étape', 'S', 'N', 'Cond (S ≥ 15)'],
          tableRows: [
            { id: 't1', cells: [{ key: 'e', prefilled: 'Tour 1', editable: false }, { key: 's', prefilled: '0 + 3 = 3', editable: false }, { key: 'n', prefilled: '3 + 2 = 5', editable: false }, { key: 'c', label: '3>=15 ?', editable: true, acceptedAnswers: ['Faux', 'F', 'False'] }] },
            { id: 't2', cells: [{ key: 'e', prefilled: 'Tour 2', editable: false }, { key: 's', label: 'S', editable: true, acceptedAnswers: ['8', '3+5=8'] }, { key: 'n', label: 'N', editable: true, acceptedAnswers: ['7', '5+2=7'] }, { key: 'c', label: '8>=15 ?', editable: true, acceptedAnswers: ['Faux', 'F', 'False'] }] },
            { id: 't3', cells: [{ key: 'e', prefilled: 'Tour 3', editable: false }, { key: 's', label: 'S', editable: true, acceptedAnswers: ['15', '8+7=15'] }, { key: 'n', label: 'N', editable: true, acceptedAnswers: ['9', '7+2=9'] }, { key: 'c', label: '15>=15 ?', editable: true, acceptedAnswers: ['Vrai', 'V', 'True'] }] },
          ],
          subQuestions: [
            { id: 'out', prompt: 'Affichage final (S, N et nombre de tours) :', placeholder: 'S = 15 | N = 9 | Tours = 3', keyPoints: ['15', '9', '3'] },
          ],
        },
        presetHints: {
          level1: 'Au Tour 2, on ajoute la valeur actuelle de N (qui est 5) à S (qui vaut 3).',
          level2: 'N augmente de 2 à chaque tour : 3 → 5 → 7 → 9.',
          level3: 'Au Tour 3, S devient 8 + 7 = 15. Comme 15 ≥ 15 est Vrai, la boucle s’arrête.',
          level4: 'Attention : N a bien été incrémenté une dernière fois à 9 avant le test d’arrêt !',
        },
        conceptToReview: 'Boucle Répéter...Jusqu’à (pages 29–30)',
        active: true,
      },
      {
        id: 'ex-p31-1',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-1-repeter',
        numberLabel: 'Exercice 1 (p. 31–32)',
        title: 'Contrôle de saisie avec Répéter et while not',
        category: 'Exercice d’application',
        sourcePage: 31,
        sourcePageNote: 'Pages 31–32 (211–212)',
        difficulty: 'Découverte',
        estimatedMinutes: 15,
        kind: 'fill_blanks',
        originalStatement:
          'Complétez les séquences algorithmiques (Jusqu’à) et leurs traductions en Python (initialisation + while not) afin de contrôler la validité des données :\n• Cas A : Saisir une moyenne réelle moy dans [0, 20].\n• Cas B : Saisir un entier N strictement positif et pair.\n• Cas C : Saisir un entier X composé exactement de 3 chiffres (entre 100 et 999).',
        understandWork:
          'Dans une boucle de contrôle de saisie, la condition placée dans `Jusqu’à (...)` et `while not (...)` est la condition de VALIDITÉ souhaitée ! En Python, il faut initialiser la variable avant la boucle avec une valeur invalide (ex : -1) pour entrer au moins une fois.',
        objectives: [
          'Formuler une condition d’arrêt de saisie valide',
          'Initialiser correctement la variable avant while not',
        ],
        reflectionQuestions: [
          'Quelle condition traduit « N est strictement positif et pair » ?',
          'Quelle valeur d’initialisation rend `0 <= moy <= 20` Fausse dès le départ ?',
        ],
        workspaceConfig: {
          blanksTemplate:
            '// Cas A\nJusqu\'à ( [a_algo] )\nPython init: moy = [a_init]\nwhile not( [a_py] ):\n\n// Cas B\nJusqu\'à ( [b_algo] )\nPython init: N = [b_init]\nwhile not ( [b_py] ):\n\n// Cas C\nJusqu\'à ( [c_algo] )\nPython init: X = [c_init]\nwhile not ( [c_py] ):',
          blankFields: [
            { id: 'a_algo', label: 'Cas A Algo', placeholder: '0 <= moy <= 20', acceptedAnswers: ['0 <= moy <= 20', '(moy >= 0) et (moy <= 20)', 'moy>=0 et moy<=20'] },
            { id: 'a_init', label: 'Init moy Python', placeholder: '-1', acceptedAnswers: ['-1', '21', '-1.0'] },
            { id: 'a_py', label: 'Cas A Python', placeholder: '0 <= moy <= 20', acceptedAnswers: ['0 <= moy <= 20', 'moy >= 0 and moy <= 20'] },
            { id: 'b_algo', label: 'Cas B Algo', placeholder: '(N > 0) et (N mod 2 = 0)', acceptedAnswers: ['(N > 0) et (N mod 2 = 0)', 'N > 0 et N mod 2 = 0', 'N>0 et N MOD 2=0'] },
            { id: 'b_init', label: 'Init N Python', placeholder: '-1', acceptedAnswers: ['-1', '0', '1', '-2'] },
            { id: 'b_py', label: 'Cas B Python', placeholder: 'N > 0 and N % 2 == 0', acceptedAnswers: ['N > 0 and N % 2 == 0', '(N > 0) and (N % 2 == 0)'] },
            { id: 'c_algo', label: 'Cas C Algo', placeholder: '100 <= X <= 999', acceptedAnswers: ['100 <= X <= 999', '(X >= 100) et (X <= 999)'] },
            { id: 'c_init', label: 'Init X Python', placeholder: '0', acceptedAnswers: ['0', '-1', '10', '99'] },
            { id: 'c_py', label: 'Cas C Python', placeholder: '100 <= X <= 999', acceptedAnswers: ['100 <= X <= 999', 'X >= 100 and X <= 999'] },
          ],
        },
        presetHints: {
          level1: 'Dans `Jusqu’à (cond)` et `while not (cond)`, on écrit la condition qui dit que la saisie est CORRECTE.',
          level2: 'Pour qu’un entier N soit pair, le reste de sa division par 2 doit être 0 (`N mod 2 = 0` ou `N % 2 == 0`).',
          level3: 'L’initialisation avant `while not` doit être une valeur qui NE respecte PAS la règle (ex : `-1` ou `0`).',
          level4: 'Un entier positif de 3 chiffres est compris entre 100 et 999 inclus.',
        },
        conceptToReview: 'Contrôle de saisie avec Répéter et while not (page 31)',
        active: true,
      },
      {
        id: 'ex-p32-proj',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-1-repeter',
        numberLabel: 'Projet 1 (p. 32–34)',
        title: 'Jeu « Deviner le nombre mystère »',
        category: 'Projet',
        sourcePage: 32,
        sourcePageNote: 'Pages 32–34 (212–214)',
        difficulty: 'Défi',
        estimatedMinutes: 30,
        kind: 'algorithm_and_python',
        originalStatement:
          'Vous allez concevoir le jeu dans lequel le joueur doit retrouver un nombre secret compris entre 1 et 100 avec un maximum de 5 tentatives. Après chaque proposition, le jeu indique « Plus grand », « Plus petit » ou « Bravo » selon le résultat. Arrêter le jeu en cas de réussite ou lorsque les 5 tentatives sont épuisées, et afficher le nombre secret en cas d’échec.',
        understandWork:
          'Ce projet se déroule en 2 phases : d’abord analyser la boucle (conditions d’arrêt : proposition == secret OU essais == 5), puis concevoir l’algorithme complet (et son script Python) en générant `secret = Aléa(1, 100)` et en comptant les essais.',
        objectives: [
          'Choisir une boucle à condition d’arrêt avec condition composée (réussite ou épuisement des essais)',
          'Générer un nombre aléatoire et guider le joueur par des comparaisons',
        ],
        reflectionQuestions: [
          'Quelles sont les DEUX raisons possibles d’arrêter le jeu ?',
          'Le nombre exact de tours est-il connu à l’avance ?',
          'À la fin de la boucle, comment savoir si le joueur a gagné ou perdu ?',
        ],
        workspaceConfig: {
          starterAlgo:
            'Algorithme Nombre_Mystere\nDébut\n    secret ← Aléa(1, 100)\n    essais ← 0\n    Répéter\n        \n    Jusqu\'à (...)\n    \nFin',
          starterPython:
            'from random import randint\nsecret = randint(1, 100)\nessais = 0\nprop = -1\n',
          defaultInputs: ['50', '75', '60', '65', '62'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['repeter', 'si'],
          criteriaNotes: ['Générer secret ← Aléa(1, 100)', 'Compter les essais jusqu’à 5 max', 'Condition d’arrêt (prop = secret) ou (essais = 5)', 'Afficher Plus grand / Plus petit / Bravo', 'Afficher secret en cas d’échec'],
        },
        presetHints: {
          level1: 'Initialise `essais ← 0` avant la boucle et incrémente `essais ← essais + 1` à chaque tentative.',
          level2: 'La boucle s’arrête quand `prop = secret` OU quand `essais = 5`.',
          level3: 'À l’intérieur : si `prop < secret` affiche "Plus grand", sinon si `prop > secret` affiche "Plus petit", sinon affiche "Bravo".',
          level4: 'Après la boucle : `Si prop ≠ secret Alors Ecrire("Perdu ! Le nombre secret était : ", secret) FinSi`.',
        },
        conceptToReview: 'Boucle Répéter...Jusqu’à à double condition d’arrêt',
        active: true,
      },
      {
        id: 'ex-p35-2',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Exercice 2 (p. 35)',
        title: 'Calcul du PGCD (Méthode des différences successives)',
        category: 'Exercice d’application',
        sourcePage: 35,
        sourcePageNote: 'Page 35 (numérotée 40)',
        difficulty: 'Application',
        estimatedMinutes: 20,
        kind: 'algorithm_and_python',
        originalStatement:
          'On souhaite calculer le PGCD de deux entiers strictement positifs A et B par la méthode des différences successives : tant que A et B sont différents, on retranche le plus petit du plus grand jusqu’à obtenir l’égalité A = B.\nExemple (A = 18, B = 12) → PGCD = 6.',
        understandWork:
          'À chaque tour de boucle, tant que A ≠ B, compare A et B : si A > B alors A reçoit A - B, sinon B reçoit B - A. Dès que A = B, la boucle s’arrête et A (ou B) est le PGCD !',
        objectives: [
          'Implémenter l’algorithme des différences successives avec Tant Que / while',
          'Vérifier la terminaison de la boucle lorsque A = B',
        ],
        reflectionQuestions: [
          'Quelle est la condition de maintien de la boucle ?',
          'Dans le cas où A = B dès le départ (ex : 12 et 12), combien de tours faut-il faire ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme PGCD\nDébut\n    Lire(A) ; Lire(B)\n    Tant Que (A ≠ B) Faire\n        \n    Fin Tant Que\n    Ecrire("PGCD = ", A)\nFin',
          starterPython: 'A = int(input("A = "))\nB = int(input("B = "))\nwhile A != B:\n    ',
          defaultInputs: ['48', '18'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['tant_que', 'si', 'sinon'],
          criteriaNotes: ['Tant Que A ≠ B', 'Si A > B Alors A ← A - B Sinon B ← B - A', 'Afficher A après la boucle'],
        },
        testCases: [
          { id: 'tc1', label: 'PGCD(48, 18) = 6', inputs: ['48', '18'], expectedOutputs: ['6'] },
          { id: 'tc2', label: 'PGCD(18, 12) = 6', inputs: ['18', '12'], expectedOutputs: ['6'] },
          { id: 'tc3', label: 'PGCD(15, 15) = 15', inputs: ['15', '15'], expectedOutputs: ['15'] },
        ],
        presetHints: {
          level1: 'Si A et B sont déjà égaux au départ, la boucle doit faire 0 tour : c’est donc une boucle Tant Que.',
          level2: 'Condition de maintien : `A != B`.',
          level3: 'À l’intérieur : `if A > B: A = A - B else: B = B - A`.',
          level4: 'Quand on sort de la boucle, A et B sont égaux au PGCD : affiche A.',
        },
        conceptToReview: 'Boucle Tant Que (page 38)',
        active: true,
      },
      {
        id: 'ex-p36-3',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Exercice 3 (p. 36)',
        title: 'Calcul du PPCM (Multiples successifs)',
        category: 'Exercice d’application',
        sourcePage: 36,
        sourcePageNote: 'Page 36 (numérotée 41)',
        difficulty: 'Application',
        estimatedMinutes: 20,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire l’algorithme et le script Python permettant de déterminer le PPCM de deux entiers strictement positifs A et B. On calcule les multiples successifs de A (M ← M + A en partant de M ← A) jusqu’à ce que M soit divisible par B (c’est-à-dire M mod B = 0).\nExemple : PPCM(8, 6) = 24.',
        understandWork:
          'Initialise un multiple M à A. Tant que M n’est pas divisible par B (donc M mod B ≠ 0), ajoute A à M (`M ← M + A`). Le premier M qui vérifie `M mod B = 0` est le PPCM !',
        objectives: [
          'Initialiser un multiple avant la boucle',
          'Écrire la condition de maintien opposée à la divisibilité (M % B != 0)',
        ],
        reflectionQuestions: [
          'Si A = 12 et B = 6, M = 12 est-il déjà divisible par 6 dès le départ ?',
          'Pourquoi ne faut-il pas écrire M ← M + M mais M ← M + A ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme PPCM\nDébut\n    Lire(A) ; Lire(B)\n    M ← A\n    \nFin',
          starterPython: 'A = int(input("A = "))\nB = int(input("B = "))\nM = A\n',
          defaultInputs: ['8', '6'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['tant_que'],
          criteriaNotes: ['Initialiser M ← A', 'Tant Que M mod B ≠ 0 (ou Répéter jusqu’à M mod B = 0)', 'M ← M + A', 'Afficher M'],
        },
        testCases: [
          { id: 'tc1', label: 'PPCM(8, 6) = 24', inputs: ['8', '6'], expectedOutputs: ['24'] },
          { id: 'tc2', label: 'PPCM(12, 6) = 12', inputs: ['12', '6'], expectedOutputs: ['12'] },
        ],
        presetHints: {
          level1: 'Initialise `M = A` avant la boucle.',
          level2: 'Si A est déjà multiple de B (ex : 12 et 6), il ne faut pas ajouter A une fois de trop : utilise `while M % B != 0:`.',
          level3: 'À chaque tour, avance au multiple suivant de A : `M = M + A`.',
          level4: 'Dès que `M % B == 0`, la boucle s’arrête et `M` contient le PPCM.',
        },
        conceptToReview: 'Boucle Tant Que et multiples',
        active: true,
      },
      {
        id: 'ex-p39-trace',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Activité Trace (p. 39)',
        title: 'Tournage à la main : Tant Que (X > 3)',
        category: 'Activité',
        sourcePage: 39,
        sourcePageNote: 'Page 39 (numérotée 44)',
        difficulty: 'Découverte',
        estimatedMinutes: 10,
        kind: 'trace_table',
        originalStatement:
          'Observez les premiers tours résolus puis complétez la fin de la trace (Tour 3 et Sortie) de l’algorithme :\nX ← 20 ; Cpt ← 0\nTant Que (X > 3) Faire\n    X ← X div 2\n    Cpt ← Cpt + 1\nFin Tant Que',
        understandWork:
          'Au Tour 2, X vaut 5 et Cpt vaut 2. Complète le Tour 3 puis le test de sortie qui arrête la boucle, ainsi que l’affichage final.',
        objectives: ['Distinguer nombre de tours effectués et nombre de tests évalués dans Tant Que'],
        reflectionQuestions: ['Combien de tests de la condition (X > 3) ont eu lieu en tout ?'],
        workspaceConfig: {
          codeSnippet: 'X ← 20 ; Cpt ← 0\nTant Que (X > 3) Faire\n    X ← X div 2\n    Cpt ← Cpt + 1\nFin Tant Que',
          tableHeaders: ['Étape', 'Test Cond (X > 3)', 'Nouvelle val. X', 'Compteur Cpt'],
          tableRows: [
            { id: 't3', cells: [{ key: 'e', prefilled: 'Tour 3', editable: false }, { key: 'cond', label: '5 > 3', editable: true, acceptedAnswers: ['Vrai', 'VRAI', 'True'] }, { key: 'x', label: 'X = 5 div 2', editable: true, acceptedAnswers: ['2', '5 div 2 = 2'] }, { key: 'cpt', label: 'Cpt = 2 + 1', editable: true, acceptedAnswers: ['3', '2 + 1 = 3'] }] },
            { id: 'sortie', cells: [{ key: 'e', prefilled: 'Sortie', editable: false }, { key: 'cond', label: '2 > 3', editable: true, acceptedAnswers: ['Faux', 'FAUX', 'False', '2 > 3 (FAUX)'] }, { key: 'x', label: 'X inchangé', editable: true, acceptedAnswers: ['2'] }, { key: 'cpt', label: 'Cpt inchangé', editable: true, acceptedAnswers: ['3'] }] },
          ],
          subQuestions: [
            { id: 'final', prompt: 'Affichage final (X, Cpt et Nombre de tests effectués) :', placeholder: 'X = 2 | Cpt = 3 | Tests = 4', keyPoints: ['2', '3', '4'] },
          ],
        },
        presetHints: {
          level1: '5 div 2 donne le quotient entier 2.',
          level2: 'Au test suivant, X vaut 2. Est-ce que 2 > 3 est vrai ?',
          level3: 'Lorsque le test est Faux, on n’entre pas dans la boucle : X et Cpt restent inchangés.',
          level4: 'Il y a 3 tours réussis + 1 test de sortie = 4 tests effectués.',
        },
        conceptToReview: 'Trace d’une boucle Tant Que (page 39)',
        active: true,
      },
      {
        id: 'ex-p41-1',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Série Tant Que — Ex 1 (p. 41)',
        title: 'Conditions de maintien et accumulations (Cas A, B, C)',
        category: 'Exercice d’application',
        sourcePage: 41,
        sourcePageNote: 'Page 41 (numérotée 46)',
        difficulty: 'Découverte',
        estimatedMinutes: 15,
        kind: 'fill_blanks',
        originalStatement:
          'Complétez les algorithmes et scripts Python en utilisant exclusivement Tant Que / while :\n• Cas A : Division entière de A par B par soustractions successives (tant que R ≥ B).\n• Cas B : Tirelire : cumuler M dans Cagnotte tant que l’objectif 500 DT n’est pas atteint (Cagnotte < 500).\n• Cas C : Longueur du 1er mot (avant espace) : avancer i tant que i < long(CH) et CH[i] ≠ " ".',
        understandWork:
          'Complète les conditions de maintien et les instructions de mise à jour manquantes dans les 3 situations en respectant exactement la règle I-C-M.',
        objectives: ['Écrire des conditions de maintien simples et composées en Tant Que / while'],
        reflectionQuestions: ['Pourquoi faut-il tester `i < long(CH)` AVANT `CH[i] ≠ " "` dans le Cas C ?'],
        workspaceConfig: {
          blanksTemplate:
            '// Cas A : Quotient Q et Reste R\nQ ← 0 ; R ← A\nTant Que ( [a_cond] ) Faire\n    R ← R - B\n    Q ← [a_q]\nFin Tant Que\n\n// Cas B : Tirelire 500 DT\nCagnotte ← 0\nwhile ( [b_cond] ):\n    M = float(input("Montant : "))\n    Cagnotte = [b_upd]\n\n// Cas C : Longueur 1er mot\ni = 0\nwhile (i < len(CH) and [c_cond] ):\n    i = i + 1',
          blankFields: [
            { id: 'a_cond', label: 'Condition Cas A', placeholder: 'R >= B', acceptedAnswers: ['R >= B', 'R>=B', 'R ≥ B'] },
            { id: 'a_q', label: 'Mise à jour Q', placeholder: 'Q + 1', acceptedAnswers: ['Q + 1', 'Q+1'] },
            { id: 'b_cond', label: 'Condition Cas B (Python)', placeholder: 'Cagnotte < 500', acceptedAnswers: ['Cagnotte < 500', 'Cagnotte<500'] },
            { id: 'b_upd', label: 'Mise à jour Cagnotte', placeholder: 'Cagnotte + M', acceptedAnswers: ['Cagnotte + M', 'Cagnotte+M'] },
            { id: 'c_cond', label: 'Condition Cas C (Python)', placeholder: 'CH[i] != " "', acceptedAnswers: ['CH[i] != " "', "CH[i] != ' '", 'CH[i]!=" "'] },
          ],
        },
        presetHints: {
          level1: 'Relis l’énoncé de chaque cas : la condition de maintien y est décrite mot pour mot.',
          level2: 'Cas A : on continue tant que le reste R est supérieur ou égal à B.',
          level3: 'Cas B : on continue tant que Cagnotte < 500 et on ajoute M.',
          level4: 'Cas C : en Python, différent s’écrit `!=`.',
        },
        conceptToReview: 'Règle des 3 Piliers I-C-M (page 38)',
        active: true,
      },
      {
        id: 'ex-p41-2',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Série Tant Que — Ex 2 (p. 41–42)',
        title: 'Somme des chiffres et Nombre Miroir d’un entier',
        category: 'Exercice d’application',
        sourcePage: 41,
        sourcePageNote: 'Pages 41–42 (46–47)',
        difficulty: 'Entraînement',
        estimatedMinutes: 18,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire l’algorithme et le script Python qui lisent un entier naturel N > 0, puis utilisent une boucle « Tant Que (N ≠ 0) » pour calculer et afficher d’une part la somme S de ses chiffres, et d’autre part son nombre miroir (inverse) Inv obtenu par la formule Inv ← Inv * 10 + (N mod 10).\nExemple (N = 472) : S = 13 | Inv = 274.',
        understandWork:
          'L’astuce clé (illustrée page 42) est d’extraire le chiffre des unités avec `c = N % 10`, de l’ajouter à `S` et à `Inv * 10 + c`, puis de supprimer le dernier chiffre de N avec `N = N // 10` jusqu’à ce que N devienne 0.',
        objectives: [
          'Extraire les chiffres d’un entier par DIV 10 et MOD 10',
          'Reconstruire un entier inversé mathématiquement',
        ],
        reflectionQuestions: [
          'Que donnent `472 % 10` et `472 // 10` ?',
          'Que vaut `S` et `Inv` avant d’entrer dans la boucle ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Somme_Miroir\nDébut\n    Lire(N)\n    S ← 0 ; Inv ← 0\n    Tant Que (N ≠ 0) Faire\n        \n    Fin Tant Que\n    Ecrire("S = ", S, " Inv = ", Inv)\nFin',
          starterPython: 'N = int(input("N = "))\nS = 0\nInv = 0\nwhile N != 0:\n    ',
          defaultInputs: ['472'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['tant_que'],
          criteriaNotes: ['Initialiser S ← 0 et Inv ← 0', 'Extraire c ← N mod 10', 'S ← S + c ; Inv ← Inv * 10 + c', 'N ← N div 10'],
        },
        testCases: [
          { id: 'tc1', label: 'N = 472 -> S=13, Inv=274', inputs: ['472'], expectedOutputs: ['13', '274'] },
          { id: 'tc2', label: 'N = 105 -> S=6, Inv=501', inputs: ['105'], expectedOutputs: ['6', '501'] },
        ],
        presetHints: {
          level1: 'Avant la boucle, initialise `S = 0` et `Inv = 0`.',
          level2: 'À chaque tour : `c = N % 10` te donne le dernier chiffre de N.',
          level3: 'Mets à jour `S = S + c` et `Inv = Inv * 10 + c`.',
          level4: 'N’oublie surtout pas `N = N // 10` en fin de boucle, sinon la boucle devient infinie !',
        },
        conceptToReview: 'Extraction des chiffres avec div 10 et mod 10 (page 42)',
        active: true,
      },
      {
        id: 'ex-p42-3',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Série Tant Que — Ex 3 (p. 42)',
        title: 'Suite de Syracuse (Conjecture de Collatz)',
        category: 'Exercice d’application',
        sourcePage: 42,
        sourcePageNote: 'Page 42 (47)',
        difficulty: 'Application',
        estimatedMinutes: 18,
        kind: 'algorithm_and_python',
        originalStatement:
          'En partant d’un entier strictement positif U, la suite de Syracuse répète l’opération suivante tant que U ≠ 1 : si U est pair, on le divise par 2 (U ← U div 2) ; s’il est impair, on le multiplie par 3 et on ajoute 1 (U ← 3 * U + 1). Écrire l’algorithme et le script Python qui affichent les termes successifs et déterminent le nombre d’étapes nécessaires pour atteindre 1.\nExemple pour U = 6 : 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (8 étapes).',
        understandWork:
          'Initialise un compteur d’étapes `etapes ← 0`. Tant que `U ≠ 1`, affiche/enregistre U, teste sa parité (`U mod 2 = 0`), applique la règle correspondante et incrémente `etapes`. Affiche le dernier terme 1 et le nombre d’étapes.',
        objectives: [
          'Combiner Tant Que et conditionnelle de parité',
          'Compter le nombre d’itérations jusqu’à convergence',
        ],
        reflectionQuestions: [
          'Si U = 1 au départ, combien d’étapes sont nécessaires ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Syracuse\nDébut\n    Lire(U)\n    etapes ← 0\n    \nFin',
          starterPython: 'U = int(input("U = "))\netapes = 0\n',
          defaultInputs: ['6'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['tant_que', 'si', 'sinon'],
          criteriaNotes: ['Tant Que U ≠ 1', 'Si U mod 2 = 0 alors U ← U div 2 sinon U ← 3*U + 1', 'Compter les étapes'],
        },
        testCases: [
          { id: 'tc1', label: 'U = 6 -> 8 étapes', inputs: ['6'], expectedOutputs: ['1', '8'] },
        ],
        presetHints: {
          level1: 'Condition de maintien : `while U != 1:`.',
          level2: 'Utilise `U = U // 2` (division entière) si `U % 2 == 0`, sinon `U = 3 * U + 1`.',
          level3: 'Incrémente `etapes = etapes + 1` à chaque passage dans la boucle.',
          level4: 'Affiche chaque terme et le total `etapes` à la fin.',
        },
        conceptToReview: 'Boucle Tant Que et compteur d’étapes',
        active: true,
      },
      {
        id: 'ex-p42-4',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Série Tant Que — Ex 4 (p. 42)',
        title: 'Décomposition en facteurs premiers',
        category: 'Exercice d’application',
        sourcePage: 42,
        sourcePageNote: 'Page 42 (47)',
        difficulty: 'Application',
        estimatedMinutes: 20,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire l’algorithme d’un programme qui permet de saisir un entier x et le décomposer en des facteurs premiers puis afficher ces facteurs premiers comme illustré dans l’exemple.\nExemple (N = 60) : 60 ÷ 2 = 30 (Facteur 2), 30 ÷ 2 = 15 (Facteur 2), 15 ÷ 3 = 5 (Facteur 3), 5 ÷ 5 = 1 (Facteur 5) → 60 = 2 × 2 × 3 × 5.',
        understandWork:
          'Partons d’un diviseur candidat `d = 2`. Tant que `x > 1`, si `x` est divisible par `d`, on affiche `d` comme facteur premier et on divise `x` par `d` (`x ← x div d`) sans changer `d` (car le même facteur peut apparaître plusieurs fois !). Sinon, on passe au diviseur suivant `d ← d + 1`.',
        objectives: [
          'Concevoir une boucle Tant Que à double évolution (soit x diminue, soit d augmente)',
        ],
        reflectionQuestions: [
          'Pourquoi ne faut-il pas incrémenter d quand x mod d = 0 ?',
          'Un facteur composé comme 4 peut-il être affiché si on a déjà divisé par 2 autant de fois que possible ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Facteurs_Premiers\nDébut\n    Lire(x)\n    d ← 2\n    Tant Que (x > 1) Faire\n        \n    Fin Tant Que\nFin',
          starterPython: 'x = int(input("x = "))\nd = 2\nwhile x > 1:\n    ',
          defaultInputs: ['60'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['tant_que', 'si', 'sinon'],
          criteriaNotes: ['d ← 2', 'Tant Que x > 1', 'Si x mod d = 0 alors afficher d et x ← x div d sinon d ← d + 1'],
        },
        testCases: [
          { id: 'tc1', label: '60 -> 2, 2, 3, 5', inputs: ['60'], expectedOutputs: ['2', '2', '3', '5'] },
        ],
        presetHints: {
          level1: 'Initialise `d = 2` avant la boucle `while x > 1:`.',
          level2: 'Si `x % d == 0`, affiche `d` et fais `x = x // d`.',
          level3: 'Seulement dans le `else:`, fais `d = d + 1`.',
          level4: 'Ainsi 60 se divise par 2, puis 30 par 2, puis 15 ne se divise plus par 2 donc d passe à 3 !',
        },
        conceptToReview: 'Boucle Tant Que (pages 38–42)',
        active: true,
      },
      {
        id: 'ex-p43-5',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Série Tant Que — Ex 5 (p. 43)',
        title: 'Élèves admis et taux de réussite (Tableaux & Contrôle)',
        category: 'Exercice d’application',
        sourcePage: 43,
        sourcePageNote: 'Page 43 (48)',
        difficulty: 'Application',
        estimatedMinutes: 22,
        kind: 'algorithm_and_python',
        originalStatement:
          'Écrire l’algorithme d’un programme qui permet de saisir la taille d’un tableau n > 5 puis remplir un tableau N par les noms des élèves (chaîne non vide de taille maximale 10), et remplir un tableau M par leurs moyennes (entre 0 et 20), puis afficher les élèves admis et calculer et afficher le taux de réussite des élèves dans la classe.\nExemple : 5 admis sur 6 → Taux de réussite : 83,33 %.',
        understandWork:
          'Combine un contrôle de saisie pour n > 5, des contrôles de saisie dans la boucle de remplissage pour chaque nom (1 ≤ long ≤ 10) et chaque moyenne (0 ≤ M[i] ≤ 20), puis parcours le tableau pour afficher ceux dont M[i] ≥ 10 et calculer `(nb_admis * 100) / n`.',
        objectives: [
          'Associer boucles de contrôle de saisie et parcours de tableaux parallèles',
          'Calculer un taux de réussite en pourcentage',
        ],
        reflectionQuestions: [
          'Quelle moyenne minimum permet d’être admis ?',
          'Comment calculer le taux de réussite en % à partir de nb_admis et n ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Taux_Reussite\nDébut\n    \nFin',
          starterPython: 'n = 0\nwhile not (n > 5):\n    n = int(input("n (>5) = "))\n',
          defaultInputs: ['6', 'Ahmed', '15', 'Sara', '18', 'Ali', '12', 'Leila', '20', 'Omar', '9', 'Ines', '17'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['pour', 'si'],
          criteriaNotes: ['Contrôler n > 5', 'Remplir N et M avec contrôles', 'Afficher les noms où M[i] >= 10', 'Calculer (nb_admis / n) * 100'],
        },
        testCases: [
          {
            id: 'tc1',
            label: 'Exemple 6 élèves (83.33%)',
            inputs: ['6', 'Ahmed', '15', 'Sara', '18', 'Ali', '12', 'Leila', '20', 'Omar', '9', 'Ines', '17'],
            expectedOutputs: ['Ahmed', 'Sara', 'Ali', 'Leila', 'Ines', '83.33'],
          },
        ],
        presetHints: {
          level1: 'Commence par contrôler `n > 5` avec Répéter...Jusqu’à (ou while not).',
          level2: 'Pour chaque élève i de 0 à n-1, contrôle que `1 <= len(N[i]) <= 10` et `0 <= M[i] <= 20`.',
          level3: 'Un élève est admis si `M[i] >= 10` : affiche `N[i]` et incrémente `nb_admis`.',
          level4: 'Taux = `round((nb_admis * 100) / n, 2)`.',
        },
        conceptToReview: 'Contrôle de saisie + Tableaux parallèles',
        active: true,
      },
      {
        id: 'ex-p43-bin',
        chapterId: 'ch5-boucles-condition',
        lessonId: 'les-5-2-tantque',
        numberLabel: 'Exercice Binaire (p. 43)',
        title: 'Conversion d’un entier en binaire (base 2)',
        category: 'Exercice d’application',
        sourcePage: 43,
        sourcePageNote: 'Page 43 (48)',
        difficulty: 'Application',
        estimatedMinutes: 15,
        kind: 'algorithm_and_python',
        originalStatement:
          'Saisis un entier positif x et convertis-le en une chaîne de caractères représentant sa valeur en binaire.\nExemple : x = 13 → divisions successives par 2 : restes 1, 0, 1, 1 → on lit de bas en haut → Résultat : "1101".',
        understandWork:
          'Pour lire les restes de bas en haut, il suffit de placer chaque nouveau reste `convch(x mod 2)` AU DÉBUT de la chaîne résultat `bin` (`bin ← convch(x mod 2) + bin`), puis de diviser `x` par 2 (`x ← x div 2`). Pense au cas particulier `x = 0` si besoin !',
        objectives: [
          'Implémenter les divisions euclidiennes successives par 2',
          'Construire une chaîne en préfixant les restes',
        ],
        reflectionQuestions: [
          'Si tu écris `bin = bin + str(x % 2)`, dans quel sens obtiens-tu les bits ?',
          'Que faut-il écrire pour lire les restes de bas en haut ?',
        ],
        workspaceConfig: {
          starterAlgo: 'Algorithme Conversion_Binaire\nDébut\n    Lire(x)\n    bin ← ""\n    \nFin',
          starterPython: 'x = int(input("x = "))\nb = ""\n',
          defaultInputs: ['13'],
        },
        algorithmCriteria: {
          requireBeginEnd: true,
          requireInput: true,
          requireOutput: true,
          requiredStructures: ['repeter'],
          criteriaNotes: ['Extraire reste x mod 2', 'Préfixer à gauche : bin ← convch(x mod 2) + bin', 'x ← x div 2 jusqu’à x = 0'],
        },
        testCases: [
          { id: 'tc1', label: '13 -> "1101"', inputs: ['13'], expectedOutputs: ['1101'] },
          { id: 'tc2', label: '0 -> "0"', inputs: ['0'], expectedOutputs: ['0'] },
        ],
        presetHints: {
          level1: 'Si x = 0, avec une boucle Répéter...Jusqu’à (x = 0), le premier tour produit "0" automatiquement !',
          level2: 'En Python, utilise `if x == 0: b = "0"` ou une initialisation adaptée.',
          level3: 'À chaque division : `b = str(x % 2) + b` et `x = x // 2`.',
          level4: 'Vérifie avec 13 : 13%2=1 -> "1", 6%2=0 -> "01", 3%2=1 -> "101", 1%2=1 -> "1101".',
        },
        conceptToReview: 'Divisions successives et construction de chaîne',
        active: true,
      },
    ],
  },
];
