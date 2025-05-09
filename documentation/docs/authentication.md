# Authentication and Device Management

This section covers the authentication and device management features of Appium Device Farm. These features help secure your device farm and provide better control over device access and management. This feature is available with version 10.0.0 and above.

## Enabling Authentication

To enable authentication in your device farm, you need to pass the `--plugin-device-farm-enable-authentication` flag while starting the Appium server:

```bash
appium --use-plugin=device-farm --plugin-device-farm-enable-authentication
```

When authentication is enabled:
- All endpoints will be secured
- Access requires valid credentials
- Device access is controlled through user roles and team assignments

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/login-screen.png" alt="Login Screen" style="width: 80%; max-width: 1200px;">
</div>

## Authentication Disabled (Default Behavior)

If the `--plugin-device-farm-enable-authentication` flag is not passed, the device farm will operate in its default mode:

- All endpoints are publicly accessible without authentication
- No user roles or permissions are enforced
- All devices are accessible to anyone who can reach the device farm
- Node registration to hub doesn't require authentication credentials
- No user management or team assignments are available

!!! note "Default Mode"
    The default mode is designed for development and testing environments where security is not a primary concern. For production environments, it's recommended to enable authentication.

## Default Credentials

Before installing the device farm plugin, you can set default admin credentials using environment variables:

```bash
export DEFAULT_ADMIN_USERNAME=your_admin_username
export DEFAULT_ADMIN_PASSWORD=your_admin_password
```

If not set, the default credentials are:
- Username: `admin`
- Password: `admin`

!!! warning "Security Note"
    It's highly recommended to change the default credentials after your first login.

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/reset-password.png" alt="Reset Password" style="width: 70%; max-width: 700px;">
</div>

## User Roles

The device farm supports two user roles:

### Admin
- Create and manage users
- Create and manage teams
- Manage all devices
- Access all features
- Generate and manage API tokens

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/users.png" alt="User Management" style="width: 0%; max-width: 700px;">
</div>
<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/teams.png" alt="Team Management" style="width: 70%; max-width: 700px;">
</div>

### User
- Login to the system
- Access devices based on team permissions
- Generate personal API tokens
- Change their password

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/menu-items.png" alt="Menu Items" style="width: 70%; max-width: 900px;">
</div>

## Node Authentication

When connecting a node to an authenticated hub, you need to provide authentication credentials:

```bash
appium --use-plugin=device-farm --plugin-device-farm-hub=<hub-url> \
       --plugin-device-farm-access-key=<access-key> \
       --plugin-device-farm-token=<token>
```

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/servers.png" alt="Servers Management" style="width: 90%; max-width: 1400px;">
</div>

### Getting Access Key and Token

1. Log in to the device farm dashboard
2. Click on your profile name in the header
3. Navigate to the "API Tokens" tab
4. Click "Generate Token"
5. Enter a token name and optional expiration date
6. Click "Create"

The access key will be displayed above the API tokens table. Use both the access key and token when registering nodes.

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/api-token.png" alt="API Token Management" style="width: 70%; max-width: 700px;">
</div>
<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/api-token-generate.png" alt="Generate API Token" style="width: 70%; max-width: 700px;">
</div>

## Automation Authentication

For automated testing, include authentication credentials in your WebDriver capabilities:

```javascript
const capabilities = {
  // ... other capabilities ...
  'df:accesskey': 'your-access-key',
  'df:token': 'your-token'
};
```

## Device Management

### Device Administration

Admin users can:
- View all devices in the hub network
- Edit device names and tags
- Flag devices for maintenance
- Exclude devices from the pool
- Assign devices to teams

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/device-management.png" alt="Device Management" style="width: 70%; max-width: 700px;">
</div>
<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/device-management-2.png" alt="Device Management Details" style="width: 70%; max-width: 700px;">
</div>

### Device Persistence

Device information is persisted in the database, including:
- Device names
- Tags
- Status
- Team assignments
- Maintenance flags

### Device Access Control

- Devices can be assigned to specific teams
- Users can only access devices assigned to their team
- Admins can override team assignments
- Maintenance flags prevent device access during maintenance

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/manage-team-device.png" alt="Manage Team Devices" style="width: 70%; max-width: 700px;">
</div>
<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/manage-team-user-1.png" alt="Manage Team Users 1" style="width: 70%; max-width: 700px;">
</div>

<div style="display: flex; justify-content: center; margin: 20px 0;">
    <img src="https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/docs-authentication/documentation/docs/assets/images/authentication/manage-team-user-2.png" alt="Manage Team Users 2" style="width: 80%; max-width: 1000px;">
</div>

## Best Practices

1. **Security**
2. Change default credentials immediately
3. Use strong passwords
4. Regularly rotate API tokens
5. Set appropriate token expiration dates
6. **Device Management**
7. Use meaningful device names
8. Tag devices appropriately
9. Flag devices for maintenance when needed
10. Regularly review team assignments
11. **Node Configuration**
12. Store node credentials securely
13. Use environment variables for sensitive data
14. Monitor node connection status
15. Implement proper error handling for authentication failures

## Securing Logs

Since the device farm plugin is part of the Appium ecosystem, logging is managed by Appium. By default, Appium logs all incoming requests along with their request bodies. This can be problematic when:

- Users attempt to log in (credentials are logged)
- Nodes register with the hub (API tokens and access keys are logged)
- Automation sessions are created (authentication details are logged)

### Preventing Credential Exposure in Logs

To prevent sensitive information from being logged, you can use Appium's log filtering feature. Create a JSON file (e.g., `log-filter.json`) with the following content:

```json
[
  {
    "pattern": "\"df:jwt\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**JWT**"
  },
  {
    "pattern": "\"df:accesskey\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**ACCESS_KEY**"
  },
  {
    "pattern": "\"df:token\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**TOKEN**"
  },
  {
    "pattern": "\"username\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**USERNAME**"
  },
  {
    "pattern": "\"password\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**PASSWORD**"
  },
  {
    "pattern": "\"accesskey\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**ACCESS_KEY**"
  },
  {
    "pattern": "\"token\":\\s*\"([^\"\n]+)\"",
    "flags": "i",
    "replacer": "**TOKEN**"
  }
]
```

Then, when starting the Appium server (both hub and node), pass the log filter configuration:

```bash
appium --use-plugin=device-farm --log-filter=/path/to/log-filter.json
```

This configuration will:
- Mask JWT tokens
- Mask access keys
- Mask API tokens
- Mask usernames and passwords
- Replace sensitive information with placeholder text

!!! warning "Important"
    Always use the log filter when running the device farm in production environments to prevent credential exposure in logs.

!!! note "Log Filter Location"
    Store the log filter configuration file in a secure location and ensure it's included in your deployment process for both hub and node instances. 

## Troubleshooting

### Upgrade and Installation Issues

If you encounter any errors while upgrading the device farm from version 9.x to 10.x or experience issues with Prisma installation, execute the following commands to reset and reinitialize the device farm:

```bash
appium plugin run device-farm reset
appium plugin run device-farm setup
```

These commands will:
1. Reset the device farm configuration and database
2. Reinitialize the device farm with fresh settings
3. Reinstall any required dependencies

!!! warning "Data Loss Warning"
    The reset command will clear all existing data including users, teams, and device assignments. Make sure to backup any important data before running these commands.