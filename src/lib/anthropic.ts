import Anthropic from "@anthropic-ai/sdk";

/** Structured output (output_config.format) 対応モデル */
const DEFAULT_MODEL = "claude-sonnet-4-6";

export function getAnthropicApiKey(): string | undefined {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  return key || undefined;
}

export function getAnthropicModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

export function createAnthropicClient(): Anthropic | null {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}
