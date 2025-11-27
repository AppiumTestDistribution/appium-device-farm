import { Request, Response } from 'express';
import passport from 'passport';
import { getAzureAdConfig } from '../config/azure-ad.config';
import log from '../../logger';

/**
 * SSO Authentication Controller
 */
export class SsoAuthController {
    /**
     * Initiate Azure AD login
     */
    async initiateAzureLogin(req: Request, res: Response, next: any) {
        try {
            const azureConfig = getAzureAdConfig();

            if (!azureConfig) {
                return res.status(503).json({
                    message: 'Azure AD SSO is not configured or enabled',
                    enabled: false
                });
            }

            log.info('Initiating Azure AD login');

            // Use Passport to redirect to Azure AD
            passport.authenticate('azuread-openidconnect', {
                failureRedirect: '/device-farm/login?error=sso_failed',
            })(req, res, next);
        } catch (error) {
            log.error(`Error initiating Azure AD login: ${error}`);
            return res.status(500).json({ message: 'Error initiating SSO login' });
        }
    }

    /**
     * Handle Azure AD callback
     */
    async handleAzureCallback(req: Request, res: Response, next: any) {
        try {
            log.info('Handling Azure AD callback');

            passport.authenticate('azuread-openidconnect', {
                failureRedirect: '/device-farm/login?error=sso_failed',
            }, (err: any, user: any) => {
                if (err) {
                    log.error(`Azure AD authentication error: ${err}`);
                    return res.redirect('/device-farm/login?error=sso_failed');
                }

                if (!user) {
                    log.warn('No user returned from Azure AD authentication');
                    return res.redirect('/device-farm/login?error=sso_no_user');
                }

                // Successful authentication - redirect to dashboard with token
                const token = user.token;

                // Redirect to frontend with token in query parameter
                // The frontend will store this in localStorage
                return res.redirect(`/device-farm/?sso_token=${encodeURIComponent(token)}`);
            })(req, res, next);
        } catch (error) {
            log.error(`Error handling Azure AD callback: ${error}`);
            return res.redirect('/device-farm/login?error=sso_callback_failed');
        }
    }

    /**
     * Get SSO configuration status
     */
    async getSsoConfig(req: Request, res: Response) {
        try {
            const azureConfig = getAzureAdConfig();

            return res.status(200).json({
                enabled: azureConfig !== null,
                provider: azureConfig ? 'azure_ad' : null,
            });
        } catch (error) {
            log.error(`Error getting SSO config: ${error}`);
            return res.status(500).json({ message: 'Error getting SSO configuration' });
        }
    }
}

export const ssoAuthController = new SsoAuthController();
