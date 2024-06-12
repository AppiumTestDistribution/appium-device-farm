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

### Notes

1. If there is no activity on a session for more then 100 seconds, device allocated to respective session would be unblocked and made available for new session requests.
