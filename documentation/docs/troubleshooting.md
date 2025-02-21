---
title: Troubleshooting
hide:
  - navigation
---

## Device Farm

### Facing errors related to prisma installation?

1. run `appium plugin run device-farm setup`
2. Check if the script executes without any error
3. Incase of any error, open a new issue with the complete log from the script execution

### How to delete all session details and videos?

1. run `appium plugin run device-farm reset`
2. The above command will delete all the existing data from database and resets the device farm to the original state

## IOS

1. How do I improve the iOS session startup for real device?

   - Resign the WDA provided here: [How to resign webdriver agent](/ios-signing)
   - Use the following capabilities:

     ```json
     {
      "appium:usePreinstalledWDA": true,
      "appium:updatedWDABundleId": wdaBundleID,
      "appium:updatedWDABundleIdSuffix": "",
     }
     ```

   - Make sure the iPhone real device is unblocked and enabled developer mode.

2. How do I improve the iOS session startup for Simulators?
   - Provide server argument during the appium server start. `preBuildWDAPath` with the path to the WDA build for Simulators.

## 📺 Streaming Settings

The **Streaming Settings** section allows you to customize the streaming performance and quality of the IOS simulator and real device screen within the Appium Device-farm dashboard. This is particularly useful when accessing devices from remote machines for real-time control, ensuring the best balance between performance and visual clarity.

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

## Notes

1. If there is no activity on a session for more then 100 seconds, device allocated to respective session would be unblocked and made available for new session requests.
