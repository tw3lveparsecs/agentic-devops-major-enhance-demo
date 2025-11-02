#!/bin/bash
set -e

echo "Setting up Awesome Copilot MCP Server environment..."

dotnet --version

WORKSPACE_ROOT="/workspaces/agentic-devops-major-enhance-demo"

if [ ! -d "${WORKSPACE_ROOT}/awesome-copilot" ]; then
    echo "Cloning awesome-copilot MCP samples..."
    git clone https://github.com/microsoft/mcp-dotnet-samples.git /tmp/mcp-dotnet-samples
    cp -r /tmp/mcp-dotnet-samples/awesome-copilot "${WORKSPACE_ROOT}/"
    rm -rf /tmp/mcp-dotnet-samples
fi

if [ -d "${WORKSPACE_ROOT}/awesome-copilot/.vscode" ]; then
    echo "Setting up MCP configuration..."
    mkdir -p "${WORKSPACE_ROOT}/.vscode"
    if [ -f "${WORKSPACE_ROOT}/awesome-copilot/.vscode/mcp.http.local.json" ]; then
        cp "${WORKSPACE_ROOT}/awesome-copilot/.vscode/mcp.http.local.json" \
           "${WORKSPACE_ROOT}/.vscode/mcp.json"
    fi
fi

if [ -d "${WORKSPACE_ROOT}/awesome-copilot" ]; then
    echo "Restoring .NET dependencies..."
    cd "${WORKSPACE_ROOT}/awesome-copilot"
    dotnet restore
    cd "${WORKSPACE_ROOT}"
fi

echo "Setup complete! MCP environment ready."
