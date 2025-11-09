# Azure Functions API

This folder contains a minimal Azure Function to enable Application Insights integration for the Static Web App.

## Purpose

Azure Static Web Apps require at least one Azure Function to enable backend Application Insights integration. This integration allows the Static Web App to automatically inject the Application Insights connection string and enable telemetry collection.

## Function Endpoints

### Health Check
- **Endpoint**: `/api/health`
- **Method**: GET
- **Auth**: Anonymous
- **Description**: Returns a simple health check response to verify the API is running

**Example Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-09T03:00:00.000Z",
  "environment": "production"
}
```

## Application Insights Integration

With this function deployed, the Static Web App will:
1. Automatically receive the Application Insights connection string via environment variables
2. Enable telemetry collection for both frontend and backend
3. Allow monitoring of:
   - Frontend page views and user interactions
   - Client-side errors and exceptions
   - Performance metrics
   - Custom events and traces

## Frontend Integration

To use Application Insights in your React frontend, install the JavaScript SDK:

```bash
npm install @microsoft/applicationinsights-web
```

Then initialize it in your application:

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
  }
});

appInsights.loadAppInsights();
appInsights.trackPageView();
```

## Local Development

To run the function locally:

```bash
cd api
func start
```

## Deployment

This function is automatically deployed with the Static Web App via the GitHub Actions workflow.
