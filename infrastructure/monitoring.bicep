// Monitoring infrastructure - Log Analytics and Application Insights
// Using Azure Verified Modules (AVM)

@description('Location for all resources')
param location string = resourceGroup().location

@description('Environment name (e.g., dev, staging, prod)')
param environmentName string

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

@description('Tags to apply to all resources')
param tags object = {}

// Log Analytics Workspace using AVM module
module logAnalyticsWorkspace 'br/public:avm/res/operational-insights/workspace:0.12.0' = {
  name: 'logAnalyticsWorkspace-${environmentName}'
  params: {
    name: 'law-imperial-supply-${environmentName}'
    location: location
    skuName: logAnalyticsSku
    dataRetention: logAnalyticsRetentionDays
    tags: union(tags, {
      Environment: environmentName
      Component: 'Monitoring'
      ManagedBy: 'Bicep'
    })
  }
}

// Application Insights using AVM module
module applicationInsights 'br/public:avm/res/insights/component:0.7.0' = {
  name: 'applicationInsights-${environmentName}'
  params: {
    name: 'appi-imperial-supply-${environmentName}'
    location: location
    kind: 'web'
    applicationType: 'web'
    workspaceResourceId: logAnalyticsWorkspace.outputs.resourceId
    samplingPercentage: appInsightsSamplingPercentage
    tags: union(tags, {
      Environment: environmentName
      Component: 'Monitoring'
      ManagedBy: 'Bicep'
    })
  }
}

// Outputs
@description('Log Analytics Workspace Resource ID')
output logAnalyticsWorkspaceId string = logAnalyticsWorkspace.outputs.resourceId

@description('Log Analytics Workspace Name')
output logAnalyticsWorkspaceName string = logAnalyticsWorkspace.outputs.name

@description('Application Insights Resource ID')
output applicationInsightsId string = applicationInsights.outputs.resourceId

@description('Application Insights Name')
output applicationInsightsName string = applicationInsights.outputs.name

@description('Application Insights Instrumentation Key')
output applicationInsightsInstrumentationKey string = applicationInsights.outputs.instrumentationKey

@description('Application Insights Connection String')
@secure()
output applicationInsightsConnectionString string = applicationInsights.outputs.connectionString
