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
    # echo "Restoring .NET dependencies..."
    echo "Running .NET application..."
    cd "${WORKSPACE_ROOT}/awesome-copilot"
    dotnet run --project ./src/McpSamples.AwesomeCopilot.HybridApp -- --http
    # dotnet restore || echo "Warning: Some dependencies could not be restored (expected if shared project is not available)"
    cd "${WORKSPACE_ROOT}"
fi

echo "Setup complete! MCP environment ready."
