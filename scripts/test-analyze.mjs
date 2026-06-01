/**
 * 初回分析 API をダミーデータで直接叩く（開発サーバー起動中に実行）
 *
 *   npm run dev          # 別ターミナル
 *   npm run test:analyze
 *
 * 環境変数:
 *   ANALYZE_TEST_URL — 既定 http://localhost:3000/api/analyze/initial
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const answersPath = join(
  __dirname,
  "../src/lib/fixtures/dummy-interview-answers.json",
);
const url =
  process.env.ANALYZE_TEST_URL ?? "http://localhost:3000/api/analyze/initial";

const answers = JSON.parse(readFileSync(answersPath, "utf8"));

console.log(`POST ${url}`);
console.log(`answers: ${answers.length} 件\n`);

const started = Date.now();

let res;
try {
  res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
} catch (e) {
  console.error(
    "接続できませんでした。`npm run dev` で開発サーバーが起動しているか確認してください。",
  );
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}

const elapsed = Date.now() - started;
const text = await res.text();

let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}

console.log(`status: ${res.status} (${elapsed}ms)\n`);

if (!res.ok) {
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(body, null, 2));
