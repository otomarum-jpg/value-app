import Link from "next/link";
import { notFound } from "next/navigation";
import { InterviewQuickStartPanel } from "@/components/dev/InterviewQuickStartPanel";
import { PageShell } from "@/components/ui/PageShell";

export default function DevInterviewQuickPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <PageShell backHref="/" backLabel="トップ">
      <header className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Dev only
        </p>
        <h1 className="mb-2 text-xl font-medium">インタビュー省略テスト</h1>
        <p className="text-sm text-muted leading-relaxed">
          22問の回答はあらかじめ入力済みです。1クリックで初回分析まで進めます。
        </p>
      </header>
      <InterviewQuickStartPanel />
      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/dev/analyze-test" className="underline">
          API単体のテストはこちら
        </Link>
      </p>
    </PageShell>
  );
}
