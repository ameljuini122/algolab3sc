import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_EXERCISES,
  ALL_LESSONS,
  BADGE_DEFINITIONS,
  CURRICULUM_CHAPTERS,
  findChapterById,
  findExerciseById,
  findLessonById,
} from './curriculum.ts';

test('curriculum covers all 8 chapters (0 to 7) from the 66-page PDF', () => {
  assert.equal(CURRICULUM_CHAPTERS.length, 8);
  assert.deepEqual(
    CURRICULUM_CHAPTERS.map((c) => c.order),
    [0, 1, 2, 3, 4, 5, 6, 7]
  );
  assert.ok(ALL_LESSONS.length >= 12, `Expected >= 12 lessons, got ${ALL_LESSONS.length}`);
  assert.ok(ALL_EXERCISES.length >= 40, `Expected >= 40 exercises, got ${ALL_EXERCISES.length}`);
});

test('every exercise contains pedagogical scaffolding and 4 progressive hints', () => {
  const seenIds = new Set<string>();
  for (const ex of ALL_EXERCISES) {
    assert.ok(!seenIds.has(ex.id), `Duplicate exercise id: ${ex.id}`);
    seenIds.add(ex.id);
    assert.ok(ex.originalStatement.trim().length > 10, `Missing statement for ${ex.id}`);
    assert.ok(ex.understandWork.trim().length > 10, `Missing understandWork for ${ex.id}`);
    assert.ok(ex.objectives.length >= 1, `Missing objectives for ${ex.id}`);
    assert.ok(ex.reflectionQuestions.length >= 1, `Missing reflectionQuestions for ${ex.id}`);
    assert.ok(ex.presetHints.level1.trim().length > 5, `Missing level1 hint for ${ex.id}`);
    assert.ok(ex.presetHints.level2.trim().length > 5, `Missing level2 hint for ${ex.id}`);
    assert.ok(ex.presetHints.level3.trim().length > 5, `Missing level3 hint for ${ex.id}`);
    assert.ok(ex.presetHints.level4.trim().length > 5, `Missing level4 hint for ${ex.id}`);
    assert.ok(ex.sourcePage >= 1 && ex.sourcePage <= 66, `Invalid sourcePage for ${ex.id}`);
  }
});

test('lookup helpers resolve valid chapters, lessons, and exercises', () => {
  const firstChap = CURRICULUM_CHAPTERS[0];
  assert.equal(findChapterById(firstChap.id)?.id, firstChap.id);
  const firstLesson = ALL_LESSONS[0];
  assert.equal(findLessonById(firstLesson.id)?.id, firstLesson.id);
  const firstExercise = ALL_EXERCISES[0];
  assert.equal(findExerciseById(firstExercise.id)?.id, firstExercise.id);
  assert.ok(BADGE_DEFINITIONS.length >= 7);
});
