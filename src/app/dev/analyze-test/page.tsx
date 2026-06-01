import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalyzeTestPanel } from "@/components/dev/AnalyzeTestPanel";
import { PageShell } from "@/components/ui/PageShell";

export default function DevAnalyzeTestPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <PageShell backHref="/" backLabel="トップ">
      <header className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Dev only
        </p>
        <h1 className="mb-2 text-xl font-medium">初回分析 API テスト</h1>
        <p className="text-sm text-muted leading-relaxed">
          インタビューをスキップし、固定のダミー22問回答で Claude
          分析を試せます。
        </p>
      </header>
      <AnalyzeTestPanel />
      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/dev/interview-quick" className="underline">
          本番フローで1クリック分析はこちら
        </Link>
      </p>
    </PageShell>
  );
}
