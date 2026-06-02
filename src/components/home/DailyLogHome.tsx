"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadInitialAnalysis } from "@/lib/interview-storage";
import type { ObservationTheme } from "@/lib/types";

type LogMode = "short" | "diary";

const FALLBACK_THEMES: ObservationTheme[] = [
  { scene: "誰かに相談されたとき、自分は何をしているか" },
  { scene: "時間を忘れて没頭していた瞬間" },
  { scene: "つい口を出したくなった場面" },
];

export function DailyLogHome() {
  const [mode, setMode] = useState<LogMode>("short");
  const [themes, setThemes] = useState<ObservationTheme[]>(FALLBACK_THEMES);

  useEffect(() => {
    const analysis = loadInitialAnalysis();
    if (analysis?.observationThemes?.length) {
      setThemes(analysis.observationThemes);
    }
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">今日の観察</h1>
        <p className="text-sm text-muted leading-relaxed">
          あなたの価値は、普段の出来事の中に隠れています。今日は次の場面があったか、覚えていたら残してください。
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-1 text-sm font-medium">いま観察している場面</h2>
        <p className="mb-4 text-xs text-muted">
          回答から見えてきたことから。当てはまらなくても大丈夫です。
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed">
          {themes.map((item, i) => (
            <li key={i}>{item.scene}</li>
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
          詳しく書くほど、あなたの中で繰り返されている傾向が見つけやすくなります。どちらでも続けられます。
        </p>
      </section>

      <label className="block">
        <span className="sr-only">今日の観察</span>
        <textarea
          readOnly
          rows={mode === "diary" ? 8 : 4}
          placeholder={
            mode === "diary"
              ? "今日あったことを、場面が思い出せる程度に書いてください"
              : "今日、印象に残ったことを一行で"
          }
          className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-relaxed placeholder:text-muted/70"
          defaultValue={
            mode === "diary"
              ? "午後の会議で、結論が曖昧なまま終わりそうになったので、論点だけ箇条書きにしてチャットに置いた。自分は前に立ちたくないけど、放置する方がつらかった。"
              : ""
          }
        />
      </label>

      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-accent py-4 text-sm font-medium text-white"
      >
        残す
      </button>

      <p className="mt-8 text-center text-xs text-muted">
        <Link href="/discovery" className="underline">
          見えてきたことを見る
        </Link>
      </p>
    </>
  );
}
