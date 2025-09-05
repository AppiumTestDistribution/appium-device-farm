---
title: Troubleshooting
hide:
  - navigation
---

### Device Farm

1. Facing errors related to prisma installation?

   - run `appium plugin run device-farm setup`
   - Check if the script executes without any error
   - Incase of any error, open a new issue with the complete log from the script execution

2. How to delete all session details and videos?

   - run `appium plugin run device-farm reset`
   - The above command will delete all the existing data from database and resets the device farm to the original state

3. Selective Reset Options

   You can now perform selective resets to preserve certain data while clearing others:

   **Important:** Selective reset commands only work on existing databases with data. If you have a fresh installation or empty database, run the full reset first.

   **Available Reset Commands:**

   - **Full Reset** (default): `appium plugin run device-farm reset`

     - Clears all data including users, teams, devices, sessions, and apps
     - Use this first to initialize a fresh database

   - **Preserve Users and Teams**: `./node_modules/.bin/appium plugin run device-farm reset-preserve-users`

     - Clears only sessions and apps, preserves users, teams, tokens, and device details
     - Requires existing database with data

   - **Preserve Teams**: `./node_modules/.bin/appium plugin run device-farm reset-preserve-teams`

     - Clears sessions, apps, and device details, preserves teams, users, and tokens
     - Requires existing database with data

   - **Sessions Only**: `./node_modules/.bin/appium plugin run device-farm reset-sessions-only`
     - Clears only test sessions and logs, preserves everything else
     - Requires existing database with data

   **Workflow for Selective Reset:**

   1. **First time setup**: Run full reset to initialize database

      ```bash
      appium plugin run device-farm reset
      ```

   2. **Create your teams and users** through the dashboard

   3. **Later, when you want to clear session data**: Use selective reset
      ```bash
      ./node_modules/.bin/appium plugin run device-farm reset-preserve-users
      ```

   **Custom Selective Reset:**

   You can also use individual flags for fine-grained control:

   ```bash
   appium plugin run device-farm reset --skip-teams --skip-users --skip-tokens --skip-device-details
   ```

   **Available Flags:**

   - `--skip-teams`: Skip clearing teams and team-related data
   - `--skip-users`: Skip clearing users and user accounts
   - `--skip-tokens`: Skip clearing API tokens
   - `--skip-device-details`: Skip clearing device details and assignments
   - `--skip-apps`: Skip clearing uploaded applications
   - `--skip-sessions`: Skip clearing test sessions and logs
   - `--help`: Show help message with all available options

   **Examples:**

   ```bash
   # Clear only sessions and apps, keep everything else
   appium plugin run device-farm reset --skip-teams --skip-users --skip-tokens --skip-device-details

   # Clear everything except users and teams
   appium plugin run device-farm reset --skip-teams --skip-users

   # Clear only device details and sessions
   appium plugin run device-farm reset --skip-teams --skip-users --skip-tokens --skip-apps
   ```

### IOS

1. How do I improve the iOS session startup for real device?
   - Resign the WDA provided here: [WDA]()
   - Use the following capabilities:
     ```json
     {
     'appium:usePreinstalledWDA': true,
     'appium:updatedWDABundleId': wdaBundleID,
     'appium:updatedWDABundleIdSuffix': '',
     }
     ```
   - Make sure the iPhone real device is unblocked and enabled developer mode.
2. How do I improve the iOS session startup for Simulators?
   - Provide server argument during the appium server start. `preBuildWDAPath` with the path to the WDA build for Simulators.

## 📺 Streaming Settings

The **Streaming Settings** section allows you to customize the streaming performance and quality of the IOS simulator and real device screen within the Appium Device-farm dashboard. This is particularly useful when accessing devices from remote machines for real-time control, ensuring the best balance between performance and visual clarity.

<img width="801" alt="image" src="https://github.com/user-attachments/assets/faec9a56-7a45-4dd4-9595-494e40c9d58d" />

### 🔧 Settings Descriptions:

- **Framerate (1 - 60):**  
  Sets the number of frames per second (FPS) for the streamed display.

  - Higher values (e.g., 60) provide smoother motion but increase resource usage.
  - Lower values (e.g., 10) can improve stability under low bandwidth conditions.

- **Video Quality (1 - 100):**  
  Controls the visual quality of the stream.

  - `0` offers the lowest quality to save bandwidth.
  - `100` delivers the highest clarity, useful for detailed UI inspections.
  - Adjust this setting to balance visual clarity with network constraints.

- **Scaling Factor (1 - 100):**  
  Adjusts the size of the streamed display.

  - `100` represents the original size.
  - Lower values shrink the display, helpful when viewing multiple devices simultaneously.

- **Save Settings:**  
  Click this button to apply the changes. All adjustments will take effect immediately for the ongoing session.

These settings are designed to offer flexibility, allowing testers to tailor the streaming experience based on their hardware, network conditions, and testing needs.

### Notes

1. If there is no activity on a session for more then 100 seconds, device allocated to respective session would be unblocked and made available for new session requests.
