// src/tools/formatErDiagramTool.ts
import { createTool } from "@mastra/core";
import { z } from "zod";

export const formatErDiagramTool = createTool({
  id: "format-er-diagram-tool",
  description: "Mermaid ER図を整形し、常に正しく描画できる構文に修正します。",
  inputSchema: z.object({
    rawErText: z.string().describe("AIが生成した生のMermaid ER図テキスト"),
    schemaMarkdown: z.string().describe("DB設計結果のMarkdown文字列"),
  }),
  outputSchema: z.object({
    erDiagram: z.string().describe("整形済みで完全なMermaid構文のER図"),
    schemaMarkdown: z.string(),
  }),
  execute: async ({ context }) => {
    const text = context.rawErText.trim();

    const fixed = text
      .replace(/\([^)]+\)/g, "")
      .replace(/\b([A-Z]+)_[0-9_]+\b/g, "$1")
      .replace(/\}\s*(?=[a-zA-Z0-9_]+\s*\{)/g, "}\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return { erDiagram: fixed, schemaMarkdown: context.schemaMarkdown };
  },
});
