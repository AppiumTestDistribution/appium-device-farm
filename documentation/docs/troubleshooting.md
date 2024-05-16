---
title: Troubleshooting
hide:
  - navigation
---

### IOS

1. How do I improve the iOS session startup for real device?
    - Resign the WDA provided here: [WDA]()
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
### Notes
1. If there is no activity on a session for more then 100 seconds, device allocated to respective session would be unblocked and made available for new session requests.
