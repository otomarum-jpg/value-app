import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <header className="mb-12 pt-8">
        <h1 className="mb-4 text-2xl font-medium leading-snug">
          取り柄がないのではなく、
          <br />
          気づいていないだけかもしれない
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          22の質問と、その後の記録から、あなたの中で繰り返されていることを一緒に観察します。診断や点数付けはしません。
        </p>
      </header>

      <div className="space-y-3">
        <Link
          href="/interview"
          className="block w-full rounded-xl bg-accent py-4 text-center text-sm font-medium text-white"
        >
          はじめる（ゲスト）
        </Link>
        <button
          type="button"
          disabled
          className="block w-full rounded-xl border border-border py-4 text-center text-sm text-muted"
        >
          ログイン（準備中）
        </button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <p className="mt-10 text-center">
          <Link
            href="/dev/interview-quick"
            className="text-xs text-muted underline"
          >
            開発: 22問入力済みで分析まで試す
          </Link>
        </p>
      )}
    </PageShell>
  );
}
