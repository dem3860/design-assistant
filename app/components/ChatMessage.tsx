"use client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mermaidDiagram?: string;
  schemaMarkdown?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  onShowDiagram: (diagram: string, markdown?: string) => void;
}

export default function ChatMessage({
  message,
  onShowDiagram,
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
        }`}
      >
        <div className="flex items-start gap-2">
          <span className="text-lg">
            {message.role === "user" ? "👤" : "🤖"}
          </span>
          <div className="flex-1">
            <pre className="whitespace-pre-wrap text-sm font-sans">
              {message.content}
            </pre>
            {/* ER図があれば表示ボタンを追加 */}
            {message.mermaidDiagram && (
              <button
                onClick={() =>
                  onShowDiagram(message.mermaidDiagram!, message.schemaMarkdown)
                }
                className="mt-2 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                📊 図を表示
              </button>
            )}
          </div>
        </div>
        <div className="text-xs opacity-70 mt-1 text-right">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export type { Message };
