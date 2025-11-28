# Azure AD SSO Frontend Implementation Guide

This guide outlines the necessary changes in the `dashboard-frontend` to support Azure AD Single Sign-On (SSO). The backend infrastructure is fully implemented and exposes the necessary endpoints.

## Backend Endpoints

The following endpoints are available in the `appium-device-farm` backend:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/device-farm/api/auth/azure/login` | Initiates the Azure AD login flow. Redirects the browser to Microsoft. |
| `POST` | `/device-farm/api/auth/azure/callback` | Handles the callback from Azure AD. Redirects to the dashboard with a token. |
| `GET` | `/device-farm/api/auth/sso/config` | Returns the SSO configuration status (enabled/disabled). |

## Authentication Flow

1.  **Initiation**: User clicks "Sign in with Microsoft" on the login page.
2.  **Redirect**: Browser navigates to `/device-farm/api/auth/azure/login`.
3.  **Authentication**: User authenticates with Microsoft.
4.  **Callback**: Microsoft redirects back to `/device-farm/api/auth/azure/callback`.
5.  **Completion**: Backend processes the login and redirects to the dashboard:
    ```
    http://<server>/device-farm/?sso_token=<jwt_token>
    ```

## Required Frontend Changes

### 1. Login Page (`/login`)

-   **Check SSO Status**: On load, call `/device-farm/api/auth/sso/config` to check if SSO is enabled.
    ```javascript
    // Example Response
    {
      "enabled": true,
      "provider": "azure_ad"
    }
    ```
-   **Add Login Button**: If enabled, display a "Sign in with Microsoft" button.
-   **Button Action**: The button should simply navigate the window to the login endpoint:
    ```javascript
    window.location.href = '/device-farm/api/auth/azure/login';
    ```

### 2. Dashboard (`/`)

-   **Token Extraction**: The dashboard component needs to check for the `sso_token` query parameter in the URL.
-   **Session Storage**: If found, extract the token and store it in `localStorage` (or wherever the app currently stores the JWT).
    ```javascript
    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('sso_token');

    if (ssoToken) {
      localStorage.setItem('token', ssoToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload or update state to reflect logged-in user
    }
    ```

### 3. User Profile

-   **Display Info**: The JWT token contains the user's information. Ensure the profile section displays the user's name and email correctly.
-   **Password Change**: Disable "Change Password" functionality for users with `authProvider === 'azure_ad'`.

## Error Handling

The backend may redirect to the login page with error parameters if authentication fails:
-   `/device-farm/login?error=sso_failed`
-   `/device-farm/login?error=sso_no_user`

The frontend should parse these query parameters and display appropriate error messages to the user.
