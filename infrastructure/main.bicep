// Deploys an Azure Static Web App for a React/Vite app using Azure Verified Modules (AVM)
// Includes comprehensive monitoring with Application Insights and Log Analytics

param location string = resourceGroup().location
param staticWebAppName string
param sku string = 'Free'

@description('Environment name (e.g., dev, staging, prod)')
param environmentName string = 'dev'

@description('Log Analytics workspace retention in days')
@minValue(30)
@maxValue(730)
param logAnalyticsRetentionDays int = 30

@description('Log Analytics workspace pricing tier')
@allowed([
  'Free'
  'PerGB2018'
  'PerNode'
  'Premium'
  'Standalone'
  'Standard'
])
param logAnalyticsSku string = 'PerGB2018'

@description('Application Insights sampling percentage')
@minValue(0)
@maxValue(100)
param appInsightsSamplingPercentage int = 100

@description('Email addresses for alert notifications')
param alertEmailAddresses array = []

@description('SMS phone numbers for critical alerts')
param alertSmsNumbers array = []

@description('Webhook URLs for alert notifications')
param alertWebhookUrls array = []

@description('Tags to apply to all resources')
param tags object = {
  Application: 'Imperial-Supply-Hub'
  ManagedBy: 'Bicep'
}

// Deploy monitoring infrastructure (Log Analytics and Application Insights)
module monitoring './monitoring.bicep' = {
  name: 'monitoring-deployment'
  params: {
    location: location
    environmentName: environmentName
    logAnalyticsRetentionDays: logAnalyticsRetentionDays
    logAnalyticsSku: logAnalyticsSku
    appInsightsSamplingPercentage: appInsightsSamplingPercentage
    tags: tags
  }
}

// Deploy alert infrastructure (Action Groups)
module alerts './alerts.bicep' = {
  name: 'alerts-deployment'
  params: {
    environmentName: environmentName
    alertEmailAddresses: alertEmailAddresses
    alertSmsNumbers: alertSmsNumbers
    alertWebhookUrls: alertWebhookUrls
    tags: tags
  }
}

// Use AVM Static Web App module version 0.9.3 with Application Insights integration
module staticWebApp 'br/public:avm/res/web/static-site:0.9.3' = {
  name: 'staticWebApp'
  params: {
    name: '${staticWebAppName}-${environmentName}'
    location: location
    sku: sku
    tags: tags
    appSettings: {
      APPLICATIONINSIGHTS_CONNECTION_STRING: monitoring.outputs.applicationInsightsConnectionString
    }
  }
}

// Outputs
output staticWebAppName string = staticWebApp.outputs.name
output staticWebAppResourceId string = staticWebApp.outputs.resourceId
output staticWebAppDefaultHostname string = staticWebApp.outputs.defaultHostname

// Monitoring outputs
output logAnalyticsWorkspaceId string = monitoring.outputs.logAnalyticsWorkspaceId
output logAnalyticsWorkspaceName string = monitoring.outputs.logAnalyticsWorkspaceName
output applicationInsightsId string = monitoring.outputs.applicationInsightsId
output applicationInsightsName string = monitoring.outputs.applicationInsightsName
output applicationInsightsInstrumentationKey string = monitoring.outputs.applicationInsightsInstrumentationKey

@description('Application Insights Connection String (secure)')
@secure()
output applicationInsightsConnectionString string = monitoring.outputs.applicationInsightsConnectionString

// Alerting outputs
output actionGroupId string = alerts.outputs.actionGroupId
output actionGroupName string = alerts.outputs.actionGroupName
