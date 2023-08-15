---
title: Troubleshooting
hide:
  - navigation
---

### IOS Tracking
* To track ios device events like device plugged and unplugged we use [go-ios](https://github.com/danielpaulus/go-ios) module.
* We have to options to install go-ios module:
    * Option1 --> If you want device-farm to help you download go-ios module. Run command `` appium plugin run device-farm install-go-ios ``
    * Option2 --> You can install the go-ios module with `` npm install -g go-ios ``
* We need to set the environment variable.
    * After installing with Option2 --> `` GO_IOS="/usr/local/lib/node_modules/go-ios/dist/{ SELECT YOUR OS }/ios" ``

### Notes
1. If there is no activity on a session for more then 100 seconds, device allocated to respective session would be unblocked and made available for new session requests.