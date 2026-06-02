import type { InitialAnalysisResult } from "@/lib/types";

type DiscoveryResultProps = {
  result: InitialAnalysisResult;
  /** エクスポート・スクリーンショット向けに少し大きく表示 */
  variant?: "default" | "capture";
};

export function DiscoveryResult({
  result,
  variant = "default",
}: DiscoveryResultProps) {
  const capture = variant === "capture";
  const { discoveryCandidates, contradictionPoints, observationThemes } =
    result;

  return (
    <div className={capture ? "space-y-12 text-[15px] leading-relaxed" : "space-y-10"}>
      <section>
        <h2 className={`mb-1 font-medium ${capture ? "text-xl" : "text-lg"}`}>
          発見候補
        </h2>
        <p className="mb-5 text-sm text-muted">
          複数の回答に共通して見えたことです。まだ仮説なので、これからの記録で本当に繰り返されるのか一緒に見ていきます。
        </p>
        <ul className="space-y-5">
          {discoveryCandidates.map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <h3 className="mb-3 font-medium">{item.title}</h3>
              <p className="mb-2 text-sm">
                <span className="text-muted">見えてきたこと：</span>
                {item.evidence}
              </p>
              <p className="text-sm">
                <span className="text-muted">仮説：</span>
                {item.hypothesis}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={`mb-1 font-medium ${capture ? "text-xl" : "text-lg"}`}>
          まだ分からないこと
        </h2>
        <p className="mb-5 text-sm text-muted">
          一見ぶつかる回答の組み合わせです。このギャップは、これからの記録で確かめていきます。
        </p>
        <ul className="space-y-4">
          {contradictionPoints.map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-dashed border-border bg-accent-soft/50 p-5"
            >
              <p className="mb-2 text-sm">{item.description}</p>
              <p className="text-sm text-muted">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={`mb-1 font-medium ${capture ? "text-xl" : "text-lg"}`}>
          観察テーマ
        </h2>
        <p className="mb-5 text-sm text-muted">
          今後7日間、次の場面が現れたら覚えておいてください。
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          {observationThemes.map((item, i) => (
            <li key={i}>{item.scene}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
