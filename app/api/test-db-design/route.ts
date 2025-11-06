// src/app/api/test-db-design/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/src/mastra";

interface DbDesignInput {
  requirement: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DbDesignInput = await request.json();

    if (!body.requirement) {
      return NextResponse.json(
        { error: "パラメータ 'requirement' が不足しています。" },
        { status: 400 }
      );
    }

    const workflow = mastra.getWorkflow("dbDesignWorkflow");
    if (!workflow) {
      return NextResponse.json(
        { error: "ワークフロー 'dbDesignWorkflow' が見つかりません。" },
        { status: 404 }
      );
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { requirement: body.requirement },
    });

    if (result.status === "success") {
      const { erDiagram, schemaMarkdown } = result.result;
      console.log(erDiagram);

      const stepSummaries = Object.entries(result.steps ?? {}).map(
        ([stepId, step]) => ({
          stepId,
          status: step.status,
          startedAt: step.startedAt,
        })
      );

      return NextResponse.json({
        success: true,
        message: "DB設計ワークフローが正常に完了しました。",
        erDiagram,
        schemaMarkdown,
        steps: stepSummaries,
      });
    }

    const errorMessage =
      "error" in result && result.error?.message
        ? result.error.message
        : "ワークフロー実行中に不明なエラーが発生しました。";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました。";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
