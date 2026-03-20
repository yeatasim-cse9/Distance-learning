import { useState } from 'react';
import {
  GraduationCap,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Passage, ViewMode, ThemeMode, ToastState, ToastType } from './types';
import { initialPassages } from './data/passages';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import './index.css';

export default function App(): JSX.Element {
  const [view, setView] = useState<ViewMode>('student');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [passages, setPassages] = useState<Passage[]>(initialPassages);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    msg: '',
    type: 'success',
  });

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  return (
    <div className={`app-root ${theme}`}>
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      <nav className="top-nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span>দূর-শিক্ষণ</span>

        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          <div className="nav-toggle">
            <button
              className={`nav-tab ${view === 'student' ? 'active' : ''}`}
              onClick={() => setView('student')}
            >
              <Users size={15} /> Student
            </button>

            <button
              className={`nav-tab ${view === 'teacher' ? 'active' : ''}`}
              onClick={() => setView('teacher')}
            >
              <Settings size={15} /> Teacher
            </button>
          </div>
        </div>
      </nav>

      {view === 'student' ? (
        <StudentDashboard passages={passages} />
      ) : (
        <TeacherDashboard
          passages={passages}
          setPassages={setPassages}
          showToast={showToast}
        />
      )}
    </div>
  );
}
