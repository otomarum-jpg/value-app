import type { InitialAnalysisResult } from "@/lib/types";

type DiscoveryResultProps = {
  result: InitialAnalysisResult;
};

export function DiscoveryResult({ result }: DiscoveryResultProps) {
  const { discoveryCandidates, contradictionPoints, observationThemes } =
    result;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-1 text-lg font-medium">発見候補</h2>
        <p className="mb-5 text-sm text-muted">
          まだ確定ではありません。これからの記録で、本当に繰り返されるか観察していきます。
        </p>
        <ul className="space-y-5">
          {discoveryCandidates.map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <h3 className="mb-3 font-medium">{item.title}</h3>
              <p className="mb-2 text-sm">
                <span className="text-muted">根拠：</span>
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
        <h2 className="mb-1 text-lg font-medium">矛盾ポイント</h2>
        <p className="mb-5 text-sm text-muted">
          一見ぶつかる回答の組み合わせです。気になるかどうか、これから確認します。
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
        <h2 className="mb-1 text-lg font-medium">観察テーマ</h2>
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
