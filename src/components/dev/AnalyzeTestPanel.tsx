"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DiscoveryResult } from "@/components/discovery/DiscoveryResult";
import { DUMMY_INTERVIEW_ANSWERS } from "@/lib/fixtures/dummy-interview-answers";
import {
  saveInitialAnalysis,
  saveInterviewAnswers,
} from "@/lib/interview-storage";
import type { InitialAnalysisResult } from "@/lib/types";

type ViewMode = "idle" | "loading" | "result" | "preview";

export function AnalyzeTestPanel() {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InitialAnalysisResult | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  async function runAnalysis() {
    setView("loading");
    setError(null);
    setResult(null);
    setElapsedMs(null);

    const started = performance.now();

    try {
      const res = await fetch("/api/analyze/initial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: DUMMY_INTERVIEW_ANSWERS }),
      });

      const data = (await res.json().catch(() => ({}))) as
        | InitialAnalysisResult
        | { error?: string };

      if (!res.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : `HTTP ${res.status}: 分析に失敗しました`,
        );
      }

      setResult(data as InitialAnalysisResult);
      setElapsedMs(Math.round(performance.now() - started));
      setView("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "分析に失敗しました");
      setView("idle");
    }
  }

  function openDiscoveryWithResult() {
    if (!result) return;
    saveInterviewAnswers(DUMMY_INTERVIEW_ANSWERS);
    saveInitialAnalysis(result);
    router.push("/discovery");
  }

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        開発専用です。22問のダミー回答で{" "}
        <code className="text-xs">POST /api/analyze/initial</code>{" "}
        をそのまま叩きます。本番ビルドではこのページは表示されません。
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runAnalysis}
          disabled={view === "loading"}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {view === "loading" ? "分析中…" : "ダミーデータで分析を実行"}
        </button>
        <button
          type="button"
          onClick={() =>
            setView((v) => (v === "preview" ? "idle" : "preview"))
          }
          className="rounded-xl border border-border px-5 py-3 text-sm"
        >
          {view === "preview" ? "ダミー回答を閉じる" : "ダミー回答を表示"}
        </button>
      </div>

      {view === "preview" && (
        <pre className="max-h-80 overflow-auto rounded-xl border border-border bg-white p-4 text-xs leading-relaxed">
          {JSON.stringify(DUMMY_INTERVIEW_ANSWERS, null, 2)}
        </pre>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {elapsedMs != null && <span>所要時間: {elapsedMs}ms</span>}
            <button
              type="button"
              onClick={() => setShowRawJson((v) => !v)}
              className="underline"
            >
              {showRawJson ? "UIプレビュー" : "生JSONを表示"}
            </button>
            <button
              type="button"
              onClick={openDiscoveryWithResult}
              className="underline"
            >
              発見画面で確認（sessionStorage に保存）
            </button>
          </div>

          {showRawJson ? (
            <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-white p-4 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <DiscoveryResult result={result} />
          )}
        </div>
      )}
    </div>
  );
}
