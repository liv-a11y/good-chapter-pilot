// Client-safe options for the start flow. Every answer is a choice, never free text about the person.
export const PATHS = [
  {
    id: "anchor_gift",
    title: "I want to anchor one gift.",
    line: "You pick the first thing. The other seven get built around it.",
  },
  {
    id: "employer_pool",
    title: "There is a pool from work.",
    line: "Work set one amount per person. The chapter is built inside it.",
  },
  {
    id: "realtor_budget",
    title: "I'm a realtor with a set budget.",
    line: "One amount per client. The chapter is built inside it.",
  },
] as const;
export type PathId = (typeof PATHS)[number]["id"];
export const BUDGET_PATHS: PathId[] = ["employer_pool", "realtor_budget"];

export const CHAPTER_TYPES = [
  "A first place",
  "A fresh start",
  "A new city",
  "A new job",
  "Moving in together",
  "A change of pace",
  "Retirement",
] as const;

export const CLUES = {
  evenings: {
    q: "Where do their evenings happen?",
    options: ["In the kitchen", "On the couch", "At a desk or a project", "Out with people"],
  },
  keeps: {
    q: "What do they use until it breaks?",
    options: ["The same mug", "One good pan", "A drawer of tools", "Old towels and linens"],
  },
  taste: {
    q: "Which room would they walk into first?",
    options: ["Warm and earthy", "Bright and bold", "Quiet and simple", "Practical first"],
  },
} as const;
export type ClueKey = keyof typeof CLUES;

export const TONES = [
  { id: "tender", label: "Tender" },
  { id: "playful", label: "Playful" },
] as const;

export const AMOUNTS = [100, 150, 250] as const;
