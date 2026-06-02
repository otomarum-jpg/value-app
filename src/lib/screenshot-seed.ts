import { DUMMY_INTERVIEW_ANSWERS } from "@/lib/fixtures/dummy-interview-answers";
import { SAMPLE_INITIAL_ANALYSIS } from "@/lib/fixtures/sample-initial-analysis";
import {
  saveInitialAnalysis,
  saveInterviewAnswers,
} from "@/lib/interview-storage";

/** 本番の /discovery・/home 用にセッションへサンプルを入れる */
export function seedScreenshotSession(): void {
  saveInterviewAnswers(DUMMY_INTERVIEW_ANSWERS);
  saveInitialAnalysis(SAMPLE_INITIAL_ANALYSIS);
}
