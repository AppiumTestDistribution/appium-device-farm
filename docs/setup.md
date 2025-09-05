---
title: Setup & Requirements
hide:
  - navigation
---
## Prerequisite

Appium version 2.4.X

Make sure to install go-ios for real device testing for non-mac machines. Refer [go-ios](https://github.com/danielpaulus/go-ios). Supported iOS 17+

## Installation - Server

Install the plugin using Appium's plugin CLI, either as a named plugin or via NPM:

```
appium plugin install --source=npm appium-device-farm
```

## Installation - Client

No special action is needed to make things work on the client side.

## Activation

The plugin will not be active unless turned on when invoking the Appium server. See "Argument options" below

```
appium server -ka 800 --use-plugins=device-farm,appium-dashboard  -pa /wd/hub --plugin-device-farm-platform=android
```

You can also pass all the arguments in a config file. Refer [here](https://github.com/AppiumTestDistribution/appium-device-farm/blob/main/server-config.json)
```
appium server -ka 800 --use-plugins=device-farm --config ./server-config.json -pa /wd/hub
```

## Device UI

- Navigate to localhost:4723/device-farm once the appium server is started.

<img src="https://github.com/AppiumTestDistribution/appium-device-farm/blob/main/docs/assets/images/demo.gif?raw=true">

User can block/unblock devices from Dashboard manually. These devices will not be picked up for automation.

Once automation picks the device user cannot manually unblock, it's responsible for the automation script.

## Manual Control of Devices for iOS real device
Resign the WDA provided here: [WDA](). Upload the resigned WDA to the server from the UI. 

**For iOS devices:** Make sure the WDA uploaded should be named as `wda-resign.ipa`.

**For tvOS devices:** Make sure the WDA uploaded should be named as `wda-resign_tvos.ipa`.

The system will automatically select the appropriate WDA file based on the device platform:
- iOS devices (iPhone, iPad) → `wda-resign.ipa`
- tvOS devices (Apple TV) → `wda-resign_tvos.ipa`

Follow the instructions [here](https://github.com/DanTheMan827/ios-app-signer) to resign the WDA.

Verify: Install the resigned WDA on the device and check if the WDA is working fine. Use the command 
`ios install --path=/pathto/wda-resign.ipa` (for iOS) or `ios install --path=/pathto/wda-resign_tvos.ipa` (for tvOS)
## Dashboard

To reflect the test status on dashboard. 

WDIO
```
      await driver.executeScript('devicefarm: setSessionStatus', [
        {
          status: 'passed', //passed or failed
        },
      ]);
```


To reflect the test name on dashboard.

WDIO 
```
      await driver.executeScript('devicefarm: setSessionName', [
        {
          name: 'Test Name',
        },
      ]);
```
