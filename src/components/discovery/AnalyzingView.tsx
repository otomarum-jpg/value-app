"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
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
      router.replace("/interview");
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
          throw new Error(data.error ?? "分析に失敗しました");
        }

        const result = (await res.json()) as InitialAnalysisResult;
        if (cancelled) return;

        saveInitialAnalysis(result);
        router.replace("/discovery");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "分析に失敗しました");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/interview")}
          className="text-sm text-accent underline"
        >
          インタビューに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-6 h-10 w-10 animate-pulse rounded-full bg-accent/30" />
      <h1 className="mb-2 text-xl font-medium">回答を読んでいます</h1>
      <p className="max-w-xs text-sm text-muted leading-relaxed">
        断定はしません。複数の回答に共通するものを、根拠と仮説に分けて整理しています。
      </p>
    </div>
  );
}
