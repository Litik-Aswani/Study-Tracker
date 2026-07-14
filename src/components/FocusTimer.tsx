import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Flame, Coffee, Check, BookOpen, Plus } from "lucide-react";
import { Subject } from "../types";

interface FocusTimerProps {
  subjects: Subject[];
  onLogCompletedSession: (subjectId: string, minutes: number, note: string) => void;
}

export default function FocusTimer({ subjects, onLogCompletedSession }: FocusTimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [timerComplete, setTimerComplete] = useState(false);
  const [logged, setLogged] = useState(false);
  const [customNote, setCustomNote] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialDurationRef = useRef(25 * 60);

  // Sync selected subject
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Handle timer countdown
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer Completed!
            setIsActive(false);
            setTimerComplete(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            // Try triggering standard browser notification or simple alert
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(mode === "work" ? "Deep Work Complete!" : "Break is Over!", {
                body: mode === "work" ? "Time to rest and hydrate." : "Ready to jump back in?",
              });
            }
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    if (!isActive && minutes === 25 && seconds === 0) {
      initialDurationRef.current = 25 * 60;
    } else if (!isActive && minutes === 50 && seconds === 0) {
      initialDurationRef.current = 50 * 60;
    } else if (!isActive && minutes === 5 && seconds === 0) {
      initialDurationRef.current = 5 * 60;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setMinutes(25);
    setSeconds(0);
    setTimerComplete(false);
    setLogged(false);
    setCustomNote("");
  };

  const setTimerPreset = (presetMinutes: number, presetMode: "work" | "break") => {
    setIsActive(false);
    setMode(presetMode);
    setMinutes(presetMinutes);
    setSeconds(0);
    setTimerComplete(false);
    setLogged(false);
    setCustomNote("");
    initialDurationRef.current = presetMinutes * 60;
  };

  const handleQuickLog = () => {
    const totalMinutesStudied = Math.round(initialDurationRef.current / 60);
    onLogCompletedSession(
      selectedSubjectId,
      totalMinutesStudied,
      customNote.trim() || `Deep work block completed via Pomodoro Focus companion.`
    );
    setLogged(true);
    setTimeout(() => {
      resetTimer();
    }, 2000);
  };

  // Circular math for progress
  const totalSeconds = minutes * 60 + seconds;
  const elapsedSeconds = initialDurationRef.current - totalSeconds;
  const progressPercentage = Math.min((elapsedSeconds / initialDurationRef.current) * 100, 100);

  return (
    <div className="bg-natural-card border border-natural-border rounded-3xl p-6 shadow-xs space-y-4 relative" id="pomodoro-timer-card">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-serif italic text-natural-text font-bold flex items-center gap-1.5">
            <Flame className="w-4.5 h-4.5 text-natural-accent animate-pulse" />
            Study Companion Timer
          </h3>
          <p className="text-[10px] text-natural-muted font-medium mt-0.5">Pomodoro focus loops to sustain steady retention</p>
        </div>
 
        {/* Mode presets */}
        <div className="flex gap-1 bg-natural-fill p-0.5 rounded-xl border border-natural-border text-[10px] font-bold">
          <button
            onClick={() => setTimerPreset(25, "work")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === "work" && initialDurationRef.current === 25 * 60
                ? "bg-natural-primary text-white"
                : "text-natural-dark-muted hover:text-natural-text"
            }`}
            id="preset-25-work"
          >
            25m Work
          </button>
          <button
            onClick={() => setTimerPreset(50, "work")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === "work" && initialDurationRef.current === 50 * 60
                ? "bg-natural-primary text-white"
                : "text-natural-dark-muted hover:text-natural-text"
            }`}
            id="preset-50-work"
          >
            50m Focus
          </button>
          <button
            onClick={() => setTimerPreset(5, "break")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === "break"
                ? "bg-natural-accent text-white"
                : "text-natural-dark-muted hover:text-natural-text"
            }`}
            id="preset-break"
          >
            Break
          </button>
        </div>
      </div>
 
      <AnimatePresence mode="wait">
        {timerComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center py-6 space-y-4"
            key="complete-view"
          >
            <div className="w-12 h-12 rounded-full bg-natural-fill text-natural-primary flex items-center justify-center animate-bounce shadow-xs border border-natural-text/5">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-serif italic text-natural-text font-bold">Sensational Focus Loop!</h4>
              <p className="text-[11px] text-natural-dark-muted max-w-xs mx-auto mt-0.5 font-medium">
                You successfully finished {Math.round(initialDurationRef.current / 60)} minutes of deep work. Ready to save it to your records?
              </p>
            </div>
 
            {logged ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-natural-fill text-natural-primary text-xs py-2 px-4 rounded-xl border border-natural-primary/10 font-bold"
              >
                Session Logged Successfully!
              </motion.div>
            ) : (
              <div className="w-full space-y-3.5 max-w-xs">
                {subjects.length > 0 && (
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-natural-dark-muted flex items-center gap-1 uppercase tracking-wider">
                      <BookOpen className="w-3 h-3 text-natural-primary" /> Assign to Subject
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-natural-border bg-natural-card rounded-xl text-xs font-bold text-natural-text focus:outline-hidden focus:ring-2 focus:ring-natural-primary/15 focus:border-natural-primary"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
 
                <div className="text-left space-y-1">
                  <label className="text-[10px] font-bold text-natural-dark-muted flex items-center gap-1 uppercase tracking-wider">
                    <Coffee className="w-3 h-3 text-natural-primary" /> Quick Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Completed graph traversal review"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full px-3 py-2 border border-natural-border bg-natural-card rounded-xl text-xs text-natural-text focus:outline-hidden focus:ring-2 focus:ring-natural-primary/15 focus:border-natural-primary placeholder:text-natural-muted"
                  />
                </div>
 
                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={resetTimer}
                    className="flex-1 text-xs font-bold text-natural-dark-muted hover:text-natural-text border border-natural-border bg-natural-card py-2 rounded-xl transition-colors cursor-pointer"
                    id="skip-log-btn"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleQuickLog}
                    className="flex-1 text-xs font-bold text-white bg-natural-primary hover:bg-natural-primary-dark py-2 rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    id="save-log-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Log Time
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center justify-around gap-4"
            key="running-view"
          >
            {/* Circular representation using SVG overlay */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  className="stroke-natural-fill"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Foreground progression */}
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  className="stroke-natural-primary transition-all duration-300"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * progressPercentage) / 100}
                />
              </svg>
 
              {/* Centered digits */}
              <div className="absolute text-center">
                <span className="text-2xl font-serif italic font-bold text-natural-text tracking-tight block">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold text-natural-muted tracking-widest block">
                  {mode === "work" ? "Deep Focus" : "Short Break"}
                </span>
              </div>
            </div>
 
            {/* Timer controls */}
            <div className="flex flex-col justify-center space-y-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTimer}
                  className={`p-3 rounded-xl text-white font-bold transition-all shadow-md flex items-center justify-center cursor-pointer ${
                    isActive 
                      ? "bg-natural-dark-muted hover:bg-natural-text" 
                      : "bg-natural-primary hover:bg-natural-primary-dark"
                  }`}
                  id="timer-play-pause-btn"
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white text-white" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 rounded-xl bg-natural-card border border-natural-border text-natural-primary hover:text-natural-text hover:bg-natural-fill/80 transition-all shadow-2xs cursor-pointer"
                  title="Reset Timer"
                  id="timer-reset-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
 
              <div className="text-[10px] text-natural-dark-muted font-semibold text-center sm:text-left leading-relaxed">
                {isActive ? (
                  <span className="text-natural-primary font-bold animate-pulse">● Session active...</span>
                ) : (
                  <span>Ready to start focus session</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
