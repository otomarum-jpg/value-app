"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { seedScreenshotSession } from "@/lib/screenshot-seed";

export function ScreenshotGuidePanel() {
  const router = useRouter();

  function openDiscoveryWithSample() {
    seedScreenshotSession();
    router.push("/discovery");
  }

  function openHomeWithSample() {
    seedScreenshotSession();
    router.push("/home");
  }

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-border bg-white px-4 py-3 text-sm leading-relaxed text-muted">
        撮影用のページは本番と同じURLです。下の「本番画面を開く」から進むと、Dev
        only の文言やダミー注意は出ません。
      </p>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">トップ</h2>
        <Link
          href="/"
          className="block w-full rounded-xl border border-border bg-white py-3 text-center text-sm font-medium"
        >
          本番のトップ（/）
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">回答から見えてきたこと（結果）</h2>
        <button
          type="button"
          onClick={openDiscoveryWithSample}
          className="block w-full rounded-xl bg-accent py-3 text-sm font-medium text-white"
        >
          サンプル結果を入れて本番画面を開く（/discovery）
        </button>
        <p className="text-xs text-muted leading-relaxed">
          Claude API は使いません。見た目は本番と同じです。実際のAPI結果で撮る場合は、下の「APIで発見」へ。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">ホーム（デイリーログ）</h2>
        <button
          type="button"
          onClick={openHomeWithSample}
          className="block w-full rounded-xl border border-border bg-white py-3 text-center text-sm font-medium"
        >
          サンプルを入れて本番ホームを開く（/home）
        </button>
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-sm font-medium">APIで実データの結果を撮る</h2>
        <Link
          href="/dev/interview-quick"
          className="block w-full rounded-xl border border-dashed border-border py-3 text-center text-sm text-muted"
        >
          22問入力済み → 発見（開発ページ経由）
        </Link>
        <p className="text-xs text-muted leading-relaxed">
          完了後は自動で /discovery に遷移します。その画面を撮影してください。
        </p>
      </section>
    </div>
  );
}
