import type { InterviewAnswer, InitialAnalysisResult, DailyLog, DevObservationLog } from "./types";

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

const DAILY_LOGS_KEY = "value-app:daily-logs";

export function saveDailyLog(log: Omit<DailyLog, "id" | "created_at">): DailyLog {
  const newLog: DailyLog = {
    ...log,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  const existing = loadDailyLogs();
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify([...existing, newLog]));
  return newLog;
}

export function loadDailyLogs(): DailyLog[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(DAILY_LOGS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DailyLog[];
  } catch {
    return [];
  }
}

export function updateDailyLog(id: string, patch: Partial<Pick<DailyLog, "ai_followup_question" | "followup_answer">>): void {
  const logs = loadDailyLogs();
  const updated = logs.map((l) => (l.id === id ? { ...l, ...patch } : l));
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(updated));
}

const DEV_OBS_KEY = "value-app:dev-observations";

export function saveDevObservation(log: DevObservationLog): void {
  if (typeof window === "undefined") return;
  const existing = loadDevObservations();
  const updated = [...existing.filter((l) => l.date !== log.date), log];
  updated.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(DEV_OBS_KEY, JSON.stringify(updated));
}

export function loadDevObservations(): DevObservationLog[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(DEV_OBS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DevObservationLog[];
  } catch {
    return [];
  }
}
