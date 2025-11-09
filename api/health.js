// Minimal Azure Function to enable Application Insights integration for Static Web App
// This health check endpoint unlocks App Insights telemetry collection
module.exports = async function (context, req) {
  context.log('Health check endpoint called');

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.AZURE_FUNCTIONS_ENVIRONMENT || 'unknown'
    }
  };
};
