"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DiscoveryResult } from "@/components/discovery/DiscoveryResult";
import { loadInitialAnalysis } from "@/lib/interview-storage";
import type { InitialAnalysisResult } from "@/lib/types";

export function DiscoveryView() {
  const router = useRouter();
  const [result, setResult] = useState<InitialAnalysisResult | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const data = loadInitialAnalysis();
    if (!data) {
      setMissing(true);
      return;
    }
    setResult(data);
  }, []);

  if (missing) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-muted">分析結果が見つかりませんでした</p>
        <button
          type="button"
          onClick={() => router.push("/interview")}
          className="text-sm text-accent underline"
        >
          インタビューからやり直す
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <p className="text-center text-sm text-muted">読み込み中…</p>
    );
  }

  return <DiscoveryResult result={result} />;
}
