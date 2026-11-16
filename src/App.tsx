import { useCallback, useEffect, useState } from 'react';
import { testFirestoreConnection } from './firebase';
import { CURRICULUM_CHAPTERS, BADGE_DEFINITIONS } from './data/curriculum';
import type {
  BadgeDefinition,
  Chapter,
  ClassRoom,
  HintRecord,
  Session,
  StudentProfile,
  StudentSubmission,
} from './types/algolab';
import { StudentJoinView } from './components/StudentJoinView';
import { StudentShell } from './components/StudentShell';
import { TeacherPortal } from './components/TeacherPortal';

const STORAGE_STUDENT_ID_KEY = 'algolab_student_id';

export default function App() {
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  const [chapters, setChapters] = useState<Chapter[]>(CURRICULUM_CHAPTERS);
  const [badges, setBadges] = useState<BadgeDefinition[]>(BADGE_DEFINITIONS);
  const [tutorConfig, setTutorConfig] = useState({
    aiEnabled: true,
    maxHintLevel: 4 as 1 | 2 | 3 | 4,
    hintsBeforeSubmission: true,
    aiFeedbackEnabled: true,
    allowRetry: true,
    revealSolutionAfterCompletion: false,
  });

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [classRoom, setClassRoom] = useState<ClassRoom | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [hintsHistory, setHintsHistory] = useState<HintRecord[]>([]);
  const [restoring, setRestoring] = useState(true);

  const loadCurriculum = useCallback(async () => {
    try {
      const resp = await fetch('/api/curriculum');
      if (!resp.ok) return;
      const data = await resp.json();
      if (Array.isArray(data.chapters)) setChapters(data.chapters);
      if (Array.isArray(data.badges)) setBadges(data.badges);
      if (data.tutorConfig) setTutorConfig(data.tutorConfig);
    } catch {
      // Keep bundled curriculum fallback if offline
    }
  }, []);

  useEffect(() => {
    void testFirestoreConnection();
    void loadCurriculum();

    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'teacher') {
      setMode('teacher');
    }

    const savedId = localStorage.getItem(STORAGE_STUDENT_ID_KEY);
    if (savedId) {
      fetch(`/api/student/state?studentId=${encodeURIComponent(savedId)}`)
        .then(async (resp) => {
          if (!resp.ok) {
            localStorage.removeItem(STORAGE_STUDENT_ID_KEY);
            return;
          }
          const data = await resp.json();
          if (data.student) {
            setStudent(data.student);
            setClassRoom(data.classRoom);
            setSession(data.session);
            setSubmissions(data.submissions || []);
            setHintsHistory(data.hints || []);
          }
        })
        .catch(() => {
          // Ignore transient network errors
        })
        .finally(() => setRestoring(false));
      return;
    }

    if (params.get('autostart') === '1') {
      fetch('/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Élève Démo', code: 'ALGO3SC' }),
      })
        .then(async (resp) => {
          if (!resp.ok) return;
          const data = await resp.json();
          if (data.student) {
            localStorage.setItem(STORAGE_STUDENT_ID_KEY, data.student.id);
            setStudent(data.student);
            setClassRoom(data.classRoom);
            setSession(data.session);
            setSubmissions(data.submissions || []);
          }
        })
        .finally(() => setRestoring(false));
      return;
    }

    setRestoring(false);
  }, [loadCurriculum]);

  const handleJoined = (data: {
    student: StudentProfile;
    classRoom?: ClassRoom;
    session?: Session;
    submissions: StudentSubmission[];
  }) => {
    localStorage.setItem(STORAGE_STUDENT_ID_KEY, data.student.id);
    setStudent(data.student);
    setClassRoom(data.classRoom);
    setSession(data.session);
    setSubmissions(data.submissions || []);
    setHintsHistory([]);
    setMode('student');
  };

  const handleSwitchStudent = () => {
    localStorage.removeItem(STORAGE_STUDENT_ID_KEY);
    setStudent(null);
    setSubmissions([]);
    setHintsHistory([]);
  };

  const handleAddSubmission = (sub: StudentSubmission) => {
    setSubmissions((prev) => {
      const idx = prev.findIndex((s) => s.id === sub.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = sub;
        return copy;
      }
      return [sub, ...prev];
    });
  };

  if (mode === 'teacher') {
    return (
      <TeacherPortal
        chapters={chapters}
        onBackToStudent={() => setMode('student')}
        onCurriculumUpdated={loadCurriculum}
      />
    );
  }

  if (restoring) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-sm text-slate-600">
        Chargement de ton cahier AlgoLab...
      </div>
    );
  }

  if (!student) {
    return (
      <StudentJoinView
        onJoined={handleJoined}
        onOpenTeacherPortal={() => setMode('teacher')}
      />
    );
  }

  return (
    <StudentShell
      student={student}
      classRoom={classRoom}
      session={session}
      chapters={chapters}
      badges={badges}
      submissions={submissions}
      hintsHistory={hintsHistory}
      tutorConfig={tutorConfig}
      onUpdateStudent={setStudent}
      onAddSubmission={handleAddSubmission}
      onAddHint={(hint) => setHintsHistory((prev) => [...prev, hint])}
      onSwitchStudent={handleSwitchStudent}
      onOpenTeacherPortal={() => setMode('teacher')}
    />
  );
}
