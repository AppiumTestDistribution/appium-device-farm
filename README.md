# appium-device-plugin [![Node.js CI](https://github.com/SrinivasanTarget/appium-device-plugin/actions/workflows/node.js.yml/badge.svg)](https://github.com/SrinivasanTarget/appium-device-plugin/actions/workflows/node.js.yml)

This is an Appium plugin designed to manage and create driver session on connected android devices and iOS Simulators.

## Why Appium Device Plugin?

- Automatically detects connected android devices before session creation and maintains it in global device pool.
- Dynamically allocates a free device from global device pool while creating driver session.
- Dynamically updates global device pool when new device is detected or an existing device is removed during the test execution.
- Dynamically updates global device pool by polling for connected devices every 10 seconds.
- Allocates a free port to systemPort capability during session creation.

## Prerequisite

Appium version 2.0

## Installation - Server

Install the plugin using Appium's plugin CLI, either as a named plugin or via NPM:

```
appium plugin install --source=npm appium-device-plugin
```

## Installation - Client

No special action is needed to make things work on the client side.

## Activation

The plugin will not be active unless turned on when invoking the Appium server:

```
appium --plugins=device-manager
```

## Example

Server logs will be as below:

### Session Creation

```
[device-manager] Master Device List [{"busy":false,"state":"device","udid":"emulator-5554"},{"busy":false,"state":"device","udid":"emulator-5556"}]
[debug] [HTTP] Request idempotency key: 40f0c680-ba67-47a9-b763-95121afd2aff
[HTTP] --> POST /wd/hub/session
[HTTP] {"desiredCapabilities":{"app":"/Users/sekars/workspace/AppiumSample/VodQA.apk","automationName":"UIAutomator2","platformName":"Android","deviceName":"Android Emulator","newCommandTimeout":700000},"capabilities":{"firstMatch":[{"appium:app":"/Users/sekars/workspace/AppiumSample/VodQA.apk","appium:automationName":"UIAutomator2","appium:deviceName":"Android Emulator","appium:newCommandTimeout":700000,"platformName":"android"}]}}
[debug] [W3C] Calling AppiumDriver.createSession() with args: [{"app":"/Users/sekars/workspace/AppiumSample/VodQA.apk","automationName":"UIAutomator2","platformName":"Android","deviceName":"Android Emulator","newCommandTimeout":700000},null,{"firstMatch":[{"appium:app":"/Users/sekars/workspace/AppiumSample/VodQA.apk","appium:automationName":"UIAutomator2","appium:deviceName":"Android Emulator","appium:newCommandTimeout":700000,"platformName":"android"}]}]
[Appium] Plugins which can handle cmd 'createSession': device-manager (sessionless)
[Appium] Plugin device-manager (sessionless) is now handling cmd 'createSession'
[device-manager] Device UDID emulator-5554 is blocked for execution.
[Appium] Attempting to find matching driver for automationName 'UIAutomator2' and platformName 'android'
[Appium] The 'uiautomator2' driver was installed and matched caps.
[Appium] Will require it at /Users/sekars/.appium/appium-uiautomator2-driver/node_modules/appium-uiautomator2-driver
[Appium] Appium v2.0.0-beta.12 creating new AndroidUiautomator2Driver (v1.64.0) session
[Appium] Checking BaseDriver versions for Appium and AndroidUiautomator2Driver
[Appium] Appium's BaseDriver version is 8.0.0-beta.6
[Appium] Could not determine AndroidUiautomator2Driver's BaseDriver version
[debug] [BaseDriver] W3C capabilities and MJSONWP desired capabilities were provided
[debug] [BaseDriver] Creating session with W3C capabilities: {
[debug] [BaseDriver]   "alwaysMatch": {
[debug] [BaseDriver]     "platformName": "android",
[debug] [BaseDriver]     "appium:app": "/Users/sekars/workspace/AppiumSample/VodQA.apk",
[debug] [BaseDriver]     "appium:automationName": "UIAutomator2",
[debug] [BaseDriver]     "appium:deviceName": "emulator-5554",
[debug] [BaseDriver]     "appium:newCommandTimeout": 700000,
[debug] [BaseDriver]     "appium:udid": "emulator-5554",
[debug] [BaseDriver]     "appium:systemPort": 64717
[debug] [BaseDriver]   },
[debug] [BaseDriver]   "firstMatch": [
[debug] [BaseDriver]     {}
[debug] [BaseDriver]   ]
[debug] [BaseDriver] }
[BaseDriver] Session created with session id: a18dbb34-b6b7-4269-b55d-d25854da2c69
```

### Session Deletion

```
[device-manager] Unblocking device UDID: emulator-5554
[device-manager] Deleting Session and device UDID emulator-5554 is unblocked
[Appium] Executing default handling behavior for command 'deleteSession'
[debug] [BaseDriver] Event 'quitSessionRequested' logged at 1616393765527 (11:46:05 GMT+0530 (India Standard Time))
[Appium] Removing session a18dbb34-b6b7-4269-b55d-d25854da2c69 from our master session list
[debug] [UiAutomator2] Deleting UiAutomator2 session
[debug] [UiAutomator2] Deleting UiAutomator2 server session
[debug] [WD Proxy] Matched '/' to command name 'deleteSession'
[debug] [WD Proxy] Proxying [DELETE /] to [DELETE http://127.0.0.1:64717/wd/hub/session/6312cab7-d11a-4bf5-92cf-39c4f85a4a8f] with no body
[debug] [WD Proxy] Got response with status 200: {"sessionId":"6312cab7-d11a-4bf5-92cf-39c4f85a4a8f","value":null}
[debug] [ADB] Running '/Users/sekars/Library/Android/sdk/platform-tools/adb -P 5037 -s emulator-5554 shell am force-stop com.vodqareactnative'
[debug] [BaseDriver] Event 'quitSessionFinished' logged at 1616393765610 (11:46:05 GMT+0530 (India Standard Time))
[debug] [W3C (20e35290)] Received response: null
[debug] [W3C (20e35290)] But deleting session, so not returning
[debug] [W3C (20e35290)] Responding to client with driver.deleteSession() result: null
[HTTP] <-- DELETE /wd/hub/session/20e35290-43b2-431e-8a78-aefca4d092fb 200 491 ms - 14
```

### Device polling for every 10 seconds

```
[ADB] Using 'adb' from '/Users/sekars/Library/Android/sdk/platform-tools/adb'
[debug] [ADB] Running '/Users/sekars/Library/Android/sdk/platform-tools/adb -P 5037 start-server'
[debug] [ADB] Getting connected devices
[debug] [ADB] Connected devices: [{"udid":"emulator-5554","state":"device"},{"udid":"emulator-5556","state":"device"}]
[device-manager] Master Device List [{"busy":false,"state":"device","udid":"emulator-5554"},{"busy":false,"state":"device","udid":"emulator-5556"}]
```
