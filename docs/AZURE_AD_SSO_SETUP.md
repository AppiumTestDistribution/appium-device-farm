# Azure AD SSO Setup Guide

This guide explains how to configure Azure Active Directory (Azure AD) Single Sign-On (SSO) for Appium Device Farm.

## Prerequisites

1. An Azure Cloud account with active subscription
2. Administrator access to Azure Active Directory
3. Appium Device Farm installed and running

## Step 1: Register an Application in Azure AD

1. Log in to the [Azure Portal](https://portal.azure.com/).
2. Navigate to **Azure Active Directory** > **App registrations**.
3. Click **New registration**.
4. Enter a name for the application (e.g., "Appium Device Farm").
5. Under **Supported account types**, select who can use this application (e.g., "Accounts in this organizational directory only").
6. Under **Redirect URI**, select **Web** and enter the callback URL:
   - For local development: `http://localhost:31337/device-farm/api/auth/azure/callback`
   - For production: `https://your-domain.com/device-farm/api/auth/azure/callback`
7. Click **Register**.

## Step 2: Configure Client Credentials

1. In the app overview page, note down the **Application (client) ID** and **Directory (tenant) ID**.
2. Navigate to **Certificates & secrets** in the left menu.
3. Click **New client secret**.
4. Add a description and select an expiration period.
5. Click **Add**.
6. **Important:** Copy the **Value** of the client secret immediately. You won't be able to see it again.

## Step 3: Configure API Permissions

1. Navigate to **API permissions**.
2. Click **Add a permission** > **Microsoft Graph**.
3. Select **Delegated permissions**.
4. Ensure the following permissions are selected:
   - `User.Read` (Sign in and read user profile)
   - `email` (View users' email address)
   - `openid` (Sign users in)
   - `profile` (View users' basic profile)
5. Click **Add permissions**.
6. (Optional) If required by your organization, click **Grant admin consent**.

## Step 4: Configure Appium Device Farm

You can configure SSO using environment variables or by passing arguments when starting the plugin.

### Environment Variables

Set the following environment variables before starting the server:

```bash
# Enable Azure AD SSO
export AZURE_AD_ENABLED=true

# Azure AD Credentials
export AZURE_AD_CLIENT_ID="your-client-id"
export AZURE_AD_CLIENT_SECRET="your-client-secret"
export AZURE_AD_TENANT_ID="your-tenant-id"

# Redirect URI (Must match what you registered in Azure)
export AZURE_AD_REDIRECT_URI="http://localhost:31337/device-farm/api/auth/azure/callback"

# Session Secret (Required for security)
export SESSION_SECRET="your-secure-random-string"
```

### Plugin Arguments

Alternatively, you can pass these as arguments to the Appium server (if supported by the CLI wrapper):

```bash
appium server \
  --plugin-device-farm-azure-ad-enabled=true \
  --plugin-device-farm-azure-ad-client-id="your-client-id" \
  --plugin-device-farm-azure-ad-client-secret="your-client-secret" \
  --plugin-device-farm-azure-ad-tenant-id="your-tenant-id" \
  --plugin-device-farm-azure-ad-redirect-uri="http://localhost:31337/device-farm/api/auth/azure/callback"
```

## User Management

- **First Login:** When a user logs in via SSO for the first time, an account is automatically created in the Device Farm database.
- **Role Assignment:** New SSO users are assigned the `user` role by default. An admin must manually promote them to `admin` if needed.
- **Profile Sync:** User details (Name, Email) are synchronized from Azure AD on every login.
- **Hybrid Auth:** Users can still log in with local username/password if they have a local account.

## Troubleshooting

### "Reply URL does not match"
Ensure the `AZURE_AD_REDIRECT_URI` matches exactly what is registered in the Azure portal, including the protocol (http/https) and path.

### "Client secret is invalid"
Ensure you copied the **Value** of the client secret, not the Secret ID.

### "User not found"
If you see this error after redirect, check the server logs. It might be an issue with email claims not being returned by Azure AD. Ensure the `email` scope is granted.
