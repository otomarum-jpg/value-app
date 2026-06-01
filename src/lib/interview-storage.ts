import type { InterviewAnswer, InitialAnalysisResult } from "./types";

const ANSWERS_KEY = "value-app:interview-answers";
const ANALYSIS_KEY = "value-app:initial-analysis";

export function saveInterviewAnswers(answers: InterviewAnswer[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadInterviewAnswers(): InterviewAnswer[] | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InterviewAnswer[];
  } catch {
    return null;
  }
}

export function saveInitialAnalysis(result: InitialAnalysisResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ANALYSIS_KEY, JSON.stringify(result));
}

export function loadInitialAnalysis(): InitialAnalysisResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ANALYSIS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InitialAnalysisResult;
  } catch {
    return null;
  }
}

export function clearInterviewSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ANSWERS_KEY);
  sessionStorage.removeItem(ANALYSIS_KEY);
}
