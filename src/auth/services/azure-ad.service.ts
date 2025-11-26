import { prisma } from '../../prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET, JwtPayload } from '../middleware/auth.middleware';
import log from '../../logger';
import { generateAccessKey } from '../../utils/auth';
import { User } from '@prisma/client';

/**
 * Azure AD Profile Interface (from OIDC token)
 */
export interface AzureAdProfile {
    oid: string; // Azure AD Object ID
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
}

/**
 * Azure AD Authentication Service
 */
export class AzureAdService {
    /**
     * Find or create user from Azure AD profile
     */
    async findOrCreateUser(profile: AzureAdProfile) {
        try {
            // Try to find user by Azure AD ID
            let user = await prisma.user.findUnique({
                where: { azureAdId: profile.oid },
            });

            if (user) {
                // Update user profile from Azure AD
                const updatedUser = await this.syncUserProfile(user.id, profile);
                if (!updatedUser) {
                    throw new Error('Failed to sync user profile');
                }
                log.info(`Azure AD user logged in: ${updatedUser.username}`);
                return updatedUser;
            }

            // Try to find user by email if provided
            if (profile.email) {
                user = await prisma.user.findUnique({
                    where: { email: profile.email },
                });

                if (user) {
                    // Link existing user to Azure AD
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            azureAdId: profile.oid,
                            authProvider: 'azure_ad',
                        },
                    });
                    log.info(`Linked existing user to Azure AD: ${user.username}`);
                    return user;
                }
            }

            // Create new user from Azure AD profile
            const username = profile.preferred_username || profile.email || `azure_${profile.oid.substring(0, 8)}`;
            const firstname = profile.given_name || profile.name?.split(' ')[0] || 'Azure';
            const lastname = profile.family_name || profile.name?.split(' ').slice(1).join(' ') || 'User';
            const accessKey = generateAccessKey(username);

            user = await prisma.user.create({
                data: {
                    username,
                    email: profile.email,
                    firstname,
                    lastname,
                    role: 'user', // Default role for Azure AD users
                    authProvider: 'azure_ad',
                    azureAdId: profile.oid,
                    accessKey,
                    isActive: true,
                },
            });

            log.info(`Created new Azure AD user: ${user.username}`);
            return user;
        } catch (error) {
            log.error(`Error finding or creating Azure AD user: ${error}`);
            throw error;
        }
    }

    /**
     * Sync user profile from Azure AD
     */
    async syncUserProfile(userId: string, profile: AzureAdProfile) {
        try {
            const updateData: any = {};

            if (profile.email) {
                updateData.email = profile.email;
            }

            if (profile.given_name) {
                updateData.firstname = profile.given_name;
            }

            if (profile.family_name) {
                updateData.lastname = profile.family_name;
            }

            if (Object.keys(updateData).length > 0) {
                const user = await prisma.user.update({
                    where: { id: userId },
                    data: updateData,
                });
                log.info(`Synced Azure AD profile for user: ${user.username}`);
                return user;
            }

            return await prisma.user.findUnique({ where: { id: userId } });
        } catch (error) {
            log.error(`Error syncing Azure AD profile: ${error}`);
            throw error;
        }
    }

    /**
     * Generate JWT token for SSO user
     */
    async generateTokenForSsoUser(user: User) {
        try {
            const payload: JwtPayload = {
                userId: user.id,
                username: user.username,
                role: user.role,
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    accessKey: user.accessKey,
                    authProvider: user.authProvider,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    isActive: user.isActive,
                },
            };
        } catch (error) {
            log.error(`Error generating token for SSO user: ${error}`);
            throw error;
        }
    }

    /**
     * Authenticate user with Azure AD profile
     */
    async authenticateWithAzureAd(profile: AzureAdProfile) {
        try {
            const user = await this.findOrCreateUser(profile);

            if (!user.isActive) {
                throw new Error('User account is deactivated');
            }

            return await this.generateTokenForSsoUser(user);
        } catch (error) {
            log.error(`Error authenticating with Azure AD: ${error}`);
            throw error;
        }
    }
}

export const azureAdService = new AzureAdService();
