import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DiscoveryExportView } from "@/components/dev/DiscoveryExportView";
import { PageShell } from "@/components/ui/PageShell";

type DevExportPageProps = {
  searchParams: Promise<{ clean?: string }>;
};

export default async function DevExportPage({ searchParams }: DevExportPageProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { clean } = await searchParams;

  if (clean === "1") {
    return (
      <Suspense fallback={<p className="p-8 text-sm text-muted">読み込み中…</p>}>
        <DiscoveryExportView />
      </Suspense>
    );
  }

  return (
    <PageShell backHref="/dev/interview-quick" backLabel="省略テスト">
      <header className="mb-8 no-print">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Dev only
        </p>
        <h1 className="mb-2 text-xl font-medium">壁打ち用エクスポート</h1>
        <p className="text-sm text-muted leading-relaxed">
          見えてきたことをスクリーンショットまたはテキストで ChatGPT に渡せます。
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-muted">読み込み中…</p>}>
        <DiscoveryExportView />
      </Suspense>
      <p className="no-print mt-8 text-center text-xs text-muted">
        <Link href="/discovery" className="underline">
          通常の発見画面
        </Link>
      </p>
    </PageShell>
  );
}
