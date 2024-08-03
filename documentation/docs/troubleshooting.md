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

## Notes

1. If there is no activity on a session for more then 100 seconds, device allocated to respective session would be unblocked and made available for new session requests.
