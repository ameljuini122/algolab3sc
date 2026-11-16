import React, { useState } from 'react';
import { Lightbulb, Send, MessageSquare, Lock } from 'lucide-react';
import type { Exercise, HintRecord } from '../types/algolab';
import { apiRequestAiTutorHint } from '../utils/apiClient';

interface AiTutorPanelProps {
  studentId: string;
  exercise: Exercise;
  currentAttempt: Record<string, unknown>;
  maxHintLevel: 1 | 2 | 3 | 4;
  aiEnabled: boolean;
  hintsBeforeSubmission: boolean;
  hasSubmittedAtLeastOnce: boolean;
  hintsHistory: HintRecord[];
  onHintReceived: (hint: HintRecord) => void;
}

const LEVEL_META: { level: 1 | 2 | 3 | 4; title: string; subtitle: string }[] = [
  { level: 1, title: '1. Orientation', subtitle: 'Comprendre le but et les données' },
  { level: 2, title: '2. Raisonnement', subtitle: 'Choisir la logique / structure' },
  { level: 3, title: '3. Guidance', subtitle: 'Rappel ciblé sans la solution' },
  { level: 4, title: '4. Débogage', subtitle: 'Analyser ta tentative actuelle' },
];

export const AiTutorPanel: React.FC<AiTutorPanelProps> = ({
  studentId,
  exercise,
  currentAttempt,
  maxHintLevel,
  aiEnabled,
  hintsBeforeSubmission,
  hasSubmittedAtLeastOnce,
  hintsHistory,
  onHintReceived,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4>(1);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lockedBeforeSubmit = !hintsBeforeSubmission && !hasSubmittedAtLeastOnce;

  const requestHint = async (lvl: 1 | 2 | 3 | 4, customQuestion?: string) => {
    if (!aiEnabled || lockedBeforeSubmit) return;
    setError('');
    setLoading(true);
    try {
      const res = await apiRequestAiTutorHint({
        studentId,
        exerciseId: exercise.id,
        level: lvl,
        question: customQuestion?.trim() || undefined,
        currentAttempt,
        previousHints: hintsHistory.map((h) => h.hintText),
      });
      if (!res.ok) {
        setError(res.error || 'Impossible de contacter le Tuteur IA.');
        return;
      }
      onHintReceived(res.hint);
      if (customQuestion) setQuestion('');
    } catch {
      setError('Connexion au Tuteur IA indisponible pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-violet-200 bg-white p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#7C3AED]" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold text-slate-900">Tuteur IA guidé</h3>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Je t’aide à raisonner étape par étape sans jamais dévoiler la solution directe.
          </p>
        </div>
      </div>

      {!aiEnabled ? (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span>Le Tuteur IA est actuellement désactivé par ton enseignante pour cette séance.</span>
        </div>
      ) : lockedBeforeSubmit ? (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>Essaie d’abord de vérifier une première réponse avant de demander un indice.</span>
        </div>
      ) : (
        <>
          {/* 4 Progressive Levels */}
          <div className="grid grid-cols-2 gap-2">
            {LEVEL_META.map((item) => {
              const disabledByTeacher = item.level > maxHintLevel;
              const active = selectedLevel === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  disabled={disabledByTeacher || loading}
                  onClick={() => {
                    setSelectedLevel(item.level);
                    void requestHint(item.level);
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                    active
                      ? 'bg-violet-50 border-[#7C3AED] text-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-violet-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold whitespace-nowrap truncate">{item.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* Ask a targeted question */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!question.trim()) return;
              void requestHint(selectedLevel, question);
            }}
            className="flex gap-2"
          >
            <label htmlFor="tutor-question" className="sr-only">
              Poser une question au tuteur
            </label>
            <input
              id="tutor-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ta question..."
              className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              aria-label="Envoyer la question au tuteur"
              className="px-3 py-2 rounded-xl bg-[#7C3AED] hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Guider</span>
            </button>
          </form>

          {loading && (
            <div className="text-xs text-[#7C3AED] font-medium">
              Préparation d’un indice adapté à ta démarche...
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
              {error}
            </div>
          )}
        </>
      )}

      {/* Hints History */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 max-h-72 overflow-y-auto">
        {hintsHistory.length === 0 ? (
          <p className="text-xs text-slate-500 leading-relaxed">
            Clique sur un niveau d’indice ci-dessus si tu es bloqué(e). Commence par le niveau 1.
          </p>
        ) : (
          hintsHistory.map((h) => (
            <div
              key={h.id}
              className="p-3 rounded-xl bg-violet-50/70 border border-violet-200 text-xs text-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#7C3AED]">
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" aria-hidden="true" />
                  <span>Indice Niveau {h.level}</span>
                </span>
                <span className="tabular-nums text-slate-500">
                  {new Date(h.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {h.question && (
                <p className="text-slate-600 italic">Ta question : « {h.question} »</p>
              )}
              <p className="leading-relaxed text-slate-900">
                {h.hintText.split(/(`[^`]+`)/g).map((part, i) =>
                  part.startsWith('`') && part.endsWith('`') ? (
                    <code
                      key={i}
                      className="px-1 py-0.5 rounded bg-violet-100 text-violet-950 font-mono text-[11px]"
                    >
                      {part.slice(1, -1)}
                    </code>
                  ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                  )
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
