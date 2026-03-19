import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function main() {
  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", "src/index.ts"],
    env: {
      ...process.env,
    },
  });

  const client = new Client(
    {
      name: "just-bash-mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  console.log("Connected to just-bash-mcp server");

  const tools = await client.request({ method: "tools/list" });
  console.log("Available tools:", JSON.stringify(tools, null, 2));

  const result = await client.request({
    method: "tools/call",
    params: {
      name: "execute_bash",
      arguments: {
        command: "echo 'Hello from just-bash-mcp!'",
      },
    },
  });

  console.log("Result:", JSON.stringify(result, null, 2));

  await client.close();
}

main().catch(console.error);
