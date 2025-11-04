#!/bin/bash
set -e

echo "Setting up Awesome Copilot MCP Server environment..."

echo "Installing Azure CLI..."
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash || echo "Warning: Azure CLI installation failed or already installed"

echo "Verifying .NET installation..."
dotnet --version

WORKSPACE_ROOT="/workspaces/agentic-devops-major-enhance-demo"

if [ ! -d "${WORKSPACE_ROOT}/awesome-copilot" ]; then
    echo "Cloning awesome-copilot MCP samples..."
    git clone https://github.com/microsoft/mcp-dotnet-samples.git /tmp/mcp-dotnet-samples
    cp -r /tmp/mcp-dotnet-samples/awesome-copilot "${WORKSPACE_ROOT}/"
    cp -r /tmp/mcp-dotnet-samples/shared "${WORKSPACE_ROOT}/"
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

echo "Setup complete! MCP environment ready."
echo "Running the following command to start the awesome-copilot .NET application:"
echo "dotnet run --project ./awesome-copilot/src/McpSamples.AwesomeCopilot.HybridApp -- --http"
echo "Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P) and:"
echo "MCP: List Servers → awesome-copilot → Start Server"
echo "NOTE: If the server fails to start, open the command palette and select 'Developer: Reload Window' and try again."
