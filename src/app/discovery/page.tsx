import Link from "next/link";
import { DiscoveryView } from "@/components/discovery/DiscoveryView";
import { PageShell } from "@/components/ui/PageShell";

export default function DiscoveryPage() {
  return (
    <PageShell backHref="/interview" backLabel="インタビュー">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">あなたについて気になったこと</h1>
        <p className="text-sm text-muted leading-relaxed">
          まだ答えではありません。気になる共通点と、これから一緒に観察していく場面です。
        </p>
      </header>
      <DiscoveryView />
      <footer className="mt-12 border-t border-border pt-8 space-y-3">
        <Link
          href="/home"
          className="block w-full rounded-xl bg-accent py-3 text-center text-sm font-medium text-white"
        >
          観察をはじめる
        </Link>
        <Link
          href="/"
          className="block w-full rounded-xl border border-border py-3 text-center text-sm font-medium"
        >
          トップへ
        </Link>
        {process.env.NODE_ENV === "development" && (
          <Link
            href="/dev/export"
            className="block text-center text-xs text-muted underline"
          >
            ChatGPT用にエクスポート（開発）
          </Link>
        )}
      </footer>
    </PageShell>
  );
}
