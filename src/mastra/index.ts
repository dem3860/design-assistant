import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { designAssistantAgent } from "./agents/designAssistantAgent";
import { dbDesignWorkflow } from "./workflows/dbDesignWorkflow";

export const mastra = new Mastra({
  agents: { designAssistantAgent },
  workflows: { dbDesignWorkflow },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
});
