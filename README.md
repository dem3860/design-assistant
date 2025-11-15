# DB 設計アシスタント

Mastra と Next.js を使用したデータベース設計支援アプリケーションです。自然言語の要件から ER 図とテーブル定義を自動生成します。

## 機能

### 主な機能

1. **チャット形式の UI**

   - 会話形式で設計要件を入力
   - AI との対話を通じて設計を洗練

2. **ER 図の自動生成**

   - Mermaid 形式の ER 図を生成
   - リアルタイムプレビュー表示
   - テーブル間のリレーションを視覚化

3. **テーブル定義の生成**

   - Markdown 形式のテーブル定義
   - カラム名、型、制約、説明を含む
   - 見やすい表形式で表示

4. **コピー機能**
   - Mermaid コードと Markdown を簡単にコピー
   - 他のドキュメントに貼り付けて使用可能

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

環境変数の設定:

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## 使い方

### Web アプリケーション

1. ブラウザで `http://localhost:3000` を開く
2. 左側のチャット欄に設計要件を入力
   - 例: "ユーザーが商品を購入できる EC サイトの DB 設計"
3. 送信すると AI が ER 図とテーブル定義を生成
4. 右側のプレビュー欄で結果を確認
5. 必要に応じてコピーして利用

### API 経由で使用

**データベース設計 API:**

```bash
curl -X POST http://localhost:3000/api/db-design \
  -H "Content-Type: application/json" \
  -d '{
    "requirement": "ユーザーが商品を購入できるECサイト。ユーザー、商品、注文の3つのテーブルを想定"
  }'
```

**レスポンス形式:**

````json
{
  "success": true,
  "message": "DB設計ワークフローが正常に完了しました。",
  "erDiagram": "```mermaid\nerDiagram\n...\n```",
  "schemaMarkdown": "## テーブル設計\n...",
  "steps": [...]
}
````

## プロジェクト構造

```
app/
├── page.tsx                          # メインページ
├── components/
│   ├── ChatMessage.tsx              # チャットメッセージ表示
│   ├── ChatInput.tsx                # メッセージ入力フォーム
│   ├── DiagramPreview.tsx           # ER図プレビュー
│   ├── MermaidDiagram.tsx           # Mermaid図レンダリング
│   └── MarkdownRenderer.tsx         # Markdownレンダリング
└── api/
    └── db-design/
        └── route.ts                 # DB設計APIエンドポイント

src/mastra/
├── index.ts                         # Mastra設定
├── agents/
│   └── designAssistantAgent.ts      # 設計アシスタントエージェント
├── models/
│   └── index.ts                     # LLMモデル設定
├── workflows/
│   └── dbDesignWorkflow.ts          # DB設計ワークフロー
└── tools/
    ├── formatDbMarkdownTool.ts      # Markdown整形ツール
    └── formatErDiagramTool.ts       # ER図整形ツール
```

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **AI フレームワーク**: Mastra 0.23.3
- **LLM**: Google Gemini 2.0 Flash
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **図表示**: Mermaid
- **Markdown レンダリング**: react-markdown + remark-gfm
- **パッケージマネージャー**: pnpm

## ワークフローの仕組み

1. **generateDbDesign**: 要件からテーブル設計を生成
2. **formatDbMarkdown**: Markdown 形式を整形
3. **generate-er-diagram**: Mermaid 形式の ER 図を生成
4. **formatErDiagram**: ER 図の構文を整形

各ステップは Mastra のワークフロー機能で自動的に実行されます。
