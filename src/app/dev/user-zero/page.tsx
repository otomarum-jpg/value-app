import { UserZeroPanel } from "@/components/dev/UserZeroPanel";
import { PageShell } from "@/components/ui/PageShell";
import Link from "next/link";

export default function UserZeroPage() {
  return (
    <PageShell>
      <header className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Dev only
        </p>
        <h1 className="mb-2 text-xl font-medium">ユーザーゼロ検証ログ</h1>
        <p className="text-sm text-muted leading-relaxed">
          今日の使用感を記録してください。7日分が蓄積されます。
        </p>
      </header>
      <UserZeroPanel />
      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/home" className="underline">
          ホームに戻る
        </Link>
      </p>
    </PageShell>
  );
}
