import Link from "next/link";
import { DiscoveryView } from "@/components/discovery/DiscoveryView";
import { PageShell } from "@/components/ui/PageShell";

export default function DiscoveryPage() {
  return (
    <PageShell backHref="/interview" backLabel="インタビュー">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">初回の整理</h1>
        <p className="text-sm text-muted leading-relaxed">
          まだ答えではありません。気になる共通点と、これから観察してほしい場面です。
        </p>
      </header>
      <DiscoveryView />
      <footer className="mt-12 border-t border-border pt-8">
        <Link
          href="/"
          className="block w-full rounded-xl border border-border py-3 text-center text-sm font-medium"
        >
          トップへ（ホームは準備中）
        </Link>
      </footer>
    </PageShell>
  );
}
