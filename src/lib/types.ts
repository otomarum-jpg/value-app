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
