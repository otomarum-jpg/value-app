import type { InitialAnalysisResult } from "./types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** API レスポンスを検証し、型安全な分析結果にする */
export function parseInitialAnalysisResult(
  raw: unknown,
): InitialAnalysisResult | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;

  if (
    !Array.isArray(data.discoveryCandidates) ||
    data.discoveryCandidates.length !== 3
  ) {
    return null;
  }

  if (
    !Array.isArray(data.contradictionPoints) ||
    data.contradictionPoints.length < 1 ||
    data.contradictionPoints.length > 2
  ) {
    return null;
  }

  if (
    !Array.isArray(data.observationThemes) ||
    data.observationThemes.length !== 3
  ) {
    return null;
  }

  const discoveryCandidates = data.discoveryCandidates.map((item) => {
    if (!item || typeof item !== "object") return null;
    const c = item as Record<string, unknown>;
    if (
      !isNonEmptyString(c.title) ||
      !isNonEmptyString(c.evidence) ||
      !isNonEmptyString(c.hypothesis)
    ) {
      return null;
    }
    return {
      title: c.title.trim(),
      evidence: c.evidence.trim(),
      hypothesis: c.hypothesis.trim(),
    };
  });

  if (discoveryCandidates.some((c) => c === null)) return null;

  const contradictionPoints = data.contradictionPoints.map((item) => {
    if (!item || typeof item !== "object") return null;
    const c = item as Record<string, unknown>;
    if (!isNonEmptyString(c.description) || !isNonEmptyString(c.note)) {
      return null;
    }
    return {
      description: c.description.trim(),
      note: c.note.trim(),
    };
  });

  if (contradictionPoints.some((c) => c === null)) return null;

  const observationThemes = data.observationThemes.map((item) => {
    if (!item || typeof item !== "object") return null;
    const c = item as Record<string, unknown>;
    if (!isNonEmptyString(c.scene)) return null;
    return { scene: c.scene.trim() };
  });

  if (observationThemes.some((t) => t === null)) return null;

  return {
    discoveryCandidates: discoveryCandidates as InitialAnalysisResult["discoveryCandidates"],
    contradictionPoints: contradictionPoints as InitialAnalysisResult["contradictionPoints"],
    observationThemes: observationThemes as InitialAnalysisResult["observationThemes"],
  };
}
