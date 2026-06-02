import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";
import type { InitialAnalysisResult, InterviewAnswer } from "@/lib/types";

export function formatAnalysisForChatGPT(
  result: InitialAnalysisResult,
  answers?: InterviewAnswer[] | null,
): string {
  const lines: string[] = [
    "# 価値発見アプリ・回答から見えてきたこと（デモ）",
    "",
    "以下は22問インタビューに基づく観察メモです。断定ではなく、これから確かめる仮説です。",
    "",
    "## 発見候補",
    "",
  ];

  result.discoveryCandidates.forEach((item, i) => {
    lines.push(`### ${i + 1}. ${item.title}`);
    lines.push(`- 見えてきたこと：${item.evidence}`);
    lines.push(`- 仮説：${item.hypothesis}`);
    lines.push("");
  });

  lines.push("## まだ分からないこと", "");
  result.contradictionPoints.forEach((item, i) => {
    lines.push(`### ${i + 1}`);
    lines.push(item.description);
    lines.push(`（メモ：${item.note}）`);
    lines.push("");
  });

  lines.push("## 観察テーマ（7日間）", "");
  result.observationThemes.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.scene}`);
  });

  if (answers?.length) {
    const answerById = new Map(answers.map((a) => [a.questionId, a.text]));
    lines.push("", "---", "", "## インタビュー回答（22問）", "");
    for (const q of INTERVIEW_QUESTIONS) {
      lines.push(`**Q${q.id}. ${q.text}**`);
      lines.push(answerById.get(q.id) ?? "（未回答）");
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd();
}
