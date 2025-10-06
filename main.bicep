// Deploys an Azure Static Web App for a React/Vite app using Azure Verified Modules (AVM)
// No monitoring or Application Insights is included per user request

param location string = resourceGroup().location
param staticWebAppName string
param sku string = 'Free'

// Use AVM Static Web App module version 0.9.3 as requested
module staticWebApp 'br/public:avm/res/web/static-site:0.9.3' = {
  name: 'staticWebApp'
  params: {
    name: staticWebAppName
    location: location
    sku: sku
    // No monitoring or app insights
  }
}

// Outputs (if available from the module)
output staticWebAppResourceId string = staticWebApp.outputs.resourceId
output staticWebAppDefaultHostname string = staticWebApp.outputs.defaultHostname
