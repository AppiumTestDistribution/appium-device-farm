import { Router } from 'express';
import { ssoAuthController } from '../controllers/sso-auth.controller';

/**
 * SSO Authentication Routes
 */
export function getSsoAuthRoutes() {
    const router = Router();

    // Azure AD SSO routes
    router.get('/azure/login', ssoAuthController.initiateAzureLogin.bind(ssoAuthController));
    router.post('/azure/callback', ssoAuthController.handleAzureCallback.bind(ssoAuthController));

    // SSO configuration endpoint
    router.get('/sso/config', ssoAuthController.getSsoConfig.bind(ssoAuthController));

    return router;
}
