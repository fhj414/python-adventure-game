import { AIResult, BootstrapData, LevelDetail, ProfileData, RunResult, WrongRecord } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  bootstrap: () => fetcher<BootstrapData>("/api/bootstrap"),
  level: (levelId: string) => fetcher<LevelDetail>(`/api/levels/${levelId}`),
  runCode: (body: object) => fetcher<RunResult>("/api/run", { method: "POST", body: JSON.stringify(body) }),
  wrongQuestions: (knowledgePoint?: string) =>
    fetcher<WrongRecord[]>(`/api/wrong-questions${knowledgePoint ? `?knowledge_point=${encodeURIComponent(knowledgePoint)}` : ""}`),
  profile: () => fetcher<ProfileData>("/api/profile"),
  aiHint: (body: object) => fetcher<AIResult>("/api/ai/hint", { method: "POST", body: JSON.stringify(body) }),
  aiExplain: (body: object) => fetcher<AIResult>("/api/ai/explain", { method: "POST", body: JSON.stringify(body) }),
  aiLocateError: (body: object) => fetcher<AIResult>("/api/ai/locate-error", { method: "POST", body: JSON.stringify(body) }),
  aiSimilar: (body: object) => fetcher<AIResult>("/api/ai/similar", { method: "POST", body: JSON.stringify(body) }),
  aiReview: (body: object) => fetcher<AIResult>("/api/ai/review", { method: "POST", body: JSON.stringify(body) }),
};
