import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Trash2, 
  Calendar, 
  Clock, 
  Filter, 
  BookOpen, 
  X,
  FileText
} from "lucide-react";
import { StudySession, Subject } from "../types";
import { getFriendlyDateLabel } from "../utils/dateUtils";

interface RecentSessionsListProps {
  sessions: StudySession[];
  subjects: Subject[];
  onDeleteSession: (id: string) => void;
  todayStr: string;
}

export default function RecentSessionsList({
  sessions,
  subjects,
  onDeleteSession,
  todayStr,
}: RecentSessionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Helper to format duration beautifully
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Find subject details safely
  const getSubjectInfo = (subjectId: string) => {
    const s = subjects.find((sub) => sub.id === subjectId);
    return s || { name: "Unknown Subject", color: "#64748b" };
  };

  // Filter & Search Logic
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => {
        // Filter by subject
        if (selectedSubjectFilter !== "all" && session.subjectId !== selectedSubjectFilter) {
          return false;
        }
        // Filter by search text
        if (searchTerm.trim() !== "") {
          const query = searchTerm.toLowerCase();
          const noteMatch = session.note.toLowerCase().includes(query);
          const subject = getSubjectInfo(session.subjectId);
          const subjectMatch = subject.name.toLowerCase().includes(query);
          return noteMatch || subjectMatch;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort newest first
  }, [sessions, selectedSubjectFilter, searchTerm, subjects]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubjectFilter("all");
  };

  return (
    <div className="bg-natural-card rounded-3xl border border-natural-border p-6 shadow-xs space-y-6" id="sessions-management-card">
      {/* Header and filters bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-natural-divider pb-5">
        <div>
          <h3 className="text-lg font-serif italic text-natural-primary tracking-tight flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-natural-primary" />
            Study Log Ledger
          </h3>
          <p className="text-xs text-natural-muted font-medium mt-0.5">Review, search, and manage your logged study intervals</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-natural-muted" />
            <input
              type="text"
              placeholder="Search notes or subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 border border-natural-border rounded-xl text-xs text-natural-text bg-natural-fill/60 focus:outline-hidden focus:bg-natural-card focus:ring-2 focus:ring-natural-primary/15 focus:border-natural-primary transition-all placeholder:text-natural-muted"
              id="session-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-2.5 p-1 rounded-full hover:bg-natural-border/50 text-natural-muted hover:text-natural-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Filter Dropdown */}
          <div className="relative flex-1 sm:w-52">
            <Filter className="absolute left-3.5 top-3 w-4 h-4 text-natural-muted pointer-events-none" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 border border-natural-border rounded-xl text-xs text-natural-text bg-natural-fill/60 focus:outline-hidden focus:bg-natural-card focus:ring-2 focus:ring-natural-primary/15 focus:border-natural-primary transition-all cursor-pointer appearance-none"
              id="session-filter-dropdown"
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="space-y-3" id="session-logs-container">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-natural-muted border border-dashed border-natural-border rounded-2xl bg-natural-bg">
            <p className="font-serif italic font-bold text-sm text-natural-primary mb-1">No sessions match current criteria</p>
            {(searchTerm || selectedSubjectFilter !== "all") ? (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-natural-primary hover:text-natural-text underline mt-2 cursor-pointer"
                id="clear-filters-btn"
              >
                Clear all filters
              </button>
            ) : (
              <p className="text-xs font-medium">Your logged learning times will appear chronologically here.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-natural-divider max-h-[500px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {filteredSessions.map((session, index) => {
                const subject = getSubjectInfo(session.subjectId);
                const isConfirmingDelete = confirmDeleteId === session.id;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`group py-4.5 flex items-start justify-between gap-4 transition-all animate-fade-in-up ${
                      isConfirmingDelete ? "bg-rose-500/10 px-3.5 rounded-xl -mx-3 border border-rose-500/20" : ""
                    }`}
                    style={{ animationDelay: `${index * 40}ms` }}
                    id={`session-log-card-${session.id}`}
                  >
                    {/* Log details */}
                    <div className="flex-1 flex gap-4 items-start min-w-0">
                      {/* Left vertical color pill */}
                      <span 
                        className="w-1.5 h-10 rounded-full shrink-0 mt-1 border border-natural-text/10 shadow-3xs" 
                        style={{ backgroundColor: subject.color }} 
                      />

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-bold text-natural-text text-sm truncate max-w-[200px] sm:max-w-xs">
                            {subject.name}
                          </span>
                          <span className="text-[10px] text-natural-muted font-semibold shrink-0 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-natural-muted" />
                            {getFriendlyDateLabel(session.date, todayStr)}
                          </span>
                        </div>

                        {session.note ? (
                          <p className="text-xs text-natural-dark-muted leading-relaxed break-words font-medium">
                            {session.note}
                          </p>
                        ) : (
                          <p className="text-xs text-natural-muted italic font-medium">
                            No detailed notes recorded for this session.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Duration & Actions */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Duration badge */}
                      <span className="text-xs font-bold text-natural-text bg-natural-fill border border-natural-border px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-natural-primary" />
                        {formatDuration(session.durationMinutes)}
                      </span>

                      {/* Delete actions */}
                      <div className="w-16 flex justify-end">
                        <AnimatePresence mode="wait">
                          {isConfirmingDelete ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="flex gap-1.5"
                            >
                              <button
                                onClick={() => onDeleteSession(session.id)}
                                className="px-2 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 text-[10px] shadow-sm cursor-pointer"
                                id={`confirm-del-${session.id}`}
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 bg-natural-border text-natural-text font-semibold rounded-lg hover:bg-natural-divider text-[10px] cursor-pointer"
                                id={`cancel-del-${session.id}`}
                              >
                                Cancel
                              </button>
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(session.id)}
                              className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 p-2 rounded-xl text-natural-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                              title="Delete Session Log"
                              id={`del-btn-${session.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
