# Application Insights Integration Guide

## Overview

The Imperial Supply Hub application integrates Azure Application Insights for comprehensive monitoring, telemetry collection, and performance analytics.

## Configuration

### Environment Variables

The application requires the following environment variables to be configured:

```bash
# Application Insights Configuration
VITE_APPINSIGHTS_CONNECTION_STRING=<your-connection-string>

# Application Configuration (Optional)
VITE_APP_VERSION=0.0.0
VITE_BUILD_NUMBER=local
VITE_ENVIRONMENT=development
```

### Getting the Connection String

1. Navigate to the Azure Portal
2. Open your Application Insights resource (`appi-imperial-supply-{environment}`)
3. Go to **Overview** section
4. Copy the **Connection String** (not the Instrumentation Key)

### Local Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual Application Insights connection string:
   ```bash
   VITE_APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=xxxxx;IngestionEndpoint=https://xxxxx.applicationinsights.azure.com/
   ```

3. Configure optional application metadata:
   ```bash
   VITE_APP_VERSION=1.0.0
   VITE_BUILD_NUMBER=123
   VITE_ENVIRONMENT=development
   ```

### CI/CD Pipeline Configuration

Add the following environment variables to your CI/CD pipeline (GitHub Actions, Azure DevOps, etc.):

- `VITE_APPINSIGHTS_CONNECTION_STRING`: Connection string from Azure Application Insights
- `VITE_APP_VERSION`: Application version (e.g., from package.json)
- `VITE_BUILD_NUMBER`: Build/pipeline number
- `VITE_ENVIRONMENT`: Environment name (development, staging, production)

## Features

### Automatic Telemetry Collection

The Application Insights SDK automatically collects:

- **Page Views**: Every page navigation and visit
- **User Sessions**: User session tracking and analytics
- **Performance Metrics**: Page load times, resource timing
- **AJAX/Fetch Calls**: Automatic dependency tracking
- **Exceptions**: Unhandled JavaScript errors
- **Click Analytics**: User interaction tracking

### Custom Properties

All telemetry events include the following custom properties:

- `appVersion`: Application version from environment
- `buildNumber`: Build number from CI/CD pipeline
- `environment`: Deployment environment (dev, staging, prod)
- `userRole`: User role (default: 'anonymous')

### PII Scrubbing

The integration includes automatic PII (Personally Identifiable Information) scrubbing for:

- Passwords
- API keys and tokens
- Email addresses
- Phone numbers
- Credit card numbers
- Social Security Numbers (SSN)
- Any sensitive query parameters

### Manual Event Tracking

Use the following helper functions for custom telemetry:

```typescript
import { trackEvent, trackException, trackTrace } from './lib/applicationInsights';

// Track custom events
trackEvent('UserPurchase', { productId: '123', amount: 99.99 });

// Track exceptions
try {
  // your code
} catch (error) {
  trackException(error as Error, 3); // Severity: 0-4
}

// Track traces/logs
trackTrace('User completed checkout', 1, { orderId: '456' });
```

## Monitoring

### Live Metrics

View real-time telemetry in Azure Portal:

1. Open your Application Insights resource
2. Navigate to **Live Metrics** (under Investigate)
3. Monitor live requests, dependencies, and exceptions

### Analytics

Query telemetry data using Kusto Query Language (KQL):

1. Open your Application Insights resource
2. Navigate to **Logs** (under Monitoring)
3. Write KQL queries to analyze data

Example queries:

```kql
// Page views by environment
pageViews
| where customDimensions.environment == "production"
| summarize count() by name

// Exceptions in last 24 hours
exceptions
| where timestamp > ago(24h)
| summarize count() by type, outerMessage

// Custom events
customEvents
| where name == "UserPurchase"
| summarize totalRevenue = sum(todouble(customDimensions.amount))
```

## Troubleshooting

### No Data in Application Insights

1. **Check Connection String**: Ensure `VITE_APPINSIGHTS_CONNECTION_STRING` is set correctly
2. **Check Browser Console**: Look for Application Insights initialization messages
3. **Verify Network**: Check browser DevTools Network tab for requests to `*.applicationinsights.azure.com`
4. **Check Environment**: The SDK skips initialization if connection string contains the placeholder key

### PII Data Appearing in Logs

If sensitive data is being logged:

1. Review custom event properties being sent
2. Update PII scrubbing patterns in `src/lib/applicationInsights.ts`
3. Add additional sensitive field patterns to the `sensitivePatterns` array

## Architecture

The Application Insights integration consists of:

- **`/src/lib/applicationInsights.ts`**: Core SDK initialization and configuration
- **`/src/main.tsx`**: Initialization call before React app mounts
- **`/.env.example`**: Environment variable template
- **Plugins**:
  - React Plugin: React-specific tracking and router integration
  - Click Analytics Plugin: User interaction and click tracking

## Security

- All sensitive data is scrubbed before being sent to Azure
- The `.env` file is gitignored to prevent credential leakage
- Connection strings should be stored in CI/CD secrets, not in code
- PII scrubbing patterns should be regularly reviewed and updated

## Performance Impact

The Application Insights SDK has minimal performance impact:

- Asynchronous telemetry sending (non-blocking)
- Automatic batching of telemetry events
- Configurable sampling rates (currently 100%)
- Lazy loading of dependencies

## References

- [Application Insights JavaScript SDK Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript)
- [Monitoring Architecture Documentation](./monitoring-architecture.md)
- [Application Insights React Plugin](https://github.com/microsoft/applicationinsights-react-js)
