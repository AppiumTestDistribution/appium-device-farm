import passport from 'passport';
import { OIDCStrategy, IOIDCStrategyOptionWithRequest, IProfile, VerifyCallback } from 'passport-azure-ad';
import { getAzureAdConfig } from '../config/azure-ad.config';
import { azureAdService } from '../services/azure-ad.service';
import log from '../../logger';

/**
 * Configure Passport.js with Azure AD OIDC Strategy
 */
export function configurePassport() {
    const azureConfig = getAzureAdConfig();

    if (!azureConfig) {
        log.warn('Azure AD SSO is not configured, skipping Passport setup');
        return null;
    }

    const strategyConfig: IOIDCStrategyOptionWithRequest = {
        identityMetadata: `https://login.microsoftonline.com/${azureConfig.tenantId}/v2.0/.well-known/openid-configuration`,
        clientID: azureConfig.clientId,
        clientSecret: azureConfig.clientSecret,
        responseType: 'code',
        responseMode: 'form_post',
        redirectUrl: azureConfig.redirectUri,
        allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production', // Allow HTTP in development
        validateIssuer: true,
        passReqToCallback: true,
        scope: ['profile', 'email', 'openid'],
    };

    passport.use(
        new OIDCStrategy(
            strategyConfig,
            async (req: any, profile: IProfile, done: VerifyCallback) => {
                try {
                    log.info('Azure AD authentication callback received');

                    // Extract user information from Azure AD profile
                    const azureProfile = {
                        oid: profile.oid || profile._json?.oid,
                        email: profile._json?.email || profile._json?.preferred_username,
                        name: profile.displayName || profile._json?.name,
                        given_name: profile.name?.givenName || profile._json?.given_name,
                        family_name: profile.name?.familyName || profile._json?.family_name,
                        preferred_username: profile._json?.preferred_username,
                    };

                    // Authenticate user with Azure AD profile
                    const result = await azureAdService.authenticateWithAzureAd(azureProfile);

                    return done(null, result);
                } catch (error) {
                    log.error(`Error in Azure AD authentication callback: ${error}`);
                    return done(error as Error);
                }
            }
        )
    );

    // Serialize user for session
    passport.serializeUser((user: any, done) => {
        done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser((user: any, done) => {
        done(null, user);
    });

    log.info('Passport configured with Azure AD OIDC strategy');
    return passport;
}
