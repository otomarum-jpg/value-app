"use client";

import { useEffect, useState } from "react";
import { saveDevObservation, loadDevObservations, loadDailyLogs } from "@/lib/interview-storage";
import type { DevObservationLog } from "@/lib/types";

const HASSLE_LABELS: Record<DevObservationLog["felt_hassle"], string> = {
  none: "面倒じゃなかった",
  "a-little": "少し面倒だった",
  yes: "面倒だった",
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function UserZeroPanel() {
  const today = todayStr();
  const [logs, setLogs] = useState<DevObservationLog[]>([]);
  const [saved, setSaved] = useState(false);

  const [opened, setOpened] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [feltHassle, setFeltHassle] = useState<DevObservationLog["felt_hassle"]>("none");
  const [aiAnswered, setAiAnswered] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const all = loadDevObservations();
    setLogs(all);

    // 今日の記録があれば初期値として読み込む
    const todayLog = all.find((l) => l.date === today);
    if (todayLog) {
      setOpened(todayLog.opened);
      setCharCount(todayLog.char_count);
      setFeltHassle(todayLog.felt_hassle);
      setAiAnswered(todayLog.ai_answered);
      setNotes(todayLog.notes);
    } else {
      // 今日書いたデイリーログがあれば文字数を自動集計
      const dailyLogs = loadDailyLogs();
      const todayDailyLogs = dailyLogs.filter((l) => l.created_at.startsWith(today));
      if (todayDailyLogs.length > 0) {
        const total = todayDailyLogs.reduce((sum, l) => sum + l.content.length, 0);
        setCharCount(total);
        setOpened(true);
        const hasAiAnswer = todayDailyLogs.some((l) => l.followup_answer);
        setAiAnswered(hasAiAnswer);
      }
    }
  }, [today]);

  function handleSave() {
    saveDevObservation({
      date: today,
      opened,
      char_count: charCount,
      felt_hassle: feltHassle,
      ai_answered: aiAnswered,
      notes,
    });
    setLogs(loadDevObservations());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const pastLogs = logs.filter((l) => l.date !== today).slice(-6).reverse();
  const todayLog = logs.find((l) => l.date === today);

  return (
    <div className="space-y-8">
      {/* 今日の記録フォーム */}
      <section className="rounded-2xl border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-medium">
          今日（{formatDate(today)}）の観察
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">アプリを開いたか</span>
            <div className="flex gap-2">
              {([true, false] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setOpened(v)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    opened === v
                      ? "border-accent bg-accent-soft font-medium"
                      : "border-border bg-white text-muted"
                  }`}
                >
                  {v ? "開いた" : "開かなかった"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">書いた文字数</span>
            <input
              type="number"
              min={0}
              value={charCount}
              onChange={(e) => setCharCount(Number(e.target.value))}
              className="w-24 rounded-lg border border-border px-3 py-1.5 text-right text-sm"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm">書くのが面倒だったか</span>
            <div className="flex gap-2">
              {(["none", "a-little", "yes"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFeltHassle(v)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                    feltHassle === v
                      ? "border-accent bg-accent-soft font-medium"
                      : "border-border bg-white text-muted"
                  }`}
                >
                  {HASSLE_LABELS[v]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">AI深掘りに答えたか</span>
            <div className="flex gap-2">
              {([true, false] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setAiAnswered(v)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    aiAnswered === v
                      ? "border-accent bg-accent-soft font-medium"
                      : "border-border bg-white text-muted"
                  }`}
                >
                  {v ? "答えた" : "答えなかった"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm">気になったこと・メモ</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="UXで気になったこと、書きたくなった理由・なれなかった理由など"
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm leading-relaxed placeholder:text-muted/70"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-4 w-full rounded-xl bg-accent py-3 text-sm font-medium text-white"
        >
          {saved ? "保存しました" : todayLog ? "上書き保存" : "今日の観察を保存"}
        </button>
      </section>

      {/* 過去ログ一覧 */}
      {pastLogs.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium">過去の観察</h2>
          <ul className="space-y-3">
            {pastLogs.map((log) => (
              <li key={log.date} className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{formatDate(log.date)}</span>
                  <span className={`text-xs ${log.opened ? "text-accent" : "text-muted"}`}>
                    {log.opened ? "開いた" : "開かなかった"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>{log.char_count}文字</span>
                  <span>{HASSLE_LABELS[log.felt_hassle]}</span>
                  <span>AI: {log.ai_answered ? "答えた" : "答えなかった"}</span>
                </div>
                {log.notes && (
                  <p className="mt-2 text-xs leading-relaxed text-foreground/80">{log.notes}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {logs.length === 0 && (
        <p className="text-center text-sm text-muted">
          まだ記録がありません。毎日使用後に記録してください。
        </p>
      )}
    </div>
  );
}
