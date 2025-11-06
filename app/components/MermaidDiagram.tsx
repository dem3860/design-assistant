"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

export default function MermaidDiagram({
  chart,
  id = "mermaid-diagram",
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !chart) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      themeVariables: {
        primaryColor: "#e0f2fe",
        primaryTextColor: "#1e3a8a",
        primaryBorderColor: "#3b82f6",
        lineColor: "#2563eb",
        secondaryColor: "#ddd6fe",
        tertiaryColor: "#fef3c7",
        background: "#f8fafc",
        mainBkg: "#ffffff",
        textColor: "#1e293b",
        fontSize: "16px",
      },
    });

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        // Clear previous content
        containerRef.current.innerHTML = "";

        // Create a unique ID for this render
        const uniqueId = `${id}-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(uniqueId, chart);
        containerRef.current.innerHTML = svg;

        // SVGの背景を設定して線を見やすくする
        const svgElement = containerRef.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.backgroundColor = "#ffffff";
          svgElement.style.padding = "20px";
          svgElement.style.borderRadius = "8px";
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "不明なエラー";
        containerRef.current.innerHTML = `
          <div class="text-red-500 p-4 border border-red-300 rounded bg-red-50">
            <p class="font-bold mb-2">⚠️ 図の描画エラー</p>
            <p class="text-sm mb-3">Mermaid構文にエラーがあります:</p>
            <pre class="text-xs bg-red-100 p-2 rounded overflow-auto">${errorMessage}</pre>
            <details class="mt-3">
              <summary class="cursor-pointer text-sm font-medium">生のMermaidコードを表示</summary>
              <pre class="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-60">${chart}</pre>
            </details>
          </div>
        `;
      }
    };

    renderDiagram();
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className="mermaid-container w-full overflow-auto p-6 bg-white rounded-lg border border-gray-300"
    />
  );
}
