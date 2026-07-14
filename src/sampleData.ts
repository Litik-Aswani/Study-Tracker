import { Subject, StudySession } from "./types";

export const SAMPLE_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    name: "Data Structures & Algorithms",
    color: "#5C6D4C", // Moss
    targetHoursPerWeek: 8,
    group: "Computer Science",
  },
  {
    id: "sub-2",
    name: "Database Systems",
    color: "#A9B388", // Olive
    targetHoursPerWeek: 6,
    group: "Computer Science",
  },
  {
    id: "sub-3",
    name: "Human-Computer Interaction",
    color: "#A68A64", // Ochre
    targetHoursPerWeek: 4,
    group: "Design",
  },
  {
    id: "sub-4",
    name: "Linear Algebra",
    color: "#6B705C", // Sage
    targetHoursPerWeek: 5,
    group: "Mathematics",
  },
  {
    id: "sub-5",
    name: "Academic Writing & Research",
    color: "#C2A878", // Clay
    targetHoursPerWeek: 3,
    group: "Electives",
  },
];

export const SAMPLE_SESSIONS: StudySession[] = [
  {
    id: "sess-1",
    subjectId: "sub-1",
    durationMinutes: 90,
    date: "2026-07-08",
    note: "Reviewed Binary Search Trees and implemented AVL tree rotations in TypeScript.",
  },
  {
    id: "sess-2",
    subjectId: "sub-4",
    durationMinutes: 60,
    date: "2026-07-09",
    note: "Completed practice problems on Eigenvalues and Eigenvectors.",
  },
  {
    id: "sess-3",
    subjectId: "sub-2",
    durationMinutes: 120,
    date: "2026-07-10",
    note: "Designed E-R diagram for the final group project and wrote normal form proofs.",
  },
  {
    id: "sess-4",
    subjectId: "sub-5",
    durationMinutes: 45,
    date: "2026-07-10",
    note: "Drafted the introduction section and compiled references using Mendeley.",
  },
  {
    id: "sess-5",
    subjectId: "sub-1",
    durationMinutes: 120,
    date: "2026-07-11",
    note: "Practiced LeetCode graph traversal problems (BFS & DFS) and analyzed space complexity.",
  },
  {
    id: "sess-6",
    subjectId: "sub-3",
    durationMinutes: 90,
    date: "2026-07-11",
    note: "Conducted heuristic evaluation on three interactive prototypes.",
  },
  {
    id: "sess-7",
    subjectId: "sub-4",
    durationMinutes: 75,
    date: "2026-07-12",
    note: "Watched lecture on Orthogonal Projection and solved quiz prep questions.",
  },
  {
    id: "sess-8",
    subjectId: "sub-2",
    durationMinutes: 90,
    date: "2026-07-12",
    note: "Wrote SQL queries for index optimization and tested join strategies.",
  },
  {
    id: "sess-9",
    subjectId: "sub-5",
    durationMinutes: 60,
    date: "2026-07-13",
    note: "Peer reviewed the literature review section and formatted bibliographies.",
  },
  {
    id: "sess-10",
    subjectId: "sub-3",
    durationMinutes: 60,
    date: "2026-07-13",
    note: "Created wireframes for the user onboarding flow based on qualitative feedback.",
  },
  {
    id: "sess-11",
    subjectId: "sub-1",
    durationMinutes: 45,
    date: "2026-07-14",
    note: "Solved a dynamic programming problem (0/1 Knapsack) during morning study.",
  },
];
