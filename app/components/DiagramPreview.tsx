"use client";

import MermaidDiagram from "./MermaidDiagram";
import MarkdownRenderer from "./MarkdownRenderer";

interface DiagramPreviewProps {
  diagram: string | null;
  markdown: string | null;
}

export default function DiagramPreview({
  diagram,
  markdown,
}: DiagramPreviewProps) {
  if (!diagram) {
    return (
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
          ER図がここに表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MermaidDiagram chart={diagram} />
      <button
        onClick={() =>
          navigator.clipboard.writeText(`\`\`\`mermaid\n${diagram}\n\`\`\``)
        }
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        📋 Mermaidコードをコピー
      </button>

      {/* Markdown Schema Display */}
      {markdown && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            📝 テーブル定義
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
            <MarkdownRenderer content={markdown} />
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(markdown)}
            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            📋 Markdownをコピー
          </button>
        </div>
      )}
    </div>
  );
}
