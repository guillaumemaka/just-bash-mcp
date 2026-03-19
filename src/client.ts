import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      env[key] = value;
    }
  }

  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", "src/index.ts"],
    env,
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

  const tools = await client.request({ method: "tools/list" } as never, {} as never);
  console.log("Available tools:", JSON.stringify(tools, null, 2));

  const result = await client.request(
    { method: "tools/call", params: { name: "execute_bash", arguments: { command: "echo 'Hello from just-bash-mcp!'" } } } as never,
    { method: "tools/call", params: { name: "execute_bash", arguments: { command: "echo 'Hello from just-bash-mcp!'" } } } as never
  );

  console.log("Result:", JSON.stringify(result, null, 2));

  await client.close();
}

main().catch(console.error);
