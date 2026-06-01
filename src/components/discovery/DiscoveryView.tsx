"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DiscoveryResult } from "@/components/discovery/DiscoveryResult";
import { loadInitialAnalysis } from "@/lib/interview-storage";
import type { InitialAnalysisResult } from "@/lib/types";

export function DiscoveryView() {
  const router = useRouter();
  const [result, setResult] = useState<InitialAnalysisResult | null>(null);

  useEffect(() => {
    const data = loadInitialAnalysis();
    if (!data) {
      router.replace("/interview");
      return;
    }
    setResult(data);
  }, [router]);

  if (!result) {
    return (
      <p className="text-center text-sm text-muted">読み込み中…</p>
    );
  }

  return <DiscoveryResult result={result} />;
}
