import { createTool } from "@mastra/core";
import { z } from "zod";

export const formatDbMarkdownTool = createTool({
  id: "formatDbMarkdown",
  description: "LLMが出したDB設計テキストをMarkdownとして整形するツール",
  inputSchema: z.object({
    raw: z.string().describe("LLMがそのまま出力したDB設計テキスト"),
  }),
  outputSchema: z.object({
    schemaMarkdown: z.string().describe("整形済みMarkdownテキスト"),
  }),
  execute: async ({ context }) => {
    const trimmed = context.raw.trim();
    return { schemaMarkdown: trimmed };
  },
});
