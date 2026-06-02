"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DiscoveryResult } from "@/components/discovery/DiscoveryResult";
import { formatAnalysisForChatGPT } from "@/lib/format-analysis-export";
import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";
import {
  loadInitialAnalysis,
  loadInterviewAnswers,
} from "@/lib/interview-storage";
import type { InitialAnalysisResult, InterviewAnswer } from "@/lib/types";

type CopyState = "idle" | "done" | "error";

export function DiscoveryExportView() {
  const searchParams = useSearchParams();
  const clean = searchParams.get("clean") === "1";

  const [result, setResult] = useState<InitialAnalysisResult | null>(null);
  const [answers, setAnswers] = useState<InterviewAnswer[] | null>(null);
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    setResult(loadInitialAnalysis());
    setAnswers(loadInterviewAnswers());
  }, []);

  async function copyForChatGPT() {
    if (!result) return;
    const text = formatAnalysisForChatGPT(
      result,
      includeAnswers ? answers : null,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("done");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
    }
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-relaxed text-amber-950">
        <p className="mb-3">
          まだ見えてきたことがありません。先にデモでAPIを実行してください。
        </p>
        <Link href="/dev/interview-quick" className="font-medium underline">
          インタビュー省略テストへ
        </Link>
      </div>
    );
  }

  const captureCard = (
    <article
      id="discovery-capture"
      className="rounded-2xl border border-border bg-white p-6 shadow-sm print:shadow-none print:border-0"
    >
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
          価値発見アプリ · 回答から見えてきたこと
        </p>
        <h1 className="text-xl font-medium">発見候補・まだ分からないこと・観察テーマ</h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          デモ用の観察メモです。断定ではなく、これから一緒に確かめる仮説です。
        </p>
      </header>
      <DiscoveryResult result={result} variant="capture" />
      {includeAnswers && answers && answers.length > 0 && (
        <section className="mt-10 border-t border-border pt-8 print:break-before-page">
          <h2 className="mb-1 text-lg font-medium">インタビュー回答（参考）</h2>
          <p className="mb-5 text-sm text-muted">
            壁打ち用に22問の入力内容を添えています。
          </p>
          <ol className="space-y-5 text-sm leading-relaxed">
            {INTERVIEW_QUESTIONS.map((q) => {
              const text =
                answers.find((a) => a.questionId === q.id)?.text ?? "（未回答）";
              return (
                <li key={q.id}>
                  <p className="mb-1 font-medium">
                    {q.id}. {q.text}
                  </p>
                  <p className="text-muted">{text}</p>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </article>
  );

  if (clean) {
    return (
      <div className="min-h-screen bg-[#f0eeea] px-4 py-8 print:bg-white print:p-0">
        <div className="mx-auto max-w-2xl">{captureCard}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print rounded-xl border border-border bg-white p-4">
        <p className="mb-4 text-sm text-muted leading-relaxed">
          下の白いカード部分をスクリーンショットしてください。ナビやボタンは写りません。
          テキストで送る場合は「ChatGPT用にコピー」がおすすめです。
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyForChatGPT}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white"
          >
            {copyState === "done"
              ? "コピーしました"
              : copyState === "error"
                ? "コピーに失敗"
                : "ChatGPT用にコピー"}
          </button>
          <Link
            href="/dev/export?clean=1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border px-4 py-2.5 text-sm"
          >
            撮影専用画面を開く
          </Link>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeAnswers}
            onChange={(e) => setIncludeAnswers(e.target.checked)}
            className="rounded border-border"
          />
          22問の回答もカード・コピーに含める
        </label>
      </div>

      <div className="rounded-xl bg-[#f0eeea] p-4 print:bg-transparent print:p-0">
        <div className="mx-auto max-w-2xl">{captureCard}</div>
      </div>
    </div>
  );
}
