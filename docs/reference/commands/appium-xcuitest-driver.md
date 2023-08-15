# Command Reference

## Commands

### `background`

`POST` **`/session/:sessionId/appium/app/background`**

Close app (simulate device home button). It is possible to restore
the app after the timeout or keep it minimized based on the parameter value.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `seconds` | `any` |

#### Response

`unknown`

### `closeApp`

`POST` **`/session/:sessionId/appium/app/close`**

Stop the session without stopping the session

<!-- comment source: method-signature -->

#### Response

``null``

### `launchApp`

`POST` **`/session/:sessionId/appium/app/launch`**

Start the session after it has been started.

<!-- comment source: method-signature -->

#### Response

``null``

### `reset`

`POST` **`/session/:sessionId/appium/app/reset`**

Reset the current session (run the delete session and create session subroutines)

**`Deprecated`**

Use explicit session management commands instead

<!-- comment source: multiple -->

#### Response

``null``

### `getStrings`

`POST` **`/session/:sessionId/appium/app/strings`**

Return the language-specific strings for an app

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `language?` | `any` | `undefined` | - |
| `stringFile?` | `string` | `null` | The language abbreviation to fetch app strings mapping for. If no language is provided then strings for the 'en language would be returned |

#### Response

[`StringRecord`](../modules/appium_types.md#stringrecord)<`string`\>

A record of localized keys to localized text

### `queryAppState`

`POST` **`/session/:sessionId/appium/device/app_state`**

Get the running state of an app

<!-- comment source: builtin-interface -->

#### Response

`AppState`

A number representing the state. `0` means not installed, `1` means not running, `2`
means running in background but suspended, `3` means running in the background, and `4` means
running in the foreground

### `getClipboard`

`POST` **`/session/:sessionId/appium/device/get_clipboard`**

Gets the content of the primary clipboard on the device under test.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType?` | `any` |

#### Response

`string`

The actual clipboard content encoded into base64 string.
An empty string is returned if the clipboard contains no data.

### `isLocked`

`POST` **`/session/:sessionId/appium/device/is_locked`**

Determine whether the device is locked

<!-- comment source: method-signature -->

#### Response

`boolean`

`true` if the device is locked, `false` otherwise

### `lock`

`POST` **`/session/:sessionId/appium/device/lock`**

Lock the device (and optionally unlock the device after a certain amount of time)

**`Default Value`**

0

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `seconds?` | `any` |

#### Response

``null``

### `setClipboard`

`POST` **`/session/:sessionId/appium/device/set_clipboard`**

Sets the primary clipboard's content on the device under test.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `any` | - |
| `contentType?` | `any` | - |
| `label?` | `string` | The content to be set as base64 encoded string. |

#### Response

``null``

### `mobileShake`

`POST` **`/session/:sessionId/appium/device/shake`**

Shake the device

<!-- comment source: method-signature -->

#### Response

``null``

### `unlock`

`POST` **`/session/:sessionId/appium/device/unlock`**

Unlock the device

<!-- comment source: method-signature -->

#### Response

``null``

### `setValueImmediate`

`POST` **`/session/:sessionId/appium/element/:elementId/value`**

**`Deprecated`**

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `any` |

#### Response

``null``

### `receiveAsyncResponse`

`POST` **`/session/:sessionId/appium/receive_async_response`**

Collect the response of an async script execution

**`Deprecated`**

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `any` |

#### Response

``null``

### `toggleEnrollTouchId`

`POST` **`/session/:sessionId/appium/simulator/toggle_touch_id_enrollment`**

Toggle whether the device is enrolled in the touch ID program

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enabled?` | `any` | `true` |

#### Response

``null``

### `touchId`

`POST` **`/session/:sessionId/appium/simulator/touch_id`**

Trigger a touch/fingerprint match or match failure

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `match` | `any` | `true` |

#### Response

``null``

### `startRecordingScreen`

`POST` **`/session/:sessionId/appium/start_recording_screen`**

Direct Appium to start recording the device screen

Record the display of devices running iOS Simulator since Xcode 9 or real devices since iOS 11
(ffmpeg utility is required: 'brew install ffmpeg').
It records screen activity to a MPEG-4 file. Audio is not recorded with the video file.
If screen recording has been already started then the command will stop it forcefully and start a new one.
The previously recorded video file will be deleted.

**`Throws`**

If screen recording has failed to start.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `any` |

#### Response

`string`

Base64-encoded content of the recorded media file if
                  any screen recording is currently running or an empty string.

### `stopRecordingScreen`

`POST` **`/session/:sessionId/appium/stop_recording_screen`**

Direct Appium to stop screen recording and return the video

If no screen recording process is running then the endpoint will try to get
the recently recorded file. If no previously recorded file is found and no
active screen recording processes are running then the method returns an
empty string.

**`Throws`**

If there was an error while getting the name of a media
                file or the file content cannot be uploaded to the remote
                location.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `any` |

#### Response

``null`` \| `string`

Base64-encoded content of the recorded media
file if `remotePath` parameter is empty or null or an empty string.

### `getLocation`

`GET` **`/session/:sessionId/element/:elementId/location`**

Get the position of an element on screen

**`Deprecated`**

Use XCUITestDriver.getElementRect instead

<!-- comment source: method-signature -->

#### Response

[`Position`](../modules/appium_types.md#position)

The position of the element

### `getLocationInView`

`GET` **`/session/:sessionId/element/:elementId/location_in_view`**

Alias for XCUITestDriver.getLocation

**`Deprecated`**

Use XCUITestDriver.getElementRect instead

<!-- comment source: method-signature -->

#### Response

[`Position`](../modules/appium_types.md#position)

The position of the element

### `getSize`

`GET` **`/session/:sessionId/element/:elementId/size`**

Get the size of an element

<!-- comment source: method-signature -->

#### Response

[`Size`](../modules/appium_types.md#size)

The position of the element

### `submit`

`POST` **`/session/:sessionId/element/:elementId/submit`**

Submit the form an element is in

<!-- comment source: method-signature -->

#### Response

``null``

### `keys`

`POST` **`/session/:sessionId/keys`**

Send keys to the app

**`Deprecated`**

Use XCUITestDriver.setValue instead

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Response

``null``

### `moveTo`

`POST` **`/session/:sessionId/moveto`**

Move the mouse pointer to a particular screen location

**`Deprecated`**

Use XCUITestDriver.performActions instead

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `element?` | `any` | `undefined` | - |
| `xoffset?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | `0` | the element ID if the move is relative to an element |
| `yoffset?` | `number` | `0` | the x offset |

#### Response

``null``

### `asyncScriptTimeout`

`POST` **`/session/:sessionId/timeouts/async_script`**

Alias for XCUITestDriver.scriptTimeoutW3C.

**`Deprecated`**

Use XCUITestDriver.scriptTimeoutW3C instead

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `any` |

#### Response

``null``

### `implicitWait`

`POST` **`/session/:sessionId/timeouts/implicit_wait`**

Set the implicit wait timeout

**`Deprecated`**

Use `timeouts` instead

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `string` \| `number` | the timeout in ms |

#### Response

``null``

### `click`

`POST` **`/session/:sessionId/touch/click`**

Click/tap an element

**`See`**

[https://w3c.github.io/webdriver/#element-click](https://w3c.github.io/webdriver/#element-click)

<!-- comment source: builtin-interface -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `any` |

#### Response

`any`

### `performMultiAction`

`POST` **`/session/:sessionId/touch/multi/perform`**

Perform a set of touch actions

**`Deprecated`**

Use XCUITestDriver.performActions instead

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | `any` |
| `elementId?` | `any` |

#### Response

`unknown`

### `performTouch`

`POST` **`/session/:sessionId/touch/perform`**

Perform a set of touch actions

**`Deprecated`**

Use XCUITestDriver.performActions instead

<!-- comment source: method-signature -->

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | `any` |

#### Response

`unknown`

### `getWindowSize`

`GET` **`/session/:sessionId/window/:windowhandle/size`**

Get the window size

**`Deprecated`**

Use XCUITestDriver.getWindowRect instead.

<!-- comment source: method-signature -->

#### Response

`any`

### `getPageSource`

`GET` **`/session/:sessionId/source`**

Get the current page/app source as HTML/XML

**`See`**

[https://w3c.github.io/webdriver/#get-page-source](https://w3c.github.io/webdriver/#get-page-source)

<!-- comment source: method-signature -->

#### Response

`any`

The UI hierarchy in a platform-appropriate format (e.g., HTML for a web page)

### `createSession`

`POST` **`/session`**

Historically the first two arguments were reserved for JSONWP capabilities.
Appium 2 has dropped the support of these, so now we only accept capability
objects in W3C format and thus allow any of the three arguments to represent
the latter.

**`See`**

[https://w3c.github.io/webdriver/#new-session](https://w3c.github.io/webdriver/#new-session)

<!-- comment source: multiple -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredCapabilities?` | `any` | the new session capabilities |
| `requiredCapabilities?` | `any` | another place the new session capabilities could be sent (typically left undefined) |
| `capabilities?` | `any` | another place the new session capabilities could be sent (typically left undefined) |

#### Response

[`string`, [`DriverCaps`](../modules/appium_types.md#drivercaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>]

The capabilities object representing the created session

### `deleteSession`

`DELETE` **`/session/:sessionId`**

Get session capabilities merged with what WDA reports
This is a library command but needs to call 'super' so can't be on
a helper object

<!-- comment source: method-signature -->

#### Response

{ `udid`: `any`  } & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `app`: { `isString`: ``true``  } ; `autoLaunch`: { `isBoolean`: ``true``  } ; `autoWebview`: { `isBoolean`: ``true``  } ; `automationName`: { `isString`: ``true``  } ; `eventTimings`: { `isBoolean`: ``true``  } ; `fullReset`: { `isBoolean`: ``true``  } ; `language`: { `isString`: ``true``  } ; `locale`: { `isString`: ``true``  } ; `newCommandTimeout`: { `isNumber`: ``true``  } ; `noReset`: { `isBoolean`: ``true``  } ; `orientation`: { `inclusion`: readonly [``"LANDSCAPE"``, ``"PORTRAIT"``]  } ; `platformName`: { `isString`: ``true`` ; `presence`: ``true``  } ; `platformVersion`: { `isString`: ``true``  } ; `printPageSourceOnFindFailure`: { `isBoolean`: ``true``  } ; `udid`: { `isString`: ``true``  } ; `webSocketUrl`: { `isBoolean`: ``true``  }  }\> & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\> & { `error?`: `string` ; `events?`: [`EventHistory`](../interfaces/appium_types.EventHistory.md)  } & [`StringRecord`](../modules/appium_types.md#stringrecord) & [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\>

A session data object

### `getSession`

`GET` **`/session/:sessionId`**

Get session capabilities merged with what WDA reports
This is a library command but needs to call 'super' so can't be on
a helper object

<!-- comment source: multiple -->

#### Response

{ `udid`: `any`  } & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `app`: { `isString`: ``true``  } ; `autoLaunch`: { `isBoolean`: ``true``  } ; `autoWebview`: { `isBoolean`: ``true``  } ; `automationName`: { `isString`: ``true``  } ; `eventTimings`: { `isBoolean`: ``true``  } ; `fullReset`: { `isBoolean`: ``true``  } ; `language`: { `isString`: ``true``  } ; `locale`: { `isString`: ``true``  } ; `newCommandTimeout`: { `isNumber`: ``true``  } ; `noReset`: { `isBoolean`: ``true``  } ; `orientation`: { `inclusion`: readonly [``"LANDSCAPE"``, ``"PORTRAIT"``]  } ; `platformName`: { `isString`: ``true`` ; `presence`: ``true``  } ; `platformVersion`: { `isString`: ``true``  } ; `printPageSourceOnFindFailure`: { `isBoolean`: ``true``  } ; `udid`: { `isString`: ``true``  } ; `webSocketUrl`: { `isBoolean`: ``true``  }  }\> & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\> & { `error?`: `string` ; `events?`: [`EventHistory`](../interfaces/appium_types.EventHistory.md)  } & [`StringRecord`](../modules/appium_types.md#stringrecord) & [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\>

A session data object

### `findElement`

`POST` **`/session/:sessionId/element`**

Find a UI element given a locator strategy and a selector, erroring if it can't be found

**`See`**

[https://w3c.github.io/webdriver/#find-element](https://w3c.github.io/webdriver/#find-element)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `using` | `string` | the locator strategy |
| `value` | `string` | the selector to combine with the strategy to find the specific element |

#### Response

[`Element`](../interfaces/appium_types.Element.md)<`string`\>

The element object encoding the element id which can be used in element-related
commands

### `findElementFromElement`

`POST` **`/session/:sessionId/element/:elementId/element`**

Find a UI element given a locator strategy and a selector, erroring if it can't be found. Only
look for elements among the set of descendants of a given element

**`See`**

[https://w3c.github.io/webdriver/#find-element-from-element](https://w3c.github.io/webdriver/#find-element-from-element)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `using` | `string` | the locator strategy |
| `value` | `string` | the selector to combine with the strategy to find the specific element |

#### Response

[`Element`](../interfaces/appium_types.Element.md)<`string`\>

The element object encoding the element id which can be used in element-related
commands

### `findElementFromShadowRoot`

`POST` **`/session/:sessionId/shadow/:shadowId/element`**

Find an element from a shadow root

**`See`**

[https://w3c.github.io/webdriver/#find-element-from-shadow-root](https://w3c.github.io/webdriver/#find-element-from-shadow-root)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `using` | `string` | the locator strategy |
| `value` | `string` | the selector to combine with the strategy to find the specific elements |

#### Response

[`Element`](../interfaces/appium_types.Element.md)<`string`\>

The element inside the shadow root matching the selector

### `findElements`

`POST` **`/session/:sessionId/elements`**

Find a a list of all UI elements matching a given a locator strategy and a selector

**`See`**

[https://w3c.github.io/webdriver/#find-elements](https://w3c.github.io/webdriver/#find-elements)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `using` | `string` | the locator strategy |
| `value` | `string` | the selector to combine with the strategy to find the specific elements |

#### Response

[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]

A possibly-empty list of element objects

### `findElementsFromElement`

`POST` **`/session/:sessionId/element/:elementId/elements`**

Find a a list of all UI elements matching a given a locator strategy and a selector. Only
look for elements among the set of descendants of a given element

**`See`**

[https://w3c.github.io/webdriver/#find-elements-from-element](https://w3c.github.io/webdriver/#find-elements-from-element)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `using` | `string` | the locator strategy |
| `value` | `string` | the selector to combine with the strategy to find the specific elements |

#### Response

[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]

A possibly-empty list of element objects

### `findElementsFromShadowRoot`

`POST` **`/session/:sessionId/shadow/:shadowId/elements`**

Find elements from a shadow root

**`See`**

[https://w3c.github.io/webdriver/#find-element-from-shadow-root](https://w3c.github.io/webdriver/#find-element-from-shadow-root)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `using` | `string` | the locator strategy |
| `value` | `string` | the selector to combine with the strategy to find the specific elements |

#### Response

[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]

A possibly empty list of elements inside the shadow root matching the selector

### `getLog`

`POST` **`/session/:sessionId/log`**

Get the log for a given log type.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name/key of log type as defined in ILogCommands.supportedLogTypes. |

#### Response

`any`

### `getLog`

`POST` **`/session/:sessionId/se/log`**

Get the log for a given log type.

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name/key of log type as defined in ILogCommands.supportedLogTypes. |

#### Response

`any`

### `getLogEvents`

`POST` **`/session/:sessionId/appium/events`**

Get a list of events that have occurred in the current session

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` \| `string`[] | filter the returned events by including one or more types |

#### Response

[`EventHistory`](../interfaces/appium_types.EventHistory.md) \| `Record`<`string`, `number`\>

The event history for the session

### `getLogTypes`

`GET` **`/session/:sessionId/log/types`**

Get available log types as a list of strings

<!-- comment source: method-signature -->

#### Response

`string`[]

### `getLogTypes`

`GET` **`/session/:sessionId/se/log/types`**

Get available log types as a list of strings

<!-- comment source: method-signature -->

#### Response

`string`[]

### `getSessions`

`GET` **`/sessions`**

Get data for all sessions running on an Appium server

<!-- comment source: method-signature -->

#### Response

[`MultiSessionData`](../interfaces/appium_types.MultiSessionData.md)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>[]

A list of session data objects

### `getSettings`

`GET` **`/session/:sessionId/appium/settings`**

Update the session's settings dictionary with a new settings object

<!-- comment source: method-signature -->

#### Response

``null``

### `updateSettings`

`POST` **`/session/:sessionId/appium/settings`**

Update the session's settings dictionary with a new settings object

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `settings` | [`StringRecord`](../modules/appium_types.md#stringrecord) | A key-value map of setting names to values. Settings not named in the map will not have their value adjusted. |

#### Response

``null``

### `getStatus`

`GET` **`/status`**

**`Summary`**

Retrieve the server's current status.

**`Description`**

Returns information about whether a remote end is in a state in which it can create new sessions and can additionally include arbitrary meta information that is specific to the implementation.

The readiness state is represented by the ready property of the body, which is false if an attempt to create a session at the current time would fail. However, the value true does not guarantee that a New Session command will succeed.

Implementations may optionally include additional meta information as part of the body, but the top-level properties ready and message are reserved and must not be overwritten.

<!-- comment source: builtin-interface -->

#### Examples

<!-- BEGIN:EXAMPLES -->
##### JavaScript
<!-- BEGIN:EXAMPLE lang=JavaScript -->

```js
// webdriver.io example
await driver.status();
```

<!-- END:EXAMPLE -->
##### Python
<!-- BEGIN:EXAMPLE lang=Python -->

```python
driver.get_status()
```

<!-- END:EXAMPLE -->
##### Java
<!-- BEGIN:EXAMPLE lang=Java -->

```java
driver.getStatus();
```

<!-- END:EXAMPLE -->
##### Ruby
<!-- BEGIN:EXAMPLE lang=Ruby -->

```ruby
# ruby_lib example
remote_status

# ruby_lib_core example
@driver.remote_status
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

`Object`

### `getTimeouts`

`GET` **`/session/:sessionId/timeouts`**

Set the various timeouts associated with a session

**`See`**

[https://w3c.github.io/webdriver/#set-timeouts](https://w3c.github.io/webdriver/#set-timeouts)

<!-- comment source: method-signature -->

#### Response

``null``

### `timeouts`

`POST` **`/session/:sessionId/timeouts`**

Set the various timeouts associated with a session

**`See`**

[https://w3c.github.io/webdriver/#set-timeouts](https://w3c.github.io/webdriver/#set-timeouts)

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` | used only for the old (JSONWP) command, the type of the timeout |
| `ms?` | `string` \| `number` | used only for the old (JSONWP) command, the ms for the timeout |
| `script?` | `number` | the number in ms for the script timeout, used for the W3C command |
| `pageLoad?` | `number` | the number in ms for the pageLoad timeout, used for the W3C command |
| `implicit?` | `string` \| `number` | the number in ms for the implicit wait timeout, used for the W3C command |

#### Response

``null``

### `logCustomEvent`

`POST` **`/session/:sessionId/appium/log_event`**

Add a custom-named event to the Appium event log

<!-- comment source: method-signature -->

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vendor` | `string` | the name of the vendor or tool the event belongs to, to namespace the event |
| `event` | `string` | the name of the event itself |

#### Response

``null``

## Execute Methods

### `mobile: activateApp`

Activate the given app on the device under test.

This pushes the app to the foreground if it is running in the background.  An exception is thrown if the app is not install or isn't running.  Nothing is done if the app is already in the foreground.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |

#### Response

``null``

### `mobile: activeAppInfo`

Returns information about the active application.

**`Throws`**

if an error raised by command

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`ActiveAppInfo`

Active app information

### `mobile: alert`

Tries to apply the given action to the currently visible alert.

**`Remarks`**

This should really be separate commands.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `any` |
| `buttonLabel?` | `any` |

#### Response

`void` \| `string`[]

If `action` is `getButtons`, a list of alert button labelsp; otherwise nothing.

### `mobile: backgroundApp`

Close app (simulate device home button). It is possible to restore
the app after the timeout or keep it minimized based on the parameter value.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `seconds?` | `any` |

#### Response

`unknown`

### `mobile: batteryInfo`

Reads the battery information from the device under test.

This endpoint only returns reliable result on real devices.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`BatteryInfo`

The battery info

### `mobile: clearKeychains`

Clears keychains on a simulated device.

**`Throws`**

If current device is not a Simulator or there was an error
while clearing keychains.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: configureLocalization`

Change localization settings on the currently booted simulator

The changed settings are only applied for _newly started_ applications and activities.
Currently running applications will be unchanged. This means, for example, that the keyboard should be hidden and shown again in order to observe the changed layout, and curresponding apps must be restarted in order to observe their interface using the newly set locale/language.

The driver performs no strict checking of the arguments (such as locale names). Be aware that an incorrect or invalid string may cause unexpected behavior.

**`Throws`**

If there was a failure while setting the preferences

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keyboard?` | `any` | - |
| `language?` | `KeyboardOptions` | Keyboard options |
| `locale?` | `LanguageOptions` | Language options |

#### Response

`boolean`

`true` if any of settings has been successfully changed

### `mobile: deepLink`

Opens the given URL with the default application assigned to handle it based on the URL
scheme, or the application provided as an optional parameter

(Note: the version of Xcode must be 14.3+ and iOS must be 16.4+)

**`Since`**

4.17

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `any` |
| `bundleId?` | `any` |

#### Response

``null``

### `mobile: deleteFile`

Delete a remote file from the device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `remotePath` | `any` |

#### Response

``null``

### `mobile: deleteFolder`

Delete a remote folder from the device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `remotePath` | `any` |

#### Response

``null``

### `mobile: deviceInfo`

Returns the miscellaneous information about the device under test.

Since XCUITest driver v4.2.0, this includes device information via lockdown in a real device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`DeviceInfo` \| `DeviceInfo` & `LockdownInfo`

The response of `/wda/device/info'`

### `mobile: deviceScreenInfo`

Get information about the screen.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`ScreenInfo`

### `mobile: disableConditionInducer`

Disable a condition inducer enabled with XCUITestDriver.enableConditionInducer Usually
a persistent connection is maintained after the condition inducer is enabled, and this method
is only valid for the currently enabled connection. If the connection is disconnected, the
condition inducer will be automatically disabled

(Note: this is also automatically called upon session cleanup)

**`Since`**

4.9.0

**`See`**

[https://help.apple.com/xcode/mac/current/#/dev308429d42](https://help.apple.com/xcode/mac/current/#/dev308429d42)

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`boolean`

`true` if disable the condition succeeded

### `mobile: doubleTap`

Performs double tap gesture on the given element or on the screen.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementId?` | `any` | - |
| `x?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to double tap on. This is required if `x` and `y` are not provided. |
| `y?` | `number` | The _x_ coordinate (float value) to double tap on. This is required if `elementId` is not provided. |

#### Example

<!-- BEGIN:EXAMPLES -->
##### JavaScript
<!-- BEGIN:EXAMPLE lang=JavaScript -->

```javascript
// using WebdriverIO
await driver.execute('mobile: doubleTap', {element: element.value.ELEMENT});
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: dragFromToForDuration`

Performs drag and drop gesture by coordinates on the given element or on the screen.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1500989-clickforduration?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `duration` | `any` | - |
| `fromX` | `number` | The duration (in seconds) of the gesture. Must be between `0.5` and `60.0`, inclusive. |
| `fromY` | `number` | The _x_ coordinate (float value) of the starting drag point. |
| `toX` | `number` | The _y_ coordinate (float value) of the starting drag point. |
| `toY` | `number` | The _x_ coordinate (float value) of the ending drag point. |
| `elementId?` | `any` | - |

#### Example

<!-- BEGIN:EXAMPLES -->
##### Java
<!-- BEGIN:EXAMPLE lang=Java -->

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
Map<String, Object> params = new HashMap<>();
params.put("duration", 1.0);
params.put("fromX", 100);
params.put("fromY", 100);
params.put("toX", 200);
params.put("toY", 200);
params.put("element", ((RemoteWebElement) element).getId());
js.executeScript("mobile: dragFromToForDuration", params);
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: dragFromToWithVelocity`

Initiates a press-and-hold gesture, drags to another coordinate or an element with a given velocity, and holds for a given duration.

**`See`**

 - https://developer.apple.com/documentation/xctest/xcuielement/3551693-pressforduration?language=objc
 - https://developer.apple.com/documentation/xctest/xcuicoordinate/3551692-pressforduration?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pressDuration` | `any` | - |
| `holdDuration` | `number` | The duration (in seconds) of the press-and-hold gesture at the starting point. Must be between `0.5` and `60.0`, inclusive. |
| `velocity` | `number` | The duration (in seconds) of the hold gesture at the ending point (after dragging). Must be between `0.5` and `60.0`, inclusive. |
| `fromElementId?` | `any` | - |
| `toElementId?` | `number` | The duration (in seconds) of the press-and-hold gesture at the starting point. Must be between `0.5` and `60.0`, inclusive. |
| `fromX?` | `number` | The duration (in seconds) of the hold gesture at the ending point (after dragging). Must be between `0.5` and `60.0`, inclusive. |
| `fromY?` | `number` | The speed (in pixels-per-second) which to move from the initial position to the end position. |
| `toX?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to drag from. Absolute screen coordinates are expected if this argument is not provided. |
| `toY?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to drag to. Absolute screen coordinates are expected if this argument is not provided. |

#### Response

``null``

### `mobile: enableConditionInducer`

Enable a "condition inducer". You can create a condition on a connected device to test your app under adverse conditions,
such as poor network connectivity or thermal constraints. When you start a device condition,
the operating system on the device behaves as if its environment has changed. The device
condition remains active until you stop the device condition or disconnect the device. For
example, you can start a device condition, run your app, monitor your app’s energy usage, and
then stop the condition.

(Note: the socket needs to remain connected during operation)
(Note: Device conditions are available only for real devices running iOS 13.0 and later.)

**`Throws`**

If you try to start another Condition and the previous Condition has not stopped

**`Since`**

4.9.0

**`See`**

[https://help.apple.com/xcode/mac/current/#/dev308429d42](https://help.apple.com/xcode/mac/current/#/dev308429d42)

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `conditionID` | `any` | - |
| `profileID` | `string` | Determine which condition IDs are available with the [`listConditionInducers`](../classes/appium_xcuitest_driver.XCUITestDriver.md#listconditioninducers) command |

#### Response

`boolean`

`true` if enabling the condition succeeded

### `mobile: enrollBiometric`

Enrolls biometric authentication on a simulated device.

**`Throws`**

If enrollment fails or the device is not a Simulator.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isEnabled?` | `any` | `true` |

#### Response

``null``

### `mobile: expectNotification`

Blocks until the expected notification is delivered.

This method is a thin wrapper over the
[`XCTNSNotificationExpectation`](https://developer.apple.com/documentation/xctest/xctnsnotificationexpectation?language=objc) and
[`XCTDarwinNotificationExpectation`](https://developer.apple.com/documentation/xctest/xctdarwinnotificationexpectation?language=objc) entities.

**`Throws`**

A [`TimeoutError`](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/error_exports_TimeoutError.html) if the expected notification has not been delivered within the given timeout.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `any` | `undefined` | - |
| `type?` | `any` | `undefined` | - |
| `timeoutSeconds?` | `string` | `'plain'` | The name of the notification to expect |

#### Response

`unknown`

### `mobile: forcePress`

Performs a "force press" on the given element or coordinates.

**`Throws`**

If the target device does not support the "force press" gesture.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x?` | `any` | - |
| `y?` | `number` | The _x_ coordinate of the gesture. If `elementId` is set, this is calculated relative to its position; otherwise it's calculated relative to the active Application. |
| `duration?` | `number` | The _y_ coordinate of the gesture. If `elementId` is set, this is calculated relative to its position; otherwise it's calculated relative to the active Application. |
| `pressure?` | `number` | The duraiton (in seconds) of the force press. If this is provided, `pressure` must also be provided. |
| `elementId?` | `number` | A float value defining the pressure of the force press. If this is provided, `duration` must also be provided. |

#### Response

``null``

### `mobile: getAppStrings`

Return the language-specific strings for an app

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `language?` | `any` | `undefined` | - |
| `stringFile?` | `string` | `null` | The language abbreviation to fetch app strings mapping for. If no language is provided then strings for the 'en language would be returned |

#### Response

[`StringRecord`](../modules/appium_types.md#stringrecord)<`string`\>

A record of localized keys to localized text

### `mobile: getAppearance`

Get the device's UI appearance style.

**`Since`**

Xcode SDK 11

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`Object`

### `mobile: getContexts`

Retrieves the list of available contexts.

The list includes extended context information, like URLs and page names.
This is different from the standard `getContexts` API, because the latter
only has web view names without any additional information.

**`Remarks`**

In situations where multiple web views are available at once, the
client code would have to connect to each of them in order to detect the
one which needs to be interacted with. This extra effort is not needed with
the information provided by this extension.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `waitForWebviewMs?` | `any` | `0` |

#### Response

`Context`[]

The list of available context objects along with their properties.

### `mobile: getDeviceTime`

Retrieves the current device time

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `format?` | `any` | `MOMENT_FORMAT_ISO8601` |

#### Response

`string`

Formatted datetime string or the raw command output if formatting fails

### `mobile: getPasteboard`

Gets the Simulator's pasteboard content.

Does not work for real devices.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `encoding?` | `any` | `'utf8'` |

#### Response

`string`

The pasteboard content string

### `mobile: getPermission`

Gets application permission state on a simulated device.

**This method requires [WIX applesimutils](https://github.com/wix/AppleSimulatorUtils) to be installed on the Appium server host.**

**`Throws`**

If permission getting fails or the device is not a Simulator.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleId` | `any` | - |
| `service` | `string` | Bundle identifier of the target application |

#### Response

`PermissionState`

Either 'yes', 'no', 'unset' or 'limited'

### `mobile: getSimulatedLocation`

Retrieves the simulated geolocation value.
Only works since Xcode 14.3/iOS 16.4

**`Throws`**

If the device under test does not support gelolocation simulation.

**`Since`**

4.18

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`GeolocationInfo`

### `mobile: hideKeyboard`

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys?` | `any` | `[]` |

#### Response

``null``

### `mobile: installApp`

Installs the given application to the device under test.

Please ensure the app is built for a correct architecture and is signed with a proper developer signature (for real devices) prior to calling this.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `any` | - |
| `strategy?` | `any` | - |
| `timeoutMs?` | `string` | See docs for `appium:app` capability |

#### Response

``null``

### `mobile: installCertificate`

Installs a custom certificate onto the device.

Since Xcode SDK 11.4, Apple has added a dedicated `simctl` subcommand to quickly handle
certificates on Simulator over CLI.

On real devices (or simulators before Xcode SDK 11.4), Apple provides no "official" way to do this via the command line.  In such a case (and also as a fallback if CLI setup fails), this method tries to wrap the certificate into `.mobileconfig` format, then deploys the wrapped file to the internal HTTP server so that it can be opened via mobile Safari. This command then goes through the profile installation procedure by clicking the necessary buttons using WebDriverAgent.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `any` | - |
| `commonName?` | `any` | - |
| `isRoot?` | `string` | Base64-encoded content of the public certificate in [PEM](https://knowledge.digicert.com/quovadis/ssl-certificates/ssl-general-topics/what-is-pem-format.html) format |

#### Response

`string` \| `void`

The content of the generated `.mobileconfig` file as
a base64-encoded string. This config might be useful for debugging purposes.  If the certificate has been successfully set via CLI, then nothing is returned.

### `mobile: installXCTestBundle`

Installs an XCTest bundle to the device under test.

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** for this command to work.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `xctestApp` | `any` |

#### Response

``null``

### `mobile: isAppInstalled`

Checks whether the given application is installed on the device under test.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |

#### Response

`boolean`

`true` if the application is installed; `false` otherwise

### `mobile: isBiometricEnrolled`

Checks whether the biometric feature is currently enrolled on a simulated device.

**`Throws`**

If the detection fails or the device is not a Simulator.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`boolean`

`true` if biometric is enrolled.

### `mobile: isKeyboardShown`

#### Route

`POST /session/:sessionId/execute`

#### Response

`boolean`

### `mobile: isLocked`

Determine whether the device is locked

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`boolean`

`true` if the device is locked, `false` otherwise

### `mobile: killApp`

Kill the given app on the real device under test by instruments service.

If the app is not running or kill failed, then nothing is done.

**`Remarks`**

`appium-xcuitest-driver` v4.4 does not require `py-ios-device` to be installed.

**`See`**

https://github.com/YueChen-C/py-ios-device

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |

#### Response

`boolean`

`true` if the app has been killed successfully; `false` otherwise

### `mobile: launchApp`

Executes the given app on the device under test.

If the app is already running it will be activated. If the app is not installed or cannot be launched then an exception is thrown.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleId` | `any` | - |
| `arguments?` | `any` | - |
| `environment?` | `string` | The bundle identifier of the application to be launched |

#### Response

``null``

### `mobile: listApps`

List applications installed on the real device under test

Read [Pushing/Pulling files](https://appium.io/docs/en/writing-running-appium/ios/ios-xctest-file-movement/) for more details.

**`Remarks`**

Having `UIFileSharingEnabled` set to `true` in the return app properties map means this app supports file upload/download in its `documents` container.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `applicationType?` | ``"User"`` \| ``"System"`` | `'User'` | The type of applications to list. |

#### Response

`Record`<`string`, `any`\>[]

A list of apps where each item is a mapping of bundle identifiers to maps of platform-specific app properties.

### `mobile: listCertificates`

Returns map of certificates installed on the real device.

This only works _if and only if_ `py-ios-device` is installed on the same machine Appium is running on.

**`Since`**

4.10.0

**`See`**

https://github.com/YueChen-C/py-ios-device

**`Throws`**

If attempting to list certificates for a simulated device or if `py-ios-device` is not installed

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`CertificateList`

An object describing the certificates installed on the real device.

### `mobile: listConditionInducers`

Get all available ConditionInducer configuration information, which can be used with
XCUITestDriver.enableConditionInducer

**`Since`**

4.9.0

**`See`**

[https://help.apple.com/xcode/mac/current/#/dev308429d42](https://help.apple.com/xcode/mac/current/#/dev308429d42)

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`Condition`[]

### `mobile: listXCTestBundles`

List XCTest bundles that are installed on the device.

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** for this command to work.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`string`[]

List of XCTest bundles (e.g.: `XCTesterAppUITests.XCTesterAppUITests/testLaunchPerformance`)

### `mobile: listXCTestsInTestBundle`

List XCTests in a test bundle

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** for this command to work.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundle` | `any` |

#### Response

`string`[]

The list of xctests in the test bundle (e.g., `['XCTesterAppUITests.XCTesterAppUITests/testExample', 'XCTesterAppUITests.XCTesterAppUITests/testLaunchPerformance']`)

### `mobile: lock`

Lock the device (and optionally unlock the device after a certain amount of time)

**`Default Value`**

0

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `seconds?` | `any` |

#### Response

``null``

### `mobile: performAccessibilityAudit`

Performs accessbility audit of the current application according to the given type or multiple types.

**`Since`**

Xcode 15/iOS 17

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `auditTypes?` | `any` |

#### Response

`AccessibilityAuditItem`[]

List of found issues or an empty list

### `mobile: performIoHidEvent`

Emulates triggering of the given low-level IO HID device event.

Popular constants:
- `kHIDPage_Consumer` = `0x0C`
- `kHIDUsage_Csmr_VolumeIncrement` = `0xE9` (Volume Up)
- `kHIDUsage_Csmr_VolumeDecrement` = `0xEA` (Volume Down)
- `kHIDUsage_Csmr_Menu` = `0x40` (Home)
- `kHIDUsage_Csmr_Power` = `0x30` (Power)
- `kHIDUsage_Csmr_Snapshot` = `0x65` (Power + Home)

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `page` | `any` | `undefined` | - |
| `usage` | `HIDPageEvent` | `undefined` | The event page identifier |
| `durationSeconds` | `Object` | `undefined` | The event usage identifier (usages are defined per-page) |
| `durationSeconds.kHIDUsage_AD_ASCIICharacterSet` | `kHIDUsage_AD_ASCIICharacterSet` | `0x21` | - |
| `durationSeconds.kHIDUsage_AD_AlphanumericDisplay` | `kHIDUsage_AD_AlphanumericDisplay` | `0x01` | - |
| `durationSeconds.kHIDUsage_AD_CharacterHeight` | `kHIDUsage_AD_CharacterHeight` | `0x3e` | - |
| `durationSeconds.kHIDUsage_AD_CharacterReport` | `kHIDUsage_AD_CharacterReport` | `0x2b` | - |
| `durationSeconds.kHIDUsage_AD_CharacterSpacingHorizontal` | `kHIDUsage_AD_CharacterSpacingHorizontal` | `0x3f` | - |
| `durationSeconds.kHIDUsage_AD_CharacterSpacingVertical` | `kHIDUsage_AD_CharacterSpacingVertical` | `0x40` | - |
| `durationSeconds.kHIDUsage_AD_CharacterWidth` | `kHIDUsage_AD_CharacterWidth` | `0x3d` | - |
| `durationSeconds.kHIDUsage_AD_ClearDisplay` | `kHIDUsage_AD_ClearDisplay` | `0x25` | - |
| `durationSeconds.kHIDUsage_AD_Column` | `kHIDUsage_AD_Column` | `0x34` | - |
| `durationSeconds.kHIDUsage_AD_Columns` | `kHIDUsage_AD_Columns` | `0x36` | - |
| `durationSeconds.kHIDUsage_AD_CursorBlink` | `kHIDUsage_AD_CursorBlink` | `0x3a` | - |
| `durationSeconds.kHIDUsage_AD_CursorEnable` | `kHIDUsage_AD_CursorEnable` | `0x39` | - |
| `durationSeconds.kHIDUsage_AD_CursorMode` | `kHIDUsage_AD_CursorMode` | `0x38` | - |
| `durationSeconds.kHIDUsage_AD_CursorPixelPositioning` | `kHIDUsage_AD_CursorPixelPositioning` | `0x37` | - |
| `durationSeconds.kHIDUsage_AD_CursorPositionReport` | `kHIDUsage_AD_CursorPositionReport` | `0x32` | - |
| `durationSeconds.kHIDUsage_AD_DataReadBack` | `kHIDUsage_AD_DataReadBack` | `0x22` | - |
| `durationSeconds.kHIDUsage_AD_DisplayAttributesReport` | `kHIDUsage_AD_DisplayAttributesReport` | `0x20` | - |
| `durationSeconds.kHIDUsage_AD_DisplayControlReport` | `kHIDUsage_AD_DisplayControlReport` | `0x24` | - |
| `durationSeconds.kHIDUsage_AD_DisplayData` | `kHIDUsage_AD_DisplayData` | `0x2c` | - |
| `durationSeconds.kHIDUsage_AD_DisplayEnable` | `kHIDUsage_AD_DisplayEnable` | `0x26` | - |
| `durationSeconds.kHIDUsage_AD_DisplayStatus` | `kHIDUsage_AD_DisplayStatus` | `0x2d` | - |
| `durationSeconds.kHIDUsage_AD_ErrFontdatacannotberead` | `kHIDUsage_AD_ErrFontdatacannotberead` | `0x31` | - |
| `durationSeconds.kHIDUsage_AD_ErrNotaloadablecharacter` | `kHIDUsage_AD_ErrNotaloadablecharacter` | `0x30` | - |
| `durationSeconds.kHIDUsage_AD_FontData` | `kHIDUsage_AD_FontData` | `0x3c` | - |
| `durationSeconds.kHIDUsage_AD_FontReadBack` | `kHIDUsage_AD_FontReadBack` | `0x23` | - |
| `durationSeconds.kHIDUsage_AD_FontReport` | `kHIDUsage_AD_FontReport` | `0x3b` | - |
| `durationSeconds.kHIDUsage_AD_HorizontalScroll` | `kHIDUsage_AD_HorizontalScroll` | `0x2a` | - |
| `durationSeconds.kHIDUsage_AD_Reserved` | `kHIDUsage_AD_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_AD_Row` | `kHIDUsage_AD_Row` | `0x33` | - |
| `durationSeconds.kHIDUsage_AD_Rows` | `kHIDUsage_AD_Rows` | `0x35` | - |
| `durationSeconds.kHIDUsage_AD_ScreenSaverDelay` | `kHIDUsage_AD_ScreenSaverDelay` | `0x27` | - |
| `durationSeconds.kHIDUsage_AD_ScreenSaverEnable` | `kHIDUsage_AD_ScreenSaverEnable` | `0x28` | - |
| `durationSeconds.kHIDUsage_AD_StatNotReady` | `kHIDUsage_AD_StatNotReady` | `0x2e` | - |
| `durationSeconds.kHIDUsage_AD_StatReady` | `kHIDUsage_AD_StatReady` | `0x2f` | - |
| `durationSeconds.kHIDUsage_AD_UnicodeCharacterSet` | `kHIDUsage_AD_UnicodeCharacterSet` | `0x41` | - |
| `durationSeconds.kHIDUsage_AD_VerticalScroll` | `kHIDUsage_AD_VerticalScroll` | `0x29` | - |
| `durationSeconds.kHIDUsage_BCS_2DControlReport` | `kHIDUsage_BCS_2DControlReport` | `0x1f` | - |
| `durationSeconds.kHIDUsage_BCS_ActiveTime` | `kHIDUsage_BCS_ActiveTime` | `0x55` | - |
| `durationSeconds.kHIDUsage_BCS_AddEAN2_3LabelDefinition` | `kHIDUsage_BCS_AddEAN2_3LabelDefinition` | `0xbf` | - |
| `durationSeconds.kHIDUsage_BCS_AimDuration` | `kHIDUsage_BCS_AimDuration` | `0x7a` | - |
| `durationSeconds.kHIDUsage_BCS_AimingLaserPattern` | `kHIDUsage_BCS_AimingLaserPattern` | `0x56` | - |
| `durationSeconds.kHIDUsage_BCS_Aiming_PointerMide` | `kHIDUsage_BCS_Aiming_PointerMide` | `0x30` | - |
| `durationSeconds.kHIDUsage_BCS_AttributeReport` | `kHIDUsage_BCS_AttributeReport` | `0x10` | - |
| `durationSeconds.kHIDUsage_BCS_AztecCode` | `kHIDUsage_BCS_AztecCode` | `0x110` | - |
| `durationSeconds.kHIDUsage_BCS_BC412` | `kHIDUsage_BCS_BC412` | `0x111` | - |
| `durationSeconds.kHIDUsage_BCS_BadgeReader` | `kHIDUsage_BCS_BadgeReader` | `0x01` | - |
| `durationSeconds.kHIDUsage_BCS_BarCodePresent` | `kHIDUsage_BCS_BarCodePresent` | `0x57` | - |
| `durationSeconds.kHIDUsage_BCS_BarCodePresentSensor` | `kHIDUsage_BCS_BarCodePresentSensor` | `0x31` | - |
| `durationSeconds.kHIDUsage_BCS_BarCodeScanner` | `kHIDUsage_BCS_BarCodeScanner` | `0x02` | - |
| `durationSeconds.kHIDUsage_BCS_BarCodeScannerCradle` | `kHIDUsage_BCS_BarCodeScannerCradle` | `0x05` | - |
| `durationSeconds.kHIDUsage_BCS_BarSpaceData` | `kHIDUsage_BCS_BarSpaceData` | `0x100` | - |
| `durationSeconds.kHIDUsage_BCS_BeeperState` | `kHIDUsage_BCS_BeeperState` | `0x58` | - |
| `durationSeconds.kHIDUsage_BCS_BooklandEAN` | `kHIDUsage_BCS_BooklandEAN` | `0x91` | - |
| `durationSeconds.kHIDUsage_BCS_ChannelCode` | `kHIDUsage_BCS_ChannelCode` | `0x112` | - |
| `durationSeconds.kHIDUsage_BCS_Check` | `kHIDUsage_BCS_Check` | `0xb0` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigit` | `kHIDUsage_BCS_CheckDigit` | `0xd6` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitCodabarEnable` | `kHIDUsage_BCS_CheckDigitCodabarEnable` | `0xde` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitCode99Enable` | `kHIDUsage_BCS_CheckDigitCode99Enable` | `0xdf` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitDisable` | `kHIDUsage_BCS_CheckDigitDisable` | `0xd7` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` | `0xd8` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` | `0xd9` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitEnableOneMSIPlessey` | `kHIDUsage_BCS_CheckDigitEnableOneMSIPlessey` | `0xdc` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitEnableStandard2of5OPCC` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` | `0xd8` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitEnableStandard2of5USS` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` | `0xd9` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDigitEnableTwoMSIPlessey` | `kHIDUsage_BCS_CheckDigitEnableTwoMSIPlessey` | `0xdd` | - |
| `durationSeconds.kHIDUsage_BCS_CheckDisablePrice` | `kHIDUsage_BCS_CheckDisablePrice` | `0xb1` | - |
| `durationSeconds.kHIDUsage_BCS_CheckEnable4DigitPrice` | `kHIDUsage_BCS_CheckEnable4DigitPrice` | `0xb2` | - |
| `durationSeconds.kHIDUsage_BCS_CheckEnable5DigitPrice` | `kHIDUsage_BCS_CheckEnable5DigitPrice` | `0xb3` | - |
| `durationSeconds.kHIDUsage_BCS_CheckEnableEuropean4DigitPrice` | `kHIDUsage_BCS_CheckEnableEuropean4DigitPrice` | `0xb4` | - |
| `durationSeconds.kHIDUsage_BCS_CheckEnableEuropean5DigitPrice` | `kHIDUsage_BCS_CheckEnableEuropean5DigitPrice` | `0xb5` | - |
| `durationSeconds.kHIDUsage_BCS_Class1ALaser` | `kHIDUsage_BCS_Class1ALaser` | `0x32` | - |
| `durationSeconds.kHIDUsage_BCS_Class2Laser` | `kHIDUsage_BCS_Class2Laser` | `0x33` | - |
| `durationSeconds.kHIDUsage_BCS_ClearAllEAN2_3LabelDefinitions` | `kHIDUsage_BCS_ClearAllEAN2_3LabelDefinitions` | `0xc0` | - |
| `durationSeconds.kHIDUsage_BCS_Codabar` | `kHIDUsage_BCS_Codabar` | `0xc3` | - |
| `durationSeconds.kHIDUsage_BCS_CodabarControlReport` | `kHIDUsage_BCS_CodabarControlReport` | `0x1c` | - |
| `durationSeconds.kHIDUsage_BCS_Code128` | `kHIDUsage_BCS_Code128` | `0xc4` | - |
| `durationSeconds.kHIDUsage_BCS_Code128ControlReport` | `kHIDUsage_BCS_Code128ControlReport` | `0x1d` | - |
| `durationSeconds.kHIDUsage_BCS_Code16` | `kHIDUsage_BCS_Code16` | `0x113` | - |
| `durationSeconds.kHIDUsage_BCS_Code32` | `kHIDUsage_BCS_Code32` | `0x114` | - |
| `durationSeconds.kHIDUsage_BCS_Code39` | `kHIDUsage_BCS_Code39` | `0xc7` | - |
| `durationSeconds.kHIDUsage_BCS_Code39ControlReport` | `kHIDUsage_BCS_Code39ControlReport` | `0x18` | - |
| `durationSeconds.kHIDUsage_BCS_Code49` | `kHIDUsage_BCS_Code49` | `0x115` | - |
| `durationSeconds.kHIDUsage_BCS_Code93` | `kHIDUsage_BCS_Code93` | `0xc8` | - |
| `durationSeconds.kHIDUsage_BCS_CodeOne` | `kHIDUsage_BCS_CodeOne` | `0x116` | - |
| `durationSeconds.kHIDUsage_BCS_Colorcode` | `kHIDUsage_BCS_Colorcode` | `0x117` | - |
| `durationSeconds.kHIDUsage_BCS_CommitParametersToNVM` | `kHIDUsage_BCS_CommitParametersToNVM` | `0x6d` | - |
| `durationSeconds.kHIDUsage_BCS_ConstantElectronicArticleSurveillance` | `kHIDUsage_BCS_ConstantElectronicArticleSurveillance` | `0x37` | - |
| `durationSeconds.kHIDUsage_BCS_ContactScanner` | `kHIDUsage_BCS_ContactScanner` | `0x35` | - |
| `durationSeconds.kHIDUsage_BCS_ConvertEAN8To13Type` | `kHIDUsage_BCS_ConvertEAN8To13Type` | `0x92` | - |
| `durationSeconds.kHIDUsage_BCS_ConvertUPCAToEAN_13` | `kHIDUsage_BCS_ConvertUPCAToEAN_13` | `0x93` | - |
| `durationSeconds.kHIDUsage_BCS_ConvertUPC_EToA` | `kHIDUsage_BCS_ConvertUPC_EToA` | `0x94` | - |
| `durationSeconds.kHIDUsage_BCS_CordlessScannerBase` | `kHIDUsage_BCS_CordlessScannerBase` | `0x04` | - |
| `durationSeconds.kHIDUsage_BCS_DLMethodCheckForDiscrete` | `kHIDUsage_BCS_DLMethodCheckForDiscrete` | `0x10d` | - |
| `durationSeconds.kHIDUsage_BCS_DLMethodCheckInRange` | `kHIDUsage_BCS_DLMethodCheckInRange` | `0x10c` | - |
| `durationSeconds.kHIDUsage_BCS_DLMethodReadAny` | `kHIDUsage_BCS_DLMethodReadAny` | `0x10b` | - |
| `durationSeconds.kHIDUsage_BCS_DataLengthMethod` | `kHIDUsage_BCS_DataLengthMethod` | `0x10a` | - |
| `durationSeconds.kHIDUsage_BCS_DataMatrix` | `kHIDUsage_BCS_DataMatrix` | `0x118` | - |
| `durationSeconds.kHIDUsage_BCS_DataPrefix` | `kHIDUsage_BCS_DataPrefix` | `0x4f` | - |
| `durationSeconds.kHIDUsage_BCS_DecodeDataContinued` | `kHIDUsage_BCS_DecodeDataContinued` | `0xff` | - |
| `durationSeconds.kHIDUsage_BCS_DecodedData` | `kHIDUsage_BCS_DecodedData` | `0xfe` | - |
| `durationSeconds.kHIDUsage_BCS_DisableCheckDigitTransmit` | `kHIDUsage_BCS_DisableCheckDigitTransmit` | `0xf1` | - |
| `durationSeconds.kHIDUsage_BCS_DumbBarCodeScanner` | `kHIDUsage_BCS_DumbBarCodeScanner` | `0x03` | - |
| `durationSeconds.kHIDUsage_BCS_EAN13FlagDigit1` | `kHIDUsage_BCS_EAN13FlagDigit1` | `0xbc` | - |
| `durationSeconds.kHIDUsage_BCS_EAN13FlagDigit2` | `kHIDUsage_BCS_EAN13FlagDigit2` | `0xbd` | - |
| `durationSeconds.kHIDUsage_BCS_EAN13FlagDigit3` | `kHIDUsage_BCS_EAN13FlagDigit3` | `0xbe` | - |
| `durationSeconds.kHIDUsage_BCS_EAN2_3LabelControlReport` | `kHIDUsage_BCS_EAN2_3LabelControlReport` | `0x17` | - |
| `durationSeconds.kHIDUsage_BCS_EAN8FlagDigit1` | `kHIDUsage_BCS_EAN8FlagDigit1` | `0xb9` | - |
| `durationSeconds.kHIDUsage_BCS_EAN8FlagDigit2` | `kHIDUsage_BCS_EAN8FlagDigit2` | `0xba` | - |
| `durationSeconds.kHIDUsage_BCS_EAN8FlagDigit3` | `kHIDUsage_BCS_EAN8FlagDigit3` | `0xbb` | - |
| `durationSeconds.kHIDUsage_BCS_EANThreeLabel` | `kHIDUsage_BCS_EANThreeLabel` | `0xb8` | - |
| `durationSeconds.kHIDUsage_BCS_EANTwoLabel` | `kHIDUsage_BCS_EANTwoLabel` | `0xb7` | - |
| `durationSeconds.kHIDUsage_BCS_EAN_13` | `kHIDUsage_BCS_EAN_13` | `0x95` | - |
| `durationSeconds.kHIDUsage_BCS_EAN_8` | `kHIDUsage_BCS_EAN_8` | `0x96` | - |
| `durationSeconds.kHIDUsage_BCS_EAN_99_128_Mandatory` | `kHIDUsage_BCS_EAN_99_128_Mandatory` | `0x97` | - |
| `durationSeconds.kHIDUsage_BCS_EAN_99_P5_128_Optional` | `kHIDUsage_BCS_EAN_99_P5_128_Optional` | `0x98` | - |
| `durationSeconds.kHIDUsage_BCS_ElectronicArticleSurveillanceNotification` | `kHIDUsage_BCS_ElectronicArticleSurveillanceNotification` | `0x36` | - |
| `durationSeconds.kHIDUsage_BCS_EnableCheckDigitTransmit` | `kHIDUsage_BCS_EnableCheckDigitTransmit` | `0xf2` | - |
| `durationSeconds.kHIDUsage_BCS_ErrorIndication` | `kHIDUsage_BCS_ErrorIndication` | `0x38` | - |
| `durationSeconds.kHIDUsage_BCS_FirstDiscreteLengthToDecode` | `kHIDUsage_BCS_FirstDiscreteLengthToDecode` | `0x108` | - |
| `durationSeconds.kHIDUsage_BCS_FixedBeeper` | `kHIDUsage_BCS_FixedBeeper` | `0x39` | - |
| `durationSeconds.kHIDUsage_BCS_FragmentDecoding` | `kHIDUsage_BCS_FragmentDecoding` | `0x4d` | - |
| `durationSeconds.kHIDUsage_BCS_FullASCIIConversion` | `kHIDUsage_BCS_FullASCIIConversion` | `0xc9` | - |
| `durationSeconds.kHIDUsage_BCS_GRWTIAfterDecode` | `kHIDUsage_BCS_GRWTIAfterDecode` | `0x89` | - |
| `durationSeconds.kHIDUsage_BCS_GRWTIBeep_LampAfterTransmit` | `kHIDUsage_BCS_GRWTIBeep_LampAfterTransmit` | `0x8a` | - |
| `durationSeconds.kHIDUsage_BCS_GRWTINoBeep_LampUseAtAll` | `kHIDUsage_BCS_GRWTINoBeep_LampUseAtAll` | `0x8b` | - |
| `durationSeconds.kHIDUsage_BCS_GoodDecodeIndication` | `kHIDUsage_BCS_GoodDecodeIndication` | `0x3a` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadLED` | `kHIDUsage_BCS_GoodReadLED` | `0x7d` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadLampDuration` | `kHIDUsage_BCS_GoodReadLampDuration` | `0x7b` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadLampIntensity` | `kHIDUsage_BCS_GoodReadLampIntensity` | `0x7c` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadToneFrequency` | `kHIDUsage_BCS_GoodReadToneFrequency` | `0x7e` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadToneLength` | `kHIDUsage_BCS_GoodReadToneLength` | `0x7f` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadToneVolume` | `kHIDUsage_BCS_GoodReadToneVolume` | `0x80` | - |
| `durationSeconds.kHIDUsage_BCS_GoodReadWhenToWrite` | `kHIDUsage_BCS_GoodReadWhenToWrite` | `0x88` | - |
| `durationSeconds.kHIDUsage_BCS_HandsFreeScanning` | `kHIDUsage_BCS_HandsFreeScanning` | `0x3b` | - |
| `durationSeconds.kHIDUsage_BCS_HeaterPresent` | `kHIDUsage_BCS_HeaterPresent` | `0x34` | - |
| `durationSeconds.kHIDUsage_BCS_InitiateBarcodeRead` | `kHIDUsage_BCS_InitiateBarcodeRead` | `0x60` | - |
| `durationSeconds.kHIDUsage_BCS_Interleaved2of5` | `kHIDUsage_BCS_Interleaved2of5` | `0xca` | - |
| `durationSeconds.kHIDUsage_BCS_Interleaved2of5ControlReport` | `kHIDUsage_BCS_Interleaved2of5ControlReport` | `0x19` | - |
| `durationSeconds.kHIDUsage_BCS_IntrinsicallySafe` | `kHIDUsage_BCS_IntrinsicallySafe` | `0x3c` | - |
| `durationSeconds.kHIDUsage_BCS_ItalianPharmacyCode` | `kHIDUsage_BCS_ItalianPharmacyCode` | `0xcb` | - |
| `durationSeconds.kHIDUsage_BCS_KlasseEinsLaser` | `kHIDUsage_BCS_KlasseEinsLaser` | `0x3d` | - |
| `durationSeconds.kHIDUsage_BCS_LaserOnTime` | `kHIDUsage_BCS_LaserOnTime` | `0x59` | - |
| `durationSeconds.kHIDUsage_BCS_LaserState` | `kHIDUsage_BCS_LaserState` | `0x5a` | - |
| `durationSeconds.kHIDUsage_BCS_LockoutTime` | `kHIDUsage_BCS_LockoutTime` | `0x5b` | - |
| `durationSeconds.kHIDUsage_BCS_LongRangeScanner` | `kHIDUsage_BCS_LongRangeScanner` | `0x3e` | - |
| `durationSeconds.kHIDUsage_BCS_MSIPlesseyControlReport` | `kHIDUsage_BCS_MSIPlesseyControlReport` | `0x1b` | - |
| `durationSeconds.kHIDUsage_BCS_MSI_Plessey` | `kHIDUsage_BCS_MSI_Plessey` | `0xcc` | - |
| `durationSeconds.kHIDUsage_BCS_MaxiCode` | `kHIDUsage_BCS_MaxiCode` | `0x119` | - |
| `durationSeconds.kHIDUsage_BCS_MaximumLengthToDecode` | `kHIDUsage_BCS_MaximumLengthToDecode` | `0x107` | - |
| `durationSeconds.kHIDUsage_BCS_MicroPDF` | `kHIDUsage_BCS_MicroPDF` | `0x11a` | - |
| `durationSeconds.kHIDUsage_BCS_MinimumLengthToDecode` | `kHIDUsage_BCS_MinimumLengthToDecode` | `0x106` | - |
| `durationSeconds.kHIDUsage_BCS_MirrorSpeedControl` | `kHIDUsage_BCS_MirrorSpeedControl` | `0x3f` | - |
| `durationSeconds.kHIDUsage_BCS_Misc1DControlReport` | `kHIDUsage_BCS_Misc1DControlReport` | `0x1e` | - |
| `durationSeconds.kHIDUsage_BCS_MotorState` | `kHIDUsage_BCS_MotorState` | `0x5c` | - |
| `durationSeconds.kHIDUsage_BCS_MotorTimeout` | `kHIDUsage_BCS_MotorTimeout` | `0x5d` | - |
| `durationSeconds.kHIDUsage_BCS_MultiRangeScanner` | `kHIDUsage_BCS_MultiRangeScanner` | `0x45` | - |
| `durationSeconds.kHIDUsage_BCS_NoReadMessage` | `kHIDUsage_BCS_NoReadMessage` | `0x82` | - |
| `durationSeconds.kHIDUsage_BCS_NotOnFileIndication` | `kHIDUsage_BCS_NotOnFileIndication` | `0x40` | - |
| `durationSeconds.kHIDUsage_BCS_NotOnFileVolume` | `kHIDUsage_BCS_NotOnFileVolume` | `0x83` | - |
| `durationSeconds.kHIDUsage_BCS_PDF_417` | `kHIDUsage_BCS_PDF_417` | `0x11b` | - |
| `durationSeconds.kHIDUsage_BCS_ParameterScanning` | `kHIDUsage_BCS_ParameterScanning` | `0x6e` | - |
| `durationSeconds.kHIDUsage_BCS_ParametersChanged` | `kHIDUsage_BCS_ParametersChanged` | `0x6f` | - |
| `durationSeconds.kHIDUsage_BCS_Periodical` | `kHIDUsage_BCS_Periodical` | `0xa9` | - |
| `durationSeconds.kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus2` | `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus2` | `0xaa` | - |
| `durationSeconds.kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus5` | `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus5` | `0xad` | - |
| `durationSeconds.kHIDUsage_BCS_PeriodicalIgnorePlus2` | `kHIDUsage_BCS_PeriodicalIgnorePlus2` | `0xac` | - |
| `durationSeconds.kHIDUsage_BCS_PeriodicalIgnorePlus5` | `kHIDUsage_BCS_PeriodicalIgnorePlus5` | `0xaf` | - |
| `durationSeconds.kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus2` | `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus2` | `0xab` | - |
| `durationSeconds.kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus5` | `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus5` | `0xae` | - |
| `durationSeconds.kHIDUsage_BCS_PolarityInvertedBarCode` | `kHIDUsage_BCS_PolarityInvertedBarCode` | `0x103` | - |
| `durationSeconds.kHIDUsage_BCS_PolarityNormalBarCode` | `kHIDUsage_BCS_PolarityInvertedBarCode` | `0x103` | - |
| `durationSeconds.kHIDUsage_BCS_PosiCode` | `kHIDUsage_BCS_PosiCode` | `0x11c` | - |
| `durationSeconds.kHIDUsage_BCS_PowerOnResetScanner` | `kHIDUsage_BCS_PowerOnResetScanner` | `0x5e` | - |
| `durationSeconds.kHIDUsage_BCS_PowerupBeep` | `kHIDUsage_BCS_PowerupBeep` | `0x84` | - |
| `durationSeconds.kHIDUsage_BCS_PrefixAIMI` | `kHIDUsage_BCS_PrefixAIMI` | `0x50` | - |
| `durationSeconds.kHIDUsage_BCS_PrefixNone` | `kHIDUsage_BCS_PrefixNone` | `0x51` | - |
| `durationSeconds.kHIDUsage_BCS_PrefixProprietary` | `kHIDUsage_BCS_PrefixProprietary` | `0x52` | - |
| `durationSeconds.kHIDUsage_BCS_PreventReadOfBarcodes` | `kHIDUsage_BCS_PreventReadOfBarcodes` | `0x5f` | - |
| `durationSeconds.kHIDUsage_BCS_ProgrammableBeeper` | `kHIDUsage_BCS_ProgrammableBeeper` | `0x41` | - |
| `durationSeconds.kHIDUsage_BCS_ProximitySensor` | `kHIDUsage_BCS_ProximitySensor` | `0x46` | - |
| `durationSeconds.kHIDUsage_BCS_QRCode` | `kHIDUsage_BCS_QRCode` | `0x11d` | - |
| `durationSeconds.kHIDUsage_BCS_RawDataPolarity` | `kHIDUsage_BCS_RawDataPolarity` | `0x102` | - |
| `durationSeconds.kHIDUsage_BCS_RawScannedDataReport` | `kHIDUsage_BCS_RawScannedDataReport` | `0x13` | - |
| `durationSeconds.kHIDUsage_BCS_ScannedDataReport` | `kHIDUsage_BCS_ScannedDataReport` | `0x12` | - |
| `durationSeconds.kHIDUsage_BCS_ScannerDataAccuracy` | `kHIDUsage_BCS_ScannerDataAccuracy` | `0x101` | - |
| `durationSeconds.kHIDUsage_BCS_ScannerInCradle` | `kHIDUsage_BCS_ScannerInCradle` | `0x75` | - |
| `durationSeconds.kHIDUsage_BCS_ScannerInRange` | `kHIDUsage_BCS_ScannerInRange` | `0x76` | - |
| `durationSeconds.kHIDUsage_BCS_ScannerReadConfidence` | `kHIDUsage_BCS_ScannerReadConfidence` | `0x4e` | - |
| `durationSeconds.kHIDUsage_BCS_SecondDiscreteLengthToDecode` | `kHIDUsage_BCS_SecondDiscreteLengthToDecode` | `0x109` | - |
| `durationSeconds.kHIDUsage_BCS_SetParameterDefaultValues` | `kHIDUsage_BCS_SetParameterDefaultValues` | `0x70` | - |
| `durationSeconds.kHIDUsage_BCS_SettingsReport` | `kHIDUsage_BCS_SettingsReport` | `0x11` | - |
| `durationSeconds.kHIDUsage_BCS_SoundErrorBeep` | `kHIDUsage_BCS_SoundErrorBeep` | `0x85` | - |
| `durationSeconds.kHIDUsage_BCS_SoundGoodReadBeep` | `kHIDUsage_BCS_SoundGoodReadBeep` | `0x86` | - |
| `durationSeconds.kHIDUsage_BCS_SoundNotOnFileBeep` | `kHIDUsage_BCS_SoundNotOnFileBeep` | `0x87` | - |
| `durationSeconds.kHIDUsage_BCS_Standard2of5` | `kHIDUsage_BCS_Standard2of5` | `0xce` | - |
| `durationSeconds.kHIDUsage_BCS_Standard2of5ControlReport` | `kHIDUsage_BCS_Standard2of5ControlReport` | `0x1a` | - |
| `durationSeconds.kHIDUsage_BCS_Standard2of5IATA` | `kHIDUsage_BCS_Standard2of5IATA` | `0xcd` | - |
| `durationSeconds.kHIDUsage_BCS_StatusReport` | `kHIDUsage_BCS_StatusReport` | `0x15` | - |
| `durationSeconds.kHIDUsage_BCS_SuperCode` | `kHIDUsage_BCS_SuperCode` | `0x11e` | - |
| `durationSeconds.kHIDUsage_BCS_SymbologyIdentifier1` | `kHIDUsage_BCS_SymbologyIdentifier1` | `0xfb` | - |
| `durationSeconds.kHIDUsage_BCS_SymbologyIdentifier2` | `kHIDUsage_BCS_SymbologyIdentifier2` | `0xfc` | - |
| `durationSeconds.kHIDUsage_BCS_SymbologyIdentifier3` | `kHIDUsage_BCS_SymbologyIdentifier3` | `0xfd` | - |
| `durationSeconds.kHIDUsage_BCS_TransmitCheckDigit` | `kHIDUsage_BCS_TransmitCheckDigit` | `0xf0` | - |
| `durationSeconds.kHIDUsage_BCS_TransmitStart_Stop` | `kHIDUsage_BCS_TransmitStart_Stop` | `0xd3` | - |
| `durationSeconds.kHIDUsage_BCS_TriOptic` | `kHIDUsage_BCS_TriOptic` | `0xd4` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerMode` | `kHIDUsage_BCS_TriggerMode` | `0x62` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerModeBlinkingLaserOn` | `kHIDUsage_BCS_TriggerModeBlinkingLaserOn` | `0x63` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerModeContinuousLaserOn` | `kHIDUsage_BCS_TriggerModeContinuousLaserOn` | `0x64` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerModeLaserOnWhilePulled` | `kHIDUsage_BCS_TriggerModeLaserOnWhilePulled` | `0x65` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerModeLaserStaysOnAfterTriggerRelease` | `kHIDUsage_BCS_TriggerModeLaserStaysOnAfterTriggerRelease` | `0x66` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerReport` | `kHIDUsage_BCS_TriggerReport` | `0x14` | - |
| `durationSeconds.kHIDUsage_BCS_TriggerState` | `kHIDUsage_BCS_TriggerState` | `0x61` | - |
| `durationSeconds.kHIDUsage_BCS_Triggerless` | `kHIDUsage_BCS_Triggerless` | `0x42` | - |
| `durationSeconds.kHIDUsage_BCS_UCC_EAN_128` | `kHIDUsage_BCS_UCC_EAN_128` | `0xd5` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_A` | `kHIDUsage_BCS_UPC_A` | `0x9d` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_AWith128Mandatory` | `kHIDUsage_BCS_UPC_AWith128Mandatory` | `0x9e` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_AWith128Optical` | `kHIDUsage_BCS_UPC_AWith128Optical` | `0x9f` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_AWithP5Optional` | `kHIDUsage_BCS_UPC_AWithP5Optional` | `0xa0` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_E` | `kHIDUsage_BCS_UPC_E` | `0xa1` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_E1` | `kHIDUsage_BCS_UPC_E1` | `0xa2` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_EAN` | `kHIDUsage_BCS_UPC_EAN` | `0x9a` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_EANControlReport` | `kHIDUsage_BCS_UPC_EANControlReport` | `0x16` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_EANCouponCode` | `kHIDUsage_BCS_UPC_EANCouponCode` | `0x9b` | - |
| `durationSeconds.kHIDUsage_BCS_UPC_EANPeriodicals` | `kHIDUsage_BCS_UPC_EANPeriodicals` | `0x9c` | - |
| `durationSeconds.kHIDUsage_BCS_USB_5_SlugCode` | `kHIDUsage_BCS_USB_5_SlugCode` | `0x120` | - |
| `durationSeconds.kHIDUsage_BCS_UltraCode` | `kHIDUsage_BCS_UltraCode` | `0x11f` | - |
| `durationSeconds.kHIDUsage_BCS_Undefined` | `kHIDUsage_BCS_Undefined` | `0x00` | - |
| `durationSeconds.kHIDUsage_BCS_VeriCode` | `kHIDUsage_BCS_VeriCode` | `0x121` | - |
| `durationSeconds.kHIDUsage_BCS_Wand` | `kHIDUsage_BCS_Wand` | `0x43` | - |
| `durationSeconds.kHIDUsage_BCS_WaterResistant` | `kHIDUsage_BCS_WaterResistant` | `0x44` | - |
| `durationSeconds.kHIDUsage_BS_ACPresent` | `kHIDUsage_BS_ACPresent` | `0xd0` | - |
| `durationSeconds.kHIDUsage_BS_AbsoluteStateOfCharge` | `kHIDUsage_BS_AbsoluteStateOfCharge` | `0x65` | - |
| `durationSeconds.kHIDUsage_BS_AlarmInhibited` | `kHIDUsage_BS_AlarmInhibited` | `0xd3` | - |
| `durationSeconds.kHIDUsage_BS_AtRate` | `kHIDUsage_BS_AtRate` | `0x2b` | - |
| `durationSeconds.kHIDUsage_BS_AtRateOK` | `kHIDUsage_BS_AtRateOK` | `0x49` | - |
| `durationSeconds.kHIDUsage_BS_AtRateTimeToEmpty` | `kHIDUsage_BS_AtRateTimeToEmpty` | `0x61` | - |
| `durationSeconds.kHIDUsage_BS_AtRateTimeToFull` | `kHIDUsage_BS_AtRateTimeToFull` | `0x60` | - |
| `durationSeconds.kHIDUsage_BS_AverageCurrent` | `kHIDUsage_BS_AverageCurrent` | `0x62` | - |
| `durationSeconds.kHIDUsage_BS_AverageTimeToEmpty` | `kHIDUsage_BS_AverageTimeToEmpty` | `0x69` | - |
| `durationSeconds.kHIDUsage_BS_AverageTimeToFull` | `kHIDUsage_BS_AverageTimeToFull` | `0x6a` | - |
| `durationSeconds.kHIDUsage_BS_BattPackModelLevel` | `kHIDUsage_BS_BattPackModelLevel` | `0x80` | - |
| `durationSeconds.kHIDUsage_BS_BatteryInsertion` | `kHIDUsage_BS_BatteryInsertion` | `0x18` | - |
| `durationSeconds.kHIDUsage_BS_BatteryPresent` | `kHIDUsage_BS_BatteryPresent` | `0xd1` | - |
| `durationSeconds.kHIDUsage_BS_BatterySupported` | `kHIDUsage_BS_BatterySupported` | `0x1b` | - |
| `durationSeconds.kHIDUsage_BS_BelowRemainingCapacityLimit` | `kHIDUsage_BS_BelowRemainingCapacityLimit` | `0x42` | - |
| `durationSeconds.kHIDUsage_BS_BroadcastToCharger` | `kHIDUsage_BS_BroadcastToCharger` | `0x2d` | - |
| `durationSeconds.kHIDUsage_BS_CapacityGranularity1` | `kHIDUsage_BS_CapacityGranularity1` | `0x8d` | - |
| `durationSeconds.kHIDUsage_BS_CapacityGranularity2` | `kHIDUsage_BS_CapacityGranularity2` | `0x8e` | - |
| `durationSeconds.kHIDUsage_BS_CapacityMode` | `kHIDUsage_BS_CapacityMode` | `0x2c` | - |
| `durationSeconds.kHIDUsage_BS_ChargeController` | `kHIDUsage_BS_ChargeController` | `0x2f` | - |
| `durationSeconds.kHIDUsage_BS_ChargerConnection` | `kHIDUsage_BS_ChargerConnection` | `0x17` | - |
| `durationSeconds.kHIDUsage_BS_ChargerSelectorSupport` | `kHIDUsage_BS_ChargerSelectorSupport` | `0xf0` | - |
| `durationSeconds.kHIDUsage_BS_ChargerSpec` | `kHIDUsage_BS_ChargerSpec` | `0xf1` | - |
| `durationSeconds.kHIDUsage_BS_Charging` | `kHIDUsage_BS_Charging` | `0x44` | - |
| `durationSeconds.kHIDUsage_BS_ChargingIndicator` | `kHIDUsage_BS_ChargingIndicator` | `0x1d` | - |
| `durationSeconds.kHIDUsage_BS_ConditioningFlag` | `kHIDUsage_BS_ConditioningFlag` | `0x48` | - |
| `durationSeconds.kHIDUsage_BS_ConnectionToSMBus` | `kHIDUsage_BS_ConnectionToSMBus` | `0x15` | - |
| `durationSeconds.kHIDUsage_BS_CurrentNotRegulated` | `kHIDUsage_BS_CurrentNotRegulated` | `0xda` | - |
| `durationSeconds.kHIDUsage_BS_CurrentOutOfRange` | `kHIDUsage_BS_CurrentOutOfRange` | `0xd9` | - |
| `durationSeconds.kHIDUsage_BS_CycleCount` | `kHIDUsage_BS_CycleCount` | `0x6b` | - |
| `durationSeconds.kHIDUsage_BS_DesignCapacity` | `kHIDUsage_BS_DesignCapacity` | `0x83` | - |
| `durationSeconds.kHIDUsage_BS_Discharging` | `kHIDUsage_BS_Discharging` | `0x45` | - |
| `durationSeconds.kHIDUsage_BS_EnablePolling` | `kHIDUsage_BS_EnablePolling` | `0xc1` | - |
| `durationSeconds.kHIDUsage_BS_FullChargeCapacity` | `kHIDUsage_BS_FullChargeCapacity` | `0x67` | - |
| `durationSeconds.kHIDUsage_BS_FullyCharged` | `kHIDUsage_BS_FullyCharged` | `0x46` | - |
| `durationSeconds.kHIDUsage_BS_FullyDischarged` | `kHIDUsage_BS_FullyDischarged` | `0x47` | - |
| `durationSeconds.kHIDUsage_BS_InhibitCharge` | `kHIDUsage_BS_InhibitCharge` | `0xc0` | - |
| `durationSeconds.kHIDUsage_BS_InternalChargeController` | `kHIDUsage_BS_InternalChargeController` | `0x81` | - |
| `durationSeconds.kHIDUsage_BS_Level2` | `kHIDUsage_BS_Level2` | `0xf2` | - |
| `durationSeconds.kHIDUsage_BS_Level3` | `kHIDUsage_BS_Level3` | `0xf3` | - |
| `durationSeconds.kHIDUsage_BS_ManufacturerAccess` | `kHIDUsage_BS_ManufacturerAccess` | `0x28` | - |
| `durationSeconds.kHIDUsage_BS_ManufacturerData` | `kHIDUsage_BS_ManufacturerData` | `0x8a` | - |
| `durationSeconds.kHIDUsage_BS_ManufacturerDate` | `kHIDUsage_BS_ManufacturerDate` | `0x85` | - |
| `durationSeconds.kHIDUsage_BS_MasterMode` | `kHIDUsage_BS_MasterMode` | `0xdc` | - |
| `durationSeconds.kHIDUsage_BS_Maxerror` | `kHIDUsage_BS_Maxerror` | `0x63` | - |
| `durationSeconds.kHIDUsage_BS_NeedReplacement` | `kHIDUsage_BS_NeedReplacement` | `0x4b` | - |
| `durationSeconds.kHIDUsage_BS_OKToUse` | `kHIDUsage_BS_OKToUse` | `0x1a` | - |
| `durationSeconds.kHIDUsage_BS_OptionalMfgFunction1` | `kHIDUsage_BS_OptionalMfgFunction1` | `0x10` | - |
| `durationSeconds.kHIDUsage_BS_OptionalMfgFunction2` | `kHIDUsage_BS_OptionalMfgFunction2` | `0x11` | - |
| `durationSeconds.kHIDUsage_BS_OptionalMfgFunction3` | `kHIDUsage_BS_OptionalMfgFunction3` | `0x12` | - |
| `durationSeconds.kHIDUsage_BS_OptionalMfgFunction4` | `kHIDUsage_BS_OptionalMfgFunction4` | `0x13` | - |
| `durationSeconds.kHIDUsage_BS_OptionalMfgFunction5` | `kHIDUsage_BS_OptionalMfgFunction5` | `0x14` | - |
| `durationSeconds.kHIDUsage_BS_OutputConnection` | `kHIDUsage_BS_OutputConnection` | `0x16` | - |
| `durationSeconds.kHIDUsage_BS_PowerFail` | `kHIDUsage_BS_PowerFail` | `0xd2` | - |
| `durationSeconds.kHIDUsage_BS_PrimaryBattery` | `kHIDUsage_BS_PrimaryBattery` | `0x2e` | - |
| `durationSeconds.kHIDUsage_BS_PrimaryBatterySupport` | `kHIDUsage_BS_PrimaryBatterySupport` | `0x82` | - |
| `durationSeconds.kHIDUsage_BS_Rechargable` | `kHIDUsage_BS_Rechargable` | `0x8b` | - |
| `durationSeconds.kHIDUsage_BS_RelativeStateOfCharge` | `kHIDUsage_BS_RelativeStateOfCharge` | `0x64` | - |
| `durationSeconds.kHIDUsage_BS_RemainingCapacity` | `kHIDUsage_BS_RemainingCapacity` | `0x66` | - |
| `durationSeconds.kHIDUsage_BS_RemainingCapacityLimit` | `kHIDUsage_BS_RemainingCapacityLimit` | `0x29` | - |
| `durationSeconds.kHIDUsage_BS_RemainingTimeLimit` | `kHIDUsage_BS_RemainingTimeLimit` | `0x2a` | - |
| `durationSeconds.kHIDUsage_BS_RemainingTimeLimitExpired` | `kHIDUsage_BS_RemainingTimeLimitExpired` | `0x43` | - |
| `durationSeconds.kHIDUsage_BS_ResetToZero` | `kHIDUsage_BS_ResetToZero` | `0xc2` | - |
| `durationSeconds.kHIDUsage_BS_RunTimeToEmpty` | `kHIDUsage_BS_RunTimeToEmpty` | `0x68` | - |
| `durationSeconds.kHIDUsage_BS_SMBAlarmWarning` | `kHIDUsage_BS_SMBAlarmWarning` | `0x03` | - |
| `durationSeconds.kHIDUsage_BS_SMBBatteryMode` | `kHIDUsage_BS_SMBBatteryMode` | `0x01` | - |
| `durationSeconds.kHIDUsage_BS_SMBBatteryStatus` | `kHIDUsage_BS_SMBBatteryStatus` | `0x02` | - |
| `durationSeconds.kHIDUsage_BS_SMBChargerMode` | `kHIDUsage_BS_SMBChargerMode` | `0x04` | - |
| `durationSeconds.kHIDUsage_BS_SMBChargerSpecInfo` | `kHIDUsage_BS_SMBChargerSpecInfo` | `0x06` | - |
| `durationSeconds.kHIDUsage_BS_SMBChargerStatus` | `kHIDUsage_BS_SMBChargerStatus` | `0x05` | - |
| `durationSeconds.kHIDUsage_BS_SMBErrorCode` | `kHIDUsage_BS_SMBErrorCode` | `0x4a` | - |
| `durationSeconds.kHIDUsage_BS_SMBSelectorInfo` | `kHIDUsage_BS_SMBSelectorInfo` | `0x09` | - |
| `durationSeconds.kHIDUsage_BS_SMBSelectorPresets` | `kHIDUsage_BS_SMBSelectorPresets` | `0x08` | - |
| `durationSeconds.kHIDUsage_BS_SMBSelectorState` | `kHIDUsage_BS_SMBSelectorState` | `0x07` | - |
| `durationSeconds.kHIDUsage_BS_SelectorRevision` | `kHIDUsage_BS_SelectorRevision` | `0x1c` | - |
| `durationSeconds.kHIDUsage_BS_SerialNumber` | `kHIDUsage_BS_SerialNumber` | `0x86` | - |
| `durationSeconds.kHIDUsage_BS_SpecificationInfo` | `kHIDUsage_BS_SpecificationInfo` | `0x84` | - |
| `durationSeconds.kHIDUsage_BS_TerminateCharge` | `kHIDUsage_BS_TerminateCharge` | `0x40` | - |
| `durationSeconds.kHIDUsage_BS_TerminateDischarge` | `kHIDUsage_BS_TerminateDischarge` | `0x41` | - |
| `durationSeconds.kHIDUsage_BS_ThermistorCold` | `kHIDUsage_BS_ThermistorCold` | `0xd6` | - |
| `durationSeconds.kHIDUsage_BS_ThermistorHot` | `kHIDUsage_BS_ThermistorHot` | `0xd5` | - |
| `durationSeconds.kHIDUsage_BS_ThermistorOverRange` | `kHIDUsage_BS_ThermistorOverRange` | `0xd7` | - |
| `durationSeconds.kHIDUsage_BS_ThermistorUnderRange` | `kHIDUsage_BS_ThermistorUnderRange` | `0xd4` | - |
| `durationSeconds.kHIDUsage_BS_Undefined` | `kHIDUsage_BS_Undefined` | `0x00` | - |
| `durationSeconds.kHIDUsage_BS_Usenext` | `kHIDUsage_BS_Usenext` | `0x19` | - |
| `durationSeconds.kHIDUsage_BS_VoltageNotRegulated` | `kHIDUsage_BS_VoltageNotRegulated` | `0xdb` | - |
| `durationSeconds.kHIDUsage_BS_VoltageOutOfRange` | `kHIDUsage_BS_VoltageOutOfRange` | `0xd8` | - |
| `durationSeconds.kHIDUsage_BS_WarningCapacityLimit` | `kHIDUsage_BS_WarningCapacityLimit` | `0x8c` | - |
| `durationSeconds.kHIDUsage_BS_iDeviceChemistry` | `kHIDUsage_BS_iDeviceChemistry` | `0x89` | - |
| `durationSeconds.kHIDUsage_BS_iDevicename` | `kHIDUsage_BS_iDevicename` | `0x88` | - |
| `durationSeconds.kHIDUsage_BS_iManufacturerName` | `kHIDUsage_BS_iManufacturerName` | `0x87` | - |
| `durationSeconds.kHIDUsage_BS_iOEMInformation` | `kHIDUsage_BS_iOEMInformation` | `0x8f` | - |
| `durationSeconds.kHIDUsage_Button_1` | `kHIDUsage_Button_1` | `0x01` | - |
| `durationSeconds.kHIDUsage_Button_2` | `kHIDUsage_Button_2` | `0x02` | - |
| `durationSeconds.kHIDUsage_Button_3` | `kHIDUsage_Button_3` | `0x03` | - |
| `durationSeconds.kHIDUsage_Button_4` | `kHIDUsage_Button_4` | `0x04` | - |
| `durationSeconds.kHIDUsage_Button_65535` | `kHIDUsage_Button_65535` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Csmr_AC` | `kHIDUsage_Csmr_AC` | `0x21e` | - |
| `durationSeconds.kHIDUsage_Csmr_ACBack` | `kHIDUsage_Csmr_ACBack` | `0x224` | - |
| `durationSeconds.kHIDUsage_Csmr_ACBookmarks` | `kHIDUsage_Csmr_ACBookmarks` | `0x22a` | - |
| `durationSeconds.kHIDUsage_Csmr_ACClose` | `kHIDUsage_Csmr_ACClose` | `0x203` | - |
| `durationSeconds.kHIDUsage_Csmr_ACCopy` | `kHIDUsage_Csmr_ACCopy` | `0x21b` | - |
| `durationSeconds.kHIDUsage_Csmr_ACCut` | `kHIDUsage_Csmr_ACCut` | `0x21c` | - |
| `durationSeconds.kHIDUsage_Csmr_ACExit` | `kHIDUsage_Csmr_ACExit` | `0x204` | - |
| `durationSeconds.kHIDUsage_Csmr_ACFind` | `kHIDUsage_Csmr_ACFind` | `0x21f` | - |
| `durationSeconds.kHIDUsage_Csmr_ACFindandReplace` | `kHIDUsage_Csmr_ACFindandReplace` | `0x220` | - |
| `durationSeconds.kHIDUsage_Csmr_ACFormat` | `kHIDUsage_Csmr_ACFormat` | `0x23c` | - |
| `durationSeconds.kHIDUsage_Csmr_ACForward` | `kHIDUsage_Csmr_ACForward` | `0x225` | - |
| `durationSeconds.kHIDUsage_Csmr_ACFullScreenView` | `kHIDUsage_Csmr_ACFullScreenView` | `0x230` | - |
| `durationSeconds.kHIDUsage_Csmr_ACGoTo` | `kHIDUsage_Csmr_ACGoTo` | `0x222` | - |
| `durationSeconds.kHIDUsage_Csmr_ACHistory` | `kHIDUsage_Csmr_ACHistory` | `0x22b` | - |
| `durationSeconds.kHIDUsage_Csmr_ACHome` | `kHIDUsage_Csmr_ACHome` | `0x223` | - |
| `durationSeconds.kHIDUsage_Csmr_ACMaximize` | `kHIDUsage_Csmr_ACMaximize` | `0x205` | - |
| `durationSeconds.kHIDUsage_Csmr_ACMinimize` | `kHIDUsage_Csmr_ACMinimize` | `0x206` | - |
| `durationSeconds.kHIDUsage_Csmr_ACNew` | `kHIDUsage_Csmr_ACNew` | `0x201` | - |
| `durationSeconds.kHIDUsage_Csmr_ACNewWindow` | `kHIDUsage_Csmr_ACNewWindow` | `0x239` | - |
| `durationSeconds.kHIDUsage_Csmr_ACNextLink` | `kHIDUsage_Csmr_ACNextLink` | `0x229` | - |
| `durationSeconds.kHIDUsage_Csmr_ACNormalView` | `kHIDUsage_Csmr_ACNormalView` | `0x231` | - |
| `durationSeconds.kHIDUsage_Csmr_ACOpen` | `kHIDUsage_Csmr_ACOpen` | `0x202` | - |
| `durationSeconds.kHIDUsage_Csmr_ACPan` | `kHIDUsage_Csmr_ACPan` | `0x238` | - |
| `durationSeconds.kHIDUsage_Csmr_ACPanLeft` | `kHIDUsage_Csmr_ACPanLeft` | `0x236` | - |
| `durationSeconds.kHIDUsage_Csmr_ACPanRight` | `kHIDUsage_Csmr_ACPanRight` | `0x237` | - |
| `durationSeconds.kHIDUsage_Csmr_ACPaste` | `kHIDUsage_Csmr_ACPaste` | `0x21d` | - |
| `durationSeconds.kHIDUsage_Csmr_ACPreviousLink` | `kHIDUsage_Csmr_ACPreviousLink` | `0x228` | - |
| `durationSeconds.kHIDUsage_Csmr_ACPrint` | `kHIDUsage_Csmr_ACPrint` | `0x208` | - |
| `durationSeconds.kHIDUsage_Csmr_ACProperties` | `kHIDUsage_Csmr_ACProperties` | `0x209` | - |
| `durationSeconds.kHIDUsage_Csmr_ACRefresh` | `kHIDUsage_Csmr_ACRefresh` | `0x227` | - |
| `durationSeconds.kHIDUsage_Csmr_ACSave` | `kHIDUsage_Csmr_ACSave` | `0x207` | - |
| `durationSeconds.kHIDUsage_Csmr_ACScroll` | `kHIDUsage_Csmr_ACScroll` | `0x235` | - |
| `durationSeconds.kHIDUsage_Csmr_ACScrollDown` | `kHIDUsage_Csmr_ACScrollDown` | `0x234` | - |
| `durationSeconds.kHIDUsage_Csmr_ACScrollUp` | `kHIDUsage_Csmr_ACScrollUp` | `0x233` | - |
| `durationSeconds.kHIDUsage_Csmr_ACSearch` | `kHIDUsage_Csmr_ACSearch` | `0x221` | - |
| `durationSeconds.kHIDUsage_Csmr_ACStop` | `kHIDUsage_Csmr_ACStop` | `0x226` | - |
| `durationSeconds.kHIDUsage_Csmr_ACSubscriptions` | `kHIDUsage_Csmr_ACSubscriptions` | `0x22c` | - |
| `durationSeconds.kHIDUsage_Csmr_ACTileHorizontally` | `kHIDUsage_Csmr_ACTileHorizontally` | `0x23a` | - |
| `durationSeconds.kHIDUsage_Csmr_ACTileVertically` | `kHIDUsage_Csmr_ACTileVertically` | `0x23b` | - |
| `durationSeconds.kHIDUsage_Csmr_ACUndo` | `kHIDUsage_Csmr_ACUndo` | `0x21a` | - |
| `durationSeconds.kHIDUsage_Csmr_ACViewToggle` | `kHIDUsage_Csmr_ACViewToggle` | `0x232` | - |
| `durationSeconds.kHIDUsage_Csmr_ACZoom` | `kHIDUsage_Csmr_ACZoom` | `0x22f` | - |
| `durationSeconds.kHIDUsage_Csmr_ACZoomIn` | `kHIDUsage_Csmr_ACZoomIn` | `0x22d` | - |
| `durationSeconds.kHIDUsage_Csmr_ACZoomOut` | `kHIDUsage_Csmr_ACZoomOut` | `0x22e` | - |
| `durationSeconds.kHIDUsage_Csmr_AL` | `kHIDUsage_Csmr_AL` | `0x1a2` | - |
| `durationSeconds.kHIDUsage_Csmr_ALAOrVCaptureOrPlayback` | `kHIDUsage_Csmr_ALAOrVCaptureOrPlayback` | `0x193` | - |
| `durationSeconds.kHIDUsage_Csmr_ALAlarms` | `kHIDUsage_Csmr_ALAlarms` | `0x1b2` | - |
| `durationSeconds.kHIDUsage_Csmr_ALCalculator` | `kHIDUsage_Csmr_ALCalculator` | `0x192` | - |
| `durationSeconds.kHIDUsage_Csmr_ALCalendarOrSchedule` | `kHIDUsage_Csmr_ALCalendarOrSchedule` | `0x18e` | - |
| `durationSeconds.kHIDUsage_Csmr_ALCheckbookOrFinance` | `kHIDUsage_Csmr_ALCheckbookOrFinance` | `0x191` | - |
| `durationSeconds.kHIDUsage_Csmr_ALClock` | `kHIDUsage_Csmr_ALClock` | `0x1b3` | - |
| `durationSeconds.kHIDUsage_Csmr_ALCommandLineProcessorOrRun` | `kHIDUsage_Csmr_ALCommandLineProcessorOrRun` | `0x1a0` | - |
| `durationSeconds.kHIDUsage_Csmr_ALConsumerControlConfiguration` | `kHIDUsage_Csmr_ALConsumerControlConfiguration` | `0x183` | - |
| `durationSeconds.kHIDUsage_Csmr_ALContactsOrAddressBook` | `kHIDUsage_Csmr_ALContactsOrAddressBook` | `0x18d` | - |
| `durationSeconds.kHIDUsage_Csmr_ALControlPanel` | `kHIDUsage_Csmr_ALControlPanel` | `0x19f` | - |
| `durationSeconds.kHIDUsage_Csmr_ALDatabaseApp` | `kHIDUsage_Csmr_ALDatabaseApp` | `0x189` | - |
| `durationSeconds.kHIDUsage_Csmr_ALDesktop` | `kHIDUsage_Csmr_ALDesktop` | `0x1aa` | - |
| `durationSeconds.kHIDUsage_Csmr_ALDictionary` | `kHIDUsage_Csmr_ALDictionary` | `0x1a9` | - |
| `durationSeconds.kHIDUsage_Csmr_ALDocuments` | `kHIDUsage_Csmr_ALDocuments` | `0x1a7` | - |
| `durationSeconds.kHIDUsage_Csmr_ALEmailReader` | `kHIDUsage_Csmr_ALEmailReader` | `0x18a` | - |
| `durationSeconds.kHIDUsage_Csmr_ALEncryption` | `kHIDUsage_Csmr_ALEncryption` | `0x1b0` | - |
| `durationSeconds.kHIDUsage_Csmr_ALFileBrowser` | `kHIDUsage_Csmr_ALFileBrowser` | `0x1b4` | - |
| `durationSeconds.kHIDUsage_Csmr_ALGrammerCheck` | `kHIDUsage_Csmr_ALGrammerCheck` | `0x1ac` | - |
| `durationSeconds.kHIDUsage_Csmr_ALGraphicsEditor` | `kHIDUsage_Csmr_ALGraphicsEditor` | `0x187` | - |
| `durationSeconds.kHIDUsage_Csmr_ALIntegratedHelpCenter` | `kHIDUsage_Csmr_ALIntegratedHelpCenter` | `0x1a6` | - |
| `durationSeconds.kHIDUsage_Csmr_ALInternetBrowser` | `kHIDUsage_Csmr_ALInternetBrowser` | `0x196` | - |
| `durationSeconds.kHIDUsage_Csmr_ALKeyboardLayout` | `kHIDUsage_Csmr_ALKeyboardLayout` | `0x1ae` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLANOrWANBrowser` | `kHIDUsage_Csmr_ALLANOrWANBrowser` | `0x195` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLaunchButtonConfigurationTool` | `kHIDUsage_Csmr_ALLaunchButtonConfigurationTool` | `0x181` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLocalMachineBrowser` | `kHIDUsage_Csmr_ALLocalMachineBrowser` | `0x194` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLogOrJournalOrTimecard` | `kHIDUsage_Csmr_ALLogOrJournalOrTimecard` | `0x190` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLogoff` | `kHIDUsage_Csmr_ALLogoff` | `0x19c` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLogon` | `kHIDUsage_Csmr_ALLogon` | `0x19b` | - |
| `durationSeconds.kHIDUsage_Csmr_ALLogonOrLogoff` | `kHIDUsage_Csmr_ALLogonOrLogoff` | `0x19d` | - |
| `durationSeconds.kHIDUsage_Csmr_ALNetworkChat` | `kHIDUsage_Csmr_ALNetworkChat` | `0x199` | - |
| `durationSeconds.kHIDUsage_Csmr_ALNetworkConference` | `kHIDUsage_Csmr_ALNetworkConference` | `0x198` | - |
| `durationSeconds.kHIDUsage_Csmr_ALNewsreader` | `kHIDUsage_Csmr_ALNewsreader` | `0x18b` | - |
| `durationSeconds.kHIDUsage_Csmr_ALNextTaskOrApplication` | `kHIDUsage_Csmr_ALNextTaskOrApplication` | `0x1a3` | - |
| `durationSeconds.kHIDUsage_Csmr_ALPowerStatus` | `kHIDUsage_Csmr_ALPowerStatus` | `0x1b5` | - |
| `durationSeconds.kHIDUsage_Csmr_ALPreemptiveHaltTaskOrApplication` | `kHIDUsage_Csmr_ALPreemptiveHaltTaskOrApplication` | `0x1a5` | - |
| `durationSeconds.kHIDUsage_Csmr_ALPresentationApp` | `kHIDUsage_Csmr_ALPresentationApp` | `0x188` | - |
| `durationSeconds.kHIDUsage_Csmr_ALPreviousTaskOrApplication` | `kHIDUsage_Csmr_ALPreviousTaskOrApplication` | `0x1a4` | - |
| `durationSeconds.kHIDUsage_Csmr_ALProcessOrTaskManager` | `kHIDUsage_Csmr_ALProcessOrTaskManager` | `0x1a1` | - |
| `durationSeconds.kHIDUsage_Csmr_ALProgrammableButtonConfiguration` | `kHIDUsage_Csmr_ALProgrammableButtonConfiguration` | `0x182` | - |
| `durationSeconds.kHIDUsage_Csmr_ALRemoteNetworkingOrISPConnect` | `kHIDUsage_Csmr_ALRemoteNetworkingOrISPConnect` | `0x197` | - |
| `durationSeconds.kHIDUsage_Csmr_ALScreenSaver` | `kHIDUsage_Csmr_ALScreenSaver` | `0x1b1` | - |
| `durationSeconds.kHIDUsage_Csmr_ALSpellCheck` | `kHIDUsage_Csmr_ALSpellCheck` | `0x1ab` | - |
| `durationSeconds.kHIDUsage_Csmr_ALSpreadsheet` | `kHIDUsage_Csmr_ALSpreadsheet` | `0x186` | - |
| `durationSeconds.kHIDUsage_Csmr_ALTaskOrProjectManager` | `kHIDUsage_Csmr_ALTaskOrProjectManager` | `0x18f` | - |
| `durationSeconds.kHIDUsage_Csmr_ALTelephonyOrDialer` | `kHIDUsage_Csmr_ALTelephonyOrDialer` | `0x19a` | - |
| `durationSeconds.kHIDUsage_Csmr_ALTerminalLockOrScreensaver` | `kHIDUsage_Csmr_ALTerminalLockOrScreensaver` | `0x19e` | - |
| `durationSeconds.kHIDUsage_Csmr_ALTextEditor` | `kHIDUsage_Csmr_ALTextEditor` | `0x185` | - |
| `durationSeconds.kHIDUsage_Csmr_ALThesaurus` | `kHIDUsage_Csmr_ALThesaurus` | `0x1a8` | - |
| `durationSeconds.kHIDUsage_Csmr_ALVirusProtection` | `kHIDUsage_Csmr_ALVirusProtection` | `0x1af` | - |
| `durationSeconds.kHIDUsage_Csmr_ALVoicemail` | `kHIDUsage_Csmr_ALVoicemail` | `0x18c` | - |
| `durationSeconds.kHIDUsage_Csmr_ALWirelessStatus` | `kHIDUsage_Csmr_ALWirelessStatus` | `0x1ad` | - |
| `durationSeconds.kHIDUsage_Csmr_ALWordProcessor` | `kHIDUsage_Csmr_ALWordProcessor` | `0x184` | - |
| `durationSeconds.kHIDUsage_Csmr_AMOrPM` | `kHIDUsage_Csmr_AMOrPM` | `0x22` | - |
| `durationSeconds.kHIDUsage_Csmr_AlternateAudioDecrement` | `kHIDUsage_Csmr_AlternateAudioDecrement` | `0x174` | - |
| `durationSeconds.kHIDUsage_Csmr_AlternateAudioIncrement` | `kHIDUsage_Csmr_AlternateAudioIncrement` | `0x173` | - |
| `durationSeconds.kHIDUsage_Csmr_ApplicationLaunchButtons` | `kHIDUsage_Csmr_ApplicationLaunchButtons` | `0x180` | - |
| `durationSeconds.kHIDUsage_Csmr_Assign` | `kHIDUsage_Csmr_Assign` | `0x81` | - |
| `durationSeconds.kHIDUsage_Csmr_Balance` | `kHIDUsage_Csmr_Balance` | `0xe1` | - |
| `durationSeconds.kHIDUsage_Csmr_BalanceLeft` | `kHIDUsage_Csmr_BalanceLeft` | `0x151` | - |
| `durationSeconds.kHIDUsage_Csmr_BalanceRight` | `kHIDUsage_Csmr_BalanceRight` | `0x150` | - |
| `durationSeconds.kHIDUsage_Csmr_Bass` | `kHIDUsage_Csmr_Bass` | `0xe3` | - |
| `durationSeconds.kHIDUsage_Csmr_BassBoost` | `kHIDUsage_Csmr_BassBoost` | `0xe5` | - |
| `durationSeconds.kHIDUsage_Csmr_BassDecrement` | `kHIDUsage_Csmr_BassDecrement` | `0x153` | - |
| `durationSeconds.kHIDUsage_Csmr_BassIncrement` | `kHIDUsage_Csmr_BassIncrement` | `0x152` | - |
| `durationSeconds.kHIDUsage_Csmr_BroadcastMode` | `kHIDUsage_Csmr_BroadcastMode` | `0x64` | - |
| `durationSeconds.kHIDUsage_Csmr_Channel` | `kHIDUsage_Csmr_Channel` | `0x86` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelCenter` | `kHIDUsage_Csmr_ChannelCenter` | `0x163` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelCenterFront` | `kHIDUsage_Csmr_ChannelCenterFront` | `0x165` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelDecrement` | `kHIDUsage_Csmr_ChannelDecrement` | `0x9d` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelFront` | `kHIDUsage_Csmr_ChannelFront` | `0x164` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelIncrement` | `kHIDUsage_Csmr_ChannelIncrement` | `0x9c` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelLeft` | `kHIDUsage_Csmr_ChannelLeft` | `0x161` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelLowFrequencyEnhancement` | `kHIDUsage_Csmr_ChannelLowFrequencyEnhancement` | `0x168` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelRight` | `kHIDUsage_Csmr_ChannelRight` | `0x162` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelSide` | `kHIDUsage_Csmr_ChannelSide` | `0x166` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelSurround` | `kHIDUsage_Csmr_ChannelSurround` | `0x167` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelTop` | `kHIDUsage_Csmr_ChannelTop` | `0x169` | - |
| `durationSeconds.kHIDUsage_Csmr_ChannelUnknown` | `kHIDUsage_Csmr_ChannelUnknown` | `0x16a` | - |
| `durationSeconds.kHIDUsage_Csmr_ClearMark` | `kHIDUsage_Csmr_ClearMark` | `0xc3` | - |
| `durationSeconds.kHIDUsage_Csmr_ClimateControlEnable` | `kHIDUsage_Csmr_ClimateControlEnable` | `0x104` | - |
| `durationSeconds.kHIDUsage_Csmr_ClosedCaption` | `kHIDUsage_Csmr_ClosedCaption` | `0x61` | - |
| `durationSeconds.kHIDUsage_Csmr_ClosedCaptionSelect` | `kHIDUsage_Csmr_ClosedCaptionSelect` | `0x62` | - |
| `durationSeconds.kHIDUsage_Csmr_ConsumerControl` | `kHIDUsage_Csmr_ConsumerControl` | `0x01` | - |
| `durationSeconds.kHIDUsage_Csmr_CounterReset` | `kHIDUsage_Csmr_CounterReset` | `0xc8` | - |
| `durationSeconds.kHIDUsage_Csmr_Daily` | `kHIDUsage_Csmr_Daily` | `0xa2` | - |
| `durationSeconds.kHIDUsage_Csmr_DataOnScreen` | `kHIDUsage_Csmr_DataOnScreen` | `0x60` | - |
| `durationSeconds.kHIDUsage_Csmr_Eject` | `kHIDUsage_Csmr_Eject` | `0xb8` | - |
| `durationSeconds.kHIDUsage_Csmr_EnterChannel` | `kHIDUsage_Csmr_EnterChannel` | `0x84` | - |
| `durationSeconds.kHIDUsage_Csmr_EnterDisc` | `kHIDUsage_Csmr_EnterDisc` | `0xbb` | - |
| `durationSeconds.kHIDUsage_Csmr_ExtendedPlay` | `kHIDUsage_Csmr_ExtendedPlay` | `0xf4` | - |
| `durationSeconds.kHIDUsage_Csmr_FanEnable` | `kHIDUsage_Csmr_FanEnable` | `0x100` | - |
| `durationSeconds.kHIDUsage_Csmr_FanSpeed` | `kHIDUsage_Csmr_FanSpeed` | `0x101` | - |
| `durationSeconds.kHIDUsage_Csmr_FastForward` | `kHIDUsage_Csmr_FastForward` | `0xb3` | - |
| `durationSeconds.kHIDUsage_Csmr_FireAlarm` | `kHIDUsage_Csmr_FireAlarm` | `0x107` | - |
| `durationSeconds.kHIDUsage_Csmr_FrameBack` | `kHIDUsage_Csmr_FrameBack` | `0xc1` | - |
| `durationSeconds.kHIDUsage_Csmr_FrameForward` | `kHIDUsage_Csmr_FrameForward` | `0xc0` | - |
| `durationSeconds.kHIDUsage_Csmr_FunctionButtons` | `kHIDUsage_Csmr_FunctionButtons` | `0x36` | - |
| `durationSeconds.kHIDUsage_Csmr_GenericGUIApplicationControls` | `kHIDUsage_Csmr_GenericGUIApplicationControls` | `0x200` | - |
| `durationSeconds.kHIDUsage_Csmr_Help` | `kHIDUsage_Csmr_Help` | `0x95` | - |
| `durationSeconds.kHIDUsage_Csmr_Illumination` | `kHIDUsage_Csmr_Illumination` | `0x35` | - |
| `durationSeconds.kHIDUsage_Csmr_LightEnable` | `kHIDUsage_Csmr_LightEnable` | `0x102` | - |
| `durationSeconds.kHIDUsage_Csmr_LightIlluminationLevel` | `kHIDUsage_Csmr_LightIlluminationLevel` | `0x103` | - |
| `durationSeconds.kHIDUsage_Csmr_LongPlay` | `kHIDUsage_Csmr_LongPlay` | `0xf3` | - |
| `durationSeconds.kHIDUsage_Csmr_Loudness` | `kHIDUsage_Csmr_Loudness` | `0xe7` | - |
| `durationSeconds.kHIDUsage_Csmr_MPX` | `kHIDUsage_Csmr_MPX` | `0xe8` | - |
| `durationSeconds.kHIDUsage_Csmr_Mark` | `kHIDUsage_Csmr_Mark` | `0xc2` | - |
| `durationSeconds.kHIDUsage_Csmr_Media` | `kHIDUsage_Csmr_Media` | `0x9e` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectCD` | `kHIDUsage_Csmr_MediaSelectCD` | `0x91` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectCable` | `kHIDUsage_Csmr_MediaSelectCable` | `0x97` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectCall` | `kHIDUsage_Csmr_MediaSelectCall` | `0x9b` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectComputer` | `kHIDUsage_Csmr_MediaSelectComputer` | `0x88` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectDVD` | `kHIDUsage_Csmr_MediaSelectDVD` | `0x8b` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectGames` | `kHIDUsage_Csmr_MediaSelectGames` | `0x8f` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectHome` | `kHIDUsage_Csmr_MediaSelectHome` | `0x9a` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectMessages` | `kHIDUsage_Csmr_MediaSelectMessages` | `0x90` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectProgramGuide` | `kHIDUsage_Csmr_MediaSelectProgramGuide` | `0x8d` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectSatellite` | `kHIDUsage_Csmr_MediaSelectSatellite` | `0x98` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectSecurity` | `kHIDUsage_Csmr_MediaSelectSecurity` | `0x99` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectTV` | `kHIDUsage_Csmr_MediaSelectTV` | `0x89` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectTape` | `kHIDUsage_Csmr_MediaSelectTape` | `0x96` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectTelephone` | `kHIDUsage_Csmr_MediaSelectTelephone` | `0x8c` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectTuner` | `kHIDUsage_Csmr_MediaSelectTuner` | `0x93` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectVCR` | `kHIDUsage_Csmr_MediaSelectVCR` | `0x92` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectVideoPhone` | `kHIDUsage_Csmr_MediaSelectVideoPhone` | `0x8e` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelectWWW` | `kHIDUsage_Csmr_MediaSelectWWW` | `0x8a` | - |
| `durationSeconds.kHIDUsage_Csmr_MediaSelection` | `kHIDUsage_Csmr_MediaSelection` | `0x87` | - |
| `durationSeconds.kHIDUsage_Csmr_Menu` | `kHIDUsage_Csmr_Menu` | `0x40` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuDown` | `kHIDUsage_Csmr_MenuDown` | `0x43` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuEscape` | `kHIDUsage_Csmr_MenuEscape` | `0x46` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuLeft` | `kHIDUsage_Csmr_MenuLeft` | `0x44` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuPick` | `kHIDUsage_Csmr_MenuPick` | `0x41` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuRight` | `kHIDUsage_Csmr_MenuRight` | `0x45` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuUp` | `kHIDUsage_Csmr_MenuUp` | `0x42` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuValueDecrease` | `kHIDUsage_Csmr_MenuValueDecrease` | `0x48` | - |
| `durationSeconds.kHIDUsage_Csmr_MenuValueIncrease` | `kHIDUsage_Csmr_MenuValueIncrease` | `0x47` | - |
| `durationSeconds.kHIDUsage_Csmr_ModeStep` | `kHIDUsage_Csmr_ModeStep` | `0x82` | - |
| `durationSeconds.kHIDUsage_Csmr_Monthly` | `kHIDUsage_Csmr_Monthly` | `0xa4` | - |
| `durationSeconds.kHIDUsage_Csmr_Mute` | `kHIDUsage_Csmr_Mute` | `0xe2` | - |
| `durationSeconds.kHIDUsage_Csmr_NumericKeyPad` | `kHIDUsage_Csmr_NumericKeyPad` | `0x02` | - |
| `durationSeconds.kHIDUsage_Csmr_Once` | `kHIDUsage_Csmr_Once` | `0xa1` | - |
| `durationSeconds.kHIDUsage_Csmr_OrderMovie` | `kHIDUsage_Csmr_OrderMovie` | `0x85` | - |
| `durationSeconds.kHIDUsage_Csmr_Pause` | `kHIDUsage_Csmr_Pause` | `0xb1` | - |
| `durationSeconds.kHIDUsage_Csmr_Play` | `kHIDUsage_Csmr_Play` | `0xb0` | - |
| `durationSeconds.kHIDUsage_Csmr_PlayOrPause` | `kHIDUsage_Csmr_PlayOrPause` | `0xcd` | - |
| `durationSeconds.kHIDUsage_Csmr_PlayOrSkip` | `kHIDUsage_Csmr_PlayOrSkip` | `0xce` | - |
| `durationSeconds.kHIDUsage_Csmr_PlaybackSpeed` | `kHIDUsage_Csmr_PlaybackSpeed` | `0xf1` | - |
| `durationSeconds.kHIDUsage_Csmr_Plus10` | `kHIDUsage_Csmr_Plus10` | `0x20` | - |
| `durationSeconds.kHIDUsage_Csmr_Plus100` | `kHIDUsage_Csmr_Plus100` | `0x21` | - |
| `durationSeconds.kHIDUsage_Csmr_PoliceAlarm` | `kHIDUsage_Csmr_PoliceAlarm` | `0x108` | - |
| `durationSeconds.kHIDUsage_Csmr_Power` | `kHIDUsage_Csmr_Power` | `0x30` | - |
| `durationSeconds.kHIDUsage_Csmr_ProgrammableButtons` | `kHIDUsage_Csmr_ProgrammableButtons` | `0x03` | - |
| `durationSeconds.kHIDUsage_Csmr_Quit` | `kHIDUsage_Csmr_Quit` | `0x94` | - |
| `durationSeconds.kHIDUsage_Csmr_RandomPlay` | `kHIDUsage_Csmr_RandomPlay` | `0xb9` | - |
| `durationSeconds.kHIDUsage_Csmr_RecallLast` | `kHIDUsage_Csmr_RecallLast` | `0x83` | - |
| `durationSeconds.kHIDUsage_Csmr_Record` | `kHIDUsage_Csmr_Record` | `0xb2` | - |
| `durationSeconds.kHIDUsage_Csmr_Repeat` | `kHIDUsage_Csmr_Repeat` | `0xbc` | - |
| `durationSeconds.kHIDUsage_Csmr_RepeatFromMark` | `kHIDUsage_Csmr_RepeatFromMark` | `0xc4` | - |
| `durationSeconds.kHIDUsage_Csmr_Reserved` | `kHIDUsage_Csmr_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Csmr_Reset` | `kHIDUsage_Csmr_Reset` | `0x31` | - |
| `durationSeconds.kHIDUsage_Csmr_ReturnToMark` | `kHIDUsage_Csmr_ReturnToMark` | `0xc5` | - |
| `durationSeconds.kHIDUsage_Csmr_Rewind` | `kHIDUsage_Csmr_Rewind` | `0xb4` | - |
| `durationSeconds.kHIDUsage_Csmr_RoomTemperature` | `kHIDUsage_Csmr_RoomTemperature` | `0x105` | - |
| `durationSeconds.kHIDUsage_Csmr_ScanNextTrack` | `kHIDUsage_Csmr_ScanNextTrack` | `0xb5` | - |
| `durationSeconds.kHIDUsage_Csmr_ScanPreviousTrack` | `kHIDUsage_Csmr_ScanPreviousTrack` | `0xb6` | - |
| `durationSeconds.kHIDUsage_Csmr_SearchMarkBackwards` | `kHIDUsage_Csmr_SearchMarkBackwards` | `0xc7` | - |
| `durationSeconds.kHIDUsage_Csmr_SearchMarkForward` | `kHIDUsage_Csmr_SearchMarkForward` | `0xc6` | - |
| `durationSeconds.kHIDUsage_Csmr_SecurityEnable` | `kHIDUsage_Csmr_SecurityEnable` | `0x106` | - |
| `durationSeconds.kHIDUsage_Csmr_SelectDisc` | `kHIDUsage_Csmr_SelectDisc` | `0xba` | - |
| `durationSeconds.kHIDUsage_Csmr_Selection` | `kHIDUsage_Csmr_Selection` | `0x80` | - |
| `durationSeconds.kHIDUsage_Csmr_ShowCounter` | `kHIDUsage_Csmr_ShowCounter` | `0xc9` | - |
| `durationSeconds.kHIDUsage_Csmr_Sleep` | `kHIDUsage_Csmr_Sleep` | `0x32` | - |
| `durationSeconds.kHIDUsage_Csmr_SleepAfter` | `kHIDUsage_Csmr_SleepAfter` | `0x33` | - |
| `durationSeconds.kHIDUsage_Csmr_SleepMode` | `kHIDUsage_Csmr_SleepMode` | `0x34` | - |
| `durationSeconds.kHIDUsage_Csmr_Slow` | `kHIDUsage_Csmr_Slow` | `0xf5` | - |
| `durationSeconds.kHIDUsage_Csmr_SlowTracking` | `kHIDUsage_Csmr_SlowTracking` | `0xbf` | - |
| `durationSeconds.kHIDUsage_Csmr_Snapshot` | `kHIDUsage_Csmr_Snapshot` | `0x65` | - |
| `durationSeconds.kHIDUsage_Csmr_SpeakerSystem` | `kHIDUsage_Csmr_SpeakerSystem` | `0x160` | - |
| `durationSeconds.kHIDUsage_Csmr_Speed` | `kHIDUsage_Csmr_Speed` | `0xf0` | - |
| `durationSeconds.kHIDUsage_Csmr_StandardPlay` | `kHIDUsage_Csmr_StandardPlay` | `0xf2` | - |
| `durationSeconds.kHIDUsage_Csmr_Still` | `kHIDUsage_Csmr_Still` | `0x66` | - |
| `durationSeconds.kHIDUsage_Csmr_Stop` | `kHIDUsage_Csmr_Stop` | `0xb7` | - |
| `durationSeconds.kHIDUsage_Csmr_StopOrEject` | `kHIDUsage_Csmr_StopOrEject` | `0xcc` | - |
| `durationSeconds.kHIDUsage_Csmr_SubChannel` | `kHIDUsage_Csmr_SubChannel` | `0x170` | - |
| `durationSeconds.kHIDUsage_Csmr_SubChannelDecrement` | `kHIDUsage_Csmr_SubChannelDecrement` | `0x172` | - |
| `durationSeconds.kHIDUsage_Csmr_SubChannelIncrement` | `kHIDUsage_Csmr_SubChannelIncrement` | `0x171` | - |
| `durationSeconds.kHIDUsage_Csmr_SurroundMode` | `kHIDUsage_Csmr_SurroundMode` | `0xe6` | - |
| `durationSeconds.kHIDUsage_Csmr_TrackNormal` | `kHIDUsage_Csmr_TrackNormal` | `0xbe` | - |
| `durationSeconds.kHIDUsage_Csmr_Tracking` | `kHIDUsage_Csmr_Tracking` | `0xbd` | - |
| `durationSeconds.kHIDUsage_Csmr_TrackingDecrement` | `kHIDUsage_Csmr_TrackingDecrement` | `0xcb` | - |
| `durationSeconds.kHIDUsage_Csmr_TrackingIncrement` | `kHIDUsage_Csmr_TrackingIncrement` | `0xca` | - |
| `durationSeconds.kHIDUsage_Csmr_Treble` | `kHIDUsage_Csmr_Treble` | `0xe4` | - |
| `durationSeconds.kHIDUsage_Csmr_TrebleDecrement` | `kHIDUsage_Csmr_TrebleDecrement` | `0x155` | - |
| `durationSeconds.kHIDUsage_Csmr_TrebleIncrement` | `kHIDUsage_Csmr_TrebleIncrement` | `0x154` | - |
| `durationSeconds.kHIDUsage_Csmr_VCROrTV` | `kHIDUsage_Csmr_VCROrTV` | `0x63` | - |
| `durationSeconds.kHIDUsage_Csmr_VCRPlus` | `kHIDUsage_Csmr_VCRPlus` | `0xa0` | - |
| `durationSeconds.kHIDUsage_Csmr_Volume` | `kHIDUsage_Csmr_Volume` | `0xe0` | - |
| `durationSeconds.kHIDUsage_Csmr_VolumeDecrement` | `kHIDUsage_Csmr_VolumeDecrement` | `0xea` | - |
| `durationSeconds.kHIDUsage_Csmr_VolumeIncrement` | `kHIDUsage_Csmr_VolumeIncrement` | `0xe9` | - |
| `durationSeconds.kHIDUsage_Csmr_Weekly` | `kHIDUsage_Csmr_Weekly` | `0xa3` | - |
| `durationSeconds.kHIDUsage_Dig_3DDigitizer` | `kHIDUsage_Dig_3DDigitizer` | `0x08` | - |
| `durationSeconds.kHIDUsage_Dig_Altitude` | `kHIDUsage_Dig_Altitude` | `0x40` | - |
| `durationSeconds.kHIDUsage_Dig_Armature` | `kHIDUsage_Dig_Armature` | `0x0b` | - |
| `durationSeconds.kHIDUsage_Dig_ArticulatedArm` | `kHIDUsage_Dig_ArticulatedArm` | `0x0a` | - |
| `durationSeconds.kHIDUsage_Dig_Azimuth` | `kHIDUsage_Dig_Azimuth` | `0x3f` | - |
| `durationSeconds.kHIDUsage_Dig_BarrelPressure` | `kHIDUsage_Dig_BarrelPressure` | `0x31` | - |
| `durationSeconds.kHIDUsage_Dig_BarrelSwitch` | `kHIDUsage_Dig_BarrelSwitch` | `0x44` | - |
| `durationSeconds.kHIDUsage_Dig_BatteryStrength` | `kHIDUsage_Dig_BatteryStrength` | `0x3b` | - |
| `durationSeconds.kHIDUsage_Dig_CoordinateMeasuringMachine` | `kHIDUsage_Dig_CoordinateMeasuringMachine` | `0x07` | - |
| `durationSeconds.kHIDUsage_Dig_DataValid` | `kHIDUsage_Dig_DataValid` | `0x37` | - |
| `durationSeconds.kHIDUsage_Dig_Digitizer` | `kHIDUsage_Dig_Digitizer` | `0x01` | - |
| `durationSeconds.kHIDUsage_Dig_Eraser` | `kHIDUsage_Dig_Eraser` | `0x45` | - |
| `durationSeconds.kHIDUsage_Dig_Finger` | `kHIDUsage_Dig_Finger` | `0x22` | - |
| `durationSeconds.kHIDUsage_Dig_FreeSpaceWand` | `kHIDUsage_Dig_FreeSpaceWand` | `0x0d` | - |
| `durationSeconds.kHIDUsage_Dig_InRange` | `kHIDUsage_Dig_InRange` | `0x32` | - |
| `durationSeconds.kHIDUsage_Dig_Invert` | `kHIDUsage_Dig_Invert` | `0x3c` | - |
| `durationSeconds.kHIDUsage_Dig_LightPen` | `kHIDUsage_Dig_LightPen` | `0x03` | - |
| `durationSeconds.kHIDUsage_Dig_MultiplePointDigitizer` | `kHIDUsage_Dig_MultiplePointDigitizer` | `0x0c` | - |
| `durationSeconds.kHIDUsage_Dig_Pen` | `kHIDUsage_Dig_Pen` | `0x02` | - |
| `durationSeconds.kHIDUsage_Dig_ProgramChangeKeys` | `kHIDUsage_Dig_ProgramChangeKeys` | `0x3a` | - |
| `durationSeconds.kHIDUsage_Dig_Puck` | `kHIDUsage_Dig_Puck` | `0x21` | - |
| `durationSeconds.kHIDUsage_Dig_Quality` | `kHIDUsage_Dig_Quality` | `0x36` | - |
| `durationSeconds.kHIDUsage_Dig_Reserved` | `kHIDUsage_Dig_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Dig_SecondaryTipSwitch` | `kHIDUsage_Dig_SecondaryTipSwitch` | `0x43` | - |
| `durationSeconds.kHIDUsage_Dig_StereoPlotter` | `kHIDUsage_Dig_StereoPlotter` | `0x09` | - |
| `durationSeconds.kHIDUsage_Dig_Stylus` | `kHIDUsage_Dig_Stylus` | `0x20` | - |
| `durationSeconds.kHIDUsage_Dig_TabletFunctionKeys` | `kHIDUsage_Dig_TabletFunctionKeys` | `0x39` | - |
| `durationSeconds.kHIDUsage_Dig_TabletPick` | `kHIDUsage_Dig_TabletPick` | `0x46` | - |
| `durationSeconds.kHIDUsage_Dig_Tap` | `kHIDUsage_Dig_Tap` | `0x35` | - |
| `durationSeconds.kHIDUsage_Dig_TipPressure` | `kHIDUsage_Dig_TipPressure` | `0x30` | - |
| `durationSeconds.kHIDUsage_Dig_TipSwitch` | `kHIDUsage_Dig_TipSwitch` | `0x42` | - |
| `durationSeconds.kHIDUsage_Dig_Touch` | `kHIDUsage_Dig_Touch` | `0x33` | - |
| `durationSeconds.kHIDUsage_Dig_TouchPad` | `kHIDUsage_Dig_TouchPad` | `0x05` | - |
| `durationSeconds.kHIDUsage_Dig_TouchScreen` | `kHIDUsage_Dig_TouchScreen` | `0x04` | - |
| `durationSeconds.kHIDUsage_Dig_TransducerIndex` | `kHIDUsage_Dig_TransducerIndex` | `0x38` | - |
| `durationSeconds.kHIDUsage_Dig_Twist` | `kHIDUsage_Dig_Twist` | `0x41` | - |
| `durationSeconds.kHIDUsage_Dig_Untouch` | `kHIDUsage_Dig_Untouch` | `0x34` | - |
| `durationSeconds.kHIDUsage_Dig_WhiteBoard` | `kHIDUsage_Dig_WhiteBoard` | `0x06` | - |
| `durationSeconds.kHIDUsage_Dig_XTilt` | `kHIDUsage_Dig_XTilt` | `0x3d` | - |
| `durationSeconds.kHIDUsage_Dig_YTilt` | `kHIDUsage_Dig_YTilt` | `0x3e` | - |
| `durationSeconds.kHIDUsage_GD_ByteCount` | `kHIDUsage_GD_ByteCount` | `0x3b` | - |
| `durationSeconds.kHIDUsage_GD_CountedBuffer` | `kHIDUsage_GD_CountedBuffer` | `0x3a` | - |
| `durationSeconds.kHIDUsage_GD_DPadDown` | `kHIDUsage_GD_DPadDown` | `0x91` | - |
| `durationSeconds.kHIDUsage_GD_DPadLeft` | `kHIDUsage_GD_DPadLeft` | `0x93` | - |
| `durationSeconds.kHIDUsage_GD_DPadRight` | `kHIDUsage_GD_DPadRight` | `0x92` | - |
| `durationSeconds.kHIDUsage_GD_DPadUp` | `kHIDUsage_GD_DPadUp` | `0x90` | - |
| `durationSeconds.kHIDUsage_GD_Dial` | `kHIDUsage_GD_Dial` | `0x37` | - |
| `durationSeconds.kHIDUsage_GD_GamePad` | `kHIDUsage_GD_GamePad` | `0x05` | - |
| `durationSeconds.kHIDUsage_GD_Hatswitch` | `kHIDUsage_GD_Hatswitch` | `0x39` | - |
| `durationSeconds.kHIDUsage_GD_Joystick` | `kHIDUsage_GD_Joystick` | `0x04` | - |
| `durationSeconds.kHIDUsage_GD_Keyboard` | `kHIDUsage_GD_Keyboard` | `0x06` | - |
| `durationSeconds.kHIDUsage_GD_Keypad` | `kHIDUsage_GD_Keypad` | `0x07` | - |
| `durationSeconds.kHIDUsage_GD_MotionWakeup` | `kHIDUsage_GD_MotionWakeup` | `0x3c` | - |
| `durationSeconds.kHIDUsage_GD_Mouse` | `kHIDUsage_GD_Mouse` | `0x02` | - |
| `durationSeconds.kHIDUsage_GD_MultiAxisController` | `kHIDUsage_GD_MultiAxisController` | `0x08` | - |
| `durationSeconds.kHIDUsage_GD_Pointer` | `kHIDUsage_GD_Pointer` | `0x01` | - |
| `durationSeconds.kHIDUsage_GD_Reserved` | `kHIDUsage_GD_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_GD_Rx` | `kHIDUsage_GD_Rx` | `0x33` | - |
| `durationSeconds.kHIDUsage_GD_Ry` | `kHIDUsage_GD_Ry` | `0x34` | - |
| `durationSeconds.kHIDUsage_GD_Rz` | `kHIDUsage_GD_Rz` | `0x35` | - |
| `durationSeconds.kHIDUsage_GD_Select` | `kHIDUsage_GD_Select` | `0x3e` | - |
| `durationSeconds.kHIDUsage_GD_Slider` | `kHIDUsage_GD_Slider` | `0x36` | - |
| `durationSeconds.kHIDUsage_GD_Start` | `kHIDUsage_GD_Start` | `0x3d` | - |
| `durationSeconds.kHIDUsage_GD_SystemAppMenu` | `kHIDUsage_GD_SystemAppMenu` | `0x86` | - |
| `durationSeconds.kHIDUsage_GD_SystemContextMenu` | `kHIDUsage_GD_SystemContextMenu` | `0x84` | - |
| `durationSeconds.kHIDUsage_GD_SystemControl` | `kHIDUsage_GD_SystemControl` | `0x80` | - |
| `durationSeconds.kHIDUsage_GD_SystemMainMenu` | `kHIDUsage_GD_SystemMainMenu` | `0x85` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenu` | `kHIDUsage_GD_SystemMenu` | `0x89` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenuDown` | `kHIDUsage_GD_SystemMenuDown` | `0x8d` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenuExit` | `kHIDUsage_GD_SystemMenuExit` | `0x88` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenuHelp` | `kHIDUsage_GD_SystemMenuHelp` | `0x87` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenuLeft` | `kHIDUsage_GD_SystemMenuLeft` | `0x8b` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenuRight` | `kHIDUsage_GD_SystemMenuRight` | `0x8a` | - |
| `durationSeconds.kHIDUsage_GD_SystemMenuUp` | `kHIDUsage_GD_SystemMenuUp` | `0x8c` | - |
| `durationSeconds.kHIDUsage_GD_SystemPowerDown` | `kHIDUsage_GD_SystemPowerDown` | `0x81` | - |
| `durationSeconds.kHIDUsage_GD_SystemSleep` | `kHIDUsage_GD_SystemSleep` | `0x82` | - |
| `durationSeconds.kHIDUsage_GD_SystemWakeUp` | `kHIDUsage_GD_SystemWakeUp` | `0x83` | - |
| `durationSeconds.kHIDUsage_GD_Vbrx` | `kHIDUsage_GD_Vbrx` | `0x43` | - |
| `durationSeconds.kHIDUsage_GD_Vbry` | `kHIDUsage_GD_Vbry` | `0x44` | - |
| `durationSeconds.kHIDUsage_GD_Vbrz` | `kHIDUsage_GD_Vbrz` | `0x45` | - |
| `durationSeconds.kHIDUsage_GD_Vno` | `kHIDUsage_GD_Vno` | `0x46` | - |
| `durationSeconds.kHIDUsage_GD_Vx` | `kHIDUsage_GD_Vx` | `0x40` | - |
| `durationSeconds.kHIDUsage_GD_Vy` | `kHIDUsage_GD_Vy` | `0x41` | - |
| `durationSeconds.kHIDUsage_GD_Vz` | `kHIDUsage_GD_Vz` | `0x42` | - |
| `durationSeconds.kHIDUsage_GD_Wheel` | `kHIDUsage_GD_Wheel` | `0x38` | - |
| `durationSeconds.kHIDUsage_GD_X` | `kHIDUsage_GD_X` | `0x30` | - |
| `durationSeconds.kHIDUsage_GD_Y` | `kHIDUsage_GD_Y` | `0x31` | - |
| `durationSeconds.kHIDUsage_GD_Z` | `kHIDUsage_GD_Z` | `0x32` | - |
| `durationSeconds.kHIDUsage_Game_3DGameController` | `kHIDUsage_Game_3DGameController` | `0x01` | - |
| `durationSeconds.kHIDUsage_Game_Bump` | `kHIDUsage_Game_Bump` | `0x2c` | - |
| `durationSeconds.kHIDUsage_Game_Flipper` | `kHIDUsage_Game_Flipper` | `0x2a` | - |
| `durationSeconds.kHIDUsage_Game_GamepadFireOrJump` | `kHIDUsage_Game_GamepadFireOrJump` | `0x37` | - |
| `durationSeconds.kHIDUsage_Game_GamepadTrigger` | `kHIDUsage_Game_GamepadTrigger` | `0x39` | - |
| `durationSeconds.kHIDUsage_Game_Gun` | `kHIDUsage_Game_Gun` | `0x32` | - |
| `durationSeconds.kHIDUsage_Game_GunAutomatic` | `kHIDUsage_Game_GunAutomatic` | `0x35` | - |
| `durationSeconds.kHIDUsage_Game_GunBolt` | `kHIDUsage_Game_GunBolt` | `0x30` | - |
| `durationSeconds.kHIDUsage_Game_GunBurst` | `kHIDUsage_Game_GunBurst` | `0x34` | - |
| `durationSeconds.kHIDUsage_Game_GunClip` | `kHIDUsage_Game_GunClip` | `0x31` | - |
| `durationSeconds.kHIDUsage_Game_GunDevice` | `kHIDUsage_Game_GunDevice` | `0x03` | - |
| `durationSeconds.kHIDUsage_Game_GunSafety` | `kHIDUsage_Game_GunSafety` | `0x36` | - |
| `durationSeconds.kHIDUsage_Game_GunSingleShot` | `kHIDUsage_Game_GunSingleShot` | `0x33` | - |
| `durationSeconds.kHIDUsage_Game_HeightOfPOV` | `kHIDUsage_Game_HeightOfPOV` | `0x29` | - |
| `durationSeconds.kHIDUsage_Game_LeanForwardOrBackward` | `kHIDUsage_Game_LeanForwardOrBackward` | `0x28` | - |
| `durationSeconds.kHIDUsage_Game_LeanRightOrLeft` | `kHIDUsage_Game_LeanRightOrLeft` | `0x27` | - |
| `durationSeconds.kHIDUsage_Game_MoveForwardOrBackward` | `kHIDUsage_Game_MoveForwardOrBackward` | `0x25` | - |
| `durationSeconds.kHIDUsage_Game_MoveRightOrLeft` | `kHIDUsage_Game_MoveRightOrLeft` | `0x24` | - |
| `durationSeconds.kHIDUsage_Game_MoveUpOrDown` | `kHIDUsage_Game_MoveUpOrDown` | `0x26` | - |
| `durationSeconds.kHIDUsage_Game_NewGame` | `kHIDUsage_Game_NewGame` | `0x2d` | - |
| `durationSeconds.kHIDUsage_Game_PinballDevice` | `kHIDUsage_Game_PinballDevice` | `0x02` | - |
| `durationSeconds.kHIDUsage_Game_PitchUpOrDown` | `kHIDUsage_Game_PitchUpOrDown` | `0x22` | - |
| `durationSeconds.kHIDUsage_Game_Player` | `kHIDUsage_Game_Player` | `0x2f` | - |
| `durationSeconds.kHIDUsage_Game_PointofView` | `kHIDUsage_Game_PointofView` | `0x20` | - |
| `durationSeconds.kHIDUsage_Game_Reserved` | `kHIDUsage_Game_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Game_RollRightOrLeft` | `kHIDUsage_Game_RollRightOrLeft` | `0x23` | - |
| `durationSeconds.kHIDUsage_Game_SecondaryFlipper` | `kHIDUsage_Game_SecondaryFlipper` | `0x2b` | - |
| `durationSeconds.kHIDUsage_Game_ShootBall` | `kHIDUsage_Game_ShootBall` | `0x2e` | - |
| `durationSeconds.kHIDUsage_Game_TurnRightOrLeft` | `kHIDUsage_Game_TurnRightOrLeft` | `0x21` | - |
| `durationSeconds.kHIDUsage_Keyboard0` | `kHIDUsage_Keyboard0` | `0x27` | - |
| `durationSeconds.kHIDUsage_Keyboard1` | `kHIDUsage_Keyboard1` | `0x1e` | - |
| `durationSeconds.kHIDUsage_Keyboard2` | `kHIDUsage_Keyboard2` | `0x1f` | - |
| `durationSeconds.kHIDUsage_Keyboard3` | `kHIDUsage_Keyboard3` | `0x20` | - |
| `durationSeconds.kHIDUsage_Keyboard4` | `kHIDUsage_Keyboard4` | `0x21` | - |
| `durationSeconds.kHIDUsage_Keyboard5` | `kHIDUsage_Keyboard5` | `0x22` | - |
| `durationSeconds.kHIDUsage_Keyboard6` | `kHIDUsage_Keyboard6` | `0x23` | - |
| `durationSeconds.kHIDUsage_Keyboard7` | `kHIDUsage_Keyboard7` | `0x24` | - |
| `durationSeconds.kHIDUsage_Keyboard8` | `kHIDUsage_Keyboard8` | `0x25` | - |
| `durationSeconds.kHIDUsage_Keyboard9` | `kHIDUsage_Keyboard9` | `0x26` | - |
| `durationSeconds.kHIDUsage_KeyboardA` | `kHIDUsage_KeyboardA` | `0x04` | - |
| `durationSeconds.kHIDUsage_KeyboardAgain` | `kHIDUsage_KeyboardAgain` | `0x79` | - |
| `durationSeconds.kHIDUsage_KeyboardAlternateErase` | `kHIDUsage_KeyboardAlternateErase` | `0x99` | - |
| `durationSeconds.kHIDUsage_KeyboardApplication` | `kHIDUsage_KeyboardApplication` | `0x65` | - |
| `durationSeconds.kHIDUsage_KeyboardB` | `kHIDUsage_KeyboardB` | `0x05` | - |
| `durationSeconds.kHIDUsage_KeyboardBackslash` | `kHIDUsage_KeyboardBackslash` | `0x31` | - |
| `durationSeconds.kHIDUsage_KeyboardC` | `kHIDUsage_KeyboardC` | `0x06` | - |
| `durationSeconds.kHIDUsage_KeyboardCancel` | `kHIDUsage_KeyboardCancel` | `0x9b` | - |
| `durationSeconds.kHIDUsage_KeyboardCapsLock` | `kHIDUsage_KeyboardCapsLock` | `0x39` | - |
| `durationSeconds.kHIDUsage_KeyboardClear` | `kHIDUsage_KeyboardClear` | `0x9c` | - |
| `durationSeconds.kHIDUsage_KeyboardClearOrAgain` | `kHIDUsage_KeyboardClearOrAgain` | `0xa2` | - |
| `durationSeconds.kHIDUsage_KeyboardCloseBracket` | `kHIDUsage_KeyboardCloseBracket` | `0x30` | - |
| `durationSeconds.kHIDUsage_KeyboardComma` | `kHIDUsage_KeyboardComma` | `0x36` | - |
| `durationSeconds.kHIDUsage_KeyboardCopy` | `kHIDUsage_KeyboardCopy` | `0x7c` | - |
| `durationSeconds.kHIDUsage_KeyboardCrSelOrProps` | `kHIDUsage_KeyboardCrSelOrProps` | `0xa3` | - |
| `durationSeconds.kHIDUsage_KeyboardCut` | `kHIDUsage_KeyboardCut` | `0x7b` | - |
| `durationSeconds.kHIDUsage_KeyboardD` | `kHIDUsage_KeyboardD` | `0x07` | - |
| `durationSeconds.kHIDUsage_KeyboardDeleteForward` | `kHIDUsage_KeyboardDeleteForward` | `0x4c` | - |
| `durationSeconds.kHIDUsage_KeyboardDeleteOrBackspace` | `kHIDUsage_KeyboardDeleteOrBackspace` | `0x2a` | - |
| `durationSeconds.kHIDUsage_KeyboardDownArrow` | `kHIDUsage_KeyboardDownArrow` | `0x51` | - |
| `durationSeconds.kHIDUsage_KeyboardE` | `kHIDUsage_KeyboardE` | `0x08` | - |
| `durationSeconds.kHIDUsage_KeyboardEnd` | `kHIDUsage_KeyboardEnd` | `0x4d` | - |
| `durationSeconds.kHIDUsage_KeyboardEqualSign` | `kHIDUsage_KeyboardEqualSign` | `0x2e` | - |
| `durationSeconds.kHIDUsage_KeyboardErrorRollOver` | `kHIDUsage_KeyboardErrorRollOver` | `0x01` | - |
| `durationSeconds.kHIDUsage_KeyboardErrorUndefined` | `kHIDUsage_KeyboardErrorUndefined` | `0x03` | - |
| `durationSeconds.kHIDUsage_KeyboardEscape` | `kHIDUsage_KeyboardEscape` | `0x29` | - |
| `durationSeconds.kHIDUsage_KeyboardExSel` | `kHIDUsage_KeyboardExSel` | `0xa4` | - |
| `durationSeconds.kHIDUsage_KeyboardExecute` | `kHIDUsage_KeyboardExecute` | `0x74` | - |
| `durationSeconds.kHIDUsage_KeyboardF` | `kHIDUsage_KeyboardF` | `0x09` | - |
| `durationSeconds.kHIDUsage_KeyboardF1` | `kHIDUsage_KeyboardF1` | `0x3a` | - |
| `durationSeconds.kHIDUsage_KeyboardF10` | `kHIDUsage_KeyboardF10` | `0x43` | - |
| `durationSeconds.kHIDUsage_KeyboardF11` | `kHIDUsage_KeyboardF11` | `0x44` | - |
| `durationSeconds.kHIDUsage_KeyboardF12` | `kHIDUsage_KeyboardF12` | `0x45` | - |
| `durationSeconds.kHIDUsage_KeyboardF13` | `kHIDUsage_KeyboardF13` | `0x68` | - |
| `durationSeconds.kHIDUsage_KeyboardF14` | `kHIDUsage_KeyboardF14` | `0x69` | - |
| `durationSeconds.kHIDUsage_KeyboardF15` | `kHIDUsage_KeyboardF15` | `0x6a` | - |
| `durationSeconds.kHIDUsage_KeyboardF16` | `kHIDUsage_KeyboardF16` | `0x6b` | - |
| `durationSeconds.kHIDUsage_KeyboardF17` | `kHIDUsage_KeyboardF17` | `0x6c` | - |
| `durationSeconds.kHIDUsage_KeyboardF18` | `kHIDUsage_KeyboardF18` | `0x6d` | - |
| `durationSeconds.kHIDUsage_KeyboardF19` | `kHIDUsage_KeyboardF19` | `0x6e` | - |
| `durationSeconds.kHIDUsage_KeyboardF2` | `kHIDUsage_KeyboardF2` | `0x3b` | - |
| `durationSeconds.kHIDUsage_KeyboardF20` | `kHIDUsage_KeyboardF20` | `0x6f` | - |
| `durationSeconds.kHIDUsage_KeyboardF21` | `kHIDUsage_KeyboardF21` | `0x70` | - |
| `durationSeconds.kHIDUsage_KeyboardF22` | `kHIDUsage_KeyboardF22` | `0x71` | - |
| `durationSeconds.kHIDUsage_KeyboardF23` | `kHIDUsage_KeyboardF23` | `0x72` | - |
| `durationSeconds.kHIDUsage_KeyboardF24` | `kHIDUsage_KeyboardF24` | `0x73` | - |
| `durationSeconds.kHIDUsage_KeyboardF3` | `kHIDUsage_KeyboardF3` | `0x3c` | - |
| `durationSeconds.kHIDUsage_KeyboardF4` | `kHIDUsage_KeyboardF4` | `0x3d` | - |
| `durationSeconds.kHIDUsage_KeyboardF5` | `kHIDUsage_KeyboardF5` | `0x3e` | - |
| `durationSeconds.kHIDUsage_KeyboardF6` | `kHIDUsage_KeyboardF6` | `0x3f` | - |
| `durationSeconds.kHIDUsage_KeyboardF7` | `kHIDUsage_KeyboardF7` | `0x40` | - |
| `durationSeconds.kHIDUsage_KeyboardF8` | `kHIDUsage_KeyboardF8` | `0x41` | - |
| `durationSeconds.kHIDUsage_KeyboardF9` | `kHIDUsage_KeyboardF9` | `0x42` | - |
| `durationSeconds.kHIDUsage_KeyboardFind` | `kHIDUsage_KeyboardFind` | `0x7e` | - |
| `durationSeconds.kHIDUsage_KeyboardG` | `kHIDUsage_KeyboardG` | `0x0a` | - |
| `durationSeconds.kHIDUsage_KeyboardGraveAccentAndTilde` | `kHIDUsage_KeyboardGraveAccentAndTilde` | `0x35` | - |
| `durationSeconds.kHIDUsage_KeyboardH` | `kHIDUsage_KeyboardH` | `0x0b` | - |
| `durationSeconds.kHIDUsage_KeyboardHelp` | `kHIDUsage_KeyboardHelp` | `0x75` | - |
| `durationSeconds.kHIDUsage_KeyboardHome` | `kHIDUsage_KeyboardHome` | `0x4a` | - |
| `durationSeconds.kHIDUsage_KeyboardHyphen` | `kHIDUsage_KeyboardHyphen` | `0x2d` | - |
| `durationSeconds.kHIDUsage_KeyboardI` | `kHIDUsage_KeyboardI` | `0x0c` | - |
| `durationSeconds.kHIDUsage_KeyboardInsert` | `kHIDUsage_KeyboardInsert` | `0x49` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational1` | `kHIDUsage_KeyboardInternational1` | `0x87` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational2` | `kHIDUsage_KeyboardInternational2` | `0x88` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational3` | `kHIDUsage_KeyboardInternational3` | `0x89` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational4` | `kHIDUsage_KeyboardInternational4` | `0x8a` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational5` | `kHIDUsage_KeyboardInternational5` | `0x8b` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational6` | `kHIDUsage_KeyboardInternational6` | `0x8c` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational7` | `kHIDUsage_KeyboardInternational7` | `0x8d` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational8` | `kHIDUsage_KeyboardInternational8` | `0x8e` | - |
| `durationSeconds.kHIDUsage_KeyboardInternational9` | `kHIDUsage_KeyboardInternational9` | `0x8f` | - |
| `durationSeconds.kHIDUsage_KeyboardJ` | `kHIDUsage_KeyboardJ` | `0x0d` | - |
| `durationSeconds.kHIDUsage_KeyboardK` | `kHIDUsage_KeyboardK` | `0x0e` | - |
| `durationSeconds.kHIDUsage_KeyboardL` | `kHIDUsage_KeyboardL` | `0x0f` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG1` | `kHIDUsage_KeyboardLANG1` | `0x90` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG2` | `kHIDUsage_KeyboardLANG2` | `0x91` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG3` | `kHIDUsage_KeyboardLANG3` | `0x92` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG4` | `kHIDUsage_KeyboardLANG4` | `0x93` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG5` | `kHIDUsage_KeyboardLANG5` | `0x94` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG6` | `kHIDUsage_KeyboardLANG6` | `0x95` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG7` | `kHIDUsage_KeyboardLANG7` | `0x96` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG8` | `kHIDUsage_KeyboardLANG8` | `0x97` | - |
| `durationSeconds.kHIDUsage_KeyboardLANG9` | `kHIDUsage_KeyboardLANG9` | `0x98` | - |
| `durationSeconds.kHIDUsage_KeyboardLeftAlt` | `kHIDUsage_KeyboardLeftAlt` | `0xe2` | - |
| `durationSeconds.kHIDUsage_KeyboardLeftArrow` | `kHIDUsage_KeyboardLeftArrow` | `0x50` | - |
| `durationSeconds.kHIDUsage_KeyboardLeftControl` | `kHIDUsage_KeyboardLeftControl` | `0xe0` | - |
| `durationSeconds.kHIDUsage_KeyboardLeftGUI` | `kHIDUsage_KeyboardLeftGUI` | `0xe3` | - |
| `durationSeconds.kHIDUsage_KeyboardLeftShift` | `kHIDUsage_KeyboardLeftShift` | `0xe1` | - |
| `durationSeconds.kHIDUsage_KeyboardLockingCapsLock` | `kHIDUsage_KeyboardLockingCapsLock` | `0x82` | - |
| `durationSeconds.kHIDUsage_KeyboardLockingNumLock` | `kHIDUsage_KeyboardLockingNumLock` | `0x83` | - |
| `durationSeconds.kHIDUsage_KeyboardLockingScrollLock` | `kHIDUsage_KeyboardLockingScrollLock` | `0x84` | - |
| `durationSeconds.kHIDUsage_KeyboardM` | `kHIDUsage_KeyboardM` | `0x10` | - |
| `durationSeconds.kHIDUsage_KeyboardMenu` | `kHIDUsage_KeyboardMenu` | `0x76` | - |
| `durationSeconds.kHIDUsage_KeyboardMute` | `kHIDUsage_KeyboardMute` | `0x7f` | - |
| `durationSeconds.kHIDUsage_KeyboardN` | `kHIDUsage_KeyboardN` | `0x11` | - |
| `durationSeconds.kHIDUsage_KeyboardNonUSBackslash` | `kHIDUsage_KeyboardNonUSBackslash` | `0x64` | - |
| `durationSeconds.kHIDUsage_KeyboardNonUSPound` | `kHIDUsage_KeyboardNonUSPound` | `0x32` | - |
| `durationSeconds.kHIDUsage_KeyboardO` | `kHIDUsage_KeyboardO` | `0x12` | - |
| `durationSeconds.kHIDUsage_KeyboardOpenBracket` | `kHIDUsage_KeyboardOpenBracket` | `0x2f` | - |
| `durationSeconds.kHIDUsage_KeyboardOper` | `kHIDUsage_KeyboardOper` | `0xa1` | - |
| `durationSeconds.kHIDUsage_KeyboardOut` | `kHIDUsage_KeyboardOut` | `0xa0` | - |
| `durationSeconds.kHIDUsage_KeyboardP` | `kHIDUsage_KeyboardP` | `0x13` | - |
| `durationSeconds.kHIDUsage_KeyboardPOSTFail` | `kHIDUsage_KeyboardPOSTFail` | `0x02` | - |
| `durationSeconds.kHIDUsage_KeyboardPageDown` | `kHIDUsage_KeyboardPageDown` | `0x4e` | - |
| `durationSeconds.kHIDUsage_KeyboardPageUp` | `kHIDUsage_KeyboardPageUp` | `0x4b` | - |
| `durationSeconds.kHIDUsage_KeyboardPaste` | `kHIDUsage_KeyboardPaste` | `0x7d` | - |
| `durationSeconds.kHIDUsage_KeyboardPause` | `kHIDUsage_KeyboardPause` | `0x48` | - |
| `durationSeconds.kHIDUsage_KeyboardPeriod` | `kHIDUsage_KeyboardPeriod` | `0x37` | - |
| `durationSeconds.kHIDUsage_KeyboardPower` | `kHIDUsage_KeyboardPower` | `0x66` | - |
| `durationSeconds.kHIDUsage_KeyboardPrintScreen` | `kHIDUsage_KeyboardPrintScreen` | `0x46` | - |
| `durationSeconds.kHIDUsage_KeyboardPrior` | `kHIDUsage_KeyboardPrior` | `0x9d` | - |
| `durationSeconds.kHIDUsage_KeyboardQ` | `kHIDUsage_KeyboardQ` | `0x14` | - |
| `durationSeconds.kHIDUsage_KeyboardQuote` | `kHIDUsage_KeyboardQuote` | `0x34` | - |
| `durationSeconds.kHIDUsage_KeyboardR` | `kHIDUsage_KeyboardR` | `0x15` | - |
| `durationSeconds.kHIDUsage_KeyboardReturn` | `kHIDUsage_KeyboardReturn` | `0x9e` | - |
| `durationSeconds.kHIDUsage_KeyboardReturnOrEnter` | `kHIDUsage_KeyboardReturnOrEnter` | `0x28` | - |
| `durationSeconds.kHIDUsage_KeyboardRightAlt` | `kHIDUsage_KeyboardRightAlt` | `0xe6` | - |
| `durationSeconds.kHIDUsage_KeyboardRightArrow` | `kHIDUsage_KeyboardRightArrow` | `0x4f` | - |
| `durationSeconds.kHIDUsage_KeyboardRightControl` | `kHIDUsage_KeyboardRightControl` | `0xe4` | - |
| `durationSeconds.kHIDUsage_KeyboardRightGUI` | `kHIDUsage_KeyboardRightGUI` | `0xe7` | - |
| `durationSeconds.kHIDUsage_KeyboardRightShift` | `kHIDUsage_KeyboardRightShift` | `0xe5` | - |
| `durationSeconds.kHIDUsage_KeyboardS` | `kHIDUsage_KeyboardS` | `0x16` | - |
| `durationSeconds.kHIDUsage_KeyboardScrollLock` | `kHIDUsage_KeyboardScrollLock` | `0x47` | - |
| `durationSeconds.kHIDUsage_KeyboardSelect` | `kHIDUsage_KeyboardSelect` | `0x77` | - |
| `durationSeconds.kHIDUsage_KeyboardSemicolon` | `kHIDUsage_KeyboardSemicolon` | `0x33` | - |
| `durationSeconds.kHIDUsage_KeyboardSeparator` | `kHIDUsage_KeyboardSeparator` | `0x9f` | - |
| `durationSeconds.kHIDUsage_KeyboardSlash` | `kHIDUsage_KeyboardSlash` | `0x38` | - |
| `durationSeconds.kHIDUsage_KeyboardSpacebar` | `kHIDUsage_KeyboardSpacebar` | `0x2c` | - |
| `durationSeconds.kHIDUsage_KeyboardStop` | `kHIDUsage_KeyboardStop` | `0x78` | - |
| `durationSeconds.kHIDUsage_KeyboardSysReqOrAttention` | `kHIDUsage_KeyboardSysReqOrAttention` | `0x9a` | - |
| `durationSeconds.kHIDUsage_KeyboardT` | `kHIDUsage_KeyboardT` | `0x17` | - |
| `durationSeconds.kHIDUsage_KeyboardTab` | `kHIDUsage_KeyboardTab` | `0x2b` | - |
| `durationSeconds.kHIDUsage_KeyboardU` | `kHIDUsage_KeyboardU` | `0x18` | - |
| `durationSeconds.kHIDUsage_KeyboardUndo` | `kHIDUsage_KeyboardUndo` | `0x7a` | - |
| `durationSeconds.kHIDUsage_KeyboardUpArrow` | `kHIDUsage_KeyboardUpArrow` | `0x52` | - |
| `durationSeconds.kHIDUsage_KeyboardV` | `kHIDUsage_KeyboardV` | `0x19` | - |
| `durationSeconds.kHIDUsage_KeyboardVolumeDown` | `kHIDUsage_KeyboardVolumeDown` | `0x81` | - |
| `durationSeconds.kHIDUsage_KeyboardVolumeUp` | `kHIDUsage_KeyboardVolumeUp` | `0x80` | - |
| `durationSeconds.kHIDUsage_KeyboardW` | `kHIDUsage_KeyboardW` | `0x1a` | - |
| `durationSeconds.kHIDUsage_KeyboardX` | `kHIDUsage_KeyboardX` | `0x1b` | - |
| `durationSeconds.kHIDUsage_KeyboardY` | `kHIDUsage_KeyboardY` | `0x1c` | - |
| `durationSeconds.kHIDUsage_KeyboardZ` | `kHIDUsage_KeyboardZ` | `0x1d` | - |
| `durationSeconds.kHIDUsage_Keyboard_Reserved` | `kHIDUsage_Keyboard_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Keypad0` | `kHIDUsage_Keypad0` | `0x62` | - |
| `durationSeconds.kHIDUsage_Keypad1` | `kHIDUsage_Keypad1` | `0x59` | - |
| `durationSeconds.kHIDUsage_Keypad2` | `kHIDUsage_Keypad2` | `0x5a` | - |
| `durationSeconds.kHIDUsage_Keypad3` | `kHIDUsage_Keypad3` | `0x5b` | - |
| `durationSeconds.kHIDUsage_Keypad4` | `kHIDUsage_Keypad4` | `0x5c` | - |
| `durationSeconds.kHIDUsage_Keypad5` | `kHIDUsage_Keypad5` | `0x5d` | - |
| `durationSeconds.kHIDUsage_Keypad6` | `kHIDUsage_Keypad6` | `0x5e` | - |
| `durationSeconds.kHIDUsage_Keypad7` | `kHIDUsage_Keypad7` | `0x5f` | - |
| `durationSeconds.kHIDUsage_Keypad8` | `kHIDUsage_Keypad8` | `0x60` | - |
| `durationSeconds.kHIDUsage_Keypad9` | `kHIDUsage_Keypad9` | `0x61` | - |
| `durationSeconds.kHIDUsage_KeypadAsterisk` | `kHIDUsage_KeypadAsterisk` | `0x55` | - |
| `durationSeconds.kHIDUsage_KeypadComma` | `kHIDUsage_KeypadComma` | `0x85` | - |
| `durationSeconds.kHIDUsage_KeypadEnter` | `kHIDUsage_KeypadEnter` | `0x58` | - |
| `durationSeconds.kHIDUsage_KeypadEqualSign` | `kHIDUsage_KeypadEqualSign` | `0x67` | - |
| `durationSeconds.kHIDUsage_KeypadEqualSignAS400` | `kHIDUsage_KeypadEqualSignAS400` | `0x86` | - |
| `durationSeconds.kHIDUsage_KeypadHyphen` | `kHIDUsage_KeypadHyphen` | `0x56` | - |
| `durationSeconds.kHIDUsage_KeypadNumLock` | `kHIDUsage_KeypadNumLock` | `0x53` | - |
| `durationSeconds.kHIDUsage_KeypadPeriod` | `kHIDUsage_KeypadPeriod` | `0x63` | - |
| `durationSeconds.kHIDUsage_KeypadPlus` | `kHIDUsage_KeypadPlus` | `0x57` | - |
| `durationSeconds.kHIDUsage_KeypadSlash` | `kHIDUsage_KeypadSlash` | `0x54` | - |
| `durationSeconds.kHIDUsage_LED_BatteryLow` | `kHIDUsage_LED_BatteryLow` | `0x1d` | - |
| `durationSeconds.kHIDUsage_LED_BatteryOK` | `kHIDUsage_LED_BatteryOK` | `0x1c` | - |
| `durationSeconds.kHIDUsage_LED_BatteryOperation` | `kHIDUsage_LED_BatteryOperation` | `0x1b` | - |
| `durationSeconds.kHIDUsage_LED_Busy` | `kHIDUsage_LED_Busy` | `0x2c` | - |
| `durationSeconds.kHIDUsage_LED_CAV` | `kHIDUsage_LED_CAV` | `0x14` | - |
| `durationSeconds.kHIDUsage_LED_CLV` | `kHIDUsage_LED_CLV` | `0x15` | - |
| `durationSeconds.kHIDUsage_LED_CallPickup` | `kHIDUsage_LED_CallPickup` | `0x25` | - |
| `durationSeconds.kHIDUsage_LED_CameraOff` | `kHIDUsage_LED_CameraOff` | `0x29` | - |
| `durationSeconds.kHIDUsage_LED_CameraOn` | `kHIDUsage_LED_CameraOn` | `0x28` | - |
| `durationSeconds.kHIDUsage_LED_CapsLock` | `kHIDUsage_LED_CapsLock` | `0x02` | - |
| `durationSeconds.kHIDUsage_LED_Compose` | `kHIDUsage_LED_Compose` | `0x04` | - |
| `durationSeconds.kHIDUsage_LED_Conference` | `kHIDUsage_LED_Conference` | `0x26` | - |
| `durationSeconds.kHIDUsage_LED_Coverage` | `kHIDUsage_LED_Coverage` | `0x22` | - |
| `durationSeconds.kHIDUsage_LED_DataMode` | `kHIDUsage_LED_DataMode` | `0x1a` | - |
| `durationSeconds.kHIDUsage_LED_DoNotDisturb` | `kHIDUsage_LED_DoNotDisturb` | `0x08` | - |
| `durationSeconds.kHIDUsage_LED_EqualizerEnable` | `kHIDUsage_LED_EqualizerEnable` | `0x0d` | - |
| `durationSeconds.kHIDUsage_LED_Error` | `kHIDUsage_LED_Error` | `0x39` | - |
| `durationSeconds.kHIDUsage_LED_ExternalPowerConnected` | `kHIDUsage_LED_ExternalPowerConnected` | `0x4d` | - |
| `durationSeconds.kHIDUsage_LED_FastBlinkOffTime` | `kHIDUsage_LED_FastBlinkOffTime` | `0x46` | - |
| `durationSeconds.kHIDUsage_LED_FastBlinkOnTime` | `kHIDUsage_LED_FastBlinkOnTime` | `0x45` | - |
| `durationSeconds.kHIDUsage_LED_FastForward` | `kHIDUsage_LED_FastForward` | `0x35` | - |
| `durationSeconds.kHIDUsage_LED_FlashOnTime` | `kHIDUsage_LED_FlashOnTime` | `0x42` | - |
| `durationSeconds.kHIDUsage_LED_Forward` | `kHIDUsage_LED_Forward` | `0x31` | - |
| `durationSeconds.kHIDUsage_LED_GenericIndicator` | `kHIDUsage_LED_GenericIndicator` | `0x4b` | - |
| `durationSeconds.kHIDUsage_LED_HeadSet` | `kHIDUsage_LED_HeadSet` | `0x1f` | - |
| `durationSeconds.kHIDUsage_LED_HighCutFilter` | `kHIDUsage_LED_HighCutFilter` | `0x0b` | - |
| `durationSeconds.kHIDUsage_LED_Hold` | `kHIDUsage_LED_Hold` | `0x20` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorAmber` | `kHIDUsage_LED_IndicatorAmber` | `0x4a` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorFastBlink` | `kHIDUsage_LED_IndicatorFastBlink` | `0x40` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorFlash` | `kHIDUsage_LED_IndicatorFlash` | `0x3e` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorGreen` | `kHIDUsage_LED_IndicatorGreen` | `0x49` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorOff` | `kHIDUsage_LED_IndicatorOff` | `0x41` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorOn` | `kHIDUsage_LED_IndicatorOn` | `0x3d` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorRed` | `kHIDUsage_LED_IndicatorRed` | `0x48` | - |
| `durationSeconds.kHIDUsage_LED_IndicatorSlowBlink` | `kHIDUsage_LED_IndicatorSlowBlink` | `0x3f` | - |
| `durationSeconds.kHIDUsage_LED_Kana` | `kHIDUsage_LED_Kana` | `0x05` | - |
| `durationSeconds.kHIDUsage_LED_LowCutFilter` | `kHIDUsage_LED_LowCutFilter` | `0x0c` | - |
| `durationSeconds.kHIDUsage_LED_MessageWaiting` | `kHIDUsage_LED_MessageWaiting` | `0x19` | - |
| `durationSeconds.kHIDUsage_LED_Microphone` | `kHIDUsage_LED_Microphone` | `0x21` | - |
| `durationSeconds.kHIDUsage_LED_Mute` | `kHIDUsage_LED_Mute` | `0x09` | - |
| `durationSeconds.kHIDUsage_LED_NightMode` | `kHIDUsage_LED_NightMode` | `0x23` | - |
| `durationSeconds.kHIDUsage_LED_NumLock` | `kHIDUsage_LED_NumLock` | `0x01` | - |
| `durationSeconds.kHIDUsage_LED_OffHook` | `kHIDUsage_LED_OffHook` | `0x17` | - |
| `durationSeconds.kHIDUsage_LED_OffLine` | `kHIDUsage_LED_OffLine` | `0x2b` | - |
| `durationSeconds.kHIDUsage_LED_OnLine` | `kHIDUsage_LED_OnLine` | `0x2a` | - |
| `durationSeconds.kHIDUsage_LED_PaperJam` | `kHIDUsage_LED_PaperJam` | `0x2f` | - |
| `durationSeconds.kHIDUsage_LED_PaperOut` | `kHIDUsage_LED_PaperOut` | `0x2e` | - |
| `durationSeconds.kHIDUsage_LED_Pause` | `kHIDUsage_LED_Pause` | `0x37` | - |
| `durationSeconds.kHIDUsage_LED_Play` | `kHIDUsage_LED_Play` | `0x36` | - |
| `durationSeconds.kHIDUsage_LED_Power` | `kHIDUsage_LED_Power` | `0x06` | - |
| `durationSeconds.kHIDUsage_LED_Ready` | `kHIDUsage_LED_Ready` | `0x2d` | - |
| `durationSeconds.kHIDUsage_LED_Record` | `kHIDUsage_LED_Record` | `0x38` | - |
| `durationSeconds.kHIDUsage_LED_RecordingFormatDetect` | `kHIDUsage_LED_RecordingFormatDetect` | `0x16` | - |
| `durationSeconds.kHIDUsage_LED_Remote` | `kHIDUsage_LED_Remote` | `0x30` | - |
| `durationSeconds.kHIDUsage_LED_Repeat` | `kHIDUsage_LED_Repeat` | `0x10` | - |
| `durationSeconds.kHIDUsage_LED_Reserved` | `kHIDUsage_LED_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_LED_Reverse` | `kHIDUsage_LED_Reverse` | `0x32` | - |
| `durationSeconds.kHIDUsage_LED_Rewind` | `kHIDUsage_LED_Rewind` | `0x34` | - |
| `durationSeconds.kHIDUsage_LED_Ring` | `kHIDUsage_LED_Ring` | `0x18` | - |
| `durationSeconds.kHIDUsage_LED_SamplingRateDetect` | `kHIDUsage_LED_SamplingRateDetect` | `0x12` | - |
| `durationSeconds.kHIDUsage_LED_ScrollLock` | `kHIDUsage_LED_ScrollLock` | `0x03` | - |
| `durationSeconds.kHIDUsage_LED_SendCalls` | `kHIDUsage_LED_SendCalls` | `0x24` | - |
| `durationSeconds.kHIDUsage_LED_Shift` | `kHIDUsage_LED_Shift` | `0x07` | - |
| `durationSeconds.kHIDUsage_LED_SlowBlinkOffTime` | `kHIDUsage_LED_SlowBlinkOffTime` | `0x44` | - |
| `durationSeconds.kHIDUsage_LED_SlowBlinkOnTime` | `kHIDUsage_LED_SlowBlinkOnTime` | `0x43` | - |
| `durationSeconds.kHIDUsage_LED_SoundFieldOn` | `kHIDUsage_LED_SoundFieldOn` | `0x0e` | - |
| `durationSeconds.kHIDUsage_LED_Speaker` | `kHIDUsage_LED_Speaker` | `0x1e` | - |
| `durationSeconds.kHIDUsage_LED_Spinning` | `kHIDUsage_LED_Spinning` | `0x13` | - |
| `durationSeconds.kHIDUsage_LED_StandBy` | `kHIDUsage_LED_StandBy` | `0x27` | - |
| `durationSeconds.kHIDUsage_LED_Stereo` | `kHIDUsage_LED_Stereo` | `0x11` | - |
| `durationSeconds.kHIDUsage_LED_Stop` | `kHIDUsage_LED_Stop` | `0x33` | - |
| `durationSeconds.kHIDUsage_LED_SurroundOn` | `kHIDUsage_LED_SurroundOn` | `0x0f` | - |
| `durationSeconds.kHIDUsage_LED_SystemSuspend` | `kHIDUsage_LED_SystemSuspend` | `0x4c` | - |
| `durationSeconds.kHIDUsage_LED_ToneEnable` | `kHIDUsage_LED_ToneEnable` | `0x0a` | - |
| `durationSeconds.kHIDUsage_LED_Usage` | `kHIDUsage_LED_Usage` | `0x3a` | - |
| `durationSeconds.kHIDUsage_LED_UsageInUseIndicator` | `kHIDUsage_LED_UsageInUseIndicator` | `0x3b` | - |
| `durationSeconds.kHIDUsage_LED_UsageIndicatorColor` | `kHIDUsage_LED_UsageIndicatorColor` | `0x47` | - |
| `durationSeconds.kHIDUsage_LED_UsageMultiModeIndicator` | `kHIDUsage_LED_UsageMultiModeIndicator` | `0x3c` | - |
| `durationSeconds.kHIDUsage_MSR_DeviceReadOnly` | `kHIDUsage_MSR_DeviceReadOnly` | `0x01` | - |
| `durationSeconds.kHIDUsage_MSR_Track1Data` | `kHIDUsage_MSR_Track1Data` | `0x21` | - |
| `durationSeconds.kHIDUsage_MSR_Track1Length` | `kHIDUsage_MSR_Track1Length` | `0x11` | - |
| `durationSeconds.kHIDUsage_MSR_Track2Data` | `kHIDUsage_MSR_Track2Data` | `0x22` | - |
| `durationSeconds.kHIDUsage_MSR_Track2Length` | `kHIDUsage_MSR_Track2Length` | `0x12` | - |
| `durationSeconds.kHIDUsage_MSR_Track3Data` | `kHIDUsage_MSR_Track3Data` | `0x23` | - |
| `durationSeconds.kHIDUsage_MSR_Track3Length` | `kHIDUsage_MSR_Track3Length` | `0x13` | - |
| `durationSeconds.kHIDUsage_MSR_TrackData` | `kHIDUsage_MSR_TrackData` | `0x20` | - |
| `durationSeconds.kHIDUsage_MSR_TrackJISData` | `kHIDUsage_MSR_TrackJISData` | `0x24` | - |
| `durationSeconds.kHIDUsage_MSR_TrackJISLength` | `kHIDUsage_MSR_TrackJISLength` | `0x14` | - |
| `durationSeconds.kHIDUsage_MSR_Undefined` | `kHIDUsage_MSR_Undefined` | `0x00` | - |
| `durationSeconds.kHIDUsage_Ord_Instance1` | `kHIDUsage_Ord_Instance1` | `0x01` | - |
| `durationSeconds.kHIDUsage_Ord_Instance2` | `kHIDUsage_Ord_Instance2` | `0x02` | - |
| `durationSeconds.kHIDUsage_Ord_Instance3` | `kHIDUsage_Ord_Instance3` | `0x03` | - |
| `durationSeconds.kHIDUsage_Ord_Instance4` | `kHIDUsage_Ord_Instance4` | `0x04` | - |
| `durationSeconds.kHIDUsage_Ord_Instance65535` | `kHIDUsage_Ord_Instance65535` | `0xffff` | - |
| `durationSeconds.kHIDUsage_PD_ActivePower` | `kHIDUsage_PD_ActivePower` | `0x34` | - |
| `durationSeconds.kHIDUsage_PD_ApparentPower` | `kHIDUsage_PD_ApparentPower` | `0x33` | - |
| `durationSeconds.kHIDUsage_PD_AudibleAlarmControl` | `kHIDUsage_PD_AudibleAlarmControl` | `0x5a` | - |
| `durationSeconds.kHIDUsage_PD_AwaitingPower` | `kHIDUsage_PD_AwaitingPower` | `0x72` | - |
| `durationSeconds.kHIDUsage_PD_BadCount` | `kHIDUsage_PD_BadCount` | `0x38` | - |
| `durationSeconds.kHIDUsage_PD_Battery` | `kHIDUsage_PD_Battery` | `0x12` | - |
| `durationSeconds.kHIDUsage_PD_BatteryID` | `kHIDUsage_PD_BatteryID` | `0x13` | - |
| `durationSeconds.kHIDUsage_PD_BatterySystem` | `kHIDUsage_PD_BatterySystem` | `0x10` | - |
| `durationSeconds.kHIDUsage_PD_BatterySystemID` | `kHIDUsage_PD_BatterySystemID` | `0x11` | - |
| `durationSeconds.kHIDUsage_PD_Boost` | `kHIDUsage_PD_Boost` | `0x6e` | - |
| `durationSeconds.kHIDUsage_PD_Buck` | `kHIDUsage_PD_Buck` | `0x6f` | - |
| `durationSeconds.kHIDUsage_PD_ChangedStatus` | `kHIDUsage_PD_ChangedStatus` | `0x03` | - |
| `durationSeconds.kHIDUsage_PD_Charger` | `kHIDUsage_PD_Charger` | `0x14` | - |
| `durationSeconds.kHIDUsage_PD_ChargerID` | `kHIDUsage_PD_ChargerID` | `0x15` | - |
| `durationSeconds.kHIDUsage_PD_CommunicationLost` | `kHIDUsage_PD_CommunicationLost` | `0x73` | - |
| `durationSeconds.kHIDUsage_PD_ConfigActivePower` | `kHIDUsage_PD_ConfigActivePower` | `0x44` | - |
| `durationSeconds.kHIDUsage_PD_ConfigApparentPower` | `kHIDUsage_PD_ConfigApparentPower` | `0x43` | - |
| `durationSeconds.kHIDUsage_PD_ConfigCurrent` | `kHIDUsage_PD_ConfigCurrent` | `0x41` | - |
| `durationSeconds.kHIDUsage_PD_ConfigFrequency` | `kHIDUsage_PD_ConfigFrequency` | `0x42` | - |
| `durationSeconds.kHIDUsage_PD_ConfigHumidity` | `kHIDUsage_PD_ConfigHumidity` | `0x47` | - |
| `durationSeconds.kHIDUsage_PD_ConfigPercentLoad` | `kHIDUsage_PD_ConfigPercentLoad` | `0x45` | - |
| `durationSeconds.kHIDUsage_PD_ConfigTemperature` | `kHIDUsage_PD_ConfigTemperature` | `0x46` | - |
| `durationSeconds.kHIDUsage_PD_ConfigVoltage` | `kHIDUsage_PD_ConfigVoltage` | `0x40` | - |
| `durationSeconds.kHIDUsage_PD_Current` | `kHIDUsage_PD_Current` | `0x31` | - |
| `durationSeconds.kHIDUsage_PD_DelayBeforeReboot` | `kHIDUsage_PD_DelayBeforeReboot` | `0x55` | - |
| `durationSeconds.kHIDUsage_PD_DelayBeforeShutdown` | `kHIDUsage_PD_DelayBeforeShutdown` | `0x57` | - |
| `durationSeconds.kHIDUsage_PD_DelayBeforeStartup` | `kHIDUsage_PD_DelayBeforeStartup` | `0x56` | - |
| `durationSeconds.kHIDUsage_PD_Flow` | `kHIDUsage_PD_Flow` | `0x1e` | - |
| `durationSeconds.kHIDUsage_PD_FlowID` | `kHIDUsage_PD_FlowID` | `0x1f` | - |
| `durationSeconds.kHIDUsage_PD_Frequency` | `kHIDUsage_PD_Frequency` | `0x32` | - |
| `durationSeconds.kHIDUsage_PD_FrequencyOutOfRange` | `kHIDUsage_PD_FrequencyOutOfRange` | `0x64` | - |
| `durationSeconds.kHIDUsage_PD_Gang` | `kHIDUsage_PD_Gang` | `0x22` | - |
| `durationSeconds.kHIDUsage_PD_GangID` | `kHIDUsage_PD_GangID` | `0x23` | - |
| `durationSeconds.kHIDUsage_PD_Good` | `kHIDUsage_PD_Good` | `0x61` | - |
| `durationSeconds.kHIDUsage_PD_HighVoltageTransfer` | `kHIDUsage_PD_HighVoltageTransfer` | `0x54` | - |
| `durationSeconds.kHIDUsage_PD_Humidity` | `kHIDUsage_PD_Humidity` | `0x37` | - |
| `durationSeconds.kHIDUsage_PD_Initialized` | `kHIDUsage_PD_Initialized` | `0x70` | - |
| `durationSeconds.kHIDUsage_PD_Input` | `kHIDUsage_PD_Input` | `0x1a` | - |
| `durationSeconds.kHIDUsage_PD_InputID` | `kHIDUsage_PD_InputID` | `0x1b` | - |
| `durationSeconds.kHIDUsage_PD_InternalFailure` | `kHIDUsage_PD_InternalFailure` | `0x62` | - |
| `durationSeconds.kHIDUsage_PD_LowVoltageTransfer` | `kHIDUsage_PD_LowVoltageTransfer` | `0x53` | - |
| `durationSeconds.kHIDUsage_PD_ModuleReset` | `kHIDUsage_PD_ModuleReset` | `0x59` | - |
| `durationSeconds.kHIDUsage_PD_Outlet` | `kHIDUsage_PD_Outlet` | `0x20` | - |
| `durationSeconds.kHIDUsage_PD_OutletID` | `kHIDUsage_PD_OutletID` | `0x21` | - |
| `durationSeconds.kHIDUsage_PD_OutletSystem` | `kHIDUsage_PD_OutletSystem` | `0x18` | - |
| `durationSeconds.kHIDUsage_PD_OutletSystemID` | `kHIDUsage_PD_OutletSystemID` | `0x19` | - |
| `durationSeconds.kHIDUsage_PD_Output` | `kHIDUsage_PD_Output` | `0x1c` | - |
| `durationSeconds.kHIDUsage_PD_OutputID` | `kHIDUsage_PD_OutputID` | `0x1d` | - |
| `durationSeconds.kHIDUsage_PD_OverCharged` | `kHIDUsage_PD_OverCharged` | `0x66` | - |
| `durationSeconds.kHIDUsage_PD_OverTemperature` | `kHIDUsage_PD_OverTemperature` | `0x67` | - |
| `durationSeconds.kHIDUsage_PD_Overload` | `kHIDUsage_PD_Overload` | `0x65` | - |
| `durationSeconds.kHIDUsage_PD_PercentLoad` | `kHIDUsage_PD_PercentLoad` | `0x35` | - |
| `durationSeconds.kHIDUsage_PD_PowerConverter` | `kHIDUsage_PD_PowerConverter` | `0x16` | - |
| `durationSeconds.kHIDUsage_PD_PowerConverterID` | `kHIDUsage_PD_PowerConverterID` | `0x17` | - |
| `durationSeconds.kHIDUsage_PD_PowerSummary` | `kHIDUsage_PD_PowerSummary` | `0x24` | - |
| `durationSeconds.kHIDUsage_PD_PowerSummaryID` | `kHIDUsage_PD_PowerSummaryID` | `0x25` | - |
| `durationSeconds.kHIDUsage_PD_PowerSupply` | `kHIDUsage_PD_PowerSupply` | `0x05` | - |
| `durationSeconds.kHIDUsage_PD_Present` | `kHIDUsage_PD_Present` | `0x60` | - |
| `durationSeconds.kHIDUsage_PD_PresentStatus` | `kHIDUsage_PD_PresentStatus` | `0x02` | - |
| `durationSeconds.kHIDUsage_PD_ShutdownImminent` | `kHIDUsage_PD_ShutdownImminent` | `0x69` | - |
| `durationSeconds.kHIDUsage_PD_ShutdownRequested` | `kHIDUsage_PD_ShutdownRequested` | `0x68` | - |
| `durationSeconds.kHIDUsage_PD_SwitchOffControl` | `kHIDUsage_PD_SwitchOffControl` | `0x51` | - |
| `durationSeconds.kHIDUsage_PD_SwitchOnControl` | `kHIDUsage_PD_SwitchOnControl` | `0x50` | - |
| `durationSeconds.kHIDUsage_PD_SwitchOnOff` | `kHIDUsage_PD_SwitchOnOff` | `0x6b` | - |
| `durationSeconds.kHIDUsage_PD_Switchable` | `kHIDUsage_PD_Switchable` | `0x6c` | - |
| `durationSeconds.kHIDUsage_PD_Temperature` | `kHIDUsage_PD_Temperature` | `0x36` | - |
| `durationSeconds.kHIDUsage_PD_Test` | `kHIDUsage_PD_Test` | `0x58` | - |
| `durationSeconds.kHIDUsage_PD_Tested` | `kHIDUsage_PD_Tested` | `0x71` | - |
| `durationSeconds.kHIDUsage_PD_ToggleControl` | `kHIDUsage_PD_ToggleControl` | `0x52` | - |
| `durationSeconds.kHIDUsage_PD_UPS` | `kHIDUsage_PD_UPS` | `0x04` | - |
| `durationSeconds.kHIDUsage_PD_Undefined` | `kHIDUsage_PD_Undefined` | `0x00` | - |
| `durationSeconds.kHIDUsage_PD_Used` | `kHIDUsage_PD_Used` | `0x6d` | - |
| `durationSeconds.kHIDUsage_PD_Voltage` | `kHIDUsage_PD_Voltage` | `0x30` | - |
| `durationSeconds.kHIDUsage_PD_VoltageOutOfRange` | `kHIDUsage_PD_VoltageOutOfRange` | `0x63` | - |
| `durationSeconds.kHIDUsage_PD_iManufacturer` | `kHIDUsage_PD_iManufacturer` | `0xfd` | - |
| `durationSeconds.kHIDUsage_PD_iName` | `kHIDUsage_PD_iName` | `0x01` | - |
| `durationSeconds.kHIDUsage_PD_iProduct` | `kHIDUsage_PD_iProduct` | `0xfe` | - |
| `durationSeconds.kHIDUsage_PD_iserialNumber` | `kHIDUsage_PD_iserialNumber` | `0xff` | - |
| `durationSeconds.kHIDUsage_PID_ActuatorOverrideSwitch` | `kHIDUsage_PID_ActuatorOverrideSwitch` | `0xa5` | - |
| `durationSeconds.kHIDUsage_PID_ActuatorPower` | `kHIDUsage_PID_ActuatorPower` | `0xa6` | - |
| `durationSeconds.kHIDUsage_PID_ActuatorsEnabled` | `kHIDUsage_PID_ActuatorsEnabled` | `0xa0` | - |
| `durationSeconds.kHIDUsage_PID_AttackLevel` | `kHIDUsage_PID_AttackLevel` | `0x5b` | - |
| `durationSeconds.kHIDUsage_PID_AttackTime` | `kHIDUsage_PID_AttackTime` | `0x5c` | - |
| `durationSeconds.kHIDUsage_PID_AxesEnable` | `kHIDUsage_PID_AxesEnable` | `0x55` | - |
| `durationSeconds.kHIDUsage_PID_BlockFreeReport` | `kHIDUsage_PID_BlockFreeReport` | `0x90` | - |
| `durationSeconds.kHIDUsage_PID_BlockHandle` | `kHIDUsage_PID_BlockHandle` | `0x8f` | - |
| `durationSeconds.kHIDUsage_PID_BlockLoadError` | `kHIDUsage_PID_BlockLoadError` | `0x8e` | - |
| `durationSeconds.kHIDUsage_PID_BlockLoadFull` | `kHIDUsage_PID_BlockLoadFull` | `0x8d` | - |
| `durationSeconds.kHIDUsage_PID_BlockLoadReport` | `kHIDUsage_PID_BlockLoadReport` | `0x89` | - |
| `durationSeconds.kHIDUsage_PID_BlockLoadStatus` | `kHIDUsage_PID_BlockLoadStatus` | `0x8b` | - |
| `durationSeconds.kHIDUsage_PID_BlockLoadSuccess` | `kHIDUsage_PID_BlockLoadSuccess` | `0x8c` | - |
| `durationSeconds.kHIDUsage_PID_BlockType` | `kHIDUsage_PID_BlockType` | `0x59` | - |
| `durationSeconds.kHIDUsage_PID_CP_Offset` | `kHIDUsage_PID_CP_Offset` | `0x60` | - |
| `durationSeconds.kHIDUsage_PID_CreateNewEffectReport` | `kHIDUsage_PID_CreateNewEffectReport` | `0xab` | - |
| `durationSeconds.kHIDUsage_PID_CustomForceData` | `kHIDUsage_PID_CustomForceData` | `0x69` | - |
| `durationSeconds.kHIDUsage_PID_CustomForceDataOffset` | `kHIDUsage_PID_CustomForceDataOffset` | `0x6c` | - |
| `durationSeconds.kHIDUsage_PID_CustomForceDataReport` | `kHIDUsage_PID_CustomForceDataReport` | `0x68` | - |
| `durationSeconds.kHIDUsage_PID_CustomForceVendorDefinedData` | `kHIDUsage_PID_CustomForceVendorDefinedData` | `0x6a` | - |
| `durationSeconds.kHIDUsage_PID_DC_DeviceContinue` | `kHIDUsage_PID_DC_DeviceContinue` | `0x9c` | - |
| `durationSeconds.kHIDUsage_PID_DC_DevicePause` | `kHIDUsage_PID_DC_DevicePause` | `0x9b` | - |
| `durationSeconds.kHIDUsage_PID_DC_DeviceReset` | `kHIDUsage_PID_DC_DeviceReset` | `0x9a` | - |
| `durationSeconds.kHIDUsage_PID_DC_DisableActuators` | `kHIDUsage_PID_DC_DisableActuators` | `0x98` | - |
| `durationSeconds.kHIDUsage_PID_DC_EnableActuators` | `kHIDUsage_PID_DC_EnableActuators` | `0x97` | - |
| `durationSeconds.kHIDUsage_PID_DC_StopAllEffects` | `kHIDUsage_PID_DC_StopAllEffects` | `0x99` | - |
| `durationSeconds.kHIDUsage_PID_DeadBand` | `kHIDUsage_PID_DeadBand` | `0x65` | - |
| `durationSeconds.kHIDUsage_PID_DeviceControl` | `kHIDUsage_PID_DeviceControl` | `0x96` | - |
| `durationSeconds.kHIDUsage_PID_DeviceControlReport` | `kHIDUsage_PID_DeviceControlReport` | `0x95` | - |
| `durationSeconds.kHIDUsage_PID_DeviceGain` | `kHIDUsage_PID_DeviceGain` | `0x7e` | - |
| `durationSeconds.kHIDUsage_PID_DeviceGainReport` | `kHIDUsage_PID_DeviceGainReport` | `0x7d` | - |
| `durationSeconds.kHIDUsage_PID_DeviceManagedPool` | `kHIDUsage_PID_DeviceManagedPool` | `0xa9` | - |
| `durationSeconds.kHIDUsage_PID_DevicePaused` | `kHIDUsage_PID_DevicePaused` | `0x9f` | - |
| `durationSeconds.kHIDUsage_PID_Direction` | `kHIDUsage_PID_Direction` | `0x57` | - |
| `durationSeconds.kHIDUsage_PID_DirectionEnable` | `kHIDUsage_PID_DirectionEnable` | `0x56` | - |
| `durationSeconds.kHIDUsage_PID_DownloadForceSample` | `kHIDUsage_PID_DownloadForceSample` | `0x66` | - |
| `durationSeconds.kHIDUsage_PID_Duration` | `kHIDUsage_PID_Duration` | `0x50` | - |
| `durationSeconds.kHIDUsage_PID_ET_ConstantForce` | `kHIDUsage_PID_ET_ConstantForce` | `0x26` | - |
| `durationSeconds.kHIDUsage_PID_ET_CustomForceData` | `kHIDUsage_PID_ET_CustomForceData` | `0x28` | - |
| `durationSeconds.kHIDUsage_PID_ET_Damper` | `kHIDUsage_PID_ET_Damper` | `0x41` | - |
| `durationSeconds.kHIDUsage_PID_ET_Friction` | `kHIDUsage_PID_ET_Friction` | `0x43` | - |
| `durationSeconds.kHIDUsage_PID_ET_Inertia` | `kHIDUsage_PID_ET_Inertia` | `0x42` | - |
| `durationSeconds.kHIDUsage_PID_ET_Ramp` | `kHIDUsage_PID_ET_Ramp` | `0x27` | - |
| `durationSeconds.kHIDUsage_PID_ET_SawtoothDown` | `kHIDUsage_PID_ET_SawtoothDown` | `0x34` | - |
| `durationSeconds.kHIDUsage_PID_ET_SawtoothUp` | `kHIDUsage_PID_ET_SawtoothUp` | `0x33` | - |
| `durationSeconds.kHIDUsage_PID_ET_Sine` | `kHIDUsage_PID_ET_Sine` | `0x31` | - |
| `durationSeconds.kHIDUsage_PID_ET_Spring` | `kHIDUsage_PID_ET_Spring` | `0x40` | - |
| `durationSeconds.kHIDUsage_PID_ET_Square` | `kHIDUsage_PID_ET_Square` | `0x30` | - |
| `durationSeconds.kHIDUsage_PID_ET_Triangle` | `kHIDUsage_PID_ET_Triangle` | `0x32` | - |
| `durationSeconds.kHIDUsage_PID_EffectBlockIndex` | `kHIDUsage_PID_EffectBlockIndex` | `0x22` | - |
| `durationSeconds.kHIDUsage_PID_EffectOperation` | `kHIDUsage_PID_EffectOperation` | `0x78` | - |
| `durationSeconds.kHIDUsage_PID_EffectOperationReport` | `kHIDUsage_PID_EffectOperationReport` | `0x77` | - |
| `durationSeconds.kHIDUsage_PID_EffectPlaying` | `kHIDUsage_PID_EffectPlaying` | `0x94` | - |
| `durationSeconds.kHIDUsage_PID_EffectType` | `kHIDUsage_PID_EffectType` | `0x25` | - |
| `durationSeconds.kHIDUsage_PID_FadeLevel` | `kHIDUsage_PID_FadeLevel` | `0x5d` | - |
| `durationSeconds.kHIDUsage_PID_FadeTime` | `kHIDUsage_PID_FadeTime` | `0x5e` | - |
| `durationSeconds.kHIDUsage_PID_Gain` | `kHIDUsage_PID_Gain` | `0x52` | - |
| `durationSeconds.kHIDUsage_PID_IsochCustomForceEnable` | `kHIDUsage_PID_IsochCustomForceEnable` | `0x67` | - |
| `durationSeconds.kHIDUsage_PID_LoopCount` | `kHIDUsage_PID_LoopCount` | `0x7c` | - |
| `durationSeconds.kHIDUsage_PID_Magnitude` | `kHIDUsage_PID_Magnitude` | `0x70` | - |
| `durationSeconds.kHIDUsage_PID_MoveDestination` | `kHIDUsage_PID_MoveDestination` | `0x87` | - |
| `durationSeconds.kHIDUsage_PID_MoveLength` | `kHIDUsage_PID_MoveLength` | `0x88` | - |
| `durationSeconds.kHIDUsage_PID_MoveSource` | `kHIDUsage_PID_MoveSource` | `0x86` | - |
| `durationSeconds.kHIDUsage_PID_NegativeCoefficient` | `kHIDUsage_PID_NegativeCoefficient` | `0x62` | - |
| `durationSeconds.kHIDUsage_PID_NegativeSaturation` | `kHIDUsage_PID_NegativeSaturation` | `0x64` | - |
| `durationSeconds.kHIDUsage_PID_Normal` | `kHIDUsage_PID_Normal` | `0x20` | - |
| `durationSeconds.kHIDUsage_PID_Offset` | `kHIDUsage_PID_Offset` | `0x6f` | - |
| `durationSeconds.kHIDUsage_PID_OpEffectStart` | `kHIDUsage_PID_OpEffectStart` | `0x79` | - |
| `durationSeconds.kHIDUsage_PID_OpEffectStartSolo` | `kHIDUsage_PID_OpEffectStartSolo` | `0x7a` | - |
| `durationSeconds.kHIDUsage_PID_OpEffectStop` | `kHIDUsage_PID_OpEffectStop` | `0x7b` | - |
| `durationSeconds.kHIDUsage_PID_ParamBlockOffset` | `kHIDUsage_PID_ParamBlockOffset` | `0x23` | - |
| `durationSeconds.kHIDUsage_PID_ParameterBlockSize` | `kHIDUsage_PID_ParameterBlockSize` | `0xa8` | - |
| `durationSeconds.kHIDUsage_PID_Period` | `kHIDUsage_PID_Period` | `0x72` | - |
| `durationSeconds.kHIDUsage_PID_Phase` | `kHIDUsage_PID_Phase` | `0x71` | - |
| `durationSeconds.kHIDUsage_PID_PhysicalInterfaceDevice` | `kHIDUsage_PID_PhysicalInterfaceDevice` | `0x01` | - |
| `durationSeconds.kHIDUsage_PID_PoolAlignment` | `kHIDUsage_PID_PoolAlignment` | `0x84` | - |
| `durationSeconds.kHIDUsage_PID_PoolMoveReport` | `kHIDUsage_PID_PoolMoveReport` | `0x85` | - |
| `durationSeconds.kHIDUsage_PID_PoolReport` | `kHIDUsage_PID_PoolReport` | `0x7f` | - |
| `durationSeconds.kHIDUsage_PID_PositiveCoefficient` | `kHIDUsage_PID_PositiveCoefficient` | `0x61` | - |
| `durationSeconds.kHIDUsage_PID_PositiveSaturation` | `kHIDUsage_PID_PositiveSaturation` | `0x63` | - |
| `durationSeconds.kHIDUsage_PID_RAM_PoolAvailable` | `kHIDUsage_PID_RAM_PoolAvailable` | `0xac` | - |
| `durationSeconds.kHIDUsage_PID_RAM_PoolSize` | `kHIDUsage_PID_RAM_PoolSize` | `0x80` | - |
| `durationSeconds.kHIDUsage_PID_ROM_EffectBlockCount` | `kHIDUsage_PID_ROM_EffectBlockCount` | `0x82` | - |
| `durationSeconds.kHIDUsage_PID_ROM_Flag` | `kHIDUsage_PID_ROM_Flag` | `0x24` | - |
| `durationSeconds.kHIDUsage_PID_ROM_PoolSize` | `kHIDUsage_PID_ROM_PoolSize` | `0x81` | - |
| `durationSeconds.kHIDUsage_PID_RampEnd` | `kHIDUsage_PID_RampEnd` | `0x76` | - |
| `durationSeconds.kHIDUsage_PID_RampStart` | `kHIDUsage_PID_RampStart` | `0x75` | - |
| `durationSeconds.kHIDUsage_PID_Reserved` | `kHIDUsage_PID_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_PID_SafetySwitch` | `kHIDUsage_PID_SafetySwitch` | `0xa4` | - |
| `durationSeconds.kHIDUsage_PID_SampleCount` | `kHIDUsage_PID_SampleCount` | `0x6d` | - |
| `durationSeconds.kHIDUsage_PID_SamplePeriod` | `kHIDUsage_PID_SamplePeriod` | `0x51` | - |
| `durationSeconds.kHIDUsage_PID_SetConditionReport` | `kHIDUsage_PID_SetConditionReport` | `0x5f` | - |
| `durationSeconds.kHIDUsage_PID_SetConstantForceReport` | `kHIDUsage_PID_SetConstantForceReport` | `0x73` | - |
| `durationSeconds.kHIDUsage_PID_SetCustomForceReport` | `kHIDUsage_PID_SetCustomForceReport` | `0x6b` | - |
| `durationSeconds.kHIDUsage_PID_SetEffectReport` | `kHIDUsage_PID_SetEffectReport` | `0x21` | - |
| `durationSeconds.kHIDUsage_PID_SetEnvelopeReport` | `kHIDUsage_PID_SetEnvelopeReport` | `0x5a` | - |
| `durationSeconds.kHIDUsage_PID_SetPeriodicReport` | `kHIDUsage_PID_SetPeriodicReport` | `0x6e` | - |
| `durationSeconds.kHIDUsage_PID_SetRampForceReport` | `kHIDUsage_PID_SetRampForceReport` | `0x74` | - |
| `durationSeconds.kHIDUsage_PID_SharedParameterBlocks` | `kHIDUsage_PID_SharedParameterBlocks` | `0xaa` | - |
| `durationSeconds.kHIDUsage_PID_SimultaneousEffectsMax` | `kHIDUsage_PID_SimultaneousEffectsMax` | `0x83` | - |
| `durationSeconds.kHIDUsage_PID_StartDelay` | `kHIDUsage_PID_StartDelay` | `0xa7` | - |
| `durationSeconds.kHIDUsage_PID_StateReport` | `kHIDUsage_PID_StateReport` | `0x92` | - |
| `durationSeconds.kHIDUsage_PID_TriggerButton` | `kHIDUsage_PID_TriggerButton` | `0x53` | - |
| `durationSeconds.kHIDUsage_PID_TriggerRepeatInterval` | `kHIDUsage_PID_TriggerRepeatInterval` | `0x54` | - |
| `durationSeconds.kHIDUsage_PID_TypeSpecificBlockHandle` | `kHIDUsage_PID_TypeSpecificBlockHandle` | `0x91` | - |
| `durationSeconds.kHIDUsage_PID_TypeSpecificBlockOffset` | `kHIDUsage_PID_TypeSpecificBlockOffset` | `0x58` | - |
| `durationSeconds.kHIDUsage_Sim_Accelerator` | `kHIDUsage_Sim_Accelerator` | `0xc4` | - |
| `durationSeconds.kHIDUsage_Sim_Aileron` | `kHIDUsage_Sim_Aileron` | `0xb0` | - |
| `durationSeconds.kHIDUsage_Sim_AileronTrim` | `kHIDUsage_Sim_AileronTrim` | `0xb1` | - |
| `durationSeconds.kHIDUsage_Sim_AirplaneSimulationDevice` | `kHIDUsage_Sim_AirplaneSimulationDevice` | `0x09` | - |
| `durationSeconds.kHIDUsage_Sim_AntiTorqueControl` | `kHIDUsage_Sim_AntiTorqueControl` | `0xb2` | - |
| `durationSeconds.kHIDUsage_Sim_AutomobileSimulationDevice` | `kHIDUsage_Sim_AutomobileSimulationDevice` | `0x02` | - |
| `durationSeconds.kHIDUsage_Sim_AutopilotEnable` | `kHIDUsage_Sim_AutopilotEnable` | `0xb3` | - |
| `durationSeconds.kHIDUsage_Sim_Ballast` | `kHIDUsage_Sim_Ballast` | `0xcc` | - |
| `durationSeconds.kHIDUsage_Sim_BarrelElevation` | `kHIDUsage_Sim_BarrelElevation` | `0xca` | - |
| `durationSeconds.kHIDUsage_Sim_BicycleCrank` | `kHIDUsage_Sim_BicycleCrank` | `0xcd` | - |
| `durationSeconds.kHIDUsage_Sim_BicycleSimulationDevice` | `kHIDUsage_Sim_BicycleSimulationDevice` | `0x0c` | - |
| `durationSeconds.kHIDUsage_Sim_Brake` | `kHIDUsage_Sim_Brake` | `0xc5` | - |
| `durationSeconds.kHIDUsage_Sim_ChaffRelease` | `kHIDUsage_Sim_ChaffRelease` | `0xb4` | - |
| `durationSeconds.kHIDUsage_Sim_Clutch` | `kHIDUsage_Sim_Clutch` | `0xc6` | - |
| `durationSeconds.kHIDUsage_Sim_CollectiveControl` | `kHIDUsage_Sim_CollectiveControl` | `0xb5` | - |
| `durationSeconds.kHIDUsage_Sim_CyclicControl` | `kHIDUsage_Sim_CyclicControl` | `0x22` | - |
| `durationSeconds.kHIDUsage_Sim_CyclicTrim` | `kHIDUsage_Sim_CyclicTrim` | `0x23` | - |
| `durationSeconds.kHIDUsage_Sim_DiveBrake` | `kHIDUsage_Sim_DiveBrake` | `0xb6` | - |
| `durationSeconds.kHIDUsage_Sim_DivePlane` | `kHIDUsage_Sim_DivePlane` | `0xcb` | - |
| `durationSeconds.kHIDUsage_Sim_ElectronicCountermeasures` | `kHIDUsage_Sim_ElectronicCountermeasures` | `0xb7` | - |
| `durationSeconds.kHIDUsage_Sim_Elevator` | `kHIDUsage_Sim_Elevator` | `0xb8` | - |
| `durationSeconds.kHIDUsage_Sim_ElevatorTrim` | `kHIDUsage_Sim_ElevatorTrim` | `0xb9` | - |
| `durationSeconds.kHIDUsage_Sim_FlareRelease` | `kHIDUsage_Sim_FlareRelease` | `0xbd` | - |
| `durationSeconds.kHIDUsage_Sim_FlightCommunications` | `kHIDUsage_Sim_FlightCommunications` | `0xbc` | - |
| `durationSeconds.kHIDUsage_Sim_FlightControlStick` | `kHIDUsage_Sim_FlightControlStick` | `0x20` | - |
| `durationSeconds.kHIDUsage_Sim_FlightSimulationDevice` | `kHIDUsage_Sim_FlightSimulationDevice` | `0x01` | - |
| `durationSeconds.kHIDUsage_Sim_FlightStick` | `kHIDUsage_Sim_FlightStick` | `0x21` | - |
| `durationSeconds.kHIDUsage_Sim_FlightYoke` | `kHIDUsage_Sim_FlightYoke` | `0x24` | - |
| `durationSeconds.kHIDUsage_Sim_FrontBrake` | `kHIDUsage_Sim_FrontBrake` | `0xcf` | - |
| `durationSeconds.kHIDUsage_Sim_HandleBars` | `kHIDUsage_Sim_HandleBars` | `0xce` | - |
| `durationSeconds.kHIDUsage_Sim_HelicopterSimulationDevice` | `kHIDUsage_Sim_HelicopterSimulationDevice` | `0x0a` | - |
| `durationSeconds.kHIDUsage_Sim_LandingGear` | `kHIDUsage_Sim_LandingGear` | `0xbe` | - |
| `durationSeconds.kHIDUsage_Sim_MagicCarpetSimulationDevice` | `kHIDUsage_Sim_MagicCarpetSimulationDevice` | `0x0b` | - |
| `durationSeconds.kHIDUsage_Sim_MotorcycleSimulationDevice` | `kHIDUsage_Sim_MotorcycleSimulationDevice` | `0x07` | - |
| `durationSeconds.kHIDUsage_Sim_RearBrake` | `kHIDUsage_Sim_RearBrake` | `0xd0` | - |
| `durationSeconds.kHIDUsage_Sim_Reserved` | `kHIDUsage_Sim_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Sim_Rudder` | `kHIDUsage_Sim_Rudder` | `0xba` | - |
| `durationSeconds.kHIDUsage_Sim_SailingSimulationDevice` | `kHIDUsage_Sim_SailingSimulationDevice` | `0x06` | - |
| `durationSeconds.kHIDUsage_Sim_Shifter` | `kHIDUsage_Sim_Shifter` | `0xc7` | - |
| `durationSeconds.kHIDUsage_Sim_SpaceshipSimulationDevice` | `kHIDUsage_Sim_SpaceshipSimulationDevice` | `0x04` | - |
| `durationSeconds.kHIDUsage_Sim_SportsSimulationDevice` | `kHIDUsage_Sim_SportsSimulationDevice` | `0x08` | - |
| `durationSeconds.kHIDUsage_Sim_Steering` | `kHIDUsage_Sim_Steering` | `0xc8` | - |
| `durationSeconds.kHIDUsage_Sim_SubmarineSimulationDevice` | `kHIDUsage_Sim_SubmarineSimulationDevice` | `0x05` | - |
| `durationSeconds.kHIDUsage_Sim_TankSimulationDevice` | `kHIDUsage_Sim_TankSimulationDevice` | `0x03` | - |
| `durationSeconds.kHIDUsage_Sim_Throttle` | `kHIDUsage_Sim_Throttle` | `0xbb` | - |
| `durationSeconds.kHIDUsage_Sim_ToeBrake` | `kHIDUsage_Sim_ToeBrake` | `0xbf` | - |
| `durationSeconds.kHIDUsage_Sim_TrackControl` | `kHIDUsage_Sim_TrackControl` | `0x25` | - |
| `durationSeconds.kHIDUsage_Sim_Trigger` | `kHIDUsage_Sim_Trigger` | `0xc0` | - |
| `durationSeconds.kHIDUsage_Sim_TurretDirection` | `kHIDUsage_Sim_TurretDirection` | `0xc9` | - |
| `durationSeconds.kHIDUsage_Sim_Weapons` | `kHIDUsage_Sim_Weapons` | `0xc2` | - |
| `durationSeconds.kHIDUsage_Sim_WeaponsArm` | `kHIDUsage_Sim_WeaponsArm` | `0xc1` | - |
| `durationSeconds.kHIDUsage_Sim_WingFlaps` | `kHIDUsage_Sim_WingFlaps` | `0xc3` | - |
| `durationSeconds.kHIDUsage_Sprt_10Iron` | `kHIDUsage_Sprt_10Iron` | `0x5a` | - |
| `durationSeconds.kHIDUsage_Sprt_11Iron` | `kHIDUsage_Sprt_11Iron` | `0x5b` | - |
| `durationSeconds.kHIDUsage_Sprt_1Iron` | `kHIDUsage_Sprt_1Iron` | `0x51` | - |
| `durationSeconds.kHIDUsage_Sprt_1Wood` | `kHIDUsage_Sprt_1Wood` | `0x5f` | - |
| `durationSeconds.kHIDUsage_Sprt_2Iron` | `kHIDUsage_Sprt_2Iron` | `0x52` | - |
| `durationSeconds.kHIDUsage_Sprt_3Iron` | `kHIDUsage_Sprt_3Iron` | `0x53` | - |
| `durationSeconds.kHIDUsage_Sprt_3Wood` | `kHIDUsage_Sprt_3Wood` | `0x60` | - |
| `durationSeconds.kHIDUsage_Sprt_4Iron` | `kHIDUsage_Sprt_4Iron` | `0x54` | - |
| `durationSeconds.kHIDUsage_Sprt_5Iron` | `kHIDUsage_Sprt_5Iron` | `0x55` | - |
| `durationSeconds.kHIDUsage_Sprt_5Wood` | `kHIDUsage_Sprt_5Wood` | `0x61` | - |
| `durationSeconds.kHIDUsage_Sprt_6Iron` | `kHIDUsage_Sprt_6Iron` | `0x56` | - |
| `durationSeconds.kHIDUsage_Sprt_7Iron` | `kHIDUsage_Sprt_7Iron` | `0x57` | - |
| `durationSeconds.kHIDUsage_Sprt_7Wood` | `kHIDUsage_Sprt_7Wood` | `0x62` | - |
| `durationSeconds.kHIDUsage_Sprt_8Iron` | `kHIDUsage_Sprt_8Iron` | `0x58` | - |
| `durationSeconds.kHIDUsage_Sprt_9Iron` | `kHIDUsage_Sprt_9Iron` | `0x59` | - |
| `durationSeconds.kHIDUsage_Sprt_9Wood` | `kHIDUsage_Sprt_9Wood` | `0x63` | - |
| `durationSeconds.kHIDUsage_Sprt_BaseballBat` | `kHIDUsage_Sprt_BaseballBat` | `0x01` | - |
| `durationSeconds.kHIDUsage_Sprt_GolfClub` | `kHIDUsage_Sprt_GolfClub` | `0x02` | - |
| `durationSeconds.kHIDUsage_Sprt_LoftWedge` | `kHIDUsage_Sprt_LoftWedge` | `0x5d` | - |
| `durationSeconds.kHIDUsage_Sprt_Oar` | `kHIDUsage_Sprt_Oar` | `0x30` | - |
| `durationSeconds.kHIDUsage_Sprt_PowerWedge` | `kHIDUsage_Sprt_PowerWedge` | `0x5e` | - |
| `durationSeconds.kHIDUsage_Sprt_Putter` | `kHIDUsage_Sprt_Putter` | `0x50` | - |
| `durationSeconds.kHIDUsage_Sprt_Rate` | `kHIDUsage_Sprt_Rate` | `0x32` | - |
| `durationSeconds.kHIDUsage_Sprt_Reserved` | `kHIDUsage_Sprt_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Sprt_RowingMachine` | `kHIDUsage_Sprt_RowingMachine` | `0x03` | - |
| `durationSeconds.kHIDUsage_Sprt_SandWedge` | `kHIDUsage_Sprt_SandWedge` | `0x5c` | - |
| `durationSeconds.kHIDUsage_Sprt_Slope` | `kHIDUsage_Sprt_Slope` | `0x31` | - |
| `durationSeconds.kHIDUsage_Sprt_StickFaceAngle` | `kHIDUsage_Sprt_StickFaceAngle` | `0x34` | - |
| `durationSeconds.kHIDUsage_Sprt_StickFollowThrough` | `kHIDUsage_Sprt_StickFollowThrough` | `0x36` | - |
| `durationSeconds.kHIDUsage_Sprt_StickHeelOrToe` | `kHIDUsage_Sprt_StickHeelOrToe` | `0x35` | - |
| `durationSeconds.kHIDUsage_Sprt_StickHeight` | `kHIDUsage_Sprt_StickHeight` | `0x39` | - |
| `durationSeconds.kHIDUsage_Sprt_StickSpeed` | `kHIDUsage_Sprt_StickSpeed` | `0x33` | - |
| `durationSeconds.kHIDUsage_Sprt_StickTempo` | `kHIDUsage_Sprt_StickTempo` | `0x37` | - |
| `durationSeconds.kHIDUsage_Sprt_StickType` | `kHIDUsage_Sprt_StickType` | `0x38` | - |
| `durationSeconds.kHIDUsage_Sprt_Treadmill` | `kHIDUsage_Sprt_Treadmill` | `0x04` | - |
| `durationSeconds.kHIDUsage_TFon_Reserved` | `kHIDUsage_TFon_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_Tfon_AlternateFunction` | `kHIDUsage_Tfon_AlternateFunction` | `0x29` | - |
| `durationSeconds.kHIDUsage_Tfon_AnswerOnOrOff` | `kHIDUsage_Tfon_AnswerOnOrOff` | `0x74` | - |
| `durationSeconds.kHIDUsage_Tfon_AnsweringMachine` | `kHIDUsage_Tfon_AnsweringMachine` | `0x02` | - |
| `durationSeconds.kHIDUsage_Tfon_CallWaitingTone` | `kHIDUsage_Tfon_CallWaitingTone` | `0x99` | - |
| `durationSeconds.kHIDUsage_Tfon_CallerID` | `kHIDUsage_Tfon_CallerID` | `0x30` | - |
| `durationSeconds.kHIDUsage_Tfon_Conference` | `kHIDUsage_Tfon_Conference` | `0x2c` | - |
| `durationSeconds.kHIDUsage_Tfon_ConfirmationTone1` | `kHIDUsage_Tfon_ConfirmationTone1` | `0x9a` | - |
| `durationSeconds.kHIDUsage_Tfon_ConfirmationTone2` | `kHIDUsage_Tfon_ConfirmationTone2` | `0x9b` | - |
| `durationSeconds.kHIDUsage_Tfon_DoNotDisturb` | `kHIDUsage_Tfon_DoNotDisturb` | `0x72` | - |
| `durationSeconds.kHIDUsage_Tfon_Drop` | `kHIDUsage_Tfon_Drop` | `0x26` | - |
| `durationSeconds.kHIDUsage_Tfon_Feature` | `kHIDUsage_Tfon_Feature` | `0x22` | - |
| `durationSeconds.kHIDUsage_Tfon_Flash` | `kHIDUsage_Tfon_Flash` | `0x21` | - |
| `durationSeconds.kHIDUsage_Tfon_ForwardCalls` | `kHIDUsage_Tfon_ForwardCalls` | `0x28` | - |
| `durationSeconds.kHIDUsage_Tfon_Handset` | `kHIDUsage_Tfon_Handset` | `0x04` | - |
| `durationSeconds.kHIDUsage_Tfon_Headset` | `kHIDUsage_Tfon_Headset` | `0x05` | - |
| `durationSeconds.kHIDUsage_Tfon_Hold` | `kHIDUsage_Tfon_Hold` | `0x23` | - |
| `durationSeconds.kHIDUsage_Tfon_HookSwitch` | `kHIDUsage_Tfon_HookSwitch` | `0x20` | - |
| `durationSeconds.kHIDUsage_Tfon_InsideDialTone` | `kHIDUsage_Tfon_InsideDialTone` | `0x90` | - |
| `durationSeconds.kHIDUsage_Tfon_InsideRingTone` | `kHIDUsage_Tfon_InsideRingTone` | `0x92` | - |
| `durationSeconds.kHIDUsage_Tfon_InsideRingback` | `kHIDUsage_Tfon_InsideRingback` | `0x95` | - |
| `durationSeconds.kHIDUsage_Tfon_Line` | `kHIDUsage_Tfon_Line` | `0x2a` | - |
| `durationSeconds.kHIDUsage_Tfon_LineBusyTone` | `kHIDUsage_Tfon_LineBusyTone` | `0x97` | - |
| `durationSeconds.kHIDUsage_Tfon_Message` | `kHIDUsage_Tfon_Message` | `0x73` | - |
| `durationSeconds.kHIDUsage_Tfon_MessageControls` | `kHIDUsage_Tfon_MessageControls` | `0x03` | - |
| `durationSeconds.kHIDUsage_Tfon_OutsideDialTone` | `kHIDUsage_Tfon_OutsideDialTone` | `0x91` | - |
| `durationSeconds.kHIDUsage_Tfon_OutsideRingTone` | `kHIDUsage_Tfon_OutsideRingTone` | `0x93` | - |
| `durationSeconds.kHIDUsage_Tfon_OutsideRingback` | `kHIDUsage_Tfon_OutsideRingback` | `0x9d` | - |
| `durationSeconds.kHIDUsage_Tfon_Park` | `kHIDUsage_Tfon_Park` | `0x27` | - |
| `durationSeconds.kHIDUsage_Tfon_Phone` | `kHIDUsage_Tfon_Phone` | `0x01` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneDirectory` | `kHIDUsage_Tfon_PhoneDirectory` | `0x53` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey0` | `kHIDUsage_Tfon_PhoneKey0` | `0xb0` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey1` | `kHIDUsage_Tfon_PhoneKey1` | `0xb1` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey2` | `kHIDUsage_Tfon_PhoneKey2` | `0xb2` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey3` | `kHIDUsage_Tfon_PhoneKey3` | `0xb3` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey4` | `kHIDUsage_Tfon_PhoneKey4` | `0xb4` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey5` | `kHIDUsage_Tfon_PhoneKey5` | `0xb5` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey6` | `kHIDUsage_Tfon_PhoneKey6` | `0xb6` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey7` | `kHIDUsage_Tfon_PhoneKey7` | `0xb7` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey8` | `kHIDUsage_Tfon_PhoneKey8` | `0xb8` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKey9` | `kHIDUsage_Tfon_PhoneKey9` | `0xb9` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKeyA` | `kHIDUsage_Tfon_PhoneKeyA` | `0xbc` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKeyB` | `kHIDUsage_Tfon_PhoneKeyB` | `0xbd` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKeyC` | `kHIDUsage_Tfon_PhoneKeyC` | `0xbe` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKeyD` | `kHIDUsage_Tfon_PhoneKeyD` | `0xbf` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKeyPound` | `kHIDUsage_Tfon_PhoneKeyPound` | `0xbb` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneKeyStar` | `kHIDUsage_Tfon_PhoneKeyStar` | `0xba` | - |
| `durationSeconds.kHIDUsage_Tfon_PhoneMute` | `kHIDUsage_Tfon_PhoneMute` | `0x2f` | - |
| `durationSeconds.kHIDUsage_Tfon_PriorityRingTone` | `kHIDUsage_Tfon_PriorityRingTone` | `0x94` | - |
| `durationSeconds.kHIDUsage_Tfon_PriorityRingback` | `kHIDUsage_Tfon_PriorityRingback` | `0x96` | - |
| `durationSeconds.kHIDUsage_Tfon_ProgrammableButton` | `kHIDUsage_Tfon_ProgrammableButton` | `0x07` | - |
| `durationSeconds.kHIDUsage_Tfon_RecallNumber` | `kHIDUsage_Tfon_RecallNumber` | `0x52` | - |
| `durationSeconds.kHIDUsage_Tfon_Redial` | `kHIDUsage_Tfon_Redial` | `0x24` | - |
| `durationSeconds.kHIDUsage_Tfon_ReorderTone` | `kHIDUsage_Tfon_ReorderTone` | `0x98` | - |
| `durationSeconds.kHIDUsage_Tfon_Ring` | `kHIDUsage_Tfon_Ring` | `0x2e` | - |
| `durationSeconds.kHIDUsage_Tfon_RingEnable` | `kHIDUsage_Tfon_RingEnable` | `0x2d` | - |
| `durationSeconds.kHIDUsage_Tfon_ScreenCalls` | `kHIDUsage_Tfon_ScreenCalls` | `0x71` | - |
| `durationSeconds.kHIDUsage_Tfon_SpeakerPhone` | `kHIDUsage_Tfon_SpeakerPhone` | `0x2b` | - |
| `durationSeconds.kHIDUsage_Tfon_SpeedDial` | `kHIDUsage_Tfon_SpeedDial` | `0x50` | - |
| `durationSeconds.kHIDUsage_Tfon_StoreNumber` | `kHIDUsage_Tfon_StoreNumber` | `0x51` | - |
| `durationSeconds.kHIDUsage_Tfon_TelephonyKeyPad` | `kHIDUsage_Tfon_TelephonyKeyPad` | `0x06` | - |
| `durationSeconds.kHIDUsage_Tfon_TonesOff` | `kHIDUsage_Tfon_TonesOff` | `0x9c` | - |
| `durationSeconds.kHIDUsage_Tfon_Transfer` | `kHIDUsage_Tfon_Transfer` | `0x25` | - |
| `durationSeconds.kHIDUsage_Tfon_VoiceMail` | `kHIDUsage_Tfon_VoiceMail` | `0x70` | - |
| `durationSeconds.kHIDUsage_Undefined` | `kHIDUsage_Undefined` | `0x00` | - |
| `durationSeconds.kHIDUsage_VR_AnimatronicDevice` | `kHIDUsage_VR_AnimatronicDevice` | `0x0a` | - |
| `durationSeconds.kHIDUsage_VR_Belt` | `kHIDUsage_VR_Belt` | `0x01` | - |
| `durationSeconds.kHIDUsage_VR_BodySuit` | `kHIDUsage_VR_BodySuit` | `0x02` | - |
| `durationSeconds.kHIDUsage_VR_DisplayEnable` | `kHIDUsage_VR_DisplayEnable` | `0x21` | - |
| `durationSeconds.kHIDUsage_VR_Flexor` | `kHIDUsage_VR_Flexor` | `0x03` | - |
| `durationSeconds.kHIDUsage_VR_Glove` | `kHIDUsage_VR_Glove` | `0x04` | - |
| `durationSeconds.kHIDUsage_VR_HandTracker` | `kHIDUsage_VR_HandTracker` | `0x07` | - |
| `durationSeconds.kHIDUsage_VR_HeadMountedDisplay` | `kHIDUsage_VR_HeadMountedDisplay` | `0x06` | - |
| `durationSeconds.kHIDUsage_VR_HeadTracker` | `kHIDUsage_VR_HeadTracker` | `0x05` | - |
| `durationSeconds.kHIDUsage_VR_Oculometer` | `kHIDUsage_VR_Oculometer` | `0x08` | - |
| `durationSeconds.kHIDUsage_VR_Reserved` | `kHIDUsage_VR_Reserved` | `0xffff` | - |
| `durationSeconds.kHIDUsage_VR_StereoEnable` | `kHIDUsage_VR_StereoEnable` | `0x20` | - |
| `durationSeconds.kHIDUsage_VR_Vest` | `kHIDUsage_VR_Vest` | `0x09` | - |
| `durationSeconds.kHIDUsage_WD_CalibrationCount` | `kHIDUsage_WD_CalibrationCount` | `0x60` | - |
| `durationSeconds.kHIDUsage_WD_DataScaling` | `kHIDUsage_WD_DataScaling` | `0x41` | - |
| `durationSeconds.kHIDUsage_WD_DataWeight` | `kHIDUsage_WD_DataWeight` | `0x40` | - |
| `durationSeconds.kHIDUsage_WD_EnforcedZeroReturn` | `kHIDUsage_WD_EnforcedZeroReturn` | `0x81` | - |
| `durationSeconds.kHIDUsage_WD_RezeroCount` | `kHIDUsage_WD_RezeroCount` | `0x61` | - |
| `durationSeconds.kHIDUsage_WD_ScaleAtrributeReport` | `kHIDUsage_WD_ScaleAtrributeReport` | `0x30` | - |
| `durationSeconds.kHIDUsage_WD_ScaleControlReport` | `kHIDUsage_WD_ScaleControlReport` | `0x31` | - |
| `durationSeconds.kHIDUsage_WD_ScaleDataReport` | `kHIDUsage_WD_ScaleDataReport` | `0x32` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassGeneric` | `kHIDUsage_WD_ScaleScaleClassGeneric` | `0x2a` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIIIEnglish` | `kHIDUsage_WD_ScaleScaleClassIIIEnglish` | `0x27` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIIILEnglish` | `kHIDUsage_WD_ScaleScaleClassIIILEnglish` | `0x28` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIIILMetric` | `kHIDUsage_WD_ScaleScaleClassIIILMetric` | `0x25` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIIIMetric` | `kHIDUsage_WD_ScaleScaleClassIIIMetric` | `0x24` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIIMetric` | `kHIDUsage_WD_ScaleScaleClassIIMetric` | `0x23` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIMetric` | `kHIDUsage_WD_ScaleScaleClassIMetric` | `0x22` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIMetricCL` | `kHIDUsage_WD_ScaleScaleClassIMetricCL` | `0x21` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIVEnglish` | `kHIDUsage_WD_ScaleScaleClassIVEnglish` | `0x29` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleClassIVMetric` | `kHIDUsage_WD_ScaleScaleClassIVMetric` | `0x26` | - |
| `durationSeconds.kHIDUsage_WD_ScaleScaleDevice` | `kHIDUsage_WD_ScaleScaleDevice` | `0x20` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatisticsReport` | `kHIDUsage_WD_ScaleStatisticsReport` | `0x35` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatus` | `kHIDUsage_WD_ScaleStatus` | `0x70` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusFault` | `kHIDUsage_WD_ScaleStatusFault` | `0x71` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusInMotion` | `kHIDUsage_WD_ScaleStatusInMotion` | `0x73` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusOverWeightLimit` | `kHIDUsage_WD_ScaleStatusOverWeightLimit` | `0x76` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusReport` | `kHIDUsage_WD_ScaleStatusReport` | `0x33` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusRequiresCalibration` | `kHIDUsage_WD_ScaleStatusRequiresCalibration` | `0x77` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusRequiresRezeroing` | `kHIDUsage_WD_ScaleStatusRequiresRezeroing` | `0x78` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusStableAtZero` | `kHIDUsage_WD_ScaleStatusStableAtZero` | `0x72` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusUnderZero` | `kHIDUsage_WD_ScaleStatusUnderZero` | `0x75` | - |
| `durationSeconds.kHIDUsage_WD_ScaleStatusWeightStable` | `kHIDUsage_WD_ScaleStatusWeightStable` | `0x74` | - |
| `durationSeconds.kHIDUsage_WD_ScaleWeightLimitReport` | `kHIDUsage_WD_ScaleWeightLimitReport` | `0x34` | - |
| `durationSeconds.kHIDUsage_WD_Undefined` | `kHIDUsage_WD_Undefined` | `0x00` | - |
| `durationSeconds.kHIDUsage_WD_WeighingDevice` | `kHIDUsage_WD_WeighingDevice` | `0x01` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnit` | `kHIDUsage_WD_WeightUnit` | `0x50` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitAvoirTon` | `kHIDUsage_WD_WeightUnitAvoirTon` | `0x59` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitCarats` | `kHIDUsage_WD_WeightUnitCarats` | `0x54` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitGrains` | `kHIDUsage_WD_WeightUnitGrains` | `0x56` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitGram` | `kHIDUsage_WD_WeightUnitGram` | `0x52` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitKilogram` | `kHIDUsage_WD_WeightUnitKilogram` | `0x53` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitMetricTon` | `kHIDUsage_WD_WeightUnitMetricTon` | `0x58` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitMilligram` | `kHIDUsage_WD_WeightUnitMilligram` | `0x51` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitOunce` | `kHIDUsage_WD_WeightUnitOunce` | `0x5b` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitPennyweights` | `kHIDUsage_WD_WeightUnitPennyweights` | `0x57` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitPound` | `kHIDUsage_WD_WeightUnitPound` | `0x5c` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitTaels` | `kHIDUsage_WD_WeightUnitTaels` | `0x55` | - |
| `durationSeconds.kHIDUsage_WD_WeightUnitTroyOunce` | `kHIDUsage_WD_WeightUnitTroyOunce` | `0x5a` | - |
| `durationSeconds.kHIDUsage_WD_ZeroScale` | `kHIDUsage_WD_ZeroScale` | `0x80` | - |

#### Response

`unknown`

### `mobile: pinch`

Performs a pinch gesture on the given element or on the Application element.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618669-pinchwithscale?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scale` | `any` | - |
| `velocity` | `number` | Pinch scale (float value). A value between `0` and `1` performs a "pinch close" (or "zoom out"); a value greater than `1` performs a "pinch open" ("zoom in"). |
| `elementId?` | `any` | - |

#### Example

<!-- BEGIN:EXAMPLES -->
##### Ruby
<!-- BEGIN:EXAMPLE lang=Ruby -->

```ruby
execute_script 'mobile: pinch', scale: 0.5, velocity: 1.1, element: element.ref
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: pressButton`

Emulates press action on the given physical device button.

This executes different methods based on the platform:

- iOS: [`pressButton:`](https://developer.apple.com/documentation/xctest/xcuidevice/1619052-pressbutton)
- tvOS: [`pressButton:`](https://developer.apple.com/documentation/xctest/xcuiremote/1627475-pressbutton) or [`pressButton:forDuration:`](https://developer.apple.com/documentation/xctest/xcuiremote/1627476-pressbutton)

Use mobilePerformIoHidEvent to call a more universal API to perform a button press with duration on any supported device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `durationSeconds?` | `any` |

#### Response

`unknown`

### `mobile: pullFile`

Pulls a remote file from the device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `remotePath` | `any` |

#### Response

`string`

The same as in `pullFile`

### `mobile: pullFolder`

Pulls the whole folder from the device under test.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `remotePath` | `any` |

#### Response

`string`

The same as `pullFolder`

### `mobile: pushFile`

Pushes the given data to a file on the remote device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `remotePath` | `any` | - |
| `payload` | `string` | The full path to the remote file or a specially formatted path, which points to an item inside an app bundle. |

#### Response

``null``

### `mobile: pushNotification`

Simulates push notification delivery to a simulated device.

**Only "remote" push notifications are supported.** VoIP, Complication, File Provider, and other types are unsupported.

Supported in Xcode SDK 11.4+.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleId` | `any` | - |
| `payload` | `string` | The bundle identifier of the target application |

#### Response

`any`

### `mobile: queryAppState`

Queries the state of an installed application from the device under test.

If the app with the given `bundleId` is not installed, an exception will be thrown.

**`See`**

https://developer.apple.com/documentation/xctest/xcuiapplicationstate?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |

#### Response

`AppState`

The actual application state code

### `mobile: removeApp`

Removes/uninstalls the given application from the device under test.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |

#### Response

`boolean`

`true` if the application has been removed successfully; `false` otherwise

### `mobile: removeCertificate`

Removes installed certificates.

This only works _if and only if_ `py-ios-device` is installed on the same machine Appium is running on.

**`See`**

https://github.com/YueChen-C/py-ios-device

**`Since`**

4.19.2

**`Throws`**

If attempting to remove certificates for a simulated device or if `py-ios-device` is not installed

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the profile |

#### Response

`string`

Returns status acknowledgment status if
tht certificate is successfully removed or 'None' (basically just
forwards the original pyidevice output)

### `mobile: resetLocationService`

Reset the location service on real device.
Raises not implemented error for simulator.

**`Throws`**

If the device is simulator, or 'resetLocation' raises an error.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: resetPermission`

Resets the given permission for the active application under test.
Works for both Simulator and real devices using Xcode SDK 11.4+

**`Throws`**

If permission reset fails on the device.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | `any` |

#### Response

``null``

### `mobile: resetSimulatedLocation`

Resets simulated geolocation value.
Only works since Xcode 14.3/iOS 16.4.
! Do not forget to reset the simulated geolocation value after your automated test is finished.
! If the value is not reset explcitly then the simulated one will remain until the next device restart.

**`Throws`**

If the device under test does not support gelolocation simulation.

**`Since`**

4.18

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: rotateElement`

Performs a rotate gesture on the given element.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618665-rotate?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementId` | `any` | - |
| `rotation` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to perform the gesture on. |
| `velocity` | `number` | The rotation gesture (in radians) |

#### Example

<!-- BEGIN:EXAMPLES -->
##### Java
<!-- BEGIN:EXAMPLE lang=Java -->

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("mobile: rotateElement", ImmutableMap.of(
    // rotate clockwise, 90 degrees
    "rotation", -Math.PI / 2,
    // in approximately two seconds
    "velocity", Math.PI / 4,
    "element", ((RemoteWebElement) element).getId()
));
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: runXCTest`

Run a native XCTest script.

Launches a subprocess that runs the XC Test and blocks until it is completed. Parses the stdout of the process and returns its result as an array.

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** to run such tests; see [the idb docs](https://fbidb.io/docs/test-execution/) for reference.

**`Throws`**

Error thrown if subprocess returns non-zero exit code

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `testRunnerBundleId` | `any` | `undefined` | - |
| `appUnderTestBundleId` | `string` | `undefined` | Test app bundle (e.g.: `io.appium.XCTesterAppUITests.xctrunner`) |
| `xctestBundleId` | `string` | `undefined` | App-under-test bundle |
| `args?` | `any` | `undefined` | - |
| `testType?` | `string` | `undefined` | Test app bundle (e.g.: `io.appium.XCTesterAppUITests.xctrunner`) |
| `env?` | `string` | `undefined` | App-under-test bundle |
| `timeout?` | `string` | `[]` | XCTest bundle ID |

#### Response

`RunXCTestResult`

The array of test results

### `mobile: scroll`

Scrolls an element or the entire screen.

Use this command to emulate precise scrolling in tables or collection views where it is already known to which element the scrolling should be performed.

The arguments define the choosen strategy: one of `name`, `direction`, `predicateString` or `toVisible`.

**All strategies are exclusive**; only one strategy can be used at one time.

**Known Limitations:**

- If it is necessary to perform many scroll gestures on parent container to reach the necessary child element (tens of them), then the method call may fail.  *
- The implemntation of this extension relies on several undocumented XCTest features, which might not always be reliable.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `any` | - |
| `direction?` | `string` | The internal element identifier (as hexadecimal hash string) to scroll on (e.g. the container). The Application element will be used if this argument is not provided. |
| `predicateString?` | `Direction` | The main difference between this command and a `mobile: swipe` command using the same direction is that `mobile: scroll` will attempt to move the current viewport exactly to the next or previous page (the term "page" means the content, which fits into a single device screen). |
| `toVisible?` | `string` | The `NSPredicate` locator of the child element, to which the scrolling should be performed. Has no effect if `elementId` is not a container. |
| `distance?` | `boolean` | If `true`, scrolls to the first visible `elementId` in the parent container. Has no effect if `elementId` is unset. |
| `elementId?` | `number` | A ratio of the screen height; `1.0` means a full-screen-worth of scrolling. |

#### Example

<!-- BEGIN:EXAMPLES -->
##### Python
<!-- BEGIN:EXAMPLE lang=Python -->

```python
driver.execute_script('mobile: scroll', {'direction': 'down'})
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: scrollToElement`

Scrolls the current viewport to the given element.

This command expects the destination element to be inside a scrollable container and is hittable. The scroll direction is detected automatically.

This API uses native XCTest calls, so it is performant. The same native call is implicitly performed by a `click` command if the destination element is outside the current viewport.

**`Since`**

4.7.0

**`Throws`**

If the scrolling action cannot be performed

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elementId` | `any` |

#### Response

``null``

### `mobile: selectPickerWheelValue`

Performs selection of the next or previous picker wheel value.

This might be useful if these values are populated dynamically; you don't know which one to select, or the value selection using the `sendKeys` API does not work (for whatever reason).

**`Throws`**

Upon failure to change the current picker value.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementId` | `any` | - |
| `order` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | `PickerWheel`'s internal element ID as hexadecimal hash string. Value selection will be performed on this element. This element must be of type `XCUIElementTypePickerWheel`. |
| `offset?` | `any` | - |

#### Example

<!-- BEGIN:EXAMPLES -->
##### Java
<!-- BEGIN:EXAMPLE lang=Java -->

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
Map<String, Object> params = new HashMap<>();
params.put("order", "next");
params.put("offset", 0.15);
params.put("element", ((RemoteWebElement) element).getId());
js.executeScript("mobile: selectPickerWheelValue", params);
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

`unknown`

### `mobile: sendBiometricMatch`

Emulates biometric match or non-match event on a simulated device.

The biometric feature is expected to be already enrolled via mobileEnrollBiometric|mobile: enrollBiometric before executing this.

**`Throws`**

If matching fails or the device is not a Simulator.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type?` | `any` | `'touchId'` | - |
| `match?` | `BiometricFeature` | `true` | The biometric feature name. |

#### Response

``null``

### `mobile: setAppearance`

Set the device's UI appearance style

**`Since`**

iOS 12.0

**`Throws`**

if the current platform does not support UI appearance changes

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `style` | `any` |

#### Response

``null``

### `mobile: setPasteboard`

Sets the Simulator's pasteboard content to the given value.

Does not work for real devices.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `any` |
| `encoding?` | `any` |

#### Response

``null``

### `mobile: setPermission`

Set application permission state on Simulator.

**`Since`**

Xcode SDK 11.4

**`Throws`**

If permission setting fails or the device is not a Simulator.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `access` | `any` | - |
| `bundleId` | `Record`<`Partial`<`AccessRule`\>, `PermissionState`\> | One or more access rules to set. |

#### Response

``null``

### `mobile: setSimulatedLocation`

Sets simulated geolocation value.
Only works since Xcode 14.3/iOS 16.4

**`Throws`**

If the device under test does not support gelolocation simulation.

**`Since`**

4.18

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `latitude` | `any` |
| `longitude` | `number` |

#### Response

``null``

### `mobile: shake`

Shake the device

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: siriCommand`

Process a string as speech and send it to Siri.

Presents the Siri UI, if it is not currently active, and accepts a string which is then processed as if it were recognized speech. See [the documentation of `activateWithVoiceRecognitionText`](https://developer.apple.com/documentation/xctest/xcuisiriservice/2852140-activatewithvoicerecognitiontext?language=objc) for more details.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `any` |

#### Response

``null``

### `mobile: source`

Retrieve the source tree of the current page in XML or JSON format.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `format?` | `any` | `'xml'` | - |
| `excludedAttributes?` | `SourceFormat` | `undefined` | Page tree source representation format. |

#### Response

`string`

The source tree of the current page in the given format.

### `mobile: startAudioRecording`

Records the given hardware audio input and saves it into an `.mp4` file.

**To use this command, the `audio_record` security feature must be enabled _and_ [FFMpeg](https://ffmpeg.org/) must be installed on the Appium server.**

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `audioInput` | `any` | `undefined` | - |
| `timeLimit?` | `any` | `undefined` | - |
| `audioCodec?` | `string` \| `number` | `180` | The name of the corresponding audio input device to use for the capture. The full list of capture devices could be shown by executing `ffmpeg -f avfoundation -list_devices true -i ""` |
| `audioBitrate?` | `string` \| `number` | `'aac'` | The maximum recording time, in seconds. |
| `audioChannels?` | `string` | `'128k'` | The name of the audio codec. |
| `audioRate?` | `string` | `2` | The bitrate of the resulting audio stream. |
| `forceRestart?` | `string` \| `number` | `44100` | The count of audio channels in the resulting stream. Setting it to `1` will create a single channel (mono) audio stream. |

#### Response

``null``

### `mobile: startLogsBroadcast`

Starts an iOS system logs broadcast websocket.

The websocket listens on the same host and port as Appium.  The endpoint created is `/ws/session/:sessionId:/appium/syslog`.

If the websocket is already running, this command does nothing.

Each connected webcoket listener will receive syslog lines as soon as they are visible to Appium.

**`See`**

https://appiumpro.com/editions/55-using-mobile-execution-commands-to-continuously-stream-device-logs-with-appium

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: startPcap`

Records the given network traffic capture into a .pcap file.

**`Throws`**

If network traffic capture has failed to start.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `timeLimitSec?` | `any` | `180` | - |
| `forceRestart?` | `number` | `false` | The maximum recording time, in seconds. The maximum value is `43200` (12 hours). |

#### Response

``null``

### `mobile: startPerfRecord`

Starts performance profiling for the device under test.

Relaxing security is mandatory for simulators. It can always work for real devices.

Since XCode 12 the method tries to use `xctrace` tool to record performance stats.

The `instruments` developer utility is used as a fallback for this purpose if `xctrace` is not available.

It is possible to record multiple profiles at the same time.

Read [Recording, Pausing, and Stopping Traces](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/Recording,Pausing,andStoppingTraces.html) for more details.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `timeout?` | `any` | `DEFAULT_TIMEOUT_MS` | - |
| `profileName?` | `number` | `DEFAULT_PROFILE_NAME` | The maximum count of milliseconds to record the profiling information. |
| `pid?` | `string` | `undefined` | The name of existing performance profile to apply. Can also contain the full path to the chosen template on the server file system. Note: not all profiles are supported on mobile devices. |

#### Response

``null``

### `mobile: stopAudioRecording`

Stop recording of the audio input. If no audio recording process is running then
the endpoint will try to get the recently recorded file.
If no previously recorded file is found and no active audio recording
processes are running then the method returns an empty string.

**`Throws`**

If there was an error while getting the recorded file.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`string`

Base64-encoded content of the recorded media file or an
empty string if no audio recording has been started before.

### `mobile: stopLogsBroadcast`

Stops the syslog broadcasting wesocket server previously started by `mobile: startLogsBroadcast`.
If no websocket server is running, this command does nothing.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: stopPcap`

Stops network traffic capture.

If no traffic capture process is running, then the endpoint will try to get the recently recorded file.

If no previously recorded file is found and no active traffic capture processes are running, then the method returns an empty string.

**`Remarks`**

Network capture files can be viewed in [Wireshark](https://www.wireshark.org/) and other similar applications.

**`Throws`**

If there was an error while getting the capture file.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`string`

Base64-encoded content of the recorded pcap file or an empty string if no traffic capture has been started before.

### `mobile: stopPerfRecord`

Stops performance recording operation previously started by XCUITestDriver.mobileStartPerfRecord mobile: startPerfRecord.

If the previous call has already been completed due to the timeout, then its result is returned immediately. An error is thrown if the performance recording failed to start.

The resulting file in `.trace` format can be either returned directly as base64-encoded zip archive or uploaded to a remote location (such files can be pretty large). Afterwards it is possible to unarchive and open such files with Xcode Dev Tools.

**`Throws`**

If no performance recording with given profile name/device udid combination
has been started before or the resulting .trace file has not been generated properly.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `remotePath?` | `any` | `undefined` | - |
| `user?` | `string` | `undefined` | The path to the remote location, where the resulting zipped `.trace` file should be uploaded. The following protocols are supported: `http`, `https`, `ftp`. Null or empty string value (the default setting) means the content of resulting file should be zipped, encoded as Base64 and passed as the endpoint response value. An exception will be thrown if the generated file is too big to fit into the available process memory. |
| `pass?` | `string` | `undefined` | The name of the user for the remote authentication. Only works if `remotePath` is provided. |
| `method?` | `string` | `undefined` | The password for the remote authentication. Only works if `remotePath` is provided. |
| `profileName?` | `Method` | `DEFAULT_PROFILE_NAME` | The http multipart upload method name. Only works if `remotePath` is provided. Defaults to `PUT` |
| `headers?` | `string` | `undefined` | The name of existing performance profile to stop the recording for. Multiple recorders for different profile names could be executed at the same time. |
| `fileFieldName?` | `Record`<`string`, `any`\> | `undefined` | Additional headers mapping for multipart http(s) uploads |
| `formFields?` | `string` | `undefined` | The name of the form field, where the file content BLOB should be stored for http(s) uploads. Defaults to `file` |

#### Response

`string`

The resulting file in `.trace` format. This file can either be returned directly as base64-encoded `.zip` archive or uploaded to a remote location (note that such files may be large), _depending on the `remotePath` argument value._  Thereafter, the file may be unarchived and opened with Xcode Developer Tools.

### `mobile: swipe`

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | `any` |
| `velocity?` | `any` |
| `elementId?` | `Direction` |

#### Response

`unknown`

### `mobile: tap`

Performs tap gesture by coordinates on the given element or on the screen.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `any` | - |
| `y` | `number` | The _x_ coordinate (float value) to tap on. If `elementId` is provided, this is computed relative to the element; otherwise it is computed relative to the active Application element. |
| `elementId?` | `any` | - |

#### Response

``null``

### `mobile: tapWithNumberOfTaps`

Sends one or more taps with one or more touch points.

**`Since`**

1.17.1

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618671-tapwithnumberoftaps?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementId` | `any` | - |
| `numberOfTouches` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to perform one or more taps. |
| `numberOfTaps` | `number` | Number of touch points to use. |

#### Example

<!-- BEGIN:EXAMPLES -->
##### Ruby
<!-- BEGIN:EXAMPLE lang=Ruby -->

```ruby
e = @driver.find_element :id, 'target element'
# Taps the element with a single touch point twice
@driver.execute_script 'mobile: tapWithNumberOfTaps', {element: e.ref, numberOfTaps: 2, numberOfTouches: 1}
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: terminateApp`

Terminates the given app on the device under test.

This command performs termination via [XCTest's `terminate`](https://developer.apple.com/documentation/xctest/xcuiapplication/1500637-terminate) API. If the app is not installed an exception is thrown. If the app is not running then nothing is done.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |

#### Response

`boolean`

`true` if the app has been terminated successfully; `false` otherwise

### `mobile: touchAndHold`

Performs a "long press" gesture on the given element or on the screen.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618663-pressforduration?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `duration` | `any` | - |
| `x?` | `any` | - |
| `y?` | `number` | The duration (in seconds) of the gesture. |
| `elementId?` | `number` | The _x_ coordinate (float value) to double tap on. This is required if `elementId` is not provided. |

#### Example

<!-- BEGIN:EXAMPLES -->
##### JavaScript
<!-- BEGIN:EXAMPLE lang=JavaScript -->

```csharp
Dictionary<string, object> tfLongTap = new Dictionary<string, object>();
tfLongTap.Add("element", element.Id);
tfLongTap.Add("duration", 2.0);
((IJavaScriptExecutor)driver).ExecuteScript("mobile: touchAndHold", tfLongTap);
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

`unknown`

### `mobile: twoFingerTap`

Performs two finger tap gesture on the given element or on the application element.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618675-twofingertap?language=objc

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elementId?` | `any` |

#### Example

<!-- BEGIN:EXAMPLES -->
##### JavaScript
<!-- BEGIN:EXAMPLE lang=JavaScript -->

```csharp
Dictionary<string, object> tfTap = new Dictionary<string, object>();
tfTap.Add("element", element.Id);
((IJavaScriptExecutor)driver).ExecuteScript("mobile: twoFingerTap", tfTap);
```

<!-- END:EXAMPLE -->
<!-- END:EXAMPLES -->

#### Response

``null``

### `mobile: unlock`

Unlock the device

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

``null``

### `mobile: updateSafariPreferences`

Updates Mobile Safari preferences on an iOS Simulator

**`Throws`**

if run on a real device or if the preferences argument is invalid

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Parameters

| Name | Type |
| :------ | :------ |
| `preferences` | `any` |

#### Response

``null``

### `mobile: viewportRect`

Retrieves the viewport dimensions.

The viewport is the device's screen size with status bar size subtracted if the latter is present/visible.

<!-- comment source: method-signature -->

#### Route

`POST /session/:sessionId/execute`

#### Response

`Viewport`

### `mobile: viewportScreenshot`

#### Route

`POST /session/:sessionId/execute`

#### Response

`any`
