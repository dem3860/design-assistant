import { createWorkflow, createStep } from "@mastra/core";
import { z } from "zod";
import { designAssistantAgent } from "../agents/designAssistantAgent";
import { formatDbMarkdownTool } from "../tools/formatDbMarkdownTool";

// Step 2: Markdown整形ツールをステップ化
const formatDbMarkdownStep = createStep(formatDbMarkdownTool);

// Step 1: LLMにDB設計を生成させるステップ
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
    schemaMarkdown: z.string(),
  }),
})
  .then(generateDbDesignStep)
  .then(formatDbMarkdownStep)
  .commit();
