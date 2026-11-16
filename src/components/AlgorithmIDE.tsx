import React, { useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import type { AlgorithmCriteria } from '../types/algolab';
import { analyzeAlgorithmCode } from '../utils/evaluators';

interface AlgorithmIDEProps {
  value: string;
  onChange: (next: string) => void;
  starter?: string;
  criteria?: AlgorithmCriteria;
}

const QUICK_SNIPPETS: { label: string; insert: string }[] = [
  { label: '←', insert: ' ← ' },
  { label: 'Algorithme / Début / Fin', insert: 'Algorithme MonAlgo\nDébut\n  \nFin' },
  { label: 'Lire()', insert: 'Lire()' },
  { label: 'Ecrire()', insert: 'Ecrire("")' },
  { label: 'Si ... Alors ... FinSi', insert: 'Si () Alors\n  \nSinon\n  \nFinSi' },
  { label: 'Pour ... Faire', insert: 'Pour i de 1 à n Faire\n  \nFinPour' },
  { label: 'Tant Que ... Faire', insert: 'Tant Que () Faire\n  \nFin Tant Que' },
  { label: 'Répéter ... Jusqu’à', insert: 'Répéter\n  \nJusqu’à ()' },
  { label: 'Fonction', insert: 'Fonction Nom(x : Entier) : Entier\nDébut\n  \n  Retourner \nFin' },
  { label: 'Procédure', insert: 'Procédure Nom(@x : Entier)\nDébut\n  \nFin' },
];

export const AlgorithmIDE: React.FC<AlgorithmIDEProps> = ({
  value,
  onChange,
  starter = '',
  criteria,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showSyntaxCheck, setShowSyntaxCheck] = useState(false);

  const lineCount = useMemo(() => Math.max(value.split('\n').length, 10), [value]);
  const analysis = useMemo(() => analyzeAlgorithmCode(value, criteria), [value, criteria]);

  const insertSnippet = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value ? `${value}\n${snippet}` : snippet);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.slice(0, start) + snippet + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertSnippet('  ');
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-[#0F172A] text-slate-100 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
          Éditeur Algorithmique (Pseudo-code 3SC)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSyntaxCheck((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>{showSyntaxCheck ? 'Masquer l’analyse' : 'Vérifier la structure'}</span>
          </button>
          {starter && (
            <button
              type="button"
              onClick={() => onChange(starter)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Keyword Palette */}
      <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex flex-wrap gap-1.5">
        {QUICK_SNIPPETS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => insertSnippet(item.insert)}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Line-numbered Code Area */}
      <div className="flex font-mono text-sm leading-6">
        <div
          aria-hidden="true"
          className="select-none py-3 px-3 text-right text-slate-500 bg-slate-950/50 border-r border-slate-800 tabular-nums min-w-[3rem]"
        >
          {Array.from({ length: lineCount }, (_, idx) => (
            <div key={idx + 1}>{idx + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          aria-label="Éditeur d’algorithme en pseudo-code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.max(10, Math.min(18, lineCount + 1))}
          spellCheck={false}
          placeholder="Algorithme Exemple&#10;Début&#10;  Ecrire(&quot;Bonjour&quot;)&#10;Fin"
          className="flex-1 p-3 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none resize-y font-mono text-sm leading-6"
        />
      </div>

      {/* Live Structural Analysis Drawer */}
      {showSyntaxCheck && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5 text-sm">
          {analysis.strengths.length > 0 && (
            <div className="space-y-1">
              {analysis.strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
          {analysis.issues.length > 0 && (
            <div className="space-y-1">
              {analysis.issues.map((iss, idx) => (
                <div key={idx} className="flex items-start gap-2 text-amber-300">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{iss}</span>
                </div>
              ))}
            </div>
          )}
          {analysis.issues.length === 0 && analysis.strengths.length > 0 && (
            <p className="text-emerald-200 text-xs">
              Structure algorithmique cohérente ! Vérifie maintenant tes calculs sur un jeu d’essai avant de soumettre.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
