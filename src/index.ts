import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Bash } from "just-bash";
import { Laminar } from "@lmnr-ai/lmnr";

Laminar.initialize({
  projectApiKey: process.env.LMNR_PROJECT_API_KEY,
});

const bash = new Bash({
  executionLimits: {
    maxCommandCount: 10000,
  },
});

const server = new Server(
  {
    name: "just-bash-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "execute_bash",
        description: "Execute bash commands in an isolated sandboxed environment using just-bash",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "The bash command to execute",
            },
          },
          required: ["command"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "execute_bash") {
    const command = args?.command as string;

    if (!command) {
      return {
        content: [
          {
            type: "text",
            text: "Error: command is required",
          },
        ],
        isError: true,
      };
    }

    try {
      const result = await bash.exec(command);
      return {
        content: [
          {
            type: "text",
            text: result.stdout || result.stderr || "",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("just-bash-mcp server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
