import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { ITelemetryItem } from '@microsoft/applicationinsights-core-js';

let appInsights: ApplicationInsights | null = null;
let reactPlugin: ReactPlugin | null = null;

/**
 * Get the Application Insights instance
 * @returns ApplicationInsights instance or null if not initialized
 */
export function getAppInsights(): ApplicationInsights | null {
  return appInsights;
}

/**
 * Get the React plugin instance
 * @returns ReactPlugin instance or null if not initialized
 */
export function getReactPlugin(): ReactPlugin | null {
  return reactPlugin;
}

/**
 * PII scrubbing telemetry processor
 * Filters sensitive data from telemetry before sending to Azure
 */
function piiScrubbingProcessor(envelope: ITelemetryItem): boolean {
  if (!envelope) {
    return true;
  }

  // List of sensitive field patterns to scrub
  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /apikey/i,
    /api[_-]?key/i,
    /authorization/i,
    /bearer/i,
    /credit[_-]?card/i,
    /ssn/i,
    /social[_-]?security/i,
    /phone/i,
  ];

  // Email regex pattern (more precise than simple string containment)
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Scrub custom properties
  if (envelope.data && envelope.data.baseData && envelope.data.baseData.properties) {
    const properties = envelope.data.baseData.properties;
    for (const key in properties) {
      // Scrub fields matching sensitive patterns
      if (sensitivePatterns.some(pattern => pattern.test(key))) {
        properties[key] = '[REDACTED]';
      }
      // Scrub values that look like emails or tokens
      if (typeof properties[key] === 'string') {
        const value = properties[key];
        
        // Redact email patterns with proper regex
        if (emailPattern.test(value)) {
          properties[key] = '[REDACTED_EMAIL]';
        }
        
        // Redact long alphanumeric strings that might be tokens (64+ chars for better precision)
        // Skip if it looks like a UUID format or contains common safe patterns
        if (
          value.length >= 64 &&
          /^[a-zA-Z0-9_-]+$/.test(value) &&
          !(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) // Not UUID
        ) {
          properties[key] = '[REDACTED_TOKEN]';
        }
      }
    }
  }

  // Scrub URLs with sensitive query parameters
  if (envelope.data && envelope.data.baseData && envelope.data.baseData.url) {
    const url = envelope.data.baseData.url;
    if (typeof url === 'string') {
      try {
        const urlObj = new URL(url);
        sensitivePatterns.forEach(pattern => {
          urlObj.searchParams.forEach((value, key) => {
            if (pattern.test(key)) {
              urlObj.searchParams.set(key, '[REDACTED]');
            }
          });
        });
        envelope.data.baseData.url = urlObj.toString();
      } catch {
        // If URL parsing fails, leave as is
      }
    }
  }

  return true;
}

/**
 * Initialize Application Insights with configuration
 * Should be called before React app mounts
 */
export function initializeAppInsights(): void {
  const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

  // Skip initialization if connection string is not configured
  if (!connectionString || connectionString.includes('00000000-0000-0000-0000-000000000000')) {
    console.warn('Application Insights not configured - skipping initialization');
    return;
  }

  try {
    // Initialize React Plugin
    reactPlugin = new ReactPlugin();

    // Initialize Click Analytics Plugin
    const clickPluginInstance = new ClickAnalyticsPlugin();
    const clickPluginConfig = {
      autoCapture: true,
      dataTags: {
        useDefaultContentNameOrId: true,
      },
    };

    // Create Application Insights instance
    appInsights = new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableCorsCorrelation: true,
        correlationHeaderExcludedDomains: ['*.queue.core.windows.net'],
        autoTrackPageVisitTime: true,
        disableFetchTracking: false,
        enableAjaxErrorStatusText: true,
        extensions: [reactPlugin, clickPluginInstance],
        extensionConfig: {
          [reactPlugin.identifier]: {},
          [clickPluginInstance.identifier]: clickPluginConfig,
        },
      },
    });

    // Load Application Insights
    appInsights.loadAppInsights();

    // Add telemetry initializer for custom properties
    appInsights.addTelemetryInitializer((envelope) => {
      if (!envelope || !envelope.data) {
        return true;
      }

      // Add custom properties to all telemetry
      envelope.data.baseData = envelope.data.baseData || {};
      envelope.data.baseData.properties = envelope.data.baseData.properties || {};

      const properties = envelope.data.baseData.properties;
      
      // Add app version from environment or package.json
      properties.appVersion = import.meta.env.VITE_APP_VERSION || '0.0.0';
      
      // Add build number from environment
      properties.buildNumber = import.meta.env.VITE_BUILD_NUMBER || 'local';
      
      // Add environment
      properties.environment = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development';
      
      // Add user role (can be extended based on auth context)
      properties.userRole = 'anonymous';

      return true;
    });

    // Add PII scrubbing processor
    appInsights.addTelemetryInitializer(piiScrubbingProcessor);

    // Track initial page view
    appInsights.trackPageView();

    console.log('Application Insights initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Application Insights:', error);
  }
}

/**
 * Track a custom event
 * @param name Event name
 * @param properties Custom properties
 */
export function trackEvent(name: string, properties?: Record<string, any>): void {
  if (appInsights) {
    appInsights.trackEvent({ name }, properties);
  }
}

/**
 * Track a custom exception
 * @param error Error object
 * @param severityLevel Severity level (0-4)
 */
export function trackException(error: Error, severityLevel?: number): void {
  if (appInsights) {
    appInsights.trackException({ 
      exception: error,
      severityLevel: severityLevel ?? 3,
    });
  }
}

/**
 * Track a custom trace/log
 * @param message Log message
 * @param severityLevel Severity level (0-4)
 * @param properties Custom properties
 */
export function trackTrace(message: string, severityLevel?: number, properties?: Record<string, any>): void {
  if (appInsights) {
    appInsights.trackTrace({ 
      message,
      severityLevel: severityLevel ?? 1,
    }, properties);
  }
}
