import { InterviewForm } from "@/components/interview/InterviewForm";
import { PageShell } from "@/components/ui/PageShell";

export default function InterviewPage() {
  return (
    <PageShell backHref="/" backLabel="トップ">
      <h1 className="mb-2 text-lg font-medium">初回インタビュー</h1>
      <p className="mb-8 text-sm text-muted">
        正解はありません。思いつくことをそのまま書いてください。
      </p>
      <InterviewForm />
    </PageShell>
  );
}
