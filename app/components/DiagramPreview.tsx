"use client";

import { useState } from "react";
import MermaidDiagram from "./MermaidDiagram";
import MarkdownRenderer from "./MarkdownRenderer";

interface DiagramPreviewProps {
  diagram: string | null;
  markdown: string | null;
}

type TabType = "diagram" | "table";

// 空状態の表示コンポーネント
const EmptyState = ({ type }: { type: "diagram" | "table" }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-600">
    <svg
      className="w-24 h-24 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <p className="text-center font-medium">
      DB設計を依頼すると
      <br />
      {type === "diagram"
        ? "ER図がここに表示されます"
        : "回答がここに表示されます"}
    </p>
  </div>
);

export default function DiagramPreview({
  diagram,
  markdown,
}: DiagramPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("diagram");

  return (
    <div className="flex flex-col h-full">
      {/* タブボタン */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("diagram")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "diagram"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📊 ER図
        </button>
        <button
          onClick={() => setActiveTab("table")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "table"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📝 テーブル定義
        </button>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "diagram" ? (
          diagram ? (
            <div className="space-y-4">
              <MermaidDiagram chart={diagram} />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `\`\`\`mermaid\n${diagram}\n\`\`\``
                  )
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                📋 Mermaidコードをコピー
              </button>
            </div>
          ) : (
            <EmptyState type="diagram" />
          )
        ) : markdown ? (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <MarkdownRenderer content={markdown} />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(markdown)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              📋 Markdownをコピー
            </button>
          </div>
        ) : (
          <EmptyState type="table" />
        )}
      </div>
    </div>
  );
}
