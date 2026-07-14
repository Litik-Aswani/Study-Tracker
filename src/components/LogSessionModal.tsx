import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, BookOpen, FileText } from "lucide-react";
import { Subject } from "../types";

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onLog: (subjectId: string, durationMinutes: number, date: string, note: string) => void;
  defaultSubjectId: string | null;
  todayStr: string;
}

const QUICK_DURATIONS = [
  { label: "25m (Pomodoro)", value: 25 },
  { label: "45m", value: 45 },
  { label: "60m (1 Hour)", value: 60 },
  { label: "90m", value: 90 },
  { label: "120m (2 Hours)", value: 120 },
];

export default function LogSessionModal({
  isOpen,
  onClose,
  subjects,
  onLog,
  defaultSubjectId,
  todayStr,
}: LogSessionModalProps) {
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [date, setDate] = useState(todayStr);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  // Initialize selected subject based on defaults or first item
  useEffect(() => {
    if (isOpen) {
      if (defaultSubjectId && subjects.some((s) => s.id === defaultSubjectId)) {
        setSubjectId(defaultSubjectId);
      } else if (subjects.length > 0) {
        setSubjectId(subjects[0].id);
      }
      setDate(todayStr);
    }
  }, [isOpen, defaultSubjectId, subjects, todayStr]);

  const selectedSubjectObject = subjects.find((s) => s.id === subjectId);
  const themeColor = selectedSubjectObject?.color || "#5c8d6e"; // default sage

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (duration === "" || duration <= 0) {
      setError("Please enter a valid study duration in minutes.");
      return;
    }

    if (duration > 1440) {
      setError("Study session cannot exceed 24 hours (1440 minutes). Make sure to rest!");
      return;
    }

    if (!date) {
      setError("Please select a valid date.");
      return;
    }

    onLog(subjectId, Number(duration), date, note.trim());
    setDuration("");
    setNote("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#3D4035]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            id="log-session-backdrop"
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-[#E9E4D8] shadow-xl max-w-md w-full p-6 relative overflow-hidden"
              id="log-session-modal"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
                style={{ backgroundColor: themeColor }}
              />

              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-serif italic text-[#3D4035] font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: themeColor }} />
                  Log Study Session
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-[#8A8F7C] hover:text-[#3D4035] hover:bg-[#F5F2EA] transition-colors"
                  id="close-log-session-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-100 font-bold">
                  {error}
                </div>
              )}

              {subjects.length === 0 ? (
                <div className="text-center py-6 text-[#8A8F7C]">
                  <p className="mb-3 font-serif italic font-bold">No subjects found.</p>
                  <p className="text-xs font-semibold">
                    You must add a subject before logging study sessions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Subject selector */}
                  <div>
                    <label htmlFor="log-subject-select" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#8A8F7C]" />
                      Select Subject
                    </label>
                    <select
                      id="log-subject-select"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors cursor-pointer font-semibold text-xs"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Goal: {s.targetHoursPerWeek}h/wk)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration input & chips */}
                  <div>
                    <label htmlFor="log-duration-input" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#8A8F7C]" />
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      id="log-duration-input"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 45, 90"
                      className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors placeholder:text-[#8A8F7C] font-semibold text-xs"
                      min="1"
                    />

                    {/* Quick Duration Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {QUICK_DURATIONS.map((qd) => (
                        <button
                          key={qd.value}
                          type="button"
                          onClick={() => setDuration(qd.value)}
                          className={`text-[10px] px-3 py-1 rounded-full border transition-all font-bold cursor-pointer ${
                            duration === qd.value
                              ? "bg-[#5C6D4C] border-[#5C6D4C] text-white shadow-2xs"
                              : "bg-[#F5F2EA] border-[#E9E4D8] hover:border-[#5C6D4C]/60 text-[#6B705C]"
                          }`}
                          id={`quick-duration-${qd.value}`}
                        >
                          {qd.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label htmlFor="log-date-input" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#8A8F7C]" />
                      Session Date
                    </label>
                    <input
                      type="date"
                      id="log-date-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      max={todayStr}
                      className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors cursor-pointer font-semibold text-xs"
                    />
                  </div>

                  {/* Note textarea */}
                  <div>
                    <label htmlFor="log-note-input" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#8A8F7C]" />
                      Study Notes (Optional)
                    </label>
                    <textarea
                      id="log-note-input"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What did you focus on? (e.g. completed quiz prep, wrote normal form proofs)"
                      className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors placeholder:text-[#8A8F7C] font-semibold text-xs h-20 resize-none"
                      maxLength={200}
                    />
                    <div className="text-right text-[10px] text-[#8A8F7C] mt-1 font-semibold">
                      {note.length}/200 characters
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 border border-[#E9E4D8] text-[#6B705C] bg-[#F5F2EA] rounded-xl font-bold hover:bg-[#E9E4D8]/50 transition-colors text-xs"
                      id="cancel-log-session-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 text-white rounded-xl font-bold shadow-sm hover:brightness-105 transition-all text-xs flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: themeColor }}
                      id="submit-log-session-btn"
                    >
                      Log Session
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
