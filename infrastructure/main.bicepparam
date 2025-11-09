using './main.bicep'

// Static Web App parameters
param staticWebAppName = 'imperial-supply-stapp'
param sku = 'Free'

// Monitoring parameters
param environmentName = 'dev'
param logAnalyticsRetentionDays = 30
param logAnalyticsSku = 'PerGB2018'
param appInsightsSamplingPercentage = 100

// Alert configuration parameters
param alertEmailAddresses = []
param alertSmsNumbers = []
param alertWebhookUrls = []

// Resource tags
param tags = {
  Application: 'Imperial-Supply-Hub'
  Environment: 'Development'
  ManagedBy: 'Bicep'
  Project: 'Agentic-DevOps-Demo'
}
