/**
 * Claude structured output 用 JSON Schema。
 * Anthropic API は array の minItems / maxItems に 0 または 1 以外を指定できないため、
 * 件数（3件・1〜2件など）はプロンプトと parseInitialAnalysisResult で担保する。
 */
export const INITIAL_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "discoveryCandidates",
    "contradictionPoints",
    "observationThemes",
  ],
  properties: {
    discoveryCandidates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "evidence", "hypothesis"],
        properties: {
          title: { type: "string" },
          evidence: { type: "string" },
          hypothesis: { type: "string" },
        },
      },
    },
    contradictionPoints: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["description", "note"],
        properties: {
          description: { type: "string" },
          note: { type: "string" },
        },
      },
    },
    observationThemes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["scene"],
        properties: {
          scene: { type: "string" },
        },
      },
    },
  },
} as const;
