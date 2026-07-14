export interface Subject {
  id: string;
  name: string;
  color: string; // Tailwind hex or class color code
  targetHoursPerWeek: number;
  group?: string; // Optional group or category
}

export interface StudySession {
  id: string;
  subjectId: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  note: string;
}
