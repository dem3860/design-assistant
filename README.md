````markdown
# Design Assistant

Mastra と Next.js を使用した設計お助けエージェントです。データベース設計、アーキテクチャ設計、API 設計などを AI がサポートします。

## 機能

### 対応している設計タイプ

1. **データベース設計** (`database`)

   - ER 図の生成(Mermaid 記法)
   - テーブル定義(SQL DDL)
   - インデックス設計の提案

2. **アーキテクチャ設計** (`architecture`)

   - システム構成図(Mermaid 記法)
   - 技術スタックの提案
   - 設計ドキュメント(Markdown)

3. **API 設計** (`api`)

   - REST API エンドポイント定義
   - OpenAPI 仕様書
   - API 設計ドキュメント

4. **UI/UX 設計** (`ui`)

   - 画面遷移図(Mermaid 記法)
   - コンポーネント構成
   - デザインガイドライン

5. **システム設計全般** (`system`)
   - 要件に応じた総合的な設計提案

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

### API 経由で使用

#### GET リクエスト例

```bash
curl http://localhost:3000/api/test-mastra
```

サンプルの DB 設計を取得できます。

#### POST リクエスト例

**データベース設計:**

```bash
curl -X POST http://localhost:3000/api/test-mastra \
  -H "Content-Type: application/json" \
  -d '{
    "designType": "database",
    "requirements": "ECサイトのユーザー、商品、注文を管理するシステム"
  }'
```

**アーキテクチャ設計:**

```bash
curl -X POST http://localhost:3000/api/test-mastra \
  -H "Content-Type: application/json" \
  -d '{
    "designType": "architecture",
    "requirements": "リアルタイムチャットアプリケーション、1万人同時接続対応"
  }'
```

**API 設計:**

```bash
curl -X POST http://localhost:3000/api/test-mastra \
  -H "Content-Type: application/json" \
  -d '{
    "designType": "api",
    "requirements": "タスク管理アプリのREST API"
  }'
```

**UI 設計:**

```bash
curl -X POST http://localhost:3000/api/test-mastra \
  -H "Content-Type: application/json" \
  -d '{
    "designType": "ui",
    "requirements": "社内管理画面、ダッシュボード中心"
  }'
```

### レスポンス形式

```json
{
  "designType": "database",
  "text": "生成された設計内容(Mermaid図、Markdown、SQLなど)",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

## プロジェクト構造

```
src/mastra/
├── index.ts                 # Mastra設定
├── agents/
│   └── design-assistant-agent.ts  # 設計アシスタントエージェント
├── models/
│   └── index.ts             # LLMモデル設定
└── tools/
    └── design-assistant-tool.ts   # 設計ツール定義
        ├── databaseDesignTool     # DB設計ツール
        ├── architectureDesignTool # アーキテクチャ設計ツール
        ├── apiDesignTool          # API設計ツール
        ├── uiDesignTool          # UI設計ツール
        └── designAssistantTool    # 統合設計ツール

app/api/
└── test-mastra/
    └── route.ts             # APIエンドポイント
```

## 技術スタック

- **フレームワーク**: Next.js 15
- **AI フレームワーク**: Mastra
- **LLM**: Google Gemini 2.0 Flash
- **言語**: TypeScript
- **パッケージマネージャー**: pnpm

## 次のステップ

- [ ] フロントエンド UI の実装
- [ ] Mermaid 図のプレビュー機能
- [ ] 設計履歴の保存機能
- [ ] エクスポート機能(PDF、Markdown)
- [ ] より詳細な設計オプション

## License

MIT
````
