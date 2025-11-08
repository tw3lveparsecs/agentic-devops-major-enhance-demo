# Awesome Copilot MCP Dev Environment

This Codespace is configured to run the **Awesome Copilot MCP Server** along with your development environment.

## 🎯 What's Included

- **.NET 9 SDK** - Latest .NET development tools
- **C# Dev Kit** - VS Code extension for C# development
- **GitHub Copilot** - AI-powered coding assistance
- **Awesome Copilot MCP Server** - Custom Copilot instructions and prompts support
- **Azure CLI & Azure Developer CLI** - Cloud deployment tools

## 🚀 Quick Start

### 1. Start the MCP Server

Run the following command to start the .NET application:

```bash
dotnet run --project ./awesome-copilot/src/McpSamples.AwesomeCopilot.HybridApp -- --http
```

Then open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and:

```
MCP: List Servers → awesome-copilot → Start Server
```

> [!NOTE]
> If the server fails to start, open the command palette and select **Developer: Reload Window**, then try again.

### 2. Configure MCP Connection

The post-create script automatically sets up the MCP configuration for HTTP mode. The configuration file is copied to `.vscode/mcp.json` automatically.

### 3. Use MCP Features

In Copilot Chat, use the search prompt to find custom instructions:

```
/mcp.awesome-copilot.get_search_prompt
```

Enter keywords to search for relevant chatmodes, instructions, and prompts from the awesome-copilot repository.

## 📚 Available Tools

The awesome-copilot MCP server provides:

- **search_instructions** - Search custom instructions by keyword
- **load_instruction** - Load specific custom instructions
- **get_search_prompt** - Get a search prompt template

## 🔗 Port Mappings

- **5250** - MCP Server (Local HTTP)

## 📖 Documentation

- [Awesome Copilot Repository](https://github.com/microsoft/mcp-dotnet-samples/tree/main/awesome-copilot)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## ⚙️ Environment Setup

All necessary dependencies are installed during Codespace creation via the post-create script:

- .NET 9 SDK
- GitHub CLI
- Azure CLI
- Azure Developer CLI

## 🐛 Troubleshooting

### MCP Server Won't Start

1. Verify .NET is installed: `dotnet --version`
2. Restore dependencies: `cd awesome-copilot && dotnet restore`
3. Check the output panel in VS Code for errors

### Connection Issues

1. Ensure port 5250 is available
2. Check the MCP configuration in `.vscode/mcp.json`
3. Restart the MCP server from the Command Palette

### Missing Files

If the awesome-copilot directory wasn't cloned, run:

```bash
git clone https://github.com/microsoft/mcp-dotnet-samples.git /tmp/mcp
cp -r /tmp/mcp/awesome-copilot .
```

## 🎓 Learn More

- Check out the awesome-copilot repository for example prompts, instructions, and chat modes
- Reference the MCP protocol documentation for building custom tools
- Explore the sample app to understand how to integrate MCP with your project
