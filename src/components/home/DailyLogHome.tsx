"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadInitialAnalysis,
  saveDailyLog,
  loadDailyLogs,
  updateDailyLog,
} from "@/lib/interview-storage";
import type { DailyLog } from "@/lib/types";

type LogMode = "short" | "diary";
type ViewState = "input" | "loading" | "followup" | "done";

const FALLBACK_TITLES = [
  "まず整理したくなる",
  "自分なりの基準で考える",
  "頼まれなくても動いている",
];

const FIRST_REVIEW_DAYS = 7;

function formatDate(isoString: string) {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function truncate(text: string, max = 24) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

type ProgressProps = { logs: DailyLog[] };

function DiscoveryProgress({ logs }: ProgressProps) {
  if (logs.length === 0) return null;

  const recordedDays = new Set(logs.map((l) => l.created_at.slice(0, 10))).size;
  const daysUntilReview = Math.max(0, FIRST_REVIEW_DAYS - recordedDays);
  const recentLogs = [...logs]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  return (
    <section className="mb-8 rounded-2xl border border-border bg-white p-5">
      <h2 className="mb-4 text-sm font-medium">発見の進捗</h2>
      <div className="mb-4 flex gap-4 text-sm">
        <div>
          <span className="text-muted">記録した日数</span>
          <p className="mt-0.5 text-lg font-medium">{recordedDays}日</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <span className="text-muted">最初の振り返りまで</span>
          <p className="mt-0.5 text-lg font-medium">
            {daysUntilReview > 0 ? `あと${daysUntilReview}日` : "振り返りの時期です"}
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {recentLogs.map((log) => (
          <li key={log.id} className="flex gap-2 text-sm">
            <span className="shrink-0 text-muted">{formatDate(log.created_at)}</span>
            <span className="text-foreground/80">{truncate(log.content)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DailyLogHome() {
  const [mode, setMode] = useState<LogMode>("short");
  const [content, setContent] = useState("");
  const [view, setView] = useState<ViewState>("input");
  const [titles, setTitles] = useState<string[]>(FALLBACK_TITLES);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  const [followupQuestion, setFollowupQuestion] = useState("");
  const [followupAnswer, setFollowupAnswer] = useState("");

  useEffect(() => {
    const analysis = loadInitialAnalysis();
    if (analysis?.discoveryCandidates?.length) {
      setTitles(analysis.discoveryCandidates.map((c) => c.title));
    }
    setLogs(loadDailyLogs());
  }, []);

  async function handleSave() {
    if (!content.trim()) return;
    const saved = saveDailyLog({ content: content.trim(), mode });
    setSavedLogId(saved.id);
    setLogs(loadDailyLogs());
    setView("loading");

    try {
      const res = await fetch("/api/daily-log/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: saved.content }),
      });
      const data = (await res.json()) as { question?: string; error?: string };
      if (res.ok && data.question) {
        updateDailyLog(saved.id, { ai_followup_question: data.question });
        setFollowupQuestion(data.question);
        setView("followup");
      } else {
        setView("done");
      }
    } catch {
      setView("done");
    }
  }

  function handleFollowupSave() {
    if (savedLogId && followupAnswer.trim()) {
      updateDailyLog(savedLogId, { followup_answer: followupAnswer.trim() });
    }
    setLogs(loadDailyLogs());
    setView("done");
  }

  function handleReset() {
    setContent("");
    setFollowupAnswer("");
    setFollowupQuestion("");
    setSavedLogId(null);
    setView("input");
  }

  if (view === "loading") {
    return (
      <>
        <header className="mb-8">
          <h1 className="mb-2 text-xl font-medium">今日の観察</h1>
        </header>
        <div className="rounded-2xl border border-border bg-white p-6 text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-pulse rounded-full bg-accent/30" />
          <p className="text-sm text-muted">少しお待ちください…</p>
        </div>
      </>
    );
  }

  if (view === "followup") {
    return (
      <>
        <header className="mb-8">
          <h1 className="mb-2 text-xl font-medium">今日の観察</h1>
        </header>
        <div className="mb-6 rounded-2xl border border-border bg-white p-5">
          <p className="mb-1 text-xs text-muted">残せました。もう少しだけ聞かせてください。</p>
          <p className="text-sm font-medium leading-relaxed">{followupQuestion}</p>
        </div>
        <label className="block">
          <span className="sr-only">深掘りへの回答</span>
          <textarea
            value={followupAnswer}
            onChange={(e) => setFollowupAnswer(e.target.value)}
            rows={4}
            placeholder="思い出せる範囲で"
            className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-relaxed placeholder:text-muted/70"
          />
        </label>
        <button
          type="button"
          onClick={handleFollowupSave}
          className="mt-3 w-full rounded-xl bg-accent py-4 text-sm font-medium text-white"
        >
          {followupAnswer.trim() ? "回答を残す" : "スキップ"}
        </button>
      </>
    );
  }

  if (view === "done") {
    return (
      <>
        <header className="mb-8">
          <h1 className="mb-2 text-xl font-medium">今日の観察</h1>
        </header>
        <div className="mb-6 rounded-2xl border border-border bg-white p-6 text-center">
          <p className="mb-1 font-medium">残せました</p>
          <p className="text-sm text-muted">続けることで、見えてくることがあります。</p>
        </div>
        <DiscoveryProgress logs={logs} />
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-xl border border-border py-3 text-center text-sm font-medium"
        >
          もう1件残す
        </button>
        <p className="mt-8 text-center text-xs text-muted">
          <Link href="/discovery" className="underline">
            気になったことを見る
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">今日の観察</h1>
        <p className="text-sm text-muted leading-relaxed">
          あなたの価値は、普段の出来事の中に隠れています。今日はどんな場面があったか、覚えている範囲で残してください。
        </p>
      </header>

      <DiscoveryProgress logs={logs} />

      <section className="mb-8 rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-1 text-sm font-medium">今、確かめていること</h2>
        <p className="mb-4 text-xs text-muted">
          このテーマに関係ありそうな出来事があれば、ぜひ残してください。
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed">
          {titles.map((title, i) => (
            <li key={i}>{title}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <p className="mb-3 text-sm font-medium">書き方</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("short")}
            className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
              mode === "short"
                ? "border-accent bg-accent-soft"
                : "border-border bg-white"
            }`}
          >
            <span className="block font-medium">ひとこと</span>
            <span className="mt-1 block text-xs text-muted">思い出せる範囲で</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("diary")}
            className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
              mode === "diary"
                ? "border-accent bg-accent-soft"
                : "border-border bg-white"
            }`}
          >
            <span className="block font-medium">日記</span>
            <span className="mt-1 block text-xs text-muted">出来事と気持ちまで</span>
          </button>
        </div>
        <p className="mt-3 text-xs text-muted leading-relaxed">
          詳しく書くほど、あなたの中で繰り返されている価値が見つけやすくなります。
        </p>
      </section>

      <label className="block">
        <span className="sr-only">今日の観察</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={mode === "diary" ? 8 : 4}
          placeholder={
            mode === "diary"
              ? "今日あったことを、場面が思い出せる程度に書いてください"
              : "今日、印象に残ったことを一行で"
          }
          className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-relaxed placeholder:text-muted/70"
        />
      </label>

      <button
        type="button"
        onClick={handleSave}
        disabled={!content.trim()}
        className="mt-4 w-full rounded-xl bg-accent py-4 text-sm font-medium text-white disabled:opacity-40"
      >
        残す
      </button>

      <p className="mt-8 text-center text-xs text-muted">
        <Link href="/discovery" className="underline">
          気になったことを見る
        </Link>
      </p>
    </>
  );
}
