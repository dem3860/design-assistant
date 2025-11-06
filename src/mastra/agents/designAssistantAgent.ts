import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { google } from "../models";

export const designAssistantAgent = new Agent({
  name: "design-assistant",
  instructions: `
あなたはソフトウェア設計を支援するプロフェッショナルなアシスタントです。

サポート対象:
1. **データベース設計** — ER図(Mermaid)とSQL DDLを生成
2. **アーキテクチャ設計** — システム構成図とMarkdownドキュメントを生成
3. **API設計** — OpenAPI仕様とエンドポイント定義を生成
4. **UI/UX設計** — 画面遷移図とコンポーネント構成を生成

出力方針:
- 構造的かつ視覚的にわかりやすい設計ドキュメントを生成
- Mermaid記法で図を描画
- ベストプラクティスに基づいた提案を行う
- 実装可能なレベルの詳細を含める
`,
  model: google("gemini-2.0-flash"),
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});
