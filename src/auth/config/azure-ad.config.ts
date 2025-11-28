import log from '../../logger';

/**
 * Azure AD SSO Configuration Interface
 */
export interface AzureAdConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
  enabled: boolean;
}

/**
 * Get Azure AD configuration from environment variables
 */
export function getAzureAdConfig(): AzureAdConfig | null {
  const enabled = process.env.AZURE_AD_ENABLED === 'true';

  if (!enabled) {
    log.info('Azure AD SSO is disabled');
    return null;
  }

  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const redirectUri = process.env.AZURE_AD_REDIRECT_URI;

  // Validate required environment variables
  if (!clientId || !clientSecret || !tenantId || !redirectUri) {
    log.error('Azure AD SSO is enabled but required environment variables are missing');
    log.error(
      'Required: AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID, AZURE_AD_REDIRECT_URI',
    );
    return null;
  }

  log.info('Azure AD SSO is enabled and configured');

  return {
    clientId,
    clientSecret,
    tenantId,
    redirectUri,
    enabled: true,
  };
}

/**
 * Get Azure AD authorization URL
 */
export function getAuthorizationUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
}

/**
 * Get Azure AD token URL
 */
export function getTokenUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
}

/**
 * Get Azure AD metadata URL for OIDC
 */
export function getMetadataUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`;
}
