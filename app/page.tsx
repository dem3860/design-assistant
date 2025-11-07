"use client";

import { useState } from "react";
import ChatMessage, { type Message } from "./components/ChatMessage";
import DiagramPreview from "./components/DiagramPreview";
import ChatInput from "./components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState<string | null>(null);
  const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);

  const extractMermaidCode = (text: string): string | null => {
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/;
    const match = text.match(mermaidRegex);
    return match ? match[1].trim() : null;
  };

  const handleShowDiagram = (diagram: string, markdown?: string) => {
    setSelectedDiagram(diagram);
    setSelectedMarkdown(markdown || null);
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/test-db-design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirement: currentInput,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const mermaidCode = extractMermaidCode(data.erDiagram);

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.erDiagram,
          mermaidDiagram: mermaidCode || undefined,
          schemaMarkdown: data.schemaMarkdown,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (mermaidCode) {
          setSelectedDiagram(mermaidCode);
        }
        if (data.schemaMarkdown) {
          setSelectedMarkdown(data.schemaMarkdown);
        }
      } else {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `エラー: ${data.error || "不明なエラーが発生しました"}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `エラー: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  const quickExamples = [
    "ユーザーが商品を購入できるECサイトのDB設計",
    "ブログシステム(記事、コメント、タグ)のDB設計",
    "予約管理システムのDB設計",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col max-w-[1800px]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🗄️ DB設計アシスタント
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            要件を伝えるとER図を自動生成します
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
          {/* Left: Chat Area */}
          <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                💬 会話
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg mb-4">会話を始めましょう</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">例:</p>
                    {quickExamples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(example)}
                        className="block w-full text-left px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onShowDiagram={handleShowDiagram}
                  />
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </div>

          {/* Right: Diagram Display */}
          <div className="flex flex-col bg-white dark:bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                📊 設計プレビュー
              </h2>
            </div>

            <div className="flex-1 overflow-hidden p-4 bg-white">
              <DiagramPreview
                diagram={selectedDiagram}
                markdown={selectedMarkdown}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
