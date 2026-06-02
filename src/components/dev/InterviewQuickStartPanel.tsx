"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DUMMY_INTERVIEW_ANSWERS } from "@/lib/fixtures/dummy-interview-answers";
import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";
import { saveInterviewAnswers } from "@/lib/interview-storage";

const answerByQuestionId = new Map(
  DUMMY_INTERVIEW_ANSWERS.map((a) => [a.questionId, a.text] as const),
);

export function InterviewQuickStartPanel() {
  const router = useRouter();
  const [showAnswers, setShowAnswers] = useState(false);

  function startAnalysis() {
    saveInterviewAnswers(DUMMY_INTERVIEW_ANSWERS);
    router.push("/interview/analyzing");
  }

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 leading-relaxed">
        開発専用です。22問の回答は固定のダミーデータが入っています。ボタン1つで本番と同じ
        「回答を読んでいます → 見えてきたこと」画面まで進みます（Claude API を呼びます）。
      </p>

      <button
        type="button"
        onClick={startAnalysis}
        className="w-full rounded-xl bg-accent py-4 text-sm font-medium text-white"
      >
        見えてきたことを探す（22問入力済み）
      </button>

      <button
        type="button"
        onClick={() => setShowAnswers((v) => !v)}
        className="w-full rounded-xl border border-border py-3 text-sm"
      >
        {showAnswers ? "入力内容を閉じる" : "入力済みの22問を表示"}
      </button>

      {showAnswers && (
        <ol className="space-y-4 rounded-xl border border-border bg-white p-4 text-sm leading-relaxed">
          {INTERVIEW_QUESTIONS.map((q) => (
            <li key={q.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <p className="mb-1 font-medium text-foreground">
                {q.id}. {q.text}
              </p>
              <p className="text-muted">
                {answerByQuestionId.get(q.id) ?? "（未設定）"}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
