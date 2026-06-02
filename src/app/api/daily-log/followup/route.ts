import { NextResponse } from "next/server";
import {
  createAnthropicClient,
  getAnthropicApiKey,
  getAnthropicModel,
} from "@/lib/anthropic";

const SYSTEM_PROMPT = `あなたは「価値発見」アプリの伴走者です。
ユーザーが今日の出来事を記録しました。その内容を読んで、ユーザーがもう少し具体的に思い出せるための質問を1つだけ返してください。

ルール：
- 質問は1つだけ
- アドバイスしない
- 診断しない
- 「あなたは〇〇な人です」と言わない
- 「それはあなたの強みです」と言わない
- 長文にしない（30文字以内が理想）
- ユーザーの記録内容に沿った質問にする
- 「ない」「特になかった」という記録にも、そこから掘り下げる質問を返す

良い例：
「その時、自分は自然に何をしていましたか？」
「少し気持ちが動いたのはどの瞬間でしたか？」
「相手はあなたに何を求めていたと思いますか？」
「それは普段からよくあることですか？」
「なぜそれが気になったと思いますか？」

出力：質問文のみ。説明・前置き・補足は不要。`;

export async function POST(request: Request) {
  let content: string;

  try {
    const body = await request.json();
    content = body.content;
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "content が必要です" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  if (!getAnthropicApiKey()) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY が設定されていません" },
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
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `今日の記録：\n${content.trim()}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const question =
      textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    if (!question) {
      return NextResponse.json({ error: "質問の生成に失敗しました" }, { status: 502 });
    }

    return NextResponse.json({ question });
  } catch (e) {
    console.error("Anthropic API error", e);
    return NextResponse.json(
      { error: "質問の取得に失敗しました。しばらくしてから再度お試しください。" },
      { status: 502 },
    );
  }
}
