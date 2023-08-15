---
title: Setup & Requirements
hide:
  - navigation
---
## Prerequisite

Appium version 2.0.X

## Installation - Server

Install the plugin using Appium's plugin CLI, either as a named plugin or via NPM:

```
appium plugin install --source=npm appium-device-farm
appium plugin install --source=npm appium-dashboard
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

<img src="./assets/images/demo.gif">

User can block/unblock devices from Dashboard manually. These devices will not be picked up for automation.

Once automation picks the device user cannot manually unblock, it's responsible for the automation script.

