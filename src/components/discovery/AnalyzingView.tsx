"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearInterviewAnswers,
  loadInterviewAnswers,
  saveInitialAnalysis,
} from "@/lib/interview-storage";
import type { InitialAnalysisResult } from "@/lib/types";

export function AnalyzingView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const answers = loadInterviewAnswers();
    if (!answers?.length) {
      setError("回答データが見つかりませんでした。インタビューをやり直してください。");
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/analyze/initial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          const detail = data.error ?? `HTTP ${res.status}`;
          console.error("[AnalyzingView] API error:", res.status, detail);
          throw new Error(`${detail} (${res.status})`);
        }

        const result = (await res.json()) as InitialAnalysisResult;
        if (cancelled) return;

        saveInitialAnalysis(result);
        clearInterviewAnswers();
        router.replace("/discovery");
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof Error ? e.message : "見えてきたことが取得できませんでした";
        console.error("[AnalyzingView] error:", msg, e);
        setError(msg);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="text-center px-4">
        <p className="mb-2 text-base font-medium text-red-700">分析に失敗しました</p>
        <p className="mb-8 text-xs text-red-600 break-all leading-relaxed">{error}</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-accent py-3 text-sm font-medium text-white"
          >
            もう一度試す
          </button>
          <button
            type="button"
            onClick={() => router.push("/interview")}
            className="py-3 text-sm text-muted underline"
          >
            インタビューに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-6 h-10 w-10 animate-pulse rounded-full bg-accent/30" />
      <h1 className="mb-2 text-xl font-medium">回答を読んでいます</h1>
      <p className="max-w-xs text-sm text-muted leading-relaxed">
        断定はしません。複数の回答に共通する気になる点を、見えてきたことと仮説に分けて探しています。
      </p>
    </div>
  );
}
