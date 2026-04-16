export type LevelCard = {
  id: string;
  title: string;
  difficulty: string;
  knowledgePoint: string;
  conceptTags: string[];
  stars: number;
  score: number;
  completed: boolean;
  unlocked: boolean;
};

export type WorldGroup = {
  name: string;
  levels: LevelCard[];
};

export type BootstrapData = {
  user: {
    id: number;
    nickname: string;
    totalPoints: number;
    level: number;
    streakDays: number;
    masteredConcepts: number;
    currentLevelId: string | null;
  };
  worlds: WorldGroup[];
  badges: {
    code: string;
    name: string;
    description: string;
    icon: string;
  }[];
  wrongQuestions: {
    id: number;
    levelId: string;
    knowledgePoint: string;
    errorMessage: string;
    resolved: boolean;
    createdAt: string;
  }[];
};

export type WrongRecord = {
  id: number;
  levelId: string;
  levelTitle: string;
  knowledgePoint: string;
  userCode: string;
  errorMessage: string;
  resolved: boolean;
  createdAt: string;
};

export type ProfileData = {
  nickname: string;
  totalPoints: number;
  level: number;
  streakDays: number;
  masteredConcepts: number;
  completedLevels: number;
  badges: { name: string; icon: string; description: string }[];
};

export type AIResult = {
  action: string;
  source: string;
  data: {
    title?: string;
    message?: string;
    tips?: string[];
    questions?: { title: string; description: string }[];
    [key: string]: unknown;
  };
};

export type LevelDetail = {
  id: string;
  world: string;
  title: string;
  description: string;
  conceptTags: string[];
  starterCode: string;
  hints: string[];
  difficulty: string;
  knowledgePoint: string;
  xpReward: number;
  coinReward: number;
  testCases: { type: string; expected: string | string[] }[];
};

export type RunResult = {
  success: boolean;
  output: string;
  tests: { type: string; expected: string | string[]; passed: boolean }[];
  score: number;
  stars: number;
  passed_count: number;
  total_count: number;
  message: string;
};
