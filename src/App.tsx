import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Calendar, 
  Plus, 
  RefreshCw, 
  BookOpen, 
  TrendingUp, 
  Heart,
  Sparkles,
  Info,
  Pencil,
  Sun,
  Moon
} from "lucide-react";
import { Subject, StudySession } from "./types";
import { SAMPLE_SUBJECTS, SAMPLE_SESSIONS } from "./sampleData";
import Dashboard from "./components/Dashboard";
import RecentSessionsList from "./components/RecentSessionsList";
import AddSubjectModal from "./components/AddSubjectModal";
import LogSessionModal from "./components/LogSessionModal";
import FocusTimer from "./components/FocusTimer";

export default function App() {
  const TODAY_STR = "2026-07-14"; // Reference local date as specified

  // --- PERSISTENCE STATE ---
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("study_portal_subjects");
    return saved ? JSON.parse(saved) : SAMPLE_SUBJECTS;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem("study_portal_sessions");
    return saved ? JSON.parse(saved) : SAMPLE_SESSIONS;
  });

  // Name Editing States
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("study_portal_student_name") || "Alex Mercer";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(studentName);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("study_portal_theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      return false;
    }
  });

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem("study_portal_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("study_portal_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("study_portal_student_name", studentName);
  }, [studentName]);

  // Handle Dark Mode toggle effect on document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("study_portal_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("study_portal_theme", "light");
    }
  }, [isDarkMode]);

  // --- MODAL / DIALOG CONTROLS ---
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isLogSessionOpen, setIsLogSessionOpen] = useState(false);
  const [selectedSubjectIdForLog, setSelectedSubjectIdForLog] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "sevenDays">("week");

  // --- STATE MUTATORS ---
  const handleAddSubject = (name: string, targetHours: number, color: string, group: string) => {
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name,
      targetHoursPerWeek: targetHours,
      color,
      group: group || "General",
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  const handleLogSession = (subjectId: string, durationMinutes: number, date: string, note: string) => {
    const newSess: StudySession = {
      id: `sess-${Date.now()}`,
      subjectId,
      durationMinutes,
      date,
      note,
    };
    setSessions((prev) => [newSess, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject? All logged focus hours for this subject will also be permanently deleted.")) {
      setSubjects((prev) => prev.filter((sub) => sub.id !== id));
      setSessions((prev) => prev.filter((sess) => sess.subjectId !== id));
    }
  };

  const handleTriggerLogForSubject = (subjectId: string) => {
    setSelectedSubjectIdForLog(subjectId);
    setIsLogSessionOpen(true);
  };

  const handleTriggerGeneralLog = () => {
    setSelectedSubjectIdForLog(null);
    setIsLogSessionOpen(true);
  };

  // Quick log from Completed Pomodoro Focus Session
  const handleLogFromTimer = (subjectId: string, minutes: number, note: string) => {
    handleLogSession(subjectId, minutes, TODAY_STR, note);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to restore the default academic sample data? All current custom additions will be overwritten.")) {
      setSubjects(SAMPLE_SUBJECTS);
      setSessions(SAMPLE_SESSIONS);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Danger: This will delete ALL subjects and study sessions from your local browser database. Proceed?")) {
      setSubjects([]);
      setSessions([]);
    }
  };

  // --- MOTIVATIONAL EXTRA ---
  const currentQuote = {
    text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    author: "Paul J. Meyer"
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text pb-12 flex flex-col font-sans border-8 border-natural-frame box-border" id="app-root">
      {/* Top Navigation Banner */}
      <header className="sticky top-0 z-40 bg-natural-bg/95 backdrop-blur-md border-b border-natural-divider shadow-2xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Platform Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-natural-primary text-natural-bg p-2.5 rounded-xl shadow-xs flex items-center justify-center">
              <GraduationCap className="w-5.5 h-5.5 text-natural-bg" />
            </div>
            <div>
              <h1 className="text-2xl font-serif italic text-natural-primary tracking-tight flex items-baseline gap-1">
                Scholar.track
                <span className="text-[10px] font-sans font-bold text-natural-primary-light uppercase tracking-widest bg-natural-fill border border-natural-border px-1.5 py-0.5 rounded-md">
                  v2.6
                </span>
              </h1>
              <p className="text-[9px] text-natural-muted font-semibold uppercase tracking-widest">
                Academic Performance Portal
              </p>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-natural-border bg-natural-fill text-natural-dark-muted hover:bg-natural-border/60 hover:text-natural-text transition-all cursor-pointer flex items-center justify-center shadow-3xs"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" /> : <Moon className="w-4 h-4 text-natural-primary" />}
            </button>

            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="text-xs font-bold text-natural-dark-muted bg-natural-fill border border-natural-border hover:bg-natural-border/60 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              id="header-add-subject-btn"
            >
              <BookOpen className="w-3.5 h-3.5 text-natural-primary" />
              <span className="hidden sm:inline">Add Subject</span>
            </button>

            <button
              onClick={handleTriggerGeneralLog}
              className="text-xs font-bold text-white bg-natural-primary hover:opacity-95 px-4.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              id="header-log-session-btn"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Log Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        
        {/* Welcome Hero Greeting Card */}
        <div 
          className="bg-natural-fill rounded-3xl border border-natural-border p-6 sm:p-7 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden" 
          id="welcome-hero-card"
        >
          {/* Background Decorative Accent */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-natural-primary-light/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1.5 z-10 w-full md:max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-natural-primary tracking-widest bg-natural-border border border-natural-border px-2 py-0.5 rounded-full">
                Active Student Workspace
              </span>
              <span className="text-[10px] font-mono text-natural-muted">ID: 2026-CS-892</span>
            </div>

            {isEditingName ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (nameInput.trim()) {
                    setStudentName(nameInput.trim());
                    setIsEditingName(false);
                  }
                }}
                className="flex flex-wrap items-center gap-2 mt-1"
              >
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="text-2xl sm:text-3xl font-serif italic text-natural-text bg-natural-card border border-natural-border rounded-xl px-3 py-1 focus:outline-hidden focus:ring-2 focus:ring-natural-primary/20 max-w-xs font-bold"
                  autoFocus
                  maxLength={25}
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-natural-primary text-white font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer text-xs shadow-sm"
                  id="save-name-btn"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(studentName);
                    setIsEditingName(false);
                  }}
                  className="px-3.5 py-2 bg-natural-card text-natural-dark-muted border border-natural-border font-bold rounded-xl hover:bg-natural-fill transition-all cursor-pointer text-xs"
                  id="cancel-name-btn"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-serif italic text-natural-text tracking-tight flex items-center gap-2 group">
                Welcome back, {studentName}
                <button
                  onClick={() => {
                    setNameInput(studentName);
                    setIsEditingName(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-natural-muted hover:text-natural-primary hover:bg-natural-border/60 transition-all cursor-pointer shrink-0"
                  title="Rename Student"
                  id="edit-name-btn"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </h2>
            )}

            <p className="text-xs sm:text-sm text-natural-dark-muted font-medium">
              Your focus and structured micro-sessions are compounding beautiful results. Let's make progress today.
            </p>
          </div>

          <div className="flex items-center gap-3.5 z-10 bg-natural-card border border-natural-border rounded-2xl p-3 px-4 shadow-2xs" id="current-date-badge">
            <Calendar className="w-5 h-5 text-natural-muted shrink-0" />
            <div className="text-right">
              <span className="block text-sm font-bold text-natural-primary tracking-tight">
                July 14, 2026
              </span>
              <span className="block text-[9px] uppercase font-bold text-natural-muted tracking-widest">
                Tuesday • Term 3 Week 8
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Dashboard Widget */}
        <Dashboard
          subjects={subjects}
          sessions={sessions}
          todayStr={TODAY_STR}
          onLogSessionClick={handleTriggerLogForSubject}
          onDeleteSubject={handleDeleteSubject}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        {/* Bento Grid layout for timer & ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Column - Study Ledger list */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <RecentSessionsList
              sessions={sessions}
              subjects={subjects}
              onDeleteSession={handleDeleteSession}
              todayStr={TODAY_STR}
            />
          </div>

          {/* Sidebar Widgets Column */}
          <div className="lg:col-span-1 space-y-8 order-1 lg:order-2">
            {/* 1. Pomodoro Focus Companion */}
            <FocusTimer
              subjects={subjects}
              onLogCompletedSession={handleLogFromTimer}
            />

            {/* 2. Motivational Banner & Study Advice */}
            <div className="bg-natural-card rounded-3xl border border-natural-border p-6 shadow-xs space-y-4" id="study-tip-card">
              <h4 className="text-xs font-bold uppercase text-natural-muted tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-natural-accent" />
                Daily Cognitive Spark
              </h4>
              <blockquote className="space-y-2 pl-3 border-l-2 border-natural-primary-light">
                <p className="text-xs text-natural-primary leading-relaxed font-semibold italic">
                  "{currentQuote.text}"
                </p>
                <cite className="block text-[10px] text-natural-muted font-bold tracking-wider not-italic text-right">
                  — {currentQuote.author}
                </cite>
              </blockquote>
              <div className="border-t border-natural-divider pt-4 flex gap-2.5 items-start text-[11px] text-natural-dark-muted bg-natural-fill/50 p-3 rounded-xl border border-natural-border/60">
                <Info className="w-4 h-4 text-natural-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Retention Strategy:</strong> Research shows studying in structured 45-minute blocks with 5-minute pauses retains 30% more logical formulas. Use the focus timer to track!
                </p>
              </div>
            </div>

            {/* 3. System Data Diagnostics / Actions Panel */}
            <div className="bg-natural-card rounded-3xl border border-natural-border p-6 shadow-xs space-y-4" id="system-database-card">
              <h4 className="text-xs font-bold uppercase text-natural-muted tracking-widest flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-natural-primary" />
                Local Database Sync
              </h4>
              <p className="text-[11px] text-natural-dark-muted leading-relaxed font-medium">
                Your subject targets and logged hours are saved in your browser's local sandbox storage (`localStorage`).
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleResetData}
                  className="flex-1 py-2 px-3 border border-natural-border text-natural-primary bg-natural-fill font-bold rounded-xl hover:bg-natural-border/50 transition-all text-[11px] cursor-pointer flex items-center justify-center gap-1.5"
                  title="Reload default university data sets"
                  id="reset-sample-btn"
                >
                  <RefreshCw className="w-3 h-3 text-natural-primary" />
                  Reset Defaults
                </button>
                <button
                  onClick={handleClearAllData}
                  className="flex-1 py-2 px-3 border border-rose-200 text-rose-700 font-bold rounded-xl hover:bg-rose-50 transition-all text-[11px] cursor-pointer"
                  id="clear-db-btn"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Page Footer */}
      <footer className="mt-auto border-t border-natural-divider bg-natural-card py-8" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-natural-muted">
          <div className="flex items-center gap-1 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-natural-accent fill-natural-accent animate-pulse" />
            <span>for academic mastery • Scholar.track 2026</span>
          </div>
          <div className="flex items-center gap-4 text-natural-dark-muted font-semibold">
            <span>Total Subjects tracked: {subjects.length}</span>
            <span>Total sessions: {sessions.length}</span>
          </div>
        </div>
      </footer>

      {/* Dialog Modals */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAdd={handleAddSubject}
      />

      <LogSessionModal
        isOpen={isLogSessionOpen}
        onClose={() => setIsLogSessionOpen(false)}
        subjects={subjects}
        onLog={handleLogSession}
        defaultSubjectId={selectedSubjectIdForLog}
        todayStr={TODAY_STR}
      />
    </div>
  );
}
