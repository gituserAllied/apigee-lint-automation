// /*------------------------------------------------------------------------------------------------

var configJson = context.getVariable("private.customer.config");
print("Customer Config :"+configJson);
 
// Parse JSON

var config = JSON.parse(configJson);
var root = config.CustomerOnboardingConfig;

print("Config :"+root);

// Store CustomerProfile

context.setVariable("customer.name", root.CustomerProfile.customerName);

context.setVariable("customer.businessUnit", root.CustomerProfile.businessUnit);

context.setVariable("customer.onboardingDate", root.CustomerProfile.onboardingDate);

context.setVariable("customer.tier", root.CustomerProfile.tier);

context.setVariable("customer.contactPerson", root.CustomerProfile.contactPerson);

context.setVariable("customer.contactEmail", root.CustomerProfile.contactEmail);

context.setVariable("customer.contactNumber", root.CustomerProfile.contactNumber);

// Store AccessManagement

context.setVariable("access.appID", root.AccessManagement.appID);

context.setVariable("access.apiKey", root.AccessManagement.apiKey);

context.setVariable("access.apiProduct", root.AccessManagement.apiProduct);

context.setVariable("access.environment", root.AccessManagement.environment);

context.setVariable("access.DeveloperApp", root.AccessManagement.DeveloperApp);

context.setVariable("access.AccessType", root.AccessManagement.AccessType);

context.setVariable("access.RatePlan", root.AccessManagement.RatePlan);

context.setVariable("access.Description", root.AccessManagement.Description);

context.setVariable("access.JIRA", root.AccessManagement.JIRA);

// Store SecurityConfig

context.setVariable("security.IP.Enable", root.SecurityConfig.IP.Enable);
context.setVariable("security.IP.IPList", root.SecurityConfig.IP.IPList);

context.setVariable("security.OAuth.Enable", root.SecurityConfig.OAuth.Enable);

context.setVariable("security.JWT.Enable", root.SecurityConfig.JWT.Enable);

context.setVariable("security.JWT.Issuer", root.SecurityConfig.JWT.Issuer);

context.setVariable("security.JWT.Audience", root.SecurityConfig.JWT.Audience);

context.setVariable("security.mTLS.Enable", root.SecurityConfig.mTLS.Enable);

context.setVariable("security.SSLCert.Enable", root.SecurityConfig.SSLCertificateVerification.Enable);

context.setVariable("security.SSLCert.ValidTo", root.SecurityConfig.SSLCertificateVerification.ValidTo);

context.setVariable("security.SSLCert.ExpirationDaysRemaining", root.SecurityConfig.SSLCertificateVerification.ExpirationDaysRemaining);



context.setVariable("security.ThreatProtection.Enable", root.SecurityConfig.ThreatProtection.Enable);

context.setVariable("security.ThreatProtection.SQLInjection", root.SecurityConfig.ThreatProtection.SQLInjection);
context.setVariable("security.ThreatProtection.RegularExpression", root.SecurityConfig.ThreatProtection.RegularExpression);
context.setVariable("security.ThreatProtection.ContentValidation", root.SecurityConfig.ThreatProtection.ContentValidation);
context.setVariable("security.SchemaValidation.Enable", root.SecurityConfig.SchemaValidation.Enable);

// Store Encryption

context.setVariable("security.Encryption.Source.Enable", root.SecurityConfig.Encryption.Source.Enable);

context.setVariable("security.Encryption.Destination.Enable", root.SecurityConfig.Encryption.Destination.Enable);

context.setVariable("security.Encryption.Destination.Algorithm", root.SecurityConfig.Encryption.Destination.Algorithm);

// Store TrafficManagement

context.setVariable("traffic.Quota.Enable", root.TrafficManagement.Quota.Enable);

context.setVariable("traffic.Quota.Daily", root.TrafficManagement.Quota.QuotaDaily);

context.setVariable("traffic.Quota.Hourly", root.TrafficManagement.Quota.QuotaHourly);

context.setVariable("traffic.Quota.Minute", root.TrafficManagement.Quota.QuotaMinute);

context.setVariable("traffic.Spike.Enable", root.TrafficManagement.Spike.Enable);

context.setVariable("traffic.Spike.Seconds", root.TrafficManagement.Spike.SpikeSeconds);

context.setVariable("traffic.Spike.Minute", root.TrafficManagement.Spike.SpikeMinute);

// Store Alerts

context.setVariable("alerts.Enable", root.Alerts.Enable);

context.setVariable("alerts.BusinessEmail", root.Alerts.BusinessEmail);

context.setVariable("alerts.TechnicalEmail", root.Alerts.TechnicalEmail);

context.setVariable("alerts.ErrorRatePercent", root.Alerts.AlertThresholds.ErrorRatePercent);

context.setVariable("alerts.LatencyMs", root.Alerts.AlertThresholds.LatencyMs);

context.setVariable("alerts.QuotaUsagePercent", root.Alerts.AlertThresholds.QuotaUsagePercent);

context.setVariable("alerts.SSLCertExpiryDays", root.Alerts.AlertThresholds.SSLCertExpiryDays);



// Optional log

print("Customer onboarding configuration variables successfully set.");