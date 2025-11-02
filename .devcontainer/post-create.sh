#!/bin/bash
set -e

echo "🚀 Setting up Awesome Copilot MCP Server environment..."

# Update package manager
apt-get update

# Install required dependencies
echo "📦 Installing dependencies..."
apt-get install -y \
    git \
    curl \
    wget \
    apt-transport-https \
    ca-certificates

# Install Azure CLI
echo "🔧 Installing Azure CLI..."
apt-get install -y azure-cli

# Install Azure Developer CLI
echo "🔧 Installing Azure Developer CLI..."
curl -fsSL https://aka.ms/install-azd.sh | bash

# Verify .NET installation
echo "✅ Verifying .NET installation..."
dotnet --version

# Clone the awesome-copilot repository
if [ ! -d "${WORKSPACE_ROOT}/awesome-copilot" ]; then
    echo "📥 Cloning awesome-copilot MCP samples..."
    git clone https://github.com/microsoft/mcp-dotnet-samples.git /tmp/mcp-dotnet-samples
    cp -r /tmp/mcp-dotnet-samples/awesome-copilot "${WORKSPACE_ROOT}/" || true
    rm -rf /tmp/mcp-dotnet-samples
fi

# Set up the MCP configuration
if [ -d "${WORKSPACE_ROOT}/awesome-copilot/.vscode" ]; then
    echo "📝 Setting up MCP configuration..."
    mkdir -p "${WORKSPACE_ROOT}/.vscode"
    # Use HTTP local configuration by default
    if [ -f "${WORKSPACE_ROOT}/awesome-copilot/.vscode/mcp.http.local.json" ]; then
        cp "${WORKSPACE_ROOT}/awesome-copilot/.vscode/mcp.http.local.json" \
           "${WORKSPACE_ROOT}/.vscode/mcp.json"
    fi
fi

# Restore dependencies for the MCP server
if [ -d "${WORKSPACE_ROOT}/awesome-copilot" ]; then
    echo "📚 Restoring .NET dependencies for MCP server..."
    cd "${WORKSPACE_ROOT}/awesome-copilot"
    dotnet restore || true
    cd "${WORKSPACE_ROOT}"
fi

echo "✨ Setup complete! Your Awesome Copilot MCP environment is ready."
echo ""
echo "📋 Next steps:"
echo "1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)"
echo "2. Search for 'MCP: List Servers'"
echo "3. Select 'awesome-copilot' and click 'Start Server'"
echo "4. You can then use MCP features in Copilot Chat"
