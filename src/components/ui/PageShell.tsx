import Link from "next/link";

type PageShellProps = {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function PageShell({
  children,
  backHref,
  backLabel = "戻る",
}: PageShellProps) {
  return (
    <div className="mx-auto min-h-screen max-w-lg px-5 py-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-6 inline-block text-sm text-muted hover:text-foreground"
        >
          ← {backLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
