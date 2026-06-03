"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ProgressBar } from "@/components/interview/ProgressBar";
import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";
import { loadInterviewAnswers, saveInterviewAnswers } from "@/lib/interview-storage";
import type { InterviewAnswer } from "@/lib/types";

export function InterviewForm() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = loadInterviewAnswers();
    if (!saved?.length) return {};
    return Object.fromEntries(saved.map((a) => [a.questionId, a.text]));
  });
  const question = INTERVIEW_QUESTIONS[index];
  const currentAnswer = answers[question.id] ?? "";

  const goNext = useCallback(() => {
    const trimmed = currentAnswer.trim();
    if (!trimmed) return;

    const nextAnswers = { ...answers, [question.id]: trimmed };
    setAnswers(nextAnswers);

    if (index < INTERVIEW_QUESTIONS.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    const payload: InterviewAnswer[] = INTERVIEW_QUESTIONS.map((q) => ({
      questionId: q.id,
      text: nextAnswers[q.id] ?? "",
    }));

    saveInterviewAnswers(payload);
    router.push("/interview/analyzing");
  }, [answers, currentAnswer, index, question.id, router]);

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <div>
      <ProgressBar currentIndex={index} />

      <p className="mb-2 text-sm text-muted">自由に書いてください</p>
      <h1 className="mb-6 text-xl font-medium leading-relaxed">
        {question.text}
      </h1>

      <textarea
        value={currentAnswer}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
        }
        rows={6}
        placeholder="思いつくことをそのまま…"
        className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        autoFocus
      />

      <div className="mt-8 flex gap-3">
        {index > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-medium"
          >
            前の質問
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={!currentAnswer.trim()}
          className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-40"
        >
          {index < INTERVIEW_QUESTIONS.length - 1 ? "次へ" : "回答を送る"}
        </button>
      </div>
    </div>
  );
}
