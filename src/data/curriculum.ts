import type { BadgeDefinition, Chapter, Exercise, Lesson } from '../types/algolab';
import { CHAPTERS_PART_1 } from './curriculumPart1.ts';
import { CHAPTERS_PART_2 } from './curriculumPart2.ts';
import { CHAPTERS_PART_3 } from './curriculumPart3.ts';

export const CURRICULUM_CHAPTERS: Chapter[] = [
  ...CHAPTERS_PART_1,
  ...CHAPTERS_PART_2,
  ...CHAPTERS_PART_3,
];

export const ALL_LESSONS: Lesson[] = CURRICULUM_CHAPTERS.flatMap((ch) => ch.lessons);
export const ALL_EXERCISES: Exercise[] = CURRICULUM_CHAPTERS.flatMap((ch) => ch.exercises);

export function findExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((ex) => ex.id === id);
}

export function findLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((les) => les.id === id);
}

export function findChapterById(id: string): Chapter | undefined {
  return CURRICULUM_CHAPTERS.find((ch) => ch.id === id);
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'premier-pas',
    title: 'Premier pas',
    description: 'Tu as rejoint la classe et terminé ta première activité sur AlgoLab.',
    criteria: '1 exercice validé ou 1 leçon complétée',
    xpBonus: 25,
  },
  {
    id: 'maitre-variables',
    title: 'Maître des variables',
    description: 'Tu maîtrises les types simples, opérateurs et fonctions prédéfinies.',
    criteria: 'Valider au moins 3 exercices des Chapitres 0 ou 1',
    xpBonus: 50,
  },
  {
    id: 'expert-conditions',
    title: 'Expert des conditions',
    description: 'Les structures if...elif...else et match...case n’ont plus de secret pour toi.',
    criteria: 'Valider au moins 4 exercices du Chapitre 2',
    xpBonus: 60,
  },
  {
    id: 'explorateur-boucles',
    title: 'Explorateur des boucles',
    description: 'Tu sais choisir entre Pour, Répéter...Jusqu’à et Tant Que...Faire.',
    criteria: 'Valider au moins 5 exercices des Chapitres 3 ou 5',
    xpBonus: 75,
  },
  {
    id: 'detective-erreurs',
    title: 'Détective des erreurs',
    description: 'Tu as résolu un exercice de débogage ou amélioré ta réponse après un essai.',
    criteria: 'Réussir un exercice après une première tentative ou un débogage',
    xpBonus: 50,
  },
  {
    id: 'algorithmicien',
    title: 'Algorithmicien',
    description: 'Tu conçois des algorithmes complets et modulaires structurés.',
    criteria: 'Valider au moins 3 exercices d’algorithmique ou modularité',
    xpBonus: 80,
  },
  {
    id: 'python-starter',
    title: 'Python Starter',
    description: 'Tu écris, exécutes et valides tes premiers programmes Python avec succès.',
    criteria: 'Valider au moins 3 exercices Python',
    xpBonus: 70,
  },
];
