"use client";

import { useState } from "react";
import type { DiscoveryCandidate, InitialAnalysisResult } from "@/lib/types";

type DiscoveryResultProps = {
  result: InitialAnalysisResult;
  /** エクスポート・スクリーンショット向けに少し大きく表示 */
  variant?: "default" | "capture";
};

function DiscoveryCandidateCard({
  item,
  capture,
}: {
  item: DiscoveryCandidate;
  capture: boolean;
}) {
  const [expanded, setExpanded] = useState(capture);

  return (
    <li className="rounded-2xl border border-border bg-white p-5">
      <h3 className="mb-3 font-medium">{item.title}</h3>
      <p className="text-sm">
        <span className="text-muted">仮説：</span>
        {item.hypothesis}
      </p>
      {expanded ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm">
            <span className="text-muted">見えてきたこと：</span>
            {item.evidence}
          </p>
          {!capture && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-3 text-xs text-muted"
            >
              ▲ 閉じる
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 text-xs text-muted"
        >
          ▼ なぜそう思った？
        </button>
      )}
    </li>
  );
}

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
            <DiscoveryCandidateCard key={i} item={item} capture={capture} />
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
          今後7日間、次の問いを頭の片隅に置いておいてください。
        </p>
        <ul className="space-y-3">
          {observationThemes.map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-border bg-white px-4 py-3 text-sm"
            >
              {item.scene}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
