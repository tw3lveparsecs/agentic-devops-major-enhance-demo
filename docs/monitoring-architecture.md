# Monitoring Architecture - Imperial Supply Hub

## Overview

This document describes the monitoring and observability infrastructure for the Imperial Supply Hub e-commerce platform deployed on Azure. The infrastructure uses Azure Verified Modules (AVM) and Infrastructure as Code (Bicep) to provision comprehensive monitoring capabilities.

## Architecture Components

### 1. Log Analytics Workspace

**Resource**: `law-imperial-supply-{environment}`

**Purpose**: Centralized log aggregation and analytics platform

**Configuration**:
- **Retention Period**: 30 days (configurable 30-730 days)
- **Pricing Tier**: PerGB2018 (pay-as-you-go based on data ingestion)
- **Location**: Same as resource group
- **AVM Module**: `br/public:avm/res/operational-insights/workspace:0.12.0`

**Capabilities**:
- Stores all application logs, performance metrics, and telemetry data
- Provides query interface using Kusto Query Language (KQL)
- Enables correlation of data across multiple Azure services
- Supports alerting and dashboards

### 2. Application Insights

**Resource**: `appi-imperial-supply-{environment}`

**Purpose**: Application Performance Monitoring (APM) and user analytics

**Configuration**:
- **Application Type**: Web application
- **Workspace Integration**: Linked to Log Analytics workspace
- **Sampling Rate**: 100% (all telemetry captured initially)
- **Location**: Same as resource group
- **AVM Module**: `br/public:avm/res/insights/component:0.7.0`

**Capabilities**:
- Real-time application performance monitoring
- Exception and error tracking
- User behavior analytics and session tracking
- Request and dependency monitoring
- Custom event tracking
- Performance counter collection
- Distributed tracing across microservices

**Integration**: Linked to Azure Static Web App via `linkedApplicationInsightsResourceId` parameter

### 3. Action Groups

**Resource**: `ag-imperial-supply-{environment}`

**Purpose**: Alert notification routing and action execution

**Configuration**:
- **Location**: Global (action groups are global resources)
- **Group Short Name**: `Imperial{env}` (max 12 characters)
- **AVM Module**: `br/public:avm/res/insights/action-group:0.8.0`

**Notification Channels**:
- **Email**: Configurable email addresses for alert notifications
- **SMS**: Mobile phone notifications for critical alerts
- **Webhook**: HTTP endpoints for integration with external systems (e.g., PagerDuty, Slack)

**Features**:
- Common alert schema for consistent notification format
- Support for multiple notification types simultaneously
- Role-based access control (RBAC) integration

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Static Web App (React)                      │
│                  (Imperial Supply Hub Frontend)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Application Insights SDK
                             │ (Telemetry, Logs, Metrics)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Insights                         │
│              appi-imperial-supply-{environment}                 │
│                                                                  │
│  • Performance Metrics    • Custom Events                       │
│  • Page Views            • User Sessions                        │
│  • Exceptions            • Dependencies                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Workspace Integration
                             │ (All telemetry forwarded)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Log Analytics Workspace                        │
│               law-imperial-supply-{environment}                 │
│                                                                  │
│  • Centralized Log Storage (30-day retention)                  │
│  • KQL Query Interface                                         │
│  • Cross-service Correlation                                   │
│  • Long-term Analytics                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Query & Alert Rules
                             │ (Future Phase)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Action Groups                             │
│               ag-imperial-supply-{environment}                  │
│                                                                  │
│  Notifications:                                                 │
│  • Email → Operations Team                                     │
│  • SMS → On-call Engineer                                      │
│  • Webhook → Incident Management System                        │
└─────────────────────────────────────────────────────────────────┘
```

## Security Considerations

### Secrets Management

**Application Insights Connection String**:
- Marked as `@secure()` in Bicep outputs
- Used by frontend application to send telemetry
- Should be stored in Azure Key Vault or environment variables
- Never committed to source control

### Access Control

**Role-Based Access Control (RBAC)**:
- **Log Analytics Workspace**:
  - Log Analytics Reader: Query logs and metrics
  - Log Analytics Contributor: Manage workspace configuration
  
- **Application Insights**:
  - Application Insights Component Contributor: Full management access
  - Monitoring Reader: Read telemetry data

- **Action Groups**:
  - Monitoring Contributor: Manage alert rules and action groups

### Data Retention and Privacy

- **Personal Data**: Ensure telemetry doesn't capture sensitive user information
- **Retention Policy**: 30 days by default, compliant with data retention policies
- **Data Residency**: All data stored in the same region as the resource group

## Deployment

### Prerequisites

- Azure subscription with Contributor or Owner role
- Bicep CLI version 0.20.0 or higher
- Azure CLI version 2.50.0 or higher
- Resource group created in target region

### Deployment Commands

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription <subscription-id>

# Create resource group (if not exists)
az group create --name rg-imperial-supply-dev --location eastus

# Deploy infrastructure
az deployment group create \
  --resource-group rg-imperial-supply-dev \
  --template-file main.bicep \
  --parameters main.bicepparam

# Retrieve Application Insights connection string
az deployment group show \
  --resource-group rg-imperial-supply-dev \
  --name <deployment-name> \
  --query properties.outputs.applicationInsightsConnectionString.value
```

### Configuration Parameters

**main.bicepparam** configurable parameters:

