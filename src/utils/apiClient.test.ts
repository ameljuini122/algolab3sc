import test from 'node:test';
import assert from 'node:assert/strict';
import {
  apiFetchCurriculum,
  apiFetchStudentState,
  apiJoinStudent,
  apiRequestAiTutorHint,
  apiSaveDraft,
  apiSubmitExercise,
  apiUpdateLessonProgress,
  resetLocalFallbackStore,
} from './apiClient';

function mockFetchSequence(
  handler: (url: string, init?: RequestInit) => Response | Promise<Response>
): () => void {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    return handler(url, init);
  }) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

test('static/Netlify HTML fallback allows student login with ALGO3SC and restores state', async () => {
  resetLocalFallbackStore();
  // Simulate Netlify SPA returning 200 text/html for /api/* routes
  const restore = mockFetchSequence(
    () =>
      new Response('<!doctype html><html><body>SPA</body></html>', {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      })
  );

  try {
    const curr = await apiFetchCurriculum();
    assert.equal(curr.chapters.length, 8);

    const join = await apiJoinStudent('Yassine', 'algo3sc');
    assert.equal(join.ok, true);
    if (!join.ok) return;
    assert.equal(join.data.student.name, 'Yassine');
    assert.equal(join.data.session?.code, 'ALGO3SC');

    const restored = await apiFetchStudentState(join.data.student.id);
    assert.ok(restored);
    assert.equal(restored.student.name, 'Yassine');
  } finally {
    restore();
  }
});

test('static fallback supports lesson progress, drafts, exercise evaluation, and guided hints', async () => {
  resetLocalFallbackStore();
  const restore = mockFetchSequence(() => {
    throw new TypeError('Failed to fetch');
  });

  try {
    const join = await apiJoinStudent('Sarra', 'ALGO3SC');
    assert.equal(join.ok, true);
    if (!join.ok) return;

    const studentId = join.data.student.id;
    const afterLesson = await apiUpdateLessonProgress(studentId, 'les-ch0-rappel', true);
    assert.ok(afterLesson);
    assert.equal(afterLesson.xp, 50); // 25 lesson + 25 Premier pas badge
    assert.ok(afterLesson.unlockedBadges.includes('premier-pas'));

    const draftSaved = await apiSaveDraft(studentId, 'ex-p5-5', { algo: 'Algorithme Test\nDébut\nFin' });
    assert.equal(draftSaved, true);

    const subRes = await apiSubmitExercise({
      studentId,
      exerciseId: 'ex-p5-5',
      answerPayload: { algo: 'Algorithme Code_Promo\nDébut\nEcrire("Test")\nFin' },
      hintsRequested: 1,
    });
    assert.equal(subRes.ok, true);
    if (!subRes.ok) return;
    assert.ok(subRes.data.feedback.whatIsCorrect.length > 0);

    const hintRes = await apiRequestAiTutorHint({
      studentId,
      exerciseId: 'ex-p5-5',
      level: 1,
      question: 'Comment extraire le taux ?',
      currentAttempt: { algo: 'Algorithme Code_Promo\nDébut\nFin' },
      previousHints: [],
    });
    assert.equal(hintRes.ok, true);
    if (!hintRes.ok) return;
    assert.equal(hintRes.hint.level, 1);
    assert.ok(hintRes.hint.hintText.length > 15);
  } finally {
    restore();
  }
});

test('preserves real backend JSON errors without switching to fallback', async () => {
  resetLocalFallbackStore();
  const restore = mockFetchSequence(
    () =>
      new Response(JSON.stringify({ error: 'Code expiré par le serveur' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
  );

  try {
    const join = await apiJoinStudent('Yassine', 'ALGO3SC');
    assert.equal(join.ok, false);
    if (join.ok) return;
    assert.equal(join.error, 'Code expiré par le serveur');
  } finally {
    restore();
  }
});
