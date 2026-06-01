# 価値発見アプリ

本人も気づいていない価値を、インタビューと記録から一緒に観察するアプリ。

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000 を開く。

## 初回分析 API のテスト（22問スキップ）

インタビューを毎回答えずに、固定のダミー22問で `POST /api/analyze/initial` を試せます。

### ブラウザ（開発時のみ）

1. `npm run dev` で起動
2. http://localhost:3000/dev/analyze-test を開く
3. 「ダミーデータで分析を実行」を押す

結果はその場でプレビューでき、「発見画面で確認」で通常フローと同様に `/discovery` へ遷移できます。

### CLI（開発サーバー起動中）

```bash
# ターミナル1
npm run dev

# ターミナル2
npm run test:analyze
```

別URLに向ける場合: `ANALYZE_TEST_URL=http://localhost:3000/api/analyze/initial npm run test:analyze`

ダミー回答の中身は `src/lib/fixtures/dummy-interview-answers.json` を編集してください。

## MVP フロー（実装済み骨組み）

1. `/` — トップ（ゲストで開始）
2. `/interview` — 初回インタビュー（22問・自由記述）
3. `/interview/analyzing` — 分析中
4. `/discovery` — 発見候補・矛盾ポイント・観察テーマ

## 環境変数

`.env.example` を `.env.local` にコピーし、`ANTHROPIC_API_KEY` に [Anthropic Console](https://console.anthropic.com/) で発行したキーを設定してください。

```bash
cp .env.example .env.local
# .env.local を編集後、開発サーバーを再起動
npm run dev
```

- `ANTHROPIC_API_KEY` — **必須**。未設定のまま分析するとエラーになります
- `ANTHROPIC_MODEL` — 任意（既定: `claude-sonnet-4-6`。構造化 JSON 出力に対応したモデルのみ指定可）

## 技術

Next.js / TypeScript / Tailwind CSS（予定: Supabase, Vercel）

設計思想は `CLAUDE.md` を参照。
