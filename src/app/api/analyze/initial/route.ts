import { NextResponse } from "next/server";
import type { InterviewAnswer } from "@/lib/types";
import {
  buildInitialAnalysisUserPrompt,
  INITIAL_ANALYSIS_SYSTEM_PROMPT,
} from "@/lib/analysis-prompt";
import {
  createAnthropicClient,
  getAnthropicApiKey,
  getAnthropicModel,
} from "@/lib/anthropic";
import { INITIAL_ANALYSIS_JSON_SCHEMA } from "@/lib/initial-analysis-schema";
import { parseInitialAnalysisResult } from "@/lib/parse-initial-analysis";

export async function POST(request: Request) {
  let answers: InterviewAnswer[];

  try {
    const body = await request.json();
    answers = body.answers;
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "answers が必要です" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  if (!getAnthropicApiKey()) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY が設定されていません。プロジェクト直下の .env.local に API キーを設定し、開発サーバーを再起動してください。",
      },
      { status: 503 },
    );
  }

  const client = createAnthropicClient();
  if (!client) {
    return NextResponse.json(
      { error: "Claude API クライアントの初期化に失敗しました" },
      { status: 500 },
    );
  }

  try {
    const message = await client.messages.create({
      model: getAnthropicModel(),
      max_tokens: 4096,
      system: INITIAL_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildInitialAnalysisUserPrompt(answers),
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: INITIAL_ANALYSIS_JSON_SCHEMA,
        },
      },
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const text =
      textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "分析結果が空でした" },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("Failed to parse Claude JSON output", text.slice(0, 500));
      return NextResponse.json(
        { error: "分析結果の解析に失敗しました" },
        { status: 502 },
      );
    }

    const result = parseInitialAnalysisResult(parsed);
    if (!result) {
      console.error("Invalid analysis shape", parsed);
      return NextResponse.json(
        { error: "分析結果の形式が不正です" },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Anthropic API error", e);
    let message = "分析に失敗しました。しばらくしてから再度お試しください。";
    if (e instanceof Error) {
      if (e.message.includes("401")) {
        message =
          "API キーが無効です。ANTHROPIC_API_KEY を確認してください。";
      } else if (e.message.includes("does not support output format")) {
        message = `モデル「${getAnthropicModel()}」は構造化出力に対応していません。.env.local の ANTHROPIC_MODEL を claude-sonnet-4-6 などに変更するか、未設定にして既定モデルを使ってください。`;
      }
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
