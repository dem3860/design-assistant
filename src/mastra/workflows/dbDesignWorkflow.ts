import { createWorkflow, createStep } from "@mastra/core";
import { z } from "zod";
import { designAssistantAgent } from "../agents/designAssistantAgent";
import { formatDbMarkdownTool } from "../tools/formatDbMarkdownTool";
import { formatErDiagramTool } from "../tools/formatErDiagramTool";

const formatDbMarkdownStep = createStep(formatDbMarkdownTool);
const formatErDiagramStep = createStep(formatErDiagramTool);

const generateDbDesignStep = createStep({
  id: "generateDbDesign",
  inputSchema: z.object({
    requirement: z.string(),
  }),
  outputSchema: z.object({
    raw: z.string(),
  }),
  execute: async ({ inputData }) => {
    const prompt = `
あなたは優秀なソフトウェア設計アシスタントです。
以下の要件に基づいて、適切なDBテーブル設計を提案してください。

- 各テーブルのカラム名・データ型・制約・説明をMarkdown表で出力すること
- 最低2つ以上のテーブルを設計すること
- 外部キー関係があれば明示すること
- 出力は必ず以下の形式に従うこと：

## テーブル設計

### テーブル1
| カラム名 | 型 | 制約 | 説明 |
|-----------|----|------|------|
| ... | ... | ... | ... |

---
要件：
${inputData.requirement}
`;

    const res = await designAssistantAgent.generate(prompt);
    return { raw: res.text };
  },
});

export const dbDesignWorkflow = createWorkflow({
  id: "dbDesignWorkflow",
  description: "自然言語の要件からDB設計をMarkdownで生成するワークフロー",
  inputSchema: z.object({
    requirement: z
      .string()
      .describe("設計対象の要件（例：ユーザーと注文管理）"),
  }),
  outputSchema: z.object({
    erDiagram: z.string().describe("生成されたER図(Mermaid形式)"),
    schemaMarkdown: z.string().describe("テーブル定義(Markdown形式)"),
  }),
})
  .then(generateDbDesignStep)
  .then(formatDbMarkdownStep)
  .then(
    createStep({
      id: "generate-er-diagram",
      inputSchema: z.object({ schemaMarkdown: z.string() }),
      outputSchema: z.object({
        rawErText: z.string(),
        schemaMarkdown: z.string(),
      }),
      execute: async ({ inputData }) => {
        const prompt = `
あなたはソフトウェア設計の専門家です。
以下のMarkdownテーブル定義をもとに、Mermaid形式のER図を正確に生成してください。

🚨 **厳守すべきルール**
1. 出力は \\\`\\\`\\\`mermaid から始まり \\\`\\\`\\\` で終わる完全なコードブロックにする
2. 各テーブル間は必ず1行以上の空行を挿入する
3. 型定義には **括弧()やカンマ(,)** を使わない（例: DECIMAL(10,2) → DECIMAL）
4. VARCHAR(255) のような型は **VARCHAR** のみに省略
5. 外部キーはリレーション記号で正確に記述する
6. 出力には **余分な説明文やコメントを一切含めない**
7. Mermaid構文エラーを起こさないよう構文を厳密に確認する

✅ 正しい例：
\\\`\\\`\\\`mermaid
erDiagram
    users {
        INT id PK
        VARCHAR name
        VARCHAR email
    }

    orders {
        INT id PK
        INT user_id FK
        DECIMAL total
    }

    users ||--o{ orders : places
\\\`\\\`\\\`

Markdownテーブル定義:
${inputData.schemaMarkdown}
`;

        const res = await designAssistantAgent.generate(prompt);
        return {
          rawErText: res.text,
          schemaMarkdown: inputData.schemaMarkdown,
        };
      },
    })
  )
  .then(formatErDiagramStep)
  .commit();
