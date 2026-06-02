import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreenshotGuidePanel } from "@/components/dev/ScreenshotGuidePanel";
import { PageShell } from "@/components/ui/PageShell";

export default function DevScreenshotPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <PageShell backHref="/" backLabel="トップ">
      <header className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Dev only
        </p>
        <h1 className="mb-2 text-xl font-medium">スクリーンショット用</h1>
        <p className="text-sm text-muted leading-relaxed">
          共有用に本番と同じ画面を開きます。省略テストページそのものは撮影しないでください。
        </p>
      </header>
      <ScreenshotGuidePanel />
      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/dev/interview-quick" className="underline">
          インタビュー省略テスト
        </Link>
      </p>
    </PageShell>
  );
}
