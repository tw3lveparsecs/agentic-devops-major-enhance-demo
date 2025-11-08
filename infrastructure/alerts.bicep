// Alert infrastructure - Action Groups and Alert Rules
// Using Azure Verified Modules (AVM)

@description('Location for all resources')
param location string = 'global' // Action groups are global resources

@description('Environment name (e.g., dev, staging, prod)')
param environmentName string

@description('Email addresses for alert notifications')
param alertEmailAddresses array = []

@description('SMS phone numbers for critical alerts (format: country code and number)')
param alertSmsNumbers array = []

@description('Webhook URLs for alert notifications')
param alertWebhookUrls array = []

@description('Tags to apply to all resources')
param tags object = {}

// Email receivers configuration
var emailReceivers = [for (email, i) in alertEmailAddresses: {
  name: 'email-${i}'
  emailAddress: email
  useCommonAlertSchema: true
}]

// SMS receivers configuration
var smsReceivers = [for (sms, i) in alertSmsNumbers: {
  name: 'sms-${i}'
  countryCode: sms.countryCode
  phoneNumber: sms.phoneNumber
}]

// Webhook receivers configuration
var webhookReceivers = [for (webhook, i) in alertWebhookUrls: {
  name: 'webhook-${i}'
  serviceUri: webhook
  useCommonAlertSchema: true
}]

// Action Group for monitoring alerts using AVM module
module actionGroup 'br/public:avm/res/insights/action-group:0.8.0' = {
  name: 'actionGroup-${environmentName}'
  params: {
    name: 'ag-imperial-supply-${environmentName}'
    location: location
    groupShortName: 'Imperial${take(environmentName, 5)}' // Max 12 characters
    enabled: true
    emailReceivers: emailReceivers
    smsReceivers: smsReceivers
    webhookReceivers: webhookReceivers
    tags: union(tags, {
      Environment: environmentName
      Component: 'Alerting'
      ManagedBy: 'Bicep'
    })
  }
}

// Outputs
@description('Action Group Resource ID')
output actionGroupId string = actionGroup.outputs.resourceId

@description('Action Group Name')
output actionGroupName string = actionGroup.outputs.name