```bicep
// Monitoring parameters
param environmentName = 'dev'              // Environment: dev, staging, prod
param logAnalyticsRetentionDays = 30       // Data retention: 30-730 days
param logAnalyticsSku = 'PerGB2018'        // Pricing tier
param appInsightsSamplingPercentage = 100  // Telemetry sampling: 0-100%

// Alert configuration
param alertEmailAddresses = [              // Email notifications
  'ops-team@example.com'
]
param alertSmsNumbers = [                  // SMS notifications (critical)
  {
    countryCode: '1'
    phoneNumber: '5551234567'
  }
]
param alertWebhookUrls = [                 // Webhook integrations
  'https://hooks.slack.com/services/...'
]
```

## Monitoring Capabilities

### Out-of-the-Box Metrics

**Static Web App Metrics**:
- HTTP request count and duration
- HTTP status code distribution (2xx, 4xx, 5xx)
- Bandwidth usage
- Geographic distribution of users

**Application Insights Auto-Collection**:
- Page view count and duration
- AJAX call performance
- Browser exceptions
- User and session counts
- Device and browser information

### Custom Telemetry (Future Implementation)

**Business Metrics**:
- Product views and cart additions
- Checkout completion rate
- Imperial credit transactions
- User authentication success/failure

**Performance Metrics**:
- Component render times
- API response times
- Cache hit rates

## Alert Rules (Future Phase)

### Recommended Alerts

**Availability Alerts**:
- Static Web App HTTP 5xx errors > 1% of requests
- Application Insights availability test failures

**Performance Alerts**:
- Page load time > 3 seconds (95th percentile)
- API response time > 500ms (95th percentile)

**Business Alerts**:
- Checkout failure rate > 5%
- Zero transactions in last hour (during business hours)

**Infrastructure Alerts**:
- Log Analytics workspace near quota limit
- Application Insights throttling detected

## Cost Optimization

### Log Analytics

**Cost Drivers**:
- Data ingestion (per GB)
- Data retention beyond 30 days

**Optimization Strategies**:
- Review and filter unnecessary log sources
- Use sampling for high-volume telemetry
- Archive old logs to Azure Storage (cheaper long-term storage)

### Application Insights

**Cost Drivers**:
- Telemetry volume
- Availability tests (if configured)

**Optimization Strategies**:
- Adjust sampling percentage based on traffic
- Filter out noisy telemetry (e.g., health check endpoints)
- Use adaptive sampling in production

**Estimated Costs** (example for dev environment):
- Log Analytics: ~$2-5/day for typical web app
- Application Insights: Included in Log Analytics cost
- Action Groups: Free (notifications may have carrier charges for SMS)

## Querying and Analysis

### Sample KQL Queries

**Error Rate by Hour**:
```kql
requests
| where timestamp > ago(24h)
| summarize 
    Total = count(),
    Failures = countif(success == false)
    by bin(timestamp, 1h)
| extend ErrorRate = (Failures * 100.0) / Total
| project timestamp, ErrorRate
| render timechart
```

**Top 10 Slowest Pages**:
```kql
pageViews
| where timestamp > ago(7d)
| summarize 
    AvgDuration = avg(duration),
    Count = count()
    by name
| top 10 by AvgDuration desc
```

**User Session Analysis**:
```kql
pageViews
| where timestamp > ago(1d)
| summarize 
    PageCount = count(),
    UniqueUsers = dcount(user_Id)
    by bin(timestamp, 1h)
| render timechart
```

## Integration with Frontend Application

### JavaScript SDK Configuration

**Installation**:
```bash
npm install @microsoft/applicationinsights-web
```

**Configuration** (src/monitoring/appInsights.ts):
```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    correlationHeaderExcludedDomains: ['*.queue.core.windows.net']
  }
});

appInsights.loadAppInsights();
appInsights.trackPageView();

export default appInsights;
```

## Compliance and Governance

### Tags

All monitoring resources are tagged with:
- `Application`: Imperial-Supply-Hub
- `Environment`: {environmentName}
- `Component`: Monitoring/Alerting
- `ManagedBy`: Bicep

### Naming Conventions

- Log Analytics Workspace: `law-imperial-supply-{environment}`
- Application Insights: `appi-imperial-supply-{environment}`
- Action Group: `ag-imperial-supply-{environment}`

## Next Steps (Future Phases)

1. **Phase 2**: Implement custom telemetry for business metrics
2. **Phase 3**: Create comprehensive alert rules for availability, performance, and business KPIs
3. **Phase 4**: Build operational dashboards in Azure Portal or Grafana
4. **Phase 5**: Implement automated incident response workflows
5. **Phase 6**: Set up continuous export to Azure Storage for long-term analytics
6. **Phase 7**: Integrate with Azure Monitor workbooks for advanced visualizations

## References

- [Azure Verified Modules (AVM)](https://aka.ms/AVM)
- [Azure Monitor Documentation](https://docs.microsoft.com/azure/azure-monitor/)
- [Application Insights Documentation](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Log Analytics Documentation](https://docs.microsoft.com/azure/azure-monitor/logs/log-analytics-overview)
- [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/data-explorer/kusto/query/)
- [Azure Monitor Pricing](https://azure.microsoft.com/pricing/details/monitor/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-08  
**Author**: GitHub Copilot  
**Status**: Initial Release
