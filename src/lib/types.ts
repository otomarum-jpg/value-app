/** インタビュー1問の回答 */
export type InterviewAnswer = {
  questionId: number;
  text: string;
};

/** 初回発見の結果（発見候補画面） */
export type InitialAnalysisResult = {
  discoveryCandidates: DiscoveryCandidate[];
  contradictionPoints: ContradictionPoint[];
  observationThemes: ObservationTheme[];
};

export type DiscoveryCandidate = {
  title: string;
  evidence: string;
  hypothesis: string;
};

export type ContradictionPoint = {
  description: string;
  note: string;
};

export type ObservationTheme = {
  scene: string;
};

export type DailyLog = {
  id: string;
  content: string;
  mode: "short" | "diary";
  ai_followup_question?: string;
  followup_answer?: string;
  created_at: string;
};

/** 開発者用ユーザーゼロ検証ログ */
export type DevObservationLog = {
  date: string;
  opened: boolean;
  char_count: number;
  felt_hassle: "none" | "a-little" | "yes";
  ai_answered: boolean;
  notes: string;
};
