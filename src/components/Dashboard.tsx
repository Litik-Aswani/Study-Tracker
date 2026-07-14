import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  Award,
  Sparkles,
  BookOpen,
  Folder,
  Trash2
} from "lucide-react";
import { Subject, StudySession } from "../types";
import { 
  calculateStreak, 
  isSameWeek, 
  getMondayOfWeek, 
  getSundayOfWeek,
  getFriendlyDateLabel
} from "../utils/dateUtils";

interface DashboardProps {
  subjects: Subject[];
  sessions: StudySession[];
  todayStr: string;
  onLogSessionClick: (subjectId: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  timeRange: "week" | "sevenDays";
  setTimeRange: (range: "week" | "sevenDays") => void;
}

export default function Dashboard({
  subjects,
  sessions,
  todayStr,
  onLogSessionClick,
  onDeleteSubject,
  timeRange,
  setTimeRange,
}: DashboardProps) {
  // --- SUBJECT GROUPING STATE ---
  const [isGrouped, setIsGrouped] = useState(() => {
    try {
      return localStorage.getItem("study_portal_group_subjects") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("study_portal_group_subjects", String(isGrouped));
  }, [isGrouped]);

  const groupedSubjects = useMemo(() => {
    const groups: Record<string, Subject[]> = {};
    subjects.forEach((s) => {
      const gName = s.group || "General";
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(s);
    });
    return groups;
  }, [subjects]);

  // 1. Calculate dates
  const mondayStr = getMondayOfWeek(todayStr);
  const sundayStr = getSundayOfWeek(todayStr);

  const formattedWeekRange = useMemo(() => {
    const mon = new Date(mondayStr);
    const sun = new Date(sundayStr);
    const format = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${format(mon)} – ${format(sun)}, 2026`;
  }, [mondayStr, sundayStr]);

  // 2. Filter sessions based on selected time range
  const filteredSessions = useMemo(() => {
    if (timeRange === "week") {
      return sessions.filter((s) => isSameWeek(s.date, todayStr));
    } else {
      // Last 7 days rolling
      const sevenDaysAgo = new Date(todayStr);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
      return sessions.filter((s) => s.date >= sevenDaysAgoStr && s.date <= todayStr);
    }
  }, [sessions, timeRange, todayStr]);

  // 3. Compute Stats
  const totalMinutes = useMemo(() => {
    return filteredSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  }, [filteredSessions]);

  const totalHours = (totalMinutes / 60).toFixed(1);

  const streak = useMemo(() => {
    const allSessionDates = sessions.map((s) => s.date);
    return calculateStreak(allSessionDates, todayStr);
  }, [sessions, todayStr]);

  const totalWeeklyTargetHours = useMemo(() => {
    return subjects.reduce((acc, curr) => acc + curr.targetHoursPerWeek, 0);
  }, [subjects]);

  const progressBySubject = useMemo(() => {
    const map: Record<string, number> = {};
    // Initialize
    subjects.forEach((s) => {
      map[s.id] = 0;
    });
    // Populate
    filteredSessions.forEach((sess) => {
      if (map[sess.subjectId] !== undefined) {
        map[sess.subjectId] += sess.durationMinutes;
      }
    });
    return map;
  }, [filteredSessions, subjects]);

  const overallGoalProgressPercent = useMemo(() => {
    if (totalWeeklyTargetHours === 0) return 0;
    const hoursStudied = totalMinutes / 60;
    return Math.min(Math.round((hoursStudied / totalWeeklyTargetHours) * 100), 100);
  }, [totalMinutes, totalWeeklyTargetHours]);

  // 4. Motivational Quotes based on state
  const motivationMessage = useMemo(() => {
    if (streak >= 7) {
      return {
        title: "Phenomenal Consistency!",
        desc: "You are on an active 7+ day streak. Your neural pathways are thanking you!",
        badge: "Academic Elite"
      };
    } else if (streak >= 3) {
      return {
        title: "Building Great Momentum",
        desc: "3+ days of consecutive learning! You're solidifying standard habits.",
        badge: "Deep Focus Mode"
      };
    } else if (streak > 0) {
      return {
        title: "Off to a Great Start!",
        desc: "Streak active. Every small daily block compounds into mastery.",
        badge: "Steady Growth"
      };
    } else {
      return {
        title: "Ready to Begin?",
        desc: "Log a study session today to spark an active daily streak!",
        badge: "Warm Start"
      };
    }
  }, [streak]);

  return (
    <div className="space-y-8" id="study-dashboard">
      {/* Time Range Selector & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-serif italic text-natural-primary tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-natural-accent animate-pulse shrink-0" />
            Study Analytics Desk
          </h2>
          <p className="text-xs text-natural-muted font-semibold uppercase tracking-wider mt-0.5">
            {timeRange === "week"
              ? `Current Calendar Week (${formattedWeekRange})`
              : "Rolling past 7 days of intense deep focus"}
          </p>
        </div>

        {/* Calm pill selector */}
        <div className="bg-natural-fill p-0.5 rounded-xl border border-natural-border flex text-xs font-semibold">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeRange === "week"
                ? "bg-natural-primary text-white shadow-2xs"
                : "text-natural-dark-muted hover:text-natural-text"
            }`}
            id="range-week-btn"
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("sevenDays")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeRange === "sevenDays"
                ? "bg-natural-primary text-white shadow-2xs"
                : "text-natural-dark-muted hover:text-natural-text"
            }`}
            id="range-rolling-btn"
          >
            Rolling 7 Days
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5" id="stats-grid">
        {/* Total hours */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-natural-card p-5.5 rounded-3xl border border-natural-border shadow-2xs flex items-center gap-4 relative overflow-hidden animate-fade-in-up"
          id="stat-hours"
        >
          <div className="p-3 bg-natural-fill text-natural-primary rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-natural-muted tracking-widest">
              Hours Studied
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-serif italic font-bold text-natural-text tracking-tight">
                {totalHours}h
              </span>
              <span className="text-xs text-natural-muted font-semibold">
                / {totalWeeklyTargetHours}h target
              </span>
            </div>
          </div>
        </motion.div>

        {/* Study Streak */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-natural-card p-5.5 rounded-3xl border border-natural-border shadow-2xs flex items-center gap-4 relative overflow-hidden animate-fade-in-up animation-delay-75"
          id="stat-streak"
        >
          <div className={`p-3 rounded-2xl transition-colors ${streak > 0 ? "bg-natural-fill text-natural-accent" : "bg-natural-fill text-natural-muted"}`}>
            <Flame className={`w-6 h-6 ${streak > 0 ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-natural-muted tracking-widest">
              Study Streak
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-3xl font-serif italic font-bold tracking-tight ${streak > 0 ? "text-natural-accent" : "text-natural-muted"}`}>
                {streak} {streak === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Goal Completion Rate */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-natural-card p-5.5 rounded-3xl border border-natural-border shadow-2xs flex items-center gap-4 relative overflow-hidden animate-fade-in-up animation-delay-150"
          id="stat-completion"
        >
          <div className="p-3 bg-natural-fill text-natural-primary rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="block text-[10px] font-bold uppercase text-natural-muted tracking-widest">
              Goal Completed
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-serif italic font-bold text-natural-text tracking-tight">
                {overallGoalProgressPercent}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic motivation banner */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-natural-fill border border-natural-border p-5.5 rounded-3xl shadow-2xs flex flex-col justify-between animate-fade-in-up animation-delay-225"
          id="stat-motivation"
        >
          <div className="flex justify-between items-start">
            <span className="text-[9px] bg-natural-primary text-white font-bold tracking-widest px-2.5 py-0.5 rounded-md uppercase">
              {motivationMessage.badge}
            </span>
            <Award className="w-4.5 h-4.5 text-natural-primary" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-xs font-bold text-natural-text font-serif italic">{motivationMessage.title}</h4>
            <p className="text-[11px] text-natural-dark-muted mt-0.5 leading-relaxed font-medium">
              {motivationMessage.desc}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Progress Bars Grid - Subject wise */}
      <div className="bg-natural-card rounded-3xl border border-natural-border p-6 sm:p-7 shadow-xs" id="subject-progress-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-serif italic text-natural-primary tracking-tight flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-natural-primary" />
              Subject Performance Progress
            </h3>
            <p className="text-xs text-natural-muted font-medium mt-0.5">Comparing actual logged focus sessions to weekly target goals</p>
          </div>

          {/* Toggle Grouping Option */}
          <button
            onClick={() => setIsGrouped(!isGrouped)}
            className="text-xs font-bold text-natural-dark-muted bg-natural-fill border border-natural-border hover:bg-natural-border/60 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:text-natural-text"
            id="toggle-group-btn"
          >
            <Folder className="w-3.5 h-3.5 text-natural-primary" />
            <span>{isGrouped ? "Show Flat List" : "Group by Category"}</span>
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12 text-natural-muted border border-dashed border-natural-border rounded-2xl bg-natural-bg">
            <p className="font-serif italic font-bold text-base mb-2">No subjects configured</p>
            <p className="text-xs mb-4">Set up your university courses to begin tracking goals.</p>
          </div>
        ) : (
          <>
            {/* Helper to render subject row */}
            {(() => {
              const renderSubjectProgress = (subject: Subject, index: number) => {
                const minutes = progressBySubject[subject.id] || 0;
                const hours = minutes / 60;
                const percent = Math.min(Math.round((hours / subject.targetHoursPerWeek) * 100), 100);
                const exceeded = hours >= subject.targetHoursPerWeek;

                return (
                  <div 
                    key={subject.id} 
                    className="space-y-2.5 group animate-fade-in-up" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    id={`progress-row-${subject.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-natural-text/10" 
                          style={{ backgroundColor: subject.color }} 
                        />
                        <span className="font-bold text-sm text-natural-text truncate" title={subject.name}>
                          {subject.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-natural-dark-muted font-mono">
                          {hours.toFixed(1)}h / {subject.targetHoursPerWeek}h
                        </span>

                        {exceeded ? (
                          <span className="text-[9px] uppercase font-bold bg-natural-border text-natural-primary px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-natural-primary/10 shadow-3xs">
                            Met
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-natural-fill text-natural-dark-muted px-1.5 py-0.5 rounded-md border border-natural-border">
                            {percent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar with track color derived dynamically */}
                    <div className="h-2.5 w-full bg-natural-fill rounded-full overflow-hidden relative border border-natural-border/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full transition-all"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>

                    {/* Action links */}
                    <div className="flex justify-between items-center pt-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <span className="text-[10px] text-natural-muted font-medium">
                        {exceeded 
                          ? "🎉 Target completed! Doing extra credits." 
                          : `Need ${(subject.targetHoursPerWeek - hours).toFixed(1)}h more to hit goal`}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onLogSessionClick(subject.id)}
                          className="text-[10px] font-bold text-natural-primary hover:text-natural-text flex items-center gap-1 cursor-pointer transition-colors"
                          id={`log-shortcut-${subject.id}`}
                        >
                          <Plus className="w-3 h-3 text-natural-primary" />
                          Log Time
                        </button>
                        <span className="text-natural-border">|</span>
                        <button
                          onClick={() => onDeleteSubject(subject.id)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
                          id={`delete-subject-${subject.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-rose-500" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              };

              if (isGrouped) {
                return (
                  <div className="space-y-8">
                    {(Object.entries(groupedSubjects) as Array<[string, Subject[]]>).map(([groupName, groupSubjects], groupIdx) => (
                      <div key={groupName} className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-natural-divider pb-2">
                          <span className="text-[10px] uppercase font-bold text-natural-primary tracking-widest bg-natural-fill px-2.5 py-1 rounded-xl border border-natural-border">
                            {groupName}
                          </span>
                          <span className="text-[10px] text-natural-muted font-semibold">
                            ({groupSubjects.length} {groupSubjects.length === 1 ? "subject" : "subjects"})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                          {groupSubjects.map((subject, idx) => renderSubjectProgress(subject, idx + groupIdx * 2))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {subjects.map((subject, idx) => renderSubjectProgress(subject, idx))}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
