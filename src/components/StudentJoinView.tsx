import React, { useState } from 'react';
import { ArrowRight, BookOpen, Code2, GraduationCap, ShieldCheck } from 'lucide-react';
import { apiJoinStudent } from '../utils/apiClient';

interface StudentJoinViewProps {
  onJoined: (data: {
    student: import('../types/algolab').StudentProfile;
    classRoom?: import('../types/algolab').ClassRoom;
    session?: import('../types/algolab').Session;
    submissions: import('../types/algolab').StudentSubmission[];
  }) => void;
  onOpenTeacherPortal: () => void;
}

export const StudentJoinView: React.FC<StudentJoinViewProps> = ({
  onJoined,
  onOpenTeacherPortal,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();

    if (cleanName.length < 2) {
      setError('Entre ton prénom (au moins 2 lettres) pour continuer.');
      return;
    }
    if (!cleanCode) {
      setError('Entre le code de classe fourni par ton enseignante.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiJoinStudent(cleanName, cleanCode);
      if (!res.ok) {
        setError(res.error || 'Impossible de rejoindre la séance.');
        return;
      }
      onJoined(res.data);
    } catch {
      setError('Erreur de connexion. Réessaie dans un instant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            AlgoLab
          </span>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="whitespace-nowrap shrink-0">3ème Sciences Expérimentales</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="whitespace-nowrap shrink-0">Algorithmique</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="whitespace-nowrap shrink-0">Python</span>
          </nav>
          <button
            type="button"
            onClick={onOpenTeacherPortal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" aria-hidden="true" />
            <span>Espace Enseignant</span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Pedagogical Overview & Clean Vector Flowchart */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>Lycée Mongi Slim Siliana</span>
                <span aria-hidden="true">·</span>
                <span>Cahier d’activités 3SC</span>
                <span aria-hidden="true">·</span>
                <span>Enseignante : Mme Amel Juini</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
                Apprendre à raisonner, concevoir et programmer en Algorithmique et Python
              </h1>

              <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                Retrouve les 8 chapitres complets de ton cahier d’informatique : leçons interactives pas à pas,
                exercices guidés, éditeur d’algorithmes, console Python et un tuteur intelligent qui t’aide à
                trouver la solution par toi-même.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                    <span>Cahier numérique</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Syntaxes Algorithme / Python et animations pas à pas.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Code2 className="w-4 h-4 text-[#0D9488]" aria-hidden="true" />
                    <span>Console Python</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Exécution directe avec messages d’erreurs expliqués en français.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <GraduationCap className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                    <span>Tuteur IA guidé</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    4 niveaux d’indices progressifs sans jamais donner la réponse.
                  </p>
                </div>
              </div>
            </div>

            {/* Clean Architectural SVG Diagram */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <svg
                viewBox="0 0 640 120"
                className="w-full h-24 text-slate-700"
                role="img"
                aria-label="Schéma du parcours d'apprentissage : Comprendre, Concevoir l'algorithme, Coder en Python, Vérifier et progresser"
              >
                <rect x="8" y="24" width="132" height="68" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
                <text x="74" y="52" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="600">
                  1. Comprendre
                </text>
                <text x="74" y="72" textAnchor="middle" fill="#64748B" fontSize="11">
                  Entrées / Sorties
                </text>

                <path d="M144 58 L170 58" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="174" y="24" width="136" height="68" rx="10" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
                <text x="242" y="52" textAnchor="middle" fill="#1E3A8A" fontSize="12" fontWeight="600">
                  2. Algorithme
                </text>
                <text x="242" y="72" textAnchor="middle" fill="#3B82F6" fontSize="11">
                  T.D.O. & Structures
                </text>

                <path d="M314 58 L340 58" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="344" y="24" width="132" height="68" rx="10" fill="#F0FDFA" stroke="#5EEAD4" strokeWidth="1.5" />
                <text x="410" y="52" textAnchor="middle" fill="#115E59" fontSize="12" fontWeight="600">
                  3. Python
                </text>
                <text x="410" y="72" textAnchor="middle" fill="#0D9488" fontSize="11">
                  Exécution & Tests
                </text>

                <path d="M480 58 L506 58" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="510" y="24" width="122" height="68" rx="10" fill="#F5F3FF" stroke="#C4B5FD" strokeWidth="1.5" />
                <text x="571" y="52" textAnchor="middle" fill="#4C1D95" fontSize="12" fontWeight="600">
                  4. Progresser
                </text>
                <text x="571" y="72" textAnchor="middle" fill="#7C3AED" fontSize="11">
                  Indices & XP
                </text>

                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
                  </marker>
                </defs>
              </svg>
            </div>
          </section>

          {/* Right Column: Kahoot-style Fast Student Entry */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-center">
            <div className="space-y-2 mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Bienvenue dans AlgoLab !
              </h2>
              <p className="text-sm text-slate-600">
                Pas de mot de passe requis : entre ton prénom et le code de séance pour retrouver ou démarrer ta progression.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="student-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Ton prénom
                </label>
                <input
                  id="student-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Yassine, Sarra..."
                  autoComplete="given-name"
                  className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="session-code" className="block text-sm font-semibold text-slate-800">
                    Code de classe
                  </label>
                  <button
                    type="button"
                    onClick={() => setCode('ALGO3SC')}
                    className="text-xs font-medium text-[#2563EB] hover:underline"
                  >
                    Code séance ouverte : ALGO3SC
                  </button>
                </div>
                <input
                  id="session-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex : ALGO3SC"
                  className="w-full px-4 py-3 text-base font-mono uppercase tracking-wider rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{loading ? 'Connexion en cours...' : 'Rejoindre la classe'}</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Progression sauvegardée automatiquement</span>
              <button
                type="button"
                onClick={onOpenTeacherPortal}
                className="font-medium text-slate-700 hover:text-[#2563EB] underline underline-offset-2"
              >
                Connexion Enseignant
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
