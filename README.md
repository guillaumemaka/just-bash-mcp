# just-bash-mcp

A secure, isolated filesystem and bash MCP (Model Context Protocol) server powered by [just-bash](https://github.com/guillaumemaka/just-bash). This server enables AI assistants and tools to safely execute bash commands in a sandboxed environment with configurable timeouts and resource limits.

## Features

- **Sandboxed Execution**: Commands run in an isolated environment using just-bash
- **MCP Protocol**: Fully compliant with the Model Context Protocol specification
- **Configurable Timeouts**: Set custom timeout values for long-running commands
- **Secure by Default**: Minimal permissions and isolated filesystem access
- **Easy Integration**: Works with any MCP-compatible client including Claude Desktop, VS Code, and more

## Installation

```bash
bun install
```

## Usage

### Development Mode

Run the MCP client to test the server:

```bash
bun run dev
```

### Building

Build the TypeScript to JavaScript:

```bash
bun run build
```

### Package

Create a distributable package:

```bash
bun run package
```

### VS Code MCP Installation

Install the server as a VS Code MCP tool:

```bash
bun run vscode:mcp:install
```

### Testing

Run tests:

```bash
bun test
```

## MCP Tools

### execute_bash

Execute bash commands in an isolated sandboxed environment.

**Parameters:**
- `command` (string, required): The bash command to execute
- `timeout` (number, optional): Timeout in milliseconds (default: 30000)

**Example:**

```json
{
  "name": "execute_bash",
  "arguments": {
    "command": "ls -la",
    "timeout": 5000
  }
}
```

## License

MIT License - see [LICENSE](LICENSE) for details.
