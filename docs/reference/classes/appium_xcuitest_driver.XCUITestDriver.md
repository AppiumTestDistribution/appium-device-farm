# Class: XCUITestDriver

[appium-xcuitest-driver](../modules/appium_xcuitest_driver.md).XCUITestDriver

**`Implements`**

## Hierarchy

- [`BaseDriver`](appium_base_driver.BaseDriver.md)

  ↳ **`XCUITestDriver`**

## Table of contents

### Constructors

- [constructor](appium_xcuitest_driver.XCUITestDriver.md#constructor)

### Properties

- [\_audioRecorder](appium_xcuitest_driver.XCUITestDriver.md#_audiorecorder)
- [\_conditionInducerService](appium_xcuitest_driver.XCUITestDriver.md#_conditioninducerservice)
- [\_currentUrl](appium_xcuitest_driver.XCUITestDriver.md#_currenturl)
- [\_deleteCookie](appium_xcuitest_driver.XCUITestDriver.md#_deletecookie)
- [\_eventHistory](appium_xcuitest_driver.XCUITestDriver.md#_eventhistory)
- [\_isSafariIphone](appium_xcuitest_driver.XCUITestDriver.md#_issafariiphone)
- [\_isSafariNotched](appium_xcuitest_driver.XCUITestDriver.md#_issafarinotched)
- [\_log](appium_xcuitest_driver.XCUITestDriver.md#_log)
- [\_perfRecorders](appium_xcuitest_driver.XCUITestDriver.md#_perfrecorders)
- [\_recentScreenRecorder](appium_xcuitest_driver.XCUITestDriver.md#_recentscreenrecorder)
- [\_syslogWebsocketListener](appium_xcuitest_driver.XCUITestDriver.md#_syslogwebsocketlistener)
- [\_trafficCapture](appium_xcuitest_driver.XCUITestDriver.md#_trafficcapture)
- [\_waitingAtoms](appium_xcuitest_driver.XCUITestDriver.md#_waitingatoms)
- [activateApp](appium_xcuitest_driver.XCUITestDriver.md#activateapp)
- [activateRecentWebview](appium_xcuitest_driver.XCUITestDriver.md#activaterecentwebview)
- [active](appium_xcuitest_driver.XCUITestDriver.md#active)
- [allowInsecure](appium_xcuitest_driver.XCUITestDriver.md#allowinsecure)
- [applyMoveToOffset](appium_xcuitest_driver.XCUITestDriver.md#applymovetooffset)
- [asyncPromise](appium_xcuitest_driver.XCUITestDriver.md#asyncpromise)
- [asyncScriptTimeout](appium_xcuitest_driver.XCUITestDriver.md#asyncscripttimeout)
- [asyncWaitMs](appium_xcuitest_driver.XCUITestDriver.md#asyncwaitms)
- [asynclibWaitMs](appium_xcuitest_driver.XCUITestDriver.md#asynclibwaitms)
- [back](appium_xcuitest_driver.XCUITestDriver.md#back)
- [background](appium_xcuitest_driver.XCUITestDriver.md#background)
- [basePath](appium_xcuitest_driver.XCUITestDriver.md#basepath)
- [cacheWebElement](appium_xcuitest_driver.XCUITestDriver.md#cachewebelement)
- [cacheWebElements](appium_xcuitest_driver.XCUITestDriver.md#cachewebelements)
- [cachedWdaStatus](appium_xcuitest_driver.XCUITestDriver.md#cachedwdastatus)
- [caps](appium_xcuitest_driver.XCUITestDriver.md#caps)
- [checkForAlert](appium_xcuitest_driver.XCUITestDriver.md#checkforalert)
- [clear](appium_xcuitest_driver.XCUITestDriver.md#clear)
- [cliArgs](appium_xcuitest_driver.XCUITestDriver.md#cliargs)
- [click](appium_xcuitest_driver.XCUITestDriver.md#click)
- [clickCoords](appium_xcuitest_driver.XCUITestDriver.md#clickcoords)
- [clickWebCoords](appium_xcuitest_driver.XCUITestDriver.md#clickwebcoords)
- [closeApp](appium_xcuitest_driver.XCUITestDriver.md#closeapp)
- [closeWindow](appium_xcuitest_driver.XCUITestDriver.md#closewindow)
- [commandsQueueGuard](appium_xcuitest_driver.XCUITestDriver.md#commandsqueueguard)
- [connectToRemoteDebugger](appium_xcuitest_driver.XCUITestDriver.md#connecttoremotedebugger)
- [contexts](appium_xcuitest_driver.XCUITestDriver.md#contexts)
- [convertElementsForAtoms](appium_xcuitest_driver.XCUITestDriver.md#convertelementsforatoms)
- [curContext](appium_xcuitest_driver.XCUITestDriver.md#curcontext)
- [curCoords](appium_xcuitest_driver.XCUITestDriver.md#curcoords)
- [curWebCoords](appium_xcuitest_driver.XCUITestDriver.md#curwebcoords)
- [curWebFrames](appium_xcuitest_driver.XCUITestDriver.md#curwebframes)
- [curWindowHandle](appium_xcuitest_driver.XCUITestDriver.md#curwindowhandle)
- [denyInsecure](appium_xcuitest_driver.XCUITestDriver.md#denyinsecure)
- [desiredCapConstraints](appium_xcuitest_driver.XCUITestDriver.md#desiredcapconstraints)
- [deviceCaps](appium_xcuitest_driver.XCUITestDriver.md#devicecaps)
- [disableConditionInducer](appium_xcuitest_driver.XCUITestDriver.md#disableconditioninducer)
- [doNativeFind](appium_xcuitest_driver.XCUITestDriver.md#donativefind)
- [driverInfo](appium_xcuitest_driver.XCUITestDriver.md#driverinfo)
- [elementDisplayed](appium_xcuitest_driver.XCUITestDriver.md#elementdisplayed)
- [elementEnabled](appium_xcuitest_driver.XCUITestDriver.md#elementenabled)
- [elementSelected](appium_xcuitest_driver.XCUITestDriver.md#elementselected)
- [enableConditionInducer](appium_xcuitest_driver.XCUITestDriver.md#enableconditioninducer)
- [eventEmitter](appium_xcuitest_driver.XCUITestDriver.md#eventemitter)
- [execute](appium_xcuitest_driver.XCUITestDriver.md#execute)
- [executeAtom](appium_xcuitest_driver.XCUITestDriver.md#executeatom)
- [executeAtomAsync](appium_xcuitest_driver.XCUITestDriver.md#executeatomasync)
- [executeMobile](appium_xcuitest_driver.XCUITestDriver.md#executemobile)
- [extractLogs](appium_xcuitest_driver.XCUITestDriver.md#extractlogs)
- [findElOrEls](appium_xcuitest_driver.XCUITestDriver.md#findelorels)
- [findNativeElementOrElements](appium_xcuitest_driver.XCUITestDriver.md#findnativeelementorelements)
- [findWebElementOrElements](appium_xcuitest_driver.XCUITestDriver.md#findwebelementorelements)
- [forward](appium_xcuitest_driver.XCUITestDriver.md#forward)
- [getAlertButtons](appium_xcuitest_driver.XCUITestDriver.md#getalertbuttons)
- [getAlertText](appium_xcuitest_driver.XCUITestDriver.md#getalerttext)
- [getAtomsElement](appium_xcuitest_driver.XCUITestDriver.md#getatomselement)
- [getAttribute](appium_xcuitest_driver.XCUITestDriver.md#getattribute)
- [getClipboard](appium_xcuitest_driver.XCUITestDriver.md#getclipboard)
- [getContentSize](appium_xcuitest_driver.XCUITestDriver.md#getcontentsize)
- [getContexts](appium_xcuitest_driver.XCUITestDriver.md#getcontexts)
- [getContextsAndViews](appium_xcuitest_driver.XCUITestDriver.md#getcontextsandviews)
- [getCoordinates](appium_xcuitest_driver.XCUITestDriver.md#getcoordinates)
- [getCurrentContext](appium_xcuitest_driver.XCUITestDriver.md#getcurrentcontext)
- [getCurrentUrl](appium_xcuitest_driver.XCUITestDriver.md#getcurrenturl)
- [getDevicePixelRatio](appium_xcuitest_driver.XCUITestDriver.md#getdevicepixelratio)
- [getDeviceTime](appium_xcuitest_driver.XCUITestDriver.md#getdevicetime)
- [getElementId](appium_xcuitest_driver.XCUITestDriver.md#getelementid)
- [getElementRect](appium_xcuitest_driver.XCUITestDriver.md#getelementrect)
- [getElementScreenshot](appium_xcuitest_driver.XCUITestDriver.md#getelementscreenshot)
- [getExtraNativeWebTapOffset](appium_xcuitest_driver.XCUITestDriver.md#getextranativewebtapoffset)
- [getExtraTranslateWebCoordsOffset](appium_xcuitest_driver.XCUITestDriver.md#getextratranslatewebcoordsoffset)
- [getFirstVisibleChild](appium_xcuitest_driver.XCUITestDriver.md#getfirstvisiblechild)
- [getGeoLocation](appium_xcuitest_driver.XCUITestDriver.md#getgeolocation)
- [getLocation](appium_xcuitest_driver.XCUITestDriver.md#getlocation)
- [getLocationInView](appium_xcuitest_driver.XCUITestDriver.md#getlocationinview)
- [getName](appium_xcuitest_driver.XCUITestDriver.md#getname)
- [getNativeAttribute](appium_xcuitest_driver.XCUITestDriver.md#getnativeattribute)
- [getNativePageSource](appium_xcuitest_driver.XCUITestDriver.md#getnativepagesource)
- [getNativeRect](appium_xcuitest_driver.XCUITestDriver.md#getnativerect)
- [getNewRemoteDebugger](appium_xcuitest_driver.XCUITestDriver.md#getnewremotedebugger)
- [getPageSource](appium_xcuitest_driver.XCUITestDriver.md#getpagesource)
- [getProperty](appium_xcuitest_driver.XCUITestDriver.md#getproperty)
- [getRecentWebviewContextId](appium_xcuitest_driver.XCUITestDriver.md#getrecentwebviewcontextid)
- [getSafariDeviceSize](appium_xcuitest_driver.XCUITestDriver.md#getsafaridevicesize)
- [getSafariIsIphone](appium_xcuitest_driver.XCUITestDriver.md#getsafariisiphone)
- [getSafariIsNotched](appium_xcuitest_driver.XCUITestDriver.md#getsafariisnotched)
- [getScreenInfo](appium_xcuitest_driver.XCUITestDriver.md#getscreeninfo)
- [getScreenshot](appium_xcuitest_driver.XCUITestDriver.md#getscreenshot)
- [getSize](appium_xcuitest_driver.XCUITestDriver.md#getsize)
- [getStatusBarHeight](appium_xcuitest_driver.XCUITestDriver.md#getstatusbarheight)
- [getStrings](appium_xcuitest_driver.XCUITestDriver.md#getstrings)
- [getText](appium_xcuitest_driver.XCUITestDriver.md#gettext)
- [getViewportRect](appium_xcuitest_driver.XCUITestDriver.md#getviewportrect)
- [getViewportScreenshot](appium_xcuitest_driver.XCUITestDriver.md#getviewportscreenshot)
- [getWindowHandle](appium_xcuitest_driver.XCUITestDriver.md#getwindowhandle)
- [getWindowHandles](appium_xcuitest_driver.XCUITestDriver.md#getwindowhandles)
- [getWindowRect](appium_xcuitest_driver.XCUITestDriver.md#getwindowrect)
- [getWindowSize](appium_xcuitest_driver.XCUITestDriver.md#getwindowsize)
- [getWindowSizeNative](appium_xcuitest_driver.XCUITestDriver.md#getwindowsizenative)
- [getWindowSizeWeb](appium_xcuitest_driver.XCUITestDriver.md#getwindowsizeweb)
- [hasElementId](appium_xcuitest_driver.XCUITestDriver.md#haselementid)
- [helpers](appium_xcuitest_driver.XCUITestDriver.md#helpers)
- [hideKeyboard](appium_xcuitest_driver.XCUITestDriver.md#hidekeyboard)
- [implicitWaitMs](appium_xcuitest_driver.XCUITestDriver.md#implicitwaitms)
- [initialOpts](appium_xcuitest_driver.XCUITestDriver.md#initialopts)
- [installApp](appium_xcuitest_driver.XCUITestDriver.md#installapp)
- [isAppInstalled](appium_xcuitest_driver.XCUITestDriver.md#isappinstalled)
- [isKeyboardShown](appium_xcuitest_driver.XCUITestDriver.md#iskeyboardshown)
- [isLocked](appium_xcuitest_driver.XCUITestDriver.md#islocked)
- [isWebContext](appium_xcuitest_driver.XCUITestDriver.md#iswebcontext)
- [isWebview](appium_xcuitest_driver.XCUITestDriver.md#iswebview)
- [jwpProxyActive](appium_xcuitest_driver.XCUITestDriver.md#jwpproxyactive)
- [keys](appium_xcuitest_driver.XCUITestDriver.md#keys)
- [landscapeWebCoordsOffset](appium_xcuitest_driver.XCUITestDriver.md#landscapewebcoordsoffset)
- [launchApp](appium_xcuitest_driver.XCUITestDriver.md#launchapp)
- [lifecycleData](appium_xcuitest_driver.XCUITestDriver.md#lifecycledata)
- [listConditionInducers](appium_xcuitest_driver.XCUITestDriver.md#listconditioninducers)
- [listWebFrames](appium_xcuitest_driver.XCUITestDriver.md#listwebframes)
- [locatorStrategies](appium_xcuitest_driver.XCUITestDriver.md#locatorstrategies)
- [lock](appium_xcuitest_driver.XCUITestDriver.md#lock)
- [logs](appium_xcuitest_driver.XCUITestDriver.md#logs)
- [managedDrivers](appium_xcuitest_driver.XCUITestDriver.md#manageddrivers)
- [mjpegStream](appium_xcuitest_driver.XCUITestDriver.md#mjpegstream)
- [mobileActivateApp](appium_xcuitest_driver.XCUITestDriver.md#mobileactivateapp)
- [mobileDeepLink](appium_xcuitest_driver.XCUITestDriver.md#mobiledeeplink)
- [mobileDeleteFile](appium_xcuitest_driver.XCUITestDriver.md#mobiledeletefile)
- [mobileDeleteFolder](appium_xcuitest_driver.XCUITestDriver.md#mobiledeletefolder)
- [mobileDoubleTap](appium_xcuitest_driver.XCUITestDriver.md#mobiledoubletap)
- [mobileDragFromToForDuration](appium_xcuitest_driver.XCUITestDriver.md#mobiledragfromtoforduration)
- [mobileDragFromToWithVelocity](appium_xcuitest_driver.XCUITestDriver.md#mobiledragfromtowithvelocity)
- [mobileExpectNotification](appium_xcuitest_driver.XCUITestDriver.md#mobileexpectnotification)
- [mobileForcePress](appium_xcuitest_driver.XCUITestDriver.md#mobileforcepress)
- [mobileGetActiveAppInfo](appium_xcuitest_driver.XCUITestDriver.md#mobilegetactiveappinfo)
- [mobileGetAppearance](appium_xcuitest_driver.XCUITestDriver.md#mobilegetappearance)
- [mobileGetBatteryInfo](appium_xcuitest_driver.XCUITestDriver.md#mobilegetbatteryinfo)
- [mobileGetContexts](appium_xcuitest_driver.XCUITestDriver.md#mobilegetcontexts)
- [mobileGetDeviceInfo](appium_xcuitest_driver.XCUITestDriver.md#mobilegetdeviceinfo)
- [mobileGetDeviceTime](appium_xcuitest_driver.XCUITestDriver.md#mobilegetdevicetime)
- [mobileGetSimulatedLocation](appium_xcuitest_driver.XCUITestDriver.md#mobilegetsimulatedlocation)
- [mobileGetSource](appium_xcuitest_driver.XCUITestDriver.md#mobilegetsource)
- [mobileHandleAlert](appium_xcuitest_driver.XCUITestDriver.md#mobilehandlealert)
- [mobileHideKeyboard](appium_xcuitest_driver.XCUITestDriver.md#mobilehidekeyboard)
- [mobileInstallApp](appium_xcuitest_driver.XCUITestDriver.md#mobileinstallapp)
- [mobileInstallCertificate](appium_xcuitest_driver.XCUITestDriver.md#mobileinstallcertificate)
- [mobileInstallXCTestBundle](appium_xcuitest_driver.XCUITestDriver.md#mobileinstallxctestbundle)
- [mobileIsAppInstalled](appium_xcuitest_driver.XCUITestDriver.md#mobileisappinstalled)
- [mobileLaunchApp](appium_xcuitest_driver.XCUITestDriver.md#mobilelaunchapp)
- [mobileListCertificates](appium_xcuitest_driver.XCUITestDriver.md#mobilelistcertificates)
- [mobileListXCTestBundles](appium_xcuitest_driver.XCUITestDriver.md#mobilelistxctestbundles)
- [mobileListXCTestsInTestBundle](appium_xcuitest_driver.XCUITestDriver.md#mobilelistxctestsintestbundle)
- [mobilePerformAccessibilityAudit](appium_xcuitest_driver.XCUITestDriver.md#mobileperformaccessibilityaudit)
- [mobilePerformIoHidEvent](appium_xcuitest_driver.XCUITestDriver.md#mobileperformiohidevent)
- [mobilePinch](appium_xcuitest_driver.XCUITestDriver.md#mobilepinch)
- [mobilePressButton](appium_xcuitest_driver.XCUITestDriver.md#mobilepressbutton)
- [mobilePullFile](appium_xcuitest_driver.XCUITestDriver.md#mobilepullfile)
- [mobilePullFolder](appium_xcuitest_driver.XCUITestDriver.md#mobilepullfolder)
- [mobilePushFile](appium_xcuitest_driver.XCUITestDriver.md#mobilepushfile)
- [mobileQueryAppState](appium_xcuitest_driver.XCUITestDriver.md#mobilequeryappstate)
- [mobileRemoveApp](appium_xcuitest_driver.XCUITestDriver.md#mobileremoveapp)
- [mobileResetLocationService](appium_xcuitest_driver.XCUITestDriver.md#mobileresetlocationservice)
- [mobileResetPermission](appium_xcuitest_driver.XCUITestDriver.md#mobileresetpermission)
- [mobileResetSimulatedLocation](appium_xcuitest_driver.XCUITestDriver.md#mobileresetsimulatedlocation)
- [mobileRotateElement](appium_xcuitest_driver.XCUITestDriver.md#mobilerotateelement)
- [mobileRunXCTest](appium_xcuitest_driver.XCUITestDriver.md#mobilerunxctest)
- [mobileScroll](appium_xcuitest_driver.XCUITestDriver.md#mobilescroll)
- [mobileScrollToElement](appium_xcuitest_driver.XCUITestDriver.md#mobilescrolltoelement)
- [mobileSelectPickerWheelValue](appium_xcuitest_driver.XCUITestDriver.md#mobileselectpickerwheelvalue)
- [mobileSetAppearance](appium_xcuitest_driver.XCUITestDriver.md#mobilesetappearance)
- [mobileSetSimulatedLocation](appium_xcuitest_driver.XCUITestDriver.md#mobilesetsimulatedlocation)
- [mobileSiriCommand](appium_xcuitest_driver.XCUITestDriver.md#mobilesiricommand)
- [mobileStartLogsBroadcast](appium_xcuitest_driver.XCUITestDriver.md#mobilestartlogsbroadcast)
- [mobileStartPcap](appium_xcuitest_driver.XCUITestDriver.md#mobilestartpcap)
- [mobileStartPerfRecord](appium_xcuitest_driver.XCUITestDriver.md#mobilestartperfrecord)
- [mobileStopLogsBroadcast](appium_xcuitest_driver.XCUITestDriver.md#mobilestoplogsbroadcast)
- [mobileStopPcap](appium_xcuitest_driver.XCUITestDriver.md#mobilestoppcap)
- [mobileStopPerfRecord](appium_xcuitest_driver.XCUITestDriver.md#mobilestopperfrecord)
- [mobileSwipe](appium_xcuitest_driver.XCUITestDriver.md#mobileswipe)
- [mobileTap](appium_xcuitest_driver.XCUITestDriver.md#mobiletap)
- [mobileTapWithNumberOfTaps](appium_xcuitest_driver.XCUITestDriver.md#mobiletapwithnumberoftaps)
- [mobileTerminateApp](appium_xcuitest_driver.XCUITestDriver.md#mobileterminateapp)
- [mobileTouchAndHold](appium_xcuitest_driver.XCUITestDriver.md#mobiletouchandhold)
- [mobileTwoFingerTap](appium_xcuitest_driver.XCUITestDriver.md#mobiletwofingertap)
- [mobileWebNav](appium_xcuitest_driver.XCUITestDriver.md#mobilewebnav)
- [moveTo](appium_xcuitest_driver.XCUITestDriver.md#moveto)
- [nativeBack](appium_xcuitest_driver.XCUITestDriver.md#nativeback)
- [nativeWebTap](appium_xcuitest_driver.XCUITestDriver.md#nativewebtap)
- [newCommandTimeoutMs](appium_xcuitest_driver.XCUITestDriver.md#newcommandtimeoutms)
- [noCommandTimer](appium_xcuitest_driver.XCUITestDriver.md#nocommandtimer)
- [onPageChange](appium_xcuitest_driver.XCUITestDriver.md#onpagechange)
- [opts](appium_xcuitest_driver.XCUITestDriver.md#opts)
- [originalCaps](appium_xcuitest_driver.XCUITestDriver.md#originalcaps)
- [pageLoadMs](appium_xcuitest_driver.XCUITestDriver.md#pageloadms)
- [pageLoadTimeoutMJSONWP](appium_xcuitest_driver.XCUITestDriver.md#pageloadtimeoutmjsonwp)
- [pageLoadTimeoutW3C](appium_xcuitest_driver.XCUITestDriver.md#pageloadtimeoutw3c)
- [performActions](appium_xcuitest_driver.XCUITestDriver.md#performactions)
- [performTouch](appium_xcuitest_driver.XCUITestDriver.md#performtouch)
- [postAcceptAlert](appium_xcuitest_driver.XCUITestDriver.md#postacceptalert)
- [postDismissAlert](appium_xcuitest_driver.XCUITestDriver.md#postdismissalert)
- [protocol](appium_xcuitest_driver.XCUITestDriver.md#protocol)
- [proxyCommand](appium_xcuitest_driver.XCUITestDriver.md#proxycommand)
- [proxyReqRes](appium_xcuitest_driver.XCUITestDriver.md#proxyreqres)
- [pullFile](appium_xcuitest_driver.XCUITestDriver.md#pullfile)
- [pullFolder](appium_xcuitest_driver.XCUITestDriver.md#pullfolder)
- [pushFile](appium_xcuitest_driver.XCUITestDriver.md#pushfile)
- [queryAppState](appium_xcuitest_driver.XCUITestDriver.md#queryappstate)
- [receiveAsyncResponse](appium_xcuitest_driver.XCUITestDriver.md#receiveasyncresponse)
- [relaxedSecurityEnabled](appium_xcuitest_driver.XCUITestDriver.md#relaxedsecurityenabled)
- [releaseActions](appium_xcuitest_driver.XCUITestDriver.md#releaseactions)
- [remote](appium_xcuitest_driver.XCUITestDriver.md#remote)
- [removeApp](appium_xcuitest_driver.XCUITestDriver.md#removeapp)
- [resetOnUnexpectedShutdown](appium_xcuitest_driver.XCUITestDriver.md#resetonunexpectedshutdown)
- [safari](appium_xcuitest_driver.XCUITestDriver.md#safari)
- [scriptTimeoutMJSONWP](appium_xcuitest_driver.XCUITestDriver.md#scripttimeoutmjsonwp)
- [scriptTimeoutW3C](appium_xcuitest_driver.XCUITestDriver.md#scripttimeoutw3c)
- [selectingNewPage](appium_xcuitest_driver.XCUITestDriver.md#selectingnewpage)
- [server](appium_xcuitest_driver.XCUITestDriver.md#server)
- [serverHost](appium_xcuitest_driver.XCUITestDriver.md#serverhost)
- [serverPath](appium_xcuitest_driver.XCUITestDriver.md#serverpath)
- [serverPort](appium_xcuitest_driver.XCUITestDriver.md#serverport)
- [sessionId](appium_xcuitest_driver.XCUITestDriver.md#sessionid)
- [setAlertText](appium_xcuitest_driver.XCUITestDriver.md#setalerttext)
- [setAsyncScriptTimeout](appium_xcuitest_driver.XCUITestDriver.md#setasyncscripttimeout)
- [setClipboard](appium_xcuitest_driver.XCUITestDriver.md#setclipboard)
- [setContext](appium_xcuitest_driver.XCUITestDriver.md#setcontext)
- [setCurrentUrl](appium_xcuitest_driver.XCUITestDriver.md#setcurrenturl)
- [setGeoLocation](appium_xcuitest_driver.XCUITestDriver.md#setgeolocation)
- [setPageLoadTimeout](appium_xcuitest_driver.XCUITestDriver.md#setpageloadtimeout)
- [setUrl](appium_xcuitest_driver.XCUITestDriver.md#seturl)
- [setValue](appium_xcuitest_driver.XCUITestDriver.md#setvalue)
- [setValueImmediate](appium_xcuitest_driver.XCUITestDriver.md#setvalueimmediate)
- [setWindow](appium_xcuitest_driver.XCUITestDriver.md#setwindow)
- [settings](appium_xcuitest_driver.XCUITestDriver.md#settings)
- [shouldValidateCaps](appium_xcuitest_driver.XCUITestDriver.md#shouldvalidatecaps)
- [shutdownUnexpectedly](appium_xcuitest_driver.XCUITestDriver.md#shutdownunexpectedly)
- [startLogCapture](appium_xcuitest_driver.XCUITestDriver.md#startlogcapture)
- [startRecordingScreen](appium_xcuitest_driver.XCUITestDriver.md#startrecordingscreen)
- [stopAudioRecording](appium_xcuitest_driver.XCUITestDriver.md#stopaudiorecording)
- [stopRecordingScreen](appium_xcuitest_driver.XCUITestDriver.md#stoprecordingscreen)
- [stopRemote](appium_xcuitest_driver.XCUITestDriver.md#stopremote)
- [supportedLogTypes](appium_xcuitest_driver.XCUITestDriver.md#supportedlogtypes)
- [terminateApp](appium_xcuitest_driver.XCUITestDriver.md#terminateapp)
- [toggleEnrollTouchId](appium_xcuitest_driver.XCUITestDriver.md#toggleenrolltouchid)
- [touchId](appium_xcuitest_driver.XCUITestDriver.md#touchid)
- [translateWebCoords](appium_xcuitest_driver.XCUITestDriver.md#translatewebcoords)
- [unlock](appium_xcuitest_driver.XCUITestDriver.md#unlock)
- [useNewSafari](appium_xcuitest_driver.XCUITestDriver.md#usenewsafari)
- [waitForAtom](appium_xcuitest_driver.XCUITestDriver.md#waitforatom)
- [wda](appium_xcuitest_driver.XCUITestDriver.md#wda)
- [wdaCaps](appium_xcuitest_driver.XCUITestDriver.md#wdacaps)
- [webElementsCache](appium_xcuitest_driver.XCUITestDriver.md#webelementscache)
- [webLocatorStrategies](appium_xcuitest_driver.XCUITestDriver.md#weblocatorstrategies)
- [windowHandleCache](appium_xcuitest_driver.XCUITestDriver.md#windowhandlecache)
- [xcodeVersion](appium_xcuitest_driver.XCUITestDriver.md#xcodeversion)
- [baseVersion](appium_xcuitest_driver.XCUITestDriver.md#baseversion)
- [executeMethodMap](appium_xcuitest_driver.XCUITestDriver.md#executemethodmap)
- [newMethodMap](appium_xcuitest_driver.XCUITestDriver.md#newmethodmap)

### Mobile Web Only

- [deleteCookie](appium_xcuitest_driver.XCUITestDriver.md#deletecookie)
- [deleteCookies](appium_xcuitest_driver.XCUITestDriver.md#deletecookies)
- [executeAsync](appium_xcuitest_driver.XCUITestDriver.md#executeasync)
- [getCookies](appium_xcuitest_driver.XCUITestDriver.md#getcookies)
- [getCssProperty](appium_xcuitest_driver.XCUITestDriver.md#getcssproperty)
- [getUrl](appium_xcuitest_driver.XCUITestDriver.md#geturl)
- [refresh](appium_xcuitest_driver.XCUITestDriver.md#refresh)
- [setCookie](appium_xcuitest_driver.XCUITestDriver.md#setcookie)
- [setFrame](appium_xcuitest_driver.XCUITestDriver.md#setframe)
- [submit](appium_xcuitest_driver.XCUITestDriver.md#submit)
- [title](appium_xcuitest_driver.XCUITestDriver.md#title)

### Simulator Only

- [mobileClearKeychains](appium_xcuitest_driver.XCUITestDriver.md#mobileclearkeychains)
- [mobileConfigureLocalization](appium_xcuitest_driver.XCUITestDriver.md#mobileconfigurelocalization)
- [mobileEnrollBiometric](appium_xcuitest_driver.XCUITestDriver.md#mobileenrollbiometric)
- [mobileGetPasteboard](appium_xcuitest_driver.XCUITestDriver.md#mobilegetpasteboard)
- [mobileGetPermission](appium_xcuitest_driver.XCUITestDriver.md#mobilegetpermission)
- [mobileIsBiometricEnrolled](appium_xcuitest_driver.XCUITestDriver.md#mobileisbiometricenrolled)
- [mobilePushNotification](appium_xcuitest_driver.XCUITestDriver.md#mobilepushnotification)
- [mobileSendBiometricMatch](appium_xcuitest_driver.XCUITestDriver.md#mobilesendbiometricmatch)
- [mobileSetPasteboard](appium_xcuitest_driver.XCUITestDriver.md#mobilesetpasteboard)
- [mobileSetPermissions](appium_xcuitest_driver.XCUITestDriver.md#mobilesetpermissions)
- [mobileShake](appium_xcuitest_driver.XCUITestDriver.md#mobileshake)
- [mobileUpdateSafariPreferences](appium_xcuitest_driver.XCUITestDriver.md#mobileupdatesafaripreferences)

### Real Device Only

- [mobileKillApp](appium_xcuitest_driver.XCUITestDriver.md#mobilekillapp)
- [mobileListApps](appium_xcuitest_driver.XCUITestDriver.md#mobilelistapps)
- [mobileRemoveCertificate](appium_xcuitest_driver.XCUITestDriver.md#mobileremovecertificate)
- [startAudioRecording](appium_xcuitest_driver.XCUITestDriver.md#startaudiorecording)

### Native Only

- [nativeClick](appium_xcuitest_driver.XCUITestDriver.md#nativeclick)
- [performMultiAction](appium_xcuitest_driver.XCUITestDriver.md#performmultiaction)

### Accessors

- [\_desiredCapConstraints](appium_xcuitest_driver.XCUITestDriver.md#_desiredcapconstraints)
- [driverData](appium_xcuitest_driver.XCUITestDriver.md#driverdata)
- [eventHistory](appium_xcuitest_driver.XCUITestDriver.md#eventhistory)
- [isCommandsQueueEnabled](appium_xcuitest_driver.XCUITestDriver.md#iscommandsqueueenabled)
- [log](appium_xcuitest_driver.XCUITestDriver.md#log)

### Methods

- [\_getCommandTimeout](appium_xcuitest_driver.XCUITestDriver.md#_getcommandtimeout)
- [addManagedDriver](appium_xcuitest_driver.XCUITestDriver.md#addmanageddriver)
- [assertFeatureEnabled](appium_xcuitest_driver.XCUITestDriver.md#assertfeatureenabled)
- [assignServer](appium_xcuitest_driver.XCUITestDriver.md#assignserver)
- [canProxy](appium_xcuitest_driver.XCUITestDriver.md#canproxy)
- [checkAutInstallationState](appium_xcuitest_driver.XCUITestDriver.md#checkautinstallationstate)
- [clearNewCommandTimeout](appium_xcuitest_driver.XCUITestDriver.md#clearnewcommandtimeout)
- [configureApp](appium_xcuitest_driver.XCUITestDriver.md#configureapp)
- [createSession](appium_xcuitest_driver.XCUITestDriver.md#createsession)
- [createSim](appium_xcuitest_driver.XCUITestDriver.md#createsim)
- [deleteSession](appium_xcuitest_driver.XCUITestDriver.md#deletesession)
- [determineDevice](appium_xcuitest_driver.XCUITestDriver.md#determinedevice)
- [driverForSession](appium_xcuitest_driver.XCUITestDriver.md#driverforsession)
- [ensureFeatureEnabled](appium_xcuitest_driver.XCUITestDriver.md#ensurefeatureenabled)
- [executeCommand](appium_xcuitest_driver.XCUITestDriver.md#executecommand)
- [executeMethod](appium_xcuitest_driver.XCUITestDriver.md#executemethod)
- [findElOrElsWithProcessing](appium_xcuitest_driver.XCUITestDriver.md#findelorelswithprocessing)
- [findElement](appium_xcuitest_driver.XCUITestDriver.md#findelement)
- [findElementFromElement](appium_xcuitest_driver.XCUITestDriver.md#findelementfromelement)
- [findElementFromShadowRoot](appium_xcuitest_driver.XCUITestDriver.md#findelementfromshadowroot)
- [findElements](appium_xcuitest_driver.XCUITestDriver.md#findelements)
- [findElementsFromElement](appium_xcuitest_driver.XCUITestDriver.md#findelementsfromelement)
- [findElementsFromShadowRoot](appium_xcuitest_driver.XCUITestDriver.md#findelementsfromshadowroot)
- [getDefaultUrl](appium_xcuitest_driver.XCUITestDriver.md#getdefaulturl)
- [getLog](appium_xcuitest_driver.XCUITestDriver.md#getlog)
- [getLogEvents](appium_xcuitest_driver.XCUITestDriver.md#getlogevents)
- [getLogTypes](appium_xcuitest_driver.XCUITestDriver.md#getlogtypes)
- [getManagedDrivers](appium_xcuitest_driver.XCUITestDriver.md#getmanageddrivers)
- [getProxyAvoidList](appium_xcuitest_driver.XCUITestDriver.md#getproxyavoidlist)
- [getSession](appium_xcuitest_driver.XCUITestDriver.md#getsession)
- [getSessions](appium_xcuitest_driver.XCUITestDriver.md#getsessions)
- [getSettings](appium_xcuitest_driver.XCUITestDriver.md#getsettings)
- [getStatus](appium_xcuitest_driver.XCUITestDriver.md#getstatus)
- [getTimeouts](appium_xcuitest_driver.XCUITestDriver.md#gettimeouts)
- [implicitWait](appium_xcuitest_driver.XCUITestDriver.md#implicitwait)
- [implicitWaitForCondition](appium_xcuitest_driver.XCUITestDriver.md#implicitwaitforcondition)
- [implicitWaitMJSONWP](appium_xcuitest_driver.XCUITestDriver.md#implicitwaitmjsonwp)
- [implicitWaitW3C](appium_xcuitest_driver.XCUITestDriver.md#implicitwaitw3c)
- [installAUT](appium_xcuitest_driver.XCUITestDriver.md#installaut)
- [installOtherApps](appium_xcuitest_driver.XCUITestDriver.md#installotherapps)
- [isFeatureEnabled](appium_xcuitest_driver.XCUITestDriver.md#isfeatureenabled)
- [isMjsonwpProtocol](appium_xcuitest_driver.XCUITestDriver.md#ismjsonwpprotocol)
- [isRealDevice](appium_xcuitest_driver.XCUITestDriver.md#isrealdevice)
- [isSafari](appium_xcuitest_driver.XCUITestDriver.md#issafari)
- [isSimulator](appium_xcuitest_driver.XCUITestDriver.md#issimulator)
- [isW3CProtocol](appium_xcuitest_driver.XCUITestDriver.md#isw3cprotocol)
- [isXcodebuildNeeded](appium_xcuitest_driver.XCUITestDriver.md#isxcodebuildneeded)
- [logCustomEvent](appium_xcuitest_driver.XCUITestDriver.md#logcustomevent)
- [logEvent](appium_xcuitest_driver.XCUITestDriver.md#logevent)
- [logExtraCaps](appium_xcuitest_driver.XCUITestDriver.md#logextracaps)
- [mergeCliArgsToOpts](appium_xcuitest_driver.XCUITestDriver.md#mergecliargstoopts)
- [newCommandTimeout](appium_xcuitest_driver.XCUITestDriver.md#newcommandtimeout)
- [onPostConfigureApp](appium_xcuitest_driver.XCUITestDriver.md#onpostconfigureapp)
- [onSettingsUpdate](appium_xcuitest_driver.XCUITestDriver.md#onsettingsupdate)
- [onUnexpectedShutdown](appium_xcuitest_driver.XCUITestDriver.md#onunexpectedshutdown)
- [parseTimeoutArgument](appium_xcuitest_driver.XCUITestDriver.md#parsetimeoutargument)
- [proxyActive](appium_xcuitest_driver.XCUITestDriver.md#proxyactive)
- [proxyRouteIsAvoided](appium_xcuitest_driver.XCUITestDriver.md#proxyrouteisavoided)
- [reset](appium_xcuitest_driver.XCUITestDriver.md#reset)
- [resetIos](appium_xcuitest_driver.XCUITestDriver.md#resetios)
- [runReset](appium_xcuitest_driver.XCUITestDriver.md#runreset)
- [sessionExists](appium_xcuitest_driver.XCUITestDriver.md#sessionexists)
- [setImplicitWait](appium_xcuitest_driver.XCUITestDriver.md#setimplicitwait)
- [setInitialOrientation](appium_xcuitest_driver.XCUITestDriver.md#setinitialorientation)
- [setNewCommandTimeout](appium_xcuitest_driver.XCUITestDriver.md#setnewcommandtimeout)
- [setProtocolMJSONWP](appium_xcuitest_driver.XCUITestDriver.md#setprotocolmjsonwp)
- [setProtocolW3C](appium_xcuitest_driver.XCUITestDriver.md#setprotocolw3c)
- [start](appium_xcuitest_driver.XCUITestDriver.md#start)
- [startNewCommandTimeout](appium_xcuitest_driver.XCUITestDriver.md#startnewcommandtimeout)
- [startSim](appium_xcuitest_driver.XCUITestDriver.md#startsim)
- [startUnexpectedShutdown](appium_xcuitest_driver.XCUITestDriver.md#startunexpectedshutdown)
- [startWda](appium_xcuitest_driver.XCUITestDriver.md#startwda)
- [startWdaSession](appium_xcuitest_driver.XCUITestDriver.md#startwdasession)
- [stop](appium_xcuitest_driver.XCUITestDriver.md#stop)
- [timeouts](appium_xcuitest_driver.XCUITestDriver.md#timeouts)
- [unzipApp](appium_xcuitest_driver.XCUITestDriver.md#unzipapp)
- [updateSettings](appium_xcuitest_driver.XCUITestDriver.md#updatesettings)
- [validateDesiredCaps](appium_xcuitest_driver.XCUITestDriver.md#validatedesiredcaps)
- [validateLocatorStrategy](appium_xcuitest_driver.XCUITestDriver.md#validatelocatorstrategy)

## Constructors

### constructor

• **new XCUITestDriver**(`opts?`, `shouldValidateCaps?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `opts` | `XCUITestDriverOpts` | `undefined` |
| `shouldValidateCaps` | `boolean` | `true` |

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[constructor](appium_base_driver.BaseDriver.md#constructor)

#### Defined in

[lib/driver.js:272](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L272)

## Properties

### \_audioRecorder

• **\_audioRecorder**: ``null`` \| `AudioRecorder`

#### Defined in

[lib/driver.js:256](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L256)

___

### \_conditionInducerService

• **\_conditionInducerService**: `any`

#### Defined in

[lib/driver.js:238](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L238)

___

### \_currentUrl

• **\_currentUrl**: `any`

#### Defined in

[lib/driver.js:335](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L335)

[lib/driver.js:549](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L549)

___

### \_deleteCookie

• **\_deleteCookie**: (...`this`: `any`, `cookie`: `any`) => `Promise`<`any`\> = `commands.webExtensions._deleteCookie`

#### Type declaration

▸ (`...this`, `cookie`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `cookie` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2225](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2225)

___

### \_eventHistory

• `Protected` **\_eventHistory**: [`EventHistory`](../interfaces/appium_types.EventHistory.md)

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[_eventHistory](appium_base_driver.BaseDriver.md#_eventhistory)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:35

___

### \_isSafariIphone

• **\_isSafariIphone**: `undefined` \| `boolean`

#### Defined in

[lib/driver.js:241](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L241)

___

### \_isSafariNotched

• **\_isSafariNotched**: `undefined` \| `boolean`

#### Defined in

[lib/driver.js:244](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L244)

___

### \_log

• `Protected` **\_log**: [`AppiumLogger`](../interfaces/appium_types.AppiumLogger.md)

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[_log](appium_base_driver.BaseDriver.md#_log)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:40

___

### \_perfRecorders

• **\_perfRecorders**: `PerfRecorder`[]

#### Defined in

[lib/driver.js:229](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L229)

___

### \_recentScreenRecorder

• **\_recentScreenRecorder**: ``null`` \| `ScreenRecorder` = `commands.recordScreenExtensions._recentScreenRecorder`

#### Defined in

[lib/driver.js:2182](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2182)

___

### \_syslogWebsocketListener

• **\_syslogWebsocketListener**: ``null`` \| (`logRecord`: { `message`: `string`  }) => `void`

#### Defined in

[lib/driver.js:226](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L226)

___

### \_trafficCapture

• **\_trafficCapture**: ``null`` \| `TrafficCapture`

#### Defined in

[lib/driver.js:265](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L265)

___

### \_waitingAtoms

• **\_waitingAtoms**: `WaitingAtoms`

#### Defined in

[lib/driver.js:247](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L247)

___

### activateApp

• **activateApp**: (...`this`: `any`, `bundleId`: `string`, `opts`: `any`, ...`args`: `any`) => `Promise`<`void`\> = `commands.appManagementExtensions.activateApp`

#### Type declaration

▸ (`...this`, `bundleId?`, `opts`, `...args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `bundleId` | `string` |
| `opts` | `any` |
| `...args` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1868](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1868)

___

### activateRecentWebview

• **activateRecentWebview**: (...`this`: `any`) => `Promise`<`void`\> = `commands.contextExtensions.activateRecentWebview`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1933](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1933)

___

### active

• **active**: (...`this`: `any`) => `Promise`<`any`\> = `commands.generalExtensions.active`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2013](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2013)

___

### allowInsecure

• **allowInsecure**: `string`[]

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[allowInsecure](appium_base_driver.BaseDriver.md#allowinsecure)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:27

___

### applyMoveToOffset

• **applyMoveToOffset**: (...`this`: `any`, `firstCoordinates`: `any`, `secondCoordinates`: `any`) => `any` = `commands.gestureExtensions.applyMoveToOffset`

#### Type declaration

▸ (`...this`, `firstCoordinates`, `secondCoordinates`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `firstCoordinates` | `any` |
| `secondCoordinates` | `any` |

##### Returns

`any`

#### Defined in

[lib/driver.js:2068](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2068)

___

### asyncPromise

• **asyncPromise**: `undefined` \| `AsyncPromise`

#### Defined in

[lib/driver.js:220](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L220)

___

### asyncScriptTimeout

• **asyncScriptTimeout**: (...`this`: `any`, `ms`: `number`) => `Promise`<`void`\> = `commands.timeoutExtensions.asyncScriptTimeout`

#### Type declaration

▸ (`...this`, `ms`): `Promise`<`void`\>

Alias for [`scriptTimeoutW3C`](appium_xcuitest_driver.XCUITestDriver.md#scripttimeoutw3c).

**`Deprecated`**

Use [`scriptTimeoutW3C`](appium_xcuitest_driver.XCUITestDriver.md#scripttimeoutw3c) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `ms` | `number` | the timeout |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2208](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2208)

___

### asyncWaitMs

• **asyncWaitMs**: `undefined` \| `number`

#### Defined in

[lib/driver.js:223](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L223)

___

### asynclibWaitMs

• **asynclibWaitMs**: `undefined` \| `number`

#### Defined in

[lib/driver.js:340](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L340)

___

### back

• **back**: (...`this`: `any`) => `Promise`<`void`\> = `commands.navigationExtensions.back`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2124](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2124)

___

### background

• **background**: (...`this`: `any`, `seconds?`: `number` \| { `timeout`: ``null`` \| `number`  }) => `Promise`<`unknown`\> = `commands.appManagementExtensions.background`

#### Type declaration

▸ (`...this`, `seconds?`): `Promise`<`unknown`\>

Close app (simulate device home button). It is possible to restore
the app after the timeout or keep it minimized based on the parameter value.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `seconds?` | `number` \| { `timeout`: ``null`` \| `number`  } | any positive number of seconds: come back after X seconds - any negative number of seconds or zero: never come back - undefined/null: never come back - {timeout: 5000}: come back after 5 seconds - {timeout: null}, {timeout: -2}: never come back |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2014](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2014)

___

### basePath

• **basePath**: `string`

basePath is used for several purposes, for example in setting up
proxying to other drivers, since we need to know what the base path
of any incoming request might look like. We set it to the default
initially but it is automatically updated during any actual program
execution by the routeConfiguringFunction, which is necessarily run as
the entrypoint for any Appium server

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[basePath](appium_base_driver.BaseDriver.md#basepath)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:25

___

### cacheWebElement

• **cacheWebElement**: (...`this`: `any`, `el`: `any`) => `any` = `commands.webExtensions.cacheWebElement`

#### Type declaration

▸ (`...this`, `el`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`any`

#### Defined in

[lib/driver.js:2226](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2226)

___

### cacheWebElements

• **cacheWebElements**: (...`this`: `any`, `response`: `any`) => `any` = `commands.webExtensions.cacheWebElements`

#### Type declaration

▸ (`...this`, `response`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `response` | `any` |

##### Returns

`any`

#### Defined in

[lib/driver.js:2227](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2227)

___

### cachedWdaStatus

• **cachedWdaStatus**: `any`

#### Defined in

[lib/driver.js:332](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L332)

[lib/driver.js:866](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L866)

[lib/driver.js:907](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L907)

___

### caps

• **caps**: [`DriverCaps`](../modules/appium_types.md#drivercaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>

The processed capabilities used to start the session represented by the current driver instance

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[caps](appium_base_driver.BaseDriver.md#caps)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:5

___

### checkForAlert

• **checkForAlert**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.webExtensions.checkForAlert`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2243](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2243)

___

### clear

• **clear**: (...`this`: `any`, `el`: `any`) => `Promise`<`void`\> = `commands.elementExtensions.clear`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1974](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1974)

___

### cliArgs

• **cliArgs**: [`StringRecord`](../modules/appium_types.md#stringrecord) & [`ServerArgs`](../modules/appium_types.md#serverargs)

The set of command line arguments set for this driver

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[cliArgs](appium_base_driver.BaseDriver.md#cliargs)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:4

___

### click

• **click**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.gestureExtensions.click`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2047](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2047)

___

### clickCoords

• **clickCoords**: (...`this`: `any`, `coords`: `any`) => `Promise`<`void`\> = `commands.webExtensions.clickCoords`

#### Type declaration

▸ (`...this`, `coords`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `coords` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2247](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2247)

___

### clickWebCoords

• **clickWebCoords**: (...`this`: `any`) => `Promise`<`void`\> = `commands.webExtensions.clickWebCoords`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2235](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2235)

___

### closeApp

• **closeApp**: (...`this`: `any`) => `Promise`<`void`\> = `commands.generalExtensions.closeApp`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Stop the session without stopping the session

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2024](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2024)

___

### closeWindow

• **closeWindow**: (...`this`: `any`) => `Promise`<`any`\> = `commands.navigationExtensions.closeWindow`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2126](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2126)

___

### commandsQueueGuard

• `Protected` **commandsQueueGuard**: `AsyncLock`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[commandsQueueGuard](appium_base_driver.BaseDriver.md#commandsqueueguard)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:43

___

### connectToRemoteDebugger

• **connectToRemoteDebugger**: (...`this`: `any`) => `Promise`<`void`\> = `commands.contextExtensions.connectToRemoteDebugger`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1934](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1934)

___

### contexts

• **contexts**: `string`[]

#### Defined in

[lib/driver.js:196](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L196)

___

### convertElementsForAtoms

• **convertElementsForAtoms**: (...`this`: `any`, `args?`: readonly `any`[]) => `any` = `commands.webExtensions.convertElementsForAtoms`

#### Type declaration

▸ (`...this?`, `args?`): `any`

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `[]` |
| `args?` | readonly `any`[] | `undefined` |

##### Returns

`any`

#### Defined in

[lib/driver.js:2231](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2231)

___

### curContext

• **curContext**: ``null`` \| `string`

#### Defined in

[lib/driver.js:199](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L199)

___

### curCoords

• **curCoords**: ``null`` \| [`Position`](../modules/appium_types.md#position)

#### Defined in

[lib/driver.js:209](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L209)

___

### curWebCoords

• **curWebCoords**: ``null`` \| [`Position`](../modules/appium_types.md#position)

#### Defined in

[lib/driver.js:204](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L204)

___

### curWebFrames

• **curWebFrames**: `string`[]

#### Defined in

[lib/driver.js:212](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L212)

___

### curWindowHandle

• **curWindowHandle**: `undefined` \| ``null`` \| `string`

#### Defined in

[lib/driver.js:188](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L188)

___

### denyInsecure

• **denyInsecure**: `string`[]

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[denyInsecure](appium_base_driver.BaseDriver.md#denyinsecure)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:28

___

### desiredCapConstraints

• **desiredCapConstraints**: `Object`

The constraints object used to validate capabilities

#### Type declaration

| Name | Type |
| :------ | :------ |
| `absoluteWebLocations` | { `isBoolean`: ``true`` = true } |
| `absoluteWebLocations.isBoolean` | ``true`` |
| `additionalWebviewBundleIds` | {} |
| `agentPath` | { `isString`: ``true`` = true } |
| `agentPath.isString` | ``true`` |
| `allowProvisioningDeviceRegistration` | { `isBoolean`: ``true`` = true } |
| `allowProvisioningDeviceRegistration.isBoolean` | ``true`` |
| `app` | { `isString`: ``true`` = true } |
| `app.isString` | ``true`` |
| `appInstallStrategy` | { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } |
| `appInstallStrategy.inclusionCaseInsensitive` | readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] |
| `appInstallStrategy.isString` | ``true`` |
| `appPushTimeout` | { `isNumber`: ``true`` = true } |
| `appPushTimeout.isNumber` | ``true`` |
| `autoAcceptAlerts` | { `isBoolean`: ``true`` = true } |
| `autoAcceptAlerts.isBoolean` | ``true`` |
| `autoDismissAlerts` | { `isBoolean`: ``true`` = true } |
| `autoDismissAlerts.isBoolean` | ``true`` |
| `bootstrapPath` | { `isString`: ``true`` = true } |
| `bootstrapPath.isString` | ``true`` |
| `browserName` | { `isString`: ``true`` = true } |
| `browserName.isString` | ``true`` |
| `bundleId` | { `isString`: ``true`` = true } |
| `bundleId.isString` | ``true`` |
| `calendarAccessAuthorized` | { `isBoolean`: ``true`` = true } |
| `calendarAccessAuthorized.isBoolean` | ``true`` |
| `calendarFormat` | { `isString`: ``true`` = true } |
| `calendarFormat.isString` | ``true`` |
| `clearSystemFiles` | { `isBoolean`: ``true`` = true } |
| `clearSystemFiles.isBoolean` | ``true`` |
| `commandTimeouts` | {} |
| `connectHardwareKeyboard` | { `isBoolean`: ``true`` = true } |
| `connectHardwareKeyboard.isBoolean` | ``true`` |
| `customSSLCert` | { `isString`: ``true`` = true } |
| `customSSLCert.isString` | ``true`` |
| `derivedDataPath` | { `isString`: ``true`` = true } |
| `derivedDataPath.isString` | ``true`` |
| `deviceName` | { `isString`: ``true`` = true } |
| `deviceName.isString` | ``true`` |
| `disableAutomaticScreenshots` | { `isBoolean`: ``true`` = true } |
| `disableAutomaticScreenshots.isBoolean` | ``true`` |
| `enableAsyncExecuteFromHttps` | { `isBoolean`: ``true`` = true } |
| `enableAsyncExecuteFromHttps.isBoolean` | ``true`` |
| `enablePerformanceLogging` | { `isBoolean`: ``true`` = true } |
| `enablePerformanceLogging.isBoolean` | ``true`` |
| `enforceAppInstall` | { `isBoolean`: ``true`` = true } |
| `enforceAppInstall.isBoolean` | ``true`` |
| `enforceFreshSimulatorCreation` | { `isBoolean`: ``true`` = true } |
| `enforceFreshSimulatorCreation.isBoolean` | ``true`` |
| `forceAppLaunch` | { `isBoolean`: ``true`` = true } |
| `forceAppLaunch.isBoolean` | ``true`` |
| `forceTurnOnSoftwareKeyboardSimulator` | { `isBoolean`: ``true`` = true } |
| `forceTurnOnSoftwareKeyboardSimulator.isBoolean` | ``true`` |
| `fullContextList` | { `isBoolean`: ``true`` = true } |
| `fullContextList.isBoolean` | ``true`` |
| `ignoreAboutBlankUrl` | { `isBoolean`: ``true`` = true } |
| `ignoreAboutBlankUrl.isBoolean` | ``true`` |
| `includeDeviceCapsToSessionInfo` | { `isBoolean`: ``true`` = true } |
| `includeDeviceCapsToSessionInfo.isBoolean` | ``true`` |
| `includeSafariInWebviews` | { `isBoolean`: ``true`` = true } |
| `includeSafariInWebviews.isBoolean` | ``true`` |
| `iosInstallPause` | { `isNumber`: ``true`` = true } |
| `iosInstallPause.isNumber` | ``true`` |
| `iosSimulatorLogsPredicate` | { `isString`: ``true`` = true } |
| `iosSimulatorLogsPredicate.isString` | ``true`` |
| `isHeadless` | { `isBoolean`: ``true`` = true } |
| `isHeadless.isBoolean` | ``true`` |
| `keepKeyChains` | { `isBoolean`: ``true`` = true } |
| `keepKeyChains.isBoolean` | ``true`` |
| `keychainPassword` | { `isString`: ``true`` = true } |
| `keychainPassword.isString` | ``true`` |
| `keychainPath` | { `isString`: ``true`` = true } |
| `keychainPath.isString` | ``true`` |
| `keychainsExcludePatterns` | { `isString`: ``true`` = true } |
| `keychainsExcludePatterns.isString` | ``true`` |
| `launchWithIDB` | { `isBoolean`: ``true`` = true } |
| `launchWithIDB.isBoolean` | ``true`` |
| `localizableStringsDir` | { `isString`: ``true`` = true } |
| `localizableStringsDir.isString` | ``true`` |
| `maxTypingFrequency` | { `isNumber`: ``true`` = true } |
| `maxTypingFrequency.isNumber` | ``true`` |
| `mjpegScreenshotUrl` | { `isString`: ``true`` = true } |
| `mjpegScreenshotUrl.isString` | ``true`` |
| `mjpegServerPort` | { `isNumber`: ``true`` = true } |
| `mjpegServerPort.isNumber` | ``true`` |
| `nativeTyping` | { `isBoolean`: ``true`` = true } |
| `nativeTyping.isBoolean` | ``true`` |
| `nativeWebTap` | { `isBoolean`: ``true`` = true } |
| `nativeWebTap.isBoolean` | ``true`` |
| `nativeWebTapStrict` | { `isBoolean`: ``true`` = true } |
| `nativeWebTapStrict.isBoolean` | ``true`` |
| `otherApps` | { `isString`: ``true`` = true } |
| `otherApps.isString` | ``true`` |
| `permissions` | { `isString`: ``true`` = true } |
| `permissions.isString` | ``true`` |
| `platformName` | { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } |
| `platformName.inclusionCaseInsensitive` | readonly [``"iOS"``, ``"tvOS"``] |
| `platformName.isString` | ``true`` |
| `platformName.presence` | ``true`` |
| `prebuildWDA` | { `isBoolean`: ``true`` = true } |
| `prebuildWDA.isBoolean` | ``true`` |
| `prebuiltWDAPath` | { `isString`: ``true`` = true } |
| `prebuiltWDAPath.isString` | ``true`` |
| `processArguments` | {} |
| `reduceMotion` | { `isBoolean`: ``true`` = true } |
| `reduceMotion.isBoolean` | ``true`` |
| `reduceTransparency` | { `isBoolean`: ``true`` = true } |
| `reduceTransparency.isBoolean` | ``true`` |
| `remoteDebugProxy` | { `isString`: ``true`` = true } |
| `remoteDebugProxy.isString` | ``true`` |
| `resetLocationService` | { `isBoolean`: ``true`` = true } |
| `resetLocationService.isBoolean` | ``true`` |
| `resetOnSessionStartOnly` | { `isBoolean`: ``true`` = true } |
| `resetOnSessionStartOnly.isBoolean` | ``true`` |
| `resultBundlePath` | { `isString`: ``true`` = true } |
| `resultBundlePath.isString` | ``true`` |
| `resultBundleVersion` | { `isNumber`: ``true`` = true } |
| `resultBundleVersion.isNumber` | ``true`` |
| `safariAllowPopups` | { `isBoolean`: ``true`` = true } |
| `safariAllowPopups.isBoolean` | ``true`` |
| `safariGarbageCollect` | { `isBoolean`: ``true`` = true } |
| `safariGarbageCollect.isBoolean` | ``true`` |
| `safariGlobalPreferences` | { `isObject`: ``true`` = true } |
| `safariGlobalPreferences.isObject` | ``true`` |
| `safariIgnoreFraudWarning` | { `isBoolean`: ``true`` = true } |
| `safariIgnoreFraudWarning.isBoolean` | ``true`` |
| `safariIgnoreWebHostnames` | { `isString`: ``true`` = true } |
| `safariIgnoreWebHostnames.isString` | ``true`` |
| `safariInitialUrl` | { `isString`: ``true`` = true } |
| `safariInitialUrl.isString` | ``true`` |
| `safariLogAllCommunication` | { `isBoolean`: ``true`` = true } |
| `safariLogAllCommunication.isBoolean` | ``true`` |
| `safariLogAllCommunicationHexDump` | { `isBoolean`: ``true`` = true } |
| `safariLogAllCommunicationHexDump.isBoolean` | ``true`` |
| `safariOpenLinksInBackground` | { `isBoolean`: ``true`` = true } |
| `safariOpenLinksInBackground.isBoolean` | ``true`` |
| `safariShowFullResponse` | { `isBoolean`: ``true`` = true } |
| `safariShowFullResponse.isBoolean` | ``true`` |
| `safariSocketChunkSize` | { `isNumber`: ``true`` = true } |
| `safariSocketChunkSize.isNumber` | ``true`` |
| `safariWebInspectorMaxFrameLength` | { `isNumber`: ``true`` = true } |
| `safariWebInspectorMaxFrameLength.isNumber` | ``true`` |
| `scaleFactor` | { `isString`: ``true`` = true } |
| `scaleFactor.isString` | ``true`` |
| `screenshotQuality` | { `isNumber`: ``true`` = true } |
| `screenshotQuality.isNumber` | ``true`` |
| `shouldTerminateApp` | { `isBoolean`: ``true`` = true } |
| `shouldTerminateApp.isBoolean` | ``true`` |
| `shouldUseSingletonTestManager` | { `isBoolean`: ``true`` = true } |
| `shouldUseSingletonTestManager.isBoolean` | ``true`` |
| `showIOSLog` | { `isBoolean`: ``true`` = true } |
| `showIOSLog.isBoolean` | ``true`` |
| `showSafariConsoleLog` | { `isBoolean`: ``true`` = true } |
| `showSafariConsoleLog.isBoolean` | ``true`` |
| `showSafariNetworkLog` | { `isBoolean`: ``true`` = true } |
| `showSafariNetworkLog.isBoolean` | ``true`` |
| `showXcodeLog` | { `isBoolean`: ``true`` = true } |
| `showXcodeLog.isBoolean` | ``true`` |
| `shutdownOtherSimulators` | { `isBoolean`: ``true`` = true } |
| `shutdownOtherSimulators.isBoolean` | ``true`` |
| `simpleIsVisibleCheck` | { `isBoolean`: ``true`` = true } |
| `simpleIsVisibleCheck.isBoolean` | ``true`` |
| `simulatorDevicesSetPath` | { `isString`: ``true`` = true } |
| `simulatorDevicesSetPath.isString` | ``true`` |
| `simulatorPasteboardAutomaticSync` | { `isString`: ``true`` = true } |
| `simulatorPasteboardAutomaticSync.isString` | ``true`` |
| `simulatorStartupTimeout` | { `isNumber`: ``true`` = true } |
| `simulatorStartupTimeout.isNumber` | ``true`` |
| `simulatorTracePointer` | { `isBoolean`: ``true`` = true } |
| `simulatorTracePointer.isBoolean` | ``true`` |
| `simulatorWindowCenter` | { `isString`: ``true`` = true } |
| `simulatorWindowCenter.isString` | ``true`` |
| `skipLogCapture` | { `isBoolean`: ``true`` = true } |
| `skipLogCapture.isBoolean` | ``true`` |
| `udid` | { `isString`: ``true`` = true } |
| `udid.isString` | ``true`` |
| `updatedWDABundleId` | { `isString`: ``true`` = true } |
| `updatedWDABundleId.isString` | ``true`` |
| `useJSONSource` | { `isBoolean`: ``true`` = true } |
| `useJSONSource.isBoolean` | ``true`` |
| `useNativeCachingStrategy` | { `isBoolean`: ``true`` = true } |
| `useNativeCachingStrategy.isBoolean` | ``true`` |
| `useNewWDA` | { `isBoolean`: ``true`` = true } |
| `useNewWDA.isBoolean` | ``true`` |
| `usePrebuiltWDA` | { `isBoolean`: ``true`` = true } |
| `usePrebuiltWDA.isBoolean` | ``true`` |
| `usePreinstalledWDA` | { `isBoolean`: ``true`` = true } |
| `usePreinstalledWDA.isBoolean` | ``true`` |
| `useSimpleBuildTest` | { `isBoolean`: ``true`` = true } |
| `useSimpleBuildTest.isBoolean` | ``true`` |
| `useXctestrunFile` | { `isBoolean`: ``true`` = true } |
| `useXctestrunFile.isBoolean` | ``true`` |
| `waitForIdleTimeout` | { `isNumber`: ``true`` = true } |
| `waitForIdleTimeout.isNumber` | ``true`` |
| `waitForQuiescence` | { `isBoolean`: ``true`` = true } |
| `waitForQuiescence.isBoolean` | ``true`` |
| `wdaBaseUrl` | { `isString`: ``true`` = true } |
| `wdaBaseUrl.isString` | ``true`` |
| `wdaConnectionTimeout` | { `isNumber`: ``true`` = true } |
| `wdaConnectionTimeout.isNumber` | ``true`` |
| `wdaEventloopIdleDelay` | { `isNumber`: ``true`` = true } |
| `wdaEventloopIdleDelay.isNumber` | ``true`` |
| `wdaLaunchTimeout` | { `isNumber`: ``true`` = true } |
| `wdaLaunchTimeout.isNumber` | ``true`` |
| `wdaLocalPort` | { `isNumber`: ``true`` = true } |
| `wdaLocalPort.isNumber` | ``true`` |
| `wdaStartupRetries` | { `isNumber`: ``true`` = true } |
| `wdaStartupRetries.isNumber` | ``true`` |
| `wdaStartupRetryInterval` | { `isNumber`: ``true`` = true } |
| `wdaStartupRetryInterval.isNumber` | ``true`` |
| `webDriverAgentUrl` | { `isString`: ``true`` = true } |
| `webDriverAgentUrl.isString` | ``true`` |
| `webkitResponseTimeout` | { `isNumber`: ``true`` = true } |
| `webkitResponseTimeout.isNumber` | ``true`` |
| `webviewConnectRetries` | { `isNumber`: ``true`` = true } |
| `webviewConnectRetries.isNumber` | ``true`` |
| `webviewConnectTimeout` | { `isNumber`: ``true`` = true } |
| `webviewConnectTimeout.isNumber` | ``true`` |
| `xcodeConfigFile` | { `isString`: ``true`` = true } |
| `xcodeConfigFile.isString` | ``true`` |
| `xcodeOrgId` | { `isString`: ``true`` = true } |
| `xcodeOrgId.isString` | ``true`` |
| `xcodeSigningId` | { `isString`: ``true`` = true } |
| `xcodeSigningId.isString` | ``true`` |

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[desiredCapConstraints](appium_base_driver.BaseDriver.md#desiredcapconstraints)

#### Defined in

[lib/driver.js:294](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L294)

___

### deviceCaps

• **deviceCaps**: `undefined` \| { `pixelRatio`: `number` = scale; `statBarHeight`: `number` = statusBarSize.height; `viewportRect`: `Viewport`  }

#### Defined in

[lib/driver.js:1803](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1803)

___

### disableConditionInducer

• **disableConditionInducer**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.conditionExtensions.disableConditionInducer`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

Disable a condition inducer enabled with [`enableConditionInducer`](appium_xcuitest_driver.XCUITestDriver.md#enableconditioninducer) Usually
a persistent connection is maintained after the condition inducer is enabled, and this method
is only valid for the currently enabled connection. If the connection is disconnected, the
condition inducer will be automatically disabled

(Note: this is also automatically called upon session cleanup)

**`Since`**

4.9.0

**`See`**

[https://help.apple.com/xcode/mac/current/#/dev308429d42](https://help.apple.com/xcode/mac/current/#/dev308429d42)

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

`true` if disable the condition succeeded

#### Defined in

[lib/driver.js:1921](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1921)

___

### doNativeFind

• **doNativeFind**: (...`this`: `any`, `strategy`: `any`, `selector`: `any`, `mult`: `any`, `context`: `any`) => `Promise`<`undefined` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\> = `commands.findExtensions.doNativeFind`

#### Type declaration

▸ (`...this`, `strategy`, `selector`, `mult`, `context`): `Promise`<`undefined` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `strategy` | `any` |
| `selector` | `any` |
| `mult` | `any` |
| `context` | `any` |

##### Returns

`Promise`<`undefined` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

#### Defined in

[lib/driver.js:2006](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2006)

___

### driverInfo

• **driverInfo**: `undefined` \| { `built`: `number` ; `version`: `string`  }

#### Defined in

[lib/driver.js:364](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L364)

___

### elementDisplayed

• **elementDisplayed**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.elementDisplayed`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1958](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1958)

___

### elementEnabled

• **elementEnabled**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.elementEnabled`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1959](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1959)

___

### elementSelected

• **elementSelected**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.elementSelected`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1960](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1960)

___

### enableConditionInducer

• **enableConditionInducer**: (...`this`: `any`, `conditionID`: `string`, `profileID`: `string`) => `Promise`<`boolean`\> = `commands.conditionExtensions.enableConditionInducer`

#### Type declaration

▸ (`...this`, `conditionID`, `profileID`): `Promise`<`boolean`\>

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

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `conditionID` | `string` | Determine which condition IDs are available with the [`listConditionInducers`](appium_xcuitest_driver.XCUITestDriver.md#listconditioninducers) command |
| `profileID` | `string` | Determine which profile IDs are available with the [`listConditionInducers`](appium_xcuitest_driver.XCUITestDriver.md#listconditioninducers) command |

##### Returns

`Promise`<`boolean`\>

`true` if enabling the condition succeeded

#### Defined in

[lib/driver.js:1920](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1920)

___

### eventEmitter

• **eventEmitter**: `EventEmitter`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[eventEmitter](appium_base_driver.BaseDriver.md#eventemitter)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:36

___

### execute

• **execute**: <TArgs, TReturn\>(...`this`: `any`, `script`: `string`, `args?`: `TArgs`) => `Promise`<`TReturn`\> = `commands.executeExtensions.execute`

#### Type declaration

▸ <`TArgs`, `TReturn`\>(`...this`, `script`, `args?`): `Promise`<`TReturn`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TArgs` | extends `ExecuteMethodArgs` = `unknown`[] |
| `TReturn` | `unknown` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `script` | `string` | Either a script to run, or in the case of an Execute Method, the name of the script to execute. |
| `args?` | `TArgs` |  |

##### Returns

`Promise`<`TReturn`\>

#### Defined in

[lib/driver.js:1983](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1983)

___

### executeAtom

• **executeAtom**: (...`this`: `any`, `atom`: `string`, `args`: `unknown`[], `alwaysDefaultFrame`: `boolean`) => `Promise`<`any`\> = `commands.webExtensions.executeAtom`

#### Type declaration

▸ (`...this`, `atom`, `args?`, `alwaysDefaultFrame`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `undefined` |
| `atom` | `string` | `undefined` |
| `args` | `unknown`[] | `false` |
| `alwaysDefaultFrame` | `boolean` | `undefined` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2228](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2228)

___

### executeAtomAsync

• **executeAtomAsync**: (...`this`: `any`, `atom`: `any`, `args`: `any`, `responseUrl`: `any`) => `Promise`<`any`\> = `commands.webExtensions.executeAtomAsync`

#### Type declaration

▸ (`...this`, `atom`, `args`, `responseUrl`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `atom` | `any` |
| `args` | `any` |
| `responseUrl` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2229](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2229)

___

### executeMobile

• **executeMobile**: `any` = `commands.executeExtensions.executeMobile`

#### Defined in

[lib/driver.js:1985](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1985)

___

### extractLogs

• **extractLogs**: (...`this`: `any`, `logType`: `string`, `logsContainer?`: `Partial`<`Record`<`string`, { `getLogs`: () => `Promise`<`any`\>  }\>\>) => `Promise`<`any`\> = `commands.logExtensions.extractLogs`

#### Type declaration

▸ (`...this`, `logType?`, `logsContainer?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `logType` | `string` |
| `logsContainer?` | `Partial`<`Record`<`string`, { `getLogs`: () => `Promise`<`any`\>  }\>\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2114](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2114)

___

### findElOrEls

• **findElOrEls**: (...`this`: `any`, `strategy`: `any`, `selector`: `any`, `mult`: `any`, `context`: `any`) => `Promise`<`any`\> = `commands.findExtensions.findElOrEls`

#### Type declaration

▸ (`...this`, `strategy`, `selector`, `mult`, `context`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `strategy` | `any` |
| `selector` | `any` |
| `mult` | `any` |
| `context` | `any` |

##### Returns

`Promise`<`any`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[findElOrEls](appium_base_driver.BaseDriver.md#findelorels)

#### Defined in

[lib/driver.js:2004](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2004)

___

### findNativeElementOrElements

• **findNativeElementOrElements**: (...`this`: `any`, `strategy`: `any`, `selector`: `any`, `mult`: `any`, `context`: `any`) => `Promise`<`any`\> = `commands.findExtensions.findNativeElementOrElements`

#### Type declaration

▸ (`...this`, `strategy`, `selector`, `mult`, `context`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `strategy` | `any` |
| `selector` | `any` |
| `mult` | `any` |
| `context` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2005](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2005)

___

### findWebElementOrElements

• **findWebElementOrElements**: (...`this`: `any`, `strategy`: `any`, `selector`: `any`, `many`: `any`, `ctx`: `any`) => `Promise`<`any`\> = `commands.webExtensions.findWebElementOrElements`

#### Type declaration

▸ (`...this`, `strategy`, `selector`, `many`, `ctx`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `strategy` | `any` |
| `selector` | `any` |
| `many` | `any` |
| `ctx` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2234](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2234)

___

### forward

• **forward**: (...`this`: `any`) => `Promise`<`void`\> = `commands.navigationExtensions.forward`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2125](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2125)

___

### getAlertButtons

• **getAlertButtons**: (...`this`: `any`) => `Promise`<`string`[]\> = `commands.alertExtensions.getAlertButtons`

#### Type declaration

▸ (`...this`): `Promise`<`string`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`[]\>

The list of button labels

#### Defined in

[lib/driver.js:1852](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1852)

___

### getAlertText

• **getAlertText**: (...`this`: `any`) => `Promise`<``null`` \| `string`\> = `commands.alertExtensions.getAlertText`

#### Type declaration

▸ (`...this`): `Promise`<``null`` \| `string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/driver.js:1848](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1848)

___

### getAtomsElement

• **getAtomsElement**: <S\>(...`this`: `any`, `elOrId`: `S` \| [`Element`](../interfaces/appium_types.Element.md)<`S`\>) => `AtomsElement`<`S`\> = `commands.webExtensions.getAtomsElement`

#### Type declaration

▸ <`S`\>(`...this`, `elOrId`): `AtomsElement`<`S`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `elOrId` | `S` \| [`Element`](../interfaces/appium_types.Element.md)<`S`\> |

##### Returns

`AtomsElement`<`S`\>

#### Defined in

[lib/driver.js:2230](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2230)

___

### getAttribute

• **getAttribute**: (...`this`: `any`, `attribute`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.getAttribute`

#### Type declaration

▸ (`...this`, `attribute`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `attribute` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1963](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1963)

___

### getClipboard

• **getClipboard**: (...`this`: `any`, `contentType?`: `string`) => `Promise`<`string`\> = `commands.clipboardExtensions.getClipboard`

#### Type declaration

▸ (`...this`, `contentType?`): `Promise`<`string`\>

Gets the content of the primary clipboard on the device under test.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `contentType?` | `string` | The type of the content to get. Only `plaintext`, 'image and 'url' are supported. |

##### Returns

`Promise`<`string`\>

The actual clipboard content encoded into base64 string.
An empty string is returned if the clipboard contains no data.

#### Defined in

[lib/driver.js:1913](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1913)

___

### getContentSize

• **getContentSize**: (...`this`: `any`, `el`: `any`) => `Promise`<`string`\> = `commands.elementExtensions.getContentSize`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`string`\>

#### Defined in

[lib/driver.js:1975](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1975)

___

### getContexts

• **getContexts**: (...`this`: `any`) => `Promise`<`string`[] \| `FullContext`[]\> = `commands.contextExtensions.getContexts`

#### Type declaration

▸ (`...this`): `Promise`<`string`[] \| `FullContext`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`[] \| `FullContext`[]\>

#### Defined in

[lib/driver.js:1927](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1927)

___

### getContextsAndViews

• **getContextsAndViews**: (...`this`: `any`, `useUrl`: `boolean`) => `Promise`<[`ViewContext`<``"NATIVE_APP"``\>]\> = `commands.contextExtensions.getContextsAndViews`

#### Type declaration

▸ (`...this?`, `useUrl`): `Promise`<[`ViewContext`<``"NATIVE_APP"``\>]\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `true` |
| `useUrl` | `boolean` | `undefined` |

##### Returns

`Promise`<[`ViewContext`<``"NATIVE_APP"``\>]\>

#### Defined in

[lib/driver.js:1935](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1935)

___

### getCoordinates

• **getCoordinates**: (...`this`: `any`, `gesture`: `any`) => `Promise`<{ `areOffsets`: `boolean` = false; `x`: `number` = 0; `y`: `number` = 0 }\> = `commands.gestureExtensions.getCoordinates`

#### Type declaration

▸ (`...this`, `gesture`): `Promise`<{ `areOffsets`: `boolean` = false; `x`: `number` = 0; `y`: `number` = 0 }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `gesture` | `any` |

##### Returns

`Promise`<{ `areOffsets`: `boolean` = false; `x`: `number` = 0; `y`: `number` = 0 }\>

#### Defined in

[lib/driver.js:2067](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2067)

___

### getCurrentContext

• **getCurrentContext**: (...`this`: `any`) => `Promise`<`string`\> = `commands.contextExtensions.getCurrentContext`

#### Type declaration

▸ (`...this`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`\>

#### Defined in

[lib/driver.js:1928](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1928)

___

### getCurrentUrl

• **getCurrentUrl**: (...`this`: `any`) => `any` = `commands.contextExtensions.getCurrentUrl`

#### Type declaration

▸ (`...this`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`any`

#### Defined in

[lib/driver.js:1940](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1940)

___

### getDevicePixelRatio

• **getDevicePixelRatio**: (...`this`: `any`) => `Promise`<`number`\> = `commands.generalExtensions.getDevicePixelRatio`

#### Type declaration

▸ (`...this`): `Promise`<`number`\>

memoized in constructor

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`number`\>

#### Defined in

[lib/driver.js:2029](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2029)

___

### getDeviceTime

• **getDeviceTime**: (...`this`: `any`, `format`: `string`) => `Promise`<`string`\> = `commands.generalExtensions.getDeviceTime`

#### Type declaration

▸ (`...this?`, `format`): `Promise`<`string`\>

Retrieves the actual device time.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `MOMENT_FORMAT_ISO8601` | - |
| `format` | `string` | `undefined` | The format specifier string. Read the [MomentJS documentation](https://momentjs.com/docs/) to get the full list of supported datetime format specifiers. The default format is `YYYY-MM-DDTHH:mm:ssZ`, which complies to ISO-8601. |

##### Returns

`Promise`<`string`\>

Formatted datetime string or the raw command output (if formatting fails)

#### Defined in

[lib/driver.js:2018](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2018)

___

### getElementId

• **getElementId**: (`element`: `any`) => `any` = `commands.webExtensions.getElementId`

#### Type declaration

▸ (`element`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `any` |

##### Returns

`any`

#### Defined in

[lib/driver.js:2232](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2232)

___

### getElementRect

• **getElementRect**: (...`this`: `any`, `el`: `any`) => `Promise`<[`Rect`](../interfaces/appium_types.Rect.md)\> = `commands.elementExtensions.getElementRect`

#### Type declaration

▸ (`...this`, `el`): `Promise`<[`Rect`](../interfaces/appium_types.Rect.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<[`Rect`](../interfaces/appium_types.Rect.md)\>

#### Defined in

[lib/driver.js:1966](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1966)

___

### getElementScreenshot

• **getElementScreenshot**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.screenshotExtensions.getElementScreenshot`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2190](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2190)

___

### getExtraNativeWebTapOffset

• **getExtraNativeWebTapOffset**: (...`this`: `any`, `isIphone`: `any`, `bannerVisibility`: `any`) => `Promise`<`number`\> = `commands.webExtensions.getExtraNativeWebTapOffset`

#### Type declaration

▸ (`...this`, `isIphone`, `bannerVisibility`): `Promise`<`number`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `isIphone` | `any` |
| `bannerVisibility` | `any` |

##### Returns

`Promise`<`number`\>

#### Defined in

[lib/driver.js:2240](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2240)

___

### getExtraTranslateWebCoordsOffset

• **getExtraTranslateWebCoordsOffset**: (...`this`: `any`, `wvPos`: `any`, `realDims`: `any`) => `Promise`<`void`\> = `commands.webExtensions.getExtraTranslateWebCoordsOffset`

#### Type declaration

▸ (`...this`, `wvPos`, `realDims`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `wvPos` | `any` |
| `realDims` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2239](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2239)

___

### getFirstVisibleChild

• **getFirstVisibleChild**: (...`this`: `any`, `mult`: `any`, `context`: `any`) => `Promise`<`undefined` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\> = `commands.findExtensions.getFirstVisibleChild`

#### Type declaration

▸ (`...this`, `mult`, `context`): `Promise`<`undefined` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `mult` | `any` |
| `context` | `any` |

##### Returns

`Promise`<`undefined` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

#### Defined in

[lib/driver.js:2007](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2007)

___

### getGeoLocation

• **getGeoLocation**: (...`this`: `any`) => `Promise`<{ `altitude`: `number` ; `latitude`: `number` ; `longitude`: `number`  }\> = `commands.locationExtensions.getGeoLocation`

#### Type declaration

▸ (`...this`): `Promise`<{ `altitude`: `number` ; `latitude`: `number` ; `longitude`: `number`  }\>

Returns location of the device under test.
The device under test must allow the location services for WDA
as 'Always' to get the location data correctly.

The 'latitude', 'longitude' and 'altitude' could be zero even
if the Location Services are set to 'Always', because the device
needs some time to update the location data.

**`Throws`**

If the device under test returns an error message.
                i.e.: tvOS returns unsupported error

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<{ `altitude`: `number` ; `latitude`: `number` ; `longitude`: `number`  }\>

#### Defined in

[lib/driver.js:2099](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2099)

___

### getLocation

• **getLocation**: (...`this`: `any`, `elementId`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<[`Position`](../modules/appium_types.md#position)\> = `commands.elementExtensions.getLocation`

#### Type declaration

▸ (`...this`, `elementId`): `Promise`<[`Position`](../modules/appium_types.md#position)\>

Get the position of an element on screen

**`Deprecated`**

Use [`getElementRect`](appium_xcuitest_driver.XCUITestDriver.md#getelementrect) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | the element ID |

##### Returns

`Promise`<[`Position`](../modules/appium_types.md#position)\>

The position of the element

#### Defined in

[lib/driver.js:1967](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1967)

___

### getLocationInView

• **getLocationInView**: (...`this`: `any`, `elementId`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<[`Position`](../modules/appium_types.md#position)\> = `commands.elementExtensions.getLocationInView`

#### Type declaration

▸ (`...this`, `elementId`): `Promise`<[`Position`](../modules/appium_types.md#position)\>

Alias for [`getLocation`](appium_xcuitest_driver.XCUITestDriver.md#getlocation)

**`Deprecated`**

Use [`getElementRect`](appium_xcuitest_driver.XCUITestDriver.md#getelementrect) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | the element ID |

##### Returns

`Promise`<[`Position`](../modules/appium_types.md#position)\>

The position of the element

#### Defined in

[lib/driver.js:1968](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1968)

___

### getName

• **getName**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.getName`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1961](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1961)

___

### getNativeAttribute

• **getNativeAttribute**: (...`this`: `any`, `attribute`: `any`, `el`: `any`) => `Promise`<``null`` \| `string`\> = `commands.elementExtensions.getNativeAttribute`

#### Type declaration

▸ (`...this`, `attribute`, `el`): `Promise`<``null`` \| `string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `attribute` | `any` |
| `el` | `any` |

##### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[lib/driver.js:1962](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1962)

___

### getNativePageSource

• **getNativePageSource**: (...`this`: `any`) => `Promise`<`string`\> = `commands.sourceExtensions.getNativePageSource`

#### Type declaration

▸ (`...this`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`\>

#### Defined in

[lib/driver.js:2197](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2197)

___

### getNativeRect

• **getNativeRect**: (...`this`: `any`, `el`: `any`) => `Promise`<[`Rect`](../interfaces/appium_types.Rect.md)\> = `commands.elementExtensions.getNativeRect`

#### Type declaration

▸ (`...this`, `el`): `Promise`<[`Rect`](../interfaces/appium_types.Rect.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<[`Rect`](../interfaces/appium_types.Rect.md)\>

#### Defined in

[lib/driver.js:1976](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1976)

___

### getNewRemoteDebugger

• **getNewRemoteDebugger**: (...`this`: `any`) => `Promise`<`any`\> = `commands.contextExtensions.getNewRemoteDebugger`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1941](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1941)

___

### getPageSource

• **getPageSource**: (...`this`: `any`) => `Promise`<`any`\> = `commands.sourceExtensions.getPageSource`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[getPageSource](appium_base_driver.BaseDriver.md#getpagesource)

#### Defined in

[lib/driver.js:2196](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2196)

___

### getProperty

• **getProperty**: (...`this`: `any`, `property`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.getProperty`

#### Type declaration

▸ (`...this`, `property`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `property` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1964](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1964)

___

### getRecentWebviewContextId

• **getRecentWebviewContextId**: (...`this`: `any`, `titleRegExp`: `RegExp`, `urlRegExp`: `RegExp`) => `Promise`<`undefined` \| `string`\> = `commands.contextExtensions.getRecentWebviewContextId`

#### Type declaration

▸ (`...this`, `titleRegExp`, `urlRegExp`): `Promise`<`undefined` \| `string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `titleRegExp` | `RegExp` |
| `urlRegExp` | `RegExp` |

##### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[lib/driver.js:1942](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1942)

___

### getSafariDeviceSize

• **getSafariDeviceSize**: (...`this`: `any`) => `Promise`<{ `height`: `number` = normHeight; `width`: `number` = normWidth }\> = `commands.webExtensions.getSafariDeviceSize`

#### Type declaration

▸ (`...this`): `Promise`<{ `height`: `number` = normHeight; `width`: `number` = normWidth }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<{ `height`: `number` = normHeight; `width`: `number` = normWidth }\>

#### Defined in

[lib/driver.js:2237](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2237)

___

### getSafariIsIphone

• **getSafariIsIphone**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.webExtensions.getSafariIsIphone`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2236](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2236)

___

### getSafariIsNotched

• **getSafariIsNotched**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.webExtensions.getSafariIsNotched`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2238](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2238)

___

### getScreenInfo

• **getScreenInfo**: (...`this`: `any`) => `Promise`<`ScreenInfo`\> = `commands.generalExtensions.getScreenInfo`

#### Type declaration

▸ (`...this`): `Promise`<`ScreenInfo`\>

Get information about the screen.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`ScreenInfo`\>

#### Defined in

[lib/driver.js:2027](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2027)

___

### getScreenshot

• **getScreenshot**: (...`this`: `any`) => `Promise`<`any`\> = `commands.screenshotExtensions.getScreenshot`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2189](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2189)

___

### getSize

• **getSize**: (...`this`: `any`, `el`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<[`Size`](../modules/appium_types.md#size)\> = `commands.elementExtensions.getSize`

#### Type declaration

▸ (`...this`, `el`): `Promise`<[`Size`](../modules/appium_types.md#size)\>

Get the size of an element

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `el` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | the element ID |

##### Returns

`Promise`<[`Size`](../modules/appium_types.md#size)\>

The position of the element

#### Defined in

[lib/driver.js:1969](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1969)

___

### getStatusBarHeight

• **getStatusBarHeight**: (...`this`: `any`) => `Promise`<`number`\> = `commands.generalExtensions.getStatusBarHeight`

#### Type declaration

▸ (`...this`): `Promise`<`number`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`number`\>

#### Defined in

[lib/driver.js:2028](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2028)

___

### getStrings

• **getStrings**: (...`this`: `any`, `language`: `string`, `stringFile?`: ``null`` \| `string`) => `Promise`<[`StringRecord`](../modules/appium_types.md#stringrecord)<`string`\>\> = `commands.appStringsExtensions.getStrings`

#### Type declaration

▸ (`...this`, `language?`, `stringFile?`): `Promise`<[`StringRecord`](../modules/appium_types.md#stringrecord)<`string`\>\>

Return the language-specific strings for an app

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `language` | `string` | `null` | The language abbreviation to fetch app strings mapping for. If no language is provided then strings for the 'en language would be returned |
| `stringFile?` | ``null`` \| `string` | `undefined` | Relative path to the corresponding .strings file starting from the corresponding .lproj folder, e.g., `base/main.strings`. If omitted, then Appium will make its best guess where the file is. |

##### Returns

`Promise`<[`StringRecord`](../modules/appium_types.md#stringrecord)<`string`\>\>

A record of localized keys to localized text

#### Defined in

[lib/driver.js:2021](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2021)

___

### getText

• **getText**: (...`this`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.elementExtensions.getText`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1965](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1965)

___

### getViewportRect

• **getViewportRect**: (...`this`: `any`) => `Promise`<`Viewport`\> = `commands.generalExtensions.getViewportRect`

#### Type declaration

▸ (`...this`): `Promise`<`Viewport`\>

Retrieves the viewport dimensions.

The viewport is the device's screen size with status bar size subtracted if the latter is present/visible.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`Viewport`\>

#### Defined in

[lib/driver.js:2026](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2026)

___

### getViewportScreenshot

• **getViewportScreenshot**: (...`this`: `any`) => `Promise`<`any`\> = `commands.screenshotExtensions.getViewportScreenshot`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2191](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2191)

___

### getWindowHandle

• **getWindowHandle**: (...`this`: `any`) => `Promise`<`string`\> = `commands.contextExtensions.getWindowHandle`

#### Type declaration

▸ (`...this`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`\>

#### Defined in

[lib/driver.js:1929](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1929)

___

### getWindowHandles

• **getWindowHandles**: (...`this`: `any`) => `Promise`<`string`[]\> = `commands.contextExtensions.getWindowHandles`

#### Type declaration

▸ (`...this`): `Promise`<`string`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/driver.js:1930](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1930)

___

### getWindowRect

• **getWindowRect**: (...`this`: `any`) => `Promise`<{ `height`: `any` ; `width`: `any` ; `x`: `number` = 0; `y`: `number` = 0 }\> = `commands.generalExtensions.getWindowRect`

#### Type declaration

▸ (`...this`): `Promise`<{ `height`: `any` ; `width`: `any` ; `x`: `number` = 0; `y`: `number` = 0 }\>

For W3C

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<{ `height`: `any` ; `width`: `any` ; `x`: `number` = 0; `y`: `number` = 0 }\>

#### Defined in

[lib/driver.js:2020](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2020)

___

### getWindowSize

• **getWindowSize**: (...`this`: `any`, `windowHandle`: `string`) => `Promise`<`any`\> = `commands.generalExtensions.getWindowSize`

#### Type declaration

▸ (`...this?`, `windowHandle`): `Promise`<`any`\>

Get the window size

**`Deprecated`**

Use [`getWindowRect`](appium_xcuitest_driver.XCUITestDriver.md#getwindowrect) instead.

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `'current'` |
| `windowHandle` | `string` | `undefined` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2017](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2017)

___

### getWindowSizeNative

• **getWindowSizeNative**: (...`this`: `any`) => `Promise`<`unknown`\> = `commands.generalExtensions.getWindowSizeNative`

#### Type declaration

▸ (`...this`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2033](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2033)

___

### getWindowSizeWeb

• **getWindowSizeWeb**: (...`this`: `any`) => `Promise`<`any`\> = `commands.generalExtensions.getWindowSizeWeb`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2032](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2032)

___

### hasElementId

• **hasElementId**: (`element`: `any`) => element is Element<string\> = `commands.webExtensions.hasElementId`

#### Type declaration

▸ (`element`): element is Element<string\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `any` |

##### Returns

element is Element<string\>

#### Defined in

[lib/driver.js:2233](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2233)

___

### helpers

• **helpers**: [`DriverHelpers`](../interfaces/appium_types.DriverHelpers.md)

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[helpers](appium_base_driver.BaseDriver.md#helpers)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:16

___

### hideKeyboard

• **hideKeyboard**: (...`this`: `any`, `strategy`: `any`, ...`possibleKeys`: `any`[]) => `Promise`<`boolean`\> = `commands.keyboardExtensions.hideKeyboard`

#### Type declaration

▸ (`...this`, `strategy`, `...possibleKeys`): `Promise`<`boolean`\>

**`Deprecated`**

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `strategy` | `any` |
| `...possibleKeys` | `any`[] |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2085](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2085)

___

### implicitWaitMs

• **implicitWaitMs**: `number`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[implicitWaitMs](appium_base_driver.BaseDriver.md#implicitwaitms)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:30

___

### initialOpts

• **initialOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `allowCors` | `NonNullable`<`undefined` \| `boolean`\> |
| `allowInsecure` | [`AllowInsecureConfig`](../modules/appium_types.md#allowinsecureconfig) |
| `basePath` | `string` |
| `callbackAddress` | `undefined` \| `string` |
| `callbackPort` | `number` |
| `debugLogSpacing` | `NonNullable`<`undefined` \| `boolean`\> |
| `defaultCapabilities` | `undefined` \| [`DefaultCapabilitiesConfig`](../interfaces/appium_types.DefaultCapabilitiesConfig.md) |
| `denyInsecure` | [`DenyInsecureConfig`](../modules/appium_types.md#denyinsecureconfig) |
| `driver` | `undefined` \| [`DriverConfig`](../interfaces/appium_types.DriverConfig.md) |
| `fastReset?` | `boolean` |
| `keepAliveTimeout` | `number` |
| `localTimezone` | `NonNullable`<`undefined` \| `boolean`\> |
| `logFile` | `undefined` \| `string` |
| `logFilters` | `undefined` \| [`LogFiltersConfig`](../modules/appium_types.md#logfiltersconfig) |
| `logNoColors` | `NonNullable`<`undefined` \| `boolean`\> |
| `logTimestamp` | `NonNullable`<`undefined` \| `boolean`\> |
| `loglevel` | `NonNullable`<`undefined` \| [`LogLevelConfig`](../modules/appium_types.md#loglevelconfig)\> |
| `longStacktrace` | `NonNullable`<`undefined` \| `boolean`\> |
| `noPermsCheck` | `NonNullable`<`undefined` \| `boolean`\> |
| `nodeconfig` | `undefined` \| [`NodeconfigConfig`](../interfaces/appium_types.NodeconfigConfig.md) |
| `plugin` | `undefined` \| [`PluginConfig`](../interfaces/appium_types.PluginConfig.md) |
| `port` | `number` |
| `relaxedSecurityEnabled` | `NonNullable`<`undefined` \| `boolean`\> |
| `sessionOverride` | `NonNullable`<`undefined` \| `boolean`\> |
| `skipUninstall?` | `boolean` |
| `strictCaps` | `NonNullable`<`undefined` \| `boolean`\> |
| `tmpDir` | `undefined` \| `string` |
| `traceDir` | `undefined` \| `string` |
| `useDrivers` | [`UseDriversConfig`](../modules/appium_types.md#usedriversconfig) |
| `usePlugins` | [`UsePluginsConfig`](../modules/appium_types.md#usepluginsconfig) |
| `webhook` | `undefined` \| `string` |

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[initialOpts](appium_base_driver.BaseDriver.md#initialopts)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:15

___

### installApp

• **installApp**: (...`this`: `any`, `appPath`: `string`, `__namedParameters`: `any`) => `Promise`<`void`\> = `commands.appManagementExtensions.installApp`

#### Type declaration

▸ (`...this`, `appPath?`, `«destructured»`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `appPath` | `string` |
| `«destructured»` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1867](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1867)

___

### isAppInstalled

• **isAppInstalled**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`boolean`\> = `commands.appManagementExtensions.isAppInstalled`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `bundleId` | `string` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:1869](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1869)

___

### isKeyboardShown

• **isKeyboardShown**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.keyboardExtensions.isKeyboardShown`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2087](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2087)

___

### isLocked

• **isLocked**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.lockExtensions.isLocked`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

Determine whether the device is locked

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

`true` if the device is locked, `false` otherwise

#### Defined in

[lib/driver.js:2108](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2108)

___

### isWebContext

• **isWebContext**: (...`this`: `any`) => `boolean` = `commands.contextExtensions.isWebContext`

#### Type declaration

▸ (`...this`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`boolean`

#### Defined in

[lib/driver.js:1943](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1943)

___

### isWebview

• **isWebview**: (...`this`: `any`) => `boolean` = `commands.contextExtensions.isWebview`

#### Type declaration

▸ (`...this`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`boolean`

#### Defined in

[lib/driver.js:1944](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1944)

___

### jwpProxyActive

• **jwpProxyActive**: `undefined` \| `boolean`

#### Defined in

[lib/driver.js:329](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L329)

[lib/driver.js:899](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L899)

[lib/driver.js:1043](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1043)

___

### keys

• **keys**: (...`this`: `any`, `value`: `string`[]) => `Promise`<`void`\> = `commands.elementExtensions.keys`

#### Type declaration

▸ (`...this`, `value`): `Promise`<`void`\>

Send keys to the app

**`Deprecated`**

Use [`setValue`](appium_xcuitest_driver.XCUITestDriver.md#setvalue) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `value` | `string`[] | Array of keys to send |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1973](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1973)

___

### landscapeWebCoordsOffset

• **landscapeWebCoordsOffset**: `undefined` \| `number`

#### Defined in

[lib/driver.js:342](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L342)

___

### launchApp

• **launchApp**: (...`this`: `any`) => `Promise`<`void`\> = `commands.generalExtensions.launchApp`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Start the session after it has been started.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2023](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2023)

___

### lifecycleData

• **lifecycleData**: `LifecycleData`

#### Defined in

[lib/driver.js:250](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L250)

___

### listConditionInducers

• **listConditionInducers**: (...`this`: `any`) => `Promise`<`Condition`[]\> = `commands.conditionExtensions.listConditionInducers`

#### Type declaration

▸ (`...this`): `Promise`<`Condition`[]\>

Get all available ConditionInducer configuration information, which can be used with
[`enableConditionInducer`](appium_xcuitest_driver.XCUITestDriver.md#enableconditioninducer)

**`Since`**

4.9.0

**`See`**

[https://help.apple.com/xcode/mac/current/#/dev308429d42](https://help.apple.com/xcode/mac/current/#/dev308429d42)

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`Condition`[]\>

#### Defined in

[lib/driver.js:1919](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1919)

___

### listWebFrames

• **listWebFrames**: (...`this`: `any`, `useUrl`: `boolean`) => `Promise`<`any`\> = `commands.contextExtensions.listWebFrames`

#### Type declaration

▸ (`...this?`, `useUrl`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `true` |
| `useUrl` | `boolean` | `undefined` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1936](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1936)

___

### locatorStrategies

• **locatorStrategies**: `string`[]

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[locatorStrategies](appium_base_driver.BaseDriver.md#locatorstrategies)

#### Defined in

[lib/driver.js:275](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L275)

___

### lock

• **lock**: (...`this`: `any`, `seconds?`: `string` \| `number`) => `Promise`<`void`\> = `commands.lockExtensions.lock`

#### Type declaration

▸ (`...this`, `seconds?`): `Promise`<`void`\>

Lock the device (and optionally unlock the device after a certain amount of time)

**`Default Value`**

0

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `seconds?` | `string` \| `number` | the number of seconds after which to unlock the device. Set to `0` or leave empty to require manual unlock (do not automatically unlock). |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2106](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2106)

___

### logs

• **logs**: `Object`

#### Defined in

[lib/driver.js:305](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L305)

[lib/driver.js:1029](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1029)

___

### managedDrivers

• **managedDrivers**: [`Driver`](../interfaces/appium_types.Driver.md)<[`Constraints`](../modules/appium_types.md#constraints), [`StringRecord`](../modules/appium_types.md#stringrecord), [`StringRecord`](../modules/appium_types.md#stringrecord), [`DefaultCreateSessionResult`](../modules/appium_types.md#defaultcreatesessionresult)<[`Constraints`](../modules/appium_types.md#constraints)\>, `void`, [`StringRecord`](../modules/appium_types.md#stringrecord)\>[]

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[managedDrivers](appium_base_driver.BaseDriver.md#manageddrivers)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:33

___

### mjpegStream

• **mjpegStream**: `undefined` \| `MJpegStream`

#### Defined in

[lib/driver.js:454](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L454)

___

### mobileActivateApp

• **mobileActivateApp**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`void`\> = `commands.appManagementExtensions.mobileActivateApp`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`void`\>

Activate the given app on the device under test.

This pushes the app to the foreground if it is running in the background.  An exception is thrown if the app is not install or isn't running.  Nothing is done if the app is already in the foreground.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be activated |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1864](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1864)

___

### mobileDeepLink

• **mobileDeepLink**: (...`this`: `any`, `url`: `string`, `bundleId?`: `string`) => `Promise`<`void`\> = `commands.navigationExtensions.mobileDeepLink`

#### Type declaration

▸ (`...this`, `url`, `bundleId?`): `Promise`<`void`\>

Opens the given URL with the default application assigned to handle it based on the URL
scheme, or the application provided as an optional parameter

(Note: the version of Xcode must be 14.3+ and iOS must be 16.4+)

**`Since`**

4.17

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `url` | `string` | the URL to be opened, e.g. `myscheme://yolo` |
| `bundleId?` | `string` | the application to open the given URL with. If not provided, then the application assigned by the operating system to handle URLs of the appropriate type |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2128](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2128)

___

### mobileDeleteFile

• **mobileDeleteFile**: (...`this`: `any`, `remotePath`: `string`) => `Promise`<`void`\> = `commands.fileMovementExtensions.mobileDeleteFile`

#### Type declaration

▸ (`...this`, `remotePath`): `Promise`<`void`\>

Delete a remote file from the device.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote file or a specially formatted path, which points to an item inside app bundle. See the documentation for `pullFromRealDevice` and `pullFromSimulator` to get more information on acceptable values. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1996](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1996)

___

### mobileDeleteFolder

• **mobileDeleteFolder**: (...`this`: `any`, `remotePath`: `string`) => `Promise`<`void`\> = `commands.fileMovementExtensions.mobileDeleteFolder`

#### Type declaration

▸ (`...this`, `remotePath`): `Promise`<`void`\>

Delete a remote folder from the device.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote folder or a specially formatted path, which points to an item inside app bundle. See the documentation for `pullFromRealDevice` and `pullFromSimulator` to get more information on acceptable values. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1995](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1995)

___

### mobileDoubleTap

• **mobileDoubleTap**: (...`this`: `any`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `x?`: `number`, `y?`: `number`) => `Promise`<`void`\> = `commands.gestureExtensions.mobileDoubleTap`

#### Type declaration

▸ (`...this`, `elementId?`, `x?`, `y?`): `Promise`<`void`\>

Performs double tap gesture on the given element or on the screen.

**`Example`**

```javascript
// using WebdriverIO
await driver.execute('mobile: doubleTap', {element: element.value.ELEMENT});
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to double tap on. This is required if `x` and `y` are not provided. |
| `x?` | `number` | The _x_ coordinate (float value) to double tap on. This is required if `elementId` is not provided. |
| `y?` | `number` | The _y_ coordinate (float value) to double tap on. This is required if `elementId` is not provided. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2057](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2057)

___

### mobileDragFromToForDuration

• **mobileDragFromToForDuration**: (...`this`: `any`, `duration`: `number`, `fromX`: `number`, `fromY`: `number`, `toX`: `number`, `toY`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobileDragFromToForDuration`

#### Type declaration

▸ (`...this`, `duration`, `fromX`, `fromY`, `toX`, `toY`, `elementId?`): `Promise`<`void`\>

Performs drag and drop gesture by coordinates on the given element or on the screen.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1500989-clickforduration?language=objc

**`Example`**

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

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `duration` | `number` | The duration (in seconds) of the gesture. Must be between `0.5` and `60.0`, inclusive. |
| `fromX` | `number` | The _x_ coordinate (float value) of the starting drag point. |
| `fromY` | `number` | The _y_ coordinate (float value) of the starting drag point. |
| `toX` | `number` | The _x_ coordinate (float value) of the ending drag point. |
| `toY` | `number` | The _y_ coordinate (float value) of the ending drag point. |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to drag. If provided, all coordinates will be calculated relative to this element; otherwise they will be calculated relative to the active Application element. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2061](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2061)

___

### mobileDragFromToWithVelocity

• **mobileDragFromToWithVelocity**: (...`this`: `any`, `pressDuration`: `number`, `holdDuration`: `number`, `velocity`: `number`, `fromElementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `toElementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `fromX?`: `number`, `fromY?`: `number`, `toX?`: `number`, `toY?`: `number`) => `Promise`<`void`\> = `commands.gestureExtensions.mobileDragFromToWithVelocity`

#### Type declaration

▸ (`...this`, `pressDuration`, `holdDuration`, `velocity`, `fromElementId?`, `toElementId?`, `fromX?`, `fromY?`, `toX?`, `toY?`): `Promise`<`void`\>

Initiates a press-and-hold gesture, drags to another coordinate or an element with a given velocity, and holds for a given duration.

**`See`**

 - https://developer.apple.com/documentation/xctest/xcuielement/3551693-pressforduration?language=objc
 - https://developer.apple.com/documentation/xctest/xcuicoordinate/3551692-pressforduration?language=objc

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `pressDuration` | `number` | The duration (in seconds) of the press-and-hold gesture at the starting point. Must be between `0.5` and `60.0`, inclusive. |
| `holdDuration` | `number` | The duration (in seconds) of the hold gesture at the ending point (after dragging). Must be between `0.5` and `60.0`, inclusive. |
| `velocity` | `number` | The speed (in pixels-per-second) which to move from the initial position to the end position. |
| `fromElementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to drag from. Absolute screen coordinates are expected if this argument is not provided. |
| `toElementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to drag to. Absolute screen coordinates are expected if this argument is not provided. |
| `fromX?` | `number` | The _x_ coordinate (float value) of the starting drag point. |
| `fromY?` | `number` | The _y_ coordinate (float value) of the starting drag point. |
| `toX?` | `number` | The _x_ coordinate (float value) of the ending drag point. |
| `toY?` | `number` | The _y_ coordinate (float value) of the ending drag point. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2062](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2062)

___

### mobileExpectNotification

• **mobileExpectNotification**: (...`this`: `any`, `name`: `string`, `type`: `NotificationType`, `timeoutSeconds`: `number`) => `Promise`<`unknown`\> = `commands.notificationsExtensions.mobileExpectNotification`

#### Type declaration

▸ (`...this`, `name?`, `type?`, `timeoutSeconds`): `Promise`<`unknown`\>

Blocks until the expected notification is delivered.

This method is a thin wrapper over the
[`XCTNSNotificationExpectation`](https://developer.apple.com/documentation/xctest/xctnsnotificationexpectation?language=objc) and
[`XCTDarwinNotificationExpectation`](https://developer.apple.com/documentation/xctest/xctdarwinnotificationexpectation?language=objc) entities.

**`Throws`**

A [`TimeoutError`](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/error_exports_TimeoutError.html) if the expected notification has not been delivered within the given timeout.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `name` | `string` | `'plain'` | The name of the notification to expect |
| `type` | `NotificationType` | `60` | Which notification type to expect. |
| `timeoutSeconds` | `number` | `undefined` | For how long to wait until the notification is delivered (in float seconds). |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2135](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2135)

___

### mobileForcePress

• **mobileForcePress**: (...`this`: `any`, `x?`: `number`, `y?`: `number`, `duration?`: `number`, `pressure?`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobileForcePress`

#### Type declaration

▸ (`...this`, `x?`, `y?`, `duration?`, `pressure?`, `elementId?`): `Promise`<`void`\>

Performs a "force press" on the given element or coordinates.

**`Throws`**

If the target device does not support the "force press" gesture.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `x?` | `number` | The _x_ coordinate of the gesture. If `elementId` is set, this is calculated relative to its position; otherwise it's calculated relative to the active Application. |
| `y?` | `number` | The _y_ coordinate of the gesture. If `elementId` is set, this is calculated relative to its position; otherwise it's calculated relative to the active Application. |
| `duration?` | `number` | The duraiton (in seconds) of the force press. If this is provided, `pressure` must also be provided. |
| `pressure?` | `number` | A float value defining the pressure of the force press. If this is provided, `duration` must also be provided. |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to perform one or more taps. If this is _not_ provided, both `x` and `y` must be provided. If this is provided _and_ `x` and `y` are not provided, the actual touch point will be calculated internally. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2064](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2064)

___

### mobileGetActiveAppInfo

• **mobileGetActiveAppInfo**: (...`this`: `any`) => `Promise`<`ActiveAppInfo`\> = `commands.activeAppInfoExtensions.mobileGetActiveAppInfo`

#### Type declaration

▸ (`...this`): `Promise`<`ActiveAppInfo`\>

Returns information about the active application.

**`Throws`**

if an error raised by command

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`ActiveAppInfo`\>

Active app information

#### Defined in

[lib/driver.js:1843](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1843)

___

### mobileGetAppearance

• **mobileGetAppearance**: (...`this`: `any`) => `Promise`<{ `style`: `Style`  }\> = `commands.appearanceExtensions.mobileGetAppearance`

#### Type declaration

▸ (`...this`): `Promise`<{ `style`: `Style`  }\>

Get the device's UI appearance style.

**`Since`**

Xcode SDK 11

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<{ `style`: `Style`  }\>

#### Defined in

[lib/driver.js:1880](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1880)

___

### mobileGetBatteryInfo

• **mobileGetBatteryInfo**: (...`this`: `any`) => `Promise`<`BatteryInfo`\> = `commands.batteryExtensions.mobileGetBatteryInfo`

#### Type declaration

▸ (`...this`): `Promise`<`BatteryInfo`\>

Reads the battery information from the device under test.

This endpoint only returns reliable result on real devices.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`BatteryInfo`\>

The battery info

#### Defined in

[lib/driver.js:1891](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1891)

___

### mobileGetContexts

• **mobileGetContexts**: (...`this`: `any`, `waitForWebviewMs`: `number`) => `Promise`<`Context`[]\> = `commands.contextExtensions.mobileGetContexts`

#### Type declaration

▸ (`...this?`, `waitForWebviewMs`): `Promise`<`Context`[]\>

Retrieves the list of available contexts.

The list includes extended context information, like URLs and page names.
This is different from the standard `getContexts` API, because the latter
only has web view names without any additional information.

**`Remarks`**

In situations where multiple web views are available at once, the
client code would have to connect to each of them in order to detect the
one which needs to be interacted with. This extra effort is not needed with
the information provided by this extension.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `0` | - |
| `waitForWebviewMs` | `number` | `undefined` | The period to poll for available webview(s) (in ms) |

##### Returns

`Promise`<`Context`[]\>

The list of available context objects along with their properties.

#### Defined in

[lib/driver.js:1937](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1937)

___

### mobileGetDeviceInfo

• **mobileGetDeviceInfo**: (...`this`: `any`) => `Promise`<`DeviceInfo` \| `DeviceInfo` & `LockdownInfo`\> = `commands.deviceInfoExtensions.mobileGetDeviceInfo`

#### Type declaration

▸ (`...this`): `Promise`<`DeviceInfo` \| `DeviceInfo` & `LockdownInfo`\>

Returns the miscellaneous information about the device under test.

Since XCUITest driver v4.2.0, this includes device information via lockdown in a real device.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`DeviceInfo` \| `DeviceInfo` & `LockdownInfo`\>

The response of `/wda/device/info'`

#### Defined in

[lib/driver.js:1952](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1952)

___

### mobileGetDeviceTime

• **mobileGetDeviceTime**: (...`this`: `any`, `format`: `string`) => `Promise`<`string`\> = `commands.generalExtensions.mobileGetDeviceTime`

#### Type declaration

▸ (`...this?`, `format`): `Promise`<`string`\>

Retrieves the current device time

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `MOMENT_FORMAT_ISO8601` | - |
| `format` | `string` | `undefined` | See getDeviceTime.format |

##### Returns

`Promise`<`string`\>

Formatted datetime string or the raw command output if formatting fails

#### Defined in

[lib/driver.js:2019](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2019)

___

### mobileGetSimulatedLocation

• **mobileGetSimulatedLocation**: (...`this`: `any`) => `Promise`<`GeolocationInfo`\> = `commands.geolocationExtensions.mobileGetSimulatedLocation`

#### Type declaration

▸ (`...this`): `Promise`<`GeolocationInfo`\>

Retrieves the simulated geolocation value.
Only works since Xcode 14.3/iOS 16.4

**`Throws`**

If the device under test does not support gelolocation simulation.

**`Since`**

4.18

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`GeolocationInfo`\>

#### Defined in

[lib/driver.js:2038](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2038)

___

### mobileGetSource

• **mobileGetSource**: (...`this`: `any`, `format`: `SourceFormat`, `excludedAttributes?`: `string`) => `Promise`<`string`\> = `commands.sourceExtensions.mobileGetSource`

#### Type declaration

▸ (`...this?`, `format`, `excludedAttributes?`): `Promise`<`string`\>

Retrieve the source tree of the current page in XML or JSON format.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `'xml'` | - |
| `format` | `SourceFormat` | `undefined` | Page tree source representation format. |
| `excludedAttributes?` | `string` | `undefined` | A comma-separated string of attribute names to exclude from the output. Only works if `format` is `xml`. |

##### Returns

`Promise`<`string`\>

The source tree of the current page in the given format.

#### Defined in

[lib/driver.js:2198](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2198)

___

### mobileHandleAlert

• **mobileHandleAlert**: (...`this`: `any`, `action`: `AlertAction`, `buttonLabel?`: `string`) => `Promise`<`void` \| `string`[]\> = `commands.alertExtensions.mobileHandleAlert`

#### Type declaration

▸ (`...this`, `action`, `buttonLabel?`): `Promise`<`void` \| `string`[]\>

Tries to apply the given action to the currently visible alert.

**`Remarks`**

This should really be separate commands.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `action` | `AlertAction` | The actual action to apply. |
| `buttonLabel?` | `string` | The name of the button used to perform the chosen alert action. Only makes sense if the action is `accept` or `dismiss`. |

##### Returns

`Promise`<`void` \| `string`[]\>

If `action` is `getButtons`, a list of alert button labelsp; otherwise nothing.

#### Defined in

[lib/driver.js:1853](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1853)

___

### mobileHideKeyboard

• **mobileHideKeyboard**: (...`this`: `any`, `keys`: `string`[]) => `Promise`<`void`\> = `commands.keyboardExtensions.mobileHideKeyboard`

#### Type declaration

▸ (`...this?`, `keys`): `Promise`<`void`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `[]` |
| `keys` | `string`[] | `undefined` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2086](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2086)

___

### mobileInstallApp

• **mobileInstallApp**: (...`this`: `any`, `app`: `string`, `timeoutMs?`: `number`, `strategy?`: `AppInstallStrategy`) => `Promise`<`void`\> = `commands.appManagementExtensions.mobileInstallApp`

#### Type declaration

▸ (`...this`, `app`, `timeoutMs?`, `strategy?`): `Promise`<`void`\>

Installs the given application to the device under test.

Please ensure the app is built for a correct architecture and is signed with a proper developer signature (for real devices) prior to calling this.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `app` | `string` | See docs for `appium:app` capability |
| `timeoutMs?` | `number` | The maximum time to wait until app install is finished (in ms) on real devices. If not provided, then the value of `appium:appPushTimeout` capability is used. If the capability is not provided then the default is 240000ms (4 minutes). |
| `strategy?` | `AppInstallStrategy` | One of possible app installation strategies on real devices. This argument is ignored on simulators. If not provided, then the value of `appium:appInstallStrategy` is used. If the latter is also not provided, then `serial` is used. See the description of `appium:appInstallStrategy` capability for more details on allowed values. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1859](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1859)

___

### mobileInstallCertificate

• **mobileInstallCertificate**: (...`this`: `any`, `content`: `string`, `commonName?`: `string`, `isRoot`: `boolean`) => `Promise`<`string` \| `void`\> = `commands.certificateExtensions.mobileInstallCertificate`

#### Type declaration

▸ (`...this`, `content`, `commonName?`, `isRoot`): `Promise`<`string` \| `void`\>

Installs a custom certificate onto the device.

Since Xcode SDK 11.4, Apple has added a dedicated `simctl` subcommand to quickly handle
certificates on Simulator over CLI.

On real devices (or simulators before Xcode SDK 11.4), Apple provides no "official" way to do this via the command line.  In such a case (and also as a fallback if CLI setup fails), this method tries to wrap the certificate into `.mobileconfig` format, then deploys the wrapped file to the internal HTTP server so that it can be opened via mobile Safari. This command then goes through the profile installation procedure by clicking the necessary buttons using WebDriverAgent.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `content` | `string` | `undefined` | Base64-encoded content of the public certificate in [PEM](https://knowledge.digicert.com/quovadis/ssl-certificates/ssl-general-topics/what-is-pem-format.html) format |
| `commonName?` | `string` | `true` | Common name of the certificate. If this is not set, the command will try to parse it from the provided `content`. |
| `isRoot` | `boolean` | `undefined` | Defines where the certificate should be installed; either the Trusted Root Store (`true`) or the Keychain (`false`). On environments other than Xcode 11.4+ Simulator, this option is ignored. |

##### Returns

`Promise`<`string` \| `void`\>

The content of the generated `.mobileconfig` file as
a base64-encoded string. This config might be useful for debugging purposes.  If the certificate has been successfully set via CLI, then nothing is returned.

#### Defined in

[lib/driver.js:1904](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1904)

___

### mobileInstallXCTestBundle

• **mobileInstallXCTestBundle**: (...`this`: `any`, `xctestApp`: `string`) => `Promise`<`void`\> = `commands.xctestExtensions.mobileInstallXCTestBundle`

#### Type declaration

▸ (`...this`, `xctestApp`): `Promise`<`void`\>

Installs an XCTest bundle to the device under test.

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** for this command to work.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `xctestApp` | `string` | Path of the XCTest app (URL or filename with extension `.app`) |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2253](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2253)

___

### mobileIsAppInstalled

• **mobileIsAppInstalled**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`boolean`\> = `commands.appManagementExtensions.mobileIsAppInstalled`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

Checks whether the given application is installed on the device under test.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be checked |

##### Returns

`Promise`<`boolean`\>

`true` if the application is installed; `false` otherwise

#### Defined in

[lib/driver.js:1860](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1860)

___

### mobileLaunchApp

• **mobileLaunchApp**: (...`this`: `any`, `bundleId`: `string`, `args?`: `string` \| `string`[], `environment?`: `any`) => `Promise`<`void`\> = `commands.appManagementExtensions.mobileLaunchApp`

#### Type declaration

▸ (`...this`, `bundleId`, `args?`, `environment?`): `Promise`<`void`\>

Executes the given app on the device under test.

If the app is already running it will be activated. If the app is not installed or cannot be launched then an exception is thrown.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be launched |
| `args?` | `string` \| `string`[] | One or more command line arguments for the app. If the app is already running then this argument is ignored. |
| `environment?` | `any` | Environment variables mapping for the app. If the app is already running then this argument is ignored. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1862](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1862)

___

### mobileListCertificates

• **mobileListCertificates**: (...`this`: `any`) => `Promise`<`CertificateList`\> = `commands.certificateExtensions.mobileListCertificates`

#### Type declaration

▸ (`...this`): `Promise`<`CertificateList`\>

Returns map of certificates installed on the real device.

This only works _if and only if_ `py-ios-device` is installed on the same machine Appium is running on.

**`Since`**

4.10.0

**`See`**

https://github.com/YueChen-C/py-ios-device

**`Throws`**

If attempting to list certificates for a simulated device or if `py-ios-device` is not installed

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`CertificateList`\>

An object describing the certificates installed on the real device.

#### Defined in

[lib/driver.js:1905](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1905)

___

### mobileListXCTestBundles

• **mobileListXCTestBundles**: (...`this`: `any`) => `Promise`<`string`[]\> = `commands.xctestExtensions.mobileListXCTestBundles`

#### Type declaration

▸ (`...this`): `Promise`<`string`[]\>

List XCTest bundles that are installed on the device.

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** for this command to work.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`[]\>

List of XCTest bundles (e.g.: `XCTesterAppUITests.XCTesterAppUITests/testLaunchPerformance`)

#### Defined in

[lib/driver.js:2254](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2254)

___

### mobileListXCTestsInTestBundle

• **mobileListXCTestsInTestBundle**: (...`this`: `any`, `bundle`: `string`) => `Promise`<`string`[]\> = `commands.xctestExtensions.mobileListXCTestsInTestBundle`

#### Type declaration

▸ (`...this`, `bundle`): `Promise`<`string`[]\>

List XCTests in a test bundle

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** for this command to work.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundle` | `string` | Bundle ID of the XCTest |

##### Returns

`Promise`<`string`[]\>

The list of xctests in the test bundle (e.g., `['XCTesterAppUITests.XCTesterAppUITests/testExample', 'XCTesterAppUITests.XCTesterAppUITests/testLaunchPerformance']`)

#### Defined in

[lib/driver.js:2255](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2255)

___

### mobilePerformAccessibilityAudit

• **mobilePerformAccessibilityAudit**: (...`this`: `any`, `auditTypes`: ``null`` \| `string`[]) => `Promise`<`AccessibilityAuditItem`[]\> = `commands.auditExtensions.mobilePerformAccessibilityAudit`

#### Type declaration

▸ (`...this`, `auditTypes`): `Promise`<`AccessibilityAuditItem`[]\>

Performs accessbility audit of the current application according to the given type or multiple types.

**`Since`**

Xcode 15/iOS 17

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `auditTypes` | ``null`` \| `string`[] | One or more type names to perform the audit for. The full list of available names could be found at https://developer.apple.com/documentation/xctest/xcuiaccessibilityaudittype?language=objc If no type if provided explicitly then XCUIAccessibilityAuditTypeAll is assumed. |

##### Returns

`Promise`<`AccessibilityAuditItem`[]\>

List of found issues or an empty list

#### Defined in

[lib/driver.js:1886](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1886)

___

### mobilePerformIoHidEvent

• **mobilePerformIoHidEvent**: (...`this`: `any`, `page`: `HIDPageEvent`, `usage`: { `kHIDUsage_AD_ASCIICharacterSet`: `kHIDUsage_AD_ASCIICharacterSet` = 0x21; `kHIDUsage_AD_AlphanumericDisplay`: `kHIDUsage_AD_AlphanumericDisplay` = 0x01; `kHIDUsage_AD_CharacterHeight`: `kHIDUsage_AD_CharacterHeight` = 0x3e; `kHIDUsage_AD_CharacterReport`: `kHIDUsage_AD_CharacterReport` = 0x2b; `kHIDUsage_AD_CharacterSpacingHorizontal`: `kHIDUsage_AD_CharacterSpacingHorizontal` = 0x3f; `kHIDUsage_AD_CharacterSpacingVertical`: `kHIDUsage_AD_CharacterSpacingVertical` = 0x40; `kHIDUsage_AD_CharacterWidth`: `kHIDUsage_AD_CharacterWidth` = 0x3d; `kHIDUsage_AD_ClearDisplay`: `kHIDUsage_AD_ClearDisplay` = 0x25; `kHIDUsage_AD_Column`: `kHIDUsage_AD_Column` = 0x34; `kHIDUsage_AD_Columns`: `kHIDUsage_AD_Columns` = 0x36; `kHIDUsage_AD_CursorBlink`: `kHIDUsage_AD_CursorBlink` = 0x3a; `kHIDUsage_AD_CursorEnable`: `kHIDUsage_AD_CursorEnable` = 0x39; `kHIDUsage_AD_CursorMode`: `kHIDUsage_AD_CursorMode` = 0x38; `kHIDUsage_AD_CursorPixelPositioning`: `kHIDUsage_AD_CursorPixelPositioning` = 0x37; `kHIDUsage_AD_CursorPositionReport`: `kHIDUsage_AD_CursorPositionReport` = 0x32; `kHIDUsage_AD_DataReadBack`: `kHIDUsage_AD_DataReadBack` = 0x22; `kHIDUsage_AD_DisplayAttributesReport`: `kHIDUsage_AD_DisplayAttributesReport` = 0x20; `kHIDUsage_AD_DisplayControlReport`: `kHIDUsage_AD_DisplayControlReport` = 0x24; `kHIDUsage_AD_DisplayData`: `kHIDUsage_AD_DisplayData` = 0x2c; `kHIDUsage_AD_DisplayEnable`: `kHIDUsage_AD_DisplayEnable` = 0x26; `kHIDUsage_AD_DisplayStatus`: `kHIDUsage_AD_DisplayStatus` = 0x2d; `kHIDUsage_AD_ErrFontdatacannotberead`: `kHIDUsage_AD_ErrFontdatacannotberead` = 0x31; `kHIDUsage_AD_ErrNotaloadablecharacter`: `kHIDUsage_AD_ErrNotaloadablecharacter` = 0x30; `kHIDUsage_AD_FontData`: `kHIDUsage_AD_FontData` = 0x3c; `kHIDUsage_AD_FontReadBack`: `kHIDUsage_AD_FontReadBack` = 0x23; `kHIDUsage_AD_FontReport`: `kHIDUsage_AD_FontReport` = 0x3b; `kHIDUsage_AD_HorizontalScroll`: `kHIDUsage_AD_HorizontalScroll` = 0x2a; `kHIDUsage_AD_Reserved`: `kHIDUsage_AD_Reserved` = 0xffff; `kHIDUsage_AD_Row`: `kHIDUsage_AD_Row` = 0x33; `kHIDUsage_AD_Rows`: `kHIDUsage_AD_Rows` = 0x35; `kHIDUsage_AD_ScreenSaverDelay`: `kHIDUsage_AD_ScreenSaverDelay` = 0x27; `kHIDUsage_AD_ScreenSaverEnable`: `kHIDUsage_AD_ScreenSaverEnable` = 0x28; `kHIDUsage_AD_StatNotReady`: `kHIDUsage_AD_StatNotReady` = 0x2e; `kHIDUsage_AD_StatReady`: `kHIDUsage_AD_StatReady` = 0x2f; `kHIDUsage_AD_UnicodeCharacterSet`: `kHIDUsage_AD_UnicodeCharacterSet` = 0x41; `kHIDUsage_AD_VerticalScroll`: `kHIDUsage_AD_VerticalScroll` = 0x29; `kHIDUsage_BCS_2DControlReport`: `kHIDUsage_BCS_2DControlReport` = 0x1f; `kHIDUsage_BCS_ActiveTime`: `kHIDUsage_BCS_ActiveTime` = 0x55; `kHIDUsage_BCS_AddEAN2_3LabelDefinition`: `kHIDUsage_BCS_AddEAN2_3LabelDefinition` = 0xbf; `kHIDUsage_BCS_AimDuration`: `kHIDUsage_BCS_AimDuration` = 0x7a; `kHIDUsage_BCS_AimingLaserPattern`: `kHIDUsage_BCS_AimingLaserPattern` = 0x56; `kHIDUsage_BCS_Aiming_PointerMide`: `kHIDUsage_BCS_Aiming_PointerMide` = 0x30; `kHIDUsage_BCS_AttributeReport`: `kHIDUsage_BCS_AttributeReport` = 0x10; `kHIDUsage_BCS_AztecCode`: `kHIDUsage_BCS_AztecCode` = 0x110; `kHIDUsage_BCS_BC412`: `kHIDUsage_BCS_BC412` = 0x111; `kHIDUsage_BCS_BadgeReader`: `kHIDUsage_BCS_BadgeReader` = 0x01; `kHIDUsage_BCS_BarCodePresent`: `kHIDUsage_BCS_BarCodePresent` = 0x57; `kHIDUsage_BCS_BarCodePresentSensor`: `kHIDUsage_BCS_BarCodePresentSensor` = 0x31; `kHIDUsage_BCS_BarCodeScanner`: `kHIDUsage_BCS_BarCodeScanner` = 0x02; `kHIDUsage_BCS_BarCodeScannerCradle`: `kHIDUsage_BCS_BarCodeScannerCradle` = 0x05; `kHIDUsage_BCS_BarSpaceData`: `kHIDUsage_BCS_BarSpaceData` = 0x100; `kHIDUsage_BCS_BeeperState`: `kHIDUsage_BCS_BeeperState` = 0x58; `kHIDUsage_BCS_BooklandEAN`: `kHIDUsage_BCS_BooklandEAN` = 0x91; `kHIDUsage_BCS_ChannelCode`: `kHIDUsage_BCS_ChannelCode` = 0x112; `kHIDUsage_BCS_Check`: `kHIDUsage_BCS_Check` = 0xb0; `kHIDUsage_BCS_CheckDigit`: `kHIDUsage_BCS_CheckDigit` = 0xd6; `kHIDUsage_BCS_CheckDigitCodabarEnable`: `kHIDUsage_BCS_CheckDigitCodabarEnable` = 0xde; `kHIDUsage_BCS_CheckDigitCode99Enable`: `kHIDUsage_BCS_CheckDigitCode99Enable` = 0xdf; `kHIDUsage_BCS_CheckDigitDisable`: `kHIDUsage_BCS_CheckDigitDisable` = 0xd7; `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC`: `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` = 0xd8; `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS`: `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` = 0xd9; `kHIDUsage_BCS_CheckDigitEnableOneMSIPlessey`: `kHIDUsage_BCS_CheckDigitEnableOneMSIPlessey` = 0xdc; `kHIDUsage_BCS_CheckDigitEnableStandard2of5OPCC`: `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` = 0xd8; `kHIDUsage_BCS_CheckDigitEnableStandard2of5USS`: `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` = 0xd9; `kHIDUsage_BCS_CheckDigitEnableTwoMSIPlessey`: `kHIDUsage_BCS_CheckDigitEnableTwoMSIPlessey` = 0xdd; `kHIDUsage_BCS_CheckDisablePrice`: `kHIDUsage_BCS_CheckDisablePrice` = 0xb1; `kHIDUsage_BCS_CheckEnable4DigitPrice`: `kHIDUsage_BCS_CheckEnable4DigitPrice` = 0xb2; `kHIDUsage_BCS_CheckEnable5DigitPrice`: `kHIDUsage_BCS_CheckEnable5DigitPrice` = 0xb3; `kHIDUsage_BCS_CheckEnableEuropean4DigitPrice`: `kHIDUsage_BCS_CheckEnableEuropean4DigitPrice` = 0xb4; `kHIDUsage_BCS_CheckEnableEuropean5DigitPrice`: `kHIDUsage_BCS_CheckEnableEuropean5DigitPrice` = 0xb5; `kHIDUsage_BCS_Class1ALaser`: `kHIDUsage_BCS_Class1ALaser` = 0x32; `kHIDUsage_BCS_Class2Laser`: `kHIDUsage_BCS_Class2Laser` = 0x33; `kHIDUsage_BCS_ClearAllEAN2_3LabelDefinitions`: `kHIDUsage_BCS_ClearAllEAN2_3LabelDefinitions` = 0xc0; `kHIDUsage_BCS_Codabar`: `kHIDUsage_BCS_Codabar` = 0xc3; `kHIDUsage_BCS_CodabarControlReport`: `kHIDUsage_BCS_CodabarControlReport` = 0x1c; `kHIDUsage_BCS_Code128`: `kHIDUsage_BCS_Code128` = 0xc4; `kHIDUsage_BCS_Code128ControlReport`: `kHIDUsage_BCS_Code128ControlReport` = 0x1d; `kHIDUsage_BCS_Code16`: `kHIDUsage_BCS_Code16` = 0x113; `kHIDUsage_BCS_Code32`: `kHIDUsage_BCS_Code32` = 0x114; `kHIDUsage_BCS_Code39`: `kHIDUsage_BCS_Code39` = 0xc7; `kHIDUsage_BCS_Code39ControlReport`: `kHIDUsage_BCS_Code39ControlReport` = 0x18; `kHIDUsage_BCS_Code49`: `kHIDUsage_BCS_Code49` = 0x115; `kHIDUsage_BCS_Code93`: `kHIDUsage_BCS_Code93` = 0xc8; `kHIDUsage_BCS_CodeOne`: `kHIDUsage_BCS_CodeOne` = 0x116; `kHIDUsage_BCS_Colorcode`: `kHIDUsage_BCS_Colorcode` = 0x117; `kHIDUsage_BCS_CommitParametersToNVM`: `kHIDUsage_BCS_CommitParametersToNVM` = 0x6d; `kHIDUsage_BCS_ConstantElectronicArticleSurveillance`: `kHIDUsage_BCS_ConstantElectronicArticleSurveillance` = 0x37; `kHIDUsage_BCS_ContactScanner`: `kHIDUsage_BCS_ContactScanner` = 0x35; `kHIDUsage_BCS_ConvertEAN8To13Type`: `kHIDUsage_BCS_ConvertEAN8To13Type` = 0x92; `kHIDUsage_BCS_ConvertUPCAToEAN_13`: `kHIDUsage_BCS_ConvertUPCAToEAN_13` = 0x93; `kHIDUsage_BCS_ConvertUPC_EToA`: `kHIDUsage_BCS_ConvertUPC_EToA` = 0x94; `kHIDUsage_BCS_CordlessScannerBase`: `kHIDUsage_BCS_CordlessScannerBase` = 0x04; `kHIDUsage_BCS_DLMethodCheckForDiscrete`: `kHIDUsage_BCS_DLMethodCheckForDiscrete` = 0x10d; `kHIDUsage_BCS_DLMethodCheckInRange`: `kHIDUsage_BCS_DLMethodCheckInRange` = 0x10c; `kHIDUsage_BCS_DLMethodReadAny`: `kHIDUsage_BCS_DLMethodReadAny` = 0x10b; `kHIDUsage_BCS_DataLengthMethod`: `kHIDUsage_BCS_DataLengthMethod` = 0x10a; `kHIDUsage_BCS_DataMatrix`: `kHIDUsage_BCS_DataMatrix` = 0x118; `kHIDUsage_BCS_DataPrefix`: `kHIDUsage_BCS_DataPrefix` = 0x4f; `kHIDUsage_BCS_DecodeDataContinued`: `kHIDUsage_BCS_DecodeDataContinued` = 0xff; `kHIDUsage_BCS_DecodedData`: `kHIDUsage_BCS_DecodedData` = 0xfe; `kHIDUsage_BCS_DisableCheckDigitTransmit`: `kHIDUsage_BCS_DisableCheckDigitTransmit` = 0xf1; `kHIDUsage_BCS_DumbBarCodeScanner`: `kHIDUsage_BCS_DumbBarCodeScanner` = 0x03; `kHIDUsage_BCS_EAN13FlagDigit1`: `kHIDUsage_BCS_EAN13FlagDigit1` = 0xbc; `kHIDUsage_BCS_EAN13FlagDigit2`: `kHIDUsage_BCS_EAN13FlagDigit2` = 0xbd; `kHIDUsage_BCS_EAN13FlagDigit3`: `kHIDUsage_BCS_EAN13FlagDigit3` = 0xbe; `kHIDUsage_BCS_EAN2_3LabelControlReport`: `kHIDUsage_BCS_EAN2_3LabelControlReport` = 0x17; `kHIDUsage_BCS_EAN8FlagDigit1`: `kHIDUsage_BCS_EAN8FlagDigit1` = 0xb9; `kHIDUsage_BCS_EAN8FlagDigit2`: `kHIDUsage_BCS_EAN8FlagDigit2` = 0xba; `kHIDUsage_BCS_EAN8FlagDigit3`: `kHIDUsage_BCS_EAN8FlagDigit3` = 0xbb; `kHIDUsage_BCS_EANThreeLabel`: `kHIDUsage_BCS_EANThreeLabel` = 0xb8; `kHIDUsage_BCS_EANTwoLabel`: `kHIDUsage_BCS_EANTwoLabel` = 0xb7; `kHIDUsage_BCS_EAN_13`: `kHIDUsage_BCS_EAN_13` = 0x95; `kHIDUsage_BCS_EAN_8`: `kHIDUsage_BCS_EAN_8` = 0x96; `kHIDUsage_BCS_EAN_99_128_Mandatory`: `kHIDUsage_BCS_EAN_99_128_Mandatory` = 0x97; `kHIDUsage_BCS_EAN_99_P5_128_Optional`: `kHIDUsage_BCS_EAN_99_P5_128_Optional` = 0x98; `kHIDUsage_BCS_ElectronicArticleSurveillanceNotification`: `kHIDUsage_BCS_ElectronicArticleSurveillanceNotification` = 0x36; `kHIDUsage_BCS_EnableCheckDigitTransmit`: `kHIDUsage_BCS_EnableCheckDigitTransmit` = 0xf2; `kHIDUsage_BCS_ErrorIndication`: `kHIDUsage_BCS_ErrorIndication` = 0x38; `kHIDUsage_BCS_FirstDiscreteLengthToDecode`: `kHIDUsage_BCS_FirstDiscreteLengthToDecode` = 0x108; `kHIDUsage_BCS_FixedBeeper`: `kHIDUsage_BCS_FixedBeeper` = 0x39; `kHIDUsage_BCS_FragmentDecoding`: `kHIDUsage_BCS_FragmentDecoding` = 0x4d; `kHIDUsage_BCS_FullASCIIConversion`: `kHIDUsage_BCS_FullASCIIConversion` = 0xc9; `kHIDUsage_BCS_GRWTIAfterDecode`: `kHIDUsage_BCS_GRWTIAfterDecode` = 0x89; `kHIDUsage_BCS_GRWTIBeep_LampAfterTransmit`: `kHIDUsage_BCS_GRWTIBeep_LampAfterTransmit` = 0x8a; `kHIDUsage_BCS_GRWTINoBeep_LampUseAtAll`: `kHIDUsage_BCS_GRWTINoBeep_LampUseAtAll` = 0x8b; `kHIDUsage_BCS_GoodDecodeIndication`: `kHIDUsage_BCS_GoodDecodeIndication` = 0x3a; `kHIDUsage_BCS_GoodReadLED`: `kHIDUsage_BCS_GoodReadLED` = 0x7d; `kHIDUsage_BCS_GoodReadLampDuration`: `kHIDUsage_BCS_GoodReadLampDuration` = 0x7b; `kHIDUsage_BCS_GoodReadLampIntensity`: `kHIDUsage_BCS_GoodReadLampIntensity` = 0x7c; `kHIDUsage_BCS_GoodReadToneFrequency`: `kHIDUsage_BCS_GoodReadToneFrequency` = 0x7e; `kHIDUsage_BCS_GoodReadToneLength`: `kHIDUsage_BCS_GoodReadToneLength` = 0x7f; `kHIDUsage_BCS_GoodReadToneVolume`: `kHIDUsage_BCS_GoodReadToneVolume` = 0x80; `kHIDUsage_BCS_GoodReadWhenToWrite`: `kHIDUsage_BCS_GoodReadWhenToWrite` = 0x88; `kHIDUsage_BCS_HandsFreeScanning`: `kHIDUsage_BCS_HandsFreeScanning` = 0x3b; `kHIDUsage_BCS_HeaterPresent`: `kHIDUsage_BCS_HeaterPresent` = 0x34; `kHIDUsage_BCS_InitiateBarcodeRead`: `kHIDUsage_BCS_InitiateBarcodeRead` = 0x60; `kHIDUsage_BCS_Interleaved2of5`: `kHIDUsage_BCS_Interleaved2of5` = 0xca; `kHIDUsage_BCS_Interleaved2of5ControlReport`: `kHIDUsage_BCS_Interleaved2of5ControlReport` = 0x19; `kHIDUsage_BCS_IntrinsicallySafe`: `kHIDUsage_BCS_IntrinsicallySafe` = 0x3c; `kHIDUsage_BCS_ItalianPharmacyCode`: `kHIDUsage_BCS_ItalianPharmacyCode` = 0xcb; `kHIDUsage_BCS_KlasseEinsLaser`: `kHIDUsage_BCS_KlasseEinsLaser` = 0x3d; `kHIDUsage_BCS_LaserOnTime`: `kHIDUsage_BCS_LaserOnTime` = 0x59; `kHIDUsage_BCS_LaserState`: `kHIDUsage_BCS_LaserState` = 0x5a; `kHIDUsage_BCS_LockoutTime`: `kHIDUsage_BCS_LockoutTime` = 0x5b; `kHIDUsage_BCS_LongRangeScanner`: `kHIDUsage_BCS_LongRangeScanner` = 0x3e; `kHIDUsage_BCS_MSIPlesseyControlReport`: `kHIDUsage_BCS_MSIPlesseyControlReport` = 0x1b; `kHIDUsage_BCS_MSI_Plessey`: `kHIDUsage_BCS_MSI_Plessey` = 0xcc; `kHIDUsage_BCS_MaxiCode`: `kHIDUsage_BCS_MaxiCode` = 0x119; `kHIDUsage_BCS_MaximumLengthToDecode`: `kHIDUsage_BCS_MaximumLengthToDecode` = 0x107; `kHIDUsage_BCS_MicroPDF`: `kHIDUsage_BCS_MicroPDF` = 0x11a; `kHIDUsage_BCS_MinimumLengthToDecode`: `kHIDUsage_BCS_MinimumLengthToDecode` = 0x106; `kHIDUsage_BCS_MirrorSpeedControl`: `kHIDUsage_BCS_MirrorSpeedControl` = 0x3f; `kHIDUsage_BCS_Misc1DControlReport`: `kHIDUsage_BCS_Misc1DControlReport` = 0x1e; `kHIDUsage_BCS_MotorState`: `kHIDUsage_BCS_MotorState` = 0x5c; `kHIDUsage_BCS_MotorTimeout`: `kHIDUsage_BCS_MotorTimeout` = 0x5d; `kHIDUsage_BCS_MultiRangeScanner`: `kHIDUsage_BCS_MultiRangeScanner` = 0x45; `kHIDUsage_BCS_NoReadMessage`: `kHIDUsage_BCS_NoReadMessage` = 0x82; `kHIDUsage_BCS_NotOnFileIndication`: `kHIDUsage_BCS_NotOnFileIndication` = 0x40; `kHIDUsage_BCS_NotOnFileVolume`: `kHIDUsage_BCS_NotOnFileVolume` = 0x83; `kHIDUsage_BCS_PDF_417`: `kHIDUsage_BCS_PDF_417` = 0x11b; `kHIDUsage_BCS_ParameterScanning`: `kHIDUsage_BCS_ParameterScanning` = 0x6e; `kHIDUsage_BCS_ParametersChanged`: `kHIDUsage_BCS_ParametersChanged` = 0x6f; `kHIDUsage_BCS_Periodical`: `kHIDUsage_BCS_Periodical` = 0xa9; `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus2`: `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus2` = 0xaa; `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus5`: `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus5` = 0xad; `kHIDUsage_BCS_PeriodicalIgnorePlus2`: `kHIDUsage_BCS_PeriodicalIgnorePlus2` = 0xac; `kHIDUsage_BCS_PeriodicalIgnorePlus5`: `kHIDUsage_BCS_PeriodicalIgnorePlus5` = 0xaf; `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus2`: `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus2` = 0xab; `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus5`: `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus5` = 0xae; `kHIDUsage_BCS_PolarityInvertedBarCode`: `kHIDUsage_BCS_PolarityInvertedBarCode` = 0x103; `kHIDUsage_BCS_PolarityNormalBarCode`: `kHIDUsage_BCS_PolarityInvertedBarCode` = 0x103; `kHIDUsage_BCS_PosiCode`: `kHIDUsage_BCS_PosiCode` = 0x11c; `kHIDUsage_BCS_PowerOnResetScanner`: `kHIDUsage_BCS_PowerOnResetScanner` = 0x5e; `kHIDUsage_BCS_PowerupBeep`: `kHIDUsage_BCS_PowerupBeep` = 0x84; `kHIDUsage_BCS_PrefixAIMI`: `kHIDUsage_BCS_PrefixAIMI` = 0x50; `kHIDUsage_BCS_PrefixNone`: `kHIDUsage_BCS_PrefixNone` = 0x51; `kHIDUsage_BCS_PrefixProprietary`: `kHIDUsage_BCS_PrefixProprietary` = 0x52; `kHIDUsage_BCS_PreventReadOfBarcodes`: `kHIDUsage_BCS_PreventReadOfBarcodes` = 0x5f; `kHIDUsage_BCS_ProgrammableBeeper`: `kHIDUsage_BCS_ProgrammableBeeper` = 0x41; `kHIDUsage_BCS_ProximitySensor`: `kHIDUsage_BCS_ProximitySensor` = 0x46; `kHIDUsage_BCS_QRCode`: `kHIDUsage_BCS_QRCode` = 0x11d; `kHIDUsage_BCS_RawDataPolarity`: `kHIDUsage_BCS_RawDataPolarity` = 0x102; `kHIDUsage_BCS_RawScannedDataReport`: `kHIDUsage_BCS_RawScannedDataReport` = 0x13; `kHIDUsage_BCS_ScannedDataReport`: `kHIDUsage_BCS_ScannedDataReport` = 0x12; `kHIDUsage_BCS_ScannerDataAccuracy`: `kHIDUsage_BCS_ScannerDataAccuracy` = 0x101; `kHIDUsage_BCS_ScannerInCradle`: `kHIDUsage_BCS_ScannerInCradle` = 0x75; `kHIDUsage_BCS_ScannerInRange`: `kHIDUsage_BCS_ScannerInRange` = 0x76; `kHIDUsage_BCS_ScannerReadConfidence`: `kHIDUsage_BCS_ScannerReadConfidence` = 0x4e; `kHIDUsage_BCS_SecondDiscreteLengthToDecode`: `kHIDUsage_BCS_SecondDiscreteLengthToDecode` = 0x109; `kHIDUsage_BCS_SetParameterDefaultValues`: `kHIDUsage_BCS_SetParameterDefaultValues` = 0x70; `kHIDUsage_BCS_SettingsReport`: `kHIDUsage_BCS_SettingsReport` = 0x11; `kHIDUsage_BCS_SoundErrorBeep`: `kHIDUsage_BCS_SoundErrorBeep` = 0x85; `kHIDUsage_BCS_SoundGoodReadBeep`: `kHIDUsage_BCS_SoundGoodReadBeep` = 0x86; `kHIDUsage_BCS_SoundNotOnFileBeep`: `kHIDUsage_BCS_SoundNotOnFileBeep` = 0x87; `kHIDUsage_BCS_Standard2of5`: `kHIDUsage_BCS_Standard2of5` = 0xce; `kHIDUsage_BCS_Standard2of5ControlReport`: `kHIDUsage_BCS_Standard2of5ControlReport` = 0x1a; `kHIDUsage_BCS_Standard2of5IATA`: `kHIDUsage_BCS_Standard2of5IATA` = 0xcd; `kHIDUsage_BCS_StatusReport`: `kHIDUsage_BCS_StatusReport` = 0x15; `kHIDUsage_BCS_SuperCode`: `kHIDUsage_BCS_SuperCode` = 0x11e; `kHIDUsage_BCS_SymbologyIdentifier1`: `kHIDUsage_BCS_SymbologyIdentifier1` = 0xfb; `kHIDUsage_BCS_SymbologyIdentifier2`: `kHIDUsage_BCS_SymbologyIdentifier2` = 0xfc; `kHIDUsage_BCS_SymbologyIdentifier3`: `kHIDUsage_BCS_SymbologyIdentifier3` = 0xfd; `kHIDUsage_BCS_TransmitCheckDigit`: `kHIDUsage_BCS_TransmitCheckDigit` = 0xf0; `kHIDUsage_BCS_TransmitStart_Stop`: `kHIDUsage_BCS_TransmitStart_Stop` = 0xd3; `kHIDUsage_BCS_TriOptic`: `kHIDUsage_BCS_TriOptic` = 0xd4; `kHIDUsage_BCS_TriggerMode`: `kHIDUsage_BCS_TriggerMode` = 0x62; `kHIDUsage_BCS_TriggerModeBlinkingLaserOn`: `kHIDUsage_BCS_TriggerModeBlinkingLaserOn` = 0x63; `kHIDUsage_BCS_TriggerModeContinuousLaserOn`: `kHIDUsage_BCS_TriggerModeContinuousLaserOn` = 0x64; `kHIDUsage_BCS_TriggerModeLaserOnWhilePulled`: `kHIDUsage_BCS_TriggerModeLaserOnWhilePulled` = 0x65; `kHIDUsage_BCS_TriggerModeLaserStaysOnAfterTriggerRelease`: `kHIDUsage_BCS_TriggerModeLaserStaysOnAfterTriggerRelease` = 0x66; `kHIDUsage_BCS_TriggerReport`: `kHIDUsage_BCS_TriggerReport` = 0x14; `kHIDUsage_BCS_TriggerState`: `kHIDUsage_BCS_TriggerState` = 0x61; `kHIDUsage_BCS_Triggerless`: `kHIDUsage_BCS_Triggerless` = 0x42; `kHIDUsage_BCS_UCC_EAN_128`: `kHIDUsage_BCS_UCC_EAN_128` = 0xd5; `kHIDUsage_BCS_UPC_A`: `kHIDUsage_BCS_UPC_A` = 0x9d; `kHIDUsage_BCS_UPC_AWith128Mandatory`: `kHIDUsage_BCS_UPC_AWith128Mandatory` = 0x9e; `kHIDUsage_BCS_UPC_AWith128Optical`: `kHIDUsage_BCS_UPC_AWith128Optical` = 0x9f; `kHIDUsage_BCS_UPC_AWithP5Optional`: `kHIDUsage_BCS_UPC_AWithP5Optional` = 0xa0; `kHIDUsage_BCS_UPC_E`: `kHIDUsage_BCS_UPC_E` = 0xa1; `kHIDUsage_BCS_UPC_E1`: `kHIDUsage_BCS_UPC_E1` = 0xa2; `kHIDUsage_BCS_UPC_EAN`: `kHIDUsage_BCS_UPC_EAN` = 0x9a; `kHIDUsage_BCS_UPC_EANControlReport`: `kHIDUsage_BCS_UPC_EANControlReport` = 0x16; `kHIDUsage_BCS_UPC_EANCouponCode`: `kHIDUsage_BCS_UPC_EANCouponCode` = 0x9b; `kHIDUsage_BCS_UPC_EANPeriodicals`: `kHIDUsage_BCS_UPC_EANPeriodicals` = 0x9c; `kHIDUsage_BCS_USB_5_SlugCode`: `kHIDUsage_BCS_USB_5_SlugCode` = 0x120; `kHIDUsage_BCS_UltraCode`: `kHIDUsage_BCS_UltraCode` = 0x11f; `kHIDUsage_BCS_Undefined`: `kHIDUsage_BCS_Undefined` = 0x00; `kHIDUsage_BCS_VeriCode`: `kHIDUsage_BCS_VeriCode` = 0x121; `kHIDUsage_BCS_Wand`: `kHIDUsage_BCS_Wand` = 0x43; `kHIDUsage_BCS_WaterResistant`: `kHIDUsage_BCS_WaterResistant` = 0x44; `kHIDUsage_BS_ACPresent`: `kHIDUsage_BS_ACPresent` = 0xd0; `kHIDUsage_BS_AbsoluteStateOfCharge`: `kHIDUsage_BS_AbsoluteStateOfCharge` = 0x65; `kHIDUsage_BS_AlarmInhibited`: `kHIDUsage_BS_AlarmInhibited` = 0xd3; `kHIDUsage_BS_AtRate`: `kHIDUsage_BS_AtRate` = 0x2b; `kHIDUsage_BS_AtRateOK`: `kHIDUsage_BS_AtRateOK` = 0x49; `kHIDUsage_BS_AtRateTimeToEmpty`: `kHIDUsage_BS_AtRateTimeToEmpty` = 0x61; `kHIDUsage_BS_AtRateTimeToFull`: `kHIDUsage_BS_AtRateTimeToFull` = 0x60; `kHIDUsage_BS_AverageCurrent`: `kHIDUsage_BS_AverageCurrent` = 0x62; `kHIDUsage_BS_AverageTimeToEmpty`: `kHIDUsage_BS_AverageTimeToEmpty` = 0x69; `kHIDUsage_BS_AverageTimeToFull`: `kHIDUsage_BS_AverageTimeToFull` = 0x6a; `kHIDUsage_BS_BattPackModelLevel`: `kHIDUsage_BS_BattPackModelLevel` = 0x80; `kHIDUsage_BS_BatteryInsertion`: `kHIDUsage_BS_BatteryInsertion` = 0x18; `kHIDUsage_BS_BatteryPresent`: `kHIDUsage_BS_BatteryPresent` = 0xd1; `kHIDUsage_BS_BatterySupported`: `kHIDUsage_BS_BatterySupported` = 0x1b; `kHIDUsage_BS_BelowRemainingCapacityLimit`: `kHIDUsage_BS_BelowRemainingCapacityLimit` = 0x42; `kHIDUsage_BS_BroadcastToCharger`: `kHIDUsage_BS_BroadcastToCharger` = 0x2d; `kHIDUsage_BS_CapacityGranularity1`: `kHIDUsage_BS_CapacityGranularity1` = 0x8d; `kHIDUsage_BS_CapacityGranularity2`: `kHIDUsage_BS_CapacityGranularity2` = 0x8e; `kHIDUsage_BS_CapacityMode`: `kHIDUsage_BS_CapacityMode` = 0x2c; `kHIDUsage_BS_ChargeController`: `kHIDUsage_BS_ChargeController` = 0x2f; `kHIDUsage_BS_ChargerConnection`: `kHIDUsage_BS_ChargerConnection` = 0x17; `kHIDUsage_BS_ChargerSelectorSupport`: `kHIDUsage_BS_ChargerSelectorSupport` = 0xf0; `kHIDUsage_BS_ChargerSpec`: `kHIDUsage_BS_ChargerSpec` = 0xf1; `kHIDUsage_BS_Charging`: `kHIDUsage_BS_Charging` = 0x44; `kHIDUsage_BS_ChargingIndicator`: `kHIDUsage_BS_ChargingIndicator` = 0x1d; `kHIDUsage_BS_ConditioningFlag`: `kHIDUsage_BS_ConditioningFlag` = 0x48; `kHIDUsage_BS_ConnectionToSMBus`: `kHIDUsage_BS_ConnectionToSMBus` = 0x15; `kHIDUsage_BS_CurrentNotRegulated`: `kHIDUsage_BS_CurrentNotRegulated` = 0xda; `kHIDUsage_BS_CurrentOutOfRange`: `kHIDUsage_BS_CurrentOutOfRange` = 0xd9; `kHIDUsage_BS_CycleCount`: `kHIDUsage_BS_CycleCount` = 0x6b; `kHIDUsage_BS_DesignCapacity`: `kHIDUsage_BS_DesignCapacity` = 0x83; `kHIDUsage_BS_Discharging`: `kHIDUsage_BS_Discharging` = 0x45; `kHIDUsage_BS_EnablePolling`: `kHIDUsage_BS_EnablePolling` = 0xc1; `kHIDUsage_BS_FullChargeCapacity`: `kHIDUsage_BS_FullChargeCapacity` = 0x67; `kHIDUsage_BS_FullyCharged`: `kHIDUsage_BS_FullyCharged` = 0x46; `kHIDUsage_BS_FullyDischarged`: `kHIDUsage_BS_FullyDischarged` = 0x47; `kHIDUsage_BS_InhibitCharge`: `kHIDUsage_BS_InhibitCharge` = 0xc0; `kHIDUsage_BS_InternalChargeController`: `kHIDUsage_BS_InternalChargeController` = 0x81; `kHIDUsage_BS_Level2`: `kHIDUsage_BS_Level2` = 0xf2; `kHIDUsage_BS_Level3`: `kHIDUsage_BS_Level3` = 0xf3; `kHIDUsage_BS_ManufacturerAccess`: `kHIDUsage_BS_ManufacturerAccess` = 0x28; `kHIDUsage_BS_ManufacturerData`: `kHIDUsage_BS_ManufacturerData` = 0x8a; `kHIDUsage_BS_ManufacturerDate`: `kHIDUsage_BS_ManufacturerDate` = 0x85; `kHIDUsage_BS_MasterMode`: `kHIDUsage_BS_MasterMode` = 0xdc; `kHIDUsage_BS_Maxerror`: `kHIDUsage_BS_Maxerror` = 0x63; `kHIDUsage_BS_NeedReplacement`: `kHIDUsage_BS_NeedReplacement` = 0x4b; `kHIDUsage_BS_OKToUse`: `kHIDUsage_BS_OKToUse` = 0x1a; `kHIDUsage_BS_OptionalMfgFunction1`: `kHIDUsage_BS_OptionalMfgFunction1` = 0x10; `kHIDUsage_BS_OptionalMfgFunction2`: `kHIDUsage_BS_OptionalMfgFunction2` = 0x11; `kHIDUsage_BS_OptionalMfgFunction3`: `kHIDUsage_BS_OptionalMfgFunction3` = 0x12; `kHIDUsage_BS_OptionalMfgFunction4`: `kHIDUsage_BS_OptionalMfgFunction4` = 0x13; `kHIDUsage_BS_OptionalMfgFunction5`: `kHIDUsage_BS_OptionalMfgFunction5` = 0x14; `kHIDUsage_BS_OutputConnection`: `kHIDUsage_BS_OutputConnection` = 0x16; `kHIDUsage_BS_PowerFail`: `kHIDUsage_BS_PowerFail` = 0xd2; `kHIDUsage_BS_PrimaryBattery`: `kHIDUsage_BS_PrimaryBattery` = 0x2e; `kHIDUsage_BS_PrimaryBatterySupport`: `kHIDUsage_BS_PrimaryBatterySupport` = 0x82; `kHIDUsage_BS_Rechargable`: `kHIDUsage_BS_Rechargable` = 0x8b; `kHIDUsage_BS_RelativeStateOfCharge`: `kHIDUsage_BS_RelativeStateOfCharge` = 0x64; `kHIDUsage_BS_RemainingCapacity`: `kHIDUsage_BS_RemainingCapacity` = 0x66; `kHIDUsage_BS_RemainingCapacityLimit`: `kHIDUsage_BS_RemainingCapacityLimit` = 0x29; `kHIDUsage_BS_RemainingTimeLimit`: `kHIDUsage_BS_RemainingTimeLimit` = 0x2a; `kHIDUsage_BS_RemainingTimeLimitExpired`: `kHIDUsage_BS_RemainingTimeLimitExpired` = 0x43; `kHIDUsage_BS_ResetToZero`: `kHIDUsage_BS_ResetToZero` = 0xc2; `kHIDUsage_BS_RunTimeToEmpty`: `kHIDUsage_BS_RunTimeToEmpty` = 0x68; `kHIDUsage_BS_SMBAlarmWarning`: `kHIDUsage_BS_SMBAlarmWarning` = 0x03; `kHIDUsage_BS_SMBBatteryMode`: `kHIDUsage_BS_SMBBatteryMode` = 0x01; `kHIDUsage_BS_SMBBatteryStatus`: `kHIDUsage_BS_SMBBatteryStatus` = 0x02; `kHIDUsage_BS_SMBChargerMode`: `kHIDUsage_BS_SMBChargerMode` = 0x04; `kHIDUsage_BS_SMBChargerSpecInfo`: `kHIDUsage_BS_SMBChargerSpecInfo` = 0x06; `kHIDUsage_BS_SMBChargerStatus`: `kHIDUsage_BS_SMBChargerStatus` = 0x05; `kHIDUsage_BS_SMBErrorCode`: `kHIDUsage_BS_SMBErrorCode` = 0x4a; `kHIDUsage_BS_SMBSelectorInfo`: `kHIDUsage_BS_SMBSelectorInfo` = 0x09; `kHIDUsage_BS_SMBSelectorPresets`: `kHIDUsage_BS_SMBSelectorPresets` = 0x08; `kHIDUsage_BS_SMBSelectorState`: `kHIDUsage_BS_SMBSelectorState` = 0x07; `kHIDUsage_BS_SelectorRevision`: `kHIDUsage_BS_SelectorRevision` = 0x1c; `kHIDUsage_BS_SerialNumber`: `kHIDUsage_BS_SerialNumber` = 0x86; `kHIDUsage_BS_SpecificationInfo`: `kHIDUsage_BS_SpecificationInfo` = 0x84; `kHIDUsage_BS_TerminateCharge`: `kHIDUsage_BS_TerminateCharge` = 0x40; `kHIDUsage_BS_TerminateDischarge`: `kHIDUsage_BS_TerminateDischarge` = 0x41; `kHIDUsage_BS_ThermistorCold`: `kHIDUsage_BS_ThermistorCold` = 0xd6; `kHIDUsage_BS_ThermistorHot`: `kHIDUsage_BS_ThermistorHot` = 0xd5; `kHIDUsage_BS_ThermistorOverRange`: `kHIDUsage_BS_ThermistorOverRange` = 0xd7; `kHIDUsage_BS_ThermistorUnderRange`: `kHIDUsage_BS_ThermistorUnderRange` = 0xd4; `kHIDUsage_BS_Undefined`: `kHIDUsage_BS_Undefined` = 0x00; `kHIDUsage_BS_Usenext`: `kHIDUsage_BS_Usenext` = 0x19; `kHIDUsage_BS_VoltageNotRegulated`: `kHIDUsage_BS_VoltageNotRegulated` = 0xdb; `kHIDUsage_BS_VoltageOutOfRange`: `kHIDUsage_BS_VoltageOutOfRange` = 0xd8; `kHIDUsage_BS_WarningCapacityLimit`: `kHIDUsage_BS_WarningCapacityLimit` = 0x8c; `kHIDUsage_BS_iDeviceChemistry`: `kHIDUsage_BS_iDeviceChemistry` = 0x89; `kHIDUsage_BS_iDevicename`: `kHIDUsage_BS_iDevicename` = 0x88; `kHIDUsage_BS_iManufacturerName`: `kHIDUsage_BS_iManufacturerName` = 0x87; `kHIDUsage_BS_iOEMInformation`: `kHIDUsage_BS_iOEMInformation` = 0x8f; `kHIDUsage_Button_1`: `kHIDUsage_Button_1` = 0x01; `kHIDUsage_Button_2`: `kHIDUsage_Button_2` = 0x02; `kHIDUsage_Button_3`: `kHIDUsage_Button_3` = 0x03; `kHIDUsage_Button_4`: `kHIDUsage_Button_4` = 0x04; `kHIDUsage_Button_65535`: `kHIDUsage_Button_65535` = 0xffff; `kHIDUsage_Csmr_AC`: `kHIDUsage_Csmr_AC` = 0x21e; `kHIDUsage_Csmr_ACBack`: `kHIDUsage_Csmr_ACBack` = 0x224; `kHIDUsage_Csmr_ACBookmarks`: `kHIDUsage_Csmr_ACBookmarks` = 0x22a; `kHIDUsage_Csmr_ACClose`: `kHIDUsage_Csmr_ACClose` = 0x203; `kHIDUsage_Csmr_ACCopy`: `kHIDUsage_Csmr_ACCopy` = 0x21b; `kHIDUsage_Csmr_ACCut`: `kHIDUsage_Csmr_ACCut` = 0x21c; `kHIDUsage_Csmr_ACExit`: `kHIDUsage_Csmr_ACExit` = 0x204; `kHIDUsage_Csmr_ACFind`: `kHIDUsage_Csmr_ACFind` = 0x21f; `kHIDUsage_Csmr_ACFindandReplace`: `kHIDUsage_Csmr_ACFindandReplace` = 0x220; `kHIDUsage_Csmr_ACFormat`: `kHIDUsage_Csmr_ACFormat` = 0x23c; `kHIDUsage_Csmr_ACForward`: `kHIDUsage_Csmr_ACForward` = 0x225; `kHIDUsage_Csmr_ACFullScreenView`: `kHIDUsage_Csmr_ACFullScreenView` = 0x230; `kHIDUsage_Csmr_ACGoTo`: `kHIDUsage_Csmr_ACGoTo` = 0x222; `kHIDUsage_Csmr_ACHistory`: `kHIDUsage_Csmr_ACHistory` = 0x22b; `kHIDUsage_Csmr_ACHome`: `kHIDUsage_Csmr_ACHome` = 0x223; `kHIDUsage_Csmr_ACMaximize`: `kHIDUsage_Csmr_ACMaximize` = 0x205; `kHIDUsage_Csmr_ACMinimize`: `kHIDUsage_Csmr_ACMinimize` = 0x206; `kHIDUsage_Csmr_ACNew`: `kHIDUsage_Csmr_ACNew` = 0x201; `kHIDUsage_Csmr_ACNewWindow`: `kHIDUsage_Csmr_ACNewWindow` = 0x239; `kHIDUsage_Csmr_ACNextLink`: `kHIDUsage_Csmr_ACNextLink` = 0x229; `kHIDUsage_Csmr_ACNormalView`: `kHIDUsage_Csmr_ACNormalView` = 0x231; `kHIDUsage_Csmr_ACOpen`: `kHIDUsage_Csmr_ACOpen` = 0x202; `kHIDUsage_Csmr_ACPan`: `kHIDUsage_Csmr_ACPan` = 0x238; `kHIDUsage_Csmr_ACPanLeft`: `kHIDUsage_Csmr_ACPanLeft` = 0x236; `kHIDUsage_Csmr_ACPanRight`: `kHIDUsage_Csmr_ACPanRight` = 0x237; `kHIDUsage_Csmr_ACPaste`: `kHIDUsage_Csmr_ACPaste` = 0x21d; `kHIDUsage_Csmr_ACPreviousLink`: `kHIDUsage_Csmr_ACPreviousLink` = 0x228; `kHIDUsage_Csmr_ACPrint`: `kHIDUsage_Csmr_ACPrint` = 0x208; `kHIDUsage_Csmr_ACProperties`: `kHIDUsage_Csmr_ACProperties` = 0x209; `kHIDUsage_Csmr_ACRefresh`: `kHIDUsage_Csmr_ACRefresh` = 0x227; `kHIDUsage_Csmr_ACSave`: `kHIDUsage_Csmr_ACSave` = 0x207; `kHIDUsage_Csmr_ACScroll`: `kHIDUsage_Csmr_ACScroll` = 0x235; `kHIDUsage_Csmr_ACScrollDown`: `kHIDUsage_Csmr_ACScrollDown` = 0x234; `kHIDUsage_Csmr_ACScrollUp`: `kHIDUsage_Csmr_ACScrollUp` = 0x233; `kHIDUsage_Csmr_ACSearch`: `kHIDUsage_Csmr_ACSearch` = 0x221; `kHIDUsage_Csmr_ACStop`: `kHIDUsage_Csmr_ACStop` = 0x226; `kHIDUsage_Csmr_ACSubscriptions`: `kHIDUsage_Csmr_ACSubscriptions` = 0x22c; `kHIDUsage_Csmr_ACTileHorizontally`: `kHIDUsage_Csmr_ACTileHorizontally` = 0x23a; `kHIDUsage_Csmr_ACTileVertically`: `kHIDUsage_Csmr_ACTileVertically` = 0x23b; `kHIDUsage_Csmr_ACUndo`: `kHIDUsage_Csmr_ACUndo` = 0x21a; `kHIDUsage_Csmr_ACViewToggle`: `kHIDUsage_Csmr_ACViewToggle` = 0x232; `kHIDUsage_Csmr_ACZoom`: `kHIDUsage_Csmr_ACZoom` = 0x22f; `kHIDUsage_Csmr_ACZoomIn`: `kHIDUsage_Csmr_ACZoomIn` = 0x22d; `kHIDUsage_Csmr_ACZoomOut`: `kHIDUsage_Csmr_ACZoomOut` = 0x22e; `kHIDUsage_Csmr_AL`: `kHIDUsage_Csmr_AL` = 0x1a2; `kHIDUsage_Csmr_ALAOrVCaptureOrPlayback`: `kHIDUsage_Csmr_ALAOrVCaptureOrPlayback` = 0x193; `kHIDUsage_Csmr_ALAlarms`: `kHIDUsage_Csmr_ALAlarms` = 0x1b2; `kHIDUsage_Csmr_ALCalculator`: `kHIDUsage_Csmr_ALCalculator` = 0x192; `kHIDUsage_Csmr_ALCalendarOrSchedule`: `kHIDUsage_Csmr_ALCalendarOrSchedule` = 0x18e; `kHIDUsage_Csmr_ALCheckbookOrFinance`: `kHIDUsage_Csmr_ALCheckbookOrFinance` = 0x191; `kHIDUsage_Csmr_ALClock`: `kHIDUsage_Csmr_ALClock` = 0x1b3; `kHIDUsage_Csmr_ALCommandLineProcessorOrRun`: `kHIDUsage_Csmr_ALCommandLineProcessorOrRun` = 0x1a0; `kHIDUsage_Csmr_ALConsumerControlConfiguration`: `kHIDUsage_Csmr_ALConsumerControlConfiguration` = 0x183; `kHIDUsage_Csmr_ALContactsOrAddressBook`: `kHIDUsage_Csmr_ALContactsOrAddressBook` = 0x18d; `kHIDUsage_Csmr_ALControlPanel`: `kHIDUsage_Csmr_ALControlPanel` = 0x19f; `kHIDUsage_Csmr_ALDatabaseApp`: `kHIDUsage_Csmr_ALDatabaseApp` = 0x189; `kHIDUsage_Csmr_ALDesktop`: `kHIDUsage_Csmr_ALDesktop` = 0x1aa; `kHIDUsage_Csmr_ALDictionary`: `kHIDUsage_Csmr_ALDictionary` = 0x1a9; `kHIDUsage_Csmr_ALDocuments`: `kHIDUsage_Csmr_ALDocuments` = 0x1a7; `kHIDUsage_Csmr_ALEmailReader`: `kHIDUsage_Csmr_ALEmailReader` = 0x18a; `kHIDUsage_Csmr_ALEncryption`: `kHIDUsage_Csmr_ALEncryption` = 0x1b0; `kHIDUsage_Csmr_ALFileBrowser`: `kHIDUsage_Csmr_ALFileBrowser` = 0x1b4; `kHIDUsage_Csmr_ALGrammerCheck`: `kHIDUsage_Csmr_ALGrammerCheck` = 0x1ac; `kHIDUsage_Csmr_ALGraphicsEditor`: `kHIDUsage_Csmr_ALGraphicsEditor` = 0x187; `kHIDUsage_Csmr_ALIntegratedHelpCenter`: `kHIDUsage_Csmr_ALIntegratedHelpCenter` = 0x1a6; `kHIDUsage_Csmr_ALInternetBrowser`: `kHIDUsage_Csmr_ALInternetBrowser` = 0x196; `kHIDUsage_Csmr_ALKeyboardLayout`: `kHIDUsage_Csmr_ALKeyboardLayout` = 0x1ae; `kHIDUsage_Csmr_ALLANOrWANBrowser`: `kHIDUsage_Csmr_ALLANOrWANBrowser` = 0x195; `kHIDUsage_Csmr_ALLaunchButtonConfigurationTool`: `kHIDUsage_Csmr_ALLaunchButtonConfigurationTool` = 0x181; `kHIDUsage_Csmr_ALLocalMachineBrowser`: `kHIDUsage_Csmr_ALLocalMachineBrowser` = 0x194; `kHIDUsage_Csmr_ALLogOrJournalOrTimecard`: `kHIDUsage_Csmr_ALLogOrJournalOrTimecard` = 0x190; `kHIDUsage_Csmr_ALLogoff`: `kHIDUsage_Csmr_ALLogoff` = 0x19c; `kHIDUsage_Csmr_ALLogon`: `kHIDUsage_Csmr_ALLogon` = 0x19b; `kHIDUsage_Csmr_ALLogonOrLogoff`: `kHIDUsage_Csmr_ALLogonOrLogoff` = 0x19d; `kHIDUsage_Csmr_ALNetworkChat`: `kHIDUsage_Csmr_ALNetworkChat` = 0x199; `kHIDUsage_Csmr_ALNetworkConference`: `kHIDUsage_Csmr_ALNetworkConference` = 0x198; `kHIDUsage_Csmr_ALNewsreader`: `kHIDUsage_Csmr_ALNewsreader` = 0x18b; `kHIDUsage_Csmr_ALNextTaskOrApplication`: `kHIDUsage_Csmr_ALNextTaskOrApplication` = 0x1a3; `kHIDUsage_Csmr_ALPowerStatus`: `kHIDUsage_Csmr_ALPowerStatus` = 0x1b5; `kHIDUsage_Csmr_ALPreemptiveHaltTaskOrApplication`: `kHIDUsage_Csmr_ALPreemptiveHaltTaskOrApplication` = 0x1a5; `kHIDUsage_Csmr_ALPresentationApp`: `kHIDUsage_Csmr_ALPresentationApp` = 0x188; `kHIDUsage_Csmr_ALPreviousTaskOrApplication`: `kHIDUsage_Csmr_ALPreviousTaskOrApplication` = 0x1a4; `kHIDUsage_Csmr_ALProcessOrTaskManager`: `kHIDUsage_Csmr_ALProcessOrTaskManager` = 0x1a1; `kHIDUsage_Csmr_ALProgrammableButtonConfiguration`: `kHIDUsage_Csmr_ALProgrammableButtonConfiguration` = 0x182; `kHIDUsage_Csmr_ALRemoteNetworkingOrISPConnect`: `kHIDUsage_Csmr_ALRemoteNetworkingOrISPConnect` = 0x197; `kHIDUsage_Csmr_ALScreenSaver`: `kHIDUsage_Csmr_ALScreenSaver` = 0x1b1; `kHIDUsage_Csmr_ALSpellCheck`: `kHIDUsage_Csmr_ALSpellCheck` = 0x1ab; `kHIDUsage_Csmr_ALSpreadsheet`: `kHIDUsage_Csmr_ALSpreadsheet` = 0x186; `kHIDUsage_Csmr_ALTaskOrProjectManager`: `kHIDUsage_Csmr_ALTaskOrProjectManager` = 0x18f; `kHIDUsage_Csmr_ALTelephonyOrDialer`: `kHIDUsage_Csmr_ALTelephonyOrDialer` = 0x19a; `kHIDUsage_Csmr_ALTerminalLockOrScreensaver`: `kHIDUsage_Csmr_ALTerminalLockOrScreensaver` = 0x19e; `kHIDUsage_Csmr_ALTextEditor`: `kHIDUsage_Csmr_ALTextEditor` = 0x185; `kHIDUsage_Csmr_ALThesaurus`: `kHIDUsage_Csmr_ALThesaurus` = 0x1a8; `kHIDUsage_Csmr_ALVirusProtection`: `kHIDUsage_Csmr_ALVirusProtection` = 0x1af; `kHIDUsage_Csmr_ALVoicemail`: `kHIDUsage_Csmr_ALVoicemail` = 0x18c; `kHIDUsage_Csmr_ALWirelessStatus`: `kHIDUsage_Csmr_ALWirelessStatus` = 0x1ad; `kHIDUsage_Csmr_ALWordProcessor`: `kHIDUsage_Csmr_ALWordProcessor` = 0x184; `kHIDUsage_Csmr_AMOrPM`: `kHIDUsage_Csmr_AMOrPM` = 0x22; `kHIDUsage_Csmr_AlternateAudioDecrement`: `kHIDUsage_Csmr_AlternateAudioDecrement` = 0x174; `kHIDUsage_Csmr_AlternateAudioIncrement`: `kHIDUsage_Csmr_AlternateAudioIncrement` = 0x173; `kHIDUsage_Csmr_ApplicationLaunchButtons`: `kHIDUsage_Csmr_ApplicationLaunchButtons` = 0x180; `kHIDUsage_Csmr_Assign`: `kHIDUsage_Csmr_Assign` = 0x81; `kHIDUsage_Csmr_Balance`: `kHIDUsage_Csmr_Balance` = 0xe1; `kHIDUsage_Csmr_BalanceLeft`: `kHIDUsage_Csmr_BalanceLeft` = 0x151; `kHIDUsage_Csmr_BalanceRight`: `kHIDUsage_Csmr_BalanceRight` = 0x150; `kHIDUsage_Csmr_Bass`: `kHIDUsage_Csmr_Bass` = 0xe3; `kHIDUsage_Csmr_BassBoost`: `kHIDUsage_Csmr_BassBoost` = 0xe5; `kHIDUsage_Csmr_BassDecrement`: `kHIDUsage_Csmr_BassDecrement` = 0x153; `kHIDUsage_Csmr_BassIncrement`: `kHIDUsage_Csmr_BassIncrement` = 0x152; `kHIDUsage_Csmr_BroadcastMode`: `kHIDUsage_Csmr_BroadcastMode` = 0x64; `kHIDUsage_Csmr_Channel`: `kHIDUsage_Csmr_Channel` = 0x86; `kHIDUsage_Csmr_ChannelCenter`: `kHIDUsage_Csmr_ChannelCenter` = 0x163; `kHIDUsage_Csmr_ChannelCenterFront`: `kHIDUsage_Csmr_ChannelCenterFront` = 0x165; `kHIDUsage_Csmr_ChannelDecrement`: `kHIDUsage_Csmr_ChannelDecrement` = 0x9d; `kHIDUsage_Csmr_ChannelFront`: `kHIDUsage_Csmr_ChannelFront` = 0x164; `kHIDUsage_Csmr_ChannelIncrement`: `kHIDUsage_Csmr_ChannelIncrement` = 0x9c; `kHIDUsage_Csmr_ChannelLeft`: `kHIDUsage_Csmr_ChannelLeft` = 0x161; `kHIDUsage_Csmr_ChannelLowFrequencyEnhancement`: `kHIDUsage_Csmr_ChannelLowFrequencyEnhancement` = 0x168; `kHIDUsage_Csmr_ChannelRight`: `kHIDUsage_Csmr_ChannelRight` = 0x162; `kHIDUsage_Csmr_ChannelSide`: `kHIDUsage_Csmr_ChannelSide` = 0x166; `kHIDUsage_Csmr_ChannelSurround`: `kHIDUsage_Csmr_ChannelSurround` = 0x167; `kHIDUsage_Csmr_ChannelTop`: `kHIDUsage_Csmr_ChannelTop` = 0x169; `kHIDUsage_Csmr_ChannelUnknown`: `kHIDUsage_Csmr_ChannelUnknown` = 0x16a; `kHIDUsage_Csmr_ClearMark`: `kHIDUsage_Csmr_ClearMark` = 0xc3; `kHIDUsage_Csmr_ClimateControlEnable`: `kHIDUsage_Csmr_ClimateControlEnable` = 0x104; `kHIDUsage_Csmr_ClosedCaption`: `kHIDUsage_Csmr_ClosedCaption` = 0x61; `kHIDUsage_Csmr_ClosedCaptionSelect`: `kHIDUsage_Csmr_ClosedCaptionSelect` = 0x62; `kHIDUsage_Csmr_ConsumerControl`: `kHIDUsage_Csmr_ConsumerControl` = 0x01; `kHIDUsage_Csmr_CounterReset`: `kHIDUsage_Csmr_CounterReset` = 0xc8; `kHIDUsage_Csmr_Daily`: `kHIDUsage_Csmr_Daily` = 0xa2; `kHIDUsage_Csmr_DataOnScreen`: `kHIDUsage_Csmr_DataOnScreen` = 0x60; `kHIDUsage_Csmr_Eject`: `kHIDUsage_Csmr_Eject` = 0xb8; `kHIDUsage_Csmr_EnterChannel`: `kHIDUsage_Csmr_EnterChannel` = 0x84; `kHIDUsage_Csmr_EnterDisc`: `kHIDUsage_Csmr_EnterDisc` = 0xbb; `kHIDUsage_Csmr_ExtendedPlay`: `kHIDUsage_Csmr_ExtendedPlay` = 0xf4; `kHIDUsage_Csmr_FanEnable`: `kHIDUsage_Csmr_FanEnable` = 0x100; `kHIDUsage_Csmr_FanSpeed`: `kHIDUsage_Csmr_FanSpeed` = 0x101; `kHIDUsage_Csmr_FastForward`: `kHIDUsage_Csmr_FastForward` = 0xb3; `kHIDUsage_Csmr_FireAlarm`: `kHIDUsage_Csmr_FireAlarm` = 0x107; `kHIDUsage_Csmr_FrameBack`: `kHIDUsage_Csmr_FrameBack` = 0xc1; `kHIDUsage_Csmr_FrameForward`: `kHIDUsage_Csmr_FrameForward` = 0xc0; `kHIDUsage_Csmr_FunctionButtons`: `kHIDUsage_Csmr_FunctionButtons` = 0x36; `kHIDUsage_Csmr_GenericGUIApplicationControls`: `kHIDUsage_Csmr_GenericGUIApplicationControls` = 0x200; `kHIDUsage_Csmr_Help`: `kHIDUsage_Csmr_Help` = 0x95; `kHIDUsage_Csmr_Illumination`: `kHIDUsage_Csmr_Illumination` = 0x35; `kHIDUsage_Csmr_LightEnable`: `kHIDUsage_Csmr_LightEnable` = 0x102; `kHIDUsage_Csmr_LightIlluminationLevel`: `kHIDUsage_Csmr_LightIlluminationLevel` = 0x103; `kHIDUsage_Csmr_LongPlay`: `kHIDUsage_Csmr_LongPlay` = 0xf3; `kHIDUsage_Csmr_Loudness`: `kHIDUsage_Csmr_Loudness` = 0xe7; `kHIDUsage_Csmr_MPX`: `kHIDUsage_Csmr_MPX` = 0xe8; `kHIDUsage_Csmr_Mark`: `kHIDUsage_Csmr_Mark` = 0xc2; `kHIDUsage_Csmr_Media`: `kHIDUsage_Csmr_Media` = 0x9e; `kHIDUsage_Csmr_MediaSelectCD`: `kHIDUsage_Csmr_MediaSelectCD` = 0x91; `kHIDUsage_Csmr_MediaSelectCable`: `kHIDUsage_Csmr_MediaSelectCable` = 0x97; `kHIDUsage_Csmr_MediaSelectCall`: `kHIDUsage_Csmr_MediaSelectCall` = 0x9b; `kHIDUsage_Csmr_MediaSelectComputer`: `kHIDUsage_Csmr_MediaSelectComputer` = 0x88; `kHIDUsage_Csmr_MediaSelectDVD`: `kHIDUsage_Csmr_MediaSelectDVD` = 0x8b; `kHIDUsage_Csmr_MediaSelectGames`: `kHIDUsage_Csmr_MediaSelectGames` = 0x8f; `kHIDUsage_Csmr_MediaSelectHome`: `kHIDUsage_Csmr_MediaSelectHome` = 0x9a; `kHIDUsage_Csmr_MediaSelectMessages`: `kHIDUsage_Csmr_MediaSelectMessages` = 0x90; `kHIDUsage_Csmr_MediaSelectProgramGuide`: `kHIDUsage_Csmr_MediaSelectProgramGuide` = 0x8d; `kHIDUsage_Csmr_MediaSelectSatellite`: `kHIDUsage_Csmr_MediaSelectSatellite` = 0x98; `kHIDUsage_Csmr_MediaSelectSecurity`: `kHIDUsage_Csmr_MediaSelectSecurity` = 0x99; `kHIDUsage_Csmr_MediaSelectTV`: `kHIDUsage_Csmr_MediaSelectTV` = 0x89; `kHIDUsage_Csmr_MediaSelectTape`: `kHIDUsage_Csmr_MediaSelectTape` = 0x96; `kHIDUsage_Csmr_MediaSelectTelephone`: `kHIDUsage_Csmr_MediaSelectTelephone` = 0x8c; `kHIDUsage_Csmr_MediaSelectTuner`: `kHIDUsage_Csmr_MediaSelectTuner` = 0x93; `kHIDUsage_Csmr_MediaSelectVCR`: `kHIDUsage_Csmr_MediaSelectVCR` = 0x92; `kHIDUsage_Csmr_MediaSelectVideoPhone`: `kHIDUsage_Csmr_MediaSelectVideoPhone` = 0x8e; `kHIDUsage_Csmr_MediaSelectWWW`: `kHIDUsage_Csmr_MediaSelectWWW` = 0x8a; `kHIDUsage_Csmr_MediaSelection`: `kHIDUsage_Csmr_MediaSelection` = 0x87; `kHIDUsage_Csmr_Menu`: `kHIDUsage_Csmr_Menu` = 0x40; `kHIDUsage_Csmr_MenuDown`: `kHIDUsage_Csmr_MenuDown` = 0x43; `kHIDUsage_Csmr_MenuEscape`: `kHIDUsage_Csmr_MenuEscape` = 0x46; `kHIDUsage_Csmr_MenuLeft`: `kHIDUsage_Csmr_MenuLeft` = 0x44; `kHIDUsage_Csmr_MenuPick`: `kHIDUsage_Csmr_MenuPick` = 0x41; `kHIDUsage_Csmr_MenuRight`: `kHIDUsage_Csmr_MenuRight` = 0x45; `kHIDUsage_Csmr_MenuUp`: `kHIDUsage_Csmr_MenuUp` = 0x42; `kHIDUsage_Csmr_MenuValueDecrease`: `kHIDUsage_Csmr_MenuValueDecrease` = 0x48; `kHIDUsage_Csmr_MenuValueIncrease`: `kHIDUsage_Csmr_MenuValueIncrease` = 0x47; `kHIDUsage_Csmr_ModeStep`: `kHIDUsage_Csmr_ModeStep` = 0x82; `kHIDUsage_Csmr_Monthly`: `kHIDUsage_Csmr_Monthly` = 0xa4; `kHIDUsage_Csmr_Mute`: `kHIDUsage_Csmr_Mute` = 0xe2; `kHIDUsage_Csmr_NumericKeyPad`: `kHIDUsage_Csmr_NumericKeyPad` = 0x02; `kHIDUsage_Csmr_Once`: `kHIDUsage_Csmr_Once` = 0xa1; `kHIDUsage_Csmr_OrderMovie`: `kHIDUsage_Csmr_OrderMovie` = 0x85; `kHIDUsage_Csmr_Pause`: `kHIDUsage_Csmr_Pause` = 0xb1; `kHIDUsage_Csmr_Play`: `kHIDUsage_Csmr_Play` = 0xb0; `kHIDUsage_Csmr_PlayOrPause`: `kHIDUsage_Csmr_PlayOrPause` = 0xcd; `kHIDUsage_Csmr_PlayOrSkip`: `kHIDUsage_Csmr_PlayOrSkip` = 0xce; `kHIDUsage_Csmr_PlaybackSpeed`: `kHIDUsage_Csmr_PlaybackSpeed` = 0xf1; `kHIDUsage_Csmr_Plus10`: `kHIDUsage_Csmr_Plus10` = 0x20; `kHIDUsage_Csmr_Plus100`: `kHIDUsage_Csmr_Plus100` = 0x21; `kHIDUsage_Csmr_PoliceAlarm`: `kHIDUsage_Csmr_PoliceAlarm` = 0x108; `kHIDUsage_Csmr_Power`: `kHIDUsage_Csmr_Power` = 0x30; `kHIDUsage_Csmr_ProgrammableButtons`: `kHIDUsage_Csmr_ProgrammableButtons` = 0x03; `kHIDUsage_Csmr_Quit`: `kHIDUsage_Csmr_Quit` = 0x94; `kHIDUsage_Csmr_RandomPlay`: `kHIDUsage_Csmr_RandomPlay` = 0xb9; `kHIDUsage_Csmr_RecallLast`: `kHIDUsage_Csmr_RecallLast` = 0x83; `kHIDUsage_Csmr_Record`: `kHIDUsage_Csmr_Record` = 0xb2; `kHIDUsage_Csmr_Repeat`: `kHIDUsage_Csmr_Repeat` = 0xbc; `kHIDUsage_Csmr_RepeatFromMark`: `kHIDUsage_Csmr_RepeatFromMark` = 0xc4; `kHIDUsage_Csmr_Reserved`: `kHIDUsage_Csmr_Reserved` = 0xffff; `kHIDUsage_Csmr_Reset`: `kHIDUsage_Csmr_Reset` = 0x31; `kHIDUsage_Csmr_ReturnToMark`: `kHIDUsage_Csmr_ReturnToMark` = 0xc5; `kHIDUsage_Csmr_Rewind`: `kHIDUsage_Csmr_Rewind` = 0xb4; `kHIDUsage_Csmr_RoomTemperature`: `kHIDUsage_Csmr_RoomTemperature` = 0x105; `kHIDUsage_Csmr_ScanNextTrack`: `kHIDUsage_Csmr_ScanNextTrack` = 0xb5; `kHIDUsage_Csmr_ScanPreviousTrack`: `kHIDUsage_Csmr_ScanPreviousTrack` = 0xb6; `kHIDUsage_Csmr_SearchMarkBackwards`: `kHIDUsage_Csmr_SearchMarkBackwards` = 0xc7; `kHIDUsage_Csmr_SearchMarkForward`: `kHIDUsage_Csmr_SearchMarkForward` = 0xc6; `kHIDUsage_Csmr_SecurityEnable`: `kHIDUsage_Csmr_SecurityEnable` = 0x106; `kHIDUsage_Csmr_SelectDisc`: `kHIDUsage_Csmr_SelectDisc` = 0xba; `kHIDUsage_Csmr_Selection`: `kHIDUsage_Csmr_Selection` = 0x80; `kHIDUsage_Csmr_ShowCounter`: `kHIDUsage_Csmr_ShowCounter` = 0xc9; `kHIDUsage_Csmr_Sleep`: `kHIDUsage_Csmr_Sleep` = 0x32; `kHIDUsage_Csmr_SleepAfter`: `kHIDUsage_Csmr_SleepAfter` = 0x33; `kHIDUsage_Csmr_SleepMode`: `kHIDUsage_Csmr_SleepMode` = 0x34; `kHIDUsage_Csmr_Slow`: `kHIDUsage_Csmr_Slow` = 0xf5; `kHIDUsage_Csmr_SlowTracking`: `kHIDUsage_Csmr_SlowTracking` = 0xbf; `kHIDUsage_Csmr_Snapshot`: `kHIDUsage_Csmr_Snapshot` = 0x65; `kHIDUsage_Csmr_SpeakerSystem`: `kHIDUsage_Csmr_SpeakerSystem` = 0x160; `kHIDUsage_Csmr_Speed`: `kHIDUsage_Csmr_Speed` = 0xf0; `kHIDUsage_Csmr_StandardPlay`: `kHIDUsage_Csmr_StandardPlay` = 0xf2; `kHIDUsage_Csmr_Still`: `kHIDUsage_Csmr_Still` = 0x66; `kHIDUsage_Csmr_Stop`: `kHIDUsage_Csmr_Stop` = 0xb7; `kHIDUsage_Csmr_StopOrEject`: `kHIDUsage_Csmr_StopOrEject` = 0xcc; `kHIDUsage_Csmr_SubChannel`: `kHIDUsage_Csmr_SubChannel` = 0x170; `kHIDUsage_Csmr_SubChannelDecrement`: `kHIDUsage_Csmr_SubChannelDecrement` = 0x172; `kHIDUsage_Csmr_SubChannelIncrement`: `kHIDUsage_Csmr_SubChannelIncrement` = 0x171; `kHIDUsage_Csmr_SurroundMode`: `kHIDUsage_Csmr_SurroundMode` = 0xe6; `kHIDUsage_Csmr_TrackNormal`: `kHIDUsage_Csmr_TrackNormal` = 0xbe; `kHIDUsage_Csmr_Tracking`: `kHIDUsage_Csmr_Tracking` = 0xbd; `kHIDUsage_Csmr_TrackingDecrement`: `kHIDUsage_Csmr_TrackingDecrement` = 0xcb; `kHIDUsage_Csmr_TrackingIncrement`: `kHIDUsage_Csmr_TrackingIncrement` = 0xca; `kHIDUsage_Csmr_Treble`: `kHIDUsage_Csmr_Treble` = 0xe4; `kHIDUsage_Csmr_TrebleDecrement`: `kHIDUsage_Csmr_TrebleDecrement` = 0x155; `kHIDUsage_Csmr_TrebleIncrement`: `kHIDUsage_Csmr_TrebleIncrement` = 0x154; `kHIDUsage_Csmr_VCROrTV`: `kHIDUsage_Csmr_VCROrTV` = 0x63; `kHIDUsage_Csmr_VCRPlus`: `kHIDUsage_Csmr_VCRPlus` = 0xa0; `kHIDUsage_Csmr_Volume`: `kHIDUsage_Csmr_Volume` = 0xe0; `kHIDUsage_Csmr_VolumeDecrement`: `kHIDUsage_Csmr_VolumeDecrement` = 0xea; `kHIDUsage_Csmr_VolumeIncrement`: `kHIDUsage_Csmr_VolumeIncrement` = 0xe9; `kHIDUsage_Csmr_Weekly`: `kHIDUsage_Csmr_Weekly` = 0xa3; `kHIDUsage_Dig_3DDigitizer`: `kHIDUsage_Dig_3DDigitizer` = 0x08; `kHIDUsage_Dig_Altitude`: `kHIDUsage_Dig_Altitude` = 0x40; `kHIDUsage_Dig_Armature`: `kHIDUsage_Dig_Armature` = 0x0b; `kHIDUsage_Dig_ArticulatedArm`: `kHIDUsage_Dig_ArticulatedArm` = 0x0a; `kHIDUsage_Dig_Azimuth`: `kHIDUsage_Dig_Azimuth` = 0x3f; `kHIDUsage_Dig_BarrelPressure`: `kHIDUsage_Dig_BarrelPressure` = 0x31; `kHIDUsage_Dig_BarrelSwitch`: `kHIDUsage_Dig_BarrelSwitch` = 0x44; `kHIDUsage_Dig_BatteryStrength`: `kHIDUsage_Dig_BatteryStrength` = 0x3b; `kHIDUsage_Dig_CoordinateMeasuringMachine`: `kHIDUsage_Dig_CoordinateMeasuringMachine` = 0x07; `kHIDUsage_Dig_DataValid`: `kHIDUsage_Dig_DataValid` = 0x37; `kHIDUsage_Dig_Digitizer`: `kHIDUsage_Dig_Digitizer` = 0x01; `kHIDUsage_Dig_Eraser`: `kHIDUsage_Dig_Eraser` = 0x45; `kHIDUsage_Dig_Finger`: `kHIDUsage_Dig_Finger` = 0x22; `kHIDUsage_Dig_FreeSpaceWand`: `kHIDUsage_Dig_FreeSpaceWand` = 0x0d; `kHIDUsage_Dig_InRange`: `kHIDUsage_Dig_InRange` = 0x32; `kHIDUsage_Dig_Invert`: `kHIDUsage_Dig_Invert` = 0x3c; `kHIDUsage_Dig_LightPen`: `kHIDUsage_Dig_LightPen` = 0x03; `kHIDUsage_Dig_MultiplePointDigitizer`: `kHIDUsage_Dig_MultiplePointDigitizer` = 0x0c; `kHIDUsage_Dig_Pen`: `kHIDUsage_Dig_Pen` = 0x02; `kHIDUsage_Dig_ProgramChangeKeys`: `kHIDUsage_Dig_ProgramChangeKeys` = 0x3a; `kHIDUsage_Dig_Puck`: `kHIDUsage_Dig_Puck` = 0x21; `kHIDUsage_Dig_Quality`: `kHIDUsage_Dig_Quality` = 0x36; `kHIDUsage_Dig_Reserved`: `kHIDUsage_Dig_Reserved` = 0xffff; `kHIDUsage_Dig_SecondaryTipSwitch`: `kHIDUsage_Dig_SecondaryTipSwitch` = 0x43; `kHIDUsage_Dig_StereoPlotter`: `kHIDUsage_Dig_StereoPlotter` = 0x09; `kHIDUsage_Dig_Stylus`: `kHIDUsage_Dig_Stylus` = 0x20; `kHIDUsage_Dig_TabletFunctionKeys`: `kHIDUsage_Dig_TabletFunctionKeys` = 0x39; `kHIDUsage_Dig_TabletPick`: `kHIDUsage_Dig_TabletPick` = 0x46; `kHIDUsage_Dig_Tap`: `kHIDUsage_Dig_Tap` = 0x35; `kHIDUsage_Dig_TipPressure`: `kHIDUsage_Dig_TipPressure` = 0x30; `kHIDUsage_Dig_TipSwitch`: `kHIDUsage_Dig_TipSwitch` = 0x42; `kHIDUsage_Dig_Touch`: `kHIDUsage_Dig_Touch` = 0x33; `kHIDUsage_Dig_TouchPad`: `kHIDUsage_Dig_TouchPad` = 0x05; `kHIDUsage_Dig_TouchScreen`: `kHIDUsage_Dig_TouchScreen` = 0x04; `kHIDUsage_Dig_TransducerIndex`: `kHIDUsage_Dig_TransducerIndex` = 0x38; `kHIDUsage_Dig_Twist`: `kHIDUsage_Dig_Twist` = 0x41; `kHIDUsage_Dig_Untouch`: `kHIDUsage_Dig_Untouch` = 0x34; `kHIDUsage_Dig_WhiteBoard`: `kHIDUsage_Dig_WhiteBoard` = 0x06; `kHIDUsage_Dig_XTilt`: `kHIDUsage_Dig_XTilt` = 0x3d; `kHIDUsage_Dig_YTilt`: `kHIDUsage_Dig_YTilt` = 0x3e; `kHIDUsage_GD_ByteCount`: `kHIDUsage_GD_ByteCount` = 0x3b; `kHIDUsage_GD_CountedBuffer`: `kHIDUsage_GD_CountedBuffer` = 0x3a; `kHIDUsage_GD_DPadDown`: `kHIDUsage_GD_DPadDown` = 0x91; `kHIDUsage_GD_DPadLeft`: `kHIDUsage_GD_DPadLeft` = 0x93; `kHIDUsage_GD_DPadRight`: `kHIDUsage_GD_DPadRight` = 0x92; `kHIDUsage_GD_DPadUp`: `kHIDUsage_GD_DPadUp` = 0x90; `kHIDUsage_GD_Dial`: `kHIDUsage_GD_Dial` = 0x37; `kHIDUsage_GD_GamePad`: `kHIDUsage_GD_GamePad` = 0x05; `kHIDUsage_GD_Hatswitch`: `kHIDUsage_GD_Hatswitch` = 0x39; `kHIDUsage_GD_Joystick`: `kHIDUsage_GD_Joystick` = 0x04; `kHIDUsage_GD_Keyboard`: `kHIDUsage_GD_Keyboard` = 0x06; `kHIDUsage_GD_Keypad`: `kHIDUsage_GD_Keypad` = 0x07; `kHIDUsage_GD_MotionWakeup`: `kHIDUsage_GD_MotionWakeup` = 0x3c; `kHIDUsage_GD_Mouse`: `kHIDUsage_GD_Mouse` = 0x02; `kHIDUsage_GD_MultiAxisController`: `kHIDUsage_GD_MultiAxisController` = 0x08; `kHIDUsage_GD_Pointer`: `kHIDUsage_GD_Pointer` = 0x01; `kHIDUsage_GD_Reserved`: `kHIDUsage_GD_Reserved` = 0xffff; `kHIDUsage_GD_Rx`: `kHIDUsage_GD_Rx` = 0x33; `kHIDUsage_GD_Ry`: `kHIDUsage_GD_Ry` = 0x34; `kHIDUsage_GD_Rz`: `kHIDUsage_GD_Rz` = 0x35; `kHIDUsage_GD_Select`: `kHIDUsage_GD_Select` = 0x3e; `kHIDUsage_GD_Slider`: `kHIDUsage_GD_Slider` = 0x36; `kHIDUsage_GD_Start`: `kHIDUsage_GD_Start` = 0x3d; `kHIDUsage_GD_SystemAppMenu`: `kHIDUsage_GD_SystemAppMenu` = 0x86; `kHIDUsage_GD_SystemContextMenu`: `kHIDUsage_GD_SystemContextMenu` = 0x84; `kHIDUsage_GD_SystemControl`: `kHIDUsage_GD_SystemControl` = 0x80; `kHIDUsage_GD_SystemMainMenu`: `kHIDUsage_GD_SystemMainMenu` = 0x85; `kHIDUsage_GD_SystemMenu`: `kHIDUsage_GD_SystemMenu` = 0x89; `kHIDUsage_GD_SystemMenuDown`: `kHIDUsage_GD_SystemMenuDown` = 0x8d; `kHIDUsage_GD_SystemMenuExit`: `kHIDUsage_GD_SystemMenuExit` = 0x88; `kHIDUsage_GD_SystemMenuHelp`: `kHIDUsage_GD_SystemMenuHelp` = 0x87; `kHIDUsage_GD_SystemMenuLeft`: `kHIDUsage_GD_SystemMenuLeft` = 0x8b; `kHIDUsage_GD_SystemMenuRight`: `kHIDUsage_GD_SystemMenuRight` = 0x8a; `kHIDUsage_GD_SystemMenuUp`: `kHIDUsage_GD_SystemMenuUp` = 0x8c; `kHIDUsage_GD_SystemPowerDown`: `kHIDUsage_GD_SystemPowerDown` = 0x81; `kHIDUsage_GD_SystemSleep`: `kHIDUsage_GD_SystemSleep` = 0x82; `kHIDUsage_GD_SystemWakeUp`: `kHIDUsage_GD_SystemWakeUp` = 0x83; `kHIDUsage_GD_Vbrx`: `kHIDUsage_GD_Vbrx` = 0x43; `kHIDUsage_GD_Vbry`: `kHIDUsage_GD_Vbry` = 0x44; `kHIDUsage_GD_Vbrz`: `kHIDUsage_GD_Vbrz` = 0x45; `kHIDUsage_GD_Vno`: `kHIDUsage_GD_Vno` = 0x46; `kHIDUsage_GD_Vx`: `kHIDUsage_GD_Vx` = 0x40; `kHIDUsage_GD_Vy`: `kHIDUsage_GD_Vy` = 0x41; `kHIDUsage_GD_Vz`: `kHIDUsage_GD_Vz` = 0x42; `kHIDUsage_GD_Wheel`: `kHIDUsage_GD_Wheel` = 0x38; `kHIDUsage_GD_X`: `kHIDUsage_GD_X` = 0x30; `kHIDUsage_GD_Y`: `kHIDUsage_GD_Y` = 0x31; `kHIDUsage_GD_Z`: `kHIDUsage_GD_Z` = 0x32; `kHIDUsage_Game_3DGameController`: `kHIDUsage_Game_3DGameController` = 0x01; `kHIDUsage_Game_Bump`: `kHIDUsage_Game_Bump` = 0x2c; `kHIDUsage_Game_Flipper`: `kHIDUsage_Game_Flipper` = 0x2a; `kHIDUsage_Game_GamepadFireOrJump`: `kHIDUsage_Game_GamepadFireOrJump` = 0x37; `kHIDUsage_Game_GamepadTrigger`: `kHIDUsage_Game_GamepadTrigger` = 0x39; `kHIDUsage_Game_Gun`: `kHIDUsage_Game_Gun` = 0x32; `kHIDUsage_Game_GunAutomatic`: `kHIDUsage_Game_GunAutomatic` = 0x35; `kHIDUsage_Game_GunBolt`: `kHIDUsage_Game_GunBolt` = 0x30; `kHIDUsage_Game_GunBurst`: `kHIDUsage_Game_GunBurst` = 0x34; `kHIDUsage_Game_GunClip`: `kHIDUsage_Game_GunClip` = 0x31; `kHIDUsage_Game_GunDevice`: `kHIDUsage_Game_GunDevice` = 0x03; `kHIDUsage_Game_GunSafety`: `kHIDUsage_Game_GunSafety` = 0x36; `kHIDUsage_Game_GunSingleShot`: `kHIDUsage_Game_GunSingleShot` = 0x33; `kHIDUsage_Game_HeightOfPOV`: `kHIDUsage_Game_HeightOfPOV` = 0x29; `kHIDUsage_Game_LeanForwardOrBackward`: `kHIDUsage_Game_LeanForwardOrBackward` = 0x28; `kHIDUsage_Game_LeanRightOrLeft`: `kHIDUsage_Game_LeanRightOrLeft` = 0x27; `kHIDUsage_Game_MoveForwardOrBackward`: `kHIDUsage_Game_MoveForwardOrBackward` = 0x25; `kHIDUsage_Game_MoveRightOrLeft`: `kHIDUsage_Game_MoveRightOrLeft` = 0x24; `kHIDUsage_Game_MoveUpOrDown`: `kHIDUsage_Game_MoveUpOrDown` = 0x26; `kHIDUsage_Game_NewGame`: `kHIDUsage_Game_NewGame` = 0x2d; `kHIDUsage_Game_PinballDevice`: `kHIDUsage_Game_PinballDevice` = 0x02; `kHIDUsage_Game_PitchUpOrDown`: `kHIDUsage_Game_PitchUpOrDown` = 0x22; `kHIDUsage_Game_Player`: `kHIDUsage_Game_Player` = 0x2f; `kHIDUsage_Game_PointofView`: `kHIDUsage_Game_PointofView` = 0x20; `kHIDUsage_Game_Reserved`: `kHIDUsage_Game_Reserved` = 0xffff; `kHIDUsage_Game_RollRightOrLeft`: `kHIDUsage_Game_RollRightOrLeft` = 0x23; `kHIDUsage_Game_SecondaryFlipper`: `kHIDUsage_Game_SecondaryFlipper` = 0x2b; `kHIDUsage_Game_ShootBall`: `kHIDUsage_Game_ShootBall` = 0x2e; `kHIDUsage_Game_TurnRightOrLeft`: `kHIDUsage_Game_TurnRightOrLeft` = 0x21; `kHIDUsage_Keyboard0`: `kHIDUsage_Keyboard0` = 0x27; `kHIDUsage_Keyboard1`: `kHIDUsage_Keyboard1` = 0x1e; `kHIDUsage_Keyboard2`: `kHIDUsage_Keyboard2` = 0x1f; `kHIDUsage_Keyboard3`: `kHIDUsage_Keyboard3` = 0x20; `kHIDUsage_Keyboard4`: `kHIDUsage_Keyboard4` = 0x21; `kHIDUsage_Keyboard5`: `kHIDUsage_Keyboard5` = 0x22; `kHIDUsage_Keyboard6`: `kHIDUsage_Keyboard6` = 0x23; `kHIDUsage_Keyboard7`: `kHIDUsage_Keyboard7` = 0x24; `kHIDUsage_Keyboard8`: `kHIDUsage_Keyboard8` = 0x25; `kHIDUsage_Keyboard9`: `kHIDUsage_Keyboard9` = 0x26; `kHIDUsage_KeyboardA`: `kHIDUsage_KeyboardA` = 0x04; `kHIDUsage_KeyboardAgain`: `kHIDUsage_KeyboardAgain` = 0x79; `kHIDUsage_KeyboardAlternateErase`: `kHIDUsage_KeyboardAlternateErase` = 0x99; `kHIDUsage_KeyboardApplication`: `kHIDUsage_KeyboardApplication` = 0x65; `kHIDUsage_KeyboardB`: `kHIDUsage_KeyboardB` = 0x05; `kHIDUsage_KeyboardBackslash`: `kHIDUsage_KeyboardBackslash` = 0x31; `kHIDUsage_KeyboardC`: `kHIDUsage_KeyboardC` = 0x06; `kHIDUsage_KeyboardCancel`: `kHIDUsage_KeyboardCancel` = 0x9b; `kHIDUsage_KeyboardCapsLock`: `kHIDUsage_KeyboardCapsLock` = 0x39; `kHIDUsage_KeyboardClear`: `kHIDUsage_KeyboardClear` = 0x9c; `kHIDUsage_KeyboardClearOrAgain`: `kHIDUsage_KeyboardClearOrAgain` = 0xa2; `kHIDUsage_KeyboardCloseBracket`: `kHIDUsage_KeyboardCloseBracket` = 0x30; `kHIDUsage_KeyboardComma`: `kHIDUsage_KeyboardComma` = 0x36; `kHIDUsage_KeyboardCopy`: `kHIDUsage_KeyboardCopy` = 0x7c; `kHIDUsage_KeyboardCrSelOrProps`: `kHIDUsage_KeyboardCrSelOrProps` = 0xa3; `kHIDUsage_KeyboardCut`: `kHIDUsage_KeyboardCut` = 0x7b; `kHIDUsage_KeyboardD`: `kHIDUsage_KeyboardD` = 0x07; `kHIDUsage_KeyboardDeleteForward`: `kHIDUsage_KeyboardDeleteForward` = 0x4c; `kHIDUsage_KeyboardDeleteOrBackspace`: `kHIDUsage_KeyboardDeleteOrBackspace` = 0x2a; `kHIDUsage_KeyboardDownArrow`: `kHIDUsage_KeyboardDownArrow` = 0x51; `kHIDUsage_KeyboardE`: `kHIDUsage_KeyboardE` = 0x08; `kHIDUsage_KeyboardEnd`: `kHIDUsage_KeyboardEnd` = 0x4d; `kHIDUsage_KeyboardEqualSign`: `kHIDUsage_KeyboardEqualSign` = 0x2e; `kHIDUsage_KeyboardErrorRollOver`: `kHIDUsage_KeyboardErrorRollOver` = 0x01; `kHIDUsage_KeyboardErrorUndefined`: `kHIDUsage_KeyboardErrorUndefined` = 0x03; `kHIDUsage_KeyboardEscape`: `kHIDUsage_KeyboardEscape` = 0x29; `kHIDUsage_KeyboardExSel`: `kHIDUsage_KeyboardExSel` = 0xa4; `kHIDUsage_KeyboardExecute`: `kHIDUsage_KeyboardExecute` = 0x74; `kHIDUsage_KeyboardF`: `kHIDUsage_KeyboardF` = 0x09; `kHIDUsage_KeyboardF1`: `kHIDUsage_KeyboardF1` = 0x3a; `kHIDUsage_KeyboardF10`: `kHIDUsage_KeyboardF10` = 0x43; `kHIDUsage_KeyboardF11`: `kHIDUsage_KeyboardF11` = 0x44; `kHIDUsage_KeyboardF12`: `kHIDUsage_KeyboardF12` = 0x45; `kHIDUsage_KeyboardF13`: `kHIDUsage_KeyboardF13` = 0x68; `kHIDUsage_KeyboardF14`: `kHIDUsage_KeyboardF14` = 0x69; `kHIDUsage_KeyboardF15`: `kHIDUsage_KeyboardF15` = 0x6a; `kHIDUsage_KeyboardF16`: `kHIDUsage_KeyboardF16` = 0x6b; `kHIDUsage_KeyboardF17`: `kHIDUsage_KeyboardF17` = 0x6c; `kHIDUsage_KeyboardF18`: `kHIDUsage_KeyboardF18` = 0x6d; `kHIDUsage_KeyboardF19`: `kHIDUsage_KeyboardF19` = 0x6e; `kHIDUsage_KeyboardF2`: `kHIDUsage_KeyboardF2` = 0x3b; `kHIDUsage_KeyboardF20`: `kHIDUsage_KeyboardF20` = 0x6f; `kHIDUsage_KeyboardF21`: `kHIDUsage_KeyboardF21` = 0x70; `kHIDUsage_KeyboardF22`: `kHIDUsage_KeyboardF22` = 0x71; `kHIDUsage_KeyboardF23`: `kHIDUsage_KeyboardF23` = 0x72; `kHIDUsage_KeyboardF24`: `kHIDUsage_KeyboardF24` = 0x73; `kHIDUsage_KeyboardF3`: `kHIDUsage_KeyboardF3` = 0x3c; `kHIDUsage_KeyboardF4`: `kHIDUsage_KeyboardF4` = 0x3d; `kHIDUsage_KeyboardF5`: `kHIDUsage_KeyboardF5` = 0x3e; `kHIDUsage_KeyboardF6`: `kHIDUsage_KeyboardF6` = 0x3f; `kHIDUsage_KeyboardF7`: `kHIDUsage_KeyboardF7` = 0x40; `kHIDUsage_KeyboardF8`: `kHIDUsage_KeyboardF8` = 0x41; `kHIDUsage_KeyboardF9`: `kHIDUsage_KeyboardF9` = 0x42; `kHIDUsage_KeyboardFind`: `kHIDUsage_KeyboardFind` = 0x7e; `kHIDUsage_KeyboardG`: `kHIDUsage_KeyboardG` = 0x0a; `kHIDUsage_KeyboardGraveAccentAndTilde`: `kHIDUsage_KeyboardGraveAccentAndTilde` = 0x35; `kHIDUsage_KeyboardH`: `kHIDUsage_KeyboardH` = 0x0b; `kHIDUsage_KeyboardHelp`: `kHIDUsage_KeyboardHelp` = 0x75; `kHIDUsage_KeyboardHome`: `kHIDUsage_KeyboardHome` = 0x4a; `kHIDUsage_KeyboardHyphen`: `kHIDUsage_KeyboardHyphen` = 0x2d; `kHIDUsage_KeyboardI`: `kHIDUsage_KeyboardI` = 0x0c; `kHIDUsage_KeyboardInsert`: `kHIDUsage_KeyboardInsert` = 0x49; `kHIDUsage_KeyboardInternational1`: `kHIDUsage_KeyboardInternational1` = 0x87; `kHIDUsage_KeyboardInternational2`: `kHIDUsage_KeyboardInternational2` = 0x88; `kHIDUsage_KeyboardInternational3`: `kHIDUsage_KeyboardInternational3` = 0x89; `kHIDUsage_KeyboardInternational4`: `kHIDUsage_KeyboardInternational4` = 0x8a; `kHIDUsage_KeyboardInternational5`: `kHIDUsage_KeyboardInternational5` = 0x8b; `kHIDUsage_KeyboardInternational6`: `kHIDUsage_KeyboardInternational6` = 0x8c; `kHIDUsage_KeyboardInternational7`: `kHIDUsage_KeyboardInternational7` = 0x8d; `kHIDUsage_KeyboardInternational8`: `kHIDUsage_KeyboardInternational8` = 0x8e; `kHIDUsage_KeyboardInternational9`: `kHIDUsage_KeyboardInternational9` = 0x8f; `kHIDUsage_KeyboardJ`: `kHIDUsage_KeyboardJ` = 0x0d; `kHIDUsage_KeyboardK`: `kHIDUsage_KeyboardK` = 0x0e; `kHIDUsage_KeyboardL`: `kHIDUsage_KeyboardL` = 0x0f; `kHIDUsage_KeyboardLANG1`: `kHIDUsage_KeyboardLANG1` = 0x90; `kHIDUsage_KeyboardLANG2`: `kHIDUsage_KeyboardLANG2` = 0x91; `kHIDUsage_KeyboardLANG3`: `kHIDUsage_KeyboardLANG3` = 0x92; `kHIDUsage_KeyboardLANG4`: `kHIDUsage_KeyboardLANG4` = 0x93; `kHIDUsage_KeyboardLANG5`: `kHIDUsage_KeyboardLANG5` = 0x94; `kHIDUsage_KeyboardLANG6`: `kHIDUsage_KeyboardLANG6` = 0x95; `kHIDUsage_KeyboardLANG7`: `kHIDUsage_KeyboardLANG7` = 0x96; `kHIDUsage_KeyboardLANG8`: `kHIDUsage_KeyboardLANG8` = 0x97; `kHIDUsage_KeyboardLANG9`: `kHIDUsage_KeyboardLANG9` = 0x98; `kHIDUsage_KeyboardLeftAlt`: `kHIDUsage_KeyboardLeftAlt` = 0xe2; `kHIDUsage_KeyboardLeftArrow`: `kHIDUsage_KeyboardLeftArrow` = 0x50; `kHIDUsage_KeyboardLeftControl`: `kHIDUsage_KeyboardLeftControl` = 0xe0; `kHIDUsage_KeyboardLeftGUI`: `kHIDUsage_KeyboardLeftGUI` = 0xe3; `kHIDUsage_KeyboardLeftShift`: `kHIDUsage_KeyboardLeftShift` = 0xe1; `kHIDUsage_KeyboardLockingCapsLock`: `kHIDUsage_KeyboardLockingCapsLock` = 0x82; `kHIDUsage_KeyboardLockingNumLock`: `kHIDUsage_KeyboardLockingNumLock` = 0x83; `kHIDUsage_KeyboardLockingScrollLock`: `kHIDUsage_KeyboardLockingScrollLock` = 0x84; `kHIDUsage_KeyboardM`: `kHIDUsage_KeyboardM` = 0x10; `kHIDUsage_KeyboardMenu`: `kHIDUsage_KeyboardMenu` = 0x76; `kHIDUsage_KeyboardMute`: `kHIDUsage_KeyboardMute` = 0x7f; `kHIDUsage_KeyboardN`: `kHIDUsage_KeyboardN` = 0x11; `kHIDUsage_KeyboardNonUSBackslash`: `kHIDUsage_KeyboardNonUSBackslash` = 0x64; `kHIDUsage_KeyboardNonUSPound`: `kHIDUsage_KeyboardNonUSPound` = 0x32; `kHIDUsage_KeyboardO`: `kHIDUsage_KeyboardO` = 0x12; `kHIDUsage_KeyboardOpenBracket`: `kHIDUsage_KeyboardOpenBracket` = 0x2f; `kHIDUsage_KeyboardOper`: `kHIDUsage_KeyboardOper` = 0xa1; `kHIDUsage_KeyboardOut`: `kHIDUsage_KeyboardOut` = 0xa0; `kHIDUsage_KeyboardP`: `kHIDUsage_KeyboardP` = 0x13; `kHIDUsage_KeyboardPOSTFail`: `kHIDUsage_KeyboardPOSTFail` = 0x02; `kHIDUsage_KeyboardPageDown`: `kHIDUsage_KeyboardPageDown` = 0x4e; `kHIDUsage_KeyboardPageUp`: `kHIDUsage_KeyboardPageUp` = 0x4b; `kHIDUsage_KeyboardPaste`: `kHIDUsage_KeyboardPaste` = 0x7d; `kHIDUsage_KeyboardPause`: `kHIDUsage_KeyboardPause` = 0x48; `kHIDUsage_KeyboardPeriod`: `kHIDUsage_KeyboardPeriod` = 0x37; `kHIDUsage_KeyboardPower`: `kHIDUsage_KeyboardPower` = 0x66; `kHIDUsage_KeyboardPrintScreen`: `kHIDUsage_KeyboardPrintScreen` = 0x46; `kHIDUsage_KeyboardPrior`: `kHIDUsage_KeyboardPrior` = 0x9d; `kHIDUsage_KeyboardQ`: `kHIDUsage_KeyboardQ` = 0x14; `kHIDUsage_KeyboardQuote`: `kHIDUsage_KeyboardQuote` = 0x34; `kHIDUsage_KeyboardR`: `kHIDUsage_KeyboardR` = 0x15; `kHIDUsage_KeyboardReturn`: `kHIDUsage_KeyboardReturn` = 0x9e; `kHIDUsage_KeyboardReturnOrEnter`: `kHIDUsage_KeyboardReturnOrEnter` = 0x28; `kHIDUsage_KeyboardRightAlt`: `kHIDUsage_KeyboardRightAlt` = 0xe6; `kHIDUsage_KeyboardRightArrow`: `kHIDUsage_KeyboardRightArrow` = 0x4f; `kHIDUsage_KeyboardRightControl`: `kHIDUsage_KeyboardRightControl` = 0xe4; `kHIDUsage_KeyboardRightGUI`: `kHIDUsage_KeyboardRightGUI` = 0xe7; `kHIDUsage_KeyboardRightShift`: `kHIDUsage_KeyboardRightShift` = 0xe5; `kHIDUsage_KeyboardS`: `kHIDUsage_KeyboardS` = 0x16; `kHIDUsage_KeyboardScrollLock`: `kHIDUsage_KeyboardScrollLock` = 0x47; `kHIDUsage_KeyboardSelect`: `kHIDUsage_KeyboardSelect` = 0x77; `kHIDUsage_KeyboardSemicolon`: `kHIDUsage_KeyboardSemicolon` = 0x33; `kHIDUsage_KeyboardSeparator`: `kHIDUsage_KeyboardSeparator` = 0x9f; `kHIDUsage_KeyboardSlash`: `kHIDUsage_KeyboardSlash` = 0x38; `kHIDUsage_KeyboardSpacebar`: `kHIDUsage_KeyboardSpacebar` = 0x2c; `kHIDUsage_KeyboardStop`: `kHIDUsage_KeyboardStop` = 0x78; `kHIDUsage_KeyboardSysReqOrAttention`: `kHIDUsage_KeyboardSysReqOrAttention` = 0x9a; `kHIDUsage_KeyboardT`: `kHIDUsage_KeyboardT` = 0x17; `kHIDUsage_KeyboardTab`: `kHIDUsage_KeyboardTab` = 0x2b; `kHIDUsage_KeyboardU`: `kHIDUsage_KeyboardU` = 0x18; `kHIDUsage_KeyboardUndo`: `kHIDUsage_KeyboardUndo` = 0x7a; `kHIDUsage_KeyboardUpArrow`: `kHIDUsage_KeyboardUpArrow` = 0x52; `kHIDUsage_KeyboardV`: `kHIDUsage_KeyboardV` = 0x19; `kHIDUsage_KeyboardVolumeDown`: `kHIDUsage_KeyboardVolumeDown` = 0x81; `kHIDUsage_KeyboardVolumeUp`: `kHIDUsage_KeyboardVolumeUp` = 0x80; `kHIDUsage_KeyboardW`: `kHIDUsage_KeyboardW` = 0x1a; `kHIDUsage_KeyboardX`: `kHIDUsage_KeyboardX` = 0x1b; `kHIDUsage_KeyboardY`: `kHIDUsage_KeyboardY` = 0x1c; `kHIDUsage_KeyboardZ`: `kHIDUsage_KeyboardZ` = 0x1d; `kHIDUsage_Keyboard_Reserved`: `kHIDUsage_Keyboard_Reserved` = 0xffff; `kHIDUsage_Keypad0`: `kHIDUsage_Keypad0` = 0x62; `kHIDUsage_Keypad1`: `kHIDUsage_Keypad1` = 0x59; `kHIDUsage_Keypad2`: `kHIDUsage_Keypad2` = 0x5a; `kHIDUsage_Keypad3`: `kHIDUsage_Keypad3` = 0x5b; `kHIDUsage_Keypad4`: `kHIDUsage_Keypad4` = 0x5c; `kHIDUsage_Keypad5`: `kHIDUsage_Keypad5` = 0x5d; `kHIDUsage_Keypad6`: `kHIDUsage_Keypad6` = 0x5e; `kHIDUsage_Keypad7`: `kHIDUsage_Keypad7` = 0x5f; `kHIDUsage_Keypad8`: `kHIDUsage_Keypad8` = 0x60; `kHIDUsage_Keypad9`: `kHIDUsage_Keypad9` = 0x61; `kHIDUsage_KeypadAsterisk`: `kHIDUsage_KeypadAsterisk` = 0x55; `kHIDUsage_KeypadComma`: `kHIDUsage_KeypadComma` = 0x85; `kHIDUsage_KeypadEnter`: `kHIDUsage_KeypadEnter` = 0x58; `kHIDUsage_KeypadEqualSign`: `kHIDUsage_KeypadEqualSign` = 0x67; `kHIDUsage_KeypadEqualSignAS400`: `kHIDUsage_KeypadEqualSignAS400` = 0x86; `kHIDUsage_KeypadHyphen`: `kHIDUsage_KeypadHyphen` = 0x56; `kHIDUsage_KeypadNumLock`: `kHIDUsage_KeypadNumLock` = 0x53; `kHIDUsage_KeypadPeriod`: `kHIDUsage_KeypadPeriod` = 0x63; `kHIDUsage_KeypadPlus`: `kHIDUsage_KeypadPlus` = 0x57; `kHIDUsage_KeypadSlash`: `kHIDUsage_KeypadSlash` = 0x54; `kHIDUsage_LED_BatteryLow`: `kHIDUsage_LED_BatteryLow` = 0x1d; `kHIDUsage_LED_BatteryOK`: `kHIDUsage_LED_BatteryOK` = 0x1c; `kHIDUsage_LED_BatteryOperation`: `kHIDUsage_LED_BatteryOperation` = 0x1b; `kHIDUsage_LED_Busy`: `kHIDUsage_LED_Busy` = 0x2c; `kHIDUsage_LED_CAV`: `kHIDUsage_LED_CAV` = 0x14; `kHIDUsage_LED_CLV`: `kHIDUsage_LED_CLV` = 0x15; `kHIDUsage_LED_CallPickup`: `kHIDUsage_LED_CallPickup` = 0x25; `kHIDUsage_LED_CameraOff`: `kHIDUsage_LED_CameraOff` = 0x29; `kHIDUsage_LED_CameraOn`: `kHIDUsage_LED_CameraOn` = 0x28; `kHIDUsage_LED_CapsLock`: `kHIDUsage_LED_CapsLock` = 0x02; `kHIDUsage_LED_Compose`: `kHIDUsage_LED_Compose` = 0x04; `kHIDUsage_LED_Conference`: `kHIDUsage_LED_Conference` = 0x26; `kHIDUsage_LED_Coverage`: `kHIDUsage_LED_Coverage` = 0x22; `kHIDUsage_LED_DataMode`: `kHIDUsage_LED_DataMode` = 0x1a; `kHIDUsage_LED_DoNotDisturb`: `kHIDUsage_LED_DoNotDisturb` = 0x08; `kHIDUsage_LED_EqualizerEnable`: `kHIDUsage_LED_EqualizerEnable` = 0x0d; `kHIDUsage_LED_Error`: `kHIDUsage_LED_Error` = 0x39; `kHIDUsage_LED_ExternalPowerConnected`: `kHIDUsage_LED_ExternalPowerConnected` = 0x4d; `kHIDUsage_LED_FastBlinkOffTime`: `kHIDUsage_LED_FastBlinkOffTime` = 0x46; `kHIDUsage_LED_FastBlinkOnTime`: `kHIDUsage_LED_FastBlinkOnTime` = 0x45; `kHIDUsage_LED_FastForward`: `kHIDUsage_LED_FastForward` = 0x35; `kHIDUsage_LED_FlashOnTime`: `kHIDUsage_LED_FlashOnTime` = 0x42; `kHIDUsage_LED_Forward`: `kHIDUsage_LED_Forward` = 0x31; `kHIDUsage_LED_GenericIndicator`: `kHIDUsage_LED_GenericIndicator` = 0x4b; `kHIDUsage_LED_HeadSet`: `kHIDUsage_LED_HeadSet` = 0x1f; `kHIDUsage_LED_HighCutFilter`: `kHIDUsage_LED_HighCutFilter` = 0x0b; `kHIDUsage_LED_Hold`: `kHIDUsage_LED_Hold` = 0x20; `kHIDUsage_LED_IndicatorAmber`: `kHIDUsage_LED_IndicatorAmber` = 0x4a; `kHIDUsage_LED_IndicatorFastBlink`: `kHIDUsage_LED_IndicatorFastBlink` = 0x40; `kHIDUsage_LED_IndicatorFlash`: `kHIDUsage_LED_IndicatorFlash` = 0x3e; `kHIDUsage_LED_IndicatorGreen`: `kHIDUsage_LED_IndicatorGreen` = 0x49; `kHIDUsage_LED_IndicatorOff`: `kHIDUsage_LED_IndicatorOff` = 0x41; `kHIDUsage_LED_IndicatorOn`: `kHIDUsage_LED_IndicatorOn` = 0x3d; `kHIDUsage_LED_IndicatorRed`: `kHIDUsage_LED_IndicatorRed` = 0x48; `kHIDUsage_LED_IndicatorSlowBlink`: `kHIDUsage_LED_IndicatorSlowBlink` = 0x3f; `kHIDUsage_LED_Kana`: `kHIDUsage_LED_Kana` = 0x05; `kHIDUsage_LED_LowCutFilter`: `kHIDUsage_LED_LowCutFilter` = 0x0c; `kHIDUsage_LED_MessageWaiting`: `kHIDUsage_LED_MessageWaiting` = 0x19; `kHIDUsage_LED_Microphone`: `kHIDUsage_LED_Microphone` = 0x21; `kHIDUsage_LED_Mute`: `kHIDUsage_LED_Mute` = 0x09; `kHIDUsage_LED_NightMode`: `kHIDUsage_LED_NightMode` = 0x23; `kHIDUsage_LED_NumLock`: `kHIDUsage_LED_NumLock` = 0x01; `kHIDUsage_LED_OffHook`: `kHIDUsage_LED_OffHook` = 0x17; `kHIDUsage_LED_OffLine`: `kHIDUsage_LED_OffLine` = 0x2b; `kHIDUsage_LED_OnLine`: `kHIDUsage_LED_OnLine` = 0x2a; `kHIDUsage_LED_PaperJam`: `kHIDUsage_LED_PaperJam` = 0x2f; `kHIDUsage_LED_PaperOut`: `kHIDUsage_LED_PaperOut` = 0x2e; `kHIDUsage_LED_Pause`: `kHIDUsage_LED_Pause` = 0x37; `kHIDUsage_LED_Play`: `kHIDUsage_LED_Play` = 0x36; `kHIDUsage_LED_Power`: `kHIDUsage_LED_Power` = 0x06; `kHIDUsage_LED_Ready`: `kHIDUsage_LED_Ready` = 0x2d; `kHIDUsage_LED_Record`: `kHIDUsage_LED_Record` = 0x38; `kHIDUsage_LED_RecordingFormatDetect`: `kHIDUsage_LED_RecordingFormatDetect` = 0x16; `kHIDUsage_LED_Remote`: `kHIDUsage_LED_Remote` = 0x30; `kHIDUsage_LED_Repeat`: `kHIDUsage_LED_Repeat` = 0x10; `kHIDUsage_LED_Reserved`: `kHIDUsage_LED_Reserved` = 0xffff; `kHIDUsage_LED_Reverse`: `kHIDUsage_LED_Reverse` = 0x32; `kHIDUsage_LED_Rewind`: `kHIDUsage_LED_Rewind` = 0x34; `kHIDUsage_LED_Ring`: `kHIDUsage_LED_Ring` = 0x18; `kHIDUsage_LED_SamplingRateDetect`: `kHIDUsage_LED_SamplingRateDetect` = 0x12; `kHIDUsage_LED_ScrollLock`: `kHIDUsage_LED_ScrollLock` = 0x03; `kHIDUsage_LED_SendCalls`: `kHIDUsage_LED_SendCalls` = 0x24; `kHIDUsage_LED_Shift`: `kHIDUsage_LED_Shift` = 0x07; `kHIDUsage_LED_SlowBlinkOffTime`: `kHIDUsage_LED_SlowBlinkOffTime` = 0x44; `kHIDUsage_LED_SlowBlinkOnTime`: `kHIDUsage_LED_SlowBlinkOnTime` = 0x43; `kHIDUsage_LED_SoundFieldOn`: `kHIDUsage_LED_SoundFieldOn` = 0x0e; `kHIDUsage_LED_Speaker`: `kHIDUsage_LED_Speaker` = 0x1e; `kHIDUsage_LED_Spinning`: `kHIDUsage_LED_Spinning` = 0x13; `kHIDUsage_LED_StandBy`: `kHIDUsage_LED_StandBy` = 0x27; `kHIDUsage_LED_Stereo`: `kHIDUsage_LED_Stereo` = 0x11; `kHIDUsage_LED_Stop`: `kHIDUsage_LED_Stop` = 0x33; `kHIDUsage_LED_SurroundOn`: `kHIDUsage_LED_SurroundOn` = 0x0f; `kHIDUsage_LED_SystemSuspend`: `kHIDUsage_LED_SystemSuspend` = 0x4c; `kHIDUsage_LED_ToneEnable`: `kHIDUsage_LED_ToneEnable` = 0x0a; `kHIDUsage_LED_Usage`: `kHIDUsage_LED_Usage` = 0x3a; `kHIDUsage_LED_UsageInUseIndicator`: `kHIDUsage_LED_UsageInUseIndicator` = 0x3b; `kHIDUsage_LED_UsageIndicatorColor`: `kHIDUsage_LED_UsageIndicatorColor` = 0x47; `kHIDUsage_LED_UsageMultiModeIndicator`: `kHIDUsage_LED_UsageMultiModeIndicator` = 0x3c; `kHIDUsage_MSR_DeviceReadOnly`: `kHIDUsage_MSR_DeviceReadOnly` = 0x01; `kHIDUsage_MSR_Track1Data`: `kHIDUsage_MSR_Track1Data` = 0x21; `kHIDUsage_MSR_Track1Length`: `kHIDUsage_MSR_Track1Length` = 0x11; `kHIDUsage_MSR_Track2Data`: `kHIDUsage_MSR_Track2Data` = 0x22; `kHIDUsage_MSR_Track2Length`: `kHIDUsage_MSR_Track2Length` = 0x12; `kHIDUsage_MSR_Track3Data`: `kHIDUsage_MSR_Track3Data` = 0x23; `kHIDUsage_MSR_Track3Length`: `kHIDUsage_MSR_Track3Length` = 0x13; `kHIDUsage_MSR_TrackData`: `kHIDUsage_MSR_TrackData` = 0x20; `kHIDUsage_MSR_TrackJISData`: `kHIDUsage_MSR_TrackJISData` = 0x24; `kHIDUsage_MSR_TrackJISLength`: `kHIDUsage_MSR_TrackJISLength` = 0x14; `kHIDUsage_MSR_Undefined`: `kHIDUsage_MSR_Undefined` = 0x00; `kHIDUsage_Ord_Instance1`: `kHIDUsage_Ord_Instance1` = 0x01; `kHIDUsage_Ord_Instance2`: `kHIDUsage_Ord_Instance2` = 0x02; `kHIDUsage_Ord_Instance3`: `kHIDUsage_Ord_Instance3` = 0x03; `kHIDUsage_Ord_Instance4`: `kHIDUsage_Ord_Instance4` = 0x04; `kHIDUsage_Ord_Instance65535`: `kHIDUsage_Ord_Instance65535` = 0xffff; `kHIDUsage_PD_ActivePower`: `kHIDUsage_PD_ActivePower` = 0x34; `kHIDUsage_PD_ApparentPower`: `kHIDUsage_PD_ApparentPower` = 0x33; `kHIDUsage_PD_AudibleAlarmControl`: `kHIDUsage_PD_AudibleAlarmControl` = 0x5a; `kHIDUsage_PD_AwaitingPower`: `kHIDUsage_PD_AwaitingPower` = 0x72; `kHIDUsage_PD_BadCount`: `kHIDUsage_PD_BadCount` = 0x38; `kHIDUsage_PD_Battery`: `kHIDUsage_PD_Battery` = 0x12; `kHIDUsage_PD_BatteryID`: `kHIDUsage_PD_BatteryID` = 0x13; `kHIDUsage_PD_BatterySystem`: `kHIDUsage_PD_BatterySystem` = 0x10; `kHIDUsage_PD_BatterySystemID`: `kHIDUsage_PD_BatterySystemID` = 0x11; `kHIDUsage_PD_Boost`: `kHIDUsage_PD_Boost` = 0x6e; `kHIDUsage_PD_Buck`: `kHIDUsage_PD_Buck` = 0x6f; `kHIDUsage_PD_ChangedStatus`: `kHIDUsage_PD_ChangedStatus` = 0x03; `kHIDUsage_PD_Charger`: `kHIDUsage_PD_Charger` = 0x14; `kHIDUsage_PD_ChargerID`: `kHIDUsage_PD_ChargerID` = 0x15; `kHIDUsage_PD_CommunicationLost`: `kHIDUsage_PD_CommunicationLost` = 0x73; `kHIDUsage_PD_ConfigActivePower`: `kHIDUsage_PD_ConfigActivePower` = 0x44; `kHIDUsage_PD_ConfigApparentPower`: `kHIDUsage_PD_ConfigApparentPower` = 0x43; `kHIDUsage_PD_ConfigCurrent`: `kHIDUsage_PD_ConfigCurrent` = 0x41; `kHIDUsage_PD_ConfigFrequency`: `kHIDUsage_PD_ConfigFrequency` = 0x42; `kHIDUsage_PD_ConfigHumidity`: `kHIDUsage_PD_ConfigHumidity` = 0x47; `kHIDUsage_PD_ConfigPercentLoad`: `kHIDUsage_PD_ConfigPercentLoad` = 0x45; `kHIDUsage_PD_ConfigTemperature`: `kHIDUsage_PD_ConfigTemperature` = 0x46; `kHIDUsage_PD_ConfigVoltage`: `kHIDUsage_PD_ConfigVoltage` = 0x40; `kHIDUsage_PD_Current`: `kHIDUsage_PD_Current` = 0x31; `kHIDUsage_PD_DelayBeforeReboot`: `kHIDUsage_PD_DelayBeforeReboot` = 0x55; `kHIDUsage_PD_DelayBeforeShutdown`: `kHIDUsage_PD_DelayBeforeShutdown` = 0x57; `kHIDUsage_PD_DelayBeforeStartup`: `kHIDUsage_PD_DelayBeforeStartup` = 0x56; `kHIDUsage_PD_Flow`: `kHIDUsage_PD_Flow` = 0x1e; `kHIDUsage_PD_FlowID`: `kHIDUsage_PD_FlowID` = 0x1f; `kHIDUsage_PD_Frequency`: `kHIDUsage_PD_Frequency` = 0x32; `kHIDUsage_PD_FrequencyOutOfRange`: `kHIDUsage_PD_FrequencyOutOfRange` = 0x64; `kHIDUsage_PD_Gang`: `kHIDUsage_PD_Gang` = 0x22; `kHIDUsage_PD_GangID`: `kHIDUsage_PD_GangID` = 0x23; `kHIDUsage_PD_Good`: `kHIDUsage_PD_Good` = 0x61; `kHIDUsage_PD_HighVoltageTransfer`: `kHIDUsage_PD_HighVoltageTransfer` = 0x54; `kHIDUsage_PD_Humidity`: `kHIDUsage_PD_Humidity` = 0x37; `kHIDUsage_PD_Initialized`: `kHIDUsage_PD_Initialized` = 0x70; `kHIDUsage_PD_Input`: `kHIDUsage_PD_Input` = 0x1a; `kHIDUsage_PD_InputID`: `kHIDUsage_PD_InputID` = 0x1b; `kHIDUsage_PD_InternalFailure`: `kHIDUsage_PD_InternalFailure` = 0x62; `kHIDUsage_PD_LowVoltageTransfer`: `kHIDUsage_PD_LowVoltageTransfer` = 0x53; `kHIDUsage_PD_ModuleReset`: `kHIDUsage_PD_ModuleReset` = 0x59; `kHIDUsage_PD_Outlet`: `kHIDUsage_PD_Outlet` = 0x20; `kHIDUsage_PD_OutletID`: `kHIDUsage_PD_OutletID` = 0x21; `kHIDUsage_PD_OutletSystem`: `kHIDUsage_PD_OutletSystem` = 0x18; `kHIDUsage_PD_OutletSystemID`: `kHIDUsage_PD_OutletSystemID` = 0x19; `kHIDUsage_PD_Output`: `kHIDUsage_PD_Output` = 0x1c; `kHIDUsage_PD_OutputID`: `kHIDUsage_PD_OutputID` = 0x1d; `kHIDUsage_PD_OverCharged`: `kHIDUsage_PD_OverCharged` = 0x66; `kHIDUsage_PD_OverTemperature`: `kHIDUsage_PD_OverTemperature` = 0x67; `kHIDUsage_PD_Overload`: `kHIDUsage_PD_Overload` = 0x65; `kHIDUsage_PD_PercentLoad`: `kHIDUsage_PD_PercentLoad` = 0x35; `kHIDUsage_PD_PowerConverter`: `kHIDUsage_PD_PowerConverter` = 0x16; `kHIDUsage_PD_PowerConverterID`: `kHIDUsage_PD_PowerConverterID` = 0x17; `kHIDUsage_PD_PowerSummary`: `kHIDUsage_PD_PowerSummary` = 0x24; `kHIDUsage_PD_PowerSummaryID`: `kHIDUsage_PD_PowerSummaryID` = 0x25; `kHIDUsage_PD_PowerSupply`: `kHIDUsage_PD_PowerSupply` = 0x05; `kHIDUsage_PD_Present`: `kHIDUsage_PD_Present` = 0x60; `kHIDUsage_PD_PresentStatus`: `kHIDUsage_PD_PresentStatus` = 0x02; `kHIDUsage_PD_ShutdownImminent`: `kHIDUsage_PD_ShutdownImminent` = 0x69; `kHIDUsage_PD_ShutdownRequested`: `kHIDUsage_PD_ShutdownRequested` = 0x68; `kHIDUsage_PD_SwitchOffControl`: `kHIDUsage_PD_SwitchOffControl` = 0x51; `kHIDUsage_PD_SwitchOnControl`: `kHIDUsage_PD_SwitchOnControl` = 0x50; `kHIDUsage_PD_SwitchOnOff`: `kHIDUsage_PD_SwitchOnOff` = 0x6b; `kHIDUsage_PD_Switchable`: `kHIDUsage_PD_Switchable` = 0x6c; `kHIDUsage_PD_Temperature`: `kHIDUsage_PD_Temperature` = 0x36; `kHIDUsage_PD_Test`: `kHIDUsage_PD_Test` = 0x58; `kHIDUsage_PD_Tested`: `kHIDUsage_PD_Tested` = 0x71; `kHIDUsage_PD_ToggleControl`: `kHIDUsage_PD_ToggleControl` = 0x52; `kHIDUsage_PD_UPS`: `kHIDUsage_PD_UPS` = 0x04; `kHIDUsage_PD_Undefined`: `kHIDUsage_PD_Undefined` = 0x00; `kHIDUsage_PD_Used`: `kHIDUsage_PD_Used` = 0x6d; `kHIDUsage_PD_Voltage`: `kHIDUsage_PD_Voltage` = 0x30; `kHIDUsage_PD_VoltageOutOfRange`: `kHIDUsage_PD_VoltageOutOfRange` = 0x63; `kHIDUsage_PD_iManufacturer`: `kHIDUsage_PD_iManufacturer` = 0xfd; `kHIDUsage_PD_iName`: `kHIDUsage_PD_iName` = 0x01; `kHIDUsage_PD_iProduct`: `kHIDUsage_PD_iProduct` = 0xfe; `kHIDUsage_PD_iserialNumber`: `kHIDUsage_PD_iserialNumber` = 0xff; `kHIDUsage_PID_ActuatorOverrideSwitch`: `kHIDUsage_PID_ActuatorOverrideSwitch` = 0xa5; `kHIDUsage_PID_ActuatorPower`: `kHIDUsage_PID_ActuatorPower` = 0xa6; `kHIDUsage_PID_ActuatorsEnabled`: `kHIDUsage_PID_ActuatorsEnabled` = 0xa0; `kHIDUsage_PID_AttackLevel`: `kHIDUsage_PID_AttackLevel` = 0x5b; `kHIDUsage_PID_AttackTime`: `kHIDUsage_PID_AttackTime` = 0x5c; `kHIDUsage_PID_AxesEnable`: `kHIDUsage_PID_AxesEnable` = 0x55; `kHIDUsage_PID_BlockFreeReport`: `kHIDUsage_PID_BlockFreeReport` = 0x90; `kHIDUsage_PID_BlockHandle`: `kHIDUsage_PID_BlockHandle` = 0x8f; `kHIDUsage_PID_BlockLoadError`: `kHIDUsage_PID_BlockLoadError` = 0x8e; `kHIDUsage_PID_BlockLoadFull`: `kHIDUsage_PID_BlockLoadFull` = 0x8d; `kHIDUsage_PID_BlockLoadReport`: `kHIDUsage_PID_BlockLoadReport` = 0x89; `kHIDUsage_PID_BlockLoadStatus`: `kHIDUsage_PID_BlockLoadStatus` = 0x8b; `kHIDUsage_PID_BlockLoadSuccess`: `kHIDUsage_PID_BlockLoadSuccess` = 0x8c; `kHIDUsage_PID_BlockType`: `kHIDUsage_PID_BlockType` = 0x59; `kHIDUsage_PID_CP_Offset`: `kHIDUsage_PID_CP_Offset` = 0x60; `kHIDUsage_PID_CreateNewEffectReport`: `kHIDUsage_PID_CreateNewEffectReport` = 0xab; `kHIDUsage_PID_CustomForceData`: `kHIDUsage_PID_CustomForceData` = 0x69; `kHIDUsage_PID_CustomForceDataOffset`: `kHIDUsage_PID_CustomForceDataOffset` = 0x6c; `kHIDUsage_PID_CustomForceDataReport`: `kHIDUsage_PID_CustomForceDataReport` = 0x68; `kHIDUsage_PID_CustomForceVendorDefinedData`: `kHIDUsage_PID_CustomForceVendorDefinedData` = 0x6a; `kHIDUsage_PID_DC_DeviceContinue`: `kHIDUsage_PID_DC_DeviceContinue` = 0x9c; `kHIDUsage_PID_DC_DevicePause`: `kHIDUsage_PID_DC_DevicePause` = 0x9b; `kHIDUsage_PID_DC_DeviceReset`: `kHIDUsage_PID_DC_DeviceReset` = 0x9a; `kHIDUsage_PID_DC_DisableActuators`: `kHIDUsage_PID_DC_DisableActuators` = 0x98; `kHIDUsage_PID_DC_EnableActuators`: `kHIDUsage_PID_DC_EnableActuators` = 0x97; `kHIDUsage_PID_DC_StopAllEffects`: `kHIDUsage_PID_DC_StopAllEffects` = 0x99; `kHIDUsage_PID_DeadBand`: `kHIDUsage_PID_DeadBand` = 0x65; `kHIDUsage_PID_DeviceControl`: `kHIDUsage_PID_DeviceControl` = 0x96; `kHIDUsage_PID_DeviceControlReport`: `kHIDUsage_PID_DeviceControlReport` = 0x95; `kHIDUsage_PID_DeviceGain`: `kHIDUsage_PID_DeviceGain` = 0x7e; `kHIDUsage_PID_DeviceGainReport`: `kHIDUsage_PID_DeviceGainReport` = 0x7d; `kHIDUsage_PID_DeviceManagedPool`: `kHIDUsage_PID_DeviceManagedPool` = 0xa9; `kHIDUsage_PID_DevicePaused`: `kHIDUsage_PID_DevicePaused` = 0x9f; `kHIDUsage_PID_Direction`: `kHIDUsage_PID_Direction` = 0x57; `kHIDUsage_PID_DirectionEnable`: `kHIDUsage_PID_DirectionEnable` = 0x56; `kHIDUsage_PID_DownloadForceSample`: `kHIDUsage_PID_DownloadForceSample` = 0x66; `kHIDUsage_PID_Duration`: `kHIDUsage_PID_Duration` = 0x50; `kHIDUsage_PID_ET_ConstantForce`: `kHIDUsage_PID_ET_ConstantForce` = 0x26; `kHIDUsage_PID_ET_CustomForceData`: `kHIDUsage_PID_ET_CustomForceData` = 0x28; `kHIDUsage_PID_ET_Damper`: `kHIDUsage_PID_ET_Damper` = 0x41; `kHIDUsage_PID_ET_Friction`: `kHIDUsage_PID_ET_Friction` = 0x43; `kHIDUsage_PID_ET_Inertia`: `kHIDUsage_PID_ET_Inertia` = 0x42; `kHIDUsage_PID_ET_Ramp`: `kHIDUsage_PID_ET_Ramp` = 0x27; `kHIDUsage_PID_ET_SawtoothDown`: `kHIDUsage_PID_ET_SawtoothDown` = 0x34; `kHIDUsage_PID_ET_SawtoothUp`: `kHIDUsage_PID_ET_SawtoothUp` = 0x33; `kHIDUsage_PID_ET_Sine`: `kHIDUsage_PID_ET_Sine` = 0x31; `kHIDUsage_PID_ET_Spring`: `kHIDUsage_PID_ET_Spring` = 0x40; `kHIDUsage_PID_ET_Square`: `kHIDUsage_PID_ET_Square` = 0x30; `kHIDUsage_PID_ET_Triangle`: `kHIDUsage_PID_ET_Triangle` = 0x32; `kHIDUsage_PID_EffectBlockIndex`: `kHIDUsage_PID_EffectBlockIndex` = 0x22; `kHIDUsage_PID_EffectOperation`: `kHIDUsage_PID_EffectOperation` = 0x78; `kHIDUsage_PID_EffectOperationReport`: `kHIDUsage_PID_EffectOperationReport` = 0x77; `kHIDUsage_PID_EffectPlaying`: `kHIDUsage_PID_EffectPlaying` = 0x94; `kHIDUsage_PID_EffectType`: `kHIDUsage_PID_EffectType` = 0x25; `kHIDUsage_PID_FadeLevel`: `kHIDUsage_PID_FadeLevel` = 0x5d; `kHIDUsage_PID_FadeTime`: `kHIDUsage_PID_FadeTime` = 0x5e; `kHIDUsage_PID_Gain`: `kHIDUsage_PID_Gain` = 0x52; `kHIDUsage_PID_IsochCustomForceEnable`: `kHIDUsage_PID_IsochCustomForceEnable` = 0x67; `kHIDUsage_PID_LoopCount`: `kHIDUsage_PID_LoopCount` = 0x7c; `kHIDUsage_PID_Magnitude`: `kHIDUsage_PID_Magnitude` = 0x70; `kHIDUsage_PID_MoveDestination`: `kHIDUsage_PID_MoveDestination` = 0x87; `kHIDUsage_PID_MoveLength`: `kHIDUsage_PID_MoveLength` = 0x88; `kHIDUsage_PID_MoveSource`: `kHIDUsage_PID_MoveSource` = 0x86; `kHIDUsage_PID_NegativeCoefficient`: `kHIDUsage_PID_NegativeCoefficient` = 0x62; `kHIDUsage_PID_NegativeSaturation`: `kHIDUsage_PID_NegativeSaturation` = 0x64; `kHIDUsage_PID_Normal`: `kHIDUsage_PID_Normal` = 0x20; `kHIDUsage_PID_Offset`: `kHIDUsage_PID_Offset` = 0x6f; `kHIDUsage_PID_OpEffectStart`: `kHIDUsage_PID_OpEffectStart` = 0x79; `kHIDUsage_PID_OpEffectStartSolo`: `kHIDUsage_PID_OpEffectStartSolo` = 0x7a; `kHIDUsage_PID_OpEffectStop`: `kHIDUsage_PID_OpEffectStop` = 0x7b; `kHIDUsage_PID_ParamBlockOffset`: `kHIDUsage_PID_ParamBlockOffset` = 0x23; `kHIDUsage_PID_ParameterBlockSize`: `kHIDUsage_PID_ParameterBlockSize` = 0xa8; `kHIDUsage_PID_Period`: `kHIDUsage_PID_Period` = 0x72; `kHIDUsage_PID_Phase`: `kHIDUsage_PID_Phase` = 0x71; `kHIDUsage_PID_PhysicalInterfaceDevice`: `kHIDUsage_PID_PhysicalInterfaceDevice` = 0x01; `kHIDUsage_PID_PoolAlignment`: `kHIDUsage_PID_PoolAlignment` = 0x84; `kHIDUsage_PID_PoolMoveReport`: `kHIDUsage_PID_PoolMoveReport` = 0x85; `kHIDUsage_PID_PoolReport`: `kHIDUsage_PID_PoolReport` = 0x7f; `kHIDUsage_PID_PositiveCoefficient`: `kHIDUsage_PID_PositiveCoefficient` = 0x61; `kHIDUsage_PID_PositiveSaturation`: `kHIDUsage_PID_PositiveSaturation` = 0x63; `kHIDUsage_PID_RAM_PoolAvailable`: `kHIDUsage_PID_RAM_PoolAvailable` = 0xac; `kHIDUsage_PID_RAM_PoolSize`: `kHIDUsage_PID_RAM_PoolSize` = 0x80; `kHIDUsage_PID_ROM_EffectBlockCount`: `kHIDUsage_PID_ROM_EffectBlockCount` = 0x82; `kHIDUsage_PID_ROM_Flag`: `kHIDUsage_PID_ROM_Flag` = 0x24; `kHIDUsage_PID_ROM_PoolSize`: `kHIDUsage_PID_ROM_PoolSize` = 0x81; `kHIDUsage_PID_RampEnd`: `kHIDUsage_PID_RampEnd` = 0x76; `kHIDUsage_PID_RampStart`: `kHIDUsage_PID_RampStart` = 0x75; `kHIDUsage_PID_Reserved`: `kHIDUsage_PID_Reserved` = 0xffff; `kHIDUsage_PID_SafetySwitch`: `kHIDUsage_PID_SafetySwitch` = 0xa4; `kHIDUsage_PID_SampleCount`: `kHIDUsage_PID_SampleCount` = 0x6d; `kHIDUsage_PID_SamplePeriod`: `kHIDUsage_PID_SamplePeriod` = 0x51; `kHIDUsage_PID_SetConditionReport`: `kHIDUsage_PID_SetConditionReport` = 0x5f; `kHIDUsage_PID_SetConstantForceReport`: `kHIDUsage_PID_SetConstantForceReport` = 0x73; `kHIDUsage_PID_SetCustomForceReport`: `kHIDUsage_PID_SetCustomForceReport` = 0x6b; `kHIDUsage_PID_SetEffectReport`: `kHIDUsage_PID_SetEffectReport` = 0x21; `kHIDUsage_PID_SetEnvelopeReport`: `kHIDUsage_PID_SetEnvelopeReport` = 0x5a; `kHIDUsage_PID_SetPeriodicReport`: `kHIDUsage_PID_SetPeriodicReport` = 0x6e; `kHIDUsage_PID_SetRampForceReport`: `kHIDUsage_PID_SetRampForceReport` = 0x74; `kHIDUsage_PID_SharedParameterBlocks`: `kHIDUsage_PID_SharedParameterBlocks` = 0xaa; `kHIDUsage_PID_SimultaneousEffectsMax`: `kHIDUsage_PID_SimultaneousEffectsMax` = 0x83; `kHIDUsage_PID_StartDelay`: `kHIDUsage_PID_StartDelay` = 0xa7; `kHIDUsage_PID_StateReport`: `kHIDUsage_PID_StateReport` = 0x92; `kHIDUsage_PID_TriggerButton`: `kHIDUsage_PID_TriggerButton` = 0x53; `kHIDUsage_PID_TriggerRepeatInterval`: `kHIDUsage_PID_TriggerRepeatInterval` = 0x54; `kHIDUsage_PID_TypeSpecificBlockHandle`: `kHIDUsage_PID_TypeSpecificBlockHandle` = 0x91; `kHIDUsage_PID_TypeSpecificBlockOffset`: `kHIDUsage_PID_TypeSpecificBlockOffset` = 0x58; `kHIDUsage_Sim_Accelerator`: `kHIDUsage_Sim_Accelerator` = 0xc4; `kHIDUsage_Sim_Aileron`: `kHIDUsage_Sim_Aileron` = 0xb0; `kHIDUsage_Sim_AileronTrim`: `kHIDUsage_Sim_AileronTrim` = 0xb1; `kHIDUsage_Sim_AirplaneSimulationDevice`: `kHIDUsage_Sim_AirplaneSimulationDevice` = 0x09; `kHIDUsage_Sim_AntiTorqueControl`: `kHIDUsage_Sim_AntiTorqueControl` = 0xb2; `kHIDUsage_Sim_AutomobileSimulationDevice`: `kHIDUsage_Sim_AutomobileSimulationDevice` = 0x02; `kHIDUsage_Sim_AutopilotEnable`: `kHIDUsage_Sim_AutopilotEnable` = 0xb3; `kHIDUsage_Sim_Ballast`: `kHIDUsage_Sim_Ballast` = 0xcc; `kHIDUsage_Sim_BarrelElevation`: `kHIDUsage_Sim_BarrelElevation` = 0xca; `kHIDUsage_Sim_BicycleCrank`: `kHIDUsage_Sim_BicycleCrank` = 0xcd; `kHIDUsage_Sim_BicycleSimulationDevice`: `kHIDUsage_Sim_BicycleSimulationDevice` = 0x0c; `kHIDUsage_Sim_Brake`: `kHIDUsage_Sim_Brake` = 0xc5; `kHIDUsage_Sim_ChaffRelease`: `kHIDUsage_Sim_ChaffRelease` = 0xb4; `kHIDUsage_Sim_Clutch`: `kHIDUsage_Sim_Clutch` = 0xc6; `kHIDUsage_Sim_CollectiveControl`: `kHIDUsage_Sim_CollectiveControl` = 0xb5; `kHIDUsage_Sim_CyclicControl`: `kHIDUsage_Sim_CyclicControl` = 0x22; `kHIDUsage_Sim_CyclicTrim`: `kHIDUsage_Sim_CyclicTrim` = 0x23; `kHIDUsage_Sim_DiveBrake`: `kHIDUsage_Sim_DiveBrake` = 0xb6; `kHIDUsage_Sim_DivePlane`: `kHIDUsage_Sim_DivePlane` = 0xcb; `kHIDUsage_Sim_ElectronicCountermeasures`: `kHIDUsage_Sim_ElectronicCountermeasures` = 0xb7; `kHIDUsage_Sim_Elevator`: `kHIDUsage_Sim_Elevator` = 0xb8; `kHIDUsage_Sim_ElevatorTrim`: `kHIDUsage_Sim_ElevatorTrim` = 0xb9; `kHIDUsage_Sim_FlareRelease`: `kHIDUsage_Sim_FlareRelease` = 0xbd; `kHIDUsage_Sim_FlightCommunications`: `kHIDUsage_Sim_FlightCommunications` = 0xbc; `kHIDUsage_Sim_FlightControlStick`: `kHIDUsage_Sim_FlightControlStick` = 0x20; `kHIDUsage_Sim_FlightSimulationDevice`: `kHIDUsage_Sim_FlightSimulationDevice` = 0x01; `kHIDUsage_Sim_FlightStick`: `kHIDUsage_Sim_FlightStick` = 0x21; `kHIDUsage_Sim_FlightYoke`: `kHIDUsage_Sim_FlightYoke` = 0x24; `kHIDUsage_Sim_FrontBrake`: `kHIDUsage_Sim_FrontBrake` = 0xcf; `kHIDUsage_Sim_HandleBars`: `kHIDUsage_Sim_HandleBars` = 0xce; `kHIDUsage_Sim_HelicopterSimulationDevice`: `kHIDUsage_Sim_HelicopterSimulationDevice` = 0x0a; `kHIDUsage_Sim_LandingGear`: `kHIDUsage_Sim_LandingGear` = 0xbe; `kHIDUsage_Sim_MagicCarpetSimulationDevice`: `kHIDUsage_Sim_MagicCarpetSimulationDevice` = 0x0b; `kHIDUsage_Sim_MotorcycleSimulationDevice`: `kHIDUsage_Sim_MotorcycleSimulationDevice` = 0x07; `kHIDUsage_Sim_RearBrake`: `kHIDUsage_Sim_RearBrake` = 0xd0; `kHIDUsage_Sim_Reserved`: `kHIDUsage_Sim_Reserved` = 0xffff; `kHIDUsage_Sim_Rudder`: `kHIDUsage_Sim_Rudder` = 0xba; `kHIDUsage_Sim_SailingSimulationDevice`: `kHIDUsage_Sim_SailingSimulationDevice` = 0x06; `kHIDUsage_Sim_Shifter`: `kHIDUsage_Sim_Shifter` = 0xc7; `kHIDUsage_Sim_SpaceshipSimulationDevice`: `kHIDUsage_Sim_SpaceshipSimulationDevice` = 0x04; `kHIDUsage_Sim_SportsSimulationDevice`: `kHIDUsage_Sim_SportsSimulationDevice` = 0x08; `kHIDUsage_Sim_Steering`: `kHIDUsage_Sim_Steering` = 0xc8; `kHIDUsage_Sim_SubmarineSimulationDevice`: `kHIDUsage_Sim_SubmarineSimulationDevice` = 0x05; `kHIDUsage_Sim_TankSimulationDevice`: `kHIDUsage_Sim_TankSimulationDevice` = 0x03; `kHIDUsage_Sim_Throttle`: `kHIDUsage_Sim_Throttle` = 0xbb; `kHIDUsage_Sim_ToeBrake`: `kHIDUsage_Sim_ToeBrake` = 0xbf; `kHIDUsage_Sim_TrackControl`: `kHIDUsage_Sim_TrackControl` = 0x25; `kHIDUsage_Sim_Trigger`: `kHIDUsage_Sim_Trigger` = 0xc0; `kHIDUsage_Sim_TurretDirection`: `kHIDUsage_Sim_TurretDirection` = 0xc9; `kHIDUsage_Sim_Weapons`: `kHIDUsage_Sim_Weapons` = 0xc2; `kHIDUsage_Sim_WeaponsArm`: `kHIDUsage_Sim_WeaponsArm` = 0xc1; `kHIDUsage_Sim_WingFlaps`: `kHIDUsage_Sim_WingFlaps` = 0xc3; `kHIDUsage_Sprt_10Iron`: `kHIDUsage_Sprt_10Iron` = 0x5a; `kHIDUsage_Sprt_11Iron`: `kHIDUsage_Sprt_11Iron` = 0x5b; `kHIDUsage_Sprt_1Iron`: `kHIDUsage_Sprt_1Iron` = 0x51; `kHIDUsage_Sprt_1Wood`: `kHIDUsage_Sprt_1Wood` = 0x5f; `kHIDUsage_Sprt_2Iron`: `kHIDUsage_Sprt_2Iron` = 0x52; `kHIDUsage_Sprt_3Iron`: `kHIDUsage_Sprt_3Iron` = 0x53; `kHIDUsage_Sprt_3Wood`: `kHIDUsage_Sprt_3Wood` = 0x60; `kHIDUsage_Sprt_4Iron`: `kHIDUsage_Sprt_4Iron` = 0x54; `kHIDUsage_Sprt_5Iron`: `kHIDUsage_Sprt_5Iron` = 0x55; `kHIDUsage_Sprt_5Wood`: `kHIDUsage_Sprt_5Wood` = 0x61; `kHIDUsage_Sprt_6Iron`: `kHIDUsage_Sprt_6Iron` = 0x56; `kHIDUsage_Sprt_7Iron`: `kHIDUsage_Sprt_7Iron` = 0x57; `kHIDUsage_Sprt_7Wood`: `kHIDUsage_Sprt_7Wood` = 0x62; `kHIDUsage_Sprt_8Iron`: `kHIDUsage_Sprt_8Iron` = 0x58; `kHIDUsage_Sprt_9Iron`: `kHIDUsage_Sprt_9Iron` = 0x59; `kHIDUsage_Sprt_9Wood`: `kHIDUsage_Sprt_9Wood` = 0x63; `kHIDUsage_Sprt_BaseballBat`: `kHIDUsage_Sprt_BaseballBat` = 0x01; `kHIDUsage_Sprt_GolfClub`: `kHIDUsage_Sprt_GolfClub` = 0x02; `kHIDUsage_Sprt_LoftWedge`: `kHIDUsage_Sprt_LoftWedge` = 0x5d; `kHIDUsage_Sprt_Oar`: `kHIDUsage_Sprt_Oar` = 0x30; `kHIDUsage_Sprt_PowerWedge`: `kHIDUsage_Sprt_PowerWedge` = 0x5e; `kHIDUsage_Sprt_Putter`: `kHIDUsage_Sprt_Putter` = 0x50; `kHIDUsage_Sprt_Rate`: `kHIDUsage_Sprt_Rate` = 0x32; `kHIDUsage_Sprt_Reserved`: `kHIDUsage_Sprt_Reserved` = 0xffff; `kHIDUsage_Sprt_RowingMachine`: `kHIDUsage_Sprt_RowingMachine` = 0x03; `kHIDUsage_Sprt_SandWedge`: `kHIDUsage_Sprt_SandWedge` = 0x5c; `kHIDUsage_Sprt_Slope`: `kHIDUsage_Sprt_Slope` = 0x31; `kHIDUsage_Sprt_StickFaceAngle`: `kHIDUsage_Sprt_StickFaceAngle` = 0x34; `kHIDUsage_Sprt_StickFollowThrough`: `kHIDUsage_Sprt_StickFollowThrough` = 0x36; `kHIDUsage_Sprt_StickHeelOrToe`: `kHIDUsage_Sprt_StickHeelOrToe` = 0x35; `kHIDUsage_Sprt_StickHeight`: `kHIDUsage_Sprt_StickHeight` = 0x39; `kHIDUsage_Sprt_StickSpeed`: `kHIDUsage_Sprt_StickSpeed` = 0x33; `kHIDUsage_Sprt_StickTempo`: `kHIDUsage_Sprt_StickTempo` = 0x37; `kHIDUsage_Sprt_StickType`: `kHIDUsage_Sprt_StickType` = 0x38; `kHIDUsage_Sprt_Treadmill`: `kHIDUsage_Sprt_Treadmill` = 0x04; `kHIDUsage_TFon_Reserved`: `kHIDUsage_TFon_Reserved` = 0xffff; `kHIDUsage_Tfon_AlternateFunction`: `kHIDUsage_Tfon_AlternateFunction` = 0x29; `kHIDUsage_Tfon_AnswerOnOrOff`: `kHIDUsage_Tfon_AnswerOnOrOff` = 0x74; `kHIDUsage_Tfon_AnsweringMachine`: `kHIDUsage_Tfon_AnsweringMachine` = 0x02; `kHIDUsage_Tfon_CallWaitingTone`: `kHIDUsage_Tfon_CallWaitingTone` = 0x99; `kHIDUsage_Tfon_CallerID`: `kHIDUsage_Tfon_CallerID` = 0x30; `kHIDUsage_Tfon_Conference`: `kHIDUsage_Tfon_Conference` = 0x2c; `kHIDUsage_Tfon_ConfirmationTone1`: `kHIDUsage_Tfon_ConfirmationTone1` = 0x9a; `kHIDUsage_Tfon_ConfirmationTone2`: `kHIDUsage_Tfon_ConfirmationTone2` = 0x9b; `kHIDUsage_Tfon_DoNotDisturb`: `kHIDUsage_Tfon_DoNotDisturb` = 0x72; `kHIDUsage_Tfon_Drop`: `kHIDUsage_Tfon_Drop` = 0x26; `kHIDUsage_Tfon_Feature`: `kHIDUsage_Tfon_Feature` = 0x22; `kHIDUsage_Tfon_Flash`: `kHIDUsage_Tfon_Flash` = 0x21; `kHIDUsage_Tfon_ForwardCalls`: `kHIDUsage_Tfon_ForwardCalls` = 0x28; `kHIDUsage_Tfon_Handset`: `kHIDUsage_Tfon_Handset` = 0x04; `kHIDUsage_Tfon_Headset`: `kHIDUsage_Tfon_Headset` = 0x05; `kHIDUsage_Tfon_Hold`: `kHIDUsage_Tfon_Hold` = 0x23; `kHIDUsage_Tfon_HookSwitch`: `kHIDUsage_Tfon_HookSwitch` = 0x20; `kHIDUsage_Tfon_InsideDialTone`: `kHIDUsage_Tfon_InsideDialTone` = 0x90; `kHIDUsage_Tfon_InsideRingTone`: `kHIDUsage_Tfon_InsideRingTone` = 0x92; `kHIDUsage_Tfon_InsideRingback`: `kHIDUsage_Tfon_InsideRingback` = 0x95; `kHIDUsage_Tfon_Line`: `kHIDUsage_Tfon_Line` = 0x2a; `kHIDUsage_Tfon_LineBusyTone`: `kHIDUsage_Tfon_LineBusyTone` = 0x97; `kHIDUsage_Tfon_Message`: `kHIDUsage_Tfon_Message` = 0x73; `kHIDUsage_Tfon_MessageControls`: `kHIDUsage_Tfon_MessageControls` = 0x03; `kHIDUsage_Tfon_OutsideDialTone`: `kHIDUsage_Tfon_OutsideDialTone` = 0x91; `kHIDUsage_Tfon_OutsideRingTone`: `kHIDUsage_Tfon_OutsideRingTone` = 0x93; `kHIDUsage_Tfon_OutsideRingback`: `kHIDUsage_Tfon_OutsideRingback` = 0x9d; `kHIDUsage_Tfon_Park`: `kHIDUsage_Tfon_Park` = 0x27; `kHIDUsage_Tfon_Phone`: `kHIDUsage_Tfon_Phone` = 0x01; `kHIDUsage_Tfon_PhoneDirectory`: `kHIDUsage_Tfon_PhoneDirectory` = 0x53; `kHIDUsage_Tfon_PhoneKey0`: `kHIDUsage_Tfon_PhoneKey0` = 0xb0; `kHIDUsage_Tfon_PhoneKey1`: `kHIDUsage_Tfon_PhoneKey1` = 0xb1; `kHIDUsage_Tfon_PhoneKey2`: `kHIDUsage_Tfon_PhoneKey2` = 0xb2; `kHIDUsage_Tfon_PhoneKey3`: `kHIDUsage_Tfon_PhoneKey3` = 0xb3; `kHIDUsage_Tfon_PhoneKey4`: `kHIDUsage_Tfon_PhoneKey4` = 0xb4; `kHIDUsage_Tfon_PhoneKey5`: `kHIDUsage_Tfon_PhoneKey5` = 0xb5; `kHIDUsage_Tfon_PhoneKey6`: `kHIDUsage_Tfon_PhoneKey6` = 0xb6; `kHIDUsage_Tfon_PhoneKey7`: `kHIDUsage_Tfon_PhoneKey7` = 0xb7; `kHIDUsage_Tfon_PhoneKey8`: `kHIDUsage_Tfon_PhoneKey8` = 0xb8; `kHIDUsage_Tfon_PhoneKey9`: `kHIDUsage_Tfon_PhoneKey9` = 0xb9; `kHIDUsage_Tfon_PhoneKeyA`: `kHIDUsage_Tfon_PhoneKeyA` = 0xbc; `kHIDUsage_Tfon_PhoneKeyB`: `kHIDUsage_Tfon_PhoneKeyB` = 0xbd; `kHIDUsage_Tfon_PhoneKeyC`: `kHIDUsage_Tfon_PhoneKeyC` = 0xbe; `kHIDUsage_Tfon_PhoneKeyD`: `kHIDUsage_Tfon_PhoneKeyD` = 0xbf; `kHIDUsage_Tfon_PhoneKeyPound`: `kHIDUsage_Tfon_PhoneKeyPound` = 0xbb; `kHIDUsage_Tfon_PhoneKeyStar`: `kHIDUsage_Tfon_PhoneKeyStar` = 0xba; `kHIDUsage_Tfon_PhoneMute`: `kHIDUsage_Tfon_PhoneMute` = 0x2f; `kHIDUsage_Tfon_PriorityRingTone`: `kHIDUsage_Tfon_PriorityRingTone` = 0x94; `kHIDUsage_Tfon_PriorityRingback`: `kHIDUsage_Tfon_PriorityRingback` = 0x96; `kHIDUsage_Tfon_ProgrammableButton`: `kHIDUsage_Tfon_ProgrammableButton` = 0x07; `kHIDUsage_Tfon_RecallNumber`: `kHIDUsage_Tfon_RecallNumber` = 0x52; `kHIDUsage_Tfon_Redial`: `kHIDUsage_Tfon_Redial` = 0x24; `kHIDUsage_Tfon_ReorderTone`: `kHIDUsage_Tfon_ReorderTone` = 0x98; `kHIDUsage_Tfon_Ring`: `kHIDUsage_Tfon_Ring` = 0x2e; `kHIDUsage_Tfon_RingEnable`: `kHIDUsage_Tfon_RingEnable` = 0x2d; `kHIDUsage_Tfon_ScreenCalls`: `kHIDUsage_Tfon_ScreenCalls` = 0x71; `kHIDUsage_Tfon_SpeakerPhone`: `kHIDUsage_Tfon_SpeakerPhone` = 0x2b; `kHIDUsage_Tfon_SpeedDial`: `kHIDUsage_Tfon_SpeedDial` = 0x50; `kHIDUsage_Tfon_StoreNumber`: `kHIDUsage_Tfon_StoreNumber` = 0x51; `kHIDUsage_Tfon_TelephonyKeyPad`: `kHIDUsage_Tfon_TelephonyKeyPad` = 0x06; `kHIDUsage_Tfon_TonesOff`: `kHIDUsage_Tfon_TonesOff` = 0x9c; `kHIDUsage_Tfon_Transfer`: `kHIDUsage_Tfon_Transfer` = 0x25; `kHIDUsage_Tfon_VoiceMail`: `kHIDUsage_Tfon_VoiceMail` = 0x70; `kHIDUsage_Undefined`: `kHIDUsage_Undefined` = 0x00; `kHIDUsage_VR_AnimatronicDevice`: `kHIDUsage_VR_AnimatronicDevice` = 0x0a; `kHIDUsage_VR_Belt`: `kHIDUsage_VR_Belt` = 0x01; `kHIDUsage_VR_BodySuit`: `kHIDUsage_VR_BodySuit` = 0x02; `kHIDUsage_VR_DisplayEnable`: `kHIDUsage_VR_DisplayEnable` = 0x21; `kHIDUsage_VR_Flexor`: `kHIDUsage_VR_Flexor` = 0x03; `kHIDUsage_VR_Glove`: `kHIDUsage_VR_Glove` = 0x04; `kHIDUsage_VR_HandTracker`: `kHIDUsage_VR_HandTracker` = 0x07; `kHIDUsage_VR_HeadMountedDisplay`: `kHIDUsage_VR_HeadMountedDisplay` = 0x06; `kHIDUsage_VR_HeadTracker`: `kHIDUsage_VR_HeadTracker` = 0x05; `kHIDUsage_VR_Oculometer`: `kHIDUsage_VR_Oculometer` = 0x08; `kHIDUsage_VR_Reserved`: `kHIDUsage_VR_Reserved` = 0xffff; `kHIDUsage_VR_StereoEnable`: `kHIDUsage_VR_StereoEnable` = 0x20; `kHIDUsage_VR_Vest`: `kHIDUsage_VR_Vest` = 0x09; `kHIDUsage_WD_CalibrationCount`: `kHIDUsage_WD_CalibrationCount` = 0x60; `kHIDUsage_WD_DataScaling`: `kHIDUsage_WD_DataScaling` = 0x41; `kHIDUsage_WD_DataWeight`: `kHIDUsage_WD_DataWeight` = 0x40; `kHIDUsage_WD_EnforcedZeroReturn`: `kHIDUsage_WD_EnforcedZeroReturn` = 0x81; `kHIDUsage_WD_RezeroCount`: `kHIDUsage_WD_RezeroCount` = 0x61; `kHIDUsage_WD_ScaleAtrributeReport`: `kHIDUsage_WD_ScaleAtrributeReport` = 0x30; `kHIDUsage_WD_ScaleControlReport`: `kHIDUsage_WD_ScaleControlReport` = 0x31; `kHIDUsage_WD_ScaleDataReport`: `kHIDUsage_WD_ScaleDataReport` = 0x32; `kHIDUsage_WD_ScaleScaleClassGeneric`: `kHIDUsage_WD_ScaleScaleClassGeneric` = 0x2a; `kHIDUsage_WD_ScaleScaleClassIIIEnglish`: `kHIDUsage_WD_ScaleScaleClassIIIEnglish` = 0x27; `kHIDUsage_WD_ScaleScaleClassIIILEnglish`: `kHIDUsage_WD_ScaleScaleClassIIILEnglish` = 0x28; `kHIDUsage_WD_ScaleScaleClassIIILMetric`: `kHIDUsage_WD_ScaleScaleClassIIILMetric` = 0x25; `kHIDUsage_WD_ScaleScaleClassIIIMetric`: `kHIDUsage_WD_ScaleScaleClassIIIMetric` = 0x24; `kHIDUsage_WD_ScaleScaleClassIIMetric`: `kHIDUsage_WD_ScaleScaleClassIIMetric` = 0x23; `kHIDUsage_WD_ScaleScaleClassIMetric`: `kHIDUsage_WD_ScaleScaleClassIMetric` = 0x22; `kHIDUsage_WD_ScaleScaleClassIMetricCL`: `kHIDUsage_WD_ScaleScaleClassIMetricCL` = 0x21; `kHIDUsage_WD_ScaleScaleClassIVEnglish`: `kHIDUsage_WD_ScaleScaleClassIVEnglish` = 0x29; `kHIDUsage_WD_ScaleScaleClassIVMetric`: `kHIDUsage_WD_ScaleScaleClassIVMetric` = 0x26; `kHIDUsage_WD_ScaleScaleDevice`: `kHIDUsage_WD_ScaleScaleDevice` = 0x20; `kHIDUsage_WD_ScaleStatisticsReport`: `kHIDUsage_WD_ScaleStatisticsReport` = 0x35; `kHIDUsage_WD_ScaleStatus`: `kHIDUsage_WD_ScaleStatus` = 0x70; `kHIDUsage_WD_ScaleStatusFault`: `kHIDUsage_WD_ScaleStatusFault` = 0x71; `kHIDUsage_WD_ScaleStatusInMotion`: `kHIDUsage_WD_ScaleStatusInMotion` = 0x73; `kHIDUsage_WD_ScaleStatusOverWeightLimit`: `kHIDUsage_WD_ScaleStatusOverWeightLimit` = 0x76; `kHIDUsage_WD_ScaleStatusReport`: `kHIDUsage_WD_ScaleStatusReport` = 0x33; `kHIDUsage_WD_ScaleStatusRequiresCalibration`: `kHIDUsage_WD_ScaleStatusRequiresCalibration` = 0x77; `kHIDUsage_WD_ScaleStatusRequiresRezeroing`: `kHIDUsage_WD_ScaleStatusRequiresRezeroing` = 0x78; `kHIDUsage_WD_ScaleStatusStableAtZero`: `kHIDUsage_WD_ScaleStatusStableAtZero` = 0x72; `kHIDUsage_WD_ScaleStatusUnderZero`: `kHIDUsage_WD_ScaleStatusUnderZero` = 0x75; `kHIDUsage_WD_ScaleStatusWeightStable`: `kHIDUsage_WD_ScaleStatusWeightStable` = 0x74; `kHIDUsage_WD_ScaleWeightLimitReport`: `kHIDUsage_WD_ScaleWeightLimitReport` = 0x34; `kHIDUsage_WD_Undefined`: `kHIDUsage_WD_Undefined` = 0x00; `kHIDUsage_WD_WeighingDevice`: `kHIDUsage_WD_WeighingDevice` = 0x01; `kHIDUsage_WD_WeightUnit`: `kHIDUsage_WD_WeightUnit` = 0x50; `kHIDUsage_WD_WeightUnitAvoirTon`: `kHIDUsage_WD_WeightUnitAvoirTon` = 0x59; `kHIDUsage_WD_WeightUnitCarats`: `kHIDUsage_WD_WeightUnitCarats` = 0x54; `kHIDUsage_WD_WeightUnitGrains`: `kHIDUsage_WD_WeightUnitGrains` = 0x56; `kHIDUsage_WD_WeightUnitGram`: `kHIDUsage_WD_WeightUnitGram` = 0x52; `kHIDUsage_WD_WeightUnitKilogram`: `kHIDUsage_WD_WeightUnitKilogram` = 0x53; `kHIDUsage_WD_WeightUnitMetricTon`: `kHIDUsage_WD_WeightUnitMetricTon` = 0x58; `kHIDUsage_WD_WeightUnitMilligram`: `kHIDUsage_WD_WeightUnitMilligram` = 0x51; `kHIDUsage_WD_WeightUnitOunce`: `kHIDUsage_WD_WeightUnitOunce` = 0x5b; `kHIDUsage_WD_WeightUnitPennyweights`: `kHIDUsage_WD_WeightUnitPennyweights` = 0x57; `kHIDUsage_WD_WeightUnitPound`: `kHIDUsage_WD_WeightUnitPound` = 0x5c; `kHIDUsage_WD_WeightUnitTaels`: `kHIDUsage_WD_WeightUnitTaels` = 0x55; `kHIDUsage_WD_WeightUnitTroyOunce`: `kHIDUsage_WD_WeightUnitTroyOunce` = 0x5a; `kHIDUsage_WD_ZeroScale`: `kHIDUsage_WD_ZeroScale` = 0x80 }, `durationSeconds`: `string` \| `number`) => `Promise`<`unknown`\> = `commands.iohidExtensions.mobilePerformIoHidEvent`

#### Type declaration

▸ (`...this`, `page`, `usage`, `durationSeconds`): `Promise`<`unknown`\>

Emulates triggering of the given low-level IO HID device event.

Popular constants:
- `kHIDPage_Consumer` = `0x0C`
- `kHIDUsage_Csmr_VolumeIncrement` = `0xE9` (Volume Up)
- `kHIDUsage_Csmr_VolumeDecrement` = `0xEA` (Volume Down)
- `kHIDUsage_Csmr_Menu` = `0x40` (Home)
- `kHIDUsage_Csmr_Power` = `0x30` (Power)
- `kHIDUsage_Csmr_Snapshot` = `0x65` (Power + Home)

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `page` | `HIDPageEvent` | `undefined` | The event page identifier |
| `usage` | `Object` | `undefined` | The event usage identifier (usages are defined per-page) |
| `usage.kHIDUsage_AD_ASCIICharacterSet` | `kHIDUsage_AD_ASCIICharacterSet` | `0x21` | - |
| `usage.kHIDUsage_AD_AlphanumericDisplay` | `kHIDUsage_AD_AlphanumericDisplay` | `0x01` | - |
| `usage.kHIDUsage_AD_CharacterHeight` | `kHIDUsage_AD_CharacterHeight` | `0x3e` | - |
| `usage.kHIDUsage_AD_CharacterReport` | `kHIDUsage_AD_CharacterReport` | `0x2b` | - |
| `usage.kHIDUsage_AD_CharacterSpacingHorizontal` | `kHIDUsage_AD_CharacterSpacingHorizontal` | `0x3f` | - |
| `usage.kHIDUsage_AD_CharacterSpacingVertical` | `kHIDUsage_AD_CharacterSpacingVertical` | `0x40` | - |
| `usage.kHIDUsage_AD_CharacterWidth` | `kHIDUsage_AD_CharacterWidth` | `0x3d` | - |
| `usage.kHIDUsage_AD_ClearDisplay` | `kHIDUsage_AD_ClearDisplay` | `0x25` | - |
| `usage.kHIDUsage_AD_Column` | `kHIDUsage_AD_Column` | `0x34` | - |
| `usage.kHIDUsage_AD_Columns` | `kHIDUsage_AD_Columns` | `0x36` | - |
| `usage.kHIDUsage_AD_CursorBlink` | `kHIDUsage_AD_CursorBlink` | `0x3a` | - |
| `usage.kHIDUsage_AD_CursorEnable` | `kHIDUsage_AD_CursorEnable` | `0x39` | - |
| `usage.kHIDUsage_AD_CursorMode` | `kHIDUsage_AD_CursorMode` | `0x38` | - |
| `usage.kHIDUsage_AD_CursorPixelPositioning` | `kHIDUsage_AD_CursorPixelPositioning` | `0x37` | - |
| `usage.kHIDUsage_AD_CursorPositionReport` | `kHIDUsage_AD_CursorPositionReport` | `0x32` | - |
| `usage.kHIDUsage_AD_DataReadBack` | `kHIDUsage_AD_DataReadBack` | `0x22` | - |
| `usage.kHIDUsage_AD_DisplayAttributesReport` | `kHIDUsage_AD_DisplayAttributesReport` | `0x20` | - |
| `usage.kHIDUsage_AD_DisplayControlReport` | `kHIDUsage_AD_DisplayControlReport` | `0x24` | - |
| `usage.kHIDUsage_AD_DisplayData` | `kHIDUsage_AD_DisplayData` | `0x2c` | - |
| `usage.kHIDUsage_AD_DisplayEnable` | `kHIDUsage_AD_DisplayEnable` | `0x26` | - |
| `usage.kHIDUsage_AD_DisplayStatus` | `kHIDUsage_AD_DisplayStatus` | `0x2d` | - |
| `usage.kHIDUsage_AD_ErrFontdatacannotberead` | `kHIDUsage_AD_ErrFontdatacannotberead` | `0x31` | - |
| `usage.kHIDUsage_AD_ErrNotaloadablecharacter` | `kHIDUsage_AD_ErrNotaloadablecharacter` | `0x30` | - |
| `usage.kHIDUsage_AD_FontData` | `kHIDUsage_AD_FontData` | `0x3c` | - |
| `usage.kHIDUsage_AD_FontReadBack` | `kHIDUsage_AD_FontReadBack` | `0x23` | - |
| `usage.kHIDUsage_AD_FontReport` | `kHIDUsage_AD_FontReport` | `0x3b` | - |
| `usage.kHIDUsage_AD_HorizontalScroll` | `kHIDUsage_AD_HorizontalScroll` | `0x2a` | - |
| `usage.kHIDUsage_AD_Reserved` | `kHIDUsage_AD_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_AD_Row` | `kHIDUsage_AD_Row` | `0x33` | - |
| `usage.kHIDUsage_AD_Rows` | `kHIDUsage_AD_Rows` | `0x35` | - |
| `usage.kHIDUsage_AD_ScreenSaverDelay` | `kHIDUsage_AD_ScreenSaverDelay` | `0x27` | - |
| `usage.kHIDUsage_AD_ScreenSaverEnable` | `kHIDUsage_AD_ScreenSaverEnable` | `0x28` | - |
| `usage.kHIDUsage_AD_StatNotReady` | `kHIDUsage_AD_StatNotReady` | `0x2e` | - |
| `usage.kHIDUsage_AD_StatReady` | `kHIDUsage_AD_StatReady` | `0x2f` | - |
| `usage.kHIDUsage_AD_UnicodeCharacterSet` | `kHIDUsage_AD_UnicodeCharacterSet` | `0x41` | - |
| `usage.kHIDUsage_AD_VerticalScroll` | `kHIDUsage_AD_VerticalScroll` | `0x29` | - |
| `usage.kHIDUsage_BCS_2DControlReport` | `kHIDUsage_BCS_2DControlReport` | `0x1f` | - |
| `usage.kHIDUsage_BCS_ActiveTime` | `kHIDUsage_BCS_ActiveTime` | `0x55` | - |
| `usage.kHIDUsage_BCS_AddEAN2_3LabelDefinition` | `kHIDUsage_BCS_AddEAN2_3LabelDefinition` | `0xbf` | - |
| `usage.kHIDUsage_BCS_AimDuration` | `kHIDUsage_BCS_AimDuration` | `0x7a` | - |
| `usage.kHIDUsage_BCS_AimingLaserPattern` | `kHIDUsage_BCS_AimingLaserPattern` | `0x56` | - |
| `usage.kHIDUsage_BCS_Aiming_PointerMide` | `kHIDUsage_BCS_Aiming_PointerMide` | `0x30` | - |
| `usage.kHIDUsage_BCS_AttributeReport` | `kHIDUsage_BCS_AttributeReport` | `0x10` | - |
| `usage.kHIDUsage_BCS_AztecCode` | `kHIDUsage_BCS_AztecCode` | `0x110` | - |
| `usage.kHIDUsage_BCS_BC412` | `kHIDUsage_BCS_BC412` | `0x111` | - |
| `usage.kHIDUsage_BCS_BadgeReader` | `kHIDUsage_BCS_BadgeReader` | `0x01` | - |
| `usage.kHIDUsage_BCS_BarCodePresent` | `kHIDUsage_BCS_BarCodePresent` | `0x57` | - |
| `usage.kHIDUsage_BCS_BarCodePresentSensor` | `kHIDUsage_BCS_BarCodePresentSensor` | `0x31` | - |
| `usage.kHIDUsage_BCS_BarCodeScanner` | `kHIDUsage_BCS_BarCodeScanner` | `0x02` | - |
| `usage.kHIDUsage_BCS_BarCodeScannerCradle` | `kHIDUsage_BCS_BarCodeScannerCradle` | `0x05` | - |
| `usage.kHIDUsage_BCS_BarSpaceData` | `kHIDUsage_BCS_BarSpaceData` | `0x100` | - |
| `usage.kHIDUsage_BCS_BeeperState` | `kHIDUsage_BCS_BeeperState` | `0x58` | - |
| `usage.kHIDUsage_BCS_BooklandEAN` | `kHIDUsage_BCS_BooklandEAN` | `0x91` | - |
| `usage.kHIDUsage_BCS_ChannelCode` | `kHIDUsage_BCS_ChannelCode` | `0x112` | - |
| `usage.kHIDUsage_BCS_Check` | `kHIDUsage_BCS_Check` | `0xb0` | - |
| `usage.kHIDUsage_BCS_CheckDigit` | `kHIDUsage_BCS_CheckDigit` | `0xd6` | - |
| `usage.kHIDUsage_BCS_CheckDigitCodabarEnable` | `kHIDUsage_BCS_CheckDigitCodabarEnable` | `0xde` | - |
| `usage.kHIDUsage_BCS_CheckDigitCode99Enable` | `kHIDUsage_BCS_CheckDigitCode99Enable` | `0xdf` | - |
| `usage.kHIDUsage_BCS_CheckDigitDisable` | `kHIDUsage_BCS_CheckDigitDisable` | `0xd7` | - |
| `usage.kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` | `0xd8` | - |
| `usage.kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` | `0xd9` | - |
| `usage.kHIDUsage_BCS_CheckDigitEnableOneMSIPlessey` | `kHIDUsage_BCS_CheckDigitEnableOneMSIPlessey` | `0xdc` | - |
| `usage.kHIDUsage_BCS_CheckDigitEnableStandard2of5OPCC` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5OPCC` | `0xd8` | - |
| `usage.kHIDUsage_BCS_CheckDigitEnableStandard2of5USS` | `kHIDUsage_BCS_CheckDigitEnableInterleaved2of5USS` | `0xd9` | - |
| `usage.kHIDUsage_BCS_CheckDigitEnableTwoMSIPlessey` | `kHIDUsage_BCS_CheckDigitEnableTwoMSIPlessey` | `0xdd` | - |
| `usage.kHIDUsage_BCS_CheckDisablePrice` | `kHIDUsage_BCS_CheckDisablePrice` | `0xb1` | - |
| `usage.kHIDUsage_BCS_CheckEnable4DigitPrice` | `kHIDUsage_BCS_CheckEnable4DigitPrice` | `0xb2` | - |
| `usage.kHIDUsage_BCS_CheckEnable5DigitPrice` | `kHIDUsage_BCS_CheckEnable5DigitPrice` | `0xb3` | - |
| `usage.kHIDUsage_BCS_CheckEnableEuropean4DigitPrice` | `kHIDUsage_BCS_CheckEnableEuropean4DigitPrice` | `0xb4` | - |
| `usage.kHIDUsage_BCS_CheckEnableEuropean5DigitPrice` | `kHIDUsage_BCS_CheckEnableEuropean5DigitPrice` | `0xb5` | - |
| `usage.kHIDUsage_BCS_Class1ALaser` | `kHIDUsage_BCS_Class1ALaser` | `0x32` | - |
| `usage.kHIDUsage_BCS_Class2Laser` | `kHIDUsage_BCS_Class2Laser` | `0x33` | - |
| `usage.kHIDUsage_BCS_ClearAllEAN2_3LabelDefinitions` | `kHIDUsage_BCS_ClearAllEAN2_3LabelDefinitions` | `0xc0` | - |
| `usage.kHIDUsage_BCS_Codabar` | `kHIDUsage_BCS_Codabar` | `0xc3` | - |
| `usage.kHIDUsage_BCS_CodabarControlReport` | `kHIDUsage_BCS_CodabarControlReport` | `0x1c` | - |
| `usage.kHIDUsage_BCS_Code128` | `kHIDUsage_BCS_Code128` | `0xc4` | - |
| `usage.kHIDUsage_BCS_Code128ControlReport` | `kHIDUsage_BCS_Code128ControlReport` | `0x1d` | - |
| `usage.kHIDUsage_BCS_Code16` | `kHIDUsage_BCS_Code16` | `0x113` | - |
| `usage.kHIDUsage_BCS_Code32` | `kHIDUsage_BCS_Code32` | `0x114` | - |
| `usage.kHIDUsage_BCS_Code39` | `kHIDUsage_BCS_Code39` | `0xc7` | - |
| `usage.kHIDUsage_BCS_Code39ControlReport` | `kHIDUsage_BCS_Code39ControlReport` | `0x18` | - |
| `usage.kHIDUsage_BCS_Code49` | `kHIDUsage_BCS_Code49` | `0x115` | - |
| `usage.kHIDUsage_BCS_Code93` | `kHIDUsage_BCS_Code93` | `0xc8` | - |
| `usage.kHIDUsage_BCS_CodeOne` | `kHIDUsage_BCS_CodeOne` | `0x116` | - |
| `usage.kHIDUsage_BCS_Colorcode` | `kHIDUsage_BCS_Colorcode` | `0x117` | - |
| `usage.kHIDUsage_BCS_CommitParametersToNVM` | `kHIDUsage_BCS_CommitParametersToNVM` | `0x6d` | - |
| `usage.kHIDUsage_BCS_ConstantElectronicArticleSurveillance` | `kHIDUsage_BCS_ConstantElectronicArticleSurveillance` | `0x37` | - |
| `usage.kHIDUsage_BCS_ContactScanner` | `kHIDUsage_BCS_ContactScanner` | `0x35` | - |
| `usage.kHIDUsage_BCS_ConvertEAN8To13Type` | `kHIDUsage_BCS_ConvertEAN8To13Type` | `0x92` | - |
| `usage.kHIDUsage_BCS_ConvertUPCAToEAN_13` | `kHIDUsage_BCS_ConvertUPCAToEAN_13` | `0x93` | - |
| `usage.kHIDUsage_BCS_ConvertUPC_EToA` | `kHIDUsage_BCS_ConvertUPC_EToA` | `0x94` | - |
| `usage.kHIDUsage_BCS_CordlessScannerBase` | `kHIDUsage_BCS_CordlessScannerBase` | `0x04` | - |
| `usage.kHIDUsage_BCS_DLMethodCheckForDiscrete` | `kHIDUsage_BCS_DLMethodCheckForDiscrete` | `0x10d` | - |
| `usage.kHIDUsage_BCS_DLMethodCheckInRange` | `kHIDUsage_BCS_DLMethodCheckInRange` | `0x10c` | - |
| `usage.kHIDUsage_BCS_DLMethodReadAny` | `kHIDUsage_BCS_DLMethodReadAny` | `0x10b` | - |
| `usage.kHIDUsage_BCS_DataLengthMethod` | `kHIDUsage_BCS_DataLengthMethod` | `0x10a` | - |
| `usage.kHIDUsage_BCS_DataMatrix` | `kHIDUsage_BCS_DataMatrix` | `0x118` | - |
| `usage.kHIDUsage_BCS_DataPrefix` | `kHIDUsage_BCS_DataPrefix` | `0x4f` | - |
| `usage.kHIDUsage_BCS_DecodeDataContinued` | `kHIDUsage_BCS_DecodeDataContinued` | `0xff` | - |
| `usage.kHIDUsage_BCS_DecodedData` | `kHIDUsage_BCS_DecodedData` | `0xfe` | - |
| `usage.kHIDUsage_BCS_DisableCheckDigitTransmit` | `kHIDUsage_BCS_DisableCheckDigitTransmit` | `0xf1` | - |
| `usage.kHIDUsage_BCS_DumbBarCodeScanner` | `kHIDUsage_BCS_DumbBarCodeScanner` | `0x03` | - |
| `usage.kHIDUsage_BCS_EAN13FlagDigit1` | `kHIDUsage_BCS_EAN13FlagDigit1` | `0xbc` | - |
| `usage.kHIDUsage_BCS_EAN13FlagDigit2` | `kHIDUsage_BCS_EAN13FlagDigit2` | `0xbd` | - |
| `usage.kHIDUsage_BCS_EAN13FlagDigit3` | `kHIDUsage_BCS_EAN13FlagDigit3` | `0xbe` | - |
| `usage.kHIDUsage_BCS_EAN2_3LabelControlReport` | `kHIDUsage_BCS_EAN2_3LabelControlReport` | `0x17` | - |
| `usage.kHIDUsage_BCS_EAN8FlagDigit1` | `kHIDUsage_BCS_EAN8FlagDigit1` | `0xb9` | - |
| `usage.kHIDUsage_BCS_EAN8FlagDigit2` | `kHIDUsage_BCS_EAN8FlagDigit2` | `0xba` | - |
| `usage.kHIDUsage_BCS_EAN8FlagDigit3` | `kHIDUsage_BCS_EAN8FlagDigit3` | `0xbb` | - |
| `usage.kHIDUsage_BCS_EANThreeLabel` | `kHIDUsage_BCS_EANThreeLabel` | `0xb8` | - |
| `usage.kHIDUsage_BCS_EANTwoLabel` | `kHIDUsage_BCS_EANTwoLabel` | `0xb7` | - |
| `usage.kHIDUsage_BCS_EAN_13` | `kHIDUsage_BCS_EAN_13` | `0x95` | - |
| `usage.kHIDUsage_BCS_EAN_8` | `kHIDUsage_BCS_EAN_8` | `0x96` | - |
| `usage.kHIDUsage_BCS_EAN_99_128_Mandatory` | `kHIDUsage_BCS_EAN_99_128_Mandatory` | `0x97` | - |
| `usage.kHIDUsage_BCS_EAN_99_P5_128_Optional` | `kHIDUsage_BCS_EAN_99_P5_128_Optional` | `0x98` | - |
| `usage.kHIDUsage_BCS_ElectronicArticleSurveillanceNotification` | `kHIDUsage_BCS_ElectronicArticleSurveillanceNotification` | `0x36` | - |
| `usage.kHIDUsage_BCS_EnableCheckDigitTransmit` | `kHIDUsage_BCS_EnableCheckDigitTransmit` | `0xf2` | - |
| `usage.kHIDUsage_BCS_ErrorIndication` | `kHIDUsage_BCS_ErrorIndication` | `0x38` | - |
| `usage.kHIDUsage_BCS_FirstDiscreteLengthToDecode` | `kHIDUsage_BCS_FirstDiscreteLengthToDecode` | `0x108` | - |
| `usage.kHIDUsage_BCS_FixedBeeper` | `kHIDUsage_BCS_FixedBeeper` | `0x39` | - |
| `usage.kHIDUsage_BCS_FragmentDecoding` | `kHIDUsage_BCS_FragmentDecoding` | `0x4d` | - |
| `usage.kHIDUsage_BCS_FullASCIIConversion` | `kHIDUsage_BCS_FullASCIIConversion` | `0xc9` | - |
| `usage.kHIDUsage_BCS_GRWTIAfterDecode` | `kHIDUsage_BCS_GRWTIAfterDecode` | `0x89` | - |
| `usage.kHIDUsage_BCS_GRWTIBeep_LampAfterTransmit` | `kHIDUsage_BCS_GRWTIBeep_LampAfterTransmit` | `0x8a` | - |
| `usage.kHIDUsage_BCS_GRWTINoBeep_LampUseAtAll` | `kHIDUsage_BCS_GRWTINoBeep_LampUseAtAll` | `0x8b` | - |
| `usage.kHIDUsage_BCS_GoodDecodeIndication` | `kHIDUsage_BCS_GoodDecodeIndication` | `0x3a` | - |
| `usage.kHIDUsage_BCS_GoodReadLED` | `kHIDUsage_BCS_GoodReadLED` | `0x7d` | - |
| `usage.kHIDUsage_BCS_GoodReadLampDuration` | `kHIDUsage_BCS_GoodReadLampDuration` | `0x7b` | - |
| `usage.kHIDUsage_BCS_GoodReadLampIntensity` | `kHIDUsage_BCS_GoodReadLampIntensity` | `0x7c` | - |
| `usage.kHIDUsage_BCS_GoodReadToneFrequency` | `kHIDUsage_BCS_GoodReadToneFrequency` | `0x7e` | - |
| `usage.kHIDUsage_BCS_GoodReadToneLength` | `kHIDUsage_BCS_GoodReadToneLength` | `0x7f` | - |
| `usage.kHIDUsage_BCS_GoodReadToneVolume` | `kHIDUsage_BCS_GoodReadToneVolume` | `0x80` | - |
| `usage.kHIDUsage_BCS_GoodReadWhenToWrite` | `kHIDUsage_BCS_GoodReadWhenToWrite` | `0x88` | - |
| `usage.kHIDUsage_BCS_HandsFreeScanning` | `kHIDUsage_BCS_HandsFreeScanning` | `0x3b` | - |
| `usage.kHIDUsage_BCS_HeaterPresent` | `kHIDUsage_BCS_HeaterPresent` | `0x34` | - |
| `usage.kHIDUsage_BCS_InitiateBarcodeRead` | `kHIDUsage_BCS_InitiateBarcodeRead` | `0x60` | - |
| `usage.kHIDUsage_BCS_Interleaved2of5` | `kHIDUsage_BCS_Interleaved2of5` | `0xca` | - |
| `usage.kHIDUsage_BCS_Interleaved2of5ControlReport` | `kHIDUsage_BCS_Interleaved2of5ControlReport` | `0x19` | - |
| `usage.kHIDUsage_BCS_IntrinsicallySafe` | `kHIDUsage_BCS_IntrinsicallySafe` | `0x3c` | - |
| `usage.kHIDUsage_BCS_ItalianPharmacyCode` | `kHIDUsage_BCS_ItalianPharmacyCode` | `0xcb` | - |
| `usage.kHIDUsage_BCS_KlasseEinsLaser` | `kHIDUsage_BCS_KlasseEinsLaser` | `0x3d` | - |
| `usage.kHIDUsage_BCS_LaserOnTime` | `kHIDUsage_BCS_LaserOnTime` | `0x59` | - |
| `usage.kHIDUsage_BCS_LaserState` | `kHIDUsage_BCS_LaserState` | `0x5a` | - |
| `usage.kHIDUsage_BCS_LockoutTime` | `kHIDUsage_BCS_LockoutTime` | `0x5b` | - |
| `usage.kHIDUsage_BCS_LongRangeScanner` | `kHIDUsage_BCS_LongRangeScanner` | `0x3e` | - |
| `usage.kHIDUsage_BCS_MSIPlesseyControlReport` | `kHIDUsage_BCS_MSIPlesseyControlReport` | `0x1b` | - |
| `usage.kHIDUsage_BCS_MSI_Plessey` | `kHIDUsage_BCS_MSI_Plessey` | `0xcc` | - |
| `usage.kHIDUsage_BCS_MaxiCode` | `kHIDUsage_BCS_MaxiCode` | `0x119` | - |
| `usage.kHIDUsage_BCS_MaximumLengthToDecode` | `kHIDUsage_BCS_MaximumLengthToDecode` | `0x107` | - |
| `usage.kHIDUsage_BCS_MicroPDF` | `kHIDUsage_BCS_MicroPDF` | `0x11a` | - |
| `usage.kHIDUsage_BCS_MinimumLengthToDecode` | `kHIDUsage_BCS_MinimumLengthToDecode` | `0x106` | - |
| `usage.kHIDUsage_BCS_MirrorSpeedControl` | `kHIDUsage_BCS_MirrorSpeedControl` | `0x3f` | - |
| `usage.kHIDUsage_BCS_Misc1DControlReport` | `kHIDUsage_BCS_Misc1DControlReport` | `0x1e` | - |
| `usage.kHIDUsage_BCS_MotorState` | `kHIDUsage_BCS_MotorState` | `0x5c` | - |
| `usage.kHIDUsage_BCS_MotorTimeout` | `kHIDUsage_BCS_MotorTimeout` | `0x5d` | - |
| `usage.kHIDUsage_BCS_MultiRangeScanner` | `kHIDUsage_BCS_MultiRangeScanner` | `0x45` | - |
| `usage.kHIDUsage_BCS_NoReadMessage` | `kHIDUsage_BCS_NoReadMessage` | `0x82` | - |
| `usage.kHIDUsage_BCS_NotOnFileIndication` | `kHIDUsage_BCS_NotOnFileIndication` | `0x40` | - |
| `usage.kHIDUsage_BCS_NotOnFileVolume` | `kHIDUsage_BCS_NotOnFileVolume` | `0x83` | - |
| `usage.kHIDUsage_BCS_PDF_417` | `kHIDUsage_BCS_PDF_417` | `0x11b` | - |
| `usage.kHIDUsage_BCS_ParameterScanning` | `kHIDUsage_BCS_ParameterScanning` | `0x6e` | - |
| `usage.kHIDUsage_BCS_ParametersChanged` | `kHIDUsage_BCS_ParametersChanged` | `0x6f` | - |
| `usage.kHIDUsage_BCS_Periodical` | `kHIDUsage_BCS_Periodical` | `0xa9` | - |
| `usage.kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus2` | `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus2` | `0xaa` | - |
| `usage.kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus5` | `kHIDUsage_BCS_PeriodicalAutoDiscriminatePlus5` | `0xad` | - |
| `usage.kHIDUsage_BCS_PeriodicalIgnorePlus2` | `kHIDUsage_BCS_PeriodicalIgnorePlus2` | `0xac` | - |
| `usage.kHIDUsage_BCS_PeriodicalIgnorePlus5` | `kHIDUsage_BCS_PeriodicalIgnorePlus5` | `0xaf` | - |
| `usage.kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus2` | `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus2` | `0xab` | - |
| `usage.kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus5` | `kHIDUsage_BCS_PeriodicalOnlyDecodeWithPlus5` | `0xae` | - |
| `usage.kHIDUsage_BCS_PolarityInvertedBarCode` | `kHIDUsage_BCS_PolarityInvertedBarCode` | `0x103` | - |
| `usage.kHIDUsage_BCS_PolarityNormalBarCode` | `kHIDUsage_BCS_PolarityInvertedBarCode` | `0x103` | - |
| `usage.kHIDUsage_BCS_PosiCode` | `kHIDUsage_BCS_PosiCode` | `0x11c` | - |
| `usage.kHIDUsage_BCS_PowerOnResetScanner` | `kHIDUsage_BCS_PowerOnResetScanner` | `0x5e` | - |
| `usage.kHIDUsage_BCS_PowerupBeep` | `kHIDUsage_BCS_PowerupBeep` | `0x84` | - |
| `usage.kHIDUsage_BCS_PrefixAIMI` | `kHIDUsage_BCS_PrefixAIMI` | `0x50` | - |
| `usage.kHIDUsage_BCS_PrefixNone` | `kHIDUsage_BCS_PrefixNone` | `0x51` | - |
| `usage.kHIDUsage_BCS_PrefixProprietary` | `kHIDUsage_BCS_PrefixProprietary` | `0x52` | - |
| `usage.kHIDUsage_BCS_PreventReadOfBarcodes` | `kHIDUsage_BCS_PreventReadOfBarcodes` | `0x5f` | - |
| `usage.kHIDUsage_BCS_ProgrammableBeeper` | `kHIDUsage_BCS_ProgrammableBeeper` | `0x41` | - |
| `usage.kHIDUsage_BCS_ProximitySensor` | `kHIDUsage_BCS_ProximitySensor` | `0x46` | - |
| `usage.kHIDUsage_BCS_QRCode` | `kHIDUsage_BCS_QRCode` | `0x11d` | - |
| `usage.kHIDUsage_BCS_RawDataPolarity` | `kHIDUsage_BCS_RawDataPolarity` | `0x102` | - |
| `usage.kHIDUsage_BCS_RawScannedDataReport` | `kHIDUsage_BCS_RawScannedDataReport` | `0x13` | - |
| `usage.kHIDUsage_BCS_ScannedDataReport` | `kHIDUsage_BCS_ScannedDataReport` | `0x12` | - |
| `usage.kHIDUsage_BCS_ScannerDataAccuracy` | `kHIDUsage_BCS_ScannerDataAccuracy` | `0x101` | - |
| `usage.kHIDUsage_BCS_ScannerInCradle` | `kHIDUsage_BCS_ScannerInCradle` | `0x75` | - |
| `usage.kHIDUsage_BCS_ScannerInRange` | `kHIDUsage_BCS_ScannerInRange` | `0x76` | - |
| `usage.kHIDUsage_BCS_ScannerReadConfidence` | `kHIDUsage_BCS_ScannerReadConfidence` | `0x4e` | - |
| `usage.kHIDUsage_BCS_SecondDiscreteLengthToDecode` | `kHIDUsage_BCS_SecondDiscreteLengthToDecode` | `0x109` | - |
| `usage.kHIDUsage_BCS_SetParameterDefaultValues` | `kHIDUsage_BCS_SetParameterDefaultValues` | `0x70` | - |
| `usage.kHIDUsage_BCS_SettingsReport` | `kHIDUsage_BCS_SettingsReport` | `0x11` | - |
| `usage.kHIDUsage_BCS_SoundErrorBeep` | `kHIDUsage_BCS_SoundErrorBeep` | `0x85` | - |
| `usage.kHIDUsage_BCS_SoundGoodReadBeep` | `kHIDUsage_BCS_SoundGoodReadBeep` | `0x86` | - |
| `usage.kHIDUsage_BCS_SoundNotOnFileBeep` | `kHIDUsage_BCS_SoundNotOnFileBeep` | `0x87` | - |
| `usage.kHIDUsage_BCS_Standard2of5` | `kHIDUsage_BCS_Standard2of5` | `0xce` | - |
| `usage.kHIDUsage_BCS_Standard2of5ControlReport` | `kHIDUsage_BCS_Standard2of5ControlReport` | `0x1a` | - |
| `usage.kHIDUsage_BCS_Standard2of5IATA` | `kHIDUsage_BCS_Standard2of5IATA` | `0xcd` | - |
| `usage.kHIDUsage_BCS_StatusReport` | `kHIDUsage_BCS_StatusReport` | `0x15` | - |
| `usage.kHIDUsage_BCS_SuperCode` | `kHIDUsage_BCS_SuperCode` | `0x11e` | - |
| `usage.kHIDUsage_BCS_SymbologyIdentifier1` | `kHIDUsage_BCS_SymbologyIdentifier1` | `0xfb` | - |
| `usage.kHIDUsage_BCS_SymbologyIdentifier2` | `kHIDUsage_BCS_SymbologyIdentifier2` | `0xfc` | - |
| `usage.kHIDUsage_BCS_SymbologyIdentifier3` | `kHIDUsage_BCS_SymbologyIdentifier3` | `0xfd` | - |
| `usage.kHIDUsage_BCS_TransmitCheckDigit` | `kHIDUsage_BCS_TransmitCheckDigit` | `0xf0` | - |
| `usage.kHIDUsage_BCS_TransmitStart_Stop` | `kHIDUsage_BCS_TransmitStart_Stop` | `0xd3` | - |
| `usage.kHIDUsage_BCS_TriOptic` | `kHIDUsage_BCS_TriOptic` | `0xd4` | - |
| `usage.kHIDUsage_BCS_TriggerMode` | `kHIDUsage_BCS_TriggerMode` | `0x62` | - |
| `usage.kHIDUsage_BCS_TriggerModeBlinkingLaserOn` | `kHIDUsage_BCS_TriggerModeBlinkingLaserOn` | `0x63` | - |
| `usage.kHIDUsage_BCS_TriggerModeContinuousLaserOn` | `kHIDUsage_BCS_TriggerModeContinuousLaserOn` | `0x64` | - |
| `usage.kHIDUsage_BCS_TriggerModeLaserOnWhilePulled` | `kHIDUsage_BCS_TriggerModeLaserOnWhilePulled` | `0x65` | - |
| `usage.kHIDUsage_BCS_TriggerModeLaserStaysOnAfterTriggerRelease` | `kHIDUsage_BCS_TriggerModeLaserStaysOnAfterTriggerRelease` | `0x66` | - |
| `usage.kHIDUsage_BCS_TriggerReport` | `kHIDUsage_BCS_TriggerReport` | `0x14` | - |
| `usage.kHIDUsage_BCS_TriggerState` | `kHIDUsage_BCS_TriggerState` | `0x61` | - |
| `usage.kHIDUsage_BCS_Triggerless` | `kHIDUsage_BCS_Triggerless` | `0x42` | - |
| `usage.kHIDUsage_BCS_UCC_EAN_128` | `kHIDUsage_BCS_UCC_EAN_128` | `0xd5` | - |
| `usage.kHIDUsage_BCS_UPC_A` | `kHIDUsage_BCS_UPC_A` | `0x9d` | - |
| `usage.kHIDUsage_BCS_UPC_AWith128Mandatory` | `kHIDUsage_BCS_UPC_AWith128Mandatory` | `0x9e` | - |
| `usage.kHIDUsage_BCS_UPC_AWith128Optical` | `kHIDUsage_BCS_UPC_AWith128Optical` | `0x9f` | - |
| `usage.kHIDUsage_BCS_UPC_AWithP5Optional` | `kHIDUsage_BCS_UPC_AWithP5Optional` | `0xa0` | - |
| `usage.kHIDUsage_BCS_UPC_E` | `kHIDUsage_BCS_UPC_E` | `0xa1` | - |
| `usage.kHIDUsage_BCS_UPC_E1` | `kHIDUsage_BCS_UPC_E1` | `0xa2` | - |
| `usage.kHIDUsage_BCS_UPC_EAN` | `kHIDUsage_BCS_UPC_EAN` | `0x9a` | - |
| `usage.kHIDUsage_BCS_UPC_EANControlReport` | `kHIDUsage_BCS_UPC_EANControlReport` | `0x16` | - |
| `usage.kHIDUsage_BCS_UPC_EANCouponCode` | `kHIDUsage_BCS_UPC_EANCouponCode` | `0x9b` | - |
| `usage.kHIDUsage_BCS_UPC_EANPeriodicals` | `kHIDUsage_BCS_UPC_EANPeriodicals` | `0x9c` | - |
| `usage.kHIDUsage_BCS_USB_5_SlugCode` | `kHIDUsage_BCS_USB_5_SlugCode` | `0x120` | - |
| `usage.kHIDUsage_BCS_UltraCode` | `kHIDUsage_BCS_UltraCode` | `0x11f` | - |
| `usage.kHIDUsage_BCS_Undefined` | `kHIDUsage_BCS_Undefined` | `0x00` | - |
| `usage.kHIDUsage_BCS_VeriCode` | `kHIDUsage_BCS_VeriCode` | `0x121` | - |
| `usage.kHIDUsage_BCS_Wand` | `kHIDUsage_BCS_Wand` | `0x43` | - |
| `usage.kHIDUsage_BCS_WaterResistant` | `kHIDUsage_BCS_WaterResistant` | `0x44` | - |
| `usage.kHIDUsage_BS_ACPresent` | `kHIDUsage_BS_ACPresent` | `0xd0` | - |
| `usage.kHIDUsage_BS_AbsoluteStateOfCharge` | `kHIDUsage_BS_AbsoluteStateOfCharge` | `0x65` | - |
| `usage.kHIDUsage_BS_AlarmInhibited` | `kHIDUsage_BS_AlarmInhibited` | `0xd3` | - |
| `usage.kHIDUsage_BS_AtRate` | `kHIDUsage_BS_AtRate` | `0x2b` | - |
| `usage.kHIDUsage_BS_AtRateOK` | `kHIDUsage_BS_AtRateOK` | `0x49` | - |
| `usage.kHIDUsage_BS_AtRateTimeToEmpty` | `kHIDUsage_BS_AtRateTimeToEmpty` | `0x61` | - |
| `usage.kHIDUsage_BS_AtRateTimeToFull` | `kHIDUsage_BS_AtRateTimeToFull` | `0x60` | - |
| `usage.kHIDUsage_BS_AverageCurrent` | `kHIDUsage_BS_AverageCurrent` | `0x62` | - |
| `usage.kHIDUsage_BS_AverageTimeToEmpty` | `kHIDUsage_BS_AverageTimeToEmpty` | `0x69` | - |
| `usage.kHIDUsage_BS_AverageTimeToFull` | `kHIDUsage_BS_AverageTimeToFull` | `0x6a` | - |
| `usage.kHIDUsage_BS_BattPackModelLevel` | `kHIDUsage_BS_BattPackModelLevel` | `0x80` | - |
| `usage.kHIDUsage_BS_BatteryInsertion` | `kHIDUsage_BS_BatteryInsertion` | `0x18` | - |
| `usage.kHIDUsage_BS_BatteryPresent` | `kHIDUsage_BS_BatteryPresent` | `0xd1` | - |
| `usage.kHIDUsage_BS_BatterySupported` | `kHIDUsage_BS_BatterySupported` | `0x1b` | - |
| `usage.kHIDUsage_BS_BelowRemainingCapacityLimit` | `kHIDUsage_BS_BelowRemainingCapacityLimit` | `0x42` | - |
| `usage.kHIDUsage_BS_BroadcastToCharger` | `kHIDUsage_BS_BroadcastToCharger` | `0x2d` | - |
| `usage.kHIDUsage_BS_CapacityGranularity1` | `kHIDUsage_BS_CapacityGranularity1` | `0x8d` | - |
| `usage.kHIDUsage_BS_CapacityGranularity2` | `kHIDUsage_BS_CapacityGranularity2` | `0x8e` | - |
| `usage.kHIDUsage_BS_CapacityMode` | `kHIDUsage_BS_CapacityMode` | `0x2c` | - |
| `usage.kHIDUsage_BS_ChargeController` | `kHIDUsage_BS_ChargeController` | `0x2f` | - |
| `usage.kHIDUsage_BS_ChargerConnection` | `kHIDUsage_BS_ChargerConnection` | `0x17` | - |
| `usage.kHIDUsage_BS_ChargerSelectorSupport` | `kHIDUsage_BS_ChargerSelectorSupport` | `0xf0` | - |
| `usage.kHIDUsage_BS_ChargerSpec` | `kHIDUsage_BS_ChargerSpec` | `0xf1` | - |
| `usage.kHIDUsage_BS_Charging` | `kHIDUsage_BS_Charging` | `0x44` | - |
| `usage.kHIDUsage_BS_ChargingIndicator` | `kHIDUsage_BS_ChargingIndicator` | `0x1d` | - |
| `usage.kHIDUsage_BS_ConditioningFlag` | `kHIDUsage_BS_ConditioningFlag` | `0x48` | - |
| `usage.kHIDUsage_BS_ConnectionToSMBus` | `kHIDUsage_BS_ConnectionToSMBus` | `0x15` | - |
| `usage.kHIDUsage_BS_CurrentNotRegulated` | `kHIDUsage_BS_CurrentNotRegulated` | `0xda` | - |
| `usage.kHIDUsage_BS_CurrentOutOfRange` | `kHIDUsage_BS_CurrentOutOfRange` | `0xd9` | - |
| `usage.kHIDUsage_BS_CycleCount` | `kHIDUsage_BS_CycleCount` | `0x6b` | - |
| `usage.kHIDUsage_BS_DesignCapacity` | `kHIDUsage_BS_DesignCapacity` | `0x83` | - |
| `usage.kHIDUsage_BS_Discharging` | `kHIDUsage_BS_Discharging` | `0x45` | - |
| `usage.kHIDUsage_BS_EnablePolling` | `kHIDUsage_BS_EnablePolling` | `0xc1` | - |
| `usage.kHIDUsage_BS_FullChargeCapacity` | `kHIDUsage_BS_FullChargeCapacity` | `0x67` | - |
| `usage.kHIDUsage_BS_FullyCharged` | `kHIDUsage_BS_FullyCharged` | `0x46` | - |
| `usage.kHIDUsage_BS_FullyDischarged` | `kHIDUsage_BS_FullyDischarged` | `0x47` | - |
| `usage.kHIDUsage_BS_InhibitCharge` | `kHIDUsage_BS_InhibitCharge` | `0xc0` | - |
| `usage.kHIDUsage_BS_InternalChargeController` | `kHIDUsage_BS_InternalChargeController` | `0x81` | - |
| `usage.kHIDUsage_BS_Level2` | `kHIDUsage_BS_Level2` | `0xf2` | - |
| `usage.kHIDUsage_BS_Level3` | `kHIDUsage_BS_Level3` | `0xf3` | - |
| `usage.kHIDUsage_BS_ManufacturerAccess` | `kHIDUsage_BS_ManufacturerAccess` | `0x28` | - |
| `usage.kHIDUsage_BS_ManufacturerData` | `kHIDUsage_BS_ManufacturerData` | `0x8a` | - |
| `usage.kHIDUsage_BS_ManufacturerDate` | `kHIDUsage_BS_ManufacturerDate` | `0x85` | - |
| `usage.kHIDUsage_BS_MasterMode` | `kHIDUsage_BS_MasterMode` | `0xdc` | - |
| `usage.kHIDUsage_BS_Maxerror` | `kHIDUsage_BS_Maxerror` | `0x63` | - |
| `usage.kHIDUsage_BS_NeedReplacement` | `kHIDUsage_BS_NeedReplacement` | `0x4b` | - |
| `usage.kHIDUsage_BS_OKToUse` | `kHIDUsage_BS_OKToUse` | `0x1a` | - |
| `usage.kHIDUsage_BS_OptionalMfgFunction1` | `kHIDUsage_BS_OptionalMfgFunction1` | `0x10` | - |
| `usage.kHIDUsage_BS_OptionalMfgFunction2` | `kHIDUsage_BS_OptionalMfgFunction2` | `0x11` | - |
| `usage.kHIDUsage_BS_OptionalMfgFunction3` | `kHIDUsage_BS_OptionalMfgFunction3` | `0x12` | - |
| `usage.kHIDUsage_BS_OptionalMfgFunction4` | `kHIDUsage_BS_OptionalMfgFunction4` | `0x13` | - |
| `usage.kHIDUsage_BS_OptionalMfgFunction5` | `kHIDUsage_BS_OptionalMfgFunction5` | `0x14` | - |
| `usage.kHIDUsage_BS_OutputConnection` | `kHIDUsage_BS_OutputConnection` | `0x16` | - |
| `usage.kHIDUsage_BS_PowerFail` | `kHIDUsage_BS_PowerFail` | `0xd2` | - |
| `usage.kHIDUsage_BS_PrimaryBattery` | `kHIDUsage_BS_PrimaryBattery` | `0x2e` | - |
| `usage.kHIDUsage_BS_PrimaryBatterySupport` | `kHIDUsage_BS_PrimaryBatterySupport` | `0x82` | - |
| `usage.kHIDUsage_BS_Rechargable` | `kHIDUsage_BS_Rechargable` | `0x8b` | - |
| `usage.kHIDUsage_BS_RelativeStateOfCharge` | `kHIDUsage_BS_RelativeStateOfCharge` | `0x64` | - |
| `usage.kHIDUsage_BS_RemainingCapacity` | `kHIDUsage_BS_RemainingCapacity` | `0x66` | - |
| `usage.kHIDUsage_BS_RemainingCapacityLimit` | `kHIDUsage_BS_RemainingCapacityLimit` | `0x29` | - |
| `usage.kHIDUsage_BS_RemainingTimeLimit` | `kHIDUsage_BS_RemainingTimeLimit` | `0x2a` | - |
| `usage.kHIDUsage_BS_RemainingTimeLimitExpired` | `kHIDUsage_BS_RemainingTimeLimitExpired` | `0x43` | - |
| `usage.kHIDUsage_BS_ResetToZero` | `kHIDUsage_BS_ResetToZero` | `0xc2` | - |
| `usage.kHIDUsage_BS_RunTimeToEmpty` | `kHIDUsage_BS_RunTimeToEmpty` | `0x68` | - |
| `usage.kHIDUsage_BS_SMBAlarmWarning` | `kHIDUsage_BS_SMBAlarmWarning` | `0x03` | - |
| `usage.kHIDUsage_BS_SMBBatteryMode` | `kHIDUsage_BS_SMBBatteryMode` | `0x01` | - |
| `usage.kHIDUsage_BS_SMBBatteryStatus` | `kHIDUsage_BS_SMBBatteryStatus` | `0x02` | - |
| `usage.kHIDUsage_BS_SMBChargerMode` | `kHIDUsage_BS_SMBChargerMode` | `0x04` | - |
| `usage.kHIDUsage_BS_SMBChargerSpecInfo` | `kHIDUsage_BS_SMBChargerSpecInfo` | `0x06` | - |
| `usage.kHIDUsage_BS_SMBChargerStatus` | `kHIDUsage_BS_SMBChargerStatus` | `0x05` | - |
| `usage.kHIDUsage_BS_SMBErrorCode` | `kHIDUsage_BS_SMBErrorCode` | `0x4a` | - |
| `usage.kHIDUsage_BS_SMBSelectorInfo` | `kHIDUsage_BS_SMBSelectorInfo` | `0x09` | - |
| `usage.kHIDUsage_BS_SMBSelectorPresets` | `kHIDUsage_BS_SMBSelectorPresets` | `0x08` | - |
| `usage.kHIDUsage_BS_SMBSelectorState` | `kHIDUsage_BS_SMBSelectorState` | `0x07` | - |
| `usage.kHIDUsage_BS_SelectorRevision` | `kHIDUsage_BS_SelectorRevision` | `0x1c` | - |
| `usage.kHIDUsage_BS_SerialNumber` | `kHIDUsage_BS_SerialNumber` | `0x86` | - |
| `usage.kHIDUsage_BS_SpecificationInfo` | `kHIDUsage_BS_SpecificationInfo` | `0x84` | - |
| `usage.kHIDUsage_BS_TerminateCharge` | `kHIDUsage_BS_TerminateCharge` | `0x40` | - |
| `usage.kHIDUsage_BS_TerminateDischarge` | `kHIDUsage_BS_TerminateDischarge` | `0x41` | - |
| `usage.kHIDUsage_BS_ThermistorCold` | `kHIDUsage_BS_ThermistorCold` | `0xd6` | - |
| `usage.kHIDUsage_BS_ThermistorHot` | `kHIDUsage_BS_ThermistorHot` | `0xd5` | - |
| `usage.kHIDUsage_BS_ThermistorOverRange` | `kHIDUsage_BS_ThermistorOverRange` | `0xd7` | - |
| `usage.kHIDUsage_BS_ThermistorUnderRange` | `kHIDUsage_BS_ThermistorUnderRange` | `0xd4` | - |
| `usage.kHIDUsage_BS_Undefined` | `kHIDUsage_BS_Undefined` | `0x00` | - |
| `usage.kHIDUsage_BS_Usenext` | `kHIDUsage_BS_Usenext` | `0x19` | - |
| `usage.kHIDUsage_BS_VoltageNotRegulated` | `kHIDUsage_BS_VoltageNotRegulated` | `0xdb` | - |
| `usage.kHIDUsage_BS_VoltageOutOfRange` | `kHIDUsage_BS_VoltageOutOfRange` | `0xd8` | - |
| `usage.kHIDUsage_BS_WarningCapacityLimit` | `kHIDUsage_BS_WarningCapacityLimit` | `0x8c` | - |
| `usage.kHIDUsage_BS_iDeviceChemistry` | `kHIDUsage_BS_iDeviceChemistry` | `0x89` | - |
| `usage.kHIDUsage_BS_iDevicename` | `kHIDUsage_BS_iDevicename` | `0x88` | - |
| `usage.kHIDUsage_BS_iManufacturerName` | `kHIDUsage_BS_iManufacturerName` | `0x87` | - |
| `usage.kHIDUsage_BS_iOEMInformation` | `kHIDUsage_BS_iOEMInformation` | `0x8f` | - |
| `usage.kHIDUsage_Button_1` | `kHIDUsage_Button_1` | `0x01` | - |
| `usage.kHIDUsage_Button_2` | `kHIDUsage_Button_2` | `0x02` | - |
| `usage.kHIDUsage_Button_3` | `kHIDUsage_Button_3` | `0x03` | - |
| `usage.kHIDUsage_Button_4` | `kHIDUsage_Button_4` | `0x04` | - |
| `usage.kHIDUsage_Button_65535` | `kHIDUsage_Button_65535` | `0xffff` | - |
| `usage.kHIDUsage_Csmr_AC` | `kHIDUsage_Csmr_AC` | `0x21e` | - |
| `usage.kHIDUsage_Csmr_ACBack` | `kHIDUsage_Csmr_ACBack` | `0x224` | - |
| `usage.kHIDUsage_Csmr_ACBookmarks` | `kHIDUsage_Csmr_ACBookmarks` | `0x22a` | - |
| `usage.kHIDUsage_Csmr_ACClose` | `kHIDUsage_Csmr_ACClose` | `0x203` | - |
| `usage.kHIDUsage_Csmr_ACCopy` | `kHIDUsage_Csmr_ACCopy` | `0x21b` | - |
| `usage.kHIDUsage_Csmr_ACCut` | `kHIDUsage_Csmr_ACCut` | `0x21c` | - |
| `usage.kHIDUsage_Csmr_ACExit` | `kHIDUsage_Csmr_ACExit` | `0x204` | - |
| `usage.kHIDUsage_Csmr_ACFind` | `kHIDUsage_Csmr_ACFind` | `0x21f` | - |
| `usage.kHIDUsage_Csmr_ACFindandReplace` | `kHIDUsage_Csmr_ACFindandReplace` | `0x220` | - |
| `usage.kHIDUsage_Csmr_ACFormat` | `kHIDUsage_Csmr_ACFormat` | `0x23c` | - |
| `usage.kHIDUsage_Csmr_ACForward` | `kHIDUsage_Csmr_ACForward` | `0x225` | - |
| `usage.kHIDUsage_Csmr_ACFullScreenView` | `kHIDUsage_Csmr_ACFullScreenView` | `0x230` | - |
| `usage.kHIDUsage_Csmr_ACGoTo` | `kHIDUsage_Csmr_ACGoTo` | `0x222` | - |
| `usage.kHIDUsage_Csmr_ACHistory` | `kHIDUsage_Csmr_ACHistory` | `0x22b` | - |
| `usage.kHIDUsage_Csmr_ACHome` | `kHIDUsage_Csmr_ACHome` | `0x223` | - |
| `usage.kHIDUsage_Csmr_ACMaximize` | `kHIDUsage_Csmr_ACMaximize` | `0x205` | - |
| `usage.kHIDUsage_Csmr_ACMinimize` | `kHIDUsage_Csmr_ACMinimize` | `0x206` | - |
| `usage.kHIDUsage_Csmr_ACNew` | `kHIDUsage_Csmr_ACNew` | `0x201` | - |
| `usage.kHIDUsage_Csmr_ACNewWindow` | `kHIDUsage_Csmr_ACNewWindow` | `0x239` | - |
| `usage.kHIDUsage_Csmr_ACNextLink` | `kHIDUsage_Csmr_ACNextLink` | `0x229` | - |
| `usage.kHIDUsage_Csmr_ACNormalView` | `kHIDUsage_Csmr_ACNormalView` | `0x231` | - |
| `usage.kHIDUsage_Csmr_ACOpen` | `kHIDUsage_Csmr_ACOpen` | `0x202` | - |
| `usage.kHIDUsage_Csmr_ACPan` | `kHIDUsage_Csmr_ACPan` | `0x238` | - |
| `usage.kHIDUsage_Csmr_ACPanLeft` | `kHIDUsage_Csmr_ACPanLeft` | `0x236` | - |
| `usage.kHIDUsage_Csmr_ACPanRight` | `kHIDUsage_Csmr_ACPanRight` | `0x237` | - |
| `usage.kHIDUsage_Csmr_ACPaste` | `kHIDUsage_Csmr_ACPaste` | `0x21d` | - |
| `usage.kHIDUsage_Csmr_ACPreviousLink` | `kHIDUsage_Csmr_ACPreviousLink` | `0x228` | - |
| `usage.kHIDUsage_Csmr_ACPrint` | `kHIDUsage_Csmr_ACPrint` | `0x208` | - |
| `usage.kHIDUsage_Csmr_ACProperties` | `kHIDUsage_Csmr_ACProperties` | `0x209` | - |
| `usage.kHIDUsage_Csmr_ACRefresh` | `kHIDUsage_Csmr_ACRefresh` | `0x227` | - |
| `usage.kHIDUsage_Csmr_ACSave` | `kHIDUsage_Csmr_ACSave` | `0x207` | - |
| `usage.kHIDUsage_Csmr_ACScroll` | `kHIDUsage_Csmr_ACScroll` | `0x235` | - |
| `usage.kHIDUsage_Csmr_ACScrollDown` | `kHIDUsage_Csmr_ACScrollDown` | `0x234` | - |
| `usage.kHIDUsage_Csmr_ACScrollUp` | `kHIDUsage_Csmr_ACScrollUp` | `0x233` | - |
| `usage.kHIDUsage_Csmr_ACSearch` | `kHIDUsage_Csmr_ACSearch` | `0x221` | - |
| `usage.kHIDUsage_Csmr_ACStop` | `kHIDUsage_Csmr_ACStop` | `0x226` | - |
| `usage.kHIDUsage_Csmr_ACSubscriptions` | `kHIDUsage_Csmr_ACSubscriptions` | `0x22c` | - |
| `usage.kHIDUsage_Csmr_ACTileHorizontally` | `kHIDUsage_Csmr_ACTileHorizontally` | `0x23a` | - |
| `usage.kHIDUsage_Csmr_ACTileVertically` | `kHIDUsage_Csmr_ACTileVertically` | `0x23b` | - |
| `usage.kHIDUsage_Csmr_ACUndo` | `kHIDUsage_Csmr_ACUndo` | `0x21a` | - |
| `usage.kHIDUsage_Csmr_ACViewToggle` | `kHIDUsage_Csmr_ACViewToggle` | `0x232` | - |
| `usage.kHIDUsage_Csmr_ACZoom` | `kHIDUsage_Csmr_ACZoom` | `0x22f` | - |
| `usage.kHIDUsage_Csmr_ACZoomIn` | `kHIDUsage_Csmr_ACZoomIn` | `0x22d` | - |
| `usage.kHIDUsage_Csmr_ACZoomOut` | `kHIDUsage_Csmr_ACZoomOut` | `0x22e` | - |
| `usage.kHIDUsage_Csmr_AL` | `kHIDUsage_Csmr_AL` | `0x1a2` | - |
| `usage.kHIDUsage_Csmr_ALAOrVCaptureOrPlayback` | `kHIDUsage_Csmr_ALAOrVCaptureOrPlayback` | `0x193` | - |
| `usage.kHIDUsage_Csmr_ALAlarms` | `kHIDUsage_Csmr_ALAlarms` | `0x1b2` | - |
| `usage.kHIDUsage_Csmr_ALCalculator` | `kHIDUsage_Csmr_ALCalculator` | `0x192` | - |
| `usage.kHIDUsage_Csmr_ALCalendarOrSchedule` | `kHIDUsage_Csmr_ALCalendarOrSchedule` | `0x18e` | - |
| `usage.kHIDUsage_Csmr_ALCheckbookOrFinance` | `kHIDUsage_Csmr_ALCheckbookOrFinance` | `0x191` | - |
| `usage.kHIDUsage_Csmr_ALClock` | `kHIDUsage_Csmr_ALClock` | `0x1b3` | - |
| `usage.kHIDUsage_Csmr_ALCommandLineProcessorOrRun` | `kHIDUsage_Csmr_ALCommandLineProcessorOrRun` | `0x1a0` | - |
| `usage.kHIDUsage_Csmr_ALConsumerControlConfiguration` | `kHIDUsage_Csmr_ALConsumerControlConfiguration` | `0x183` | - |
| `usage.kHIDUsage_Csmr_ALContactsOrAddressBook` | `kHIDUsage_Csmr_ALContactsOrAddressBook` | `0x18d` | - |
| `usage.kHIDUsage_Csmr_ALControlPanel` | `kHIDUsage_Csmr_ALControlPanel` | `0x19f` | - |
| `usage.kHIDUsage_Csmr_ALDatabaseApp` | `kHIDUsage_Csmr_ALDatabaseApp` | `0x189` | - |
| `usage.kHIDUsage_Csmr_ALDesktop` | `kHIDUsage_Csmr_ALDesktop` | `0x1aa` | - |
| `usage.kHIDUsage_Csmr_ALDictionary` | `kHIDUsage_Csmr_ALDictionary` | `0x1a9` | - |
| `usage.kHIDUsage_Csmr_ALDocuments` | `kHIDUsage_Csmr_ALDocuments` | `0x1a7` | - |
| `usage.kHIDUsage_Csmr_ALEmailReader` | `kHIDUsage_Csmr_ALEmailReader` | `0x18a` | - |
| `usage.kHIDUsage_Csmr_ALEncryption` | `kHIDUsage_Csmr_ALEncryption` | `0x1b0` | - |
| `usage.kHIDUsage_Csmr_ALFileBrowser` | `kHIDUsage_Csmr_ALFileBrowser` | `0x1b4` | - |
| `usage.kHIDUsage_Csmr_ALGrammerCheck` | `kHIDUsage_Csmr_ALGrammerCheck` | `0x1ac` | - |
| `usage.kHIDUsage_Csmr_ALGraphicsEditor` | `kHIDUsage_Csmr_ALGraphicsEditor` | `0x187` | - |
| `usage.kHIDUsage_Csmr_ALIntegratedHelpCenter` | `kHIDUsage_Csmr_ALIntegratedHelpCenter` | `0x1a6` | - |
| `usage.kHIDUsage_Csmr_ALInternetBrowser` | `kHIDUsage_Csmr_ALInternetBrowser` | `0x196` | - |
| `usage.kHIDUsage_Csmr_ALKeyboardLayout` | `kHIDUsage_Csmr_ALKeyboardLayout` | `0x1ae` | - |
| `usage.kHIDUsage_Csmr_ALLANOrWANBrowser` | `kHIDUsage_Csmr_ALLANOrWANBrowser` | `0x195` | - |
| `usage.kHIDUsage_Csmr_ALLaunchButtonConfigurationTool` | `kHIDUsage_Csmr_ALLaunchButtonConfigurationTool` | `0x181` | - |
| `usage.kHIDUsage_Csmr_ALLocalMachineBrowser` | `kHIDUsage_Csmr_ALLocalMachineBrowser` | `0x194` | - |
| `usage.kHIDUsage_Csmr_ALLogOrJournalOrTimecard` | `kHIDUsage_Csmr_ALLogOrJournalOrTimecard` | `0x190` | - |
| `usage.kHIDUsage_Csmr_ALLogoff` | `kHIDUsage_Csmr_ALLogoff` | `0x19c` | - |
| `usage.kHIDUsage_Csmr_ALLogon` | `kHIDUsage_Csmr_ALLogon` | `0x19b` | - |
| `usage.kHIDUsage_Csmr_ALLogonOrLogoff` | `kHIDUsage_Csmr_ALLogonOrLogoff` | `0x19d` | - |
| `usage.kHIDUsage_Csmr_ALNetworkChat` | `kHIDUsage_Csmr_ALNetworkChat` | `0x199` | - |
| `usage.kHIDUsage_Csmr_ALNetworkConference` | `kHIDUsage_Csmr_ALNetworkConference` | `0x198` | - |
| `usage.kHIDUsage_Csmr_ALNewsreader` | `kHIDUsage_Csmr_ALNewsreader` | `0x18b` | - |
| `usage.kHIDUsage_Csmr_ALNextTaskOrApplication` | `kHIDUsage_Csmr_ALNextTaskOrApplication` | `0x1a3` | - |
| `usage.kHIDUsage_Csmr_ALPowerStatus` | `kHIDUsage_Csmr_ALPowerStatus` | `0x1b5` | - |
| `usage.kHIDUsage_Csmr_ALPreemptiveHaltTaskOrApplication` | `kHIDUsage_Csmr_ALPreemptiveHaltTaskOrApplication` | `0x1a5` | - |
| `usage.kHIDUsage_Csmr_ALPresentationApp` | `kHIDUsage_Csmr_ALPresentationApp` | `0x188` | - |
| `usage.kHIDUsage_Csmr_ALPreviousTaskOrApplication` | `kHIDUsage_Csmr_ALPreviousTaskOrApplication` | `0x1a4` | - |
| `usage.kHIDUsage_Csmr_ALProcessOrTaskManager` | `kHIDUsage_Csmr_ALProcessOrTaskManager` | `0x1a1` | - |
| `usage.kHIDUsage_Csmr_ALProgrammableButtonConfiguration` | `kHIDUsage_Csmr_ALProgrammableButtonConfiguration` | `0x182` | - |
| `usage.kHIDUsage_Csmr_ALRemoteNetworkingOrISPConnect` | `kHIDUsage_Csmr_ALRemoteNetworkingOrISPConnect` | `0x197` | - |
| `usage.kHIDUsage_Csmr_ALScreenSaver` | `kHIDUsage_Csmr_ALScreenSaver` | `0x1b1` | - |
| `usage.kHIDUsage_Csmr_ALSpellCheck` | `kHIDUsage_Csmr_ALSpellCheck` | `0x1ab` | - |
| `usage.kHIDUsage_Csmr_ALSpreadsheet` | `kHIDUsage_Csmr_ALSpreadsheet` | `0x186` | - |
| `usage.kHIDUsage_Csmr_ALTaskOrProjectManager` | `kHIDUsage_Csmr_ALTaskOrProjectManager` | `0x18f` | - |
| `usage.kHIDUsage_Csmr_ALTelephonyOrDialer` | `kHIDUsage_Csmr_ALTelephonyOrDialer` | `0x19a` | - |
| `usage.kHIDUsage_Csmr_ALTerminalLockOrScreensaver` | `kHIDUsage_Csmr_ALTerminalLockOrScreensaver` | `0x19e` | - |
| `usage.kHIDUsage_Csmr_ALTextEditor` | `kHIDUsage_Csmr_ALTextEditor` | `0x185` | - |
| `usage.kHIDUsage_Csmr_ALThesaurus` | `kHIDUsage_Csmr_ALThesaurus` | `0x1a8` | - |
| `usage.kHIDUsage_Csmr_ALVirusProtection` | `kHIDUsage_Csmr_ALVirusProtection` | `0x1af` | - |
| `usage.kHIDUsage_Csmr_ALVoicemail` | `kHIDUsage_Csmr_ALVoicemail` | `0x18c` | - |
| `usage.kHIDUsage_Csmr_ALWirelessStatus` | `kHIDUsage_Csmr_ALWirelessStatus` | `0x1ad` | - |
| `usage.kHIDUsage_Csmr_ALWordProcessor` | `kHIDUsage_Csmr_ALWordProcessor` | `0x184` | - |
| `usage.kHIDUsage_Csmr_AMOrPM` | `kHIDUsage_Csmr_AMOrPM` | `0x22` | - |
| `usage.kHIDUsage_Csmr_AlternateAudioDecrement` | `kHIDUsage_Csmr_AlternateAudioDecrement` | `0x174` | - |
| `usage.kHIDUsage_Csmr_AlternateAudioIncrement` | `kHIDUsage_Csmr_AlternateAudioIncrement` | `0x173` | - |
| `usage.kHIDUsage_Csmr_ApplicationLaunchButtons` | `kHIDUsage_Csmr_ApplicationLaunchButtons` | `0x180` | - |
| `usage.kHIDUsage_Csmr_Assign` | `kHIDUsage_Csmr_Assign` | `0x81` | - |
| `usage.kHIDUsage_Csmr_Balance` | `kHIDUsage_Csmr_Balance` | `0xe1` | - |
| `usage.kHIDUsage_Csmr_BalanceLeft` | `kHIDUsage_Csmr_BalanceLeft` | `0x151` | - |
| `usage.kHIDUsage_Csmr_BalanceRight` | `kHIDUsage_Csmr_BalanceRight` | `0x150` | - |
| `usage.kHIDUsage_Csmr_Bass` | `kHIDUsage_Csmr_Bass` | `0xe3` | - |
| `usage.kHIDUsage_Csmr_BassBoost` | `kHIDUsage_Csmr_BassBoost` | `0xe5` | - |
| `usage.kHIDUsage_Csmr_BassDecrement` | `kHIDUsage_Csmr_BassDecrement` | `0x153` | - |
| `usage.kHIDUsage_Csmr_BassIncrement` | `kHIDUsage_Csmr_BassIncrement` | `0x152` | - |
| `usage.kHIDUsage_Csmr_BroadcastMode` | `kHIDUsage_Csmr_BroadcastMode` | `0x64` | - |
| `usage.kHIDUsage_Csmr_Channel` | `kHIDUsage_Csmr_Channel` | `0x86` | - |
| `usage.kHIDUsage_Csmr_ChannelCenter` | `kHIDUsage_Csmr_ChannelCenter` | `0x163` | - |
| `usage.kHIDUsage_Csmr_ChannelCenterFront` | `kHIDUsage_Csmr_ChannelCenterFront` | `0x165` | - |
| `usage.kHIDUsage_Csmr_ChannelDecrement` | `kHIDUsage_Csmr_ChannelDecrement` | `0x9d` | - |
| `usage.kHIDUsage_Csmr_ChannelFront` | `kHIDUsage_Csmr_ChannelFront` | `0x164` | - |
| `usage.kHIDUsage_Csmr_ChannelIncrement` | `kHIDUsage_Csmr_ChannelIncrement` | `0x9c` | - |
| `usage.kHIDUsage_Csmr_ChannelLeft` | `kHIDUsage_Csmr_ChannelLeft` | `0x161` | - |
| `usage.kHIDUsage_Csmr_ChannelLowFrequencyEnhancement` | `kHIDUsage_Csmr_ChannelLowFrequencyEnhancement` | `0x168` | - |
| `usage.kHIDUsage_Csmr_ChannelRight` | `kHIDUsage_Csmr_ChannelRight` | `0x162` | - |
| `usage.kHIDUsage_Csmr_ChannelSide` | `kHIDUsage_Csmr_ChannelSide` | `0x166` | - |
| `usage.kHIDUsage_Csmr_ChannelSurround` | `kHIDUsage_Csmr_ChannelSurround` | `0x167` | - |
| `usage.kHIDUsage_Csmr_ChannelTop` | `kHIDUsage_Csmr_ChannelTop` | `0x169` | - |
| `usage.kHIDUsage_Csmr_ChannelUnknown` | `kHIDUsage_Csmr_ChannelUnknown` | `0x16a` | - |
| `usage.kHIDUsage_Csmr_ClearMark` | `kHIDUsage_Csmr_ClearMark` | `0xc3` | - |
| `usage.kHIDUsage_Csmr_ClimateControlEnable` | `kHIDUsage_Csmr_ClimateControlEnable` | `0x104` | - |
| `usage.kHIDUsage_Csmr_ClosedCaption` | `kHIDUsage_Csmr_ClosedCaption` | `0x61` | - |
| `usage.kHIDUsage_Csmr_ClosedCaptionSelect` | `kHIDUsage_Csmr_ClosedCaptionSelect` | `0x62` | - |
| `usage.kHIDUsage_Csmr_ConsumerControl` | `kHIDUsage_Csmr_ConsumerControl` | `0x01` | - |
| `usage.kHIDUsage_Csmr_CounterReset` | `kHIDUsage_Csmr_CounterReset` | `0xc8` | - |
| `usage.kHIDUsage_Csmr_Daily` | `kHIDUsage_Csmr_Daily` | `0xa2` | - |
| `usage.kHIDUsage_Csmr_DataOnScreen` | `kHIDUsage_Csmr_DataOnScreen` | `0x60` | - |
| `usage.kHIDUsage_Csmr_Eject` | `kHIDUsage_Csmr_Eject` | `0xb8` | - |
| `usage.kHIDUsage_Csmr_EnterChannel` | `kHIDUsage_Csmr_EnterChannel` | `0x84` | - |
| `usage.kHIDUsage_Csmr_EnterDisc` | `kHIDUsage_Csmr_EnterDisc` | `0xbb` | - |
| `usage.kHIDUsage_Csmr_ExtendedPlay` | `kHIDUsage_Csmr_ExtendedPlay` | `0xf4` | - |
| `usage.kHIDUsage_Csmr_FanEnable` | `kHIDUsage_Csmr_FanEnable` | `0x100` | - |
| `usage.kHIDUsage_Csmr_FanSpeed` | `kHIDUsage_Csmr_FanSpeed` | `0x101` | - |
| `usage.kHIDUsage_Csmr_FastForward` | `kHIDUsage_Csmr_FastForward` | `0xb3` | - |
| `usage.kHIDUsage_Csmr_FireAlarm` | `kHIDUsage_Csmr_FireAlarm` | `0x107` | - |
| `usage.kHIDUsage_Csmr_FrameBack` | `kHIDUsage_Csmr_FrameBack` | `0xc1` | - |
| `usage.kHIDUsage_Csmr_FrameForward` | `kHIDUsage_Csmr_FrameForward` | `0xc0` | - |
| `usage.kHIDUsage_Csmr_FunctionButtons` | `kHIDUsage_Csmr_FunctionButtons` | `0x36` | - |
| `usage.kHIDUsage_Csmr_GenericGUIApplicationControls` | `kHIDUsage_Csmr_GenericGUIApplicationControls` | `0x200` | - |
| `usage.kHIDUsage_Csmr_Help` | `kHIDUsage_Csmr_Help` | `0x95` | - |
| `usage.kHIDUsage_Csmr_Illumination` | `kHIDUsage_Csmr_Illumination` | `0x35` | - |
| `usage.kHIDUsage_Csmr_LightEnable` | `kHIDUsage_Csmr_LightEnable` | `0x102` | - |
| `usage.kHIDUsage_Csmr_LightIlluminationLevel` | `kHIDUsage_Csmr_LightIlluminationLevel` | `0x103` | - |
| `usage.kHIDUsage_Csmr_LongPlay` | `kHIDUsage_Csmr_LongPlay` | `0xf3` | - |
| `usage.kHIDUsage_Csmr_Loudness` | `kHIDUsage_Csmr_Loudness` | `0xe7` | - |
| `usage.kHIDUsage_Csmr_MPX` | `kHIDUsage_Csmr_MPX` | `0xe8` | - |
| `usage.kHIDUsage_Csmr_Mark` | `kHIDUsage_Csmr_Mark` | `0xc2` | - |
| `usage.kHIDUsage_Csmr_Media` | `kHIDUsage_Csmr_Media` | `0x9e` | - |
| `usage.kHIDUsage_Csmr_MediaSelectCD` | `kHIDUsage_Csmr_MediaSelectCD` | `0x91` | - |
| `usage.kHIDUsage_Csmr_MediaSelectCable` | `kHIDUsage_Csmr_MediaSelectCable` | `0x97` | - |
| `usage.kHIDUsage_Csmr_MediaSelectCall` | `kHIDUsage_Csmr_MediaSelectCall` | `0x9b` | - |
| `usage.kHIDUsage_Csmr_MediaSelectComputer` | `kHIDUsage_Csmr_MediaSelectComputer` | `0x88` | - |
| `usage.kHIDUsage_Csmr_MediaSelectDVD` | `kHIDUsage_Csmr_MediaSelectDVD` | `0x8b` | - |
| `usage.kHIDUsage_Csmr_MediaSelectGames` | `kHIDUsage_Csmr_MediaSelectGames` | `0x8f` | - |
| `usage.kHIDUsage_Csmr_MediaSelectHome` | `kHIDUsage_Csmr_MediaSelectHome` | `0x9a` | - |
| `usage.kHIDUsage_Csmr_MediaSelectMessages` | `kHIDUsage_Csmr_MediaSelectMessages` | `0x90` | - |
| `usage.kHIDUsage_Csmr_MediaSelectProgramGuide` | `kHIDUsage_Csmr_MediaSelectProgramGuide` | `0x8d` | - |
| `usage.kHIDUsage_Csmr_MediaSelectSatellite` | `kHIDUsage_Csmr_MediaSelectSatellite` | `0x98` | - |
| `usage.kHIDUsage_Csmr_MediaSelectSecurity` | `kHIDUsage_Csmr_MediaSelectSecurity` | `0x99` | - |
| `usage.kHIDUsage_Csmr_MediaSelectTV` | `kHIDUsage_Csmr_MediaSelectTV` | `0x89` | - |
| `usage.kHIDUsage_Csmr_MediaSelectTape` | `kHIDUsage_Csmr_MediaSelectTape` | `0x96` | - |
| `usage.kHIDUsage_Csmr_MediaSelectTelephone` | `kHIDUsage_Csmr_MediaSelectTelephone` | `0x8c` | - |
| `usage.kHIDUsage_Csmr_MediaSelectTuner` | `kHIDUsage_Csmr_MediaSelectTuner` | `0x93` | - |
| `usage.kHIDUsage_Csmr_MediaSelectVCR` | `kHIDUsage_Csmr_MediaSelectVCR` | `0x92` | - |
| `usage.kHIDUsage_Csmr_MediaSelectVideoPhone` | `kHIDUsage_Csmr_MediaSelectVideoPhone` | `0x8e` | - |
| `usage.kHIDUsage_Csmr_MediaSelectWWW` | `kHIDUsage_Csmr_MediaSelectWWW` | `0x8a` | - |
| `usage.kHIDUsage_Csmr_MediaSelection` | `kHIDUsage_Csmr_MediaSelection` | `0x87` | - |
| `usage.kHIDUsage_Csmr_Menu` | `kHIDUsage_Csmr_Menu` | `0x40` | - |
| `usage.kHIDUsage_Csmr_MenuDown` | `kHIDUsage_Csmr_MenuDown` | `0x43` | - |
| `usage.kHIDUsage_Csmr_MenuEscape` | `kHIDUsage_Csmr_MenuEscape` | `0x46` | - |
| `usage.kHIDUsage_Csmr_MenuLeft` | `kHIDUsage_Csmr_MenuLeft` | `0x44` | - |
| `usage.kHIDUsage_Csmr_MenuPick` | `kHIDUsage_Csmr_MenuPick` | `0x41` | - |
| `usage.kHIDUsage_Csmr_MenuRight` | `kHIDUsage_Csmr_MenuRight` | `0x45` | - |
| `usage.kHIDUsage_Csmr_MenuUp` | `kHIDUsage_Csmr_MenuUp` | `0x42` | - |
| `usage.kHIDUsage_Csmr_MenuValueDecrease` | `kHIDUsage_Csmr_MenuValueDecrease` | `0x48` | - |
| `usage.kHIDUsage_Csmr_MenuValueIncrease` | `kHIDUsage_Csmr_MenuValueIncrease` | `0x47` | - |
| `usage.kHIDUsage_Csmr_ModeStep` | `kHIDUsage_Csmr_ModeStep` | `0x82` | - |
| `usage.kHIDUsage_Csmr_Monthly` | `kHIDUsage_Csmr_Monthly` | `0xa4` | - |
| `usage.kHIDUsage_Csmr_Mute` | `kHIDUsage_Csmr_Mute` | `0xe2` | - |
| `usage.kHIDUsage_Csmr_NumericKeyPad` | `kHIDUsage_Csmr_NumericKeyPad` | `0x02` | - |
| `usage.kHIDUsage_Csmr_Once` | `kHIDUsage_Csmr_Once` | `0xa1` | - |
| `usage.kHIDUsage_Csmr_OrderMovie` | `kHIDUsage_Csmr_OrderMovie` | `0x85` | - |
| `usage.kHIDUsage_Csmr_Pause` | `kHIDUsage_Csmr_Pause` | `0xb1` | - |
| `usage.kHIDUsage_Csmr_Play` | `kHIDUsage_Csmr_Play` | `0xb0` | - |
| `usage.kHIDUsage_Csmr_PlayOrPause` | `kHIDUsage_Csmr_PlayOrPause` | `0xcd` | - |
| `usage.kHIDUsage_Csmr_PlayOrSkip` | `kHIDUsage_Csmr_PlayOrSkip` | `0xce` | - |
| `usage.kHIDUsage_Csmr_PlaybackSpeed` | `kHIDUsage_Csmr_PlaybackSpeed` | `0xf1` | - |
| `usage.kHIDUsage_Csmr_Plus10` | `kHIDUsage_Csmr_Plus10` | `0x20` | - |
| `usage.kHIDUsage_Csmr_Plus100` | `kHIDUsage_Csmr_Plus100` | `0x21` | - |
| `usage.kHIDUsage_Csmr_PoliceAlarm` | `kHIDUsage_Csmr_PoliceAlarm` | `0x108` | - |
| `usage.kHIDUsage_Csmr_Power` | `kHIDUsage_Csmr_Power` | `0x30` | - |
| `usage.kHIDUsage_Csmr_ProgrammableButtons` | `kHIDUsage_Csmr_ProgrammableButtons` | `0x03` | - |
| `usage.kHIDUsage_Csmr_Quit` | `kHIDUsage_Csmr_Quit` | `0x94` | - |
| `usage.kHIDUsage_Csmr_RandomPlay` | `kHIDUsage_Csmr_RandomPlay` | `0xb9` | - |
| `usage.kHIDUsage_Csmr_RecallLast` | `kHIDUsage_Csmr_RecallLast` | `0x83` | - |
| `usage.kHIDUsage_Csmr_Record` | `kHIDUsage_Csmr_Record` | `0xb2` | - |
| `usage.kHIDUsage_Csmr_Repeat` | `kHIDUsage_Csmr_Repeat` | `0xbc` | - |
| `usage.kHIDUsage_Csmr_RepeatFromMark` | `kHIDUsage_Csmr_RepeatFromMark` | `0xc4` | - |
| `usage.kHIDUsage_Csmr_Reserved` | `kHIDUsage_Csmr_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Csmr_Reset` | `kHIDUsage_Csmr_Reset` | `0x31` | - |
| `usage.kHIDUsage_Csmr_ReturnToMark` | `kHIDUsage_Csmr_ReturnToMark` | `0xc5` | - |
| `usage.kHIDUsage_Csmr_Rewind` | `kHIDUsage_Csmr_Rewind` | `0xb4` | - |
| `usage.kHIDUsage_Csmr_RoomTemperature` | `kHIDUsage_Csmr_RoomTemperature` | `0x105` | - |
| `usage.kHIDUsage_Csmr_ScanNextTrack` | `kHIDUsage_Csmr_ScanNextTrack` | `0xb5` | - |
| `usage.kHIDUsage_Csmr_ScanPreviousTrack` | `kHIDUsage_Csmr_ScanPreviousTrack` | `0xb6` | - |
| `usage.kHIDUsage_Csmr_SearchMarkBackwards` | `kHIDUsage_Csmr_SearchMarkBackwards` | `0xc7` | - |
| `usage.kHIDUsage_Csmr_SearchMarkForward` | `kHIDUsage_Csmr_SearchMarkForward` | `0xc6` | - |
| `usage.kHIDUsage_Csmr_SecurityEnable` | `kHIDUsage_Csmr_SecurityEnable` | `0x106` | - |
| `usage.kHIDUsage_Csmr_SelectDisc` | `kHIDUsage_Csmr_SelectDisc` | `0xba` | - |
| `usage.kHIDUsage_Csmr_Selection` | `kHIDUsage_Csmr_Selection` | `0x80` | - |
| `usage.kHIDUsage_Csmr_ShowCounter` | `kHIDUsage_Csmr_ShowCounter` | `0xc9` | - |
| `usage.kHIDUsage_Csmr_Sleep` | `kHIDUsage_Csmr_Sleep` | `0x32` | - |
| `usage.kHIDUsage_Csmr_SleepAfter` | `kHIDUsage_Csmr_SleepAfter` | `0x33` | - |
| `usage.kHIDUsage_Csmr_SleepMode` | `kHIDUsage_Csmr_SleepMode` | `0x34` | - |
| `usage.kHIDUsage_Csmr_Slow` | `kHIDUsage_Csmr_Slow` | `0xf5` | - |
| `usage.kHIDUsage_Csmr_SlowTracking` | `kHIDUsage_Csmr_SlowTracking` | `0xbf` | - |
| `usage.kHIDUsage_Csmr_Snapshot` | `kHIDUsage_Csmr_Snapshot` | `0x65` | - |
| `usage.kHIDUsage_Csmr_SpeakerSystem` | `kHIDUsage_Csmr_SpeakerSystem` | `0x160` | - |
| `usage.kHIDUsage_Csmr_Speed` | `kHIDUsage_Csmr_Speed` | `0xf0` | - |
| `usage.kHIDUsage_Csmr_StandardPlay` | `kHIDUsage_Csmr_StandardPlay` | `0xf2` | - |
| `usage.kHIDUsage_Csmr_Still` | `kHIDUsage_Csmr_Still` | `0x66` | - |
| `usage.kHIDUsage_Csmr_Stop` | `kHIDUsage_Csmr_Stop` | `0xb7` | - |
| `usage.kHIDUsage_Csmr_StopOrEject` | `kHIDUsage_Csmr_StopOrEject` | `0xcc` | - |
| `usage.kHIDUsage_Csmr_SubChannel` | `kHIDUsage_Csmr_SubChannel` | `0x170` | - |
| `usage.kHIDUsage_Csmr_SubChannelDecrement` | `kHIDUsage_Csmr_SubChannelDecrement` | `0x172` | - |
| `usage.kHIDUsage_Csmr_SubChannelIncrement` | `kHIDUsage_Csmr_SubChannelIncrement` | `0x171` | - |
| `usage.kHIDUsage_Csmr_SurroundMode` | `kHIDUsage_Csmr_SurroundMode` | `0xe6` | - |
| `usage.kHIDUsage_Csmr_TrackNormal` | `kHIDUsage_Csmr_TrackNormal` | `0xbe` | - |
| `usage.kHIDUsage_Csmr_Tracking` | `kHIDUsage_Csmr_Tracking` | `0xbd` | - |
| `usage.kHIDUsage_Csmr_TrackingDecrement` | `kHIDUsage_Csmr_TrackingDecrement` | `0xcb` | - |
| `usage.kHIDUsage_Csmr_TrackingIncrement` | `kHIDUsage_Csmr_TrackingIncrement` | `0xca` | - |
| `usage.kHIDUsage_Csmr_Treble` | `kHIDUsage_Csmr_Treble` | `0xe4` | - |
| `usage.kHIDUsage_Csmr_TrebleDecrement` | `kHIDUsage_Csmr_TrebleDecrement` | `0x155` | - |
| `usage.kHIDUsage_Csmr_TrebleIncrement` | `kHIDUsage_Csmr_TrebleIncrement` | `0x154` | - |
| `usage.kHIDUsage_Csmr_VCROrTV` | `kHIDUsage_Csmr_VCROrTV` | `0x63` | - |
| `usage.kHIDUsage_Csmr_VCRPlus` | `kHIDUsage_Csmr_VCRPlus` | `0xa0` | - |
| `usage.kHIDUsage_Csmr_Volume` | `kHIDUsage_Csmr_Volume` | `0xe0` | - |
| `usage.kHIDUsage_Csmr_VolumeDecrement` | `kHIDUsage_Csmr_VolumeDecrement` | `0xea` | - |
| `usage.kHIDUsage_Csmr_VolumeIncrement` | `kHIDUsage_Csmr_VolumeIncrement` | `0xe9` | - |
| `usage.kHIDUsage_Csmr_Weekly` | `kHIDUsage_Csmr_Weekly` | `0xa3` | - |
| `usage.kHIDUsage_Dig_3DDigitizer` | `kHIDUsage_Dig_3DDigitizer` | `0x08` | - |
| `usage.kHIDUsage_Dig_Altitude` | `kHIDUsage_Dig_Altitude` | `0x40` | - |
| `usage.kHIDUsage_Dig_Armature` | `kHIDUsage_Dig_Armature` | `0x0b` | - |
| `usage.kHIDUsage_Dig_ArticulatedArm` | `kHIDUsage_Dig_ArticulatedArm` | `0x0a` | - |
| `usage.kHIDUsage_Dig_Azimuth` | `kHIDUsage_Dig_Azimuth` | `0x3f` | - |
| `usage.kHIDUsage_Dig_BarrelPressure` | `kHIDUsage_Dig_BarrelPressure` | `0x31` | - |
| `usage.kHIDUsage_Dig_BarrelSwitch` | `kHIDUsage_Dig_BarrelSwitch` | `0x44` | - |
| `usage.kHIDUsage_Dig_BatteryStrength` | `kHIDUsage_Dig_BatteryStrength` | `0x3b` | - |
| `usage.kHIDUsage_Dig_CoordinateMeasuringMachine` | `kHIDUsage_Dig_CoordinateMeasuringMachine` | `0x07` | - |
| `usage.kHIDUsage_Dig_DataValid` | `kHIDUsage_Dig_DataValid` | `0x37` | - |
| `usage.kHIDUsage_Dig_Digitizer` | `kHIDUsage_Dig_Digitizer` | `0x01` | - |
| `usage.kHIDUsage_Dig_Eraser` | `kHIDUsage_Dig_Eraser` | `0x45` | - |
| `usage.kHIDUsage_Dig_Finger` | `kHIDUsage_Dig_Finger` | `0x22` | - |
| `usage.kHIDUsage_Dig_FreeSpaceWand` | `kHIDUsage_Dig_FreeSpaceWand` | `0x0d` | - |
| `usage.kHIDUsage_Dig_InRange` | `kHIDUsage_Dig_InRange` | `0x32` | - |
| `usage.kHIDUsage_Dig_Invert` | `kHIDUsage_Dig_Invert` | `0x3c` | - |
| `usage.kHIDUsage_Dig_LightPen` | `kHIDUsage_Dig_LightPen` | `0x03` | - |
| `usage.kHIDUsage_Dig_MultiplePointDigitizer` | `kHIDUsage_Dig_MultiplePointDigitizer` | `0x0c` | - |
| `usage.kHIDUsage_Dig_Pen` | `kHIDUsage_Dig_Pen` | `0x02` | - |
| `usage.kHIDUsage_Dig_ProgramChangeKeys` | `kHIDUsage_Dig_ProgramChangeKeys` | `0x3a` | - |
| `usage.kHIDUsage_Dig_Puck` | `kHIDUsage_Dig_Puck` | `0x21` | - |
| `usage.kHIDUsage_Dig_Quality` | `kHIDUsage_Dig_Quality` | `0x36` | - |
| `usage.kHIDUsage_Dig_Reserved` | `kHIDUsage_Dig_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Dig_SecondaryTipSwitch` | `kHIDUsage_Dig_SecondaryTipSwitch` | `0x43` | - |
| `usage.kHIDUsage_Dig_StereoPlotter` | `kHIDUsage_Dig_StereoPlotter` | `0x09` | - |
| `usage.kHIDUsage_Dig_Stylus` | `kHIDUsage_Dig_Stylus` | `0x20` | - |
| `usage.kHIDUsage_Dig_TabletFunctionKeys` | `kHIDUsage_Dig_TabletFunctionKeys` | `0x39` | - |
| `usage.kHIDUsage_Dig_TabletPick` | `kHIDUsage_Dig_TabletPick` | `0x46` | - |
| `usage.kHIDUsage_Dig_Tap` | `kHIDUsage_Dig_Tap` | `0x35` | - |
| `usage.kHIDUsage_Dig_TipPressure` | `kHIDUsage_Dig_TipPressure` | `0x30` | - |
| `usage.kHIDUsage_Dig_TipSwitch` | `kHIDUsage_Dig_TipSwitch` | `0x42` | - |
| `usage.kHIDUsage_Dig_Touch` | `kHIDUsage_Dig_Touch` | `0x33` | - |
| `usage.kHIDUsage_Dig_TouchPad` | `kHIDUsage_Dig_TouchPad` | `0x05` | - |
| `usage.kHIDUsage_Dig_TouchScreen` | `kHIDUsage_Dig_TouchScreen` | `0x04` | - |
| `usage.kHIDUsage_Dig_TransducerIndex` | `kHIDUsage_Dig_TransducerIndex` | `0x38` | - |
| `usage.kHIDUsage_Dig_Twist` | `kHIDUsage_Dig_Twist` | `0x41` | - |
| `usage.kHIDUsage_Dig_Untouch` | `kHIDUsage_Dig_Untouch` | `0x34` | - |
| `usage.kHIDUsage_Dig_WhiteBoard` | `kHIDUsage_Dig_WhiteBoard` | `0x06` | - |
| `usage.kHIDUsage_Dig_XTilt` | `kHIDUsage_Dig_XTilt` | `0x3d` | - |
| `usage.kHIDUsage_Dig_YTilt` | `kHIDUsage_Dig_YTilt` | `0x3e` | - |
| `usage.kHIDUsage_GD_ByteCount` | `kHIDUsage_GD_ByteCount` | `0x3b` | - |
| `usage.kHIDUsage_GD_CountedBuffer` | `kHIDUsage_GD_CountedBuffer` | `0x3a` | - |
| `usage.kHIDUsage_GD_DPadDown` | `kHIDUsage_GD_DPadDown` | `0x91` | - |
| `usage.kHIDUsage_GD_DPadLeft` | `kHIDUsage_GD_DPadLeft` | `0x93` | - |
| `usage.kHIDUsage_GD_DPadRight` | `kHIDUsage_GD_DPadRight` | `0x92` | - |
| `usage.kHIDUsage_GD_DPadUp` | `kHIDUsage_GD_DPadUp` | `0x90` | - |
| `usage.kHIDUsage_GD_Dial` | `kHIDUsage_GD_Dial` | `0x37` | - |
| `usage.kHIDUsage_GD_GamePad` | `kHIDUsage_GD_GamePad` | `0x05` | - |
| `usage.kHIDUsage_GD_Hatswitch` | `kHIDUsage_GD_Hatswitch` | `0x39` | - |
| `usage.kHIDUsage_GD_Joystick` | `kHIDUsage_GD_Joystick` | `0x04` | - |
| `usage.kHIDUsage_GD_Keyboard` | `kHIDUsage_GD_Keyboard` | `0x06` | - |
| `usage.kHIDUsage_GD_Keypad` | `kHIDUsage_GD_Keypad` | `0x07` | - |
| `usage.kHIDUsage_GD_MotionWakeup` | `kHIDUsage_GD_MotionWakeup` | `0x3c` | - |
| `usage.kHIDUsage_GD_Mouse` | `kHIDUsage_GD_Mouse` | `0x02` | - |
| `usage.kHIDUsage_GD_MultiAxisController` | `kHIDUsage_GD_MultiAxisController` | `0x08` | - |
| `usage.kHIDUsage_GD_Pointer` | `kHIDUsage_GD_Pointer` | `0x01` | - |
| `usage.kHIDUsage_GD_Reserved` | `kHIDUsage_GD_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_GD_Rx` | `kHIDUsage_GD_Rx` | `0x33` | - |
| `usage.kHIDUsage_GD_Ry` | `kHIDUsage_GD_Ry` | `0x34` | - |
| `usage.kHIDUsage_GD_Rz` | `kHIDUsage_GD_Rz` | `0x35` | - |
| `usage.kHIDUsage_GD_Select` | `kHIDUsage_GD_Select` | `0x3e` | - |
| `usage.kHIDUsage_GD_Slider` | `kHIDUsage_GD_Slider` | `0x36` | - |
| `usage.kHIDUsage_GD_Start` | `kHIDUsage_GD_Start` | `0x3d` | - |
| `usage.kHIDUsage_GD_SystemAppMenu` | `kHIDUsage_GD_SystemAppMenu` | `0x86` | - |
| `usage.kHIDUsage_GD_SystemContextMenu` | `kHIDUsage_GD_SystemContextMenu` | `0x84` | - |
| `usage.kHIDUsage_GD_SystemControl` | `kHIDUsage_GD_SystemControl` | `0x80` | - |
| `usage.kHIDUsage_GD_SystemMainMenu` | `kHIDUsage_GD_SystemMainMenu` | `0x85` | - |
| `usage.kHIDUsage_GD_SystemMenu` | `kHIDUsage_GD_SystemMenu` | `0x89` | - |
| `usage.kHIDUsage_GD_SystemMenuDown` | `kHIDUsage_GD_SystemMenuDown` | `0x8d` | - |
| `usage.kHIDUsage_GD_SystemMenuExit` | `kHIDUsage_GD_SystemMenuExit` | `0x88` | - |
| `usage.kHIDUsage_GD_SystemMenuHelp` | `kHIDUsage_GD_SystemMenuHelp` | `0x87` | - |
| `usage.kHIDUsage_GD_SystemMenuLeft` | `kHIDUsage_GD_SystemMenuLeft` | `0x8b` | - |
| `usage.kHIDUsage_GD_SystemMenuRight` | `kHIDUsage_GD_SystemMenuRight` | `0x8a` | - |
| `usage.kHIDUsage_GD_SystemMenuUp` | `kHIDUsage_GD_SystemMenuUp` | `0x8c` | - |
| `usage.kHIDUsage_GD_SystemPowerDown` | `kHIDUsage_GD_SystemPowerDown` | `0x81` | - |
| `usage.kHIDUsage_GD_SystemSleep` | `kHIDUsage_GD_SystemSleep` | `0x82` | - |
| `usage.kHIDUsage_GD_SystemWakeUp` | `kHIDUsage_GD_SystemWakeUp` | `0x83` | - |
| `usage.kHIDUsage_GD_Vbrx` | `kHIDUsage_GD_Vbrx` | `0x43` | - |
| `usage.kHIDUsage_GD_Vbry` | `kHIDUsage_GD_Vbry` | `0x44` | - |
| `usage.kHIDUsage_GD_Vbrz` | `kHIDUsage_GD_Vbrz` | `0x45` | - |
| `usage.kHIDUsage_GD_Vno` | `kHIDUsage_GD_Vno` | `0x46` | - |
| `usage.kHIDUsage_GD_Vx` | `kHIDUsage_GD_Vx` | `0x40` | - |
| `usage.kHIDUsage_GD_Vy` | `kHIDUsage_GD_Vy` | `0x41` | - |
| `usage.kHIDUsage_GD_Vz` | `kHIDUsage_GD_Vz` | `0x42` | - |
| `usage.kHIDUsage_GD_Wheel` | `kHIDUsage_GD_Wheel` | `0x38` | - |
| `usage.kHIDUsage_GD_X` | `kHIDUsage_GD_X` | `0x30` | - |
| `usage.kHIDUsage_GD_Y` | `kHIDUsage_GD_Y` | `0x31` | - |
| `usage.kHIDUsage_GD_Z` | `kHIDUsage_GD_Z` | `0x32` | - |
| `usage.kHIDUsage_Game_3DGameController` | `kHIDUsage_Game_3DGameController` | `0x01` | - |
| `usage.kHIDUsage_Game_Bump` | `kHIDUsage_Game_Bump` | `0x2c` | - |
| `usage.kHIDUsage_Game_Flipper` | `kHIDUsage_Game_Flipper` | `0x2a` | - |
| `usage.kHIDUsage_Game_GamepadFireOrJump` | `kHIDUsage_Game_GamepadFireOrJump` | `0x37` | - |
| `usage.kHIDUsage_Game_GamepadTrigger` | `kHIDUsage_Game_GamepadTrigger` | `0x39` | - |
| `usage.kHIDUsage_Game_Gun` | `kHIDUsage_Game_Gun` | `0x32` | - |
| `usage.kHIDUsage_Game_GunAutomatic` | `kHIDUsage_Game_GunAutomatic` | `0x35` | - |
| `usage.kHIDUsage_Game_GunBolt` | `kHIDUsage_Game_GunBolt` | `0x30` | - |
| `usage.kHIDUsage_Game_GunBurst` | `kHIDUsage_Game_GunBurst` | `0x34` | - |
| `usage.kHIDUsage_Game_GunClip` | `kHIDUsage_Game_GunClip` | `0x31` | - |
| `usage.kHIDUsage_Game_GunDevice` | `kHIDUsage_Game_GunDevice` | `0x03` | - |
| `usage.kHIDUsage_Game_GunSafety` | `kHIDUsage_Game_GunSafety` | `0x36` | - |
| `usage.kHIDUsage_Game_GunSingleShot` | `kHIDUsage_Game_GunSingleShot` | `0x33` | - |
| `usage.kHIDUsage_Game_HeightOfPOV` | `kHIDUsage_Game_HeightOfPOV` | `0x29` | - |
| `usage.kHIDUsage_Game_LeanForwardOrBackward` | `kHIDUsage_Game_LeanForwardOrBackward` | `0x28` | - |
| `usage.kHIDUsage_Game_LeanRightOrLeft` | `kHIDUsage_Game_LeanRightOrLeft` | `0x27` | - |
| `usage.kHIDUsage_Game_MoveForwardOrBackward` | `kHIDUsage_Game_MoveForwardOrBackward` | `0x25` | - |
| `usage.kHIDUsage_Game_MoveRightOrLeft` | `kHIDUsage_Game_MoveRightOrLeft` | `0x24` | - |
| `usage.kHIDUsage_Game_MoveUpOrDown` | `kHIDUsage_Game_MoveUpOrDown` | `0x26` | - |
| `usage.kHIDUsage_Game_NewGame` | `kHIDUsage_Game_NewGame` | `0x2d` | - |
| `usage.kHIDUsage_Game_PinballDevice` | `kHIDUsage_Game_PinballDevice` | `0x02` | - |
| `usage.kHIDUsage_Game_PitchUpOrDown` | `kHIDUsage_Game_PitchUpOrDown` | `0x22` | - |
| `usage.kHIDUsage_Game_Player` | `kHIDUsage_Game_Player` | `0x2f` | - |
| `usage.kHIDUsage_Game_PointofView` | `kHIDUsage_Game_PointofView` | `0x20` | - |
| `usage.kHIDUsage_Game_Reserved` | `kHIDUsage_Game_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Game_RollRightOrLeft` | `kHIDUsage_Game_RollRightOrLeft` | `0x23` | - |
| `usage.kHIDUsage_Game_SecondaryFlipper` | `kHIDUsage_Game_SecondaryFlipper` | `0x2b` | - |
| `usage.kHIDUsage_Game_ShootBall` | `kHIDUsage_Game_ShootBall` | `0x2e` | - |
| `usage.kHIDUsage_Game_TurnRightOrLeft` | `kHIDUsage_Game_TurnRightOrLeft` | `0x21` | - |
| `usage.kHIDUsage_Keyboard0` | `kHIDUsage_Keyboard0` | `0x27` | - |
| `usage.kHIDUsage_Keyboard1` | `kHIDUsage_Keyboard1` | `0x1e` | - |
| `usage.kHIDUsage_Keyboard2` | `kHIDUsage_Keyboard2` | `0x1f` | - |
| `usage.kHIDUsage_Keyboard3` | `kHIDUsage_Keyboard3` | `0x20` | - |
| `usage.kHIDUsage_Keyboard4` | `kHIDUsage_Keyboard4` | `0x21` | - |
| `usage.kHIDUsage_Keyboard5` | `kHIDUsage_Keyboard5` | `0x22` | - |
| `usage.kHIDUsage_Keyboard6` | `kHIDUsage_Keyboard6` | `0x23` | - |
| `usage.kHIDUsage_Keyboard7` | `kHIDUsage_Keyboard7` | `0x24` | - |
| `usage.kHIDUsage_Keyboard8` | `kHIDUsage_Keyboard8` | `0x25` | - |
| `usage.kHIDUsage_Keyboard9` | `kHIDUsage_Keyboard9` | `0x26` | - |
| `usage.kHIDUsage_KeyboardA` | `kHIDUsage_KeyboardA` | `0x04` | - |
| `usage.kHIDUsage_KeyboardAgain` | `kHIDUsage_KeyboardAgain` | `0x79` | - |
| `usage.kHIDUsage_KeyboardAlternateErase` | `kHIDUsage_KeyboardAlternateErase` | `0x99` | - |
| `usage.kHIDUsage_KeyboardApplication` | `kHIDUsage_KeyboardApplication` | `0x65` | - |
| `usage.kHIDUsage_KeyboardB` | `kHIDUsage_KeyboardB` | `0x05` | - |
| `usage.kHIDUsage_KeyboardBackslash` | `kHIDUsage_KeyboardBackslash` | `0x31` | - |
| `usage.kHIDUsage_KeyboardC` | `kHIDUsage_KeyboardC` | `0x06` | - |
| `usage.kHIDUsage_KeyboardCancel` | `kHIDUsage_KeyboardCancel` | `0x9b` | - |
| `usage.kHIDUsage_KeyboardCapsLock` | `kHIDUsage_KeyboardCapsLock` | `0x39` | - |
| `usage.kHIDUsage_KeyboardClear` | `kHIDUsage_KeyboardClear` | `0x9c` | - |
| `usage.kHIDUsage_KeyboardClearOrAgain` | `kHIDUsage_KeyboardClearOrAgain` | `0xa2` | - |
| `usage.kHIDUsage_KeyboardCloseBracket` | `kHIDUsage_KeyboardCloseBracket` | `0x30` | - |
| `usage.kHIDUsage_KeyboardComma` | `kHIDUsage_KeyboardComma` | `0x36` | - |
| `usage.kHIDUsage_KeyboardCopy` | `kHIDUsage_KeyboardCopy` | `0x7c` | - |
| `usage.kHIDUsage_KeyboardCrSelOrProps` | `kHIDUsage_KeyboardCrSelOrProps` | `0xa3` | - |
| `usage.kHIDUsage_KeyboardCut` | `kHIDUsage_KeyboardCut` | `0x7b` | - |
| `usage.kHIDUsage_KeyboardD` | `kHIDUsage_KeyboardD` | `0x07` | - |
| `usage.kHIDUsage_KeyboardDeleteForward` | `kHIDUsage_KeyboardDeleteForward` | `0x4c` | - |
| `usage.kHIDUsage_KeyboardDeleteOrBackspace` | `kHIDUsage_KeyboardDeleteOrBackspace` | `0x2a` | - |
| `usage.kHIDUsage_KeyboardDownArrow` | `kHIDUsage_KeyboardDownArrow` | `0x51` | - |
| `usage.kHIDUsage_KeyboardE` | `kHIDUsage_KeyboardE` | `0x08` | - |
| `usage.kHIDUsage_KeyboardEnd` | `kHIDUsage_KeyboardEnd` | `0x4d` | - |
| `usage.kHIDUsage_KeyboardEqualSign` | `kHIDUsage_KeyboardEqualSign` | `0x2e` | - |
| `usage.kHIDUsage_KeyboardErrorRollOver` | `kHIDUsage_KeyboardErrorRollOver` | `0x01` | - |
| `usage.kHIDUsage_KeyboardErrorUndefined` | `kHIDUsage_KeyboardErrorUndefined` | `0x03` | - |
| `usage.kHIDUsage_KeyboardEscape` | `kHIDUsage_KeyboardEscape` | `0x29` | - |
| `usage.kHIDUsage_KeyboardExSel` | `kHIDUsage_KeyboardExSel` | `0xa4` | - |
| `usage.kHIDUsage_KeyboardExecute` | `kHIDUsage_KeyboardExecute` | `0x74` | - |
| `usage.kHIDUsage_KeyboardF` | `kHIDUsage_KeyboardF` | `0x09` | - |
| `usage.kHIDUsage_KeyboardF1` | `kHIDUsage_KeyboardF1` | `0x3a` | - |
| `usage.kHIDUsage_KeyboardF10` | `kHIDUsage_KeyboardF10` | `0x43` | - |
| `usage.kHIDUsage_KeyboardF11` | `kHIDUsage_KeyboardF11` | `0x44` | - |
| `usage.kHIDUsage_KeyboardF12` | `kHIDUsage_KeyboardF12` | `0x45` | - |
| `usage.kHIDUsage_KeyboardF13` | `kHIDUsage_KeyboardF13` | `0x68` | - |
| `usage.kHIDUsage_KeyboardF14` | `kHIDUsage_KeyboardF14` | `0x69` | - |
| `usage.kHIDUsage_KeyboardF15` | `kHIDUsage_KeyboardF15` | `0x6a` | - |
| `usage.kHIDUsage_KeyboardF16` | `kHIDUsage_KeyboardF16` | `0x6b` | - |
| `usage.kHIDUsage_KeyboardF17` | `kHIDUsage_KeyboardF17` | `0x6c` | - |
| `usage.kHIDUsage_KeyboardF18` | `kHIDUsage_KeyboardF18` | `0x6d` | - |
| `usage.kHIDUsage_KeyboardF19` | `kHIDUsage_KeyboardF19` | `0x6e` | - |
| `usage.kHIDUsage_KeyboardF2` | `kHIDUsage_KeyboardF2` | `0x3b` | - |
| `usage.kHIDUsage_KeyboardF20` | `kHIDUsage_KeyboardF20` | `0x6f` | - |
| `usage.kHIDUsage_KeyboardF21` | `kHIDUsage_KeyboardF21` | `0x70` | - |
| `usage.kHIDUsage_KeyboardF22` | `kHIDUsage_KeyboardF22` | `0x71` | - |
| `usage.kHIDUsage_KeyboardF23` | `kHIDUsage_KeyboardF23` | `0x72` | - |
| `usage.kHIDUsage_KeyboardF24` | `kHIDUsage_KeyboardF24` | `0x73` | - |
| `usage.kHIDUsage_KeyboardF3` | `kHIDUsage_KeyboardF3` | `0x3c` | - |
| `usage.kHIDUsage_KeyboardF4` | `kHIDUsage_KeyboardF4` | `0x3d` | - |
| `usage.kHIDUsage_KeyboardF5` | `kHIDUsage_KeyboardF5` | `0x3e` | - |
| `usage.kHIDUsage_KeyboardF6` | `kHIDUsage_KeyboardF6` | `0x3f` | - |
| `usage.kHIDUsage_KeyboardF7` | `kHIDUsage_KeyboardF7` | `0x40` | - |
| `usage.kHIDUsage_KeyboardF8` | `kHIDUsage_KeyboardF8` | `0x41` | - |
| `usage.kHIDUsage_KeyboardF9` | `kHIDUsage_KeyboardF9` | `0x42` | - |
| `usage.kHIDUsage_KeyboardFind` | `kHIDUsage_KeyboardFind` | `0x7e` | - |
| `usage.kHIDUsage_KeyboardG` | `kHIDUsage_KeyboardG` | `0x0a` | - |
| `usage.kHIDUsage_KeyboardGraveAccentAndTilde` | `kHIDUsage_KeyboardGraveAccentAndTilde` | `0x35` | - |
| `usage.kHIDUsage_KeyboardH` | `kHIDUsage_KeyboardH` | `0x0b` | - |
| `usage.kHIDUsage_KeyboardHelp` | `kHIDUsage_KeyboardHelp` | `0x75` | - |
| `usage.kHIDUsage_KeyboardHome` | `kHIDUsage_KeyboardHome` | `0x4a` | - |
| `usage.kHIDUsage_KeyboardHyphen` | `kHIDUsage_KeyboardHyphen` | `0x2d` | - |
| `usage.kHIDUsage_KeyboardI` | `kHIDUsage_KeyboardI` | `0x0c` | - |
| `usage.kHIDUsage_KeyboardInsert` | `kHIDUsage_KeyboardInsert` | `0x49` | - |
| `usage.kHIDUsage_KeyboardInternational1` | `kHIDUsage_KeyboardInternational1` | `0x87` | - |
| `usage.kHIDUsage_KeyboardInternational2` | `kHIDUsage_KeyboardInternational2` | `0x88` | - |
| `usage.kHIDUsage_KeyboardInternational3` | `kHIDUsage_KeyboardInternational3` | `0x89` | - |
| `usage.kHIDUsage_KeyboardInternational4` | `kHIDUsage_KeyboardInternational4` | `0x8a` | - |
| `usage.kHIDUsage_KeyboardInternational5` | `kHIDUsage_KeyboardInternational5` | `0x8b` | - |
| `usage.kHIDUsage_KeyboardInternational6` | `kHIDUsage_KeyboardInternational6` | `0x8c` | - |
| `usage.kHIDUsage_KeyboardInternational7` | `kHIDUsage_KeyboardInternational7` | `0x8d` | - |
| `usage.kHIDUsage_KeyboardInternational8` | `kHIDUsage_KeyboardInternational8` | `0x8e` | - |
| `usage.kHIDUsage_KeyboardInternational9` | `kHIDUsage_KeyboardInternational9` | `0x8f` | - |
| `usage.kHIDUsage_KeyboardJ` | `kHIDUsage_KeyboardJ` | `0x0d` | - |
| `usage.kHIDUsage_KeyboardK` | `kHIDUsage_KeyboardK` | `0x0e` | - |
| `usage.kHIDUsage_KeyboardL` | `kHIDUsage_KeyboardL` | `0x0f` | - |
| `usage.kHIDUsage_KeyboardLANG1` | `kHIDUsage_KeyboardLANG1` | `0x90` | - |
| `usage.kHIDUsage_KeyboardLANG2` | `kHIDUsage_KeyboardLANG2` | `0x91` | - |
| `usage.kHIDUsage_KeyboardLANG3` | `kHIDUsage_KeyboardLANG3` | `0x92` | - |
| `usage.kHIDUsage_KeyboardLANG4` | `kHIDUsage_KeyboardLANG4` | `0x93` | - |
| `usage.kHIDUsage_KeyboardLANG5` | `kHIDUsage_KeyboardLANG5` | `0x94` | - |
| `usage.kHIDUsage_KeyboardLANG6` | `kHIDUsage_KeyboardLANG6` | `0x95` | - |
| `usage.kHIDUsage_KeyboardLANG7` | `kHIDUsage_KeyboardLANG7` | `0x96` | - |
| `usage.kHIDUsage_KeyboardLANG8` | `kHIDUsage_KeyboardLANG8` | `0x97` | - |
| `usage.kHIDUsage_KeyboardLANG9` | `kHIDUsage_KeyboardLANG9` | `0x98` | - |
| `usage.kHIDUsage_KeyboardLeftAlt` | `kHIDUsage_KeyboardLeftAlt` | `0xe2` | - |
| `usage.kHIDUsage_KeyboardLeftArrow` | `kHIDUsage_KeyboardLeftArrow` | `0x50` | - |
| `usage.kHIDUsage_KeyboardLeftControl` | `kHIDUsage_KeyboardLeftControl` | `0xe0` | - |
| `usage.kHIDUsage_KeyboardLeftGUI` | `kHIDUsage_KeyboardLeftGUI` | `0xe3` | - |
| `usage.kHIDUsage_KeyboardLeftShift` | `kHIDUsage_KeyboardLeftShift` | `0xe1` | - |
| `usage.kHIDUsage_KeyboardLockingCapsLock` | `kHIDUsage_KeyboardLockingCapsLock` | `0x82` | - |
| `usage.kHIDUsage_KeyboardLockingNumLock` | `kHIDUsage_KeyboardLockingNumLock` | `0x83` | - |
| `usage.kHIDUsage_KeyboardLockingScrollLock` | `kHIDUsage_KeyboardLockingScrollLock` | `0x84` | - |
| `usage.kHIDUsage_KeyboardM` | `kHIDUsage_KeyboardM` | `0x10` | - |
| `usage.kHIDUsage_KeyboardMenu` | `kHIDUsage_KeyboardMenu` | `0x76` | - |
| `usage.kHIDUsage_KeyboardMute` | `kHIDUsage_KeyboardMute` | `0x7f` | - |
| `usage.kHIDUsage_KeyboardN` | `kHIDUsage_KeyboardN` | `0x11` | - |
| `usage.kHIDUsage_KeyboardNonUSBackslash` | `kHIDUsage_KeyboardNonUSBackslash` | `0x64` | - |
| `usage.kHIDUsage_KeyboardNonUSPound` | `kHIDUsage_KeyboardNonUSPound` | `0x32` | - |
| `usage.kHIDUsage_KeyboardO` | `kHIDUsage_KeyboardO` | `0x12` | - |
| `usage.kHIDUsage_KeyboardOpenBracket` | `kHIDUsage_KeyboardOpenBracket` | `0x2f` | - |
| `usage.kHIDUsage_KeyboardOper` | `kHIDUsage_KeyboardOper` | `0xa1` | - |
| `usage.kHIDUsage_KeyboardOut` | `kHIDUsage_KeyboardOut` | `0xa0` | - |
| `usage.kHIDUsage_KeyboardP` | `kHIDUsage_KeyboardP` | `0x13` | - |
| `usage.kHIDUsage_KeyboardPOSTFail` | `kHIDUsage_KeyboardPOSTFail` | `0x02` | - |
| `usage.kHIDUsage_KeyboardPageDown` | `kHIDUsage_KeyboardPageDown` | `0x4e` | - |
| `usage.kHIDUsage_KeyboardPageUp` | `kHIDUsage_KeyboardPageUp` | `0x4b` | - |
| `usage.kHIDUsage_KeyboardPaste` | `kHIDUsage_KeyboardPaste` | `0x7d` | - |
| `usage.kHIDUsage_KeyboardPause` | `kHIDUsage_KeyboardPause` | `0x48` | - |
| `usage.kHIDUsage_KeyboardPeriod` | `kHIDUsage_KeyboardPeriod` | `0x37` | - |
| `usage.kHIDUsage_KeyboardPower` | `kHIDUsage_KeyboardPower` | `0x66` | - |
| `usage.kHIDUsage_KeyboardPrintScreen` | `kHIDUsage_KeyboardPrintScreen` | `0x46` | - |
| `usage.kHIDUsage_KeyboardPrior` | `kHIDUsage_KeyboardPrior` | `0x9d` | - |
| `usage.kHIDUsage_KeyboardQ` | `kHIDUsage_KeyboardQ` | `0x14` | - |
| `usage.kHIDUsage_KeyboardQuote` | `kHIDUsage_KeyboardQuote` | `0x34` | - |
| `usage.kHIDUsage_KeyboardR` | `kHIDUsage_KeyboardR` | `0x15` | - |
| `usage.kHIDUsage_KeyboardReturn` | `kHIDUsage_KeyboardReturn` | `0x9e` | - |
| `usage.kHIDUsage_KeyboardReturnOrEnter` | `kHIDUsage_KeyboardReturnOrEnter` | `0x28` | - |
| `usage.kHIDUsage_KeyboardRightAlt` | `kHIDUsage_KeyboardRightAlt` | `0xe6` | - |
| `usage.kHIDUsage_KeyboardRightArrow` | `kHIDUsage_KeyboardRightArrow` | `0x4f` | - |
| `usage.kHIDUsage_KeyboardRightControl` | `kHIDUsage_KeyboardRightControl` | `0xe4` | - |
| `usage.kHIDUsage_KeyboardRightGUI` | `kHIDUsage_KeyboardRightGUI` | `0xe7` | - |
| `usage.kHIDUsage_KeyboardRightShift` | `kHIDUsage_KeyboardRightShift` | `0xe5` | - |
| `usage.kHIDUsage_KeyboardS` | `kHIDUsage_KeyboardS` | `0x16` | - |
| `usage.kHIDUsage_KeyboardScrollLock` | `kHIDUsage_KeyboardScrollLock` | `0x47` | - |
| `usage.kHIDUsage_KeyboardSelect` | `kHIDUsage_KeyboardSelect` | `0x77` | - |
| `usage.kHIDUsage_KeyboardSemicolon` | `kHIDUsage_KeyboardSemicolon` | `0x33` | - |
| `usage.kHIDUsage_KeyboardSeparator` | `kHIDUsage_KeyboardSeparator` | `0x9f` | - |
| `usage.kHIDUsage_KeyboardSlash` | `kHIDUsage_KeyboardSlash` | `0x38` | - |
| `usage.kHIDUsage_KeyboardSpacebar` | `kHIDUsage_KeyboardSpacebar` | `0x2c` | - |
| `usage.kHIDUsage_KeyboardStop` | `kHIDUsage_KeyboardStop` | `0x78` | - |
| `usage.kHIDUsage_KeyboardSysReqOrAttention` | `kHIDUsage_KeyboardSysReqOrAttention` | `0x9a` | - |
| `usage.kHIDUsage_KeyboardT` | `kHIDUsage_KeyboardT` | `0x17` | - |
| `usage.kHIDUsage_KeyboardTab` | `kHIDUsage_KeyboardTab` | `0x2b` | - |
| `usage.kHIDUsage_KeyboardU` | `kHIDUsage_KeyboardU` | `0x18` | - |
| `usage.kHIDUsage_KeyboardUndo` | `kHIDUsage_KeyboardUndo` | `0x7a` | - |
| `usage.kHIDUsage_KeyboardUpArrow` | `kHIDUsage_KeyboardUpArrow` | `0x52` | - |
| `usage.kHIDUsage_KeyboardV` | `kHIDUsage_KeyboardV` | `0x19` | - |
| `usage.kHIDUsage_KeyboardVolumeDown` | `kHIDUsage_KeyboardVolumeDown` | `0x81` | - |
| `usage.kHIDUsage_KeyboardVolumeUp` | `kHIDUsage_KeyboardVolumeUp` | `0x80` | - |
| `usage.kHIDUsage_KeyboardW` | `kHIDUsage_KeyboardW` | `0x1a` | - |
| `usage.kHIDUsage_KeyboardX` | `kHIDUsage_KeyboardX` | `0x1b` | - |
| `usage.kHIDUsage_KeyboardY` | `kHIDUsage_KeyboardY` | `0x1c` | - |
| `usage.kHIDUsage_KeyboardZ` | `kHIDUsage_KeyboardZ` | `0x1d` | - |
| `usage.kHIDUsage_Keyboard_Reserved` | `kHIDUsage_Keyboard_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Keypad0` | `kHIDUsage_Keypad0` | `0x62` | - |
| `usage.kHIDUsage_Keypad1` | `kHIDUsage_Keypad1` | `0x59` | - |
| `usage.kHIDUsage_Keypad2` | `kHIDUsage_Keypad2` | `0x5a` | - |
| `usage.kHIDUsage_Keypad3` | `kHIDUsage_Keypad3` | `0x5b` | - |
| `usage.kHIDUsage_Keypad4` | `kHIDUsage_Keypad4` | `0x5c` | - |
| `usage.kHIDUsage_Keypad5` | `kHIDUsage_Keypad5` | `0x5d` | - |
| `usage.kHIDUsage_Keypad6` | `kHIDUsage_Keypad6` | `0x5e` | - |
| `usage.kHIDUsage_Keypad7` | `kHIDUsage_Keypad7` | `0x5f` | - |
| `usage.kHIDUsage_Keypad8` | `kHIDUsage_Keypad8` | `0x60` | - |
| `usage.kHIDUsage_Keypad9` | `kHIDUsage_Keypad9` | `0x61` | - |
| `usage.kHIDUsage_KeypadAsterisk` | `kHIDUsage_KeypadAsterisk` | `0x55` | - |
| `usage.kHIDUsage_KeypadComma` | `kHIDUsage_KeypadComma` | `0x85` | - |
| `usage.kHIDUsage_KeypadEnter` | `kHIDUsage_KeypadEnter` | `0x58` | - |
| `usage.kHIDUsage_KeypadEqualSign` | `kHIDUsage_KeypadEqualSign` | `0x67` | - |
| `usage.kHIDUsage_KeypadEqualSignAS400` | `kHIDUsage_KeypadEqualSignAS400` | `0x86` | - |
| `usage.kHIDUsage_KeypadHyphen` | `kHIDUsage_KeypadHyphen` | `0x56` | - |
| `usage.kHIDUsage_KeypadNumLock` | `kHIDUsage_KeypadNumLock` | `0x53` | - |
| `usage.kHIDUsage_KeypadPeriod` | `kHIDUsage_KeypadPeriod` | `0x63` | - |
| `usage.kHIDUsage_KeypadPlus` | `kHIDUsage_KeypadPlus` | `0x57` | - |
| `usage.kHIDUsage_KeypadSlash` | `kHIDUsage_KeypadSlash` | `0x54` | - |
| `usage.kHIDUsage_LED_BatteryLow` | `kHIDUsage_LED_BatteryLow` | `0x1d` | - |
| `usage.kHIDUsage_LED_BatteryOK` | `kHIDUsage_LED_BatteryOK` | `0x1c` | - |
| `usage.kHIDUsage_LED_BatteryOperation` | `kHIDUsage_LED_BatteryOperation` | `0x1b` | - |
| `usage.kHIDUsage_LED_Busy` | `kHIDUsage_LED_Busy` | `0x2c` | - |
| `usage.kHIDUsage_LED_CAV` | `kHIDUsage_LED_CAV` | `0x14` | - |
| `usage.kHIDUsage_LED_CLV` | `kHIDUsage_LED_CLV` | `0x15` | - |
| `usage.kHIDUsage_LED_CallPickup` | `kHIDUsage_LED_CallPickup` | `0x25` | - |
| `usage.kHIDUsage_LED_CameraOff` | `kHIDUsage_LED_CameraOff` | `0x29` | - |
| `usage.kHIDUsage_LED_CameraOn` | `kHIDUsage_LED_CameraOn` | `0x28` | - |
| `usage.kHIDUsage_LED_CapsLock` | `kHIDUsage_LED_CapsLock` | `0x02` | - |
| `usage.kHIDUsage_LED_Compose` | `kHIDUsage_LED_Compose` | `0x04` | - |
| `usage.kHIDUsage_LED_Conference` | `kHIDUsage_LED_Conference` | `0x26` | - |
| `usage.kHIDUsage_LED_Coverage` | `kHIDUsage_LED_Coverage` | `0x22` | - |
| `usage.kHIDUsage_LED_DataMode` | `kHIDUsage_LED_DataMode` | `0x1a` | - |
| `usage.kHIDUsage_LED_DoNotDisturb` | `kHIDUsage_LED_DoNotDisturb` | `0x08` | - |
| `usage.kHIDUsage_LED_EqualizerEnable` | `kHIDUsage_LED_EqualizerEnable` | `0x0d` | - |
| `usage.kHIDUsage_LED_Error` | `kHIDUsage_LED_Error` | `0x39` | - |
| `usage.kHIDUsage_LED_ExternalPowerConnected` | `kHIDUsage_LED_ExternalPowerConnected` | `0x4d` | - |
| `usage.kHIDUsage_LED_FastBlinkOffTime` | `kHIDUsage_LED_FastBlinkOffTime` | `0x46` | - |
| `usage.kHIDUsage_LED_FastBlinkOnTime` | `kHIDUsage_LED_FastBlinkOnTime` | `0x45` | - |
| `usage.kHIDUsage_LED_FastForward` | `kHIDUsage_LED_FastForward` | `0x35` | - |
| `usage.kHIDUsage_LED_FlashOnTime` | `kHIDUsage_LED_FlashOnTime` | `0x42` | - |
| `usage.kHIDUsage_LED_Forward` | `kHIDUsage_LED_Forward` | `0x31` | - |
| `usage.kHIDUsage_LED_GenericIndicator` | `kHIDUsage_LED_GenericIndicator` | `0x4b` | - |
| `usage.kHIDUsage_LED_HeadSet` | `kHIDUsage_LED_HeadSet` | `0x1f` | - |
| `usage.kHIDUsage_LED_HighCutFilter` | `kHIDUsage_LED_HighCutFilter` | `0x0b` | - |
| `usage.kHIDUsage_LED_Hold` | `kHIDUsage_LED_Hold` | `0x20` | - |
| `usage.kHIDUsage_LED_IndicatorAmber` | `kHIDUsage_LED_IndicatorAmber` | `0x4a` | - |
| `usage.kHIDUsage_LED_IndicatorFastBlink` | `kHIDUsage_LED_IndicatorFastBlink` | `0x40` | - |
| `usage.kHIDUsage_LED_IndicatorFlash` | `kHIDUsage_LED_IndicatorFlash` | `0x3e` | - |
| `usage.kHIDUsage_LED_IndicatorGreen` | `kHIDUsage_LED_IndicatorGreen` | `0x49` | - |
| `usage.kHIDUsage_LED_IndicatorOff` | `kHIDUsage_LED_IndicatorOff` | `0x41` | - |
| `usage.kHIDUsage_LED_IndicatorOn` | `kHIDUsage_LED_IndicatorOn` | `0x3d` | - |
| `usage.kHIDUsage_LED_IndicatorRed` | `kHIDUsage_LED_IndicatorRed` | `0x48` | - |
| `usage.kHIDUsage_LED_IndicatorSlowBlink` | `kHIDUsage_LED_IndicatorSlowBlink` | `0x3f` | - |
| `usage.kHIDUsage_LED_Kana` | `kHIDUsage_LED_Kana` | `0x05` | - |
| `usage.kHIDUsage_LED_LowCutFilter` | `kHIDUsage_LED_LowCutFilter` | `0x0c` | - |
| `usage.kHIDUsage_LED_MessageWaiting` | `kHIDUsage_LED_MessageWaiting` | `0x19` | - |
| `usage.kHIDUsage_LED_Microphone` | `kHIDUsage_LED_Microphone` | `0x21` | - |
| `usage.kHIDUsage_LED_Mute` | `kHIDUsage_LED_Mute` | `0x09` | - |
| `usage.kHIDUsage_LED_NightMode` | `kHIDUsage_LED_NightMode` | `0x23` | - |
| `usage.kHIDUsage_LED_NumLock` | `kHIDUsage_LED_NumLock` | `0x01` | - |
| `usage.kHIDUsage_LED_OffHook` | `kHIDUsage_LED_OffHook` | `0x17` | - |
| `usage.kHIDUsage_LED_OffLine` | `kHIDUsage_LED_OffLine` | `0x2b` | - |
| `usage.kHIDUsage_LED_OnLine` | `kHIDUsage_LED_OnLine` | `0x2a` | - |
| `usage.kHIDUsage_LED_PaperJam` | `kHIDUsage_LED_PaperJam` | `0x2f` | - |
| `usage.kHIDUsage_LED_PaperOut` | `kHIDUsage_LED_PaperOut` | `0x2e` | - |
| `usage.kHIDUsage_LED_Pause` | `kHIDUsage_LED_Pause` | `0x37` | - |
| `usage.kHIDUsage_LED_Play` | `kHIDUsage_LED_Play` | `0x36` | - |
| `usage.kHIDUsage_LED_Power` | `kHIDUsage_LED_Power` | `0x06` | - |
| `usage.kHIDUsage_LED_Ready` | `kHIDUsage_LED_Ready` | `0x2d` | - |
| `usage.kHIDUsage_LED_Record` | `kHIDUsage_LED_Record` | `0x38` | - |
| `usage.kHIDUsage_LED_RecordingFormatDetect` | `kHIDUsage_LED_RecordingFormatDetect` | `0x16` | - |
| `usage.kHIDUsage_LED_Remote` | `kHIDUsage_LED_Remote` | `0x30` | - |
| `usage.kHIDUsage_LED_Repeat` | `kHIDUsage_LED_Repeat` | `0x10` | - |
| `usage.kHIDUsage_LED_Reserved` | `kHIDUsage_LED_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_LED_Reverse` | `kHIDUsage_LED_Reverse` | `0x32` | - |
| `usage.kHIDUsage_LED_Rewind` | `kHIDUsage_LED_Rewind` | `0x34` | - |
| `usage.kHIDUsage_LED_Ring` | `kHIDUsage_LED_Ring` | `0x18` | - |
| `usage.kHIDUsage_LED_SamplingRateDetect` | `kHIDUsage_LED_SamplingRateDetect` | `0x12` | - |
| `usage.kHIDUsage_LED_ScrollLock` | `kHIDUsage_LED_ScrollLock` | `0x03` | - |
| `usage.kHIDUsage_LED_SendCalls` | `kHIDUsage_LED_SendCalls` | `0x24` | - |
| `usage.kHIDUsage_LED_Shift` | `kHIDUsage_LED_Shift` | `0x07` | - |
| `usage.kHIDUsage_LED_SlowBlinkOffTime` | `kHIDUsage_LED_SlowBlinkOffTime` | `0x44` | - |
| `usage.kHIDUsage_LED_SlowBlinkOnTime` | `kHIDUsage_LED_SlowBlinkOnTime` | `0x43` | - |
| `usage.kHIDUsage_LED_SoundFieldOn` | `kHIDUsage_LED_SoundFieldOn` | `0x0e` | - |
| `usage.kHIDUsage_LED_Speaker` | `kHIDUsage_LED_Speaker` | `0x1e` | - |
| `usage.kHIDUsage_LED_Spinning` | `kHIDUsage_LED_Spinning` | `0x13` | - |
| `usage.kHIDUsage_LED_StandBy` | `kHIDUsage_LED_StandBy` | `0x27` | - |
| `usage.kHIDUsage_LED_Stereo` | `kHIDUsage_LED_Stereo` | `0x11` | - |
| `usage.kHIDUsage_LED_Stop` | `kHIDUsage_LED_Stop` | `0x33` | - |
| `usage.kHIDUsage_LED_SurroundOn` | `kHIDUsage_LED_SurroundOn` | `0x0f` | - |
| `usage.kHIDUsage_LED_SystemSuspend` | `kHIDUsage_LED_SystemSuspend` | `0x4c` | - |
| `usage.kHIDUsage_LED_ToneEnable` | `kHIDUsage_LED_ToneEnable` | `0x0a` | - |
| `usage.kHIDUsage_LED_Usage` | `kHIDUsage_LED_Usage` | `0x3a` | - |
| `usage.kHIDUsage_LED_UsageInUseIndicator` | `kHIDUsage_LED_UsageInUseIndicator` | `0x3b` | - |
| `usage.kHIDUsage_LED_UsageIndicatorColor` | `kHIDUsage_LED_UsageIndicatorColor` | `0x47` | - |
| `usage.kHIDUsage_LED_UsageMultiModeIndicator` | `kHIDUsage_LED_UsageMultiModeIndicator` | `0x3c` | - |
| `usage.kHIDUsage_MSR_DeviceReadOnly` | `kHIDUsage_MSR_DeviceReadOnly` | `0x01` | - |
| `usage.kHIDUsage_MSR_Track1Data` | `kHIDUsage_MSR_Track1Data` | `0x21` | - |
| `usage.kHIDUsage_MSR_Track1Length` | `kHIDUsage_MSR_Track1Length` | `0x11` | - |
| `usage.kHIDUsage_MSR_Track2Data` | `kHIDUsage_MSR_Track2Data` | `0x22` | - |
| `usage.kHIDUsage_MSR_Track2Length` | `kHIDUsage_MSR_Track2Length` | `0x12` | - |
| `usage.kHIDUsage_MSR_Track3Data` | `kHIDUsage_MSR_Track3Data` | `0x23` | - |
| `usage.kHIDUsage_MSR_Track3Length` | `kHIDUsage_MSR_Track3Length` | `0x13` | - |
| `usage.kHIDUsage_MSR_TrackData` | `kHIDUsage_MSR_TrackData` | `0x20` | - |
| `usage.kHIDUsage_MSR_TrackJISData` | `kHIDUsage_MSR_TrackJISData` | `0x24` | - |
| `usage.kHIDUsage_MSR_TrackJISLength` | `kHIDUsage_MSR_TrackJISLength` | `0x14` | - |
| `usage.kHIDUsage_MSR_Undefined` | `kHIDUsage_MSR_Undefined` | `0x00` | - |
| `usage.kHIDUsage_Ord_Instance1` | `kHIDUsage_Ord_Instance1` | `0x01` | - |
| `usage.kHIDUsage_Ord_Instance2` | `kHIDUsage_Ord_Instance2` | `0x02` | - |
| `usage.kHIDUsage_Ord_Instance3` | `kHIDUsage_Ord_Instance3` | `0x03` | - |
| `usage.kHIDUsage_Ord_Instance4` | `kHIDUsage_Ord_Instance4` | `0x04` | - |
| `usage.kHIDUsage_Ord_Instance65535` | `kHIDUsage_Ord_Instance65535` | `0xffff` | - |
| `usage.kHIDUsage_PD_ActivePower` | `kHIDUsage_PD_ActivePower` | `0x34` | - |
| `usage.kHIDUsage_PD_ApparentPower` | `kHIDUsage_PD_ApparentPower` | `0x33` | - |
| `usage.kHIDUsage_PD_AudibleAlarmControl` | `kHIDUsage_PD_AudibleAlarmControl` | `0x5a` | - |
| `usage.kHIDUsage_PD_AwaitingPower` | `kHIDUsage_PD_AwaitingPower` | `0x72` | - |
| `usage.kHIDUsage_PD_BadCount` | `kHIDUsage_PD_BadCount` | `0x38` | - |
| `usage.kHIDUsage_PD_Battery` | `kHIDUsage_PD_Battery` | `0x12` | - |
| `usage.kHIDUsage_PD_BatteryID` | `kHIDUsage_PD_BatteryID` | `0x13` | - |
| `usage.kHIDUsage_PD_BatterySystem` | `kHIDUsage_PD_BatterySystem` | `0x10` | - |
| `usage.kHIDUsage_PD_BatterySystemID` | `kHIDUsage_PD_BatterySystemID` | `0x11` | - |
| `usage.kHIDUsage_PD_Boost` | `kHIDUsage_PD_Boost` | `0x6e` | - |
| `usage.kHIDUsage_PD_Buck` | `kHIDUsage_PD_Buck` | `0x6f` | - |
| `usage.kHIDUsage_PD_ChangedStatus` | `kHIDUsage_PD_ChangedStatus` | `0x03` | - |
| `usage.kHIDUsage_PD_Charger` | `kHIDUsage_PD_Charger` | `0x14` | - |
| `usage.kHIDUsage_PD_ChargerID` | `kHIDUsage_PD_ChargerID` | `0x15` | - |
| `usage.kHIDUsage_PD_CommunicationLost` | `kHIDUsage_PD_CommunicationLost` | `0x73` | - |
| `usage.kHIDUsage_PD_ConfigActivePower` | `kHIDUsage_PD_ConfigActivePower` | `0x44` | - |
| `usage.kHIDUsage_PD_ConfigApparentPower` | `kHIDUsage_PD_ConfigApparentPower` | `0x43` | - |
| `usage.kHIDUsage_PD_ConfigCurrent` | `kHIDUsage_PD_ConfigCurrent` | `0x41` | - |
| `usage.kHIDUsage_PD_ConfigFrequency` | `kHIDUsage_PD_ConfigFrequency` | `0x42` | - |
| `usage.kHIDUsage_PD_ConfigHumidity` | `kHIDUsage_PD_ConfigHumidity` | `0x47` | - |
| `usage.kHIDUsage_PD_ConfigPercentLoad` | `kHIDUsage_PD_ConfigPercentLoad` | `0x45` | - |
| `usage.kHIDUsage_PD_ConfigTemperature` | `kHIDUsage_PD_ConfigTemperature` | `0x46` | - |
| `usage.kHIDUsage_PD_ConfigVoltage` | `kHIDUsage_PD_ConfigVoltage` | `0x40` | - |
| `usage.kHIDUsage_PD_Current` | `kHIDUsage_PD_Current` | `0x31` | - |
| `usage.kHIDUsage_PD_DelayBeforeReboot` | `kHIDUsage_PD_DelayBeforeReboot` | `0x55` | - |
| `usage.kHIDUsage_PD_DelayBeforeShutdown` | `kHIDUsage_PD_DelayBeforeShutdown` | `0x57` | - |
| `usage.kHIDUsage_PD_DelayBeforeStartup` | `kHIDUsage_PD_DelayBeforeStartup` | `0x56` | - |
| `usage.kHIDUsage_PD_Flow` | `kHIDUsage_PD_Flow` | `0x1e` | - |
| `usage.kHIDUsage_PD_FlowID` | `kHIDUsage_PD_FlowID` | `0x1f` | - |
| `usage.kHIDUsage_PD_Frequency` | `kHIDUsage_PD_Frequency` | `0x32` | - |
| `usage.kHIDUsage_PD_FrequencyOutOfRange` | `kHIDUsage_PD_FrequencyOutOfRange` | `0x64` | - |
| `usage.kHIDUsage_PD_Gang` | `kHIDUsage_PD_Gang` | `0x22` | - |
| `usage.kHIDUsage_PD_GangID` | `kHIDUsage_PD_GangID` | `0x23` | - |
| `usage.kHIDUsage_PD_Good` | `kHIDUsage_PD_Good` | `0x61` | - |
| `usage.kHIDUsage_PD_HighVoltageTransfer` | `kHIDUsage_PD_HighVoltageTransfer` | `0x54` | - |
| `usage.kHIDUsage_PD_Humidity` | `kHIDUsage_PD_Humidity` | `0x37` | - |
| `usage.kHIDUsage_PD_Initialized` | `kHIDUsage_PD_Initialized` | `0x70` | - |
| `usage.kHIDUsage_PD_Input` | `kHIDUsage_PD_Input` | `0x1a` | - |
| `usage.kHIDUsage_PD_InputID` | `kHIDUsage_PD_InputID` | `0x1b` | - |
| `usage.kHIDUsage_PD_InternalFailure` | `kHIDUsage_PD_InternalFailure` | `0x62` | - |
| `usage.kHIDUsage_PD_LowVoltageTransfer` | `kHIDUsage_PD_LowVoltageTransfer` | `0x53` | - |
| `usage.kHIDUsage_PD_ModuleReset` | `kHIDUsage_PD_ModuleReset` | `0x59` | - |
| `usage.kHIDUsage_PD_Outlet` | `kHIDUsage_PD_Outlet` | `0x20` | - |
| `usage.kHIDUsage_PD_OutletID` | `kHIDUsage_PD_OutletID` | `0x21` | - |
| `usage.kHIDUsage_PD_OutletSystem` | `kHIDUsage_PD_OutletSystem` | `0x18` | - |
| `usage.kHIDUsage_PD_OutletSystemID` | `kHIDUsage_PD_OutletSystemID` | `0x19` | - |
| `usage.kHIDUsage_PD_Output` | `kHIDUsage_PD_Output` | `0x1c` | - |
| `usage.kHIDUsage_PD_OutputID` | `kHIDUsage_PD_OutputID` | `0x1d` | - |
| `usage.kHIDUsage_PD_OverCharged` | `kHIDUsage_PD_OverCharged` | `0x66` | - |
| `usage.kHIDUsage_PD_OverTemperature` | `kHIDUsage_PD_OverTemperature` | `0x67` | - |
| `usage.kHIDUsage_PD_Overload` | `kHIDUsage_PD_Overload` | `0x65` | - |
| `usage.kHIDUsage_PD_PercentLoad` | `kHIDUsage_PD_PercentLoad` | `0x35` | - |
| `usage.kHIDUsage_PD_PowerConverter` | `kHIDUsage_PD_PowerConverter` | `0x16` | - |
| `usage.kHIDUsage_PD_PowerConverterID` | `kHIDUsage_PD_PowerConverterID` | `0x17` | - |
| `usage.kHIDUsage_PD_PowerSummary` | `kHIDUsage_PD_PowerSummary` | `0x24` | - |
| `usage.kHIDUsage_PD_PowerSummaryID` | `kHIDUsage_PD_PowerSummaryID` | `0x25` | - |
| `usage.kHIDUsage_PD_PowerSupply` | `kHIDUsage_PD_PowerSupply` | `0x05` | - |
| `usage.kHIDUsage_PD_Present` | `kHIDUsage_PD_Present` | `0x60` | - |
| `usage.kHIDUsage_PD_PresentStatus` | `kHIDUsage_PD_PresentStatus` | `0x02` | - |
| `usage.kHIDUsage_PD_ShutdownImminent` | `kHIDUsage_PD_ShutdownImminent` | `0x69` | - |
| `usage.kHIDUsage_PD_ShutdownRequested` | `kHIDUsage_PD_ShutdownRequested` | `0x68` | - |
| `usage.kHIDUsage_PD_SwitchOffControl` | `kHIDUsage_PD_SwitchOffControl` | `0x51` | - |
| `usage.kHIDUsage_PD_SwitchOnControl` | `kHIDUsage_PD_SwitchOnControl` | `0x50` | - |
| `usage.kHIDUsage_PD_SwitchOnOff` | `kHIDUsage_PD_SwitchOnOff` | `0x6b` | - |
| `usage.kHIDUsage_PD_Switchable` | `kHIDUsage_PD_Switchable` | `0x6c` | - |
| `usage.kHIDUsage_PD_Temperature` | `kHIDUsage_PD_Temperature` | `0x36` | - |
| `usage.kHIDUsage_PD_Test` | `kHIDUsage_PD_Test` | `0x58` | - |
| `usage.kHIDUsage_PD_Tested` | `kHIDUsage_PD_Tested` | `0x71` | - |
| `usage.kHIDUsage_PD_ToggleControl` | `kHIDUsage_PD_ToggleControl` | `0x52` | - |
| `usage.kHIDUsage_PD_UPS` | `kHIDUsage_PD_UPS` | `0x04` | - |
| `usage.kHIDUsage_PD_Undefined` | `kHIDUsage_PD_Undefined` | `0x00` | - |
| `usage.kHIDUsage_PD_Used` | `kHIDUsage_PD_Used` | `0x6d` | - |
| `usage.kHIDUsage_PD_Voltage` | `kHIDUsage_PD_Voltage` | `0x30` | - |
| `usage.kHIDUsage_PD_VoltageOutOfRange` | `kHIDUsage_PD_VoltageOutOfRange` | `0x63` | - |
| `usage.kHIDUsage_PD_iManufacturer` | `kHIDUsage_PD_iManufacturer` | `0xfd` | - |
| `usage.kHIDUsage_PD_iName` | `kHIDUsage_PD_iName` | `0x01` | - |
| `usage.kHIDUsage_PD_iProduct` | `kHIDUsage_PD_iProduct` | `0xfe` | - |
| `usage.kHIDUsage_PD_iserialNumber` | `kHIDUsage_PD_iserialNumber` | `0xff` | - |
| `usage.kHIDUsage_PID_ActuatorOverrideSwitch` | `kHIDUsage_PID_ActuatorOverrideSwitch` | `0xa5` | - |
| `usage.kHIDUsage_PID_ActuatorPower` | `kHIDUsage_PID_ActuatorPower` | `0xa6` | - |
| `usage.kHIDUsage_PID_ActuatorsEnabled` | `kHIDUsage_PID_ActuatorsEnabled` | `0xa0` | - |
| `usage.kHIDUsage_PID_AttackLevel` | `kHIDUsage_PID_AttackLevel` | `0x5b` | - |
| `usage.kHIDUsage_PID_AttackTime` | `kHIDUsage_PID_AttackTime` | `0x5c` | - |
| `usage.kHIDUsage_PID_AxesEnable` | `kHIDUsage_PID_AxesEnable` | `0x55` | - |
| `usage.kHIDUsage_PID_BlockFreeReport` | `kHIDUsage_PID_BlockFreeReport` | `0x90` | - |
| `usage.kHIDUsage_PID_BlockHandle` | `kHIDUsage_PID_BlockHandle` | `0x8f` | - |
| `usage.kHIDUsage_PID_BlockLoadError` | `kHIDUsage_PID_BlockLoadError` | `0x8e` | - |
| `usage.kHIDUsage_PID_BlockLoadFull` | `kHIDUsage_PID_BlockLoadFull` | `0x8d` | - |
| `usage.kHIDUsage_PID_BlockLoadReport` | `kHIDUsage_PID_BlockLoadReport` | `0x89` | - |
| `usage.kHIDUsage_PID_BlockLoadStatus` | `kHIDUsage_PID_BlockLoadStatus` | `0x8b` | - |
| `usage.kHIDUsage_PID_BlockLoadSuccess` | `kHIDUsage_PID_BlockLoadSuccess` | `0x8c` | - |
| `usage.kHIDUsage_PID_BlockType` | `kHIDUsage_PID_BlockType` | `0x59` | - |
| `usage.kHIDUsage_PID_CP_Offset` | `kHIDUsage_PID_CP_Offset` | `0x60` | - |
| `usage.kHIDUsage_PID_CreateNewEffectReport` | `kHIDUsage_PID_CreateNewEffectReport` | `0xab` | - |
| `usage.kHIDUsage_PID_CustomForceData` | `kHIDUsage_PID_CustomForceData` | `0x69` | - |
| `usage.kHIDUsage_PID_CustomForceDataOffset` | `kHIDUsage_PID_CustomForceDataOffset` | `0x6c` | - |
| `usage.kHIDUsage_PID_CustomForceDataReport` | `kHIDUsage_PID_CustomForceDataReport` | `0x68` | - |
| `usage.kHIDUsage_PID_CustomForceVendorDefinedData` | `kHIDUsage_PID_CustomForceVendorDefinedData` | `0x6a` | - |
| `usage.kHIDUsage_PID_DC_DeviceContinue` | `kHIDUsage_PID_DC_DeviceContinue` | `0x9c` | - |
| `usage.kHIDUsage_PID_DC_DevicePause` | `kHIDUsage_PID_DC_DevicePause` | `0x9b` | - |
| `usage.kHIDUsage_PID_DC_DeviceReset` | `kHIDUsage_PID_DC_DeviceReset` | `0x9a` | - |
| `usage.kHIDUsage_PID_DC_DisableActuators` | `kHIDUsage_PID_DC_DisableActuators` | `0x98` | - |
| `usage.kHIDUsage_PID_DC_EnableActuators` | `kHIDUsage_PID_DC_EnableActuators` | `0x97` | - |
| `usage.kHIDUsage_PID_DC_StopAllEffects` | `kHIDUsage_PID_DC_StopAllEffects` | `0x99` | - |
| `usage.kHIDUsage_PID_DeadBand` | `kHIDUsage_PID_DeadBand` | `0x65` | - |
| `usage.kHIDUsage_PID_DeviceControl` | `kHIDUsage_PID_DeviceControl` | `0x96` | - |
| `usage.kHIDUsage_PID_DeviceControlReport` | `kHIDUsage_PID_DeviceControlReport` | `0x95` | - |
| `usage.kHIDUsage_PID_DeviceGain` | `kHIDUsage_PID_DeviceGain` | `0x7e` | - |
| `usage.kHIDUsage_PID_DeviceGainReport` | `kHIDUsage_PID_DeviceGainReport` | `0x7d` | - |
| `usage.kHIDUsage_PID_DeviceManagedPool` | `kHIDUsage_PID_DeviceManagedPool` | `0xa9` | - |
| `usage.kHIDUsage_PID_DevicePaused` | `kHIDUsage_PID_DevicePaused` | `0x9f` | - |
| `usage.kHIDUsage_PID_Direction` | `kHIDUsage_PID_Direction` | `0x57` | - |
| `usage.kHIDUsage_PID_DirectionEnable` | `kHIDUsage_PID_DirectionEnable` | `0x56` | - |
| `usage.kHIDUsage_PID_DownloadForceSample` | `kHIDUsage_PID_DownloadForceSample` | `0x66` | - |
| `usage.kHIDUsage_PID_Duration` | `kHIDUsage_PID_Duration` | `0x50` | - |
| `usage.kHIDUsage_PID_ET_ConstantForce` | `kHIDUsage_PID_ET_ConstantForce` | `0x26` | - |
| `usage.kHIDUsage_PID_ET_CustomForceData` | `kHIDUsage_PID_ET_CustomForceData` | `0x28` | - |
| `usage.kHIDUsage_PID_ET_Damper` | `kHIDUsage_PID_ET_Damper` | `0x41` | - |
| `usage.kHIDUsage_PID_ET_Friction` | `kHIDUsage_PID_ET_Friction` | `0x43` | - |
| `usage.kHIDUsage_PID_ET_Inertia` | `kHIDUsage_PID_ET_Inertia` | `0x42` | - |
| `usage.kHIDUsage_PID_ET_Ramp` | `kHIDUsage_PID_ET_Ramp` | `0x27` | - |
| `usage.kHIDUsage_PID_ET_SawtoothDown` | `kHIDUsage_PID_ET_SawtoothDown` | `0x34` | - |
| `usage.kHIDUsage_PID_ET_SawtoothUp` | `kHIDUsage_PID_ET_SawtoothUp` | `0x33` | - |
| `usage.kHIDUsage_PID_ET_Sine` | `kHIDUsage_PID_ET_Sine` | `0x31` | - |
| `usage.kHIDUsage_PID_ET_Spring` | `kHIDUsage_PID_ET_Spring` | `0x40` | - |
| `usage.kHIDUsage_PID_ET_Square` | `kHIDUsage_PID_ET_Square` | `0x30` | - |
| `usage.kHIDUsage_PID_ET_Triangle` | `kHIDUsage_PID_ET_Triangle` | `0x32` | - |
| `usage.kHIDUsage_PID_EffectBlockIndex` | `kHIDUsage_PID_EffectBlockIndex` | `0x22` | - |
| `usage.kHIDUsage_PID_EffectOperation` | `kHIDUsage_PID_EffectOperation` | `0x78` | - |
| `usage.kHIDUsage_PID_EffectOperationReport` | `kHIDUsage_PID_EffectOperationReport` | `0x77` | - |
| `usage.kHIDUsage_PID_EffectPlaying` | `kHIDUsage_PID_EffectPlaying` | `0x94` | - |
| `usage.kHIDUsage_PID_EffectType` | `kHIDUsage_PID_EffectType` | `0x25` | - |
| `usage.kHIDUsage_PID_FadeLevel` | `kHIDUsage_PID_FadeLevel` | `0x5d` | - |
| `usage.kHIDUsage_PID_FadeTime` | `kHIDUsage_PID_FadeTime` | `0x5e` | - |
| `usage.kHIDUsage_PID_Gain` | `kHIDUsage_PID_Gain` | `0x52` | - |
| `usage.kHIDUsage_PID_IsochCustomForceEnable` | `kHIDUsage_PID_IsochCustomForceEnable` | `0x67` | - |
| `usage.kHIDUsage_PID_LoopCount` | `kHIDUsage_PID_LoopCount` | `0x7c` | - |
| `usage.kHIDUsage_PID_Magnitude` | `kHIDUsage_PID_Magnitude` | `0x70` | - |
| `usage.kHIDUsage_PID_MoveDestination` | `kHIDUsage_PID_MoveDestination` | `0x87` | - |
| `usage.kHIDUsage_PID_MoveLength` | `kHIDUsage_PID_MoveLength` | `0x88` | - |
| `usage.kHIDUsage_PID_MoveSource` | `kHIDUsage_PID_MoveSource` | `0x86` | - |
| `usage.kHIDUsage_PID_NegativeCoefficient` | `kHIDUsage_PID_NegativeCoefficient` | `0x62` | - |
| `usage.kHIDUsage_PID_NegativeSaturation` | `kHIDUsage_PID_NegativeSaturation` | `0x64` | - |
| `usage.kHIDUsage_PID_Normal` | `kHIDUsage_PID_Normal` | `0x20` | - |
| `usage.kHIDUsage_PID_Offset` | `kHIDUsage_PID_Offset` | `0x6f` | - |
| `usage.kHIDUsage_PID_OpEffectStart` | `kHIDUsage_PID_OpEffectStart` | `0x79` | - |
| `usage.kHIDUsage_PID_OpEffectStartSolo` | `kHIDUsage_PID_OpEffectStartSolo` | `0x7a` | - |
| `usage.kHIDUsage_PID_OpEffectStop` | `kHIDUsage_PID_OpEffectStop` | `0x7b` | - |
| `usage.kHIDUsage_PID_ParamBlockOffset` | `kHIDUsage_PID_ParamBlockOffset` | `0x23` | - |
| `usage.kHIDUsage_PID_ParameterBlockSize` | `kHIDUsage_PID_ParameterBlockSize` | `0xa8` | - |
| `usage.kHIDUsage_PID_Period` | `kHIDUsage_PID_Period` | `0x72` | - |
| `usage.kHIDUsage_PID_Phase` | `kHIDUsage_PID_Phase` | `0x71` | - |
| `usage.kHIDUsage_PID_PhysicalInterfaceDevice` | `kHIDUsage_PID_PhysicalInterfaceDevice` | `0x01` | - |
| `usage.kHIDUsage_PID_PoolAlignment` | `kHIDUsage_PID_PoolAlignment` | `0x84` | - |
| `usage.kHIDUsage_PID_PoolMoveReport` | `kHIDUsage_PID_PoolMoveReport` | `0x85` | - |
| `usage.kHIDUsage_PID_PoolReport` | `kHIDUsage_PID_PoolReport` | `0x7f` | - |
| `usage.kHIDUsage_PID_PositiveCoefficient` | `kHIDUsage_PID_PositiveCoefficient` | `0x61` | - |
| `usage.kHIDUsage_PID_PositiveSaturation` | `kHIDUsage_PID_PositiveSaturation` | `0x63` | - |
| `usage.kHIDUsage_PID_RAM_PoolAvailable` | `kHIDUsage_PID_RAM_PoolAvailable` | `0xac` | - |
| `usage.kHIDUsage_PID_RAM_PoolSize` | `kHIDUsage_PID_RAM_PoolSize` | `0x80` | - |
| `usage.kHIDUsage_PID_ROM_EffectBlockCount` | `kHIDUsage_PID_ROM_EffectBlockCount` | `0x82` | - |
| `usage.kHIDUsage_PID_ROM_Flag` | `kHIDUsage_PID_ROM_Flag` | `0x24` | - |
| `usage.kHIDUsage_PID_ROM_PoolSize` | `kHIDUsage_PID_ROM_PoolSize` | `0x81` | - |
| `usage.kHIDUsage_PID_RampEnd` | `kHIDUsage_PID_RampEnd` | `0x76` | - |
| `usage.kHIDUsage_PID_RampStart` | `kHIDUsage_PID_RampStart` | `0x75` | - |
| `usage.kHIDUsage_PID_Reserved` | `kHIDUsage_PID_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_PID_SafetySwitch` | `kHIDUsage_PID_SafetySwitch` | `0xa4` | - |
| `usage.kHIDUsage_PID_SampleCount` | `kHIDUsage_PID_SampleCount` | `0x6d` | - |
| `usage.kHIDUsage_PID_SamplePeriod` | `kHIDUsage_PID_SamplePeriod` | `0x51` | - |
| `usage.kHIDUsage_PID_SetConditionReport` | `kHIDUsage_PID_SetConditionReport` | `0x5f` | - |
| `usage.kHIDUsage_PID_SetConstantForceReport` | `kHIDUsage_PID_SetConstantForceReport` | `0x73` | - |
| `usage.kHIDUsage_PID_SetCustomForceReport` | `kHIDUsage_PID_SetCustomForceReport` | `0x6b` | - |
| `usage.kHIDUsage_PID_SetEffectReport` | `kHIDUsage_PID_SetEffectReport` | `0x21` | - |
| `usage.kHIDUsage_PID_SetEnvelopeReport` | `kHIDUsage_PID_SetEnvelopeReport` | `0x5a` | - |
| `usage.kHIDUsage_PID_SetPeriodicReport` | `kHIDUsage_PID_SetPeriodicReport` | `0x6e` | - |
| `usage.kHIDUsage_PID_SetRampForceReport` | `kHIDUsage_PID_SetRampForceReport` | `0x74` | - |
| `usage.kHIDUsage_PID_SharedParameterBlocks` | `kHIDUsage_PID_SharedParameterBlocks` | `0xaa` | - |
| `usage.kHIDUsage_PID_SimultaneousEffectsMax` | `kHIDUsage_PID_SimultaneousEffectsMax` | `0x83` | - |
| `usage.kHIDUsage_PID_StartDelay` | `kHIDUsage_PID_StartDelay` | `0xa7` | - |
| `usage.kHIDUsage_PID_StateReport` | `kHIDUsage_PID_StateReport` | `0x92` | - |
| `usage.kHIDUsage_PID_TriggerButton` | `kHIDUsage_PID_TriggerButton` | `0x53` | - |
| `usage.kHIDUsage_PID_TriggerRepeatInterval` | `kHIDUsage_PID_TriggerRepeatInterval` | `0x54` | - |
| `usage.kHIDUsage_PID_TypeSpecificBlockHandle` | `kHIDUsage_PID_TypeSpecificBlockHandle` | `0x91` | - |
| `usage.kHIDUsage_PID_TypeSpecificBlockOffset` | `kHIDUsage_PID_TypeSpecificBlockOffset` | `0x58` | - |
| `usage.kHIDUsage_Sim_Accelerator` | `kHIDUsage_Sim_Accelerator` | `0xc4` | - |
| `usage.kHIDUsage_Sim_Aileron` | `kHIDUsage_Sim_Aileron` | `0xb0` | - |
| `usage.kHIDUsage_Sim_AileronTrim` | `kHIDUsage_Sim_AileronTrim` | `0xb1` | - |
| `usage.kHIDUsage_Sim_AirplaneSimulationDevice` | `kHIDUsage_Sim_AirplaneSimulationDevice` | `0x09` | - |
| `usage.kHIDUsage_Sim_AntiTorqueControl` | `kHIDUsage_Sim_AntiTorqueControl` | `0xb2` | - |
| `usage.kHIDUsage_Sim_AutomobileSimulationDevice` | `kHIDUsage_Sim_AutomobileSimulationDevice` | `0x02` | - |
| `usage.kHIDUsage_Sim_AutopilotEnable` | `kHIDUsage_Sim_AutopilotEnable` | `0xb3` | - |
| `usage.kHIDUsage_Sim_Ballast` | `kHIDUsage_Sim_Ballast` | `0xcc` | - |
| `usage.kHIDUsage_Sim_BarrelElevation` | `kHIDUsage_Sim_BarrelElevation` | `0xca` | - |
| `usage.kHIDUsage_Sim_BicycleCrank` | `kHIDUsage_Sim_BicycleCrank` | `0xcd` | - |
| `usage.kHIDUsage_Sim_BicycleSimulationDevice` | `kHIDUsage_Sim_BicycleSimulationDevice` | `0x0c` | - |
| `usage.kHIDUsage_Sim_Brake` | `kHIDUsage_Sim_Brake` | `0xc5` | - |
| `usage.kHIDUsage_Sim_ChaffRelease` | `kHIDUsage_Sim_ChaffRelease` | `0xb4` | - |
| `usage.kHIDUsage_Sim_Clutch` | `kHIDUsage_Sim_Clutch` | `0xc6` | - |
| `usage.kHIDUsage_Sim_CollectiveControl` | `kHIDUsage_Sim_CollectiveControl` | `0xb5` | - |
| `usage.kHIDUsage_Sim_CyclicControl` | `kHIDUsage_Sim_CyclicControl` | `0x22` | - |
| `usage.kHIDUsage_Sim_CyclicTrim` | `kHIDUsage_Sim_CyclicTrim` | `0x23` | - |
| `usage.kHIDUsage_Sim_DiveBrake` | `kHIDUsage_Sim_DiveBrake` | `0xb6` | - |
| `usage.kHIDUsage_Sim_DivePlane` | `kHIDUsage_Sim_DivePlane` | `0xcb` | - |
| `usage.kHIDUsage_Sim_ElectronicCountermeasures` | `kHIDUsage_Sim_ElectronicCountermeasures` | `0xb7` | - |
| `usage.kHIDUsage_Sim_Elevator` | `kHIDUsage_Sim_Elevator` | `0xb8` | - |
| `usage.kHIDUsage_Sim_ElevatorTrim` | `kHIDUsage_Sim_ElevatorTrim` | `0xb9` | - |
| `usage.kHIDUsage_Sim_FlareRelease` | `kHIDUsage_Sim_FlareRelease` | `0xbd` | - |
| `usage.kHIDUsage_Sim_FlightCommunications` | `kHIDUsage_Sim_FlightCommunications` | `0xbc` | - |
| `usage.kHIDUsage_Sim_FlightControlStick` | `kHIDUsage_Sim_FlightControlStick` | `0x20` | - |
| `usage.kHIDUsage_Sim_FlightSimulationDevice` | `kHIDUsage_Sim_FlightSimulationDevice` | `0x01` | - |
| `usage.kHIDUsage_Sim_FlightStick` | `kHIDUsage_Sim_FlightStick` | `0x21` | - |
| `usage.kHIDUsage_Sim_FlightYoke` | `kHIDUsage_Sim_FlightYoke` | `0x24` | - |
| `usage.kHIDUsage_Sim_FrontBrake` | `kHIDUsage_Sim_FrontBrake` | `0xcf` | - |
| `usage.kHIDUsage_Sim_HandleBars` | `kHIDUsage_Sim_HandleBars` | `0xce` | - |
| `usage.kHIDUsage_Sim_HelicopterSimulationDevice` | `kHIDUsage_Sim_HelicopterSimulationDevice` | `0x0a` | - |
| `usage.kHIDUsage_Sim_LandingGear` | `kHIDUsage_Sim_LandingGear` | `0xbe` | - |
| `usage.kHIDUsage_Sim_MagicCarpetSimulationDevice` | `kHIDUsage_Sim_MagicCarpetSimulationDevice` | `0x0b` | - |
| `usage.kHIDUsage_Sim_MotorcycleSimulationDevice` | `kHIDUsage_Sim_MotorcycleSimulationDevice` | `0x07` | - |
| `usage.kHIDUsage_Sim_RearBrake` | `kHIDUsage_Sim_RearBrake` | `0xd0` | - |
| `usage.kHIDUsage_Sim_Reserved` | `kHIDUsage_Sim_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Sim_Rudder` | `kHIDUsage_Sim_Rudder` | `0xba` | - |
| `usage.kHIDUsage_Sim_SailingSimulationDevice` | `kHIDUsage_Sim_SailingSimulationDevice` | `0x06` | - |
| `usage.kHIDUsage_Sim_Shifter` | `kHIDUsage_Sim_Shifter` | `0xc7` | - |
| `usage.kHIDUsage_Sim_SpaceshipSimulationDevice` | `kHIDUsage_Sim_SpaceshipSimulationDevice` | `0x04` | - |
| `usage.kHIDUsage_Sim_SportsSimulationDevice` | `kHIDUsage_Sim_SportsSimulationDevice` | `0x08` | - |
| `usage.kHIDUsage_Sim_Steering` | `kHIDUsage_Sim_Steering` | `0xc8` | - |
| `usage.kHIDUsage_Sim_SubmarineSimulationDevice` | `kHIDUsage_Sim_SubmarineSimulationDevice` | `0x05` | - |
| `usage.kHIDUsage_Sim_TankSimulationDevice` | `kHIDUsage_Sim_TankSimulationDevice` | `0x03` | - |
| `usage.kHIDUsage_Sim_Throttle` | `kHIDUsage_Sim_Throttle` | `0xbb` | - |
| `usage.kHIDUsage_Sim_ToeBrake` | `kHIDUsage_Sim_ToeBrake` | `0xbf` | - |
| `usage.kHIDUsage_Sim_TrackControl` | `kHIDUsage_Sim_TrackControl` | `0x25` | - |
| `usage.kHIDUsage_Sim_Trigger` | `kHIDUsage_Sim_Trigger` | `0xc0` | - |
| `usage.kHIDUsage_Sim_TurretDirection` | `kHIDUsage_Sim_TurretDirection` | `0xc9` | - |
| `usage.kHIDUsage_Sim_Weapons` | `kHIDUsage_Sim_Weapons` | `0xc2` | - |
| `usage.kHIDUsage_Sim_WeaponsArm` | `kHIDUsage_Sim_WeaponsArm` | `0xc1` | - |
| `usage.kHIDUsage_Sim_WingFlaps` | `kHIDUsage_Sim_WingFlaps` | `0xc3` | - |
| `usage.kHIDUsage_Sprt_10Iron` | `kHIDUsage_Sprt_10Iron` | `0x5a` | - |
| `usage.kHIDUsage_Sprt_11Iron` | `kHIDUsage_Sprt_11Iron` | `0x5b` | - |
| `usage.kHIDUsage_Sprt_1Iron` | `kHIDUsage_Sprt_1Iron` | `0x51` | - |
| `usage.kHIDUsage_Sprt_1Wood` | `kHIDUsage_Sprt_1Wood` | `0x5f` | - |
| `usage.kHIDUsage_Sprt_2Iron` | `kHIDUsage_Sprt_2Iron` | `0x52` | - |
| `usage.kHIDUsage_Sprt_3Iron` | `kHIDUsage_Sprt_3Iron` | `0x53` | - |
| `usage.kHIDUsage_Sprt_3Wood` | `kHIDUsage_Sprt_3Wood` | `0x60` | - |
| `usage.kHIDUsage_Sprt_4Iron` | `kHIDUsage_Sprt_4Iron` | `0x54` | - |
| `usage.kHIDUsage_Sprt_5Iron` | `kHIDUsage_Sprt_5Iron` | `0x55` | - |
| `usage.kHIDUsage_Sprt_5Wood` | `kHIDUsage_Sprt_5Wood` | `0x61` | - |
| `usage.kHIDUsage_Sprt_6Iron` | `kHIDUsage_Sprt_6Iron` | `0x56` | - |
| `usage.kHIDUsage_Sprt_7Iron` | `kHIDUsage_Sprt_7Iron` | `0x57` | - |
| `usage.kHIDUsage_Sprt_7Wood` | `kHIDUsage_Sprt_7Wood` | `0x62` | - |
| `usage.kHIDUsage_Sprt_8Iron` | `kHIDUsage_Sprt_8Iron` | `0x58` | - |
| `usage.kHIDUsage_Sprt_9Iron` | `kHIDUsage_Sprt_9Iron` | `0x59` | - |
| `usage.kHIDUsage_Sprt_9Wood` | `kHIDUsage_Sprt_9Wood` | `0x63` | - |
| `usage.kHIDUsage_Sprt_BaseballBat` | `kHIDUsage_Sprt_BaseballBat` | `0x01` | - |
| `usage.kHIDUsage_Sprt_GolfClub` | `kHIDUsage_Sprt_GolfClub` | `0x02` | - |
| `usage.kHIDUsage_Sprt_LoftWedge` | `kHIDUsage_Sprt_LoftWedge` | `0x5d` | - |
| `usage.kHIDUsage_Sprt_Oar` | `kHIDUsage_Sprt_Oar` | `0x30` | - |
| `usage.kHIDUsage_Sprt_PowerWedge` | `kHIDUsage_Sprt_PowerWedge` | `0x5e` | - |
| `usage.kHIDUsage_Sprt_Putter` | `kHIDUsage_Sprt_Putter` | `0x50` | - |
| `usage.kHIDUsage_Sprt_Rate` | `kHIDUsage_Sprt_Rate` | `0x32` | - |
| `usage.kHIDUsage_Sprt_Reserved` | `kHIDUsage_Sprt_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Sprt_RowingMachine` | `kHIDUsage_Sprt_RowingMachine` | `0x03` | - |
| `usage.kHIDUsage_Sprt_SandWedge` | `kHIDUsage_Sprt_SandWedge` | `0x5c` | - |
| `usage.kHIDUsage_Sprt_Slope` | `kHIDUsage_Sprt_Slope` | `0x31` | - |
| `usage.kHIDUsage_Sprt_StickFaceAngle` | `kHIDUsage_Sprt_StickFaceAngle` | `0x34` | - |
| `usage.kHIDUsage_Sprt_StickFollowThrough` | `kHIDUsage_Sprt_StickFollowThrough` | `0x36` | - |
| `usage.kHIDUsage_Sprt_StickHeelOrToe` | `kHIDUsage_Sprt_StickHeelOrToe` | `0x35` | - |
| `usage.kHIDUsage_Sprt_StickHeight` | `kHIDUsage_Sprt_StickHeight` | `0x39` | - |
| `usage.kHIDUsage_Sprt_StickSpeed` | `kHIDUsage_Sprt_StickSpeed` | `0x33` | - |
| `usage.kHIDUsage_Sprt_StickTempo` | `kHIDUsage_Sprt_StickTempo` | `0x37` | - |
| `usage.kHIDUsage_Sprt_StickType` | `kHIDUsage_Sprt_StickType` | `0x38` | - |
| `usage.kHIDUsage_Sprt_Treadmill` | `kHIDUsage_Sprt_Treadmill` | `0x04` | - |
| `usage.kHIDUsage_TFon_Reserved` | `kHIDUsage_TFon_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_Tfon_AlternateFunction` | `kHIDUsage_Tfon_AlternateFunction` | `0x29` | - |
| `usage.kHIDUsage_Tfon_AnswerOnOrOff` | `kHIDUsage_Tfon_AnswerOnOrOff` | `0x74` | - |
| `usage.kHIDUsage_Tfon_AnsweringMachine` | `kHIDUsage_Tfon_AnsweringMachine` | `0x02` | - |
| `usage.kHIDUsage_Tfon_CallWaitingTone` | `kHIDUsage_Tfon_CallWaitingTone` | `0x99` | - |
| `usage.kHIDUsage_Tfon_CallerID` | `kHIDUsage_Tfon_CallerID` | `0x30` | - |
| `usage.kHIDUsage_Tfon_Conference` | `kHIDUsage_Tfon_Conference` | `0x2c` | - |
| `usage.kHIDUsage_Tfon_ConfirmationTone1` | `kHIDUsage_Tfon_ConfirmationTone1` | `0x9a` | - |
| `usage.kHIDUsage_Tfon_ConfirmationTone2` | `kHIDUsage_Tfon_ConfirmationTone2` | `0x9b` | - |
| `usage.kHIDUsage_Tfon_DoNotDisturb` | `kHIDUsage_Tfon_DoNotDisturb` | `0x72` | - |
| `usage.kHIDUsage_Tfon_Drop` | `kHIDUsage_Tfon_Drop` | `0x26` | - |
| `usage.kHIDUsage_Tfon_Feature` | `kHIDUsage_Tfon_Feature` | `0x22` | - |
| `usage.kHIDUsage_Tfon_Flash` | `kHIDUsage_Tfon_Flash` | `0x21` | - |
| `usage.kHIDUsage_Tfon_ForwardCalls` | `kHIDUsage_Tfon_ForwardCalls` | `0x28` | - |
| `usage.kHIDUsage_Tfon_Handset` | `kHIDUsage_Tfon_Handset` | `0x04` | - |
| `usage.kHIDUsage_Tfon_Headset` | `kHIDUsage_Tfon_Headset` | `0x05` | - |
| `usage.kHIDUsage_Tfon_Hold` | `kHIDUsage_Tfon_Hold` | `0x23` | - |
| `usage.kHIDUsage_Tfon_HookSwitch` | `kHIDUsage_Tfon_HookSwitch` | `0x20` | - |
| `usage.kHIDUsage_Tfon_InsideDialTone` | `kHIDUsage_Tfon_InsideDialTone` | `0x90` | - |
| `usage.kHIDUsage_Tfon_InsideRingTone` | `kHIDUsage_Tfon_InsideRingTone` | `0x92` | - |
| `usage.kHIDUsage_Tfon_InsideRingback` | `kHIDUsage_Tfon_InsideRingback` | `0x95` | - |
| `usage.kHIDUsage_Tfon_Line` | `kHIDUsage_Tfon_Line` | `0x2a` | - |
| `usage.kHIDUsage_Tfon_LineBusyTone` | `kHIDUsage_Tfon_LineBusyTone` | `0x97` | - |
| `usage.kHIDUsage_Tfon_Message` | `kHIDUsage_Tfon_Message` | `0x73` | - |
| `usage.kHIDUsage_Tfon_MessageControls` | `kHIDUsage_Tfon_MessageControls` | `0x03` | - |
| `usage.kHIDUsage_Tfon_OutsideDialTone` | `kHIDUsage_Tfon_OutsideDialTone` | `0x91` | - |
| `usage.kHIDUsage_Tfon_OutsideRingTone` | `kHIDUsage_Tfon_OutsideRingTone` | `0x93` | - |
| `usage.kHIDUsage_Tfon_OutsideRingback` | `kHIDUsage_Tfon_OutsideRingback` | `0x9d` | - |
| `usage.kHIDUsage_Tfon_Park` | `kHIDUsage_Tfon_Park` | `0x27` | - |
| `usage.kHIDUsage_Tfon_Phone` | `kHIDUsage_Tfon_Phone` | `0x01` | - |
| `usage.kHIDUsage_Tfon_PhoneDirectory` | `kHIDUsage_Tfon_PhoneDirectory` | `0x53` | - |
| `usage.kHIDUsage_Tfon_PhoneKey0` | `kHIDUsage_Tfon_PhoneKey0` | `0xb0` | - |
| `usage.kHIDUsage_Tfon_PhoneKey1` | `kHIDUsage_Tfon_PhoneKey1` | `0xb1` | - |
| `usage.kHIDUsage_Tfon_PhoneKey2` | `kHIDUsage_Tfon_PhoneKey2` | `0xb2` | - |
| `usage.kHIDUsage_Tfon_PhoneKey3` | `kHIDUsage_Tfon_PhoneKey3` | `0xb3` | - |
| `usage.kHIDUsage_Tfon_PhoneKey4` | `kHIDUsage_Tfon_PhoneKey4` | `0xb4` | - |
| `usage.kHIDUsage_Tfon_PhoneKey5` | `kHIDUsage_Tfon_PhoneKey5` | `0xb5` | - |
| `usage.kHIDUsage_Tfon_PhoneKey6` | `kHIDUsage_Tfon_PhoneKey6` | `0xb6` | - |
| `usage.kHIDUsage_Tfon_PhoneKey7` | `kHIDUsage_Tfon_PhoneKey7` | `0xb7` | - |
| `usage.kHIDUsage_Tfon_PhoneKey8` | `kHIDUsage_Tfon_PhoneKey8` | `0xb8` | - |
| `usage.kHIDUsage_Tfon_PhoneKey9` | `kHIDUsage_Tfon_PhoneKey9` | `0xb9` | - |
| `usage.kHIDUsage_Tfon_PhoneKeyA` | `kHIDUsage_Tfon_PhoneKeyA` | `0xbc` | - |
| `usage.kHIDUsage_Tfon_PhoneKeyB` | `kHIDUsage_Tfon_PhoneKeyB` | `0xbd` | - |
| `usage.kHIDUsage_Tfon_PhoneKeyC` | `kHIDUsage_Tfon_PhoneKeyC` | `0xbe` | - |
| `usage.kHIDUsage_Tfon_PhoneKeyD` | `kHIDUsage_Tfon_PhoneKeyD` | `0xbf` | - |
| `usage.kHIDUsage_Tfon_PhoneKeyPound` | `kHIDUsage_Tfon_PhoneKeyPound` | `0xbb` | - |
| `usage.kHIDUsage_Tfon_PhoneKeyStar` | `kHIDUsage_Tfon_PhoneKeyStar` | `0xba` | - |
| `usage.kHIDUsage_Tfon_PhoneMute` | `kHIDUsage_Tfon_PhoneMute` | `0x2f` | - |
| `usage.kHIDUsage_Tfon_PriorityRingTone` | `kHIDUsage_Tfon_PriorityRingTone` | `0x94` | - |
| `usage.kHIDUsage_Tfon_PriorityRingback` | `kHIDUsage_Tfon_PriorityRingback` | `0x96` | - |
| `usage.kHIDUsage_Tfon_ProgrammableButton` | `kHIDUsage_Tfon_ProgrammableButton` | `0x07` | - |
| `usage.kHIDUsage_Tfon_RecallNumber` | `kHIDUsage_Tfon_RecallNumber` | `0x52` | - |
| `usage.kHIDUsage_Tfon_Redial` | `kHIDUsage_Tfon_Redial` | `0x24` | - |
| `usage.kHIDUsage_Tfon_ReorderTone` | `kHIDUsage_Tfon_ReorderTone` | `0x98` | - |
| `usage.kHIDUsage_Tfon_Ring` | `kHIDUsage_Tfon_Ring` | `0x2e` | - |
| `usage.kHIDUsage_Tfon_RingEnable` | `kHIDUsage_Tfon_RingEnable` | `0x2d` | - |
| `usage.kHIDUsage_Tfon_ScreenCalls` | `kHIDUsage_Tfon_ScreenCalls` | `0x71` | - |
| `usage.kHIDUsage_Tfon_SpeakerPhone` | `kHIDUsage_Tfon_SpeakerPhone` | `0x2b` | - |
| `usage.kHIDUsage_Tfon_SpeedDial` | `kHIDUsage_Tfon_SpeedDial` | `0x50` | - |
| `usage.kHIDUsage_Tfon_StoreNumber` | `kHIDUsage_Tfon_StoreNumber` | `0x51` | - |
| `usage.kHIDUsage_Tfon_TelephonyKeyPad` | `kHIDUsage_Tfon_TelephonyKeyPad` | `0x06` | - |
| `usage.kHIDUsage_Tfon_TonesOff` | `kHIDUsage_Tfon_TonesOff` | `0x9c` | - |
| `usage.kHIDUsage_Tfon_Transfer` | `kHIDUsage_Tfon_Transfer` | `0x25` | - |
| `usage.kHIDUsage_Tfon_VoiceMail` | `kHIDUsage_Tfon_VoiceMail` | `0x70` | - |
| `usage.kHIDUsage_Undefined` | `kHIDUsage_Undefined` | `0x00` | - |
| `usage.kHIDUsage_VR_AnimatronicDevice` | `kHIDUsage_VR_AnimatronicDevice` | `0x0a` | - |
| `usage.kHIDUsage_VR_Belt` | `kHIDUsage_VR_Belt` | `0x01` | - |
| `usage.kHIDUsage_VR_BodySuit` | `kHIDUsage_VR_BodySuit` | `0x02` | - |
| `usage.kHIDUsage_VR_DisplayEnable` | `kHIDUsage_VR_DisplayEnable` | `0x21` | - |
| `usage.kHIDUsage_VR_Flexor` | `kHIDUsage_VR_Flexor` | `0x03` | - |
| `usage.kHIDUsage_VR_Glove` | `kHIDUsage_VR_Glove` | `0x04` | - |
| `usage.kHIDUsage_VR_HandTracker` | `kHIDUsage_VR_HandTracker` | `0x07` | - |
| `usage.kHIDUsage_VR_HeadMountedDisplay` | `kHIDUsage_VR_HeadMountedDisplay` | `0x06` | - |
| `usage.kHIDUsage_VR_HeadTracker` | `kHIDUsage_VR_HeadTracker` | `0x05` | - |
| `usage.kHIDUsage_VR_Oculometer` | `kHIDUsage_VR_Oculometer` | `0x08` | - |
| `usage.kHIDUsage_VR_Reserved` | `kHIDUsage_VR_Reserved` | `0xffff` | - |
| `usage.kHIDUsage_VR_StereoEnable` | `kHIDUsage_VR_StereoEnable` | `0x20` | - |
| `usage.kHIDUsage_VR_Vest` | `kHIDUsage_VR_Vest` | `0x09` | - |
| `usage.kHIDUsage_WD_CalibrationCount` | `kHIDUsage_WD_CalibrationCount` | `0x60` | - |
| `usage.kHIDUsage_WD_DataScaling` | `kHIDUsage_WD_DataScaling` | `0x41` | - |
| `usage.kHIDUsage_WD_DataWeight` | `kHIDUsage_WD_DataWeight` | `0x40` | - |
| `usage.kHIDUsage_WD_EnforcedZeroReturn` | `kHIDUsage_WD_EnforcedZeroReturn` | `0x81` | - |
| `usage.kHIDUsage_WD_RezeroCount` | `kHIDUsage_WD_RezeroCount` | `0x61` | - |
| `usage.kHIDUsage_WD_ScaleAtrributeReport` | `kHIDUsage_WD_ScaleAtrributeReport` | `0x30` | - |
| `usage.kHIDUsage_WD_ScaleControlReport` | `kHIDUsage_WD_ScaleControlReport` | `0x31` | - |
| `usage.kHIDUsage_WD_ScaleDataReport` | `kHIDUsage_WD_ScaleDataReport` | `0x32` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassGeneric` | `kHIDUsage_WD_ScaleScaleClassGeneric` | `0x2a` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIIIEnglish` | `kHIDUsage_WD_ScaleScaleClassIIIEnglish` | `0x27` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIIILEnglish` | `kHIDUsage_WD_ScaleScaleClassIIILEnglish` | `0x28` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIIILMetric` | `kHIDUsage_WD_ScaleScaleClassIIILMetric` | `0x25` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIIIMetric` | `kHIDUsage_WD_ScaleScaleClassIIIMetric` | `0x24` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIIMetric` | `kHIDUsage_WD_ScaleScaleClassIIMetric` | `0x23` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIMetric` | `kHIDUsage_WD_ScaleScaleClassIMetric` | `0x22` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIMetricCL` | `kHIDUsage_WD_ScaleScaleClassIMetricCL` | `0x21` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIVEnglish` | `kHIDUsage_WD_ScaleScaleClassIVEnglish` | `0x29` | - |
| `usage.kHIDUsage_WD_ScaleScaleClassIVMetric` | `kHIDUsage_WD_ScaleScaleClassIVMetric` | `0x26` | - |
| `usage.kHIDUsage_WD_ScaleScaleDevice` | `kHIDUsage_WD_ScaleScaleDevice` | `0x20` | - |
| `usage.kHIDUsage_WD_ScaleStatisticsReport` | `kHIDUsage_WD_ScaleStatisticsReport` | `0x35` | - |
| `usage.kHIDUsage_WD_ScaleStatus` | `kHIDUsage_WD_ScaleStatus` | `0x70` | - |
| `usage.kHIDUsage_WD_ScaleStatusFault` | `kHIDUsage_WD_ScaleStatusFault` | `0x71` | - |
| `usage.kHIDUsage_WD_ScaleStatusInMotion` | `kHIDUsage_WD_ScaleStatusInMotion` | `0x73` | - |
| `usage.kHIDUsage_WD_ScaleStatusOverWeightLimit` | `kHIDUsage_WD_ScaleStatusOverWeightLimit` | `0x76` | - |
| `usage.kHIDUsage_WD_ScaleStatusReport` | `kHIDUsage_WD_ScaleStatusReport` | `0x33` | - |
| `usage.kHIDUsage_WD_ScaleStatusRequiresCalibration` | `kHIDUsage_WD_ScaleStatusRequiresCalibration` | `0x77` | - |
| `usage.kHIDUsage_WD_ScaleStatusRequiresRezeroing` | `kHIDUsage_WD_ScaleStatusRequiresRezeroing` | `0x78` | - |
| `usage.kHIDUsage_WD_ScaleStatusStableAtZero` | `kHIDUsage_WD_ScaleStatusStableAtZero` | `0x72` | - |
| `usage.kHIDUsage_WD_ScaleStatusUnderZero` | `kHIDUsage_WD_ScaleStatusUnderZero` | `0x75` | - |
| `usage.kHIDUsage_WD_ScaleStatusWeightStable` | `kHIDUsage_WD_ScaleStatusWeightStable` | `0x74` | - |
| `usage.kHIDUsage_WD_ScaleWeightLimitReport` | `kHIDUsage_WD_ScaleWeightLimitReport` | `0x34` | - |
| `usage.kHIDUsage_WD_Undefined` | `kHIDUsage_WD_Undefined` | `0x00` | - |
| `usage.kHIDUsage_WD_WeighingDevice` | `kHIDUsage_WD_WeighingDevice` | `0x01` | - |
| `usage.kHIDUsage_WD_WeightUnit` | `kHIDUsage_WD_WeightUnit` | `0x50` | - |
| `usage.kHIDUsage_WD_WeightUnitAvoirTon` | `kHIDUsage_WD_WeightUnitAvoirTon` | `0x59` | - |
| `usage.kHIDUsage_WD_WeightUnitCarats` | `kHIDUsage_WD_WeightUnitCarats` | `0x54` | - |
| `usage.kHIDUsage_WD_WeightUnitGrains` | `kHIDUsage_WD_WeightUnitGrains` | `0x56` | - |
| `usage.kHIDUsage_WD_WeightUnitGram` | `kHIDUsage_WD_WeightUnitGram` | `0x52` | - |
| `usage.kHIDUsage_WD_WeightUnitKilogram` | `kHIDUsage_WD_WeightUnitKilogram` | `0x53` | - |
| `usage.kHIDUsage_WD_WeightUnitMetricTon` | `kHIDUsage_WD_WeightUnitMetricTon` | `0x58` | - |
| `usage.kHIDUsage_WD_WeightUnitMilligram` | `kHIDUsage_WD_WeightUnitMilligram` | `0x51` | - |
| `usage.kHIDUsage_WD_WeightUnitOunce` | `kHIDUsage_WD_WeightUnitOunce` | `0x5b` | - |
| `usage.kHIDUsage_WD_WeightUnitPennyweights` | `kHIDUsage_WD_WeightUnitPennyweights` | `0x57` | - |
| `usage.kHIDUsage_WD_WeightUnitPound` | `kHIDUsage_WD_WeightUnitPound` | `0x5c` | - |
| `usage.kHIDUsage_WD_WeightUnitTaels` | `kHIDUsage_WD_WeightUnitTaels` | `0x55` | - |
| `usage.kHIDUsage_WD_WeightUnitTroyOunce` | `kHIDUsage_WD_WeightUnitTroyOunce` | `0x5a` | - |
| `usage.kHIDUsage_WD_ZeroScale` | `kHIDUsage_WD_ZeroScale` | `0x80` | - |
| `durationSeconds` | `string` \| `number` | `undefined` | The event duration in float seconds (XCTest uses `0.005` for a single press event) |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2073](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2073)

___

### mobilePinch

• **mobilePinch**: (...`this`: `any`, `scale`: `number`, `velocity`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobilePinch`

#### Type declaration

▸ (`...this`, `scale`, `velocity`, `elementId?`): `Promise`<`void`\>

Performs a pinch gesture on the given element or on the Application element.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618669-pinchwithscale?language=objc

**`Example`**

```ruby
execute_script 'mobile: pinch', scale: 0.5, velocity: 1.1, element: element.ref
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `scale` | `number` | Pinch scale (float value). A value between `0` and `1` performs a "pinch close" (or "zoom out"); a value greater than `1` performs a "pinch open" ("zoom in"). |
| `velocity` | `number` | The velocity of the pinch in scale factor per second (float value). |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to pinch on. The Application element will be used if this parameter is not provided. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2056](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2056)

___

### mobilePressButton

• **mobilePressButton**: (...`this`: `any`, `name`: ``"up"`` \| ``"down"`` \| ``"left"`` \| ``"right"`` \| ``"home"`` \| ``"volumeup"`` \| ``"volumedown"`` \| ``"menu"`` \| ``"playpause"`` \| ``"select"`` \| ``"UP"`` \| ``"Up"`` \| ``"uP"`` \| ``"DOwn"`` \| ``"DOWN"`` \| ``"DOWn"`` \| ``"DOwN"`` \| ``"Down"`` \| ``"DoWN"`` \| ``"DoWn"`` \| ``"DowN"`` \| ``"dOwn"`` \| ``"dOWN"`` \| ``"dOWn"`` \| ``"dOwN"`` \| ``"doWN"`` \| ``"doWn"`` \| ``"dowN"`` \| ``"LEft"`` \| ``"LEFT"`` \| ``"LEFt"`` \| ``"LEfT"`` \| ``"Left"`` \| ``"LeFT"`` \| ``"LeFt"`` \| ``"LefT"`` \| ``"lEft"`` \| ``"lEFT"`` \| ``"lEFt"`` \| ``"lEfT"`` \| ``"leFT"`` \| ``"leFt"`` \| ``"lefT"`` \| ``"RIght"`` \| ``"RIGHt"`` \| ``"RIGHT"`` \| ``"RIGht"`` \| ``"RIGhT"`` \| ``"RIgHt"`` \| ``"RIgHT"`` \| ``"RIghT"`` \| ``"Right"`` \| ``"RiGHt"`` \| ``"RiGHT"`` \| ``"RiGht"`` \| ``"RiGhT"`` \| ``"RigHt"`` \| ``"RigHT"`` \| ``"RighT"`` \| ``"rIght"`` \| ``"rIGHt"`` \| ``"rIGHT"`` \| ``"rIGht"`` \| ``"rIGhT"`` \| ``"rIgHt"`` \| ``"rIgHT"`` \| ``"rIghT"`` \| ``"riGHt"`` \| ``"riGHT"`` \| ``"riGht"`` \| ``"riGhT"`` \| ``"rigHt"`` \| ``"rigHT"`` \| ``"righT"`` \| ``"HOme"`` \| ``"HOME"`` \| ``"HOMe"`` \| ``"HOmE"`` \| ``"Home"`` \| ``"HoME"`` \| ``"HoMe"`` \| ``"HomE"`` \| ``"hOme"`` \| ``"hOME"`` \| ``"hOMe"`` \| ``"hOmE"`` \| ``"hoME"`` \| ``"hoMe"`` \| ``"homE"`` \| ``"VOlumeup"`` \| ``"VOLUmeup"`` \| ``"VOLUMEup"`` \| ``"VOLUMEUP"`` \| ``"VOLUMEUp"`` \| ``"VOLUMEuP"`` \| ``"VOLUMeup"`` \| ``"VOLUMeUP"`` \| ``"VOLUMeUp"`` \| ``"VOLUMeuP"`` \| ``"VOLUmEup"`` \| ``"VOLUmEUP"`` \| ``"VOLUmEUp"`` \| ``"VOLUmEuP"`` \| ``"VOLUmeUP"`` \| ``"VOLUmeUp"`` \| ``"VOLUmeuP"`` \| ``"VOLumeup"`` \| ``"VOLuMEup"`` \| ``"VOLuMEUP"`` \| ``"VOLuMEUp"`` \| ``"VOLuMEuP"`` \| ``"VOLuMeup"`` \| ``"VOLuMeUP"`` \| ``"VOLuMeUp"`` \| ``"VOLuMeuP"`` \| ``"VOLumEup"`` \| ``"VOLumEUP"`` \| ``"VOLumEUp"`` \| ``"VOLumEuP"`` \| ``"VOLumeUP"`` \| ``"VOLumeUp"`` \| ``"VOLumeuP"`` \| ``"VOlUmeup"`` \| ``"VOlUMEup"`` \| ``"VOlUMEUP"`` \| ``"VOlUMEUp"`` \| ``"VOlUMEuP"`` \| ``"VOlUMeup"`` \| ``"VOlUMeUP"`` \| ``"VOlUMeUp"`` \| ``"VOlUMeuP"`` \| ``"VOlUmEup"`` \| ``"VOlUmEUP"`` \| ``"VOlUmEUp"`` \| ``"VOlUmEuP"`` \| ``"VOlUmeUP"`` \| ``"VOlUmeUp"`` \| ``"VOlUmeuP"`` \| ``"VOluMEup"`` \| ``"VOluMEUP"`` \| ``"VOluMEUp"`` \| ``"VOluMEuP"`` \| ``"VOluMeup"`` \| ``"VOluMeUP"`` \| ``"VOluMeUp"`` \| ``"VOluMeuP"`` \| ``"VOlumEup"`` \| ``"VOlumEUP"`` \| ``"VOlumEUp"`` \| ``"VOlumEuP"`` \| ``"VOlumeUP"`` \| ``"VOlumeUp"`` \| ``"VOlumeuP"`` \| ``"Volumeup"`` \| ``"VoLUmeup"`` \| ``"VoLUMEup"`` \| ``"VoLUMEUP"`` \| ``"VoLUMEUp"`` \| ``"VoLUMEuP"`` \| ``"VoLUMeup"`` \| ``"VoLUMeUP"`` \| ``"VoLUMeUp"`` \| ``"VoLUMeuP"`` \| ``"VoLUmEup"`` \| ``"VoLUmEUP"`` \| ``"VoLUmEUp"`` \| ``"VoLUmEuP"`` \| ``"VoLUmeUP"`` \| ``"VoLUmeUp"`` \| ``"VoLUmeuP"`` \| ``"VoLumeup"`` \| ``"VoLuMEup"`` \| ``"VoLuMEUP"`` \| ``"VoLuMEUp"`` \| ``"VoLuMEuP"`` \| ``"VoLuMeup"`` \| ``"VoLuMeUP"`` \| ``"VoLuMeUp"`` \| ``"VoLuMeuP"`` \| ``"VoLumEup"`` \| ``"VoLumEUP"`` \| ``"VoLumEUp"`` \| ``"VoLumEuP"`` \| ``"VoLumeUP"`` \| ``"VoLumeUp"`` \| ``"VoLumeuP"`` \| ``"VolUmeup"`` \| ``"VolUMEup"`` \| ``"VolUMEUP"`` \| ``"VolUMEUp"`` \| ``"VolUMEuP"`` \| ``"VolUMeup"`` \| ``"VolUMeUP"`` \| ``"VolUMeUp"`` \| ``"VolUMeuP"`` \| ``"VolUmEup"`` \| ``"VolUmEUP"`` \| ``"VolUmEUp"`` \| ``"VolUmEuP"`` \| ``"VolUmeUP"`` \| ``"VolUmeUp"`` \| ``"VolUmeuP"`` \| ``"VoluMEup"`` \| ``"VoluMEUP"`` \| ``"VoluMEUp"`` \| ``"VoluMEuP"`` \| ``"VoluMeup"`` \| ``"VoluMeUP"`` \| ``"VoluMeUp"`` \| ``"VoluMeuP"`` \| ``"VolumEup"`` \| ``"VolumEUP"`` \| ``"VolumEUp"`` \| ``"VolumEuP"`` \| ``"VolumeUP"`` \| ``"VolumeUp"`` \| ``"VolumeuP"`` \| ``"vOlumeup"`` \| ``"vOLUmeup"`` \| ``"vOLUMEup"`` \| ``"vOLUMEUP"`` \| ``"vOLUMEUp"`` \| ``"vOLUMEuP"`` \| ``"vOLUMeup"`` \| ``"vOLUMeUP"`` \| ``"vOLUMeUp"`` \| ``"vOLUMeuP"`` \| ``"vOLUmEup"`` \| ``"vOLUmEUP"`` \| ``"vOLUmEUp"`` \| ``"vOLUmEuP"`` \| ``"vOLUmeUP"`` \| ``"vOLUmeUp"`` \| ``"vOLUmeuP"`` \| ``"vOLumeup"`` \| ``"vOLuMEup"`` \| ``"vOLuMEUP"`` \| ``"vOLuMEUp"`` \| ``"vOLuMEuP"`` \| ``"vOLuMeup"`` \| ``"vOLuMeUP"`` \| ``"vOLuMeUp"`` \| ``"vOLuMeuP"`` \| ``"vOLumEup"`` \| ``"vOLumEUP"`` \| ``"vOLumEUp"`` \| ``"vOLumEuP"`` \| ``"vOLumeUP"`` \| ``"vOLumeUp"`` \| ``"vOLumeuP"`` \| ``"vOlUmeup"`` \| ``"vOlUMEup"`` \| ``"vOlUMEUP"`` \| ``"vOlUMEUp"`` \| ``"vOlUMEuP"`` \| ``"vOlUMeup"`` \| ``"vOlUMeUP"`` \| ``"vOlUMeUp"`` \| ``"vOlUMeuP"`` \| ``"vOlUmEup"`` \| ``"vOlUmEUP"`` \| ``"vOlUmEUp"`` \| ``"vOlUmEuP"`` \| ``"vOlUmeUP"`` \| ``"vOlUmeUp"`` \| ``"vOlUmeuP"`` \| ``"vOluMEup"`` \| ``"vOluMEUP"`` \| ``"vOluMEUp"`` \| ``"vOluMEuP"`` \| ``"vOluMeup"`` \| ``"vOluMeUP"`` \| ``"vOluMeUp"`` \| ``"vOluMeuP"`` \| ``"vOlumEup"`` \| ``"vOlumEUP"`` \| ``"vOlumEUp"`` \| ``"vOlumEuP"`` \| ``"vOlumeUP"`` \| ``"vOlumeUp"`` \| ``"vOlumeuP"`` \| ``"voLUmeup"`` \| ``"voLUMEup"`` \| ``"voLUMEUP"`` \| ``"voLUMEUp"`` \| ``"voLUMEuP"`` \| ``"voLUMeup"`` \| ``"voLUMeUP"`` \| ``"voLUMeUp"`` \| ``"voLUMeuP"`` \| ``"voLUmEup"`` \| ``"voLUmEUP"`` \| ``"voLUmEUp"`` \| ``"voLUmEuP"`` \| ``"voLUmeUP"`` \| ``"voLUmeUp"`` \| ``"voLUmeuP"`` \| ``"voLumeup"`` \| ``"voLuMEup"`` \| ``"voLuMEUP"`` \| ``"voLuMEUp"`` \| ``"voLuMEuP"`` \| ``"voLuMeup"`` \| ``"voLuMeUP"`` \| ``"voLuMeUp"`` \| ``"voLuMeuP"`` \| ``"voLumEup"`` \| ``"voLumEUP"`` \| ``"voLumEUp"`` \| ``"voLumEuP"`` \| ``"voLumeUP"`` \| ``"voLumeUp"`` \| ``"voLumeuP"`` \| ``"volUmeup"`` \| ``"volUMEup"`` \| ``"volUMEUP"`` \| ``"volUMEUp"`` \| ``"volUMEuP"`` \| ``"volUMeup"`` \| ``"volUMeUP"`` \| ``"volUMeUp"`` \| ``"volUMeuP"`` \| ``"volUmEup"`` \| ``"volUmEUP"`` \| ``"volUmEUp"`` \| ``"volUmEuP"`` \| ``"volUmeUP"`` \| ``"volUmeUp"`` \| ``"volUmeuP"`` \| ``"voluMEup"`` \| ``"voluMEUP"`` \| ``"voluMEUp"`` \| ``"voluMEuP"`` \| ``"voluMeup"`` \| ``"voluMeUP"`` \| ``"voluMeUp"`` \| ``"voluMeuP"`` \| ``"volumEup"`` \| ``"volumEUP"`` \| ``"volumEUp"`` \| ``"volumEuP"`` \| ``"volumeUP"`` \| ``"volumeUp"`` \| ``"volumeuP"`` \| ``"VOlumedown"`` \| ``"VOLUmedown"`` \| ``"VOLUMEdown"`` \| ``"VOLUMEDOwn"`` \| ``"VOLUMEDOWN"`` \| ``"VOLUMEDOWn"`` \| ``"VOLUMEDOwN"`` \| ``"VOLUMEDown"`` \| ``"VOLUMEDoWN"`` \| ``"VOLUMEDoWn"`` \| ``"VOLUMEDowN"`` \| ``"VOLUMEdOwn"`` \| ``"VOLUMEdOWN"`` \| ``"VOLUMEdOWn"`` \| ``"VOLUMEdOwN"`` \| ``"VOLUMEdoWN"`` \| ``"VOLUMEdoWn"`` \| ``"VOLUMEdowN"`` \| ``"VOLUMedown"`` \| ``"VOLUMeDOwn"`` \| ``"VOLUMeDOWN"`` \| ``"VOLUMeDOWn"`` \| ``"VOLUMeDOwN"`` \| ``"VOLUMeDown"`` \| ``"VOLUMeDoWN"`` \| ``"VOLUMeDoWn"`` \| ``"VOLUMeDowN"`` \| ``"VOLUMedOwn"`` \| ``"VOLUMedOWN"`` \| ``"VOLUMedOWn"`` \| ``"VOLUMedOwN"`` \| ``"VOLUMedoWN"`` \| ``"VOLUMedoWn"`` \| ``"VOLUMedowN"`` \| ``"VOLUmEdown"`` \| ``"VOLUmEDOwn"`` \| ``"VOLUmEDOWN"`` \| ``"VOLUmEDOWn"`` \| ``"VOLUmEDOwN"`` \| ``"VOLUmEDown"`` \| ``"VOLUmEDoWN"`` \| ``"VOLUmEDoWn"`` \| ``"VOLUmEDowN"`` \| ``"VOLUmEdOwn"`` \| ``"VOLUmEdOWN"`` \| ``"VOLUmEdOWn"`` \| ``"VOLUmEdOwN"`` \| ``"VOLUmEdoWN"`` \| ``"VOLUmEdoWn"`` \| ``"VOLUmEdowN"`` \| ``"VOLUmeDOwn"`` \| ``"VOLUmeDOWN"`` \| ``"VOLUmeDOWn"`` \| ``"VOLUmeDOwN"`` \| ``"VOLUmeDown"`` \| ``"VOLUmeDoWN"`` \| ``"VOLUmeDoWn"`` \| ``"VOLUmeDowN"`` \| ``"VOLUmedOwn"`` \| ``"VOLUmedOWN"`` \| ``"VOLUmedOWn"`` \| ``"VOLUmedOwN"`` \| ``"VOLUmedoWN"`` \| ``"VOLUmedoWn"`` \| ``"VOLUmedowN"`` \| ``"VOLumedown"`` \| ``"VOLuMEdown"`` \| ``"VOLuMEDOwn"`` \| ``"VOLuMEDOWN"`` \| ``"VOLuMEDOWn"`` \| ``"VOLuMEDOwN"`` \| ``"VOLuMEDown"`` \| ``"VOLuMEDoWN"`` \| ``"VOLuMEDoWn"`` \| ``"VOLuMEDowN"`` \| ``"VOLuMEdOwn"`` \| ``"VOLuMEdOWN"`` \| ``"VOLuMEdOWn"`` \| ``"VOLuMEdOwN"`` \| ``"VOLuMEdoWN"`` \| ``"VOLuMEdoWn"`` \| ``"VOLuMEdowN"`` \| ``"VOLuMedown"`` \| ``"VOLuMeDOwn"`` \| ``"VOLuMeDOWN"`` \| ``"VOLuMeDOWn"`` \| ``"VOLuMeDOwN"`` \| ``"VOLuMeDown"`` \| ``"VOLuMeDoWN"`` \| ``"VOLuMeDoWn"`` \| ``"VOLuMeDowN"`` \| ``"VOLuMedOwn"`` \| ``"VOLuMedOWN"`` \| ``"VOLuMedOWn"`` \| ``"VOLuMedOwN"`` \| ``"VOLuMedoWN"`` \| ``"VOLuMedoWn"`` \| ``"VOLuMedowN"`` \| ``"VOLumEdown"`` \| ``"VOLumEDOwn"`` \| ``"VOLumEDOWN"`` \| ``"VOLumEDOWn"`` \| ``"VOLumEDOwN"`` \| ``"VOLumEDown"`` \| ``"VOLumEDoWN"`` \| ``"VOLumEDoWn"`` \| ``"VOLumEDowN"`` \| ``"VOLumEdOwn"`` \| ``"VOLumEdOWN"`` \| ``"VOLumEdOWn"`` \| ``"VOLumEdOwN"`` \| ``"VOLumEdoWN"`` \| ``"VOLumEdoWn"`` \| ``"VOLumEdowN"`` \| ``"VOLumeDOwn"`` \| ``"VOLumeDOWN"`` \| ``"VOLumeDOWn"`` \| ``"VOLumeDOwN"`` \| ``"VOLumeDown"`` \| ``"VOLumeDoWN"`` \| ``"VOLumeDoWn"`` \| ``"VOLumeDowN"`` \| ``"VOLumedOwn"`` \| ``"VOLumedOWN"`` \| ``"VOLumedOWn"`` \| ``"VOLumedOwN"`` \| ``"VOLumedoWN"`` \| ``"VOLumedoWn"`` \| ``"VOLumedowN"`` \| ``"VOlUmedown"`` \| ``"VOlUMEdown"`` \| ``"VOlUMEDOwn"`` \| ``"VOlUMEDOWN"`` \| ``"VOlUMEDOWn"`` \| ``"VOlUMEDOwN"`` \| ``"VOlUMEDown"`` \| ``"VOlUMEDoWN"`` \| ``"VOlUMEDoWn"`` \| ``"VOlUMEDowN"`` \| ``"VOlUMEdOwn"`` \| ``"VOlUMEdOWN"`` \| ``"VOlUMEdOWn"`` \| ``"VOlUMEdOwN"`` \| ``"VOlUMEdoWN"`` \| ``"VOlUMEdoWn"`` \| ``"VOlUMEdowN"`` \| ``"VOlUMedown"`` \| ``"VOlUMeDOwn"`` \| ``"VOlUMeDOWN"`` \| ``"VOlUMeDOWn"`` \| ``"VOlUMeDOwN"`` \| ``"VOlUMeDown"`` \| ``"VOlUMeDoWN"`` \| ``"VOlUMeDoWn"`` \| ``"VOlUMeDowN"`` \| ``"VOlUMedOwn"`` \| ``"VOlUMedOWN"`` \| ``"VOlUMedOWn"`` \| ``"VOlUMedOwN"`` \| ``"VOlUMedoWN"`` \| ``"VOlUMedoWn"`` \| ``"VOlUMedowN"`` \| ``"VOlUmEdown"`` \| ``"VOlUmEDOwn"`` \| ``"VOlUmEDOWN"`` \| ``"VOlUmEDOWn"`` \| ``"VOlUmEDOwN"`` \| ``"VOlUmEDown"`` \| ``"VOlUmEDoWN"`` \| ``"VOlUmEDoWn"`` \| ``"VOlUmEDowN"`` \| ``"VOlUmEdOwn"`` \| ``"VOlUmEdOWN"`` \| ``"VOlUmEdOWn"`` \| ``"VOlUmEdOwN"`` \| ``"VOlUmEdoWN"`` \| ``"VOlUmEdoWn"`` \| ``"VOlUmEdowN"`` \| ``"VOlUmeDOwn"`` \| ``"VOlUmeDOWN"`` \| ``"VOlUmeDOWn"`` \| ``"VOlUmeDOwN"`` \| ``"VOlUmeDown"`` \| ``"VOlUmeDoWN"`` \| ``"VOlUmeDoWn"`` \| ``"VOlUmeDowN"`` \| ``"VOlUmedOwn"`` \| ``"VOlUmedOWN"`` \| ``"VOlUmedOWn"`` \| ``"VOlUmedOwN"`` \| ``"VOlUmedoWN"`` \| ``"VOlUmedoWn"`` \| ``"VOlUmedowN"`` \| ``"VOluMEdown"`` \| ``"VOluMEDOwn"`` \| ``"VOluMEDOWN"`` \| ``"VOluMEDOWn"`` \| ``"VOluMEDOwN"`` \| ``"VOluMEDown"`` \| ``"VOluMEDoWN"`` \| ``"VOluMEDoWn"`` \| ``"VOluMEDowN"`` \| ``"VOluMEdOwn"`` \| ``"VOluMEdOWN"`` \| ``"VOluMEdOWn"`` \| ``"VOluMEdOwN"`` \| ``"VOluMEdoWN"`` \| ``"VOluMEdoWn"`` \| ``"VOluMEdowN"`` \| ``"VOluMedown"`` \| ``"VOluMeDOwn"`` \| ``"VOluMeDOWN"`` \| ``"VOluMeDOWn"`` \| ``"VOluMeDOwN"`` \| ``"VOluMeDown"`` \| ``"VOluMeDoWN"`` \| ``"VOluMeDoWn"`` \| ``"VOluMeDowN"`` \| ``"VOluMedOwn"`` \| ``"VOluMedOWN"`` \| ``"VOluMedOWn"`` \| ``"VOluMedOwN"`` \| ``"VOluMedoWN"`` \| ``"VOluMedoWn"`` \| ``"VOluMedowN"`` \| ``"VOlumEdown"`` \| ``"VOlumEDOwn"`` \| ``"VOlumEDOWN"`` \| ``"VOlumEDOWn"`` \| ``"VOlumEDOwN"`` \| ``"VOlumEDown"`` \| ``"VOlumEDoWN"`` \| ``"VOlumEDoWn"`` \| ``"VOlumEDowN"`` \| ``"VOlumEdOwn"`` \| ``"VOlumEdOWN"`` \| ``"VOlumEdOWn"`` \| ``"VOlumEdOwN"`` \| ``"VOlumEdoWN"`` \| ``"VOlumEdoWn"`` \| ``"VOlumEdowN"`` \| ``"VOlumeDOwn"`` \| ``"VOlumeDOWN"`` \| ``"VOlumeDOWn"`` \| ``"VOlumeDOwN"`` \| ``"VOlumeDown"`` \| ``"VOlumeDoWN"`` \| ``"VOlumeDoWn"`` \| ``"VOlumeDowN"`` \| ``"VOlumedOwn"`` \| ``"VOlumedOWN"`` \| ``"VOlumedOWn"`` \| ``"VOlumedOwN"`` \| ``"VOlumedoWN"`` \| ``"VOlumedoWn"`` \| ``"VOlumedowN"`` \| ``"Volumedown"`` \| ``"VoLUmedown"`` \| ``"VoLUMEdown"`` \| ``"VoLUMEDOwn"`` \| ``"VoLUMEDOWN"`` \| ``"VoLUMEDOWn"`` \| ``"VoLUMEDOwN"`` \| ``"VoLUMEDown"`` \| ``"VoLUMEDoWN"`` \| ``"VoLUMEDoWn"`` \| ``"VoLUMEDowN"`` \| ``"VoLUMEdOwn"`` \| ``"VoLUMEdOWN"`` \| ``"VoLUMEdOWn"`` \| ``"VoLUMEdOwN"`` \| ``"VoLUMEdoWN"`` \| ``"VoLUMEdoWn"`` \| ``"VoLUMEdowN"`` \| ``"VoLUMedown"`` \| ``"VoLUMeDOwn"`` \| ``"VoLUMeDOWN"`` \| ``"VoLUMeDOWn"`` \| ``"VoLUMeDOwN"`` \| ``"VoLUMeDown"`` \| ``"VoLUMeDoWN"`` \| ``"VoLUMeDoWn"`` \| ``"VoLUMeDowN"`` \| ``"VoLUMedOwn"`` \| ``"VoLUMedOWN"`` \| ``"VoLUMedOWn"`` \| ``"VoLUMedOwN"`` \| ``"VoLUMedoWN"`` \| ``"VoLUMedoWn"`` \| ``"VoLUMedowN"`` \| ``"VoLUmEdown"`` \| ``"VoLUmEDOwn"`` \| ``"VoLUmEDOWN"`` \| ``"VoLUmEDOWn"`` \| ``"VoLUmEDOwN"`` \| ``"VoLUmEDown"`` \| ``"VoLUmEDoWN"`` \| ``"VoLUmEDoWn"`` \| ``"VoLUmEDowN"`` \| ``"VoLUmEdOwn"`` \| ``"VoLUmEdOWN"`` \| ``"VoLUmEdOWn"`` \| ``"VoLUmEdOwN"`` \| ``"VoLUmEdoWN"`` \| ``"VoLUmEdoWn"`` \| ``"VoLUmEdowN"`` \| ``"VoLUmeDOwn"`` \| ``"VoLUmeDOWN"`` \| ``"VoLUmeDOWn"`` \| ``"VoLUmeDOwN"`` \| ``"VoLUmeDown"`` \| ``"VoLUmeDoWN"`` \| ``"VoLUmeDoWn"`` \| ``"VoLUmeDowN"`` \| ``"VoLUmedOwn"`` \| ``"VoLUmedOWN"`` \| ``"VoLUmedOWn"`` \| ``"VoLUmedOwN"`` \| ``"VoLUmedoWN"`` \| ``"VoLUmedoWn"`` \| ``"VoLUmedowN"`` \| ``"VoLumedown"`` \| ``"VoLuMEdown"`` \| ``"VoLuMEDOwn"`` \| ``"VoLuMEDOWN"`` \| ``"VoLuMEDOWn"`` \| ``"VoLuMEDOwN"`` \| ``"VoLuMEDown"`` \| ``"VoLuMEDoWN"`` \| ``"VoLuMEDoWn"`` \| ``"VoLuMEDowN"`` \| ``"VoLuMEdOwn"`` \| ``"VoLuMEdOWN"`` \| ``"VoLuMEdOWn"`` \| ``"VoLuMEdOwN"`` \| ``"VoLuMEdoWN"`` \| ``"VoLuMEdoWn"`` \| ``"VoLuMEdowN"`` \| ``"VoLuMedown"`` \| ``"VoLuMeDOwn"`` \| ``"VoLuMeDOWN"`` \| ``"VoLuMeDOWn"`` \| ``"VoLuMeDOwN"`` \| ``"VoLuMeDown"`` \| ``"VoLuMeDoWN"`` \| ``"VoLuMeDoWn"`` \| ``"VoLuMeDowN"`` \| ``"VoLuMedOwn"`` \| ``"VoLuMedOWN"`` \| ``"VoLuMedOWn"`` \| ``"VoLuMedOwN"`` \| ``"VoLuMedoWN"`` \| ``"VoLuMedoWn"`` \| ``"VoLuMedowN"`` \| ``"VoLumEdown"`` \| ``"VoLumEDOwn"`` \| ``"VoLumEDOWN"`` \| ``"VoLumEDOWn"`` \| ``"VoLumEDOwN"`` \| ``"VoLumEDown"`` \| ``"VoLumEDoWN"`` \| ``"VoLumEDoWn"`` \| ``"VoLumEDowN"`` \| ``"VoLumEdOwn"`` \| ``"VoLumEdOWN"`` \| ``"VoLumEdOWn"`` \| ``"VoLumEdOwN"`` \| ``"VoLumEdoWN"`` \| ``"VoLumEdoWn"`` \| ``"VoLumEdowN"`` \| ``"VoLumeDOwn"`` \| ``"VoLumeDOWN"`` \| ``"VoLumeDOWn"`` \| ``"VoLumeDOwN"`` \| ``"VoLumeDown"`` \| ``"VoLumeDoWN"`` \| ``"VoLumeDoWn"`` \| ``"VoLumeDowN"`` \| ``"VoLumedOwn"`` \| ``"VoLumedOWN"`` \| ``"VoLumedOWn"`` \| ``"VoLumedOwN"`` \| ``"VoLumedoWN"`` \| ``"VoLumedoWn"`` \| ``"VoLumedowN"`` \| ``"VolUmedown"`` \| ``"VolUMEdown"`` \| ``"VolUMEDOwn"`` \| ``"VolUMEDOWN"`` \| ``"VolUMEDOWn"`` \| ``"VolUMEDOwN"`` \| ``"VolUMEDown"`` \| ``"VolUMEDoWN"`` \| ``"VolUMEDoWn"`` \| ``"VolUMEDowN"`` \| ``"VolUMEdOwn"`` \| ``"VolUMEdOWN"`` \| ``"VolUMEdOWn"`` \| ``"VolUMEdOwN"`` \| ``"VolUMEdoWN"`` \| ``"VolUMEdoWn"`` \| ``"VolUMEdowN"`` \| ``"VolUMedown"`` \| ``"VolUMeDOwn"`` \| ``"VolUMeDOWN"`` \| ``"VolUMeDOWn"`` \| ``"VolUMeDOwN"`` \| ``"VolUMeDown"`` \| ``"VolUMeDoWN"`` \| ``"VolUMeDoWn"`` \| ``"VolUMeDowN"`` \| ``"VolUMedOwn"`` \| ``"VolUMedOWN"`` \| ``"VolUMedOWn"`` \| ``"VolUMedOwN"`` \| ``"VolUMedoWN"`` \| ``"VolUMedoWn"`` \| ``"VolUMedowN"`` \| ``"VolUmEdown"`` \| ``"VolUmEDOwn"`` \| ``"VolUmEDOWN"`` \| ``"VolUmEDOWn"`` \| ``"VolUmEDOwN"`` \| ``"VolUmEDown"`` \| ``"VolUmEDoWN"`` \| ``"VolUmEDoWn"`` \| ``"VolUmEDowN"`` \| ``"VolUmEdOwn"`` \| ``"VolUmEdOWN"`` \| ``"VolUmEdOWn"`` \| ``"VolUmEdOwN"`` \| ``"VolUmEdoWN"`` \| ``"VolUmEdoWn"`` \| ``"VolUmEdowN"`` \| ``"VolUmeDOwn"`` \| ``"VolUmeDOWN"`` \| ``"VolUmeDOWn"`` \| ``"VolUmeDOwN"`` \| ``"VolUmeDown"`` \| ``"VolUmeDoWN"`` \| ``"VolUmeDoWn"`` \| ``"VolUmeDowN"`` \| ``"VolUmedOwn"`` \| ``"VolUmedOWN"`` \| ``"VolUmedOWn"`` \| ``"VolUmedOwN"`` \| ``"VolUmedoWN"`` \| ``"VolUmedoWn"`` \| ``"VolUmedowN"`` \| ``"VoluMEdown"`` \| ``"VoluMEDOwn"`` \| ``"VoluMEDOWN"`` \| ``"VoluMEDOWn"`` \| ``"VoluMEDOwN"`` \| ``"VoluMEDown"`` \| ``"VoluMEDoWN"`` \| ``"VoluMEDoWn"`` \| ``"VoluMEDowN"`` \| ``"VoluMEdOwn"`` \| ``"VoluMEdOWN"`` \| ``"VoluMEdOWn"`` \| ``"VoluMEdOwN"`` \| ``"VoluMEdoWN"`` \| ``"VoluMEdoWn"`` \| ``"VoluMEdowN"`` \| ``"VoluMedown"`` \| ``"VoluMeDOwn"`` \| ``"VoluMeDOWN"`` \| ``"VoluMeDOWn"`` \| ``"VoluMeDOwN"`` \| ``"VoluMeDown"`` \| ``"VoluMeDoWN"`` \| ``"VoluMeDoWn"`` \| ``"VoluMeDowN"`` \| ``"VoluMedOwn"`` \| ``"VoluMedOWN"`` \| ``"VoluMedOWn"`` \| ``"VoluMedOwN"`` \| ``"VoluMedoWN"`` \| ``"VoluMedoWn"`` \| ``"VoluMedowN"`` \| ``"VolumEdown"`` \| ``"VolumEDOwn"`` \| ``"VolumEDOWN"`` \| ``"VolumEDOWn"`` \| ``"VolumEDOwN"`` \| ``"VolumEDown"`` \| ``"VolumEDoWN"`` \| ``"VolumEDoWn"`` \| ``"VolumEDowN"`` \| ``"VolumEdOwn"`` \| ``"VolumEdOWN"`` \| ``"VolumEdOWn"`` \| ``"VolumEdOwN"`` \| ``"VolumEdoWN"`` \| ``"VolumEdoWn"`` \| ``"VolumEdowN"`` \| ``"VolumeDOwn"`` \| ``"VolumeDOWN"`` \| ``"VolumeDOWn"`` \| ``"VolumeDOwN"`` \| ``"VolumeDown"`` \| ``"VolumeDoWN"`` \| ``"VolumeDoWn"`` \| ``"VolumeDowN"`` \| ``"VolumedOwn"`` \| ``"VolumedOWN"`` \| ``"VolumedOWn"`` \| ``"VolumedOwN"`` \| ``"VolumedoWN"`` \| ``"VolumedoWn"`` \| ``"VolumedowN"`` \| ``"vOlumedown"`` \| ``"vOLUmedown"`` \| ``"vOLUMEdown"`` \| ``"vOLUMEDOwn"`` \| ``"vOLUMEDOWN"`` \| ``"vOLUMEDOWn"`` \| ``"vOLUMEDOwN"`` \| ``"vOLUMEDown"`` \| ``"vOLUMEDoWN"`` \| ``"vOLUMEDoWn"`` \| ``"vOLUMEDowN"`` \| ``"vOLUMEdOwn"`` \| ``"vOLUMEdOWN"`` \| ``"vOLUMEdOWn"`` \| ``"vOLUMEdOwN"`` \| ``"vOLUMEdoWN"`` \| ``"vOLUMEdoWn"`` \| ``"vOLUMEdowN"`` \| ``"vOLUMedown"`` \| ``"vOLUMeDOwn"`` \| ``"vOLUMeDOWN"`` \| ``"vOLUMeDOWn"`` \| ``"vOLUMeDOwN"`` \| ``"vOLUMeDown"`` \| ``"vOLUMeDoWN"`` \| ``"vOLUMeDoWn"`` \| ``"vOLUMeDowN"`` \| ``"vOLUMedOwn"`` \| ``"vOLUMedOWN"`` \| ``"vOLUMedOWn"`` \| ``"vOLUMedOwN"`` \| ``"vOLUMedoWN"`` \| ``"vOLUMedoWn"`` \| ``"vOLUMedowN"`` \| ``"vOLUmEdown"`` \| ``"vOLUmEDOwn"`` \| ``"vOLUmEDOWN"`` \| ``"vOLUmEDOWn"`` \| ``"vOLUmEDOwN"`` \| ``"vOLUmEDown"`` \| ``"vOLUmEDoWN"`` \| ``"vOLUmEDoWn"`` \| ``"vOLUmEDowN"`` \| ``"vOLUmEdOwn"`` \| ``"vOLUmEdOWN"`` \| ``"vOLUmEdOWn"`` \| ``"vOLUmEdOwN"`` \| ``"vOLUmEdoWN"`` \| ``"vOLUmEdoWn"`` \| ``"vOLUmEdowN"`` \| ``"vOLUmeDOwn"`` \| ``"vOLUmeDOWN"`` \| ``"vOLUmeDOWn"`` \| ``"vOLUmeDOwN"`` \| ``"vOLUmeDown"`` \| ``"vOLUmeDoWN"`` \| ``"vOLUmeDoWn"`` \| ``"vOLUmeDowN"`` \| ``"vOLUmedOwn"`` \| ``"vOLUmedOWN"`` \| ``"vOLUmedOWn"`` \| ``"vOLUmedOwN"`` \| ``"vOLUmedoWN"`` \| ``"vOLUmedoWn"`` \| ``"vOLUmedowN"`` \| ``"vOLumedown"`` \| ``"vOLuMEdown"`` \| ``"vOLuMEDOwn"`` \| ``"vOLuMEDOWN"`` \| ``"vOLuMEDOWn"`` \| ``"vOLuMEDOwN"`` \| ``"vOLuMEDown"`` \| ``"vOLuMEDoWN"`` \| ``"vOLuMEDoWn"`` \| ``"vOLuMEDowN"`` \| ``"vOLuMEdOwn"`` \| ``"vOLuMEdOWN"`` \| ``"vOLuMEdOWn"`` \| ``"vOLuMEdOwN"`` \| ``"vOLuMEdoWN"`` \| ``"vOLuMEdoWn"`` \| ``"vOLuMEdowN"`` \| ``"vOLuMedown"`` \| ``"vOLuMeDOwn"`` \| ``"vOLuMeDOWN"`` \| ``"vOLuMeDOWn"`` \| ``"vOLuMeDOwN"`` \| ``"vOLuMeDown"`` \| ``"vOLuMeDoWN"`` \| ``"vOLuMeDoWn"`` \| ``"vOLuMeDowN"`` \| ``"vOLuMedOwn"`` \| ``"vOLuMedOWN"`` \| ``"vOLuMedOWn"`` \| ``"vOLuMedOwN"`` \| ``"vOLuMedoWN"`` \| ``"vOLuMedoWn"`` \| ``"vOLuMedowN"`` \| ``"vOLumEdown"`` \| ``"vOLumEDOwn"`` \| ``"vOLumEDOWN"`` \| ``"vOLumEDOWn"`` \| ``"vOLumEDOwN"`` \| ``"vOLumEDown"`` \| ``"vOLumEDoWN"`` \| ``"vOLumEDoWn"`` \| ``"vOLumEDowN"`` \| ``"vOLumEdOwn"`` \| ``"vOLumEdOWN"`` \| ``"vOLumEdOWn"`` \| ``"vOLumEdOwN"`` \| ``"vOLumEdoWN"`` \| ``"vOLumEdoWn"`` \| ``"vOLumEdowN"`` \| ``"vOLumeDOwn"`` \| ``"vOLumeDOWN"`` \| ``"vOLumeDOWn"`` \| ``"vOLumeDOwN"`` \| ``"vOLumeDown"`` \| ``"vOLumeDoWN"`` \| ``"vOLumeDoWn"`` \| ``"vOLumeDowN"`` \| ``"vOLumedOwn"`` \| ``"vOLumedOWN"`` \| ``"vOLumedOWn"`` \| ``"vOLumedOwN"`` \| ``"vOLumedoWN"`` \| ``"vOLumedoWn"`` \| ``"vOLumedowN"`` \| ``"vOlUmedown"`` \| ``"vOlUMEdown"`` \| ``"vOlUMEDOwn"`` \| ``"vOlUMEDOWN"`` \| ``"vOlUMEDOWn"`` \| ``"vOlUMEDOwN"`` \| ``"vOlUMEDown"`` \| ``"vOlUMEDoWN"`` \| ``"vOlUMEDoWn"`` \| ``"vOlUMEDowN"`` \| ``"vOlUMEdOwn"`` \| ``"vOlUMEdOWN"`` \| ``"vOlUMEdOWn"`` \| ``"vOlUMEdOwN"`` \| ``"vOlUMEdoWN"`` \| ``"vOlUMEdoWn"`` \| ``"vOlUMEdowN"`` \| ``"vOlUMedown"`` \| ``"vOlUMeDOwn"`` \| ``"vOlUMeDOWN"`` \| ``"vOlUMeDOWn"`` \| ``"vOlUMeDOwN"`` \| ``"vOlUMeDown"`` \| ``"vOlUMeDoWN"`` \| ``"vOlUMeDoWn"`` \| ``"vOlUMeDowN"`` \| ``"vOlUMedOwn"`` \| ``"vOlUMedOWN"`` \| ``"vOlUMedOWn"`` \| ``"vOlUMedOwN"`` \| ``"vOlUMedoWN"`` \| ``"vOlUMedoWn"`` \| ``"vOlUMedowN"`` \| ``"vOlUmEdown"`` \| ``"vOlUmEDOwn"`` \| ``"vOlUmEDOWN"`` \| ``"vOlUmEDOWn"`` \| ``"vOlUmEDOwN"`` \| ``"vOlUmEDown"`` \| ``"vOlUmEDoWN"`` \| ``"vOlUmEDoWn"`` \| ``"vOlUmEDowN"`` \| ``"vOlUmEdOwn"`` \| ``"vOlUmEdOWN"`` \| ``"vOlUmEdOWn"`` \| ``"vOlUmEdOwN"`` \| ``"vOlUmEdoWN"`` \| ``"vOlUmEdoWn"`` \| ``"vOlUmEdowN"`` \| ``"vOlUmeDOwn"`` \| ``"vOlUmeDOWN"`` \| ``"vOlUmeDOWn"`` \| ``"vOlUmeDOwN"`` \| ``"vOlUmeDown"`` \| ``"vOlUmeDoWN"`` \| ``"vOlUmeDoWn"`` \| ``"vOlUmeDowN"`` \| ``"vOlUmedOwn"`` \| ``"vOlUmedOWN"`` \| ``"vOlUmedOWn"`` \| ``"vOlUmedOwN"`` \| ``"vOlUmedoWN"`` \| ``"vOlUmedoWn"`` \| ``"vOlUmedowN"`` \| ``"vOluMEdown"`` \| ``"vOluMEDOwn"`` \| ``"vOluMEDOWN"`` \| ``"vOluMEDOWn"`` \| ``"vOluMEDOwN"`` \| ``"vOluMEDown"`` \| ``"vOluMEDoWN"`` \| ``"vOluMEDoWn"`` \| ``"vOluMEDowN"`` \| ``"vOluMEdOwn"`` \| ``"vOluMEdOWN"`` \| ``"vOluMEdOWn"`` \| ``"vOluMEdOwN"`` \| ``"vOluMEdoWN"`` \| ``"vOluMEdoWn"`` \| ``"vOluMEdowN"`` \| ``"vOluMedown"`` \| ``"vOluMeDOwn"`` \| ``"vOluMeDOWN"`` \| ``"vOluMeDOWn"`` \| ``"vOluMeDOwN"`` \| ``"vOluMeDown"`` \| ``"vOluMeDoWN"`` \| ``"vOluMeDoWn"`` \| ``"vOluMeDowN"`` \| ``"vOluMedOwn"`` \| ``"vOluMedOWN"`` \| ``"vOluMedOWn"`` \| ``"vOluMedOwN"`` \| ``"vOluMedoWN"`` \| ``"vOluMedoWn"`` \| ``"vOluMedowN"`` \| ``"vOlumEdown"`` \| ``"vOlumEDOwn"`` \| ``"vOlumEDOWN"`` \| ``"vOlumEDOWn"`` \| ``"vOlumEDOwN"`` \| ``"vOlumEDown"`` \| ``"vOlumEDoWN"`` \| ``"vOlumEDoWn"`` \| ``"vOlumEDowN"`` \| ``"vOlumEdOwn"`` \| ``"vOlumEdOWN"`` \| ``"vOlumEdOWn"`` \| ``"vOlumEdOwN"`` \| ``"vOlumEdoWN"`` \| ``"vOlumEdoWn"`` \| ``"vOlumEdowN"`` \| ``"vOlumeDOwn"`` \| ``"vOlumeDOWN"`` \| ``"vOlumeDOWn"`` \| ``"vOlumeDOwN"`` \| ``"vOlumeDown"`` \| ``"vOlumeDoWN"`` \| ``"vOlumeDoWn"`` \| ``"vOlumeDowN"`` \| ``"vOlumedOwn"`` \| ``"vOlumedOWN"`` \| ``"vOlumedOWn"`` \| ``"vOlumedOwN"`` \| ``"vOlumedoWN"`` \| ``"vOlumedoWn"`` \| ``"vOlumedowN"`` \| ``"voLUmedown"`` \| ``"voLUMEdown"`` \| ``"voLUMEDOwn"`` \| ``"voLUMEDOWN"`` \| ``"voLUMEDOWn"`` \| ``"voLUMEDOwN"`` \| ``"voLUMEDown"`` \| ``"voLUMEDoWN"`` \| ``"voLUMEDoWn"`` \| ``"voLUMEDowN"`` \| ``"voLUMEdOwn"`` \| ``"voLUMEdOWN"`` \| ``"voLUMEdOWn"`` \| ``"voLUMEdOwN"`` \| ``"voLUMEdoWN"`` \| ``"voLUMEdoWn"`` \| ``"voLUMEdowN"`` \| ``"voLUMedown"`` \| ``"voLUMeDOwn"`` \| ``"voLUMeDOWN"`` \| ``"voLUMeDOWn"`` \| ``"voLUMeDOwN"`` \| ``"voLUMeDown"`` \| ``"voLUMeDoWN"`` \| ``"voLUMeDoWn"`` \| ``"voLUMeDowN"`` \| ``"voLUMedOwn"`` \| ``"voLUMedOWN"`` \| ``"voLUMedOWn"`` \| ``"voLUMedOwN"`` \| ``"voLUMedoWN"`` \| ``"voLUMedoWn"`` \| ``"voLUMedowN"`` \| ``"voLUmEdown"`` \| ``"voLUmEDOwn"`` \| ``"voLUmEDOWN"`` \| ``"voLUmEDOWn"`` \| ``"voLUmEDOwN"`` \| ``"voLUmEDown"`` \| ``"voLUmEDoWN"`` \| ``"voLUmEDoWn"`` \| ``"voLUmEDowN"`` \| ``"voLUmEdOwn"`` \| ``"voLUmEdOWN"`` \| ``"voLUmEdOWn"`` \| ``"voLUmEdOwN"`` \| ``"voLUmEdoWN"`` \| ``"voLUmEdoWn"`` \| ``"voLUmEdowN"`` \| ``"voLUmeDOwn"`` \| ``"voLUmeDOWN"`` \| ``"voLUmeDOWn"`` \| ``"voLUmeDOwN"`` \| ``"voLUmeDown"`` \| ``"voLUmeDoWN"`` \| ``"voLUmeDoWn"`` \| ``"voLUmeDowN"`` \| ``"voLUmedOwn"`` \| ``"voLUmedOWN"`` \| ``"voLUmedOWn"`` \| ``"voLUmedOwN"`` \| ``"voLUmedoWN"`` \| ``"voLUmedoWn"`` \| ``"voLUmedowN"`` \| ``"voLumedown"`` \| ``"voLuMEdown"`` \| ``"voLuMEDOwn"`` \| ``"voLuMEDOWN"`` \| ``"voLuMEDOWn"`` \| ``"voLuMEDOwN"`` \| ``"voLuMEDown"`` \| ``"voLuMEDoWN"`` \| ``"voLuMEDoWn"`` \| ``"voLuMEDowN"`` \| ``"voLuMEdOwn"`` \| ``"voLuMEdOWN"`` \| ``"voLuMEdOWn"`` \| ``"voLuMEdOwN"`` \| ``"voLuMEdoWN"`` \| ``"voLuMEdoWn"`` \| ``"voLuMEdowN"`` \| ``"voLuMedown"`` \| ``"voLuMeDOwn"`` \| ``"voLuMeDOWN"`` \| ``"voLuMeDOWn"`` \| ``"voLuMeDOwN"`` \| ``"voLuMeDown"`` \| ``"voLuMeDoWN"`` \| ``"voLuMeDoWn"`` \| ``"voLuMeDowN"`` \| ``"voLuMedOwn"`` \| ``"voLuMedOWN"`` \| ``"voLuMedOWn"`` \| ``"voLuMedOwN"`` \| ``"voLuMedoWN"`` \| ``"voLuMedoWn"`` \| ``"voLuMedowN"`` \| ``"voLumEdown"`` \| ``"voLumEDOwn"`` \| ``"voLumEDOWN"`` \| ``"voLumEDOWn"`` \| ``"voLumEDOwN"`` \| ``"voLumEDown"`` \| ``"voLumEDoWN"`` \| ``"voLumEDoWn"`` \| ``"voLumEDowN"`` \| ``"voLumEdOwn"`` \| ``"voLumEdOWN"`` \| ``"voLumEdOWn"`` \| ``"voLumEdOwN"`` \| ``"voLumEdoWN"`` \| ``"voLumEdoWn"`` \| ``"voLumEdowN"`` \| ``"voLumeDOwn"`` \| ``"voLumeDOWN"`` \| ``"voLumeDOWn"`` \| ``"voLumeDOwN"`` \| ``"voLumeDown"`` \| ``"voLumeDoWN"`` \| ``"voLumeDoWn"`` \| ``"voLumeDowN"`` \| ``"voLumedOwn"`` \| ``"voLumedOWN"`` \| ``"voLumedOWn"`` \| ``"voLumedOwN"`` \| ``"voLumedoWN"`` \| ``"voLumedoWn"`` \| ``"voLumedowN"`` \| ``"volUmedown"`` \| ``"volUMEdown"`` \| ``"volUMEDOwn"`` \| ``"volUMEDOWN"`` \| ``"volUMEDOWn"`` \| ``"volUMEDOwN"`` \| ``"volUMEDown"`` \| ``"volUMEDoWN"`` \| ``"volUMEDoWn"`` \| ``"volUMEDowN"`` \| ``"volUMEdOwn"`` \| ``"volUMEdOWN"`` \| ``"volUMEdOWn"`` \| ``"volUMEdOwN"`` \| ``"volUMEdoWN"`` \| ``"volUMEdoWn"`` \| ``"volUMEdowN"`` \| ``"volUMedown"`` \| ``"volUMeDOwn"`` \| ``"volUMeDOWN"`` \| ``"volUMeDOWn"`` \| ``"volUMeDOwN"`` \| ``"volUMeDown"`` \| ``"volUMeDoWN"`` \| ``"volUMeDoWn"`` \| ``"volUMeDowN"`` \| ``"volUMedOwn"`` \| ``"volUMedOWN"`` \| ``"volUMedOWn"`` \| ``"volUMedOwN"`` \| ``"volUMedoWN"`` \| ``"volUMedoWn"`` \| ``"volUMedowN"`` \| ``"volUmEdown"`` \| ``"volUmEDOwn"`` \| ``"volUmEDOWN"`` \| ``"volUmEDOWn"`` \| ``"volUmEDOwN"`` \| ``"volUmEDown"`` \| ``"volUmEDoWN"`` \| ``"volUmEDoWn"`` \| ``"volUmEDowN"`` \| ``"volUmEdOwn"`` \| ``"volUmEdOWN"`` \| ``"volUmEdOWn"`` \| ``"volUmEdOwN"`` \| ``"volUmEdoWN"`` \| ``"volUmEdoWn"`` \| ``"volUmEdowN"`` \| ``"volUmeDOwn"`` \| ``"volUmeDOWN"`` \| ``"volUmeDOWn"`` \| ``"volUmeDOwN"`` \| ``"volUmeDown"`` \| ``"volUmeDoWN"`` \| ``"volUmeDoWn"`` \| ``"volUmeDowN"`` \| ``"volUmedOwn"`` \| ``"volUmedOWN"`` \| ``"volUmedOWn"`` \| ``"volUmedOwN"`` \| ``"volUmedoWN"`` \| ``"volUmedoWn"`` \| ``"volUmedowN"`` \| ``"voluMEdown"`` \| ``"voluMEDOwn"`` \| ``"voluMEDOWN"`` \| ``"voluMEDOWn"`` \| ``"voluMEDOwN"`` \| ``"voluMEDown"`` \| ``"voluMEDoWN"`` \| ``"voluMEDoWn"`` \| ``"voluMEDowN"`` \| ``"voluMEdOwn"`` \| ``"voluMEdOWN"`` \| ``"voluMEdOWn"`` \| ``"voluMEdOwN"`` \| ``"voluMEdoWN"`` \| ``"voluMEdoWn"`` \| ``"voluMEdowN"`` \| ``"voluMedown"`` \| ``"voluMeDOwn"`` \| ``"voluMeDOWN"`` \| ``"voluMeDOWn"`` \| ``"voluMeDOwN"`` \| ``"voluMeDown"`` \| ``"voluMeDoWN"`` \| ``"voluMeDoWn"`` \| ``"voluMeDowN"`` \| ``"voluMedOwn"`` \| ``"voluMedOWN"`` \| ``"voluMedOWn"`` \| ``"voluMedOwN"`` \| ``"voluMedoWN"`` \| ``"voluMedoWn"`` \| ``"voluMedowN"`` \| ``"volumEdown"`` \| ``"volumEDOwn"`` \| ``"volumEDOWN"`` \| ``"volumEDOWn"`` \| ``"volumEDOwN"`` \| ``"volumEDown"`` \| ``"volumEDoWN"`` \| ``"volumEDoWn"`` \| ``"volumEDowN"`` \| ``"volumEdOwn"`` \| ``"volumEdOWN"`` \| ``"volumEdOWn"`` \| ``"volumEdOwN"`` \| ``"volumEdoWN"`` \| ``"volumEdoWn"`` \| ``"volumEdowN"`` \| ``"volumeDOwn"`` \| ``"volumeDOWN"`` \| ``"volumeDOWn"`` \| ``"volumeDOwN"`` \| ``"volumeDown"`` \| ``"volumeDoWN"`` \| ``"volumeDoWn"`` \| ``"volumeDowN"`` \| ``"volumedOwn"`` \| ``"volumedOWN"`` \| ``"volumedOWn"`` \| ``"volumedOwN"`` \| ``"volumedoWN"`` \| ``"volumedoWn"`` \| ``"volumedowN"`` \| ``"MEnu"`` \| ``"MENU"`` \| ``"MENu"`` \| ``"MEnU"`` \| ``"Menu"`` \| ``"MeNU"`` \| ``"MeNu"`` \| ``"MenU"`` \| ``"mEnu"`` \| ``"mENU"`` \| ``"mENu"`` \| ``"mEnU"`` \| ``"meNU"`` \| ``"meNu"`` \| ``"menU"`` \| ``"PLaypause"`` \| ``"PLAYpause"`` \| ``"PLAYPAuse"`` \| ``"PLAYPAUSe"`` \| ``"PLAYPAUSE"`` \| ``"PLAYPAUse"`` \| ``"PLAYPAUsE"`` \| ``"PLAYPAuSe"`` \| ``"PLAYPAuSE"`` \| ``"PLAYPAusE"`` \| ``"PLAYPause"`` \| ``"PLAYPaUSe"`` \| ``"PLAYPaUSE"`` \| ``"PLAYPaUse"`` \| ``"PLAYPaUsE"`` \| ``"PLAYPauSe"`` \| ``"PLAYPauSE"`` \| ``"PLAYPausE"`` \| ``"PLAYpAuse"`` \| ``"PLAYpAUSe"`` \| ``"PLAYpAUSE"`` \| ``"PLAYpAUse"`` \| ``"PLAYpAUsE"`` \| ``"PLAYpAuSe"`` \| ``"PLAYpAuSE"`` \| ``"PLAYpAusE"`` \| ``"PLAYpaUSe"`` \| ``"PLAYpaUSE"`` \| ``"PLAYpaUse"`` \| ``"PLAYpaUsE"`` \| ``"PLAYpauSe"`` \| ``"PLAYpauSE"`` \| ``"PLAYpausE"`` \| ``"PLAypause"`` \| ``"PLAyPAuse"`` \| ``"PLAyPAUSe"`` \| ``"PLAyPAUSE"`` \| ``"PLAyPAUse"`` \| ``"PLAyPAUsE"`` \| ``"PLAyPAuSe"`` \| ``"PLAyPAuSE"`` \| ``"PLAyPAusE"`` \| ``"PLAyPause"`` \| ``"PLAyPaUSe"`` \| ``"PLAyPaUSE"`` \| ``"PLAyPaUse"`` \| ``"PLAyPaUsE"`` \| ``"PLAyPauSe"`` \| ``"PLAyPauSE"`` \| ``"PLAyPausE"`` \| ``"PLAypAuse"`` \| ``"PLAypAUSe"`` \| ``"PLAypAUSE"`` \| ``"PLAypAUse"`` \| ``"PLAypAUsE"`` \| ``"PLAypAuSe"`` \| ``"PLAypAuSE"`` \| ``"PLAypAusE"`` \| ``"PLAypaUSe"`` \| ``"PLAypaUSE"`` \| ``"PLAypaUse"`` \| ``"PLAypaUsE"`` \| ``"PLAypauSe"`` \| ``"PLAypauSE"`` \| ``"PLAypausE"`` \| ``"PLaYpause"`` \| ``"PLaYPAuse"`` \| ``"PLaYPAUSe"`` \| ``"PLaYPAUSE"`` \| ``"PLaYPAUse"`` \| ``"PLaYPAUsE"`` \| ``"PLaYPAuSe"`` \| ``"PLaYPAuSE"`` \| ``"PLaYPAusE"`` \| ``"PLaYPause"`` \| ``"PLaYPaUSe"`` \| ``"PLaYPaUSE"`` \| ``"PLaYPaUse"`` \| ``"PLaYPaUsE"`` \| ``"PLaYPauSe"`` \| ``"PLaYPauSE"`` \| ``"PLaYPausE"`` \| ``"PLaYpAuse"`` \| ``"PLaYpAUSe"`` \| ``"PLaYpAUSE"`` \| ``"PLaYpAUse"`` \| ``"PLaYpAUsE"`` \| ``"PLaYpAuSe"`` \| ``"PLaYpAuSE"`` \| ``"PLaYpAusE"`` \| ``"PLaYpaUSe"`` \| ``"PLaYpaUSE"`` \| ``"PLaYpaUse"`` \| ``"PLaYpaUsE"`` \| ``"PLaYpauSe"`` \| ``"PLaYpauSE"`` \| ``"PLaYpausE"`` \| ``"PLayPAuse"`` \| ``"PLayPAUSe"`` \| ``"PLayPAUSE"`` \| ``"PLayPAUse"`` \| ``"PLayPAUsE"`` \| ``"PLayPAuSe"`` \| ``"PLayPAuSE"`` \| ``"PLayPAusE"`` \| ``"PLayPause"`` \| ``"PLayPaUSe"`` \| ``"PLayPaUSE"`` \| ``"PLayPaUse"`` \| ``"PLayPaUsE"`` \| ``"PLayPauSe"`` \| ``"PLayPauSE"`` \| ``"PLayPausE"`` \| ``"PLaypAuse"`` \| ``"PLaypAUSe"`` \| ``"PLaypAUSE"`` \| ``"PLaypAUse"`` \| ``"PLaypAUsE"`` \| ``"PLaypAuSe"`` \| ``"PLaypAuSE"`` \| ``"PLaypAusE"`` \| ``"PLaypaUSe"`` \| ``"PLaypaUSE"`` \| ``"PLaypaUse"`` \| ``"PLaypaUsE"`` \| ``"PLaypauSe"`` \| ``"PLaypauSE"`` \| ``"PLaypausE"`` \| ``"Playpause"`` \| ``"PlAYpause"`` \| ``"PlAYPAuse"`` \| ``"PlAYPAUSe"`` \| ``"PlAYPAUSE"`` \| ``"PlAYPAUse"`` \| ``"PlAYPAUsE"`` \| ``"PlAYPAuSe"`` \| ``"PlAYPAuSE"`` \| ``"PlAYPAusE"`` \| ``"PlAYPause"`` \| ``"PlAYPaUSe"`` \| ``"PlAYPaUSE"`` \| ``"PlAYPaUse"`` \| ``"PlAYPaUsE"`` \| ``"PlAYPauSe"`` \| ``"PlAYPauSE"`` \| ``"PlAYPausE"`` \| ``"PlAYpAuse"`` \| ``"PlAYpAUSe"`` \| ``"PlAYpAUSE"`` \| ``"PlAYpAUse"`` \| ``"PlAYpAUsE"`` \| ``"PlAYpAuSe"`` \| ``"PlAYpAuSE"`` \| ``"PlAYpAusE"`` \| ``"PlAYpaUSe"`` \| ``"PlAYpaUSE"`` \| ``"PlAYpaUse"`` \| ``"PlAYpaUsE"`` \| ``"PlAYpauSe"`` \| ``"PlAYpauSE"`` \| ``"PlAYpausE"`` \| ``"PlAypause"`` \| ``"PlAyPAuse"`` \| ``"PlAyPAUSe"`` \| ``"PlAyPAUSE"`` \| ``"PlAyPAUse"`` \| ``"PlAyPAUsE"`` \| ``"PlAyPAuSe"`` \| ``"PlAyPAuSE"`` \| ``"PlAyPAusE"`` \| ``"PlAyPause"`` \| ``"PlAyPaUSe"`` \| ``"PlAyPaUSE"`` \| ``"PlAyPaUse"`` \| ``"PlAyPaUsE"`` \| ``"PlAyPauSe"`` \| ``"PlAyPauSE"`` \| ``"PlAyPausE"`` \| ``"PlAypAuse"`` \| ``"PlAypAUSe"`` \| ``"PlAypAUSE"`` \| ``"PlAypAUse"`` \| ``"PlAypAUsE"`` \| ``"PlAypAuSe"`` \| ``"PlAypAuSE"`` \| ``"PlAypAusE"`` \| ``"PlAypaUSe"`` \| ``"PlAypaUSE"`` \| ``"PlAypaUse"`` \| ``"PlAypaUsE"`` \| ``"PlAypauSe"`` \| ``"PlAypauSE"`` \| ``"PlAypausE"`` \| ``"PlaYpause"`` \| ``"PlaYPAuse"`` \| ``"PlaYPAUSe"`` \| ``"PlaYPAUSE"`` \| ``"PlaYPAUse"`` \| ``"PlaYPAUsE"`` \| ``"PlaYPAuSe"`` \| ``"PlaYPAuSE"`` \| ``"PlaYPAusE"`` \| ``"PlaYPause"`` \| ``"PlaYPaUSe"`` \| ``"PlaYPaUSE"`` \| ``"PlaYPaUse"`` \| ``"PlaYPaUsE"`` \| ``"PlaYPauSe"`` \| ``"PlaYPauSE"`` \| ``"PlaYPausE"`` \| ``"PlaYpAuse"`` \| ``"PlaYpAUSe"`` \| ``"PlaYpAUSE"`` \| ``"PlaYpAUse"`` \| ``"PlaYpAUsE"`` \| ``"PlaYpAuSe"`` \| ``"PlaYpAuSE"`` \| ``"PlaYpAusE"`` \| ``"PlaYpaUSe"`` \| ``"PlaYpaUSE"`` \| ``"PlaYpaUse"`` \| ``"PlaYpaUsE"`` \| ``"PlaYpauSe"`` \| ``"PlaYpauSE"`` \| ``"PlaYpausE"`` \| ``"PlayPAuse"`` \| ``"PlayPAUSe"`` \| ``"PlayPAUSE"`` \| ``"PlayPAUse"`` \| ``"PlayPAUsE"`` \| ``"PlayPAuSe"`` \| ``"PlayPAuSE"`` \| ``"PlayPAusE"`` \| ``"PlayPause"`` \| ``"PlayPaUSe"`` \| ``"PlayPaUSE"`` \| ``"PlayPaUse"`` \| ``"PlayPaUsE"`` \| ``"PlayPauSe"`` \| ``"PlayPauSE"`` \| ``"PlayPausE"`` \| ``"PlaypAuse"`` \| ``"PlaypAUSe"`` \| ``"PlaypAUSE"`` \| ``"PlaypAUse"`` \| ``"PlaypAUsE"`` \| ``"PlaypAuSe"`` \| ``"PlaypAuSE"`` \| ``"PlaypAusE"`` \| ``"PlaypaUSe"`` \| ``"PlaypaUSE"`` \| ``"PlaypaUse"`` \| ``"PlaypaUsE"`` \| ``"PlaypauSe"`` \| ``"PlaypauSE"`` \| ``"PlaypausE"`` \| ``"pLaypause"`` \| ``"pLAYpause"`` \| ``"pLAYPAuse"`` \| ``"pLAYPAUSe"`` \| ``"pLAYPAUSE"`` \| ``"pLAYPAUse"`` \| ``"pLAYPAUsE"`` \| ``"pLAYPAuSe"`` \| ``"pLAYPAuSE"`` \| ``"pLAYPAusE"`` \| ``"pLAYPause"`` \| ``"pLAYPaUSe"`` \| ``"pLAYPaUSE"`` \| ``"pLAYPaUse"`` \| ``"pLAYPaUsE"`` \| ``"pLAYPauSe"`` \| ``"pLAYPauSE"`` \| ``"pLAYPausE"`` \| ``"pLAYpAuse"`` \| ``"pLAYpAUSe"`` \| ``"pLAYpAUSE"`` \| ``"pLAYpAUse"`` \| ``"pLAYpAUsE"`` \| ``"pLAYpAuSe"`` \| ``"pLAYpAuSE"`` \| ``"pLAYpAusE"`` \| ``"pLAYpaUSe"`` \| ``"pLAYpaUSE"`` \| ``"pLAYpaUse"`` \| ``"pLAYpaUsE"`` \| ``"pLAYpauSe"`` \| ``"pLAYpauSE"`` \| ``"pLAYpausE"`` \| ``"pLAypause"`` \| ``"pLAyPAuse"`` \| ``"pLAyPAUSe"`` \| ``"pLAyPAUSE"`` \| ``"pLAyPAUse"`` \| ``"pLAyPAUsE"`` \| ``"pLAyPAuSe"`` \| ``"pLAyPAuSE"`` \| ``"pLAyPAusE"`` \| ``"pLAyPause"`` \| ``"pLAyPaUSe"`` \| ``"pLAyPaUSE"`` \| ``"pLAyPaUse"`` \| ``"pLAyPaUsE"`` \| ``"pLAyPauSe"`` \| ``"pLAyPauSE"`` \| ``"pLAyPausE"`` \| ``"pLAypAuse"`` \| ``"pLAypAUSe"`` \| ``"pLAypAUSE"`` \| ``"pLAypAUse"`` \| ``"pLAypAUsE"`` \| ``"pLAypAuSe"`` \| ``"pLAypAuSE"`` \| ``"pLAypAusE"`` \| ``"pLAypaUSe"`` \| ``"pLAypaUSE"`` \| ``"pLAypaUse"`` \| ``"pLAypaUsE"`` \| ``"pLAypauSe"`` \| ``"pLAypauSE"`` \| ``"pLAypausE"`` \| ``"pLaYpause"`` \| ``"pLaYPAuse"`` \| ``"pLaYPAUSe"`` \| ``"pLaYPAUSE"`` \| ``"pLaYPAUse"`` \| ``"pLaYPAUsE"`` \| ``"pLaYPAuSe"`` \| ``"pLaYPAuSE"`` \| ``"pLaYPAusE"`` \| ``"pLaYPause"`` \| ``"pLaYPaUSe"`` \| ``"pLaYPaUSE"`` \| ``"pLaYPaUse"`` \| ``"pLaYPaUsE"`` \| ``"pLaYPauSe"`` \| ``"pLaYPauSE"`` \| ``"pLaYPausE"`` \| ``"pLaYpAuse"`` \| ``"pLaYpAUSe"`` \| ``"pLaYpAUSE"`` \| ``"pLaYpAUse"`` \| ``"pLaYpAUsE"`` \| ``"pLaYpAuSe"`` \| ``"pLaYpAuSE"`` \| ``"pLaYpAusE"`` \| ``"pLaYpaUSe"`` \| ``"pLaYpaUSE"`` \| ``"pLaYpaUse"`` \| ``"pLaYpaUsE"`` \| ``"pLaYpauSe"`` \| ``"pLaYpauSE"`` \| ``"pLaYpausE"`` \| ``"pLayPAuse"`` \| ``"pLayPAUSe"`` \| ``"pLayPAUSE"`` \| ``"pLayPAUse"`` \| ``"pLayPAUsE"`` \| ``"pLayPAuSe"`` \| ``"pLayPAuSE"`` \| ``"pLayPAusE"`` \| ``"pLayPause"`` \| ``"pLayPaUSe"`` \| ``"pLayPaUSE"`` \| ``"pLayPaUse"`` \| ``"pLayPaUsE"`` \| ``"pLayPauSe"`` \| ``"pLayPauSE"`` \| ``"pLayPausE"`` \| ``"pLaypAuse"`` \| ``"pLaypAUSe"`` \| ``"pLaypAUSE"`` \| ``"pLaypAUse"`` \| ``"pLaypAUsE"`` \| ``"pLaypAuSe"`` \| ``"pLaypAuSE"`` \| ``"pLaypAusE"`` \| ``"pLaypaUSe"`` \| ``"pLaypaUSE"`` \| ``"pLaypaUse"`` \| ``"pLaypaUsE"`` \| ``"pLaypauSe"`` \| ``"pLaypauSE"`` \| ``"pLaypausE"`` \| ``"plAYpause"`` \| ``"plAYPAuse"`` \| ``"plAYPAUSe"`` \| ``"plAYPAUSE"`` \| ``"plAYPAUse"`` \| ``"plAYPAUsE"`` \| ``"plAYPAuSe"`` \| ``"plAYPAuSE"`` \| ``"plAYPAusE"`` \| ``"plAYPause"`` \| ``"plAYPaUSe"`` \| ``"plAYPaUSE"`` \| ``"plAYPaUse"`` \| ``"plAYPaUsE"`` \| ``"plAYPauSe"`` \| ``"plAYPauSE"`` \| ``"plAYPausE"`` \| ``"plAYpAuse"`` \| ``"plAYpAUSe"`` \| ``"plAYpAUSE"`` \| ``"plAYpAUse"`` \| ``"plAYpAUsE"`` \| ``"plAYpAuSe"`` \| ``"plAYpAuSE"`` \| ``"plAYpAusE"`` \| ``"plAYpaUSe"`` \| ``"plAYpaUSE"`` \| ``"plAYpaUse"`` \| ``"plAYpaUsE"`` \| ``"plAYpauSe"`` \| ``"plAYpauSE"`` \| ``"plAYpausE"`` \| ``"plAypause"`` \| ``"plAyPAuse"`` \| ``"plAyPAUSe"`` \| ``"plAyPAUSE"`` \| ``"plAyPAUse"`` \| ``"plAyPAUsE"`` \| ``"plAyPAuSe"`` \| ``"plAyPAuSE"`` \| ``"plAyPAusE"`` \| ``"plAyPause"`` \| ``"plAyPaUSe"`` \| ``"plAyPaUSE"`` \| ``"plAyPaUse"`` \| ``"plAyPaUsE"`` \| ``"plAyPauSe"`` \| ``"plAyPauSE"`` \| ``"plAyPausE"`` \| ``"plAypAuse"`` \| ``"plAypAUSe"`` \| ``"plAypAUSE"`` \| ``"plAypAUse"`` \| ``"plAypAUsE"`` \| ``"plAypAuSe"`` \| ``"plAypAuSE"`` \| ``"plAypAusE"`` \| ``"plAypaUSe"`` \| ``"plAypaUSE"`` \| ``"plAypaUse"`` \| ``"plAypaUsE"`` \| ``"plAypauSe"`` \| ``"plAypauSE"`` \| ``"plAypausE"`` \| ``"plaYpause"`` \| ``"plaYPAuse"`` \| ``"plaYPAUSe"`` \| ``"plaYPAUSE"`` \| ``"plaYPAUse"`` \| ``"plaYPAUsE"`` \| ``"plaYPAuSe"`` \| ``"plaYPAuSE"`` \| ``"plaYPAusE"`` \| ``"plaYPause"`` \| ``"plaYPaUSe"`` \| ``"plaYPaUSE"`` \| ``"plaYPaUse"`` \| ``"plaYPaUsE"`` \| ``"plaYPauSe"`` \| ``"plaYPauSE"`` \| ``"plaYPausE"`` \| ``"plaYpAuse"`` \| ``"plaYpAUSe"`` \| ``"plaYpAUSE"`` \| ``"plaYpAUse"`` \| ``"plaYpAUsE"`` \| ``"plaYpAuSe"`` \| ``"plaYpAuSE"`` \| ``"plaYpAusE"`` \| ``"plaYpaUSe"`` \| ``"plaYpaUSE"`` \| ``"plaYpaUse"`` \| ``"plaYpaUsE"`` \| ``"plaYpauSe"`` \| ``"plaYpauSE"`` \| ``"plaYpausE"`` \| ``"playPAuse"`` \| ``"playPAUSe"`` \| ``"playPAUSE"`` \| ``"playPAUse"`` \| ``"playPAUsE"`` \| ``"playPAuSe"`` \| ``"playPAuSE"`` \| ``"playPAusE"`` \| ``"playPause"`` \| ``"playPaUSe"`` \| ``"playPaUSE"`` \| ``"playPaUse"`` \| ``"playPaUsE"`` \| ``"playPauSe"`` \| ``"playPauSE"`` \| ``"playPausE"`` \| ``"playpAuse"`` \| ``"playpAUSe"`` \| ``"playpAUSE"`` \| ``"playpAUse"`` \| ``"playpAUsE"`` \| ``"playpAuSe"`` \| ``"playpAuSE"`` \| ``"playpAusE"`` \| ``"playpaUSe"`` \| ``"playpaUSE"`` \| ``"playpaUse"`` \| ``"playpaUsE"`` \| ``"playpauSe"`` \| ``"playpauSE"`` \| ``"playpausE"`` \| ``"SElect"`` \| ``"SELEct"`` \| ``"SELECT"`` \| ``"SELECt"`` \| ``"SELEcT"`` \| ``"SELect"`` \| ``"SELeCT"`` \| ``"SELeCt"`` \| ``"SELecT"`` \| ``"SElEct"`` \| ``"SElECT"`` \| ``"SElECt"`` \| ``"SElEcT"`` \| ``"SEleCT"`` \| ``"SEleCt"`` \| ``"SElecT"`` \| ``"Select"`` \| ``"SeLEct"`` \| ``"SeLECT"`` \| ``"SeLECt"`` \| ``"SeLEcT"`` \| ``"SeLect"`` \| ``"SeLeCT"`` \| ``"SeLeCt"`` \| ``"SeLecT"`` \| ``"SelEct"`` \| ``"SelECT"`` \| ``"SelECt"`` \| ``"SelEcT"`` \| ``"SeleCT"`` \| ``"SeleCt"`` \| ``"SelecT"`` \| ``"sElect"`` \| ``"sELEct"`` \| ``"sELECT"`` \| ``"sELECt"`` \| ``"sELEcT"`` \| ``"sELect"`` \| ``"sELeCT"`` \| ``"sELeCt"`` \| ``"sELecT"`` \| ``"sElEct"`` \| ``"sElECT"`` \| ``"sElECt"`` \| ``"sElEcT"`` \| ``"sEleCT"`` \| ``"sEleCt"`` \| ``"sElecT"`` \| ``"seLEct"`` \| ``"seLECT"`` \| ``"seLECt"`` \| ``"seLEcT"`` \| ``"seLect"`` \| ``"seLeCT"`` \| ``"seLeCt"`` \| ``"seLecT"`` \| ``"selEct"`` \| ``"selECT"`` \| ``"selECt"`` \| ``"selEcT"`` \| ``"seleCT"`` \| ``"seleCt"`` \| ``"selecT"``, `durationSeconds?`: `number`) => `Promise`<`unknown`\> = `commands.generalExtensions.mobilePressButton`

#### Type declaration

▸ (`...this`, `name`, `durationSeconds?`): `Promise`<`unknown`\>

Emulates press action on the given physical device button.

This executes different methods based on the platform:

- iOS: [`pressButton:`](https://developer.apple.com/documentation/xctest/xcuidevice/1619052-pressbutton)
- tvOS: [`pressButton:`](https://developer.apple.com/documentation/xctest/xcuiremote/1627475-pressbutton) or [`pressButton:forDuration:`](https://developer.apple.com/documentation/xctest/xcuiremote/1627476-pressbutton)

Use [`mobilePerformIoHidEvent`](appium_xcuitest_driver.XCUITestDriver.md#mobileperformiohidevent) to call a more universal API to perform a button press with duration on any supported device.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `name` | ``"up"`` \| ``"down"`` \| ``"left"`` \| ``"right"`` \| ``"home"`` \| ``"volumeup"`` \| ``"volumedown"`` \| ``"menu"`` \| ``"playpause"`` \| ``"select"`` \| ``"UP"`` \| ``"Up"`` \| ``"uP"`` \| ``"DOwn"`` \| ``"DOWN"`` \| ``"DOWn"`` \| ``"DOwN"`` \| ``"Down"`` \| ``"DoWN"`` \| ``"DoWn"`` \| ``"DowN"`` \| ``"dOwn"`` \| ``"dOWN"`` \| ``"dOWn"`` \| ``"dOwN"`` \| ``"doWN"`` \| ``"doWn"`` \| ``"dowN"`` \| ``"LEft"`` \| ``"LEFT"`` \| ``"LEFt"`` \| ``"LEfT"`` \| ``"Left"`` \| ``"LeFT"`` \| ``"LeFt"`` \| ``"LefT"`` \| ``"lEft"`` \| ``"lEFT"`` \| ``"lEFt"`` \| ``"lEfT"`` \| ``"leFT"`` \| ``"leFt"`` \| ``"lefT"`` \| ``"RIght"`` \| ``"RIGHt"`` \| ``"RIGHT"`` \| ``"RIGht"`` \| ``"RIGhT"`` \| ``"RIgHt"`` \| ``"RIgHT"`` \| ``"RIghT"`` \| ``"Right"`` \| ``"RiGHt"`` \| ``"RiGHT"`` \| ``"RiGht"`` \| ``"RiGhT"`` \| ``"RigHt"`` \| ``"RigHT"`` \| ``"RighT"`` \| ``"rIght"`` \| ``"rIGHt"`` \| ``"rIGHT"`` \| ``"rIGht"`` \| ``"rIGhT"`` \| ``"rIgHt"`` \| ``"rIgHT"`` \| ``"rIghT"`` \| ``"riGHt"`` \| ``"riGHT"`` \| ``"riGht"`` \| ``"riGhT"`` \| ``"rigHt"`` \| ``"rigHT"`` \| ``"righT"`` \| ``"HOme"`` \| ``"HOME"`` \| ``"HOMe"`` \| ``"HOmE"`` \| ``"Home"`` \| ``"HoME"`` \| ``"HoMe"`` \| ``"HomE"`` \| ``"hOme"`` \| ``"hOME"`` \| ``"hOMe"`` \| ``"hOmE"`` \| ``"hoME"`` \| ``"hoMe"`` \| ``"homE"`` \| ``"VOlumeup"`` \| ``"VOLUmeup"`` \| ``"VOLUMEup"`` \| ``"VOLUMEUP"`` \| ``"VOLUMEUp"`` \| ``"VOLUMEuP"`` \| ``"VOLUMeup"`` \| ``"VOLUMeUP"`` \| ``"VOLUMeUp"`` \| ``"VOLUMeuP"`` \| ``"VOLUmEup"`` \| ``"VOLUmEUP"`` \| ``"VOLUmEUp"`` \| ``"VOLUmEuP"`` \| ``"VOLUmeUP"`` \| ``"VOLUmeUp"`` \| ``"VOLUmeuP"`` \| ``"VOLumeup"`` \| ``"VOLuMEup"`` \| ``"VOLuMEUP"`` \| ``"VOLuMEUp"`` \| ``"VOLuMEuP"`` \| ``"VOLuMeup"`` \| ``"VOLuMeUP"`` \| ``"VOLuMeUp"`` \| ``"VOLuMeuP"`` \| ``"VOLumEup"`` \| ``"VOLumEUP"`` \| ``"VOLumEUp"`` \| ``"VOLumEuP"`` \| ``"VOLumeUP"`` \| ``"VOLumeUp"`` \| ``"VOLumeuP"`` \| ``"VOlUmeup"`` \| ``"VOlUMEup"`` \| ``"VOlUMEUP"`` \| ``"VOlUMEUp"`` \| ``"VOlUMEuP"`` \| ``"VOlUMeup"`` \| ``"VOlUMeUP"`` \| ``"VOlUMeUp"`` \| ``"VOlUMeuP"`` \| ``"VOlUmEup"`` \| ``"VOlUmEUP"`` \| ``"VOlUmEUp"`` \| ``"VOlUmEuP"`` \| ``"VOlUmeUP"`` \| ``"VOlUmeUp"`` \| ``"VOlUmeuP"`` \| ``"VOluMEup"`` \| ``"VOluMEUP"`` \| ``"VOluMEUp"`` \| ``"VOluMEuP"`` \| ``"VOluMeup"`` \| ``"VOluMeUP"`` \| ``"VOluMeUp"`` \| ``"VOluMeuP"`` \| ``"VOlumEup"`` \| ``"VOlumEUP"`` \| ``"VOlumEUp"`` \| ``"VOlumEuP"`` \| ``"VOlumeUP"`` \| ``"VOlumeUp"`` \| ``"VOlumeuP"`` \| ``"Volumeup"`` \| ``"VoLUmeup"`` \| ``"VoLUMEup"`` \| ``"VoLUMEUP"`` \| ``"VoLUMEUp"`` \| ``"VoLUMEuP"`` \| ``"VoLUMeup"`` \| ``"VoLUMeUP"`` \| ``"VoLUMeUp"`` \| ``"VoLUMeuP"`` \| ``"VoLUmEup"`` \| ``"VoLUmEUP"`` \| ``"VoLUmEUp"`` \| ``"VoLUmEuP"`` \| ``"VoLUmeUP"`` \| ``"VoLUmeUp"`` \| ``"VoLUmeuP"`` \| ``"VoLumeup"`` \| ``"VoLuMEup"`` \| ``"VoLuMEUP"`` \| ``"VoLuMEUp"`` \| ``"VoLuMEuP"`` \| ``"VoLuMeup"`` \| ``"VoLuMeUP"`` \| ``"VoLuMeUp"`` \| ``"VoLuMeuP"`` \| ``"VoLumEup"`` \| ``"VoLumEUP"`` \| ``"VoLumEUp"`` \| ``"VoLumEuP"`` \| ``"VoLumeUP"`` \| ``"VoLumeUp"`` \| ``"VoLumeuP"`` \| ``"VolUmeup"`` \| ``"VolUMEup"`` \| ``"VolUMEUP"`` \| ``"VolUMEUp"`` \| ``"VolUMEuP"`` \| ``"VolUMeup"`` \| ``"VolUMeUP"`` \| ``"VolUMeUp"`` \| ``"VolUMeuP"`` \| ``"VolUmEup"`` \| ``"VolUmEUP"`` \| ``"VolUmEUp"`` \| ``"VolUmEuP"`` \| ``"VolUmeUP"`` \| ``"VolUmeUp"`` \| ``"VolUmeuP"`` \| ``"VoluMEup"`` \| ``"VoluMEUP"`` \| ``"VoluMEUp"`` \| ``"VoluMEuP"`` \| ``"VoluMeup"`` \| ``"VoluMeUP"`` \| ``"VoluMeUp"`` \| ``"VoluMeuP"`` \| ``"VolumEup"`` \| ``"VolumEUP"`` \| ``"VolumEUp"`` \| ``"VolumEuP"`` \| ``"VolumeUP"`` \| ``"VolumeUp"`` \| ``"VolumeuP"`` \| ``"vOlumeup"`` \| ``"vOLUmeup"`` \| ``"vOLUMEup"`` \| ``"vOLUMEUP"`` \| ``"vOLUMEUp"`` \| ``"vOLUMEuP"`` \| ``"vOLUMeup"`` \| ``"vOLUMeUP"`` \| ``"vOLUMeUp"`` \| ``"vOLUMeuP"`` \| ``"vOLUmEup"`` \| ``"vOLUmEUP"`` \| ``"vOLUmEUp"`` \| ``"vOLUmEuP"`` \| ``"vOLUmeUP"`` \| ``"vOLUmeUp"`` \| ``"vOLUmeuP"`` \| ``"vOLumeup"`` \| ``"vOLuMEup"`` \| ``"vOLuMEUP"`` \| ``"vOLuMEUp"`` \| ``"vOLuMEuP"`` \| ``"vOLuMeup"`` \| ``"vOLuMeUP"`` \| ``"vOLuMeUp"`` \| ``"vOLuMeuP"`` \| ``"vOLumEup"`` \| ``"vOLumEUP"`` \| ``"vOLumEUp"`` \| ``"vOLumEuP"`` \| ``"vOLumeUP"`` \| ``"vOLumeUp"`` \| ``"vOLumeuP"`` \| ``"vOlUmeup"`` \| ``"vOlUMEup"`` \| ``"vOlUMEUP"`` \| ``"vOlUMEUp"`` \| ``"vOlUMEuP"`` \| ``"vOlUMeup"`` \| ``"vOlUMeUP"`` \| ``"vOlUMeUp"`` \| ``"vOlUMeuP"`` \| ``"vOlUmEup"`` \| ``"vOlUmEUP"`` \| ``"vOlUmEUp"`` \| ``"vOlUmEuP"`` \| ``"vOlUmeUP"`` \| ``"vOlUmeUp"`` \| ``"vOlUmeuP"`` \| ``"vOluMEup"`` \| ``"vOluMEUP"`` \| ``"vOluMEUp"`` \| ``"vOluMEuP"`` \| ``"vOluMeup"`` \| ``"vOluMeUP"`` \| ``"vOluMeUp"`` \| ``"vOluMeuP"`` \| ``"vOlumEup"`` \| ``"vOlumEUP"`` \| ``"vOlumEUp"`` \| ``"vOlumEuP"`` \| ``"vOlumeUP"`` \| ``"vOlumeUp"`` \| ``"vOlumeuP"`` \| ``"voLUmeup"`` \| ``"voLUMEup"`` \| ``"voLUMEUP"`` \| ``"voLUMEUp"`` \| ``"voLUMEuP"`` \| ``"voLUMeup"`` \| ``"voLUMeUP"`` \| ``"voLUMeUp"`` \| ``"voLUMeuP"`` \| ``"voLUmEup"`` \| ``"voLUmEUP"`` \| ``"voLUmEUp"`` \| ``"voLUmEuP"`` \| ``"voLUmeUP"`` \| ``"voLUmeUp"`` \| ``"voLUmeuP"`` \| ``"voLumeup"`` \| ``"voLuMEup"`` \| ``"voLuMEUP"`` \| ``"voLuMEUp"`` \| ``"voLuMEuP"`` \| ``"voLuMeup"`` \| ``"voLuMeUP"`` \| ``"voLuMeUp"`` \| ``"voLuMeuP"`` \| ``"voLumEup"`` \| ``"voLumEUP"`` \| ``"voLumEUp"`` \| ``"voLumEuP"`` \| ``"voLumeUP"`` \| ``"voLumeUp"`` \| ``"voLumeuP"`` \| ``"volUmeup"`` \| ``"volUMEup"`` \| ``"volUMEUP"`` \| ``"volUMEUp"`` \| ``"volUMEuP"`` \| ``"volUMeup"`` \| ``"volUMeUP"`` \| ``"volUMeUp"`` \| ``"volUMeuP"`` \| ``"volUmEup"`` \| ``"volUmEUP"`` \| ``"volUmEUp"`` \| ``"volUmEuP"`` \| ``"volUmeUP"`` \| ``"volUmeUp"`` \| ``"volUmeuP"`` \| ``"voluMEup"`` \| ``"voluMEUP"`` \| ``"voluMEUp"`` \| ``"voluMEuP"`` \| ``"voluMeup"`` \| ``"voluMeUP"`` \| ``"voluMeUp"`` \| ``"voluMeuP"`` \| ``"volumEup"`` \| ``"volumEUP"`` \| ``"volumEUp"`` \| ``"volumEuP"`` \| ``"volumeUP"`` \| ``"volumeUp"`` \| ``"volumeuP"`` \| ``"VOlumedown"`` \| ``"VOLUmedown"`` \| ``"VOLUMEdown"`` \| ``"VOLUMEDOwn"`` \| ``"VOLUMEDOWN"`` \| ``"VOLUMEDOWn"`` \| ``"VOLUMEDOwN"`` \| ``"VOLUMEDown"`` \| ``"VOLUMEDoWN"`` \| ``"VOLUMEDoWn"`` \| ``"VOLUMEDowN"`` \| ``"VOLUMEdOwn"`` \| ``"VOLUMEdOWN"`` \| ``"VOLUMEdOWn"`` \| ``"VOLUMEdOwN"`` \| ``"VOLUMEdoWN"`` \| ``"VOLUMEdoWn"`` \| ``"VOLUMEdowN"`` \| ``"VOLUMedown"`` \| ``"VOLUMeDOwn"`` \| ``"VOLUMeDOWN"`` \| ``"VOLUMeDOWn"`` \| ``"VOLUMeDOwN"`` \| ``"VOLUMeDown"`` \| ``"VOLUMeDoWN"`` \| ``"VOLUMeDoWn"`` \| ``"VOLUMeDowN"`` \| ``"VOLUMedOwn"`` \| ``"VOLUMedOWN"`` \| ``"VOLUMedOWn"`` \| ``"VOLUMedOwN"`` \| ``"VOLUMedoWN"`` \| ``"VOLUMedoWn"`` \| ``"VOLUMedowN"`` \| ``"VOLUmEdown"`` \| ``"VOLUmEDOwn"`` \| ``"VOLUmEDOWN"`` \| ``"VOLUmEDOWn"`` \| ``"VOLUmEDOwN"`` \| ``"VOLUmEDown"`` \| ``"VOLUmEDoWN"`` \| ``"VOLUmEDoWn"`` \| ``"VOLUmEDowN"`` \| ``"VOLUmEdOwn"`` \| ``"VOLUmEdOWN"`` \| ``"VOLUmEdOWn"`` \| ``"VOLUmEdOwN"`` \| ``"VOLUmEdoWN"`` \| ``"VOLUmEdoWn"`` \| ``"VOLUmEdowN"`` \| ``"VOLUmeDOwn"`` \| ``"VOLUmeDOWN"`` \| ``"VOLUmeDOWn"`` \| ``"VOLUmeDOwN"`` \| ``"VOLUmeDown"`` \| ``"VOLUmeDoWN"`` \| ``"VOLUmeDoWn"`` \| ``"VOLUmeDowN"`` \| ``"VOLUmedOwn"`` \| ``"VOLUmedOWN"`` \| ``"VOLUmedOWn"`` \| ``"VOLUmedOwN"`` \| ``"VOLUmedoWN"`` \| ``"VOLUmedoWn"`` \| ``"VOLUmedowN"`` \| ``"VOLumedown"`` \| ``"VOLuMEdown"`` \| ``"VOLuMEDOwn"`` \| ``"VOLuMEDOWN"`` \| ``"VOLuMEDOWn"`` \| ``"VOLuMEDOwN"`` \| ``"VOLuMEDown"`` \| ``"VOLuMEDoWN"`` \| ``"VOLuMEDoWn"`` \| ``"VOLuMEDowN"`` \| ``"VOLuMEdOwn"`` \| ``"VOLuMEdOWN"`` \| ``"VOLuMEdOWn"`` \| ``"VOLuMEdOwN"`` \| ``"VOLuMEdoWN"`` \| ``"VOLuMEdoWn"`` \| ``"VOLuMEdowN"`` \| ``"VOLuMedown"`` \| ``"VOLuMeDOwn"`` \| ``"VOLuMeDOWN"`` \| ``"VOLuMeDOWn"`` \| ``"VOLuMeDOwN"`` \| ``"VOLuMeDown"`` \| ``"VOLuMeDoWN"`` \| ``"VOLuMeDoWn"`` \| ``"VOLuMeDowN"`` \| ``"VOLuMedOwn"`` \| ``"VOLuMedOWN"`` \| ``"VOLuMedOWn"`` \| ``"VOLuMedOwN"`` \| ``"VOLuMedoWN"`` \| ``"VOLuMedoWn"`` \| ``"VOLuMedowN"`` \| ``"VOLumEdown"`` \| ``"VOLumEDOwn"`` \| ``"VOLumEDOWN"`` \| ``"VOLumEDOWn"`` \| ``"VOLumEDOwN"`` \| ``"VOLumEDown"`` \| ``"VOLumEDoWN"`` \| ``"VOLumEDoWn"`` \| ``"VOLumEDowN"`` \| ``"VOLumEdOwn"`` \| ``"VOLumEdOWN"`` \| ``"VOLumEdOWn"`` \| ``"VOLumEdOwN"`` \| ``"VOLumEdoWN"`` \| ``"VOLumEdoWn"`` \| ``"VOLumEdowN"`` \| ``"VOLumeDOwn"`` \| ``"VOLumeDOWN"`` \| ``"VOLumeDOWn"`` \| ``"VOLumeDOwN"`` \| ``"VOLumeDown"`` \| ``"VOLumeDoWN"`` \| ``"VOLumeDoWn"`` \| ``"VOLumeDowN"`` \| ``"VOLumedOwn"`` \| ``"VOLumedOWN"`` \| ``"VOLumedOWn"`` \| ``"VOLumedOwN"`` \| ``"VOLumedoWN"`` \| ``"VOLumedoWn"`` \| ``"VOLumedowN"`` \| ``"VOlUmedown"`` \| ``"VOlUMEdown"`` \| ``"VOlUMEDOwn"`` \| ``"VOlUMEDOWN"`` \| ``"VOlUMEDOWn"`` \| ``"VOlUMEDOwN"`` \| ``"VOlUMEDown"`` \| ``"VOlUMEDoWN"`` \| ``"VOlUMEDoWn"`` \| ``"VOlUMEDowN"`` \| ``"VOlUMEdOwn"`` \| ``"VOlUMEdOWN"`` \| ``"VOlUMEdOWn"`` \| ``"VOlUMEdOwN"`` \| ``"VOlUMEdoWN"`` \| ``"VOlUMEdoWn"`` \| ``"VOlUMEdowN"`` \| ``"VOlUMedown"`` \| ``"VOlUMeDOwn"`` \| ``"VOlUMeDOWN"`` \| ``"VOlUMeDOWn"`` \| ``"VOlUMeDOwN"`` \| ``"VOlUMeDown"`` \| ``"VOlUMeDoWN"`` \| ``"VOlUMeDoWn"`` \| ``"VOlUMeDowN"`` \| ``"VOlUMedOwn"`` \| ``"VOlUMedOWN"`` \| ``"VOlUMedOWn"`` \| ``"VOlUMedOwN"`` \| ``"VOlUMedoWN"`` \| ``"VOlUMedoWn"`` \| ``"VOlUMedowN"`` \| ``"VOlUmEdown"`` \| ``"VOlUmEDOwn"`` \| ``"VOlUmEDOWN"`` \| ``"VOlUmEDOWn"`` \| ``"VOlUmEDOwN"`` \| ``"VOlUmEDown"`` \| ``"VOlUmEDoWN"`` \| ``"VOlUmEDoWn"`` \| ``"VOlUmEDowN"`` \| ``"VOlUmEdOwn"`` \| ``"VOlUmEdOWN"`` \| ``"VOlUmEdOWn"`` \| ``"VOlUmEdOwN"`` \| ``"VOlUmEdoWN"`` \| ``"VOlUmEdoWn"`` \| ``"VOlUmEdowN"`` \| ``"VOlUmeDOwn"`` \| ``"VOlUmeDOWN"`` \| ``"VOlUmeDOWn"`` \| ``"VOlUmeDOwN"`` \| ``"VOlUmeDown"`` \| ``"VOlUmeDoWN"`` \| ``"VOlUmeDoWn"`` \| ``"VOlUmeDowN"`` \| ``"VOlUmedOwn"`` \| ``"VOlUmedOWN"`` \| ``"VOlUmedOWn"`` \| ``"VOlUmedOwN"`` \| ``"VOlUmedoWN"`` \| ``"VOlUmedoWn"`` \| ``"VOlUmedowN"`` \| ``"VOluMEdown"`` \| ``"VOluMEDOwn"`` \| ``"VOluMEDOWN"`` \| ``"VOluMEDOWn"`` \| ``"VOluMEDOwN"`` \| ``"VOluMEDown"`` \| ``"VOluMEDoWN"`` \| ``"VOluMEDoWn"`` \| ``"VOluMEDowN"`` \| ``"VOluMEdOwn"`` \| ``"VOluMEdOWN"`` \| ``"VOluMEdOWn"`` \| ``"VOluMEdOwN"`` \| ``"VOluMEdoWN"`` \| ``"VOluMEdoWn"`` \| ``"VOluMEdowN"`` \| ``"VOluMedown"`` \| ``"VOluMeDOwn"`` \| ``"VOluMeDOWN"`` \| ``"VOluMeDOWn"`` \| ``"VOluMeDOwN"`` \| ``"VOluMeDown"`` \| ``"VOluMeDoWN"`` \| ``"VOluMeDoWn"`` \| ``"VOluMeDowN"`` \| ``"VOluMedOwn"`` \| ``"VOluMedOWN"`` \| ``"VOluMedOWn"`` \| ``"VOluMedOwN"`` \| ``"VOluMedoWN"`` \| ``"VOluMedoWn"`` \| ``"VOluMedowN"`` \| ``"VOlumEdown"`` \| ``"VOlumEDOwn"`` \| ``"VOlumEDOWN"`` \| ``"VOlumEDOWn"`` \| ``"VOlumEDOwN"`` \| ``"VOlumEDown"`` \| ``"VOlumEDoWN"`` \| ``"VOlumEDoWn"`` \| ``"VOlumEDowN"`` \| ``"VOlumEdOwn"`` \| ``"VOlumEdOWN"`` \| ``"VOlumEdOWn"`` \| ``"VOlumEdOwN"`` \| ``"VOlumEdoWN"`` \| ``"VOlumEdoWn"`` \| ``"VOlumEdowN"`` \| ``"VOlumeDOwn"`` \| ``"VOlumeDOWN"`` \| ``"VOlumeDOWn"`` \| ``"VOlumeDOwN"`` \| ``"VOlumeDown"`` \| ``"VOlumeDoWN"`` \| ``"VOlumeDoWn"`` \| ``"VOlumeDowN"`` \| ``"VOlumedOwn"`` \| ``"VOlumedOWN"`` \| ``"VOlumedOWn"`` \| ``"VOlumedOwN"`` \| ``"VOlumedoWN"`` \| ``"VOlumedoWn"`` \| ``"VOlumedowN"`` \| ``"Volumedown"`` \| ``"VoLUmedown"`` \| ``"VoLUMEdown"`` \| ``"VoLUMEDOwn"`` \| ``"VoLUMEDOWN"`` \| ``"VoLUMEDOWn"`` \| ``"VoLUMEDOwN"`` \| ``"VoLUMEDown"`` \| ``"VoLUMEDoWN"`` \| ``"VoLUMEDoWn"`` \| ``"VoLUMEDowN"`` \| ``"VoLUMEdOwn"`` \| ``"VoLUMEdOWN"`` \| ``"VoLUMEdOWn"`` \| ``"VoLUMEdOwN"`` \| ``"VoLUMEdoWN"`` \| ``"VoLUMEdoWn"`` \| ``"VoLUMEdowN"`` \| ``"VoLUMedown"`` \| ``"VoLUMeDOwn"`` \| ``"VoLUMeDOWN"`` \| ``"VoLUMeDOWn"`` \| ``"VoLUMeDOwN"`` \| ``"VoLUMeDown"`` \| ``"VoLUMeDoWN"`` \| ``"VoLUMeDoWn"`` \| ``"VoLUMeDowN"`` \| ``"VoLUMedOwn"`` \| ``"VoLUMedOWN"`` \| ``"VoLUMedOWn"`` \| ``"VoLUMedOwN"`` \| ``"VoLUMedoWN"`` \| ``"VoLUMedoWn"`` \| ``"VoLUMedowN"`` \| ``"VoLUmEdown"`` \| ``"VoLUmEDOwn"`` \| ``"VoLUmEDOWN"`` \| ``"VoLUmEDOWn"`` \| ``"VoLUmEDOwN"`` \| ``"VoLUmEDown"`` \| ``"VoLUmEDoWN"`` \| ``"VoLUmEDoWn"`` \| ``"VoLUmEDowN"`` \| ``"VoLUmEdOwn"`` \| ``"VoLUmEdOWN"`` \| ``"VoLUmEdOWn"`` \| ``"VoLUmEdOwN"`` \| ``"VoLUmEdoWN"`` \| ``"VoLUmEdoWn"`` \| ``"VoLUmEdowN"`` \| ``"VoLUmeDOwn"`` \| ``"VoLUmeDOWN"`` \| ``"VoLUmeDOWn"`` \| ``"VoLUmeDOwN"`` \| ``"VoLUmeDown"`` \| ``"VoLUmeDoWN"`` \| ``"VoLUmeDoWn"`` \| ``"VoLUmeDowN"`` \| ``"VoLUmedOwn"`` \| ``"VoLUmedOWN"`` \| ``"VoLUmedOWn"`` \| ``"VoLUmedOwN"`` \| ``"VoLUmedoWN"`` \| ``"VoLUmedoWn"`` \| ``"VoLUmedowN"`` \| ``"VoLumedown"`` \| ``"VoLuMEdown"`` \| ``"VoLuMEDOwn"`` \| ``"VoLuMEDOWN"`` \| ``"VoLuMEDOWn"`` \| ``"VoLuMEDOwN"`` \| ``"VoLuMEDown"`` \| ``"VoLuMEDoWN"`` \| ``"VoLuMEDoWn"`` \| ``"VoLuMEDowN"`` \| ``"VoLuMEdOwn"`` \| ``"VoLuMEdOWN"`` \| ``"VoLuMEdOWn"`` \| ``"VoLuMEdOwN"`` \| ``"VoLuMEdoWN"`` \| ``"VoLuMEdoWn"`` \| ``"VoLuMEdowN"`` \| ``"VoLuMedown"`` \| ``"VoLuMeDOwn"`` \| ``"VoLuMeDOWN"`` \| ``"VoLuMeDOWn"`` \| ``"VoLuMeDOwN"`` \| ``"VoLuMeDown"`` \| ``"VoLuMeDoWN"`` \| ``"VoLuMeDoWn"`` \| ``"VoLuMeDowN"`` \| ``"VoLuMedOwn"`` \| ``"VoLuMedOWN"`` \| ``"VoLuMedOWn"`` \| ``"VoLuMedOwN"`` \| ``"VoLuMedoWN"`` \| ``"VoLuMedoWn"`` \| ``"VoLuMedowN"`` \| ``"VoLumEdown"`` \| ``"VoLumEDOwn"`` \| ``"VoLumEDOWN"`` \| ``"VoLumEDOWn"`` \| ``"VoLumEDOwN"`` \| ``"VoLumEDown"`` \| ``"VoLumEDoWN"`` \| ``"VoLumEDoWn"`` \| ``"VoLumEDowN"`` \| ``"VoLumEdOwn"`` \| ``"VoLumEdOWN"`` \| ``"VoLumEdOWn"`` \| ``"VoLumEdOwN"`` \| ``"VoLumEdoWN"`` \| ``"VoLumEdoWn"`` \| ``"VoLumEdowN"`` \| ``"VoLumeDOwn"`` \| ``"VoLumeDOWN"`` \| ``"VoLumeDOWn"`` \| ``"VoLumeDOwN"`` \| ``"VoLumeDown"`` \| ``"VoLumeDoWN"`` \| ``"VoLumeDoWn"`` \| ``"VoLumeDowN"`` \| ``"VoLumedOwn"`` \| ``"VoLumedOWN"`` \| ``"VoLumedOWn"`` \| ``"VoLumedOwN"`` \| ``"VoLumedoWN"`` \| ``"VoLumedoWn"`` \| ``"VoLumedowN"`` \| ``"VolUmedown"`` \| ``"VolUMEdown"`` \| ``"VolUMEDOwn"`` \| ``"VolUMEDOWN"`` \| ``"VolUMEDOWn"`` \| ``"VolUMEDOwN"`` \| ``"VolUMEDown"`` \| ``"VolUMEDoWN"`` \| ``"VolUMEDoWn"`` \| ``"VolUMEDowN"`` \| ``"VolUMEdOwn"`` \| ``"VolUMEdOWN"`` \| ``"VolUMEdOWn"`` \| ``"VolUMEdOwN"`` \| ``"VolUMEdoWN"`` \| ``"VolUMEdoWn"`` \| ``"VolUMEdowN"`` \| ``"VolUMedown"`` \| ``"VolUMeDOwn"`` \| ``"VolUMeDOWN"`` \| ``"VolUMeDOWn"`` \| ``"VolUMeDOwN"`` \| ``"VolUMeDown"`` \| ``"VolUMeDoWN"`` \| ``"VolUMeDoWn"`` \| ``"VolUMeDowN"`` \| ``"VolUMedOwn"`` \| ``"VolUMedOWN"`` \| ``"VolUMedOWn"`` \| ``"VolUMedOwN"`` \| ``"VolUMedoWN"`` \| ``"VolUMedoWn"`` \| ``"VolUMedowN"`` \| ``"VolUmEdown"`` \| ``"VolUmEDOwn"`` \| ``"VolUmEDOWN"`` \| ``"VolUmEDOWn"`` \| ``"VolUmEDOwN"`` \| ``"VolUmEDown"`` \| ``"VolUmEDoWN"`` \| ``"VolUmEDoWn"`` \| ``"VolUmEDowN"`` \| ``"VolUmEdOwn"`` \| ``"VolUmEdOWN"`` \| ``"VolUmEdOWn"`` \| ``"VolUmEdOwN"`` \| ``"VolUmEdoWN"`` \| ``"VolUmEdoWn"`` \| ``"VolUmEdowN"`` \| ``"VolUmeDOwn"`` \| ``"VolUmeDOWN"`` \| ``"VolUmeDOWn"`` \| ``"VolUmeDOwN"`` \| ``"VolUmeDown"`` \| ``"VolUmeDoWN"`` \| ``"VolUmeDoWn"`` \| ``"VolUmeDowN"`` \| ``"VolUmedOwn"`` \| ``"VolUmedOWN"`` \| ``"VolUmedOWn"`` \| ``"VolUmedOwN"`` \| ``"VolUmedoWN"`` \| ``"VolUmedoWn"`` \| ``"VolUmedowN"`` \| ``"VoluMEdown"`` \| ``"VoluMEDOwn"`` \| ``"VoluMEDOWN"`` \| ``"VoluMEDOWn"`` \| ``"VoluMEDOwN"`` \| ``"VoluMEDown"`` \| ``"VoluMEDoWN"`` \| ``"VoluMEDoWn"`` \| ``"VoluMEDowN"`` \| ``"VoluMEdOwn"`` \| ``"VoluMEdOWN"`` \| ``"VoluMEdOWn"`` \| ``"VoluMEdOwN"`` \| ``"VoluMEdoWN"`` \| ``"VoluMEdoWn"`` \| ``"VoluMEdowN"`` \| ``"VoluMedown"`` \| ``"VoluMeDOwn"`` \| ``"VoluMeDOWN"`` \| ``"VoluMeDOWn"`` \| ``"VoluMeDOwN"`` \| ``"VoluMeDown"`` \| ``"VoluMeDoWN"`` \| ``"VoluMeDoWn"`` \| ``"VoluMeDowN"`` \| ``"VoluMedOwn"`` \| ``"VoluMedOWN"`` \| ``"VoluMedOWn"`` \| ``"VoluMedOwN"`` \| ``"VoluMedoWN"`` \| ``"VoluMedoWn"`` \| ``"VoluMedowN"`` \| ``"VolumEdown"`` \| ``"VolumEDOwn"`` \| ``"VolumEDOWN"`` \| ``"VolumEDOWn"`` \| ``"VolumEDOwN"`` \| ``"VolumEDown"`` \| ``"VolumEDoWN"`` \| ``"VolumEDoWn"`` \| ``"VolumEDowN"`` \| ``"VolumEdOwn"`` \| ``"VolumEdOWN"`` \| ``"VolumEdOWn"`` \| ``"VolumEdOwN"`` \| ``"VolumEdoWN"`` \| ``"VolumEdoWn"`` \| ``"VolumEdowN"`` \| ``"VolumeDOwn"`` \| ``"VolumeDOWN"`` \| ``"VolumeDOWn"`` \| ``"VolumeDOwN"`` \| ``"VolumeDown"`` \| ``"VolumeDoWN"`` \| ``"VolumeDoWn"`` \| ``"VolumeDowN"`` \| ``"VolumedOwn"`` \| ``"VolumedOWN"`` \| ``"VolumedOWn"`` \| ``"VolumedOwN"`` \| ``"VolumedoWN"`` \| ``"VolumedoWn"`` \| ``"VolumedowN"`` \| ``"vOlumedown"`` \| ``"vOLUmedown"`` \| ``"vOLUMEdown"`` \| ``"vOLUMEDOwn"`` \| ``"vOLUMEDOWN"`` \| ``"vOLUMEDOWn"`` \| ``"vOLUMEDOwN"`` \| ``"vOLUMEDown"`` \| ``"vOLUMEDoWN"`` \| ``"vOLUMEDoWn"`` \| ``"vOLUMEDowN"`` \| ``"vOLUMEdOwn"`` \| ``"vOLUMEdOWN"`` \| ``"vOLUMEdOWn"`` \| ``"vOLUMEdOwN"`` \| ``"vOLUMEdoWN"`` \| ``"vOLUMEdoWn"`` \| ``"vOLUMEdowN"`` \| ``"vOLUMedown"`` \| ``"vOLUMeDOwn"`` \| ``"vOLUMeDOWN"`` \| ``"vOLUMeDOWn"`` \| ``"vOLUMeDOwN"`` \| ``"vOLUMeDown"`` \| ``"vOLUMeDoWN"`` \| ``"vOLUMeDoWn"`` \| ``"vOLUMeDowN"`` \| ``"vOLUMedOwn"`` \| ``"vOLUMedOWN"`` \| ``"vOLUMedOWn"`` \| ``"vOLUMedOwN"`` \| ``"vOLUMedoWN"`` \| ``"vOLUMedoWn"`` \| ``"vOLUMedowN"`` \| ``"vOLUmEdown"`` \| ``"vOLUmEDOwn"`` \| ``"vOLUmEDOWN"`` \| ``"vOLUmEDOWn"`` \| ``"vOLUmEDOwN"`` \| ``"vOLUmEDown"`` \| ``"vOLUmEDoWN"`` \| ``"vOLUmEDoWn"`` \| ``"vOLUmEDowN"`` \| ``"vOLUmEdOwn"`` \| ``"vOLUmEdOWN"`` \| ``"vOLUmEdOWn"`` \| ``"vOLUmEdOwN"`` \| ``"vOLUmEdoWN"`` \| ``"vOLUmEdoWn"`` \| ``"vOLUmEdowN"`` \| ``"vOLUmeDOwn"`` \| ``"vOLUmeDOWN"`` \| ``"vOLUmeDOWn"`` \| ``"vOLUmeDOwN"`` \| ``"vOLUmeDown"`` \| ``"vOLUmeDoWN"`` \| ``"vOLUmeDoWn"`` \| ``"vOLUmeDowN"`` \| ``"vOLUmedOwn"`` \| ``"vOLUmedOWN"`` \| ``"vOLUmedOWn"`` \| ``"vOLUmedOwN"`` \| ``"vOLUmedoWN"`` \| ``"vOLUmedoWn"`` \| ``"vOLUmedowN"`` \| ``"vOLumedown"`` \| ``"vOLuMEdown"`` \| ``"vOLuMEDOwn"`` \| ``"vOLuMEDOWN"`` \| ``"vOLuMEDOWn"`` \| ``"vOLuMEDOwN"`` \| ``"vOLuMEDown"`` \| ``"vOLuMEDoWN"`` \| ``"vOLuMEDoWn"`` \| ``"vOLuMEDowN"`` \| ``"vOLuMEdOwn"`` \| ``"vOLuMEdOWN"`` \| ``"vOLuMEdOWn"`` \| ``"vOLuMEdOwN"`` \| ``"vOLuMEdoWN"`` \| ``"vOLuMEdoWn"`` \| ``"vOLuMEdowN"`` \| ``"vOLuMedown"`` \| ``"vOLuMeDOwn"`` \| ``"vOLuMeDOWN"`` \| ``"vOLuMeDOWn"`` \| ``"vOLuMeDOwN"`` \| ``"vOLuMeDown"`` \| ``"vOLuMeDoWN"`` \| ``"vOLuMeDoWn"`` \| ``"vOLuMeDowN"`` \| ``"vOLuMedOwn"`` \| ``"vOLuMedOWN"`` \| ``"vOLuMedOWn"`` \| ``"vOLuMedOwN"`` \| ``"vOLuMedoWN"`` \| ``"vOLuMedoWn"`` \| ``"vOLuMedowN"`` \| ``"vOLumEdown"`` \| ``"vOLumEDOwn"`` \| ``"vOLumEDOWN"`` \| ``"vOLumEDOWn"`` \| ``"vOLumEDOwN"`` \| ``"vOLumEDown"`` \| ``"vOLumEDoWN"`` \| ``"vOLumEDoWn"`` \| ``"vOLumEDowN"`` \| ``"vOLumEdOwn"`` \| ``"vOLumEdOWN"`` \| ``"vOLumEdOWn"`` \| ``"vOLumEdOwN"`` \| ``"vOLumEdoWN"`` \| ``"vOLumEdoWn"`` \| ``"vOLumEdowN"`` \| ``"vOLumeDOwn"`` \| ``"vOLumeDOWN"`` \| ``"vOLumeDOWn"`` \| ``"vOLumeDOwN"`` \| ``"vOLumeDown"`` \| ``"vOLumeDoWN"`` \| ``"vOLumeDoWn"`` \| ``"vOLumeDowN"`` \| ``"vOLumedOwn"`` \| ``"vOLumedOWN"`` \| ``"vOLumedOWn"`` \| ``"vOLumedOwN"`` \| ``"vOLumedoWN"`` \| ``"vOLumedoWn"`` \| ``"vOLumedowN"`` \| ``"vOlUmedown"`` \| ``"vOlUMEdown"`` \| ``"vOlUMEDOwn"`` \| ``"vOlUMEDOWN"`` \| ``"vOlUMEDOWn"`` \| ``"vOlUMEDOwN"`` \| ``"vOlUMEDown"`` \| ``"vOlUMEDoWN"`` \| ``"vOlUMEDoWn"`` \| ``"vOlUMEDowN"`` \| ``"vOlUMEdOwn"`` \| ``"vOlUMEdOWN"`` \| ``"vOlUMEdOWn"`` \| ``"vOlUMEdOwN"`` \| ``"vOlUMEdoWN"`` \| ``"vOlUMEdoWn"`` \| ``"vOlUMEdowN"`` \| ``"vOlUMedown"`` \| ``"vOlUMeDOwn"`` \| ``"vOlUMeDOWN"`` \| ``"vOlUMeDOWn"`` \| ``"vOlUMeDOwN"`` \| ``"vOlUMeDown"`` \| ``"vOlUMeDoWN"`` \| ``"vOlUMeDoWn"`` \| ``"vOlUMeDowN"`` \| ``"vOlUMedOwn"`` \| ``"vOlUMedOWN"`` \| ``"vOlUMedOWn"`` \| ``"vOlUMedOwN"`` \| ``"vOlUMedoWN"`` \| ``"vOlUMedoWn"`` \| ``"vOlUMedowN"`` \| ``"vOlUmEdown"`` \| ``"vOlUmEDOwn"`` \| ``"vOlUmEDOWN"`` \| ``"vOlUmEDOWn"`` \| ``"vOlUmEDOwN"`` \| ``"vOlUmEDown"`` \| ``"vOlUmEDoWN"`` \| ``"vOlUmEDoWn"`` \| ``"vOlUmEDowN"`` \| ``"vOlUmEdOwn"`` \| ``"vOlUmEdOWN"`` \| ``"vOlUmEdOWn"`` \| ``"vOlUmEdOwN"`` \| ``"vOlUmEdoWN"`` \| ``"vOlUmEdoWn"`` \| ``"vOlUmEdowN"`` \| ``"vOlUmeDOwn"`` \| ``"vOlUmeDOWN"`` \| ``"vOlUmeDOWn"`` \| ``"vOlUmeDOwN"`` \| ``"vOlUmeDown"`` \| ``"vOlUmeDoWN"`` \| ``"vOlUmeDoWn"`` \| ``"vOlUmeDowN"`` \| ``"vOlUmedOwn"`` \| ``"vOlUmedOWN"`` \| ``"vOlUmedOWn"`` \| ``"vOlUmedOwN"`` \| ``"vOlUmedoWN"`` \| ``"vOlUmedoWn"`` \| ``"vOlUmedowN"`` \| ``"vOluMEdown"`` \| ``"vOluMEDOwn"`` \| ``"vOluMEDOWN"`` \| ``"vOluMEDOWn"`` \| ``"vOluMEDOwN"`` \| ``"vOluMEDown"`` \| ``"vOluMEDoWN"`` \| ``"vOluMEDoWn"`` \| ``"vOluMEDowN"`` \| ``"vOluMEdOwn"`` \| ``"vOluMEdOWN"`` \| ``"vOluMEdOWn"`` \| ``"vOluMEdOwN"`` \| ``"vOluMEdoWN"`` \| ``"vOluMEdoWn"`` \| ``"vOluMEdowN"`` \| ``"vOluMedown"`` \| ``"vOluMeDOwn"`` \| ``"vOluMeDOWN"`` \| ``"vOluMeDOWn"`` \| ``"vOluMeDOwN"`` \| ``"vOluMeDown"`` \| ``"vOluMeDoWN"`` \| ``"vOluMeDoWn"`` \| ``"vOluMeDowN"`` \| ``"vOluMedOwn"`` \| ``"vOluMedOWN"`` \| ``"vOluMedOWn"`` \| ``"vOluMedOwN"`` \| ``"vOluMedoWN"`` \| ``"vOluMedoWn"`` \| ``"vOluMedowN"`` \| ``"vOlumEdown"`` \| ``"vOlumEDOwn"`` \| ``"vOlumEDOWN"`` \| ``"vOlumEDOWn"`` \| ``"vOlumEDOwN"`` \| ``"vOlumEDown"`` \| ``"vOlumEDoWN"`` \| ``"vOlumEDoWn"`` \| ``"vOlumEDowN"`` \| ``"vOlumEdOwn"`` \| ``"vOlumEdOWN"`` \| ``"vOlumEdOWn"`` \| ``"vOlumEdOwN"`` \| ``"vOlumEdoWN"`` \| ``"vOlumEdoWn"`` \| ``"vOlumEdowN"`` \| ``"vOlumeDOwn"`` \| ``"vOlumeDOWN"`` \| ``"vOlumeDOWn"`` \| ``"vOlumeDOwN"`` \| ``"vOlumeDown"`` \| ``"vOlumeDoWN"`` \| ``"vOlumeDoWn"`` \| ``"vOlumeDowN"`` \| ``"vOlumedOwn"`` \| ``"vOlumedOWN"`` \| ``"vOlumedOWn"`` \| ``"vOlumedOwN"`` \| ``"vOlumedoWN"`` \| ``"vOlumedoWn"`` \| ``"vOlumedowN"`` \| ``"voLUmedown"`` \| ``"voLUMEdown"`` \| ``"voLUMEDOwn"`` \| ``"voLUMEDOWN"`` \| ``"voLUMEDOWn"`` \| ``"voLUMEDOwN"`` \| ``"voLUMEDown"`` \| ``"voLUMEDoWN"`` \| ``"voLUMEDoWn"`` \| ``"voLUMEDowN"`` \| ``"voLUMEdOwn"`` \| ``"voLUMEdOWN"`` \| ``"voLUMEdOWn"`` \| ``"voLUMEdOwN"`` \| ``"voLUMEdoWN"`` \| ``"voLUMEdoWn"`` \| ``"voLUMEdowN"`` \| ``"voLUMedown"`` \| ``"voLUMeDOwn"`` \| ``"voLUMeDOWN"`` \| ``"voLUMeDOWn"`` \| ``"voLUMeDOwN"`` \| ``"voLUMeDown"`` \| ``"voLUMeDoWN"`` \| ``"voLUMeDoWn"`` \| ``"voLUMeDowN"`` \| ``"voLUMedOwn"`` \| ``"voLUMedOWN"`` \| ``"voLUMedOWn"`` \| ``"voLUMedOwN"`` \| ``"voLUMedoWN"`` \| ``"voLUMedoWn"`` \| ``"voLUMedowN"`` \| ``"voLUmEdown"`` \| ``"voLUmEDOwn"`` \| ``"voLUmEDOWN"`` \| ``"voLUmEDOWn"`` \| ``"voLUmEDOwN"`` \| ``"voLUmEDown"`` \| ``"voLUmEDoWN"`` \| ``"voLUmEDoWn"`` \| ``"voLUmEDowN"`` \| ``"voLUmEdOwn"`` \| ``"voLUmEdOWN"`` \| ``"voLUmEdOWn"`` \| ``"voLUmEdOwN"`` \| ``"voLUmEdoWN"`` \| ``"voLUmEdoWn"`` \| ``"voLUmEdowN"`` \| ``"voLUmeDOwn"`` \| ``"voLUmeDOWN"`` \| ``"voLUmeDOWn"`` \| ``"voLUmeDOwN"`` \| ``"voLUmeDown"`` \| ``"voLUmeDoWN"`` \| ``"voLUmeDoWn"`` \| ``"voLUmeDowN"`` \| ``"voLUmedOwn"`` \| ``"voLUmedOWN"`` \| ``"voLUmedOWn"`` \| ``"voLUmedOwN"`` \| ``"voLUmedoWN"`` \| ``"voLUmedoWn"`` \| ``"voLUmedowN"`` \| ``"voLumedown"`` \| ``"voLuMEdown"`` \| ``"voLuMEDOwn"`` \| ``"voLuMEDOWN"`` \| ``"voLuMEDOWn"`` \| ``"voLuMEDOwN"`` \| ``"voLuMEDown"`` \| ``"voLuMEDoWN"`` \| ``"voLuMEDoWn"`` \| ``"voLuMEDowN"`` \| ``"voLuMEdOwn"`` \| ``"voLuMEdOWN"`` \| ``"voLuMEdOWn"`` \| ``"voLuMEdOwN"`` \| ``"voLuMEdoWN"`` \| ``"voLuMEdoWn"`` \| ``"voLuMEdowN"`` \| ``"voLuMedown"`` \| ``"voLuMeDOwn"`` \| ``"voLuMeDOWN"`` \| ``"voLuMeDOWn"`` \| ``"voLuMeDOwN"`` \| ``"voLuMeDown"`` \| ``"voLuMeDoWN"`` \| ``"voLuMeDoWn"`` \| ``"voLuMeDowN"`` \| ``"voLuMedOwn"`` \| ``"voLuMedOWN"`` \| ``"voLuMedOWn"`` \| ``"voLuMedOwN"`` \| ``"voLuMedoWN"`` \| ``"voLuMedoWn"`` \| ``"voLuMedowN"`` \| ``"voLumEdown"`` \| ``"voLumEDOwn"`` \| ``"voLumEDOWN"`` \| ``"voLumEDOWn"`` \| ``"voLumEDOwN"`` \| ``"voLumEDown"`` \| ``"voLumEDoWN"`` \| ``"voLumEDoWn"`` \| ``"voLumEDowN"`` \| ``"voLumEdOwn"`` \| ``"voLumEdOWN"`` \| ``"voLumEdOWn"`` \| ``"voLumEdOwN"`` \| ``"voLumEdoWN"`` \| ``"voLumEdoWn"`` \| ``"voLumEdowN"`` \| ``"voLumeDOwn"`` \| ``"voLumeDOWN"`` \| ``"voLumeDOWn"`` \| ``"voLumeDOwN"`` \| ``"voLumeDown"`` \| ``"voLumeDoWN"`` \| ``"voLumeDoWn"`` \| ``"voLumeDowN"`` \| ``"voLumedOwn"`` \| ``"voLumedOWN"`` \| ``"voLumedOWn"`` \| ``"voLumedOwN"`` \| ``"voLumedoWN"`` \| ``"voLumedoWn"`` \| ``"voLumedowN"`` \| ``"volUmedown"`` \| ``"volUMEdown"`` \| ``"volUMEDOwn"`` \| ``"volUMEDOWN"`` \| ``"volUMEDOWn"`` \| ``"volUMEDOwN"`` \| ``"volUMEDown"`` \| ``"volUMEDoWN"`` \| ``"volUMEDoWn"`` \| ``"volUMEDowN"`` \| ``"volUMEdOwn"`` \| ``"volUMEdOWN"`` \| ``"volUMEdOWn"`` \| ``"volUMEdOwN"`` \| ``"volUMEdoWN"`` \| ``"volUMEdoWn"`` \| ``"volUMEdowN"`` \| ``"volUMedown"`` \| ``"volUMeDOwn"`` \| ``"volUMeDOWN"`` \| ``"volUMeDOWn"`` \| ``"volUMeDOwN"`` \| ``"volUMeDown"`` \| ``"volUMeDoWN"`` \| ``"volUMeDoWn"`` \| ``"volUMeDowN"`` \| ``"volUMedOwn"`` \| ``"volUMedOWN"`` \| ``"volUMedOWn"`` \| ``"volUMedOwN"`` \| ``"volUMedoWN"`` \| ``"volUMedoWn"`` \| ``"volUMedowN"`` \| ``"volUmEdown"`` \| ``"volUmEDOwn"`` \| ``"volUmEDOWN"`` \| ``"volUmEDOWn"`` \| ``"volUmEDOwN"`` \| ``"volUmEDown"`` \| ``"volUmEDoWN"`` \| ``"volUmEDoWn"`` \| ``"volUmEDowN"`` \| ``"volUmEdOwn"`` \| ``"volUmEdOWN"`` \| ``"volUmEdOWn"`` \| ``"volUmEdOwN"`` \| ``"volUmEdoWN"`` \| ``"volUmEdoWn"`` \| ``"volUmEdowN"`` \| ``"volUmeDOwn"`` \| ``"volUmeDOWN"`` \| ``"volUmeDOWn"`` \| ``"volUmeDOwN"`` \| ``"volUmeDown"`` \| ``"volUmeDoWN"`` \| ``"volUmeDoWn"`` \| ``"volUmeDowN"`` \| ``"volUmedOwn"`` \| ``"volUmedOWN"`` \| ``"volUmedOWn"`` \| ``"volUmedOwN"`` \| ``"volUmedoWN"`` \| ``"volUmedoWn"`` \| ``"volUmedowN"`` \| ``"voluMEdown"`` \| ``"voluMEDOwn"`` \| ``"voluMEDOWN"`` \| ``"voluMEDOWn"`` \| ``"voluMEDOwN"`` \| ``"voluMEDown"`` \| ``"voluMEDoWN"`` \| ``"voluMEDoWn"`` \| ``"voluMEDowN"`` \| ``"voluMEdOwn"`` \| ``"voluMEdOWN"`` \| ``"voluMEdOWn"`` \| ``"voluMEdOwN"`` \| ``"voluMEdoWN"`` \| ``"voluMEdoWn"`` \| ``"voluMEdowN"`` \| ``"voluMedown"`` \| ``"voluMeDOwn"`` \| ``"voluMeDOWN"`` \| ``"voluMeDOWn"`` \| ``"voluMeDOwN"`` \| ``"voluMeDown"`` \| ``"voluMeDoWN"`` \| ``"voluMeDoWn"`` \| ``"voluMeDowN"`` \| ``"voluMedOwn"`` \| ``"voluMedOWN"`` \| ``"voluMedOWn"`` \| ``"voluMedOwN"`` \| ``"voluMedoWN"`` \| ``"voluMedoWn"`` \| ``"voluMedowN"`` \| ``"volumEdown"`` \| ``"volumEDOwn"`` \| ``"volumEDOWN"`` \| ``"volumEDOWn"`` \| ``"volumEDOwN"`` \| ``"volumEDown"`` \| ``"volumEDoWN"`` \| ``"volumEDoWn"`` \| ``"volumEDowN"`` \| ``"volumEdOwn"`` \| ``"volumEdOWN"`` \| ``"volumEdOWn"`` \| ``"volumEdOwN"`` \| ``"volumEdoWN"`` \| ``"volumEdoWn"`` \| ``"volumEdowN"`` \| ``"volumeDOwn"`` \| ``"volumeDOWN"`` \| ``"volumeDOWn"`` \| ``"volumeDOwN"`` \| ``"volumeDown"`` \| ``"volumeDoWN"`` \| ``"volumeDoWn"`` \| ``"volumeDowN"`` \| ``"volumedOwn"`` \| ``"volumedOWN"`` \| ``"volumedOWn"`` \| ``"volumedOwN"`` \| ``"volumedoWN"`` \| ``"volumedoWn"`` \| ``"volumedowN"`` \| ``"MEnu"`` \| ``"MENU"`` \| ``"MENu"`` \| ``"MEnU"`` \| ``"Menu"`` \| ``"MeNU"`` \| ``"MeNu"`` \| ``"MenU"`` \| ``"mEnu"`` \| ``"mENU"`` \| ``"mENu"`` \| ``"mEnU"`` \| ``"meNU"`` \| ``"meNu"`` \| ``"menU"`` \| ``"PLaypause"`` \| ``"PLAYpause"`` \| ``"PLAYPAuse"`` \| ``"PLAYPAUSe"`` \| ``"PLAYPAUSE"`` \| ``"PLAYPAUse"`` \| ``"PLAYPAUsE"`` \| ``"PLAYPAuSe"`` \| ``"PLAYPAuSE"`` \| ``"PLAYPAusE"`` \| ``"PLAYPause"`` \| ``"PLAYPaUSe"`` \| ``"PLAYPaUSE"`` \| ``"PLAYPaUse"`` \| ``"PLAYPaUsE"`` \| ``"PLAYPauSe"`` \| ``"PLAYPauSE"`` \| ``"PLAYPausE"`` \| ``"PLAYpAuse"`` \| ``"PLAYpAUSe"`` \| ``"PLAYpAUSE"`` \| ``"PLAYpAUse"`` \| ``"PLAYpAUsE"`` \| ``"PLAYpAuSe"`` \| ``"PLAYpAuSE"`` \| ``"PLAYpAusE"`` \| ``"PLAYpaUSe"`` \| ``"PLAYpaUSE"`` \| ``"PLAYpaUse"`` \| ``"PLAYpaUsE"`` \| ``"PLAYpauSe"`` \| ``"PLAYpauSE"`` \| ``"PLAYpausE"`` \| ``"PLAypause"`` \| ``"PLAyPAuse"`` \| ``"PLAyPAUSe"`` \| ``"PLAyPAUSE"`` \| ``"PLAyPAUse"`` \| ``"PLAyPAUsE"`` \| ``"PLAyPAuSe"`` \| ``"PLAyPAuSE"`` \| ``"PLAyPAusE"`` \| ``"PLAyPause"`` \| ``"PLAyPaUSe"`` \| ``"PLAyPaUSE"`` \| ``"PLAyPaUse"`` \| ``"PLAyPaUsE"`` \| ``"PLAyPauSe"`` \| ``"PLAyPauSE"`` \| ``"PLAyPausE"`` \| ``"PLAypAuse"`` \| ``"PLAypAUSe"`` \| ``"PLAypAUSE"`` \| ``"PLAypAUse"`` \| ``"PLAypAUsE"`` \| ``"PLAypAuSe"`` \| ``"PLAypAuSE"`` \| ``"PLAypAusE"`` \| ``"PLAypaUSe"`` \| ``"PLAypaUSE"`` \| ``"PLAypaUse"`` \| ``"PLAypaUsE"`` \| ``"PLAypauSe"`` \| ``"PLAypauSE"`` \| ``"PLAypausE"`` \| ``"PLaYpause"`` \| ``"PLaYPAuse"`` \| ``"PLaYPAUSe"`` \| ``"PLaYPAUSE"`` \| ``"PLaYPAUse"`` \| ``"PLaYPAUsE"`` \| ``"PLaYPAuSe"`` \| ``"PLaYPAuSE"`` \| ``"PLaYPAusE"`` \| ``"PLaYPause"`` \| ``"PLaYPaUSe"`` \| ``"PLaYPaUSE"`` \| ``"PLaYPaUse"`` \| ``"PLaYPaUsE"`` \| ``"PLaYPauSe"`` \| ``"PLaYPauSE"`` \| ``"PLaYPausE"`` \| ``"PLaYpAuse"`` \| ``"PLaYpAUSe"`` \| ``"PLaYpAUSE"`` \| ``"PLaYpAUse"`` \| ``"PLaYpAUsE"`` \| ``"PLaYpAuSe"`` \| ``"PLaYpAuSE"`` \| ``"PLaYpAusE"`` \| ``"PLaYpaUSe"`` \| ``"PLaYpaUSE"`` \| ``"PLaYpaUse"`` \| ``"PLaYpaUsE"`` \| ``"PLaYpauSe"`` \| ``"PLaYpauSE"`` \| ``"PLaYpausE"`` \| ``"PLayPAuse"`` \| ``"PLayPAUSe"`` \| ``"PLayPAUSE"`` \| ``"PLayPAUse"`` \| ``"PLayPAUsE"`` \| ``"PLayPAuSe"`` \| ``"PLayPAuSE"`` \| ``"PLayPAusE"`` \| ``"PLayPause"`` \| ``"PLayPaUSe"`` \| ``"PLayPaUSE"`` \| ``"PLayPaUse"`` \| ``"PLayPaUsE"`` \| ``"PLayPauSe"`` \| ``"PLayPauSE"`` \| ``"PLayPausE"`` \| ``"PLaypAuse"`` \| ``"PLaypAUSe"`` \| ``"PLaypAUSE"`` \| ``"PLaypAUse"`` \| ``"PLaypAUsE"`` \| ``"PLaypAuSe"`` \| ``"PLaypAuSE"`` \| ``"PLaypAusE"`` \| ``"PLaypaUSe"`` \| ``"PLaypaUSE"`` \| ``"PLaypaUse"`` \| ``"PLaypaUsE"`` \| ``"PLaypauSe"`` \| ``"PLaypauSE"`` \| ``"PLaypausE"`` \| ``"Playpause"`` \| ``"PlAYpause"`` \| ``"PlAYPAuse"`` \| ``"PlAYPAUSe"`` \| ``"PlAYPAUSE"`` \| ``"PlAYPAUse"`` \| ``"PlAYPAUsE"`` \| ``"PlAYPAuSe"`` \| ``"PlAYPAuSE"`` \| ``"PlAYPAusE"`` \| ``"PlAYPause"`` \| ``"PlAYPaUSe"`` \| ``"PlAYPaUSE"`` \| ``"PlAYPaUse"`` \| ``"PlAYPaUsE"`` \| ``"PlAYPauSe"`` \| ``"PlAYPauSE"`` \| ``"PlAYPausE"`` \| ``"PlAYpAuse"`` \| ``"PlAYpAUSe"`` \| ``"PlAYpAUSE"`` \| ``"PlAYpAUse"`` \| ``"PlAYpAUsE"`` \| ``"PlAYpAuSe"`` \| ``"PlAYpAuSE"`` \| ``"PlAYpAusE"`` \| ``"PlAYpaUSe"`` \| ``"PlAYpaUSE"`` \| ``"PlAYpaUse"`` \| ``"PlAYpaUsE"`` \| ``"PlAYpauSe"`` \| ``"PlAYpauSE"`` \| ``"PlAYpausE"`` \| ``"PlAypause"`` \| ``"PlAyPAuse"`` \| ``"PlAyPAUSe"`` \| ``"PlAyPAUSE"`` \| ``"PlAyPAUse"`` \| ``"PlAyPAUsE"`` \| ``"PlAyPAuSe"`` \| ``"PlAyPAuSE"`` \| ``"PlAyPAusE"`` \| ``"PlAyPause"`` \| ``"PlAyPaUSe"`` \| ``"PlAyPaUSE"`` \| ``"PlAyPaUse"`` \| ``"PlAyPaUsE"`` \| ``"PlAyPauSe"`` \| ``"PlAyPauSE"`` \| ``"PlAyPausE"`` \| ``"PlAypAuse"`` \| ``"PlAypAUSe"`` \| ``"PlAypAUSE"`` \| ``"PlAypAUse"`` \| ``"PlAypAUsE"`` \| ``"PlAypAuSe"`` \| ``"PlAypAuSE"`` \| ``"PlAypAusE"`` \| ``"PlAypaUSe"`` \| ``"PlAypaUSE"`` \| ``"PlAypaUse"`` \| ``"PlAypaUsE"`` \| ``"PlAypauSe"`` \| ``"PlAypauSE"`` \| ``"PlAypausE"`` \| ``"PlaYpause"`` \| ``"PlaYPAuse"`` \| ``"PlaYPAUSe"`` \| ``"PlaYPAUSE"`` \| ``"PlaYPAUse"`` \| ``"PlaYPAUsE"`` \| ``"PlaYPAuSe"`` \| ``"PlaYPAuSE"`` \| ``"PlaYPAusE"`` \| ``"PlaYPause"`` \| ``"PlaYPaUSe"`` \| ``"PlaYPaUSE"`` \| ``"PlaYPaUse"`` \| ``"PlaYPaUsE"`` \| ``"PlaYPauSe"`` \| ``"PlaYPauSE"`` \| ``"PlaYPausE"`` \| ``"PlaYpAuse"`` \| ``"PlaYpAUSe"`` \| ``"PlaYpAUSE"`` \| ``"PlaYpAUse"`` \| ``"PlaYpAUsE"`` \| ``"PlaYpAuSe"`` \| ``"PlaYpAuSE"`` \| ``"PlaYpAusE"`` \| ``"PlaYpaUSe"`` \| ``"PlaYpaUSE"`` \| ``"PlaYpaUse"`` \| ``"PlaYpaUsE"`` \| ``"PlaYpauSe"`` \| ``"PlaYpauSE"`` \| ``"PlaYpausE"`` \| ``"PlayPAuse"`` \| ``"PlayPAUSe"`` \| ``"PlayPAUSE"`` \| ``"PlayPAUse"`` \| ``"PlayPAUsE"`` \| ``"PlayPAuSe"`` \| ``"PlayPAuSE"`` \| ``"PlayPAusE"`` \| ``"PlayPause"`` \| ``"PlayPaUSe"`` \| ``"PlayPaUSE"`` \| ``"PlayPaUse"`` \| ``"PlayPaUsE"`` \| ``"PlayPauSe"`` \| ``"PlayPauSE"`` \| ``"PlayPausE"`` \| ``"PlaypAuse"`` \| ``"PlaypAUSe"`` \| ``"PlaypAUSE"`` \| ``"PlaypAUse"`` \| ``"PlaypAUsE"`` \| ``"PlaypAuSe"`` \| ``"PlaypAuSE"`` \| ``"PlaypAusE"`` \| ``"PlaypaUSe"`` \| ``"PlaypaUSE"`` \| ``"PlaypaUse"`` \| ``"PlaypaUsE"`` \| ``"PlaypauSe"`` \| ``"PlaypauSE"`` \| ``"PlaypausE"`` \| ``"pLaypause"`` \| ``"pLAYpause"`` \| ``"pLAYPAuse"`` \| ``"pLAYPAUSe"`` \| ``"pLAYPAUSE"`` \| ``"pLAYPAUse"`` \| ``"pLAYPAUsE"`` \| ``"pLAYPAuSe"`` \| ``"pLAYPAuSE"`` \| ``"pLAYPAusE"`` \| ``"pLAYPause"`` \| ``"pLAYPaUSe"`` \| ``"pLAYPaUSE"`` \| ``"pLAYPaUse"`` \| ``"pLAYPaUsE"`` \| ``"pLAYPauSe"`` \| ``"pLAYPauSE"`` \| ``"pLAYPausE"`` \| ``"pLAYpAuse"`` \| ``"pLAYpAUSe"`` \| ``"pLAYpAUSE"`` \| ``"pLAYpAUse"`` \| ``"pLAYpAUsE"`` \| ``"pLAYpAuSe"`` \| ``"pLAYpAuSE"`` \| ``"pLAYpAusE"`` \| ``"pLAYpaUSe"`` \| ``"pLAYpaUSE"`` \| ``"pLAYpaUse"`` \| ``"pLAYpaUsE"`` \| ``"pLAYpauSe"`` \| ``"pLAYpauSE"`` \| ``"pLAYpausE"`` \| ``"pLAypause"`` \| ``"pLAyPAuse"`` \| ``"pLAyPAUSe"`` \| ``"pLAyPAUSE"`` \| ``"pLAyPAUse"`` \| ``"pLAyPAUsE"`` \| ``"pLAyPAuSe"`` \| ``"pLAyPAuSE"`` \| ``"pLAyPAusE"`` \| ``"pLAyPause"`` \| ``"pLAyPaUSe"`` \| ``"pLAyPaUSE"`` \| ``"pLAyPaUse"`` \| ``"pLAyPaUsE"`` \| ``"pLAyPauSe"`` \| ``"pLAyPauSE"`` \| ``"pLAyPausE"`` \| ``"pLAypAuse"`` \| ``"pLAypAUSe"`` \| ``"pLAypAUSE"`` \| ``"pLAypAUse"`` \| ``"pLAypAUsE"`` \| ``"pLAypAuSe"`` \| ``"pLAypAuSE"`` \| ``"pLAypAusE"`` \| ``"pLAypaUSe"`` \| ``"pLAypaUSE"`` \| ``"pLAypaUse"`` \| ``"pLAypaUsE"`` \| ``"pLAypauSe"`` \| ``"pLAypauSE"`` \| ``"pLAypausE"`` \| ``"pLaYpause"`` \| ``"pLaYPAuse"`` \| ``"pLaYPAUSe"`` \| ``"pLaYPAUSE"`` \| ``"pLaYPAUse"`` \| ``"pLaYPAUsE"`` \| ``"pLaYPAuSe"`` \| ``"pLaYPAuSE"`` \| ``"pLaYPAusE"`` \| ``"pLaYPause"`` \| ``"pLaYPaUSe"`` \| ``"pLaYPaUSE"`` \| ``"pLaYPaUse"`` \| ``"pLaYPaUsE"`` \| ``"pLaYPauSe"`` \| ``"pLaYPauSE"`` \| ``"pLaYPausE"`` \| ``"pLaYpAuse"`` \| ``"pLaYpAUSe"`` \| ``"pLaYpAUSE"`` \| ``"pLaYpAUse"`` \| ``"pLaYpAUsE"`` \| ``"pLaYpAuSe"`` \| ``"pLaYpAuSE"`` \| ``"pLaYpAusE"`` \| ``"pLaYpaUSe"`` \| ``"pLaYpaUSE"`` \| ``"pLaYpaUse"`` \| ``"pLaYpaUsE"`` \| ``"pLaYpauSe"`` \| ``"pLaYpauSE"`` \| ``"pLaYpausE"`` \| ``"pLayPAuse"`` \| ``"pLayPAUSe"`` \| ``"pLayPAUSE"`` \| ``"pLayPAUse"`` \| ``"pLayPAUsE"`` \| ``"pLayPAuSe"`` \| ``"pLayPAuSE"`` \| ``"pLayPAusE"`` \| ``"pLayPause"`` \| ``"pLayPaUSe"`` \| ``"pLayPaUSE"`` \| ``"pLayPaUse"`` \| ``"pLayPaUsE"`` \| ``"pLayPauSe"`` \| ``"pLayPauSE"`` \| ``"pLayPausE"`` \| ``"pLaypAuse"`` \| ``"pLaypAUSe"`` \| ``"pLaypAUSE"`` \| ``"pLaypAUse"`` \| ``"pLaypAUsE"`` \| ``"pLaypAuSe"`` \| ``"pLaypAuSE"`` \| ``"pLaypAusE"`` \| ``"pLaypaUSe"`` \| ``"pLaypaUSE"`` \| ``"pLaypaUse"`` \| ``"pLaypaUsE"`` \| ``"pLaypauSe"`` \| ``"pLaypauSE"`` \| ``"pLaypausE"`` \| ``"plAYpause"`` \| ``"plAYPAuse"`` \| ``"plAYPAUSe"`` \| ``"plAYPAUSE"`` \| ``"plAYPAUse"`` \| ``"plAYPAUsE"`` \| ``"plAYPAuSe"`` \| ``"plAYPAuSE"`` \| ``"plAYPAusE"`` \| ``"plAYPause"`` \| ``"plAYPaUSe"`` \| ``"plAYPaUSE"`` \| ``"plAYPaUse"`` \| ``"plAYPaUsE"`` \| ``"plAYPauSe"`` \| ``"plAYPauSE"`` \| ``"plAYPausE"`` \| ``"plAYpAuse"`` \| ``"plAYpAUSe"`` \| ``"plAYpAUSE"`` \| ``"plAYpAUse"`` \| ``"plAYpAUsE"`` \| ``"plAYpAuSe"`` \| ``"plAYpAuSE"`` \| ``"plAYpAusE"`` \| ``"plAYpaUSe"`` \| ``"plAYpaUSE"`` \| ``"plAYpaUse"`` \| ``"plAYpaUsE"`` \| ``"plAYpauSe"`` \| ``"plAYpauSE"`` \| ``"plAYpausE"`` \| ``"plAypause"`` \| ``"plAyPAuse"`` \| ``"plAyPAUSe"`` \| ``"plAyPAUSE"`` \| ``"plAyPAUse"`` \| ``"plAyPAUsE"`` \| ``"plAyPAuSe"`` \| ``"plAyPAuSE"`` \| ``"plAyPAusE"`` \| ``"plAyPause"`` \| ``"plAyPaUSe"`` \| ``"plAyPaUSE"`` \| ``"plAyPaUse"`` \| ``"plAyPaUsE"`` \| ``"plAyPauSe"`` \| ``"plAyPauSE"`` \| ``"plAyPausE"`` \| ``"plAypAuse"`` \| ``"plAypAUSe"`` \| ``"plAypAUSE"`` \| ``"plAypAUse"`` \| ``"plAypAUsE"`` \| ``"plAypAuSe"`` \| ``"plAypAuSE"`` \| ``"plAypAusE"`` \| ``"plAypaUSe"`` \| ``"plAypaUSE"`` \| ``"plAypaUse"`` \| ``"plAypaUsE"`` \| ``"plAypauSe"`` \| ``"plAypauSE"`` \| ``"plAypausE"`` \| ``"plaYpause"`` \| ``"plaYPAuse"`` \| ``"plaYPAUSe"`` \| ``"plaYPAUSE"`` \| ``"plaYPAUse"`` \| ``"plaYPAUsE"`` \| ``"plaYPAuSe"`` \| ``"plaYPAuSE"`` \| ``"plaYPAusE"`` \| ``"plaYPause"`` \| ``"plaYPaUSe"`` \| ``"plaYPaUSE"`` \| ``"plaYPaUse"`` \| ``"plaYPaUsE"`` \| ``"plaYPauSe"`` \| ``"plaYPauSE"`` \| ``"plaYPausE"`` \| ``"plaYpAuse"`` \| ``"plaYpAUSe"`` \| ``"plaYpAUSE"`` \| ``"plaYpAUse"`` \| ``"plaYpAUsE"`` \| ``"plaYpAuSe"`` \| ``"plaYpAuSE"`` \| ``"plaYpAusE"`` \| ``"plaYpaUSe"`` \| ``"plaYpaUSE"`` \| ``"plaYpaUse"`` \| ``"plaYpaUsE"`` \| ``"plaYpauSe"`` \| ``"plaYpauSE"`` \| ``"plaYpausE"`` \| ``"playPAuse"`` \| ``"playPAUSe"`` \| ``"playPAUSE"`` \| ``"playPAUse"`` \| ``"playPAUsE"`` \| ``"playPAuSe"`` \| ``"playPAuSE"`` \| ``"playPAusE"`` \| ``"playPause"`` \| ``"playPaUSe"`` \| ``"playPaUSE"`` \| ``"playPaUse"`` \| ``"playPaUsE"`` \| ``"playPauSe"`` \| ``"playPauSE"`` \| ``"playPausE"`` \| ``"playpAuse"`` \| ``"playpAUSe"`` \| ``"playpAUSE"`` \| ``"playpAUse"`` \| ``"playpAUsE"`` \| ``"playpAuSe"`` \| ``"playpAuSE"`` \| ``"playpAusE"`` \| ``"playpaUSe"`` \| ``"playpaUSE"`` \| ``"playpaUse"`` \| ``"playpaUsE"`` \| ``"playpauSe"`` \| ``"playpauSE"`` \| ``"playpausE"`` \| ``"SElect"`` \| ``"SELEct"`` \| ``"SELECT"`` \| ``"SELECt"`` \| ``"SELEcT"`` \| ``"SELect"`` \| ``"SELeCT"`` \| ``"SELeCt"`` \| ``"SELecT"`` \| ``"SElEct"`` \| ``"SElECT"`` \| ``"SElECt"`` \| ``"SElEcT"`` \| ``"SEleCT"`` \| ``"SEleCt"`` \| ``"SElecT"`` \| ``"Select"`` \| ``"SeLEct"`` \| ``"SeLECT"`` \| ``"SeLECt"`` \| ``"SeLEcT"`` \| ``"SeLect"`` \| ``"SeLeCT"`` \| ``"SeLeCt"`` \| ``"SeLecT"`` \| ``"SelEct"`` \| ``"SelECT"`` \| ``"SelECt"`` \| ``"SelEcT"`` \| ``"SeleCT"`` \| ``"SeleCt"`` \| ``"SelecT"`` \| ``"sElect"`` \| ``"sELEct"`` \| ``"sELECT"`` \| ``"sELECt"`` \| ``"sELEcT"`` \| ``"sELect"`` \| ``"sELeCT"`` \| ``"sELeCt"`` \| ``"sELecT"`` \| ``"sElEct"`` \| ``"sElECT"`` \| ``"sElECt"`` \| ``"sElEcT"`` \| ``"sEleCT"`` \| ``"sEleCt"`` \| ``"sElecT"`` \| ``"seLEct"`` \| ``"seLECT"`` \| ``"seLECt"`` \| ``"seLEcT"`` \| ``"seLect"`` \| ``"seLeCT"`` \| ``"seLeCt"`` \| ``"seLecT"`` \| ``"selEct"`` \| ``"selECT"`` \| ``"selECt"`` \| ``"selEcT"`` \| ``"seleCT"`` \| ``"seleCt"`` \| ``"selecT"`` | The name of the button to be pressed. |
| `durationSeconds?` | `number` | The duration of the button press in seconds (float). |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2030](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2030)

___

### mobilePullFile

• **mobilePullFile**: (...`this`: `any`, `remotePath`: `string`) => `Promise`<`string`\> = `commands.fileMovementExtensions.mobilePullFile`

#### Type declaration

▸ (`...this`, `remotePath`): `Promise`<`string`\>

Pulls a remote file from the device.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote file or a specially formatted path, which points to an item inside app bundle. See the documentation for `pullFromRealDevice` and `pullFromSimulator` to get more information on acceptable values. |

##### Returns

`Promise`<`string`\>

The same as in `pullFile`

#### Defined in

[lib/driver.js:1994](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1994)

___

### mobilePullFolder

• **mobilePullFolder**: (...`this`: `any`, `remotePath`: `string`) => `Promise`<`string`\> = `commands.fileMovementExtensions.mobilePullFolder`

#### Type declaration

▸ (`...this`, `remotePath`): `Promise`<`string`\>

Pulls the whole folder from the device under test.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote folder |

##### Returns

`Promise`<`string`\>

The same as `pullFolder`

#### Defined in

[lib/driver.js:1998](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1998)

___

### mobilePushFile

• **mobilePushFile**: (...`this`: `any`, `remotePath`: `string`, `payload`: `string`) => `Promise`<`void`\> = `commands.fileMovementExtensions.mobilePushFile`

#### Type declaration

▸ (`...this`, `remotePath`, `payload`): `Promise`<`void`\>

Pushes the given data to a file on the remote device.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote file or a specially formatted path, which points to an item inside an app bundle. |
| `payload` | `string` | Base64-encoded content of the file to be pushed. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1992](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1992)

___

### mobileQueryAppState

• **mobileQueryAppState**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`AppState`\> = `commands.appManagementExtensions.mobileQueryAppState`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`AppState`\>

Queries the state of an installed application from the device under test.

If the app with the given `bundleId` is not installed, an exception will be thrown.

**`See`**

https://developer.apple.com/documentation/xctest/xcuiapplicationstate?language=objc

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be queried |

##### Returns

`Promise`<`AppState`\>

The actual application state code

#### Defined in

[lib/driver.js:1866](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1866)

___

### mobileRemoveApp

• **mobileRemoveApp**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`boolean`\> = `commands.appManagementExtensions.mobileRemoveApp`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

Removes/uninstalls the given application from the device under test.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be removed |

##### Returns

`Promise`<`boolean`\>

`true` if the application has been removed successfully; `false` otherwise

#### Defined in

[lib/driver.js:1861](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1861)

___

### mobileResetLocationService

• **mobileResetLocationService**: (...`this`: `any`) => `Promise`<`void`\> = `commands.locationExtensions.mobileResetLocationService`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Reset the location service on real device.
Raises not implemented error for simulator.

**`Throws`**

If the device is simulator, or 'resetLocation' raises an error.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2101](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2101)

___

### mobileResetPermission

• **mobileResetPermission**: (...`this`: `any`, `service`: `number`) => `Promise`<`void`\> = `commands.permissionsExtensions.mobileResetPermission`

#### Type declaration

▸ (`...this`, `service`): `Promise`<`void`\>

Resets the given permission for the active application under test.
Works for both Simulator and real devices using Xcode SDK 11.4+

**`Throws`**

If permission reset fails on the device.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `service` | `number` | One of the available service names. This could also be an integer protected resource identifier; see [this list](https://developer.apple.com/documentation/xctest/xcuiprotectedresource?language=objc) |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2161](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2161)

___

### mobileResetSimulatedLocation

• **mobileResetSimulatedLocation**: (...`this`: `any`) => `Promise`<`void`\> = `commands.geolocationExtensions.mobileResetSimulatedLocation`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Resets simulated geolocation value.
Only works since Xcode 14.3/iOS 16.4.
! Do not forget to reset the simulated geolocation value after your automated test is finished.
! If the value is not reset explcitly then the simulated one will remain until the next device restart.

**`Throws`**

If the device under test does not support gelolocation simulation.

**`Since`**

4.18

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2040](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2040)

___

### mobileRotateElement

• **mobileRotateElement**: (...`this`: `any`, `elementId`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `rotation`: `number`, `velocity`: `number`) => `Promise`<`void`\> = `commands.gestureExtensions.mobileRotateElement`

#### Type declaration

▸ (`...this`, `elementId`, `rotation`, `velocity`): `Promise`<`void`\>

Performs a rotate gesture on the given element.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618665-rotate?language=objc

**`Example`**

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

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to perform the gesture on. |
| `rotation` | `number` | The rotation gesture (in radians) |
| `velocity` | `number` | The velocity (in radians-per-second) of the gesture. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2066](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2066)

___

### mobileRunXCTest

• **mobileRunXCTest**: (...`this`: `any`, `testRunnerBundleId`: `string`, `appUnderTestBundleId`: `string`, `xcTestBundleId`: `string`, `args`: `string`[], `testType`: ``"app"`` \| ``"ui"`` \| ``"logic"``, `env?`: [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\>, `timeout`: `number`) => `Promise`<`RunXCTestResult`\> = `commands.xctestExtensions.mobileRunXCTest`

#### Type declaration

▸ (`...this`, `testRunnerBundleId`, `appUnderTestBundleId`, `xcTestBundleId?`, `args?`, `testType`, `env?`, `timeout`): `Promise`<`RunXCTestResult`\>

Run a native XCTest script.

Launches a subprocess that runs the XC Test and blocks until it is completed. Parses the stdout of the process and returns its result as an array.

**Facebook's [IDB](https://github.com/facebook/idb) tool is required** to run such tests; see [the idb docs](https://fbidb.io/docs/test-execution/) for reference.

**`Throws`**

Error thrown if subprocess returns non-zero exit code

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `testRunnerBundleId` | `string` | `undefined` | Test app bundle (e.g.: `io.appium.XCTesterAppUITests.xctrunner`) |
| `appUnderTestBundleId` | `string` | `undefined` | App-under-test bundle |
| `xcTestBundleId` | `string` | `[]` | XCTest bundle ID |
| `args` | `string`[] | `'ui'` | Launch arguments to start the test with (see [reference documentation](https://developer.apple.com/documentation/xctest/xcuiapplication/1500477-launcharguments)) |
| `testType` | ``"app"`` \| ``"ui"`` \| ``"logic"`` | `undefined` | XC test type |
| `env?` | [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\> | `XCTEST_TIMEOUT` | Environment variables passed to test |
| `timeout` | `number` | `undefined` | Timeout (in ms) for session completion. |

##### Returns

`Promise`<`RunXCTestResult`\>

The array of test results

#### Defined in

[lib/driver.js:2252](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2252)

___

### mobileScroll

• **mobileScroll**: (...`this`: `any`, `name?`: `string`, `direction?`: `Direction`, `predicateString?`: `string`, `toVisible?`: `boolean`, `distance?`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobileScroll`

#### Type declaration

▸ (`...this`, `name?`, `direction?`, `predicateString?`, `toVisible?`, `distance?`, `elementId?`): `Promise`<`void`\>

Scrolls an element or the entire screen.

Use this command to emulate precise scrolling in tables or collection views where it is already known to which element the scrolling should be performed.

The arguments define the choosen strategy: one of `name`, `direction`, `predicateString` or `toVisible`.

**All strategies are exclusive**; only one strategy can be used at one time.

**Known Limitations:**

- If it is necessary to perform many scroll gestures on parent container to reach the necessary child element (tens of them), then the method call may fail.  *
- The implemntation of this extension relies on several undocumented XCTest features, which might not always be reliable.

**`Example`**

```python
driver.execute_script('mobile: scroll', {'direction': 'down'})
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `name?` | `string` | The internal element identifier (as hexadecimal hash string) to scroll on (e.g. the container). The Application element will be used if this argument is not provided. |
| `direction?` | `Direction` | The main difference between this command and a `mobile: swipe` command using the same direction is that `mobile: scroll` will attempt to move the current viewport exactly to the next or previous page (the term "page" means the content, which fits into a single device screen). |
| `predicateString?` | `string` | The `NSPredicate` locator of the child element, to which the scrolling should be performed. Has no effect if `elementId` is not a container. |
| `toVisible?` | `boolean` | If `true`, scrolls to the first visible `elementId` in the parent container. Has no effect if `elementId` is unset. |
| `distance?` | `number` | A ratio of the screen height; `1.0` means a full-screen-worth of scrolling. |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | Element ID or Element used in various strategies. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2054](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2054)

___

### mobileScrollToElement

• **mobileScrollToElement**: (...`this`: `any`, `elementId`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobileScrollToElement`

#### Type declaration

▸ (`...this`, `elementId`): `Promise`<`void`\>

Scrolls the current viewport to the given element.

This command expects the destination element to be inside a scrollable container and is hittable. The scroll direction is detected automatically.

This API uses native XCTest calls, so it is performant. The same native call is implicitly performed by a `click` command if the destination element is outside the current viewport.

**`Since`**

4.7.0

**`Throws`**

If the scrolling action cannot be performed

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to scroll to. The destination element must be located in a scrollable container and must be hittable. If the element is already present in the current viewport then no action is performed. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2053](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2053)

___

### mobileSelectPickerWheelValue

• **mobileSelectPickerWheelValue**: (...`this`: `any`, `elementId`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `order`: ``"next"`` \| ``"previous"``, `offset?`: `number`, `value?`: ``null`` \| `string`, `maxAttempts?`: `number`) => `Promise`<`unknown`\> = `commands.gestureExtensions.mobileSelectPickerWheelValue`

#### Type declaration

▸ (`...this`, `elementId`, `order`, `offset?`, `value?`, `maxAttempts?`): `Promise`<`unknown`\>

Performs selection of the next or previous picker wheel value.

This might be useful if these values are populated dynamically; you don't know which one to select, or the value selection using the `sendKeys` API does not work (for whatever reason).

**`Throws`**

Upon failure to change the current picker value.

**`Example`**

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
Map<String, Object> params = new HashMap<>();
params.put("order", "next");
params.put("offset", 0.15);
params.put("element", ((RemoteWebElement) element).getId());
js.executeScript("mobile: selectPickerWheelValue", params);
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | `PickerWheel`'s internal element ID as hexadecimal hash string. Value selection will be performed on this element. This element must be of type `XCUIElementTypePickerWheel`. |
| `order` | ``"next"`` \| ``"previous"`` | Either `next` to select the value _next_ to the current from the target picker wheel, or `previous` to select the _previous_ value. |
| `offset?` | `number` | The value in range `[0.01, 0.5]`. It defines how far from picker wheel's center the click should happen. The actual distance is calculated by multiplying this value to the actual picker wheel height. Too small an offset value may not change the picker wheel value at all, and too high a value may cause the wheel to switch two or more values at once. Usually the optimal value is located in range `[0.15, 0.3]`. |
| `value?` | ``null`` \| `string` | If provided WDA will try to automatically scroll in the given direction until the actual picker value reaches the expected one or the amount of scrolling attempts is exceeded. |
| `maxAttempts?` | `number` | The maximum number of scrolling attempts to reach `value` before an error will be thrown. Only makes sense in combination with `value`. |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2065](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2065)

___

### mobileSetAppearance

• **mobileSetAppearance**: (...`this`: `any`, `style`: ``"dark"`` \| ``"light"``) => `Promise`<`undefined`\> = `commands.appearanceExtensions.mobileSetAppearance`

#### Type declaration

▸ (`...this`, `style`): `Promise`<`undefined`\>

Set the device's UI appearance style

**`Since`**

iOS 12.0

**`Throws`**

if the current platform does not support UI appearance changes

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `style` | ``"dark"`` \| ``"light"`` | The appearance style to set |

##### Returns

`Promise`<`undefined`\>

#### Defined in

[lib/driver.js:1879](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1879)

___

### mobileSetSimulatedLocation

• **mobileSetSimulatedLocation**: (...`this`: `any`, `latitude`: `number`, `longitude`: `number`) => `Promise`<`void`\> = `commands.geolocationExtensions.mobileSetSimulatedLocation`

#### Type declaration

▸ (`...this`, `latitude`, `longitude`): `Promise`<`void`\>

Sets simulated geolocation value.
Only works since Xcode 14.3/iOS 16.4

**`Throws`**

If the device under test does not support gelolocation simulation.

**`Since`**

4.18

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `latitude` | `number` |
| `longitude` | `number` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2039](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2039)

___

### mobileSiriCommand

• **mobileSiriCommand**: (...`this`: `any`, `text`: `string`) => `Promise`<`void`\> = `commands.generalExtensions.mobileSiriCommand`

#### Type declaration

▸ (`...this`, `text`): `Promise`<`void`\>

Process a string as speech and send it to Siri.

Presents the Siri UI, if it is not currently active, and accepts a string which is then processed as if it were recognized speech. See [the documentation of `activateWithVoiceRecognitionText`](https://developer.apple.com/documentation/xctest/xcuisiriservice/2852140-activatewithvoicerecognitiontext?language=objc) for more details.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `text` | `string` | Text to be sent to Siri |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2031](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2031)

___

### mobileStartLogsBroadcast

• **mobileStartLogsBroadcast**: (...`this`: `any`) => `Promise`<`void`\> = `commands.logExtensions.mobileStartLogsBroadcast`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Starts an iOS system logs broadcast websocket.

The websocket listens on the same host and port as Appium.  The endpoint created is `/ws/session/:sessionId:/appium/syslog`.

If the websocket is already running, this command does nothing.

Each connected webcoket listener will receive syslog lines as soon as they are visible to Appium.

**`See`**

https://appiumpro.com/editions/55-using-mobile-execution-commands-to-continuously-stream-device-logs-with-appium

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2117](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2117)

___

### mobileStartPcap

• **mobileStartPcap**: (...`this`: `any`, `timeLimitSec`: `number`, `forceRestart`: `boolean`) => `Promise`<`void`\> = `commands.pcapExtensions.mobileStartPcap`

#### Type declaration

▸ (`...this?`, `timeLimitSec?`, `forceRestart`): `Promise`<`void`\>

Records the given network traffic capture into a .pcap file.

**`Throws`**

If network traffic capture has failed to start.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `180` | - |
| `timeLimitSec` | `number` | `false` | The maximum recording time, in seconds. The maximum value is `43200` (12 hours). |
| `forceRestart` | `boolean` | `undefined` | Whether to restart traffic capture process forcefully when startPcap is called (`true`) or ignore the call until the current traffic capture is completed (`false`, the default value). |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2148](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2148)

___

### mobileStartPerfRecord

• **mobileStartPerfRecord**: (...`this`: `any`, `timeout`: `number`, `profileName`: `string`, `pid?`: `number` \| ``"current"``) => `Promise`<`void`\> = `commands.performanceExtensions.mobileStartPerfRecord`

#### Type declaration

▸ (`...this?`, `timeout?`, `profileName`, `pid?`): `Promise`<`void`\>

Starts performance profiling for the device under test.

Relaxing security is mandatory for simulators. It can always work for real devices.

Since XCode 12 the method tries to use `xctrace` tool to record performance stats.

The `instruments` developer utility is used as a fallback for this purpose if `xctrace` is not available.

It is possible to record multiple profiles at the same time.

Read [Recording, Pausing, and Stopping Traces](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/Recording,Pausing,andStoppingTraces.html) for more details.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `DEFAULT_TIMEOUT_MS` | - |
| `timeout` | `number` | `DEFAULT_PROFILE_NAME` | The maximum count of milliseconds to record the profiling information. |
| `profileName` | `string` | `undefined` | The name of existing performance profile to apply. Can also contain the full path to the chosen template on the server file system. Note: not all profiles are supported on mobile devices. |
| `pid?` | `number` \| ``"current"`` | `undefined` | The ID of the process to measure the performance for. Set it to `current` in order to measure the performance of the process, which belongs to the currently active application. All processes running on the device are measured if `pid` is unset (the default setting). |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2154](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2154)

___

### mobileStopLogsBroadcast

• **mobileStopLogsBroadcast**: (...`this`: `any`) => `Promise`<`void`\> = `commands.logExtensions.mobileStopLogsBroadcast`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Stops the syslog broadcasting wesocket server previously started by `mobile: startLogsBroadcast`.
If no websocket server is running, this command does nothing.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2118](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2118)

___

### mobileStopPcap

• **mobileStopPcap**: (...`this`: `any`) => `Promise`<`string`\> = `commands.pcapExtensions.mobileStopPcap`

#### Type declaration

▸ (`...this`): `Promise`<`string`\>

Stops network traffic capture.

If no traffic capture process is running, then the endpoint will try to get the recently recorded file.

If no previously recorded file is found and no active traffic capture processes are running, then the method returns an empty string.

**`Remarks`**

Network capture files can be viewed in [Wireshark](https://www.wireshark.org/) and other similar applications.

**`Throws`**

If there was an error while getting the capture file.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`\>

Base64-encoded content of the recorded pcap file or an empty string if no traffic capture has been started before.

#### Defined in

[lib/driver.js:2149](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2149)

___

### mobileStopPerfRecord

• **mobileStopPerfRecord**: (...`this`: `any`, `remotePath?`: `string`, `user?`: `string`, `pass?`: `string`, `method?`: `Method`, `profileName`: `string`, `headers?`: `Record`<`string`, `any`\>, `fileFieldName?`: `string`, `formFields?`: [`string`, `any`][] \| `Record`<`string`, `any`\>) => `Promise`<`string`\> = `commands.performanceExtensions.mobileStopPerfRecord`

#### Type declaration

▸ (`...this`, `remotePath?`, `user?`, `pass?`, `method?`, `profileName`, `headers?`, `fileFieldName?`, `formFields?`): `Promise`<`string`\>

Stops performance recording operation previously started by [`mobile: startPerfRecord`](appium_xcuitest_driver.XCUITestDriver.md#mobilestartperfrecord).

If the previous call has already been completed due to the timeout, then its result is returned immediately. An error is thrown if the performance recording failed to start.

The resulting file in `.trace` format can be either returned directly as base64-encoded zip archive or uploaded to a remote location (such files can be pretty large). Afterwards it is possible to unarchive and open such files with Xcode Dev Tools.

**`Throws`**

If no performance recording with given profile name/device udid combination
has been started before or the resulting .trace file has not been generated properly.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `remotePath?` | `string` | `undefined` | The path to the remote location, where the resulting zipped `.trace` file should be uploaded. The following protocols are supported: `http`, `https`, `ftp`. Null or empty string value (the default setting) means the content of resulting file should be zipped, encoded as Base64 and passed as the endpoint response value. An exception will be thrown if the generated file is too big to fit into the available process memory. |
| `user?` | `string` | `undefined` | The name of the user for the remote authentication. Only works if `remotePath` is provided. |
| `pass?` | `string` | `undefined` | The password for the remote authentication. Only works if `remotePath` is provided. |
| `method?` | `Method` | `DEFAULT_PROFILE_NAME` | The http multipart upload method name. Only works if `remotePath` is provided. Defaults to `PUT` |
| `profileName` | `string` | `undefined` | The name of existing performance profile to stop the recording for. Multiple recorders for different profile names could be executed at the same time. |
| `headers?` | `Record`<`string`, `any`\> | `undefined` | Additional headers mapping for multipart http(s) uploads |
| `fileFieldName?` | `string` | `undefined` | The name of the form field, where the file content BLOB should be stored for http(s) uploads. Defaults to `file` |
| `formFields?` | [`string`, `any`][] \| `Record`<`string`, `any`\> | `undefined` | Additional form fields for multipart http(s) uploads |

##### Returns

`Promise`<`string`\>

The resulting file in `.trace` format. This file can either be returned directly as base64-encoded `.zip` archive or uploaded to a remote location (note that such files may be large), _depending on the `remotePath` argument value._  Thereafter, the file may be unarchived and opened with Xcode Developer Tools.

#### Defined in

[lib/driver.js:2155](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2155)

___

### mobileSwipe

• **mobileSwipe**: (...`this`: `any`, `direction`: `Direction`, `velocity?`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`unknown`\> = `commands.gestureExtensions.mobileSwipe`

#### Type declaration

▸ (`...this`, `direction`, `velocity?`, `elementId?`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `direction` | `Direction` |
| `velocity?` | `number` |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2055](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2055)

___

### mobileTap

• **mobileTap**: (...`this`: `any`, `x`: `number`, `y`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobileTap`

#### Type declaration

▸ (`...this`, `x`, `y?`, `elementId?`): `Promise`<`void`\>

Performs tap gesture by coordinates on the given element or on the screen.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `x` | `number` | `undefined` | The _x_ coordinate (float value) to tap on. If `elementId` is provided, this is computed relative to the element; otherwise it is computed relative to the active Application element. |
| `y` | `number` | `'0'` | The _y_ coordinate (float value) to tap on. If `elementId` is provided, this is computed relative to the element; otherwise it is computed relative to the active Application element. |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | `undefined` | The internal element identifier (as hexadecimal hash string) to tap on. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2060](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2060)

___

### mobileTapWithNumberOfTaps

• **mobileTapWithNumberOfTaps**: (...`this`: `any`, `elementId`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `numberOfTouches`: `number`, `numberOfTaps`: `number`) => `Promise`<`void`\> = `commands.gestureExtensions.mobileTapWithNumberOfTaps`

#### Type declaration

▸ (`...this`, `elementId`, `numberOfTouches`, `numberOfTaps`): `Promise`<`void`\>

Sends one or more taps with one or more touch points.

**`Since`**

1.17.1

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618671-tapwithnumberoftaps?language=objc

**`Example`**

```ruby
e = @driver.find_element :id, 'target element'
# Taps the element with a single touch point twice
@driver.execute_script 'mobile: tapWithNumberOfTaps', {element: e.ref, numberOfTaps: 2, numberOfTouches: 1}
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to perform one or more taps. |
| `numberOfTouches` | `number` | Number of touch points to use. |
| `numberOfTaps` | `number` | Number of taps to perform. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2063](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2063)

___

### mobileTerminateApp

• **mobileTerminateApp**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`boolean`\> = `commands.appManagementExtensions.mobileTerminateApp`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

Terminates the given app on the device under test.

This command performs termination via [XCTest's `terminate`](https://developer.apple.com/documentation/xctest/xcuiapplication/1500637-terminate) API. If the app is not installed an exception is thrown. If the app is not running then nothing is done.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be terminated |

##### Returns

`Promise`<`boolean`\>

`true` if the app has been terminated successfully; `false` otherwise

#### Defined in

[lib/driver.js:1863](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1863)

___

### mobileTouchAndHold

• **mobileTouchAndHold**: (...`this`: `any`, `duration`: `number`, `x?`: `number`, `y?`: `number`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`unknown`\> = `commands.gestureExtensions.mobileTouchAndHold`

#### Type declaration

▸ (`...this`, `duration`, `x?`, `y?`, `elementId?`): `Promise`<`unknown`\>

Performs a "long press" gesture on the given element or on the screen.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618663-pressforduration?language=objc

**`Example`**

```csharp
Dictionary<string, object> tfLongTap = new Dictionary<string, object>();
tfLongTap.Add("element", element.Id);
tfLongTap.Add("duration", 2.0);
((IJavaScriptExecutor)driver).ExecuteScript("mobile: touchAndHold", tfLongTap);
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `duration` | `number` | The duration (in seconds) of the gesture. |
| `x?` | `number` | The _x_ coordinate (float value) to double tap on. This is required if `elementId` is not provided. |
| `y?` | `number` | The _y_ coordinate (float value) to double tap on. This is required if `elementId` is not provided. |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to double tap on. This is required if `x` and `y` are not provided. |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2059](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2059)

___

### mobileTwoFingerTap

• **mobileTwoFingerTap**: (...`this`: `any`, `elementId?`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.gestureExtensions.mobileTwoFingerTap`

#### Type declaration

▸ (`...this`, `elementId?`): `Promise`<`void`\>

Performs two finger tap gesture on the given element or on the application element.

**`See`**

https://developer.apple.com/documentation/xctest/xcuielement/1618675-twofingertap?language=objc

**`Example`**

```csharp
Dictionary<string, object> tfTap = new Dictionary<string, object>();
tfTap.Add("element", element.Id);
((IJavaScriptExecutor)driver).ExecuteScript("mobile: twoFingerTap", tfTap);
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `elementId?` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | The internal element identifier (as hexadecimal hash string) to double tap on. The Application element will be used if this parameter is not provided. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2058](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2058)

___

### mobileWebNav

• **mobileWebNav**: (...`this`: `any`, `navType`: `string`) => `Promise`<`void`\> = `commands.webExtensions.mobileWebNav`

#### Type declaration

▸ (`...this`, `navType`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `navType` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2245](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2245)

___

### moveTo

• **moveTo**: (...`this`: `any`, `el`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>, `xoffset`: `number`, `yoffset`: `number`) => `Promise`<`void`\> = `commands.gestureExtensions.moveTo`

#### Type declaration

▸ (`...this`, `el?`, `xoffset?`, `yoffset`): `Promise`<`void`\>

Move the mouse pointer to a particular screen location

**`Deprecated`**

Use [`performActions`](appium_xcuitest_driver.XCUITestDriver.md#performactions) instead

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `el` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | `0` | the element ID if the move is relative to an element |
| `xoffset` | `number` | `0` | the x offset |
| `yoffset` | `number` | `undefined` | the y offset |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2045](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2045)

___

### nativeBack

• **nativeBack**: (...`this`: `any`) => `Promise`<`void`\> = `commands.navigationExtensions.nativeBack`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2127](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2127)

___

### nativeWebTap

• **nativeWebTap**: (...`this`: `any`, `el`: `any`) => `Promise`<`void`\> = `commands.webExtensions.nativeWebTap`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2241](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2241)

___

### newCommandTimeoutMs

• **newCommandTimeoutMs**: `number`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[newCommandTimeoutMs](appium_base_driver.BaseDriver.md#newcommandtimeoutms)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:29

___

### noCommandTimer

• **noCommandTimer**: ``null`` \| `Timeout`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[noCommandTimer](appium_base_driver.BaseDriver.md#nocommandtimer)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:34

___

### onPageChange

• **onPageChange**: (...`this`: `any`, `pageChangeNotification`: `PageChangeNotification`) => `Promise`<`void`\> = `commands.contextExtensions.onPageChange`

#### Type declaration

▸ (`...this`, `pageChangeNotification`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `pageChangeNotification` | `PageChangeNotification` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1938](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1938)

___

### opts

• **opts**: `XCUITestDriverOpts`

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[opts](appium_base_driver.BaseDriver.md#opts)

#### Defined in

[lib/driver.js:253](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L253)

___

### originalCaps

• **originalCaps**: [`W3CDriverCaps`](../modules/appium_types.md#w3cdrivercaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>

The original capabilities used to start the session represented by the current driver instance

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[originalCaps](appium_base_driver.BaseDriver.md#originalcaps)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:6

___

### pageLoadMs

• **pageLoadMs**: `undefined` \| `number`

#### Defined in

[lib/driver.js:341](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L341)

___

### pageLoadTimeoutMJSONWP

• **pageLoadTimeoutMJSONWP**: (...`this`: `any`, `ms`: `any`) => `Promise`<`void`\> = `commands.timeoutExtensions.pageLoadTimeoutMJSONWP`

#### Type declaration

▸ (`...this`, `ms`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `ms` | `any` |

##### Returns

`Promise`<`void`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[pageLoadTimeoutMJSONWP](appium_base_driver.BaseDriver.md#pageloadtimeoutmjsonwp)

#### Defined in

[lib/driver.js:2205](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2205)

___

### pageLoadTimeoutW3C

• **pageLoadTimeoutW3C**: (...`this`: `any`, `ms`: `any`) => `Promise`<`void`\> = `commands.timeoutExtensions.pageLoadTimeoutW3C`

#### Type declaration

▸ (`...this`, `ms`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `ms` | `any` |

##### Returns

`Promise`<`void`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[pageLoadTimeoutW3C](appium_base_driver.BaseDriver.md#pageloadtimeoutw3c)

#### Defined in

[lib/driver.js:2204](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2204)

___

### performActions

• **performActions**: (...`this`: `any`, `actions`: [`ActionSequence`](../modules/appium_types.md#actionsequence)[]) => `Promise`<`void`\> = `commands.gestureExtensions.performActions`

#### Type declaration

▸ (`...this`, `actions`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `actions` | [`ActionSequence`](../modules/appium_types.md#actionsequence)[] |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2049](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2049)

___

### performTouch

• **performTouch**: (...`this`: `any`, `gestures`: `any`[]) => `Promise`<`unknown`\> = `commands.gestureExtensions.performTouch`

#### Type declaration

▸ (`...this`, `gestures`): `Promise`<`unknown`\>

Perform a set of touch actions

**`Deprecated`**

Use [`performActions`](appium_xcuitest_driver.XCUITestDriver.md#performactions) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `gestures` | `any`[] | the old MJSONWP style touch action objects |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2050](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2050)

___

### postAcceptAlert

• **postAcceptAlert**: (...`this`: `any`, `opts`: { `buttonLabel?`: `string`  }) => `Promise`<`void`\> = `commands.alertExtensions.postAcceptAlert`

#### Type declaration

▸ (`...this?`, `opts`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `opts` | `Object` |
| `opts.buttonLabel?` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1850](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1850)

___

### postDismissAlert

• **postDismissAlert**: (...`this`: `any`, `opts`: { `buttonLabel?`: `string`  }) => `Promise`<`void`\> = `commands.alertExtensions.postDismissAlert`

#### Type declaration

▸ (`...this?`, `opts`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `opts` | `Object` |
| `opts.buttonLabel?` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1851](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1851)

___

### protocol

• `Optional` **protocol**: [`Protocol`](../modules/appium_types.md#protocol)

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[protocol](appium_base_driver.BaseDriver.md#protocol)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:51

___

### proxyCommand

• **proxyCommand**: <TReq, TRes\>(...`this`: `any`, `url`: `string`, `method`: `AllowedHttpMethod`, `body?`: `TReq`, `isSessionCommand`: `boolean`) => `Promise`<`TRes`\> = `commands.proxyHelperExtensions.proxyCommand`

#### Type declaration

▸ <`TReq`, `TRes`\>(`...this`, `url`, `method`, `body?`, `isSessionCommand`): `Promise`<`TRes`\>

Proxies a command to WebDriverAgent

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TReq` | `any` |
| `TRes` | `unknown` |

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `undefined` |
| `url` | `string` | `undefined` |
| `method` | `AllowedHttpMethod` | `undefined` |
| `body?` | `TReq` | `true` |
| `isSessionCommand` | `boolean` | `undefined` |

##### Returns

`Promise`<`TRes`\>

#### Defined in

[lib/driver.js:2169](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2169)

___

### proxyReqRes

• **proxyReqRes**: `any`

#### Defined in

[lib/driver.js:330](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L330)

[lib/driver.js:898](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L898)

[lib/driver.js:1044](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1044)

___

### pullFile

• **pullFile**: (...`this`: `any`, `remotePath`: `string`) => `Promise`<`string`\> = `commands.fileMovementExtensions.pullFile`

#### Type declaration

▸ (`...this`, `remotePath`): `Promise`<`string`\>

Pulls a remote file from the device.

**`Throws`**

If the pull operation failed

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote file or a specially formatted path, which points to an item inside app bundle. See the documentation for `pullFromRealDevice` and `pullFromSimulator` to get more information on acceptable values. |

##### Returns

`Promise`<`string`\>

Base64 encoded content of the pulled file

#### Defined in

[lib/driver.js:1993](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1993)

___

### pullFolder

• **pullFolder**: (...`this`: `any`, `remotePath`: `string`) => `Promise`<`string`\> = `commands.fileMovementExtensions.pullFolder`

#### Type declaration

▸ (`...this`, `remotePath`): `Promise`<`string`\>

Pulls the whole folder from the remote device

**`Throws`**

If there was a failure while getting the folder content

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to a folder on the remote device or a folder inside an application bundle |

##### Returns

`Promise`<`string`\>

Zipped and base64-encoded content of the folder

#### Defined in

[lib/driver.js:1997](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1997)

___

### pushFile

• **pushFile**: (...`this`: `any`, `remotePath`: `string`, `base64Data`: `string`) => `Promise`<`void`\> = `commands.fileMovementExtensions.pushFile`

#### Type declaration

▸ (`...this`, `remotePath`, `base64Data`): `Promise`<`void`\>

Pushes the given data to a file on the remote device

**`Throws`**

If there was an error while pushing the data

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `remotePath` | `string` | The full path to the remote file or a file inside a package bundle. Check the documentation on `pushFileToRealDevice` and `pushFileToSimulator` for more information on acceptable values. |
| `base64Data` | `string` | Base64 encoded data to be written to the remote file. The remote file will be silently overridden if it already exists. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1991](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1991)

___

### queryAppState

• **queryAppState**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`AppState`\> = `commands.appManagementExtensions.queryAppState`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`AppState`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `bundleId` | `string` |

##### Returns

`Promise`<`AppState`\>

#### Defined in

[lib/driver.js:1872](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1872)

___

### receiveAsyncResponse

• **receiveAsyncResponse**: (...`this`: `any`, `status`: `any`, `value`: `any`) => `Promise`<`void`\> = `commands.executeExtensions.receiveAsyncResponse`

#### Type declaration

▸ (`...this`, `status`, `value`): `Promise`<`void`\>

Collect the response of an async script execution

**`Deprecated`**

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `status` | `any` |
| `value` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1982](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1982)

___

### relaxedSecurityEnabled

• **relaxedSecurityEnabled**: `boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[relaxedSecurityEnabled](appium_base_driver.BaseDriver.md#relaxedsecurityenabled)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:26

___

### releaseActions

• **releaseActions**: (...`this`: `any`) => `Promise`<`void`\> = `commands.gestureExtensions.releaseActions`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2048](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2048)

___

### remote

• **remote**: `any`

#### Defined in

[lib/driver.js:343](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L343)

___

### removeApp

• **removeApp**: (...`this`: `any`, `bundleId`: `any`) => `Promise`<`boolean`\> = `commands.generalExtensions.removeApp`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `bundleId` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2022](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2022)

___

### resetOnUnexpectedShutdown

• **resetOnUnexpectedShutdown**: `any`

#### Defined in

[lib/driver.js:1829](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1829)

[lib/driver.js:1833](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1833)

___

### safari

• **safari**: `undefined` \| `boolean`

#### Defined in

[lib/driver.js:331](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L331)

[lib/driver.js:545](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L545)

___

### scriptTimeoutMJSONWP

• **scriptTimeoutMJSONWP**: (...`this`: `any`, `ms`: `number`) => `Promise`<`void`\> = `commands.timeoutExtensions.scriptTimeoutMJSONWP`

#### Type declaration

▸ (`...this`, `ms`): `Promise`<`void`\>

Alias for [`scriptTimeoutW3C`](appium_xcuitest_driver.XCUITestDriver.md#scripttimeoutw3c).

**`Deprecated`**

Use [`scriptTimeoutW3C`](appium_xcuitest_driver.XCUITestDriver.md#scripttimeoutw3c) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `ms` | `number` | the timeout |

##### Returns

`Promise`<`void`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[scriptTimeoutMJSONWP](appium_base_driver.BaseDriver.md#scripttimeoutmjsonwp)

#### Defined in

[lib/driver.js:2207](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2207)

___

### scriptTimeoutW3C

• **scriptTimeoutW3C**: (...`this`: `any`, `ms`: `any`) => `Promise`<`void`\> = `commands.timeoutExtensions.scriptTimeoutW3C`

#### Type declaration

▸ (`...this`, `ms`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `ms` | `any` |

##### Returns

`Promise`<`void`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[scriptTimeoutW3C](appium_base_driver.BaseDriver.md#scripttimeoutw3c)

#### Defined in

[lib/driver.js:2206](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2206)

___

### selectingNewPage

• **selectingNewPage**: `undefined` \| `boolean`

#### Defined in

[lib/driver.js:193](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L193)

___

### server

• `Optional` **server**: [`AppiumServer`](../modules/appium_types.md#appiumserver)

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[server](appium_base_driver.BaseDriver.md#server)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:8

___

### serverHost

• `Optional` **serverHost**: `string`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[serverHost](appium_base_driver.BaseDriver.md#serverhost)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:9

___

### serverPath

• `Optional` **serverPath**: `string`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[serverPath](appium_base_driver.BaseDriver.md#serverpath)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:11

___

### serverPort

• `Optional` **serverPort**: `number`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[serverPort](appium_base_driver.BaseDriver.md#serverport)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:10

___

### sessionId

• **sessionId**: ``null`` \| `string`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[sessionId](appium_base_driver.BaseDriver.md#sessionid)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:13

___

### setAlertText

• **setAlertText**: (...`this`: `any`, `value`: `string`) => `Promise`<`void`\> = `commands.alertExtensions.setAlertText`

#### Type declaration

▸ (`...this`, `value`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `value` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1849](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1849)

___

### setAsyncScriptTimeout

• **setAsyncScriptTimeout**: (...`this`: `any`, `ms`: `any`) => `void` = `commands.timeoutExtensions.setAsyncScriptTimeout`

#### Type declaration

▸ (`...this`, `ms`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `ms` | `any` |

##### Returns

`void`

#### Defined in

[lib/driver.js:2210](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2210)

___

### setClipboard

• **setClipboard**: (...`this`: `any`, `content`: `string`, `contentType?`: `string`) => `Promise`<`void`\> = `commands.clipboardExtensions.setClipboard`

#### Type declaration

▸ (`...this`, `content`, `contentType?`): `Promise`<`void`\>

Sets the primary clipboard's content on the device under test.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `content` | `string` | The content to be set as base64 encoded string. |
| `contentType?` | `string` | The type of the content to set. Only `plaintext`, 'image and 'url' are supported. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1912](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1912)

___

### setContext

• **setContext**: (...`this`: `any`, `name`: `string` \| `Context`, `callback?`: `any`, `skipReadyCheck`: `boolean`) => `Promise`<`void`\> = `commands.contextExtensions.setContext`

#### Type declaration

▸ (`...this`, `name`, `callback?`, `skipReadyCheck`): `Promise`<`void`\>

Set context

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `name` | `string` \| `Context` | `undefined` | The name of context to set. It could be 'null' as NATIVE_WIN. |
| `callback?` | `any` | `false` | The callback. (It is not called in this method) |
| `skipReadyCheck` | `boolean` | `undefined` | Whether it waits for the new context is ready |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1931](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1931)

___

### setCurrentUrl

• **setCurrentUrl**: (...`this`: `any`, `url`: `any`) => `void` = `commands.contextExtensions.setCurrentUrl`

#### Type declaration

▸ (`...this`, `url`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `url` | `any` |

##### Returns

`void`

#### Defined in

[lib/driver.js:1945](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1945)

___

### setGeoLocation

• **setGeoLocation**: (...`this`: `any`, `location`: `Partial`<[`Location`](../interfaces/appium_types.Location.md)\>) => `Promise`<[`Location`](../interfaces/appium_types.Location.md)\> = `commands.locationExtensions.setGeoLocation`

#### Type declaration

▸ (`...this`, `location`): `Promise`<[`Location`](../interfaces/appium_types.Location.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `location` | `Partial`<[`Location`](../interfaces/appium_types.Location.md)\> |

##### Returns

`Promise`<[`Location`](../interfaces/appium_types.Location.md)\>

#### Defined in

[lib/driver.js:2100](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2100)

___

### setPageLoadTimeout

• **setPageLoadTimeout**: (...`this`: `any`, `ms`: `any`) => `void` = `commands.timeoutExtensions.setPageLoadTimeout`

#### Type declaration

▸ (`...this`, `ms`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `ms` | `any` |

##### Returns

`void`

#### Defined in

[lib/driver.js:2209](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2209)

___

### setUrl

• **setUrl**: (...`this`: `any`, `url`: `any`) => `Promise`<`void`\> = `commands.generalExtensions.setUrl`

#### Type declaration

▸ (`...this`, `url`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `url` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2025](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2025)

___

### setValue

• **setValue**: (...`this`: `any`, `value`: `any`, `el`: `any`) => `Promise`<`void`\> = `commands.elementExtensions.setValue`

#### Type declaration

▸ (`...this`, `value`, `el`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `value` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1972](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1972)

___

### setValueImmediate

• **setValueImmediate**: (...`this`: `any`, `value`: `string`, `el`: `string`) => `Promise`<`void`\> = `commands.elementExtensions.setValueImmediate`

#### Type declaration

▸ (`...this`, `value`, `el`): `Promise`<`void`\>

**`Deprecated`**

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `value` | `string` |
| `el` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1971](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1971)

___

### setWindow

• **setWindow**: (...`this`: `any`, `name`: `any`, `skipReadyCheck`: `any`) => `Promise`<`void`\> = `commands.contextExtensions.setWindow`

#### Type declaration

▸ (`...this`, `name`, `skipReadyCheck`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `name` | `any` |
| `skipReadyCheck` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1932](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1932)

___

### settings

• **settings**: [`DeviceSettings`](appium_base_driver.DeviceSettings.md)<{ `elementResponseAttributes`: `string` = 'type,label'; `mjpegScalingFactor`: `number` = 100; `mjpegServerFramerate`: `number` = 10; `mjpegServerScreenshotQuality`: `number` = 25; `nativeWebTap`: `boolean` = false; `nativeWebTapStrict`: `boolean` = false; `reduceMotion`: ``null`` = null; `screenshotQuality`: `number` = 1; `shouldUseCompactResponses`: `boolean` = true; `useJSONSource`: `boolean` = false }\>

settings should be instantiated by drivers which extend BaseDriver, but
we set it to an empty DeviceSettings instance here to make sure that the
default settings are applied even if an extending driver doesn't utilize
the settings functionality itself

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[settings](appium_base_driver.BaseDriver.md#settings)

#### Defined in

[lib/driver.js:304](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L304)

___

### shouldValidateCaps

• **shouldValidateCaps**: `boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[shouldValidateCaps](appium_base_driver.BaseDriver.md#shouldvalidatecaps)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:42

___

### shutdownUnexpectedly

• **shutdownUnexpectedly**: `boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[shutdownUnexpectedly](appium_base_driver.BaseDriver.md#shutdownunexpectedly)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:41

___

### startLogCapture

• **startLogCapture**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.logExtensions.startLogCapture`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:2116](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2116)

___

### startRecordingScreen

• **startRecordingScreen**: (...`this`: `any`, `options?`: `StartRecordingScreenOptions`) => `Promise`<`string`\> = `commands.recordScreenExtensions.startRecordingScreen`

#### Type declaration

▸ (`...this?`, `options?`): `Promise`<`string`\>

Direct Appium to start recording the device screen

Record the display of devices running iOS Simulator since Xcode 9 or real devices since iOS 11
(ffmpeg utility is required: 'brew install ffmpeg').
It records screen activity to a MPEG-4 file. Audio is not recorded with the video file.
If screen recording has been already started then the command will stop it forcefully and start a new one.
The previously recorded video file will be deleted.

**`Throws`**

If screen recording has failed to start.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `options?` | `StartRecordingScreenOptions` | The available options. |

##### Returns

`Promise`<`string`\>

Base64-encoded content of the recorded media file if
                  any screen recording is currently running or an empty string.

#### Defined in

[lib/driver.js:2183](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2183)

___

### stopAudioRecording

• **stopAudioRecording**: (...`this`: `any`) => `Promise`<`string`\> = `commands.recordAudioExtensions.stopAudioRecording`

#### Type declaration

▸ (`...this`): `Promise`<`string`\>

Stop recording of the audio input. If no audio recording process is running then
the endpoint will try to get the recently recorded file.
If no previously recorded file is found and no active audio recording
processes are running then the method returns an empty string.

**`Throws`**

If there was an error while getting the recorded file.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`string`\>

Base64-encoded content of the recorded media file or an
empty string if no audio recording has been started before.

#### Defined in

[lib/driver.js:2176](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2176)

___

### stopRecordingScreen

• **stopRecordingScreen**: (...`this`: `any`, `options`: `StopRecordingScreenOptions`) => `Promise`<``null`` \| `string`\> = `commands.recordScreenExtensions.stopRecordingScreen`

#### Type declaration

▸ (`...this?`, `options`): `Promise`<``null`` \| `string`\>

Direct Appium to stop screen recording and return the video

If no screen recording process is running then the endpoint will try to get
the recently recorded file. If no previously recorded file is found and no
active screen recording processes are running then the method returns an
empty string.

**`Throws`**

If there was an error while getting the name of a media
                file or the file content cannot be uploaded to the remote
                location.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `options` | `StopRecordingScreenOptions` | The available options. |

##### Returns

`Promise`<``null`` \| `string`\>

Base64-encoded content of the recorded media
file if `remotePath` parameter is empty or null or an empty string.

#### Defined in

[lib/driver.js:2184](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2184)

___

### stopRemote

• **stopRemote**: (...`this`: `any`, `closeWindowBeforeDisconnecting`: `boolean`) => `Promise`<`void`\> = `commands.contextExtensions.stopRemote`

#### Type declaration

▸ (`...this?`, `closeWindowBeforeDisconnecting`): `Promise`<`void`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `...this` | `any` | `false` |
| `closeWindowBeforeDisconnecting` | `boolean` | `undefined` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1946](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1946)

___

### supportedLogTypes

• **supportedLogTypes**: [`LogDefRecord`](../modules/appium_types.md#logdefrecord) = `commands.logExtensions.supportedLogTypes`

Definition of the available log types

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[supportedLogTypes](appium_base_driver.BaseDriver.md#supportedlogtypes)

#### Defined in

[lib/driver.js:2115](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2115)

___

### terminateApp

• **terminateApp**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`boolean`\> = `commands.appManagementExtensions.terminateApp`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `bundleId` | `string` |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[lib/driver.js:1871](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1871)

___

### toggleEnrollTouchId

• **toggleEnrollTouchId**: (...`this`: `any`, `isEnabled`: `boolean`) => `Promise`<`void`\> = `commands.generalExtensions.toggleEnrollTouchId`

#### Type declaration

▸ (`...this?`, `isEnabled`): `Promise`<`void`\>

Toggle whether the device is enrolled in the touch ID program

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `true` | - |
| `isEnabled` | `boolean` | `undefined` | whether to enable or disable the touch ID program |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2016](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2016)

___

### touchId

• **touchId**: (...`this`: `any`, `match`: `boolean`) => `Promise`<`void`\> = `commands.generalExtensions.touchId`

#### Type declaration

▸ (`...this?`, `match`): `Promise`<`void`\>

Trigger a touch/fingerprint match or match failure

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `true` | - |
| `match` | `boolean` | `undefined` | whether the match should be a success or failure |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2015](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2015)

___

### translateWebCoords

• **translateWebCoords**: (...`this`: `any`, `coords`: `any`) => `Promise`<`undefined` \| { `x`: `number` ; `y`: `number`  }\> = `commands.webExtensions.translateWebCoords`

#### Type declaration

▸ (`...this`, `coords`): `Promise`<`undefined` \| { `x`: `number` ; `y`: `number`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `coords` | `any` |

##### Returns

`Promise`<`undefined` \| { `x`: `number` ; `y`: `number`  }\>

#### Defined in

[lib/driver.js:2242](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2242)

___

### unlock

• **unlock**: (...`this`: `any`) => `Promise`<`void`\> = `commands.lockExtensions.unlock`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Unlock the device

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2107](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2107)

___

### useNewSafari

• **useNewSafari**: (...`this`: `any`) => `any` = `commands.contextExtensions.useNewSafari`

#### Type declaration

▸ (`...this`): `any`

Right now we don't necessarily wait for webview
and frame to load, which leads to race conditions and flakiness,
let's see if we can transition to something better

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`any`

#### Defined in

[lib/driver.js:1939](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1939)

___

### waitForAtom

• **waitForAtom**: (...`this`: `any`, `promise`: `Promise`<`any`\>) => `Promise`<`any`\> = `commands.webExtensions.waitForAtom`

#### Type declaration

▸ (`...this`, `promise`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `promise` | `Promise`<`any`\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2244](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2244)

___

### wda

• **wda**: `any`

#### Defined in

[lib/driver.js:326](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L326)

[lib/driver.js:567](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L567)

___

### wdaCaps

• **wdaCaps**: `undefined` \| `WDACapabilities`

#### Defined in

[lib/driver.js:259](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L259)

___

### webElementsCache

• **webElementsCache**: `LRUCache`<`any`, `any`, `any`\>

#### Defined in

[lib/driver.js:232](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L232)

___

### webLocatorStrategies

• **webLocatorStrategies**: `string`[]

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[webLocatorStrategies](appium_base_driver.BaseDriver.md#weblocatorstrategies)

#### Defined in

[lib/driver.js:285](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L285)

___

### windowHandleCache

• **windowHandleCache**: `undefined` \| `Page`[]

#### Defined in

[lib/driver.js:217](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L217)

___

### xcodeVersion

• **xcodeVersion**: `undefined` \| `XcodeVersion`

#### Defined in

[lib/driver.js:262](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L262)

___

### baseVersion

▪ `Static` **baseVersion**: `string`

Make the basedriver version available so for any driver which inherits from this package, we
know which version of basedriver it inherited from

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[baseVersion](appium_base_driver.BaseDriver.md#baseversion)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:12

___

### executeMethodMap

▪ `Static` **executeMethodMap**: `Object` = `executeMethodMap`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mobile: activateApp` | { `command`: ``"mobileActivateApp"`` = 'mobileActivateApp'; `params`: { `required`: readonly [``"bundleId"``]  }  } |
| `mobile: activateApp.command` | ``"mobileActivateApp"`` |
| `mobile: activateApp.params` | { `required`: readonly [``"bundleId"``]  } |
| `mobile: activateApp.params.required` | readonly [``"bundleId"``] |
| `mobile: activeAppInfo` | { `command`: ``"mobileGetActiveAppInfo"`` = 'mobileGetActiveAppInfo' } |
| `mobile: activeAppInfo.command` | ``"mobileGetActiveAppInfo"`` |
| `mobile: alert` | { `command`: ``"mobileHandleAlert"`` = 'mobileHandleAlert'; `params`: { `optional`: readonly [``"buttonLabel"``] ; `required`: readonly [``"action"``]  }  } |
| `mobile: alert.command` | ``"mobileHandleAlert"`` |
| `mobile: alert.params` | { `optional`: readonly [``"buttonLabel"``] ; `required`: readonly [``"action"``]  } |
| `mobile: alert.params.optional` | readonly [``"buttonLabel"``] |
| `mobile: alert.params.required` | readonly [``"action"``] |
| `mobile: backgroundApp` | { `command`: ``"background"`` = 'background'; `params`: { `optional`: readonly [``"seconds"``]  }  } |
| `mobile: backgroundApp.command` | ``"background"`` |
| `mobile: backgroundApp.params` | { `optional`: readonly [``"seconds"``]  } |
| `mobile: backgroundApp.params.optional` | readonly [``"seconds"``] |
| `mobile: batteryInfo` | { `command`: ``"mobileGetBatteryInfo"`` = 'mobileGetBatteryInfo' } |
| `mobile: batteryInfo.command` | ``"mobileGetBatteryInfo"`` |
| `mobile: clearKeychains` | { `command`: ``"mobileClearKeychains"`` = 'mobileClearKeychains' } |
| `mobile: clearKeychains.command` | ``"mobileClearKeychains"`` |
| `mobile: configureLocalization` | { `command`: ``"mobileConfigureLocalization"`` = 'mobileConfigureLocalization'; `params`: { `optional`: readonly [``"keyboard"``, ``"language"``, ``"locale"``]  }  } |
| `mobile: configureLocalization.command` | ``"mobileConfigureLocalization"`` |
| `mobile: configureLocalization.params` | { `optional`: readonly [``"keyboard"``, ``"language"``, ``"locale"``]  } |
| `mobile: configureLocalization.params.optional` | readonly [``"keyboard"``, ``"language"``, ``"locale"``] |
| `mobile: deepLink` | { `command`: ``"mobileDeepLink"`` = 'mobileDeepLink'; `params`: { `optional`: readonly [``"bundleId"``] ; `required`: readonly [``"url"``]  }  } |
| `mobile: deepLink.command` | ``"mobileDeepLink"`` |
| `mobile: deepLink.params` | { `optional`: readonly [``"bundleId"``] ; `required`: readonly [``"url"``]  } |
| `mobile: deepLink.params.optional` | readonly [``"bundleId"``] |
| `mobile: deepLink.params.required` | readonly [``"url"``] |
| `mobile: deleteFile` | { `command`: ``"mobileDeleteFile"`` = 'mobileDeleteFile'; `params`: { `required`: readonly [``"remotePath"``]  }  } |
| `mobile: deleteFile.command` | ``"mobileDeleteFile"`` |
| `mobile: deleteFile.params` | { `required`: readonly [``"remotePath"``]  } |
| `mobile: deleteFile.params.required` | readonly [``"remotePath"``] |
| `mobile: deleteFolder` | { `command`: ``"mobileDeleteFolder"`` = 'mobileDeleteFolder'; `params`: { `required`: readonly [``"remotePath"``]  }  } |
| `mobile: deleteFolder.command` | ``"mobileDeleteFolder"`` |
| `mobile: deleteFolder.params` | { `required`: readonly [``"remotePath"``]  } |
| `mobile: deleteFolder.params.required` | readonly [``"remotePath"``] |
| `mobile: deviceInfo` | { `command`: ``"mobileGetDeviceInfo"`` = 'mobileGetDeviceInfo' } |
| `mobile: deviceInfo.command` | ``"mobileGetDeviceInfo"`` |
| `mobile: deviceScreenInfo` | { `command`: ``"getScreenInfo"`` = 'getScreenInfo' } |
| `mobile: deviceScreenInfo.command` | ``"getScreenInfo"`` |
| `mobile: disableConditionInducer` | { `command`: ``"disableConditionInducer"`` = 'disableConditionInducer' } |
| `mobile: disableConditionInducer.command` | ``"disableConditionInducer"`` |
| `mobile: doubleTap` | { `command`: ``"mobileDoubleTap"`` = 'mobileDoubleTap'; `params`: { `optional`: readonly [``"elementId"``, ``"x"``, ``"y"``]  }  } |
| `mobile: doubleTap.command` | ``"mobileDoubleTap"`` |
| `mobile: doubleTap.params` | { `optional`: readonly [``"elementId"``, ``"x"``, ``"y"``]  } |
| `mobile: doubleTap.params.optional` | readonly [``"elementId"``, ``"x"``, ``"y"``] |
| `mobile: dragFromToForDuration` | { `command`: ``"mobileDragFromToForDuration"`` = 'mobileDragFromToForDuration'; `params`: { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"duration"``, ``"fromX"``, ``"fromY"``, ``"toX"``, ``"toY"``]  }  } |
| `mobile: dragFromToForDuration.command` | ``"mobileDragFromToForDuration"`` |
| `mobile: dragFromToForDuration.params` | { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"duration"``, ``"fromX"``, ``"fromY"``, ``"toX"``, ``"toY"``]  } |
| `mobile: dragFromToForDuration.params.optional` | readonly [``"elementId"``] |
| `mobile: dragFromToForDuration.params.required` | readonly [``"duration"``, ``"fromX"``, ``"fromY"``, ``"toX"``, ``"toY"``] |
| `mobile: dragFromToWithVelocity` | { `command`: ``"mobileDragFromToWithVelocity"`` = 'mobileDragFromToWithVelocity'; `params`: { `optional`: readonly [``"fromElementId"``, ``"toElementId"``, ``"fromX"``, ``"fromY"``, ``"toX"``, ``"toY"``] ; `required`: readonly [``"pressDuration"``, ``"holdDuration"``, ``"velocity"``]  }  } |
| `mobile: dragFromToWithVelocity.command` | ``"mobileDragFromToWithVelocity"`` |
| `mobile: dragFromToWithVelocity.params` | { `optional`: readonly [``"fromElementId"``, ``"toElementId"``, ``"fromX"``, ``"fromY"``, ``"toX"``, ``"toY"``] ; `required`: readonly [``"pressDuration"``, ``"holdDuration"``, ``"velocity"``]  } |
| `mobile: dragFromToWithVelocity.params.optional` | readonly [``"fromElementId"``, ``"toElementId"``, ``"fromX"``, ``"fromY"``, ``"toX"``, ``"toY"``] |
| `mobile: dragFromToWithVelocity.params.required` | readonly [``"pressDuration"``, ``"holdDuration"``, ``"velocity"``] |
| `mobile: enableConditionInducer` | { `command`: ``"enableConditionInducer"`` = 'enableConditionInducer'; `params`: { `required`: readonly [``"conditionID"``, ``"profileID"``]  }  } |
| `mobile: enableConditionInducer.command` | ``"enableConditionInducer"`` |
| `mobile: enableConditionInducer.params` | { `required`: readonly [``"conditionID"``, ``"profileID"``]  } |
| `mobile: enableConditionInducer.params.required` | readonly [``"conditionID"``, ``"profileID"``] |
| `mobile: enrollBiometric` | { `command`: ``"mobileEnrollBiometric"`` = 'mobileEnrollBiometric'; `params`: { `optional`: readonly [``"isEnabled"``]  }  } |
| `mobile: enrollBiometric.command` | ``"mobileEnrollBiometric"`` |
| `mobile: enrollBiometric.params` | { `optional`: readonly [``"isEnabled"``]  } |
| `mobile: enrollBiometric.params.optional` | readonly [``"isEnabled"``] |
| `mobile: expectNotification` | { `command`: ``"mobileExpectNotification"`` = 'mobileExpectNotification'; `params`: { `optional`: readonly [``"type"``, ``"timeoutSeconds"``] ; `required`: readonly [``"name"``]  }  } |
| `mobile: expectNotification.command` | ``"mobileExpectNotification"`` |
| `mobile: expectNotification.params` | { `optional`: readonly [``"type"``, ``"timeoutSeconds"``] ; `required`: readonly [``"name"``]  } |
| `mobile: expectNotification.params.optional` | readonly [``"type"``, ``"timeoutSeconds"``] |
| `mobile: expectNotification.params.required` | readonly [``"name"``] |
| `mobile: forcePress` | { `command`: ``"mobileForcePress"`` = 'mobileForcePress'; `params`: { `optional`: readonly [``"x"``, ``"y"``, ``"duration"``, ``"pressure"``, ``"elementId"``]  }  } |
| `mobile: forcePress.command` | ``"mobileForcePress"`` |
| `mobile: forcePress.params` | { `optional`: readonly [``"x"``, ``"y"``, ``"duration"``, ``"pressure"``, ``"elementId"``]  } |
| `mobile: forcePress.params.optional` | readonly [``"x"``, ``"y"``, ``"duration"``, ``"pressure"``, ``"elementId"``] |
| `mobile: getAppStrings` | { `command`: ``"getStrings"`` = 'getStrings'; `params`: { `optional`: readonly [``"language"``, ``"stringFile"``]  }  } |
| `mobile: getAppStrings.command` | ``"getStrings"`` |
| `mobile: getAppStrings.params` | { `optional`: readonly [``"language"``, ``"stringFile"``]  } |
| `mobile: getAppStrings.params.optional` | readonly [``"language"``, ``"stringFile"``] |
| `mobile: getAppearance` | { `command`: ``"mobileGetAppearance"`` = 'mobileGetAppearance' } |
| `mobile: getAppearance.command` | ``"mobileGetAppearance"`` |
| `mobile: getContexts` | { `command`: ``"mobileGetContexts"`` = 'mobileGetContexts'; `params`: { `optional`: readonly [``"waitForWebviewMs"``]  }  } |
| `mobile: getContexts.command` | ``"mobileGetContexts"`` |
| `mobile: getContexts.params` | { `optional`: readonly [``"waitForWebviewMs"``]  } |
| `mobile: getContexts.params.optional` | readonly [``"waitForWebviewMs"``] |
| `mobile: getDeviceTime` | { `command`: ``"mobileGetDeviceTime"`` = 'mobileGetDeviceTime'; `params`: { `optional`: readonly [``"format"``]  }  } |
| `mobile: getDeviceTime.command` | ``"mobileGetDeviceTime"`` |
| `mobile: getDeviceTime.params` | { `optional`: readonly [``"format"``]  } |
| `mobile: getDeviceTime.params.optional` | readonly [``"format"``] |
| `mobile: getPasteboard` | { `command`: ``"mobileGetPasteboard"`` = 'mobileGetPasteboard'; `params`: { `optional`: readonly [``"encoding"``]  }  } |
| `mobile: getPasteboard.command` | ``"mobileGetPasteboard"`` |
| `mobile: getPasteboard.params` | { `optional`: readonly [``"encoding"``]  } |
| `mobile: getPasteboard.params.optional` | readonly [``"encoding"``] |
| `mobile: getPermission` | { `command`: ``"mobileGetPermission"`` = 'mobileGetPermission'; `params`: { `required`: readonly [``"bundleId"``, ``"service"``]  }  } |
| `mobile: getPermission.command` | ``"mobileGetPermission"`` |
| `mobile: getPermission.params` | { `required`: readonly [``"bundleId"``, ``"service"``]  } |
| `mobile: getPermission.params.required` | readonly [``"bundleId"``, ``"service"``] |
| `mobile: getSimulatedLocation` | { `command`: ``"mobileGetSimulatedLocation"`` = 'mobileGetSimulatedLocation' } |
| `mobile: getSimulatedLocation.command` | ``"mobileGetSimulatedLocation"`` |
| `mobile: hideKeyboard` | { `command`: ``"mobileHideKeyboard"`` = 'mobileHideKeyboard'; `params`: { `optional`: readonly [``"keys"``]  }  } |
| `mobile: hideKeyboard.command` | ``"mobileHideKeyboard"`` |
| `mobile: hideKeyboard.params` | { `optional`: readonly [``"keys"``]  } |
| `mobile: hideKeyboard.params.optional` | readonly [``"keys"``] |
| `mobile: installApp` | { `command`: ``"mobileInstallApp"`` = 'mobileInstallApp'; `params`: { `optional`: readonly [``"strategy"``, ``"timeoutMs"``] ; `required`: readonly [``"app"``]  }  } |
| `mobile: installApp.command` | ``"mobileInstallApp"`` |
| `mobile: installApp.params` | { `optional`: readonly [``"strategy"``, ``"timeoutMs"``] ; `required`: readonly [``"app"``]  } |
| `mobile: installApp.params.optional` | readonly [``"strategy"``, ``"timeoutMs"``] |
| `mobile: installApp.params.required` | readonly [``"app"``] |
| `mobile: installCertificate` | { `command`: ``"mobileInstallCertificate"`` = 'mobileInstallCertificate'; `params`: { `optional`: readonly [``"commonName"``, ``"isRoot"``] ; `required`: readonly [``"content"``]  }  } |
| `mobile: installCertificate.command` | ``"mobileInstallCertificate"`` |
| `mobile: installCertificate.params` | { `optional`: readonly [``"commonName"``, ``"isRoot"``] ; `required`: readonly [``"content"``]  } |
| `mobile: installCertificate.params.optional` | readonly [``"commonName"``, ``"isRoot"``] |
| `mobile: installCertificate.params.required` | readonly [``"content"``] |
| `mobile: installXCTestBundle` | { `command`: ``"mobileInstallXCTestBundle"`` = 'mobileInstallXCTestBundle'; `params`: { `required`: readonly [``"xctestApp"``]  }  } |
| `mobile: installXCTestBundle.command` | ``"mobileInstallXCTestBundle"`` |
| `mobile: installXCTestBundle.params` | { `required`: readonly [``"xctestApp"``]  } |
| `mobile: installXCTestBundle.params.required` | readonly [``"xctestApp"``] |
| `mobile: isAppInstalled` | { `command`: ``"mobileIsAppInstalled"`` = 'mobileIsAppInstalled'; `params`: { `required`: readonly [``"bundleId"``]  }  } |
| `mobile: isAppInstalled.command` | ``"mobileIsAppInstalled"`` |
| `mobile: isAppInstalled.params` | { `required`: readonly [``"bundleId"``]  } |
| `mobile: isAppInstalled.params.required` | readonly [``"bundleId"``] |
| `mobile: isBiometricEnrolled` | { `command`: ``"mobileIsBiometricEnrolled"`` = 'mobileIsBiometricEnrolled' } |
| `mobile: isBiometricEnrolled.command` | ``"mobileIsBiometricEnrolled"`` |
| `mobile: isKeyboardShown` | { `command`: ``"isKeyboardShown"`` = 'isKeyboardShown' } |
| `mobile: isKeyboardShown.command` | ``"isKeyboardShown"`` |
| `mobile: isLocked` | { `command`: ``"isLocked"`` = 'isLocked' } |
| `mobile: isLocked.command` | ``"isLocked"`` |
| `mobile: killApp` | { `command`: ``"mobileKillApp"`` = 'mobileKillApp'; `params`: { `required`: readonly [``"bundleId"``]  }  } |
| `mobile: killApp.command` | ``"mobileKillApp"`` |
| `mobile: killApp.params` | { `required`: readonly [``"bundleId"``]  } |
| `mobile: killApp.params.required` | readonly [``"bundleId"``] |
| `mobile: launchApp` | { `command`: ``"mobileLaunchApp"`` = 'mobileLaunchApp'; `params`: { `optional`: readonly [``"arguments"``, ``"environment"``] ; `required`: readonly [``"bundleId"``]  }  } |
| `mobile: launchApp.command` | ``"mobileLaunchApp"`` |
| `mobile: launchApp.params` | { `optional`: readonly [``"arguments"``, ``"environment"``] ; `required`: readonly [``"bundleId"``]  } |
| `mobile: launchApp.params.optional` | readonly [``"arguments"``, ``"environment"``] |
| `mobile: launchApp.params.required` | readonly [``"bundleId"``] |
| `mobile: listApps` | { `command`: ``"mobileListApps"`` = 'mobileListApps'; `params`: { `optional`: readonly [``"applicationType"``]  }  } |
| `mobile: listApps.command` | ``"mobileListApps"`` |
| `mobile: listApps.params` | { `optional`: readonly [``"applicationType"``]  } |
| `mobile: listApps.params.optional` | readonly [``"applicationType"``] |
| `mobile: listCertificates` | { `command`: ``"mobileListCertificates"`` = 'mobileListCertificates' } |
| `mobile: listCertificates.command` | ``"mobileListCertificates"`` |
| `mobile: listConditionInducers` | { `command`: ``"listConditionInducers"`` = 'listConditionInducers' } |
| `mobile: listConditionInducers.command` | ``"listConditionInducers"`` |
| `mobile: listXCTestBundles` | { `command`: ``"mobileListXCTestBundles"`` = 'mobileListXCTestBundles' } |
| `mobile: listXCTestBundles.command` | ``"mobileListXCTestBundles"`` |
| `mobile: listXCTestsInTestBundle` | { `command`: ``"mobileListXCTestsInTestBundle"`` = 'mobileListXCTestsInTestBundle'; `params`: { `required`: readonly [``"bundle"``]  }  } |
| `mobile: listXCTestsInTestBundle.command` | ``"mobileListXCTestsInTestBundle"`` |
| `mobile: listXCTestsInTestBundle.params` | { `required`: readonly [``"bundle"``]  } |
| `mobile: listXCTestsInTestBundle.params.required` | readonly [``"bundle"``] |
| `mobile: lock` | { `command`: ``"lock"`` = 'lock'; `params`: { `optional`: readonly [``"seconds"``]  }  } |
| `mobile: lock.command` | ``"lock"`` |
| `mobile: lock.params` | { `optional`: readonly [``"seconds"``]  } |
| `mobile: lock.params.optional` | readonly [``"seconds"``] |
| `mobile: performAccessibilityAudit` | { `command`: ``"mobilePerformAccessibilityAudit"`` = 'mobilePerformAccessibilityAudit'; `params`: { `optional`: readonly [``"auditTypes"``]  }  } |
| `mobile: performAccessibilityAudit.command` | ``"mobilePerformAccessibilityAudit"`` |
| `mobile: performAccessibilityAudit.params` | { `optional`: readonly [``"auditTypes"``]  } |
| `mobile: performAccessibilityAudit.params.optional` | readonly [``"auditTypes"``] |
| `mobile: performIoHidEvent` | { `command`: ``"mobilePerformIoHidEvent"`` = 'mobilePerformIoHidEvent'; `params`: { `required`: readonly [``"page"``, ``"usage"``, ``"durationSeconds"``]  }  } |
| `mobile: performIoHidEvent.command` | ``"mobilePerformIoHidEvent"`` |
| `mobile: performIoHidEvent.params` | { `required`: readonly [``"page"``, ``"usage"``, ``"durationSeconds"``]  } |
| `mobile: performIoHidEvent.params.required` | readonly [``"page"``, ``"usage"``, ``"durationSeconds"``] |
| `mobile: pinch` | { `command`: ``"mobilePinch"`` = 'mobilePinch'; `params`: { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"scale"``, ``"velocity"``]  }  } |
| `mobile: pinch.command` | ``"mobilePinch"`` |
| `mobile: pinch.params` | { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"scale"``, ``"velocity"``]  } |
| `mobile: pinch.params.optional` | readonly [``"elementId"``] |
| `mobile: pinch.params.required` | readonly [``"scale"``, ``"velocity"``] |
| `mobile: pressButton` | { `command`: ``"mobilePressButton"`` = 'mobilePressButton'; `params`: { `optional`: readonly [``"durationSeconds"``] ; `required`: readonly [``"name"``]  }  } |
| `mobile: pressButton.command` | ``"mobilePressButton"`` |
| `mobile: pressButton.params` | { `optional`: readonly [``"durationSeconds"``] ; `required`: readonly [``"name"``]  } |
| `mobile: pressButton.params.optional` | readonly [``"durationSeconds"``] |
| `mobile: pressButton.params.required` | readonly [``"name"``] |
| `mobile: pullFile` | { `command`: ``"mobilePullFile"`` = 'mobilePullFile'; `params`: { `required`: readonly [``"remotePath"``]  }  } |
| `mobile: pullFile.command` | ``"mobilePullFile"`` |
| `mobile: pullFile.params` | { `required`: readonly [``"remotePath"``]  } |
| `mobile: pullFile.params.required` | readonly [``"remotePath"``] |
| `mobile: pullFolder` | { `command`: ``"mobilePullFolder"`` = 'mobilePullFolder'; `params`: { `required`: readonly [``"remotePath"``]  }  } |
| `mobile: pullFolder.command` | ``"mobilePullFolder"`` |
| `mobile: pullFolder.params` | { `required`: readonly [``"remotePath"``]  } |
| `mobile: pullFolder.params.required` | readonly [``"remotePath"``] |
| `mobile: pushFile` | { `command`: ``"mobilePushFile"`` = 'mobilePushFile'; `params`: { `required`: readonly [``"remotePath"``, ``"payload"``]  }  } |
| `mobile: pushFile.command` | ``"mobilePushFile"`` |
| `mobile: pushFile.params` | { `required`: readonly [``"remotePath"``, ``"payload"``]  } |
| `mobile: pushFile.params.required` | readonly [``"remotePath"``, ``"payload"``] |
| `mobile: pushNotification` | { `command`: ``"mobilePushNotification"`` = 'mobilePushNotification'; `params`: { `required`: readonly [``"bundleId"``, ``"payload"``]  }  } |
| `mobile: pushNotification.command` | ``"mobilePushNotification"`` |
| `mobile: pushNotification.params` | { `required`: readonly [``"bundleId"``, ``"payload"``]  } |
| `mobile: pushNotification.params.required` | readonly [``"bundleId"``, ``"payload"``] |
| `mobile: queryAppState` | { `command`: ``"mobileQueryAppState"`` = 'mobileQueryAppState'; `params`: { `required`: readonly [``"bundleId"``]  }  } |
| `mobile: queryAppState.command` | ``"mobileQueryAppState"`` |
| `mobile: queryAppState.params` | { `required`: readonly [``"bundleId"``]  } |
| `mobile: queryAppState.params.required` | readonly [``"bundleId"``] |
| `mobile: removeApp` | { `command`: ``"mobileRemoveApp"`` = 'mobileRemoveApp'; `params`: { `required`: readonly [``"bundleId"``]  }  } |
| `mobile: removeApp.command` | ``"mobileRemoveApp"`` |
| `mobile: removeApp.params` | { `required`: readonly [``"bundleId"``]  } |
| `mobile: removeApp.params.required` | readonly [``"bundleId"``] |
| `mobile: removeCertificate` | { `command`: ``"mobileRemoveCertificate"`` = 'mobileRemoveCertificate'; `params`: { `required`: readonly [``"name"``]  }  } |
| `mobile: removeCertificate.command` | ``"mobileRemoveCertificate"`` |
| `mobile: removeCertificate.params` | { `required`: readonly [``"name"``]  } |
| `mobile: removeCertificate.params.required` | readonly [``"name"``] |
| `mobile: resetLocationService` | { `command`: ``"mobileResetLocationService"`` = 'mobileResetLocationService' } |
| `mobile: resetLocationService.command` | ``"mobileResetLocationService"`` |
| `mobile: resetPermission` | { `command`: ``"mobileResetPermission"`` = 'mobileResetPermission'; `params`: { `required`: readonly [``"service"``]  }  } |
| `mobile: resetPermission.command` | ``"mobileResetPermission"`` |
| `mobile: resetPermission.params` | { `required`: readonly [``"service"``]  } |
| `mobile: resetPermission.params.required` | readonly [``"service"``] |
| `mobile: resetSimulatedLocation` | { `command`: ``"mobileResetSimulatedLocation"`` = 'mobileResetSimulatedLocation' } |
| `mobile: resetSimulatedLocation.command` | ``"mobileResetSimulatedLocation"`` |
| `mobile: rotateElement` | { `command`: ``"mobileRotateElement"`` = 'mobileRotateElement'; `params`: { `required`: readonly [``"elementId"``, ``"rotation"``, ``"velocity"``]  }  } |
| `mobile: rotateElement.command` | ``"mobileRotateElement"`` |
| `mobile: rotateElement.params` | { `required`: readonly [``"elementId"``, ``"rotation"``, ``"velocity"``]  } |
| `mobile: rotateElement.params.required` | readonly [``"elementId"``, ``"rotation"``, ``"velocity"``] |
| `mobile: runXCTest` | { `command`: ``"mobileRunXCTest"`` = 'mobileRunXCTest'; `params`: { `optional`: readonly [``"args"``, ``"testType"``, ``"env"``, ``"timeout"``] ; `required`: readonly [``"testRunnerBundleId"``, ``"appUnderTestBundleId"``, ``"xctestBundleId"``]  }  } |
| `mobile: runXCTest.command` | ``"mobileRunXCTest"`` |
| `mobile: runXCTest.params` | { `optional`: readonly [``"args"``, ``"testType"``, ``"env"``, ``"timeout"``] ; `required`: readonly [``"testRunnerBundleId"``, ``"appUnderTestBundleId"``, ``"xctestBundleId"``]  } |
| `mobile: runXCTest.params.optional` | readonly [``"args"``, ``"testType"``, ``"env"``, ``"timeout"``] |
| `mobile: runXCTest.params.required` | readonly [``"testRunnerBundleId"``, ``"appUnderTestBundleId"``, ``"xctestBundleId"``] |
| `mobile: scroll` | { `command`: ``"mobileScroll"`` = 'mobileScroll'; `params`: { `optional`: readonly [``"name"``, ``"direction"``, ``"predicateString"``, ``"toVisible"``, ``"distance"``, ``"elementId"``]  }  } |
| `mobile: scroll.command` | ``"mobileScroll"`` |
| `mobile: scroll.params` | { `optional`: readonly [``"name"``, ``"direction"``, ``"predicateString"``, ``"toVisible"``, ``"distance"``, ``"elementId"``]  } |
| `mobile: scroll.params.optional` | readonly [``"name"``, ``"direction"``, ``"predicateString"``, ``"toVisible"``, ``"distance"``, ``"elementId"``] |
| `mobile: scrollToElement` | { `command`: ``"mobileScrollToElement"`` = 'mobileScrollToElement'; `params`: { `required`: readonly [``"elementId"``]  }  } |
| `mobile: scrollToElement.command` | ``"mobileScrollToElement"`` |
| `mobile: scrollToElement.params` | { `required`: readonly [``"elementId"``]  } |
| `mobile: scrollToElement.params.required` | readonly [``"elementId"``] |
| `mobile: selectPickerWheelValue` | { `command`: ``"mobileSelectPickerWheelValue"`` = 'mobileSelectPickerWheelValue'; `params`: { `optional`: readonly [``"offset"``] ; `required`: readonly [``"elementId"``, ``"order"``]  }  } |
| `mobile: selectPickerWheelValue.command` | ``"mobileSelectPickerWheelValue"`` |
| `mobile: selectPickerWheelValue.params` | { `optional`: readonly [``"offset"``] ; `required`: readonly [``"elementId"``, ``"order"``]  } |
| `mobile: selectPickerWheelValue.params.optional` | readonly [``"offset"``] |
| `mobile: selectPickerWheelValue.params.required` | readonly [``"elementId"``, ``"order"``] |
| `mobile: sendBiometricMatch` | { `command`: ``"mobileSendBiometricMatch"`` = 'mobileSendBiometricMatch'; `params`: { `optional`: readonly [``"type"``, ``"match"``]  }  } |
| `mobile: sendBiometricMatch.command` | ``"mobileSendBiometricMatch"`` |
| `mobile: sendBiometricMatch.params` | { `optional`: readonly [``"type"``, ``"match"``]  } |
| `mobile: sendBiometricMatch.params.optional` | readonly [``"type"``, ``"match"``] |
| `mobile: setAppearance` | { `command`: ``"mobileSetAppearance"`` = 'mobileSetAppearance'; `params`: { `required`: readonly [``"style"``]  }  } |
| `mobile: setAppearance.command` | ``"mobileSetAppearance"`` |
| `mobile: setAppearance.params` | { `required`: readonly [``"style"``]  } |
| `mobile: setAppearance.params.required` | readonly [``"style"``] |
| `mobile: setPasteboard` | { `command`: ``"mobileSetPasteboard"`` = 'mobileSetPasteboard'; `params`: { `optional`: readonly [``"encoding"``] ; `required`: readonly [``"content"``]  }  } |
| `mobile: setPasteboard.command` | ``"mobileSetPasteboard"`` |
| `mobile: setPasteboard.params` | { `optional`: readonly [``"encoding"``] ; `required`: readonly [``"content"``]  } |
| `mobile: setPasteboard.params.optional` | readonly [``"encoding"``] |
| `mobile: setPasteboard.params.required` | readonly [``"content"``] |
| `mobile: setPermission` | { `command`: ``"mobileSetPermissions"`` = 'mobileSetPermissions'; `params`: { `required`: readonly [``"access"``, ``"bundleId"``]  }  } |
| `mobile: setPermission.command` | ``"mobileSetPermissions"`` |
| `mobile: setPermission.params` | { `required`: readonly [``"access"``, ``"bundleId"``]  } |
| `mobile: setPermission.params.required` | readonly [``"access"``, ``"bundleId"``] |
| `mobile: setSimulatedLocation` | { `command`: ``"mobileSetSimulatedLocation"`` = 'mobileSetSimulatedLocation'; `params`: { `required`: readonly [``"latitude"``, ``"longitude"``]  }  } |
| `mobile: setSimulatedLocation.command` | ``"mobileSetSimulatedLocation"`` |
| `mobile: setSimulatedLocation.params` | { `required`: readonly [``"latitude"``, ``"longitude"``]  } |
| `mobile: setSimulatedLocation.params.required` | readonly [``"latitude"``, ``"longitude"``] |
| `mobile: shake` | { `command`: ``"mobileShake"`` = 'mobileShake' } |
| `mobile: shake.command` | ``"mobileShake"`` |
| `mobile: siriCommand` | { `command`: ``"mobileSiriCommand"`` = 'mobileSiriCommand'; `params`: { `required`: readonly [``"text"``]  }  } |
| `mobile: siriCommand.command` | ``"mobileSiriCommand"`` |
| `mobile: siriCommand.params` | { `required`: readonly [``"text"``]  } |
| `mobile: siriCommand.params.required` | readonly [``"text"``] |
| `mobile: source` | { `command`: ``"mobileGetSource"`` = 'mobileGetSource'; `params`: { `optional`: readonly [``"format"``, ``"excludedAttributes"``]  }  } |
| `mobile: source.command` | ``"mobileGetSource"`` |
| `mobile: source.params` | { `optional`: readonly [``"format"``, ``"excludedAttributes"``]  } |
| `mobile: source.params.optional` | readonly [``"format"``, ``"excludedAttributes"``] |
| `mobile: startAudioRecording` | { `command`: ``"startAudioRecording"`` = 'startAudioRecording'; `params`: { `optional`: readonly [``"timeLimit"``, ``"audioCodec"``, ``"audioBitrate"``, ``"audioChannels"``, ``"audioRate"``, ``"forceRestart"``] ; `required`: readonly [``"audioInput"``]  }  } |
| `mobile: startAudioRecording.command` | ``"startAudioRecording"`` |
| `mobile: startAudioRecording.params` | { `optional`: readonly [``"timeLimit"``, ``"audioCodec"``, ``"audioBitrate"``, ``"audioChannels"``, ``"audioRate"``, ``"forceRestart"``] ; `required`: readonly [``"audioInput"``]  } |
| `mobile: startAudioRecording.params.optional` | readonly [``"timeLimit"``, ``"audioCodec"``, ``"audioBitrate"``, ``"audioChannels"``, ``"audioRate"``, ``"forceRestart"``] |
| `mobile: startAudioRecording.params.required` | readonly [``"audioInput"``] |
| `mobile: startLogsBroadcast` | { `command`: ``"mobileStartLogsBroadcast"`` = 'mobileStartLogsBroadcast' } |
| `mobile: startLogsBroadcast.command` | ``"mobileStartLogsBroadcast"`` |
| `mobile: startPcap` | { `command`: ``"mobileStartPcap"`` = 'mobileStartPcap'; `params`: { `optional`: readonly [``"timeLimitSec"``, ``"forceRestart"``]  }  } |
| `mobile: startPcap.command` | ``"mobileStartPcap"`` |
| `mobile: startPcap.params` | { `optional`: readonly [``"timeLimitSec"``, ``"forceRestart"``]  } |
| `mobile: startPcap.params.optional` | readonly [``"timeLimitSec"``, ``"forceRestart"``] |
| `mobile: startPerfRecord` | { `command`: ``"mobileStartPerfRecord"`` = 'mobileStartPerfRecord'; `params`: { `optional`: readonly [``"timeout"``, ``"profileName"``, ``"pid"``]  }  } |
| `mobile: startPerfRecord.command` | ``"mobileStartPerfRecord"`` |
| `mobile: startPerfRecord.params` | { `optional`: readonly [``"timeout"``, ``"profileName"``, ``"pid"``]  } |
| `mobile: startPerfRecord.params.optional` | readonly [``"timeout"``, ``"profileName"``, ``"pid"``] |
| `mobile: stopAudioRecording` | { `command`: ``"stopAudioRecording"`` = 'stopAudioRecording' } |
| `mobile: stopAudioRecording.command` | ``"stopAudioRecording"`` |
| `mobile: stopLogsBroadcast` | { `command`: ``"mobileStopLogsBroadcast"`` = 'mobileStopLogsBroadcast' } |
| `mobile: stopLogsBroadcast.command` | ``"mobileStopLogsBroadcast"`` |
| `mobile: stopPcap` | { `command`: ``"mobileStopPcap"`` = 'mobileStopPcap' } |
| `mobile: stopPcap.command` | ``"mobileStopPcap"`` |
| `mobile: stopPerfRecord` | { `command`: ``"mobileStopPerfRecord"`` = 'mobileStopPerfRecord'; `params`: { `optional`: readonly [``"remotePath"``, ``"user"``, ``"pass"``, ``"method"``, ``"profileName"``, ``"headers"``, ``"fileFieldName"``, ``"formFields"``]  }  } |
| `mobile: stopPerfRecord.command` | ``"mobileStopPerfRecord"`` |
| `mobile: stopPerfRecord.params` | { `optional`: readonly [``"remotePath"``, ``"user"``, ``"pass"``, ``"method"``, ``"profileName"``, ``"headers"``, ``"fileFieldName"``, ``"formFields"``]  } |
| `mobile: stopPerfRecord.params.optional` | readonly [``"remotePath"``, ``"user"``, ``"pass"``, ``"method"``, ``"profileName"``, ``"headers"``, ``"fileFieldName"``, ``"formFields"``] |
| `mobile: swipe` | { `command`: ``"mobileSwipe"`` = 'mobileSwipe'; `params`: { `optional`: readonly [``"velocity"``, ``"elementId"``] ; `required`: readonly [``"direction"``]  }  } |
| `mobile: swipe.command` | ``"mobileSwipe"`` |
| `mobile: swipe.params` | { `optional`: readonly [``"velocity"``, ``"elementId"``] ; `required`: readonly [``"direction"``]  } |
| `mobile: swipe.params.optional` | readonly [``"velocity"``, ``"elementId"``] |
| `mobile: swipe.params.required` | readonly [``"direction"``] |
| `mobile: tap` | { `command`: ``"mobileTap"`` = 'mobileTap'; `params`: { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"x"``, ``"y"``]  }  } |
| `mobile: tap.command` | ``"mobileTap"`` |
| `mobile: tap.params` | { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"x"``, ``"y"``]  } |
| `mobile: tap.params.optional` | readonly [``"elementId"``] |
| `mobile: tap.params.required` | readonly [``"x"``, ``"y"``] |
| `mobile: tapWithNumberOfTaps` | { `command`: ``"mobileTapWithNumberOfTaps"`` = 'mobileTapWithNumberOfTaps'; `params`: { `required`: readonly [``"elementId"``, ``"numberOfTouches"``, ``"numberOfTaps"``]  }  } |
| `mobile: tapWithNumberOfTaps.command` | ``"mobileTapWithNumberOfTaps"`` |
| `mobile: tapWithNumberOfTaps.params` | { `required`: readonly [``"elementId"``, ``"numberOfTouches"``, ``"numberOfTaps"``]  } |
| `mobile: tapWithNumberOfTaps.params.required` | readonly [``"elementId"``, ``"numberOfTouches"``, ``"numberOfTaps"``] |
| `mobile: terminateApp` | { `command`: ``"mobileTerminateApp"`` = 'mobileTerminateApp'; `params`: { `required`: readonly [``"bundleId"``]  }  } |
| `mobile: terminateApp.command` | ``"mobileTerminateApp"`` |
| `mobile: terminateApp.params` | { `required`: readonly [``"bundleId"``]  } |
| `mobile: terminateApp.params.required` | readonly [``"bundleId"``] |
| `mobile: touchAndHold` | { `command`: ``"mobileTouchAndHold"`` = 'mobileTouchAndHold'; `params`: { `optional`: readonly [``"x"``, ``"y"``, ``"elementId"``] ; `required`: readonly [``"duration"``]  }  } |
| `mobile: touchAndHold.command` | ``"mobileTouchAndHold"`` |
| `mobile: touchAndHold.params` | { `optional`: readonly [``"x"``, ``"y"``, ``"elementId"``] ; `required`: readonly [``"duration"``]  } |
| `mobile: touchAndHold.params.optional` | readonly [``"x"``, ``"y"``, ``"elementId"``] |
| `mobile: touchAndHold.params.required` | readonly [``"duration"``] |
| `mobile: twoFingerTap` | { `command`: ``"mobileTwoFingerTap"`` = 'mobileTwoFingerTap'; `params`: { `optional`: readonly [``"elementId"``]  }  } |
| `mobile: twoFingerTap.command` | ``"mobileTwoFingerTap"`` |
| `mobile: twoFingerTap.params` | { `optional`: readonly [``"elementId"``]  } |
| `mobile: twoFingerTap.params.optional` | readonly [``"elementId"``] |
| `mobile: unlock` | { `command`: ``"unlock"`` = 'unlock' } |
| `mobile: unlock.command` | ``"unlock"`` |
| `mobile: updateSafariPreferences` | { `command`: ``"mobileUpdateSafariPreferences"`` = 'mobileUpdateSafariPreferences'; `params`: { `required`: readonly [``"preferences"``]  }  } |
| `mobile: updateSafariPreferences.command` | ``"mobileUpdateSafariPreferences"`` |
| `mobile: updateSafariPreferences.params` | { `required`: readonly [``"preferences"``]  } |
| `mobile: updateSafariPreferences.params.required` | readonly [``"preferences"``] |
| `mobile: viewportRect` | { `command`: ``"getViewportRect"`` = 'getViewportRect' } |
| `mobile: viewportRect.command` | ``"getViewportRect"`` |
| `mobile: viewportScreenshot` | { `command`: ``"getViewportScreenshot"`` = 'getViewportScreenshot' } |
| `mobile: viewportScreenshot.command` | ``"getViewportScreenshot"`` |

#### Defined in

[lib/driver.js:185](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L185)

___

### newMethodMap

▪ `Static` **newMethodMap**: `Object` = `newMethodMap`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `/session/:sessionId/appium/app/background` | { `POST`: { `command`: ``"background"`` = 'background'; `payloadParams`: { `required`: readonly [``"seconds"``]  }  }  } |
| `/session/:sessionId/appium/app/background.POST` | { `command`: ``"background"`` = 'background'; `payloadParams`: { `required`: readonly [``"seconds"``]  }  } |
| `/session/:sessionId/appium/app/background.POST.command` | ``"background"`` |
| `/session/:sessionId/appium/app/background.POST.payloadParams` | { `required`: readonly [``"seconds"``]  } |
| `/session/:sessionId/appium/app/background.POST.payloadParams.required` | readonly [``"seconds"``] |
| `/session/:sessionId/appium/app/close` | { `POST`: { `command`: ``"closeApp"`` = 'closeApp' }  } |
| `/session/:sessionId/appium/app/close.POST` | { `command`: ``"closeApp"`` = 'closeApp' } |
| `/session/:sessionId/appium/app/close.POST.command` | ``"closeApp"`` |
| `/session/:sessionId/appium/app/launch` | { `POST`: { `command`: ``"launchApp"`` = 'launchApp' }  } |
| `/session/:sessionId/appium/app/launch.POST` | { `command`: ``"launchApp"`` = 'launchApp' } |
| `/session/:sessionId/appium/app/launch.POST.command` | ``"launchApp"`` |
| `/session/:sessionId/appium/app/reset` | { `POST`: { `command`: ``"reset"`` = 'reset' }  } |
| `/session/:sessionId/appium/app/reset.POST` | { `command`: ``"reset"`` = 'reset' } |
| `/session/:sessionId/appium/app/reset.POST.command` | ``"reset"`` |
| `/session/:sessionId/appium/app/strings` | { `POST`: { `command`: ``"getStrings"`` = 'getStrings'; `payloadParams`: { `optional`: readonly [``"language"``, ``"stringFile"``]  }  }  } |
| `/session/:sessionId/appium/app/strings.POST` | { `command`: ``"getStrings"`` = 'getStrings'; `payloadParams`: { `optional`: readonly [``"language"``, ``"stringFile"``]  }  } |
| `/session/:sessionId/appium/app/strings.POST.command` | ``"getStrings"`` |
| `/session/:sessionId/appium/app/strings.POST.payloadParams` | { `optional`: readonly [``"language"``, ``"stringFile"``]  } |
| `/session/:sessionId/appium/app/strings.POST.payloadParams.optional` | readonly [``"language"``, ``"stringFile"``] |
| `/session/:sessionId/appium/device/app_state` | { `POST`: { `command`: ``"queryAppState"`` = 'queryAppState'; `payloadParams`: { `required`: readonly [readonly [``"appId"``], readonly [``"bundleId"``]]  }  }  } |
| `/session/:sessionId/appium/device/app_state.POST` | { `command`: ``"queryAppState"`` = 'queryAppState'; `payloadParams`: { `required`: readonly [readonly [``"appId"``], readonly [``"bundleId"``]]  }  } |
| `/session/:sessionId/appium/device/app_state.POST.command` | ``"queryAppState"`` |
| `/session/:sessionId/appium/device/app_state.POST.payloadParams` | { `required`: readonly [readonly [``"appId"``], readonly [``"bundleId"``]]  } |
| `/session/:sessionId/appium/device/app_state.POST.payloadParams.required` | readonly [readonly [``"appId"``], readonly [``"bundleId"``]] |
| `/session/:sessionId/appium/device/get_clipboard` | { `POST`: { `command`: ``"getClipboard"`` = 'getClipboard'; `payloadParams`: { `optional`: readonly [``"contentType"``]  }  }  } |
| `/session/:sessionId/appium/device/get_clipboard.POST` | { `command`: ``"getClipboard"`` = 'getClipboard'; `payloadParams`: { `optional`: readonly [``"contentType"``]  }  } |
| `/session/:sessionId/appium/device/get_clipboard.POST.command` | ``"getClipboard"`` |
| `/session/:sessionId/appium/device/get_clipboard.POST.payloadParams` | { `optional`: readonly [``"contentType"``]  } |
| `/session/:sessionId/appium/device/get_clipboard.POST.payloadParams.optional` | readonly [``"contentType"``] |
| `/session/:sessionId/appium/device/is_locked` | { `POST`: { `command`: ``"isLocked"`` = 'isLocked' }  } |
| `/session/:sessionId/appium/device/is_locked.POST` | { `command`: ``"isLocked"`` = 'isLocked' } |
| `/session/:sessionId/appium/device/is_locked.POST.command` | ``"isLocked"`` |
| `/session/:sessionId/appium/device/lock` | { `POST`: { `command`: ``"lock"`` = 'lock'; `payloadParams`: { `optional`: readonly [``"seconds"``]  }  }  } |
| `/session/:sessionId/appium/device/lock.POST` | { `command`: ``"lock"`` = 'lock'; `payloadParams`: { `optional`: readonly [``"seconds"``]  }  } |
| `/session/:sessionId/appium/device/lock.POST.command` | ``"lock"`` |
| `/session/:sessionId/appium/device/lock.POST.payloadParams` | { `optional`: readonly [``"seconds"``]  } |
| `/session/:sessionId/appium/device/lock.POST.payloadParams.optional` | readonly [``"seconds"``] |
| `/session/:sessionId/appium/device/set_clipboard` | { `POST`: { `command`: ``"setClipboard"`` = 'setClipboard'; `payloadParams`: { `optional`: readonly [``"contentType"``, ``"label"``] ; `required`: readonly [``"content"``]  }  }  } |
| `/session/:sessionId/appium/device/set_clipboard.POST` | { `command`: ``"setClipboard"`` = 'setClipboard'; `payloadParams`: { `optional`: readonly [``"contentType"``, ``"label"``] ; `required`: readonly [``"content"``]  }  } |
| `/session/:sessionId/appium/device/set_clipboard.POST.command` | ``"setClipboard"`` |
| `/session/:sessionId/appium/device/set_clipboard.POST.payloadParams` | { `optional`: readonly [``"contentType"``, ``"label"``] ; `required`: readonly [``"content"``]  } |
| `/session/:sessionId/appium/device/set_clipboard.POST.payloadParams.optional` | readonly [``"contentType"``, ``"label"``] |
| `/session/:sessionId/appium/device/set_clipboard.POST.payloadParams.required` | readonly [``"content"``] |
| `/session/:sessionId/appium/device/shake` | { `POST`: { `command`: ``"mobileShake"`` = 'mobileShake' }  } |
| `/session/:sessionId/appium/device/shake.POST` | { `command`: ``"mobileShake"`` = 'mobileShake' } |
| `/session/:sessionId/appium/device/shake.POST.command` | ``"mobileShake"`` |
| `/session/:sessionId/appium/device/unlock` | { `POST`: { `command`: ``"unlock"`` = 'unlock' }  } |
| `/session/:sessionId/appium/device/unlock.POST` | { `command`: ``"unlock"`` = 'unlock' } |
| `/session/:sessionId/appium/device/unlock.POST.command` | ``"unlock"`` |
| `/session/:sessionId/appium/element/:elementId/value` | { `POST`: { `command`: ``"setValueImmediate"`` = 'setValueImmediate'; `payloadParams`: { `required`: readonly [``"text"``]  }  }  } |
| `/session/:sessionId/appium/element/:elementId/value.POST` | { `command`: ``"setValueImmediate"`` = 'setValueImmediate'; `payloadParams`: { `required`: readonly [``"text"``]  }  } |
| `/session/:sessionId/appium/element/:elementId/value.POST.command` | ``"setValueImmediate"`` |
| `/session/:sessionId/appium/element/:elementId/value.POST.payloadParams` | { `required`: readonly [``"text"``]  } |
| `/session/:sessionId/appium/element/:elementId/value.POST.payloadParams.required` | readonly [``"text"``] |
| `/session/:sessionId/appium/receive_async_response` | { `POST`: { `command`: ``"receiveAsyncResponse"`` = 'receiveAsyncResponse'; `payloadParams`: { `required`: readonly [``"response"``]  }  }  } |
| `/session/:sessionId/appium/receive_async_response.POST` | { `command`: ``"receiveAsyncResponse"`` = 'receiveAsyncResponse'; `payloadParams`: { `required`: readonly [``"response"``]  }  } |
| `/session/:sessionId/appium/receive_async_response.POST.command` | ``"receiveAsyncResponse"`` |
| `/session/:sessionId/appium/receive_async_response.POST.payloadParams` | { `required`: readonly [``"response"``]  } |
| `/session/:sessionId/appium/receive_async_response.POST.payloadParams.required` | readonly [``"response"``] |
| `/session/:sessionId/appium/simulator/toggle_touch_id_enrollment` | { `POST`: { `command`: ``"toggleEnrollTouchId"`` = 'toggleEnrollTouchId'; `payloadParams`: { `optional`: readonly [``"enabled"``]  }  }  } |
| `/session/:sessionId/appium/simulator/toggle_touch_id_enrollment.POST` | { `command`: ``"toggleEnrollTouchId"`` = 'toggleEnrollTouchId'; `payloadParams`: { `optional`: readonly [``"enabled"``]  }  } |
| `/session/:sessionId/appium/simulator/toggle_touch_id_enrollment.POST.command` | ``"toggleEnrollTouchId"`` |
| `/session/:sessionId/appium/simulator/toggle_touch_id_enrollment.POST.payloadParams` | { `optional`: readonly [``"enabled"``]  } |
| `/session/:sessionId/appium/simulator/toggle_touch_id_enrollment.POST.payloadParams.optional` | readonly [``"enabled"``] |
| `/session/:sessionId/appium/simulator/touch_id` | { `POST`: { `command`: ``"touchId"`` = 'touchId'; `payloadParams`: { `required`: readonly [``"match"``]  }  }  } |
| `/session/:sessionId/appium/simulator/touch_id.POST` | { `command`: ``"touchId"`` = 'touchId'; `payloadParams`: { `required`: readonly [``"match"``]  }  } |
| `/session/:sessionId/appium/simulator/touch_id.POST.command` | ``"touchId"`` |
| `/session/:sessionId/appium/simulator/touch_id.POST.payloadParams` | { `required`: readonly [``"match"``]  } |
| `/session/:sessionId/appium/simulator/touch_id.POST.payloadParams.required` | readonly [``"match"``] |
| `/session/:sessionId/appium/start_recording_screen` | { `POST`: { `command`: ``"startRecordingScreen"`` = 'startRecordingScreen'; `payloadParams`: { `optional`: readonly [``"options"``]  }  }  } |
| `/session/:sessionId/appium/start_recording_screen.POST` | { `command`: ``"startRecordingScreen"`` = 'startRecordingScreen'; `payloadParams`: { `optional`: readonly [``"options"``]  }  } |
| `/session/:sessionId/appium/start_recording_screen.POST.command` | ``"startRecordingScreen"`` |
| `/session/:sessionId/appium/start_recording_screen.POST.payloadParams` | { `optional`: readonly [``"options"``]  } |
| `/session/:sessionId/appium/start_recording_screen.POST.payloadParams.optional` | readonly [``"options"``] |
| `/session/:sessionId/appium/stop_recording_screen` | { `POST`: { `command`: ``"stopRecordingScreen"`` = 'stopRecordingScreen'; `payloadParams`: { `optional`: readonly [``"options"``]  }  }  } |
| `/session/:sessionId/appium/stop_recording_screen.POST` | { `command`: ``"stopRecordingScreen"`` = 'stopRecordingScreen'; `payloadParams`: { `optional`: readonly [``"options"``]  }  } |
| `/session/:sessionId/appium/stop_recording_screen.POST.command` | ``"stopRecordingScreen"`` |
| `/session/:sessionId/appium/stop_recording_screen.POST.payloadParams` | { `optional`: readonly [``"options"``]  } |
| `/session/:sessionId/appium/stop_recording_screen.POST.payloadParams.optional` | readonly [``"options"``] |
| `/session/:sessionId/element/:elementId/location` | { `GET`: { `command`: ``"getLocation"`` = 'getLocation' }  } |
| `/session/:sessionId/element/:elementId/location.GET` | { `command`: ``"getLocation"`` = 'getLocation' } |
| `/session/:sessionId/element/:elementId/location.GET.command` | ``"getLocation"`` |
| `/session/:sessionId/element/:elementId/location_in_view` | { `GET`: { `command`: ``"getLocationInView"`` = 'getLocationInView' }  } |
| `/session/:sessionId/element/:elementId/location_in_view.GET` | { `command`: ``"getLocationInView"`` = 'getLocationInView' } |
| `/session/:sessionId/element/:elementId/location_in_view.GET.command` | ``"getLocationInView"`` |
| `/session/:sessionId/element/:elementId/size` | { `GET`: { `command`: ``"getSize"`` = 'getSize' }  } |
| `/session/:sessionId/element/:elementId/size.GET` | { `command`: ``"getSize"`` = 'getSize' } |
| `/session/:sessionId/element/:elementId/size.GET.command` | ``"getSize"`` |
| `/session/:sessionId/element/:elementId/submit` | { `POST`: { `command`: ``"submit"`` = 'submit' }  } |
| `/session/:sessionId/element/:elementId/submit.POST` | { `command`: ``"submit"`` = 'submit' } |
| `/session/:sessionId/element/:elementId/submit.POST.command` | ``"submit"`` |
| `/session/:sessionId/keys` | { `POST`: { `command`: ``"keys"`` = 'keys'; `payloadParams`: { `required`: readonly [``"value"``]  }  }  } |
| `/session/:sessionId/keys.POST` | { `command`: ``"keys"`` = 'keys'; `payloadParams`: { `required`: readonly [``"value"``]  }  } |
| `/session/:sessionId/keys.POST.command` | ``"keys"`` |
| `/session/:sessionId/keys.POST.payloadParams` | { `required`: readonly [``"value"``]  } |
| `/session/:sessionId/keys.POST.payloadParams.required` | readonly [``"value"``] |
| `/session/:sessionId/moveto` | { `POST`: { `command`: ``"moveTo"`` = 'moveTo'; `payloadParams`: { `optional`: readonly [``"element"``, ``"xoffset"``, ``"yoffset"``]  }  }  } |
| `/session/:sessionId/moveto.POST` | { `command`: ``"moveTo"`` = 'moveTo'; `payloadParams`: { `optional`: readonly [``"element"``, ``"xoffset"``, ``"yoffset"``]  }  } |
| `/session/:sessionId/moveto.POST.command` | ``"moveTo"`` |
| `/session/:sessionId/moveto.POST.payloadParams` | { `optional`: readonly [``"element"``, ``"xoffset"``, ``"yoffset"``]  } |
| `/session/:sessionId/moveto.POST.payloadParams.optional` | readonly [``"element"``, ``"xoffset"``, ``"yoffset"``] |
| `/session/:sessionId/timeouts/async_script` | { `POST`: { `command`: ``"asyncScriptTimeout"`` = 'asyncScriptTimeout'; `payloadParams`: { `required`: readonly [``"ms"``]  }  }  } |
| `/session/:sessionId/timeouts/async_script.POST` | { `command`: ``"asyncScriptTimeout"`` = 'asyncScriptTimeout'; `payloadParams`: { `required`: readonly [``"ms"``]  }  } |
| `/session/:sessionId/timeouts/async_script.POST.command` | ``"asyncScriptTimeout"`` |
| `/session/:sessionId/timeouts/async_script.POST.payloadParams` | { `required`: readonly [``"ms"``]  } |
| `/session/:sessionId/timeouts/async_script.POST.payloadParams.required` | readonly [``"ms"``] |
| `/session/:sessionId/timeouts/implicit_wait` | { `POST`: { `command`: ``"implicitWait"`` = 'implicitWait'; `payloadParams`: { `required`: readonly [``"ms"``]  }  }  } |
| `/session/:sessionId/timeouts/implicit_wait.POST` | { `command`: ``"implicitWait"`` = 'implicitWait'; `payloadParams`: { `required`: readonly [``"ms"``]  }  } |
| `/session/:sessionId/timeouts/implicit_wait.POST.command` | ``"implicitWait"`` |
| `/session/:sessionId/timeouts/implicit_wait.POST.payloadParams` | { `required`: readonly [``"ms"``]  } |
| `/session/:sessionId/timeouts/implicit_wait.POST.payloadParams.required` | readonly [``"ms"``] |
| `/session/:sessionId/touch/click` | { `POST`: { `command`: ``"click"`` = 'click'; `payloadParams`: { `required`: readonly [``"element"``]  }  }  } |
| `/session/:sessionId/touch/click.POST` | { `command`: ``"click"`` = 'click'; `payloadParams`: { `required`: readonly [``"element"``]  }  } |
| `/session/:sessionId/touch/click.POST.command` | ``"click"`` |
| `/session/:sessionId/touch/click.POST.payloadParams` | { `required`: readonly [``"element"``]  } |
| `/session/:sessionId/touch/click.POST.payloadParams.required` | readonly [``"element"``] |
| `/session/:sessionId/touch/multi/perform` | { `POST`: { `command`: ``"performMultiAction"`` = 'performMultiAction'; `payloadParams`: { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"actions"``]  }  }  } |
| `/session/:sessionId/touch/multi/perform.POST` | { `command`: ``"performMultiAction"`` = 'performMultiAction'; `payloadParams`: { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"actions"``]  }  } |
| `/session/:sessionId/touch/multi/perform.POST.command` | ``"performMultiAction"`` |
| `/session/:sessionId/touch/multi/perform.POST.payloadParams` | { `optional`: readonly [``"elementId"``] ; `required`: readonly [``"actions"``]  } |
| `/session/:sessionId/touch/multi/perform.POST.payloadParams.optional` | readonly [``"elementId"``] |
| `/session/:sessionId/touch/multi/perform.POST.payloadParams.required` | readonly [``"actions"``] |
| `/session/:sessionId/touch/perform` | { `POST`: { `command`: ``"performTouch"`` = 'performTouch'; `payloadParams`: { `required`: readonly [``"actions"``] ; `wrap`: ``"actions"`` = 'actions' }  }  } |
| `/session/:sessionId/touch/perform.POST` | { `command`: ``"performTouch"`` = 'performTouch'; `payloadParams`: { `required`: readonly [``"actions"``] ; `wrap`: ``"actions"`` = 'actions' }  } |
| `/session/:sessionId/touch/perform.POST.command` | ``"performTouch"`` |
| `/session/:sessionId/touch/perform.POST.payloadParams` | { `required`: readonly [``"actions"``] ; `wrap`: ``"actions"`` = 'actions' } |
| `/session/:sessionId/touch/perform.POST.payloadParams.required` | readonly [``"actions"``] |
| `/session/:sessionId/touch/perform.POST.payloadParams.wrap` | ``"actions"`` |
| `/session/:sessionId/window/:windowhandle/size` | { `GET`: { `command`: ``"getWindowSize"`` = 'getWindowSize' }  } |
| `/session/:sessionId/window/:windowhandle/size.GET` | { `command`: ``"getWindowSize"`` = 'getWindowSize' } |
| `/session/:sessionId/window/:windowhandle/size.GET.command` | ``"getWindowSize"`` |

#### Defined in

[lib/driver.js:183](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L183)

## Mobile Web Only

### deleteCookie

• **deleteCookie**: (...`this`: `any`, `cookieName`: `any`) => `Promise`<`void`\> = `commands.webExtensions.deleteCookie`

#### Type declaration

▸ (`...this`, `cookieName`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `cookieName` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2223](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2223)

___

### deleteCookies

• **deleteCookies**: (...`this`: `any`) => `Promise`<`void`\> = `commands.webExtensions.deleteCookies`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2224](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2224)

___

### executeAsync

• **executeAsync**: (...`this`: `any`, `script`: `any`, `args`: `any`) => `Promise`<`any`\> = `commands.executeExtensions.executeAsync`

#### Type declaration

▸ (`...this`, `script`, `args`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `script` | `any` |
| `args` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1984](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1984)

___

### getCookies

• **getCookies**: (...`this`: `any`) => `Promise`<`any`\> = `commands.webExtensions.getCookies`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2221](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2221)

___

### getCssProperty

• **getCssProperty**: (...`this`: `any`, `propertyName`: `any`, `el`: `any`) => `Promise`<`any`\> = `commands.webExtensions.getCssProperty`

#### Type declaration

▸ (`...this`, `propertyName`, `el`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `propertyName` | `any` |
| `el` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2216](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2216)

___

### getUrl

• **getUrl**: (...`this`: `any`) => `Promise`<`any`\> = `commands.webExtensions.getUrl`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2219](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2219)

___

### refresh

• **refresh**: (...`this`: `any`) => `Promise`<`void`\> = `commands.webExtensions.refresh`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2218](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2218)

___

### setCookie

• **setCookie**: (...`this`: `any`, `cookie`: `any`) => `Promise`<`void`\> = `commands.webExtensions.setCookie`

#### Type declaration

▸ (`...this`, `cookie`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `cookie` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2222](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2222)

___

### setFrame

• **setFrame**: (...`this`: `any`, `frame`: `any`) => `Promise`<`void`\> = `commands.webExtensions.setFrame`

#### Type declaration

▸ (`...this`, `frame`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `frame` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2215](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2215)

___

### submit

• **submit**: (...`this`: `any`, `el`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`void`\> = `commands.webExtensions.submit`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`void`\>

Submit the form an element is in

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `el` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> | the element ID |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2217](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2217)

___

### title

• **title**: (...`this`: `any`) => `Promise`<`any`\> = `commands.webExtensions.title`

#### Type declaration

▸ (`...this`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2220](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2220)

## Simulator Only

### mobileClearKeychains

• **mobileClearKeychains**: (...`this`: `any`) => `Promise`<`void`\> = `commands.keychainsExtensions.mobileClearKeychains`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Clears keychains on a simulated device.

**`Throws`**

If current device is not a Simulator or there was an error
while clearing keychains.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2079](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2079)

___

### mobileConfigureLocalization

• **mobileConfigureLocalization**: (...`this`: `any`, `keyboard?`: `KeyboardOptions`, `language?`: `LanguageOptions`, `locale?`: `LocaleOptions`) => `Promise`<`boolean`\> = `commands.localizationExtensions.mobileConfigureLocalization`

#### Type declaration

▸ (`...this`, `keyboard?`, `language?`, `locale?`): `Promise`<`boolean`\>

Change localization settings on the currently booted simulator

The changed settings are only applied for _newly started_ applications and activities.
Currently running applications will be unchanged. This means, for example, that the keyboard should be hidden and shown again in order to observe the changed layout, and curresponding apps must be restarted in order to observe their interface using the newly set locale/language.

The driver performs no strict checking of the arguments (such as locale names). Be aware that an incorrect or invalid string may cause unexpected behavior.

**`Throws`**

If there was a failure while setting the preferences

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `keyboard?` | `KeyboardOptions` | Keyboard options |
| `language?` | `LanguageOptions` | Language options |
| `locale?` | `LocaleOptions` | Locale options |

##### Returns

`Promise`<`boolean`\>

`true` if any of settings has been successfully changed

#### Defined in

[lib/driver.js:2093](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2093)

___

### mobileEnrollBiometric

• **mobileEnrollBiometric**: (...`this`: `any`, `isEnabled`: `boolean`) => `Promise`<`void`\> = `commands.biometricExtensions.mobileEnrollBiometric`

#### Type declaration

▸ (`...this?`, `isEnabled`): `Promise`<`void`\>

Enrolls biometric authentication on a simulated device.

**`Throws`**

If enrollment fails or the device is not a Simulator.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `true` | - |
| `isEnabled` | `boolean` | `undefined` | Whether to enable/disable biometric enrollment. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1897](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1897)

___

### mobileGetPasteboard

• **mobileGetPasteboard**: (...`this`: `any`, `encoding`: `string`) => `Promise`<`string`\> = `commands.pasteboardExtensions.mobileGetPasteboard`

#### Type declaration

▸ (`...this?`, `encoding`): `Promise`<`string`\>

Gets the Simulator's pasteboard content.

Does not work for real devices.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `'utf8'` | - |
| `encoding` | `string` | `undefined` | Expected encoding of returned string |

##### Returns

`Promise`<`string`\>

The pasteboard content string

#### Defined in

[lib/driver.js:2142](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2142)

___

### mobileGetPermission

• **mobileGetPermission**: (...`this`: `any`, `bundleId`: `string`, `service`: `PermissionService`) => `Promise`<`PermissionState`\> = `commands.permissionsExtensions.mobileGetPermission`

#### Type declaration

▸ (`...this`, `bundleId`, `service`): `Promise`<`PermissionState`\>

Gets application permission state on a simulated device.

**This method requires [WIX applesimutils](https://github.com/wix/AppleSimulatorUtils) to be installed on the Appium server host.**

**`Throws`**

If permission getting fails or the device is not a Simulator.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | Bundle identifier of the target application |
| `service` | `PermissionService` | Service name |

##### Returns

`Promise`<`PermissionState`\>

Either 'yes', 'no', 'unset' or 'limited'

#### Defined in

[lib/driver.js:2162](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2162)

___

### mobileIsBiometricEnrolled

• **mobileIsBiometricEnrolled**: (...`this`: `any`) => `Promise`<`boolean`\> = `commands.biometricExtensions.mobileIsBiometricEnrolled`

#### Type declaration

▸ (`...this`): `Promise`<`boolean`\>

Checks whether the biometric feature is currently enrolled on a simulated device.

**`Throws`**

If the detection fails or the device is not a Simulator.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`boolean`\>

`true` if biometric is enrolled.

#### Defined in

[lib/driver.js:1899](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1899)

___

### mobilePushNotification

• **mobilePushNotification**: (...`this`: `any`, `bundleId`: `string`, `payload`: `PushPayload`) => `Promise`<`any`\> = `commands.notificationsExtensions.mobilePushNotification`

#### Type declaration

▸ (`...this`, `bundleId`, `payload`): `Promise`<`any`\>

Simulates push notification delivery to a simulated device.

**Only "remote" push notifications are supported.** VoIP, Complication, File Provider, and other types are unsupported.

Supported in Xcode SDK 11.4+.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the target application |
| `payload` | `PushPayload` | Valid push payload. |

##### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:2134](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2134)

___

### mobileSendBiometricMatch

• **mobileSendBiometricMatch**: (...`this`: `any`, `type`: `BiometricFeature`, `match`: `boolean`) => `Promise`<`void`\> = `commands.biometricExtensions.mobileSendBiometricMatch`

#### Type declaration

▸ (`...this?`, `type?`, `match`): `Promise`<`void`\>

Emulates biometric match or non-match event on a simulated device.

The biometric feature is expected to be already enrolled via [`mobile: enrollBiometric`](appium_xcuitest_driver.XCUITestDriver.md#mobileenrollbiometric) before executing this.

**`Throws`**

If matching fails or the device is not a Simulator.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `'touchId'` | - |
| `type` | `BiometricFeature` | `true` | The biometric feature name. |
| `match` | `boolean` | `undefined` | If `true`, simulate biometic match. If `false`, simulate biometric non-match. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1898](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1898)

___

### mobileSetPasteboard

• **mobileSetPasteboard**: (...`this`: `any`, `content`: `string`, `encoding`: `string`) => `Promise`<`void`\> = `commands.pasteboardExtensions.mobileSetPasteboard`

#### Type declaration

▸ (`...this`, `content?`, `encoding`): `Promise`<`void`\>

Sets the Simulator's pasteboard content to the given value.

Does not work for real devices.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `content` | `string` | `'utf8'` | The content to set |
| `encoding` | `string` | `undefined` | The content's encoding |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2141](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2141)

___

### mobileSetPermissions

• **mobileSetPermissions**: (...`this`: `any`, `access`: `Record`<`Partial`<`AccessRule`\>, `PermissionState`\>, `bundleId`: `string`) => `Promise`<`void`\> = `commands.permissionsExtensions.mobileSetPermissions`

#### Type declaration

▸ (`...this`, `access`, `bundleId`): `Promise`<`void`\>

Set application permission state on Simulator.

**`Since`**

Xcode SDK 11.4

**`Throws`**

If permission setting fails or the device is not a Simulator.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `access` | `Record`<`Partial`<`AccessRule`\>, `PermissionState`\> | One or more access rules to set. |
| `bundleId` | `string` | Bundle identifier of the target application |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2163](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2163)

___

### mobileShake

• **mobileShake**: (...`this`: `any`) => `Promise`<`void`\> = `commands.gestureExtensions.mobileShake`

#### Type declaration

▸ (`...this`): `Promise`<`void`\>

Shake the device

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2046](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2046)

___

### mobileUpdateSafariPreferences

• **mobileUpdateSafariPreferences**: (...`this`: `any`, `preferences`: [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\>) => `Promise`<`void`\> = `commands.webExtensions.mobileUpdateSafariPreferences`

#### Type declaration

▸ (`...this`, `preferences`): `Promise`<`void`\>

Updates Mobile Safari preferences on an iOS Simulator

**`Throws`**

if run on a real device or if the preferences argument is invalid

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `preferences` | [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\> | An object containing Safari settings to be updated. The list of available setting names and their values can be retrieved by changing the corresponding Safari settings in the UI and then inspecting `Library/Preferences/com.apple.mobilesafari.plist` file inside of the `com.apple.mobilesafari` app container within the simulator filesystem. The full path to Mobile Safari's container can be retrieved by running `xcrun simctl get_app_container <sim_udid> com.apple.mobilesafari data`. Use the `xcrun simctl spawn <sim_udid> defaults read <path_to_plist>` command to print the plist content to the Terminal. |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2246](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2246)

## Real Device Only

### mobileKillApp

• **mobileKillApp**: (...`this`: `any`, `bundleId`: `string`) => `Promise`<`boolean`\> = `commands.appManagementExtensions.mobileKillApp`

#### Type declaration

▸ (`...this`, `bundleId`): `Promise`<`boolean`\>

Kill the given app on the real device under test by instruments service.

If the app is not running or kill failed, then nothing is done.

**`Remarks`**

`appium-xcuitest-driver` v4.4 does not require `py-ios-device` to be installed.

**`See`**

https://github.com/YueChen-C/py-ios-device

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `bundleId` | `string` | The bundle identifier of the application to be killed |

##### Returns

`Promise`<`boolean`\>

`true` if the app has been killed successfully; `false` otherwise

#### Defined in

[lib/driver.js:1865](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1865)

___

### mobileListApps

• **mobileListApps**: (`applicationType`: ``"User"`` \| ``"System"``) => `Promise`<`Record`<`string`, `any`\>[]\> = `commands.appManagementExtensions.mobileListApps`

#### Type declaration

▸ (`applicationType?`): `Promise`<`Record`<`string`, `any`\>[]\>

List applications installed on the real device under test

Read [Pushing/Pulling files](https://appium.io/docs/en/writing-running-appium/ios/ios-xctest-file-movement/) for more details.

**`Remarks`**

Having `UIFileSharingEnabled` set to `true` in the return app properties map means this app supports file upload/download in its `documents` container.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `applicationType` | ``"User"`` \| ``"System"`` | `'User'` | The type of applications to list. |

##### Returns

`Promise`<`Record`<`string`, `any`\>[]\>

A list of apps where each item is a mapping of bundle identifiers to maps of platform-specific app properties.

#### Defined in

[lib/driver.js:1873](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1873)

___

### mobileRemoveCertificate

• **mobileRemoveCertificate**: (`name`: `string`) => `Promise`<`string`\> = `commands.certificateExtensions.mobileRemoveCertificate`

#### Type declaration

▸ (`name`): `Promise`<`string`\>

Removes installed certificates.

This only works _if and only if_ `py-ios-device` is installed on the same machine Appium is running on.

**`See`**

https://github.com/YueChen-C/py-ios-device

**`Since`**

4.19.2

**`Throws`**

If attempting to remove certificates for a simulated device or if `py-ios-device` is not installed

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the profile |

##### Returns

`Promise`<`string`\>

Returns status acknowledgment status if
tht certificate is successfully removed or 'None' (basically just
forwards the original pyidevice output)

#### Defined in

[lib/driver.js:1906](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1906)

___

### startAudioRecording

• **startAudioRecording**: (...`this`: `any`, `audioInput`: `string` \| `number`, `timeLimit`: `string` \| `number`, `audioCodec`: `string`, `audioBitrate`: `string`, `audioChannels`: `string` \| `number`, `audioRate`: `string` \| `number`, `forceRestart`: `boolean`) => `Promise`<`void`\> = `commands.recordAudioExtensions.startAudioRecording`

#### Type declaration

▸ (`...this`, `audioInput?`, `timeLimit?`, `audioCodec?`, `audioBitrate?`, `audioChannels?`, `audioRate?`, `forceRestart`): `Promise`<`void`\>

Records the given hardware audio input and saves it into an `.mp4` file.

**To use this command, the `audio_record` security feature must be enabled _and_ [FFMpeg](https://ffmpeg.org/) must be installed on the Appium server.**

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `...this` | `any` | `undefined` | - |
| `audioInput` | `string` \| `number` | `180` | The name of the corresponding audio input device to use for the capture. The full list of capture devices could be shown by executing `ffmpeg -f avfoundation -list_devices true -i ""` |
| `timeLimit` | `string` \| `number` | `'aac'` | The maximum recording time, in seconds. |
| `audioCodec` | `string` | `'128k'` | The name of the audio codec. |
| `audioBitrate` | `string` | `2` | The bitrate of the resulting audio stream. |
| `audioChannels` | `string` \| `number` | `44100` | The count of audio channels in the resulting stream. Setting it to `1` will create a single channel (mono) audio stream. |
| `audioRate` | `string` \| `number` | `false` | The sampling rate of the resulting audio stream (in Hz). |
| `forceRestart` | `boolean` | `undefined` | Whether to restart audio capture process forcefully when `mobile: startRecordingAudio` is called (`true`) or ignore the call until the current audio recording is completed (`false`). |

##### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:2175](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2175)

## Native Only

### nativeClick

• **nativeClick**: (...`this`: `any`, `el`: `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\>) => `Promise`<`unknown`\> = `commands.gestureExtensions.nativeClick`

#### Type declaration

▸ (`...this`, `el`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...this` | `any` |
| `el` | `string` \| [`Element`](../interfaces/appium_types.Element.md)<`string`\> |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2052](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2052)

___

### performMultiAction

• **performMultiAction**: (...`this`: `any`, `actions`: `any`[]) => `Promise`<`unknown`\> = `commands.gestureExtensions.performMultiAction`

#### Type declaration

▸ (`...this`, `actions`): `Promise`<`unknown`\>

Perform a set of touch actions

**`Deprecated`**

Use [`performActions`](appium_xcuitest_driver.XCUITestDriver.md#performactions) instead

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...this` | `any` | - |
| `actions` | `any`[] | the old MJSONWP style touch action objects |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:2051](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L2051)

## Accessors

### \_desiredCapConstraints

• `Protected` `get` **_desiredCapConstraints**(): `Readonly`<{ `app`: { `isString`: ``true``  } ; `autoLaunch`: { `isBoolean`: ``true``  } ; `autoWebview`: { `isBoolean`: ``true``  } ; `automationName`: { `isString`: ``true``  } ; `eventTimings`: { `isBoolean`: ``true``  } ; `fullReset`: { `isBoolean`: ``true``  } ; `language`: { `isString`: ``true``  } ; `locale`: { `isString`: ``true``  } ; `newCommandTimeout`: { `isNumber`: ``true``  } ; `noReset`: { `isBoolean`: ``true``  } ; `orientation`: { `inclusion`: readonly [``"LANDSCAPE"``, ``"PORTRAIT"``]  } ; `platformName`: { `isString`: ``true`` ; `presence`: ``true``  } ; `platformVersion`: { `isString`: ``true``  } ; `printPageSourceOnFindFailure`: { `isBoolean`: ``true``  } ; `udid`: { `isString`: ``true``  } ; `webSocketUrl`: { `isBoolean`: ``true``  }  } & `C`\>

Contains the base constraints plus whatever the subclass wants to add.

Subclasses _shouldn't_ need to use this. If you need to use this, please create
an issue:

**`See`**

[https://github.com/appium/appium/issues/new](https://github.com/appium/appium/issues/new)

#### Returns

`Readonly`<{ `app`: { `isString`: ``true``  } ; `autoLaunch`: { `isBoolean`: ``true``  } ; `autoWebview`: { `isBoolean`: ``true``  } ; `automationName`: { `isString`: ``true``  } ; `eventTimings`: { `isBoolean`: ``true``  } ; `fullReset`: { `isBoolean`: ``true``  } ; `language`: { `isString`: ``true``  } ; `locale`: { `isString`: ``true``  } ; `newCommandTimeout`: { `isNumber`: ``true``  } ; `noReset`: { `isBoolean`: ``true``  } ; `orientation`: { `inclusion`: readonly [``"LANDSCAPE"``, ``"PORTRAIT"``]  } ; `platformName`: { `isString`: ``true`` ; `presence`: ``true``  } ; `platformVersion`: { `isString`: ``true``  } ; `printPageSourceOnFindFailure`: { `isBoolean`: ``true``  } ; `udid`: { `isString`: ``true``  } ; `webSocketUrl`: { `isBoolean`: ``true``  }  } & `C`\>

#### Inherited from

BaseDriver.\_desiredCapConstraints

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:20

___

### driverData

• `get` **driverData**(): `Object`

This property is used by AppiumDriver to store the data of the
specific driver sessions. This data can be later used to adjust
properties for driver instances running in parallel.
Override it in inherited driver classes if necessary.

#### Returns

`Object`

#### Overrides

BaseDriver.driverData

#### Defined in

[lib/driver.js:357](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L357)

___

### eventHistory

• `get` **eventHistory**(): [`EventHistory`](../interfaces/appium_types.EventHistory.md)

#### Returns

[`EventHistory`](../interfaces/appium_types.EventHistory.md)

#### Inherited from

BaseDriver.eventHistory

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:83

___

### isCommandsQueueEnabled

• `get` **isCommandsQueueEnabled**(): `boolean`

This property controls the way the `executeCommand` method
handles new driver commands received from the client.
Override it for inherited classes only in special cases.

#### Returns

`boolean`

If the returned value is true (default) then all the commands
  received by the particular driver instance are going to be put into the queue,
  so each following command will not be executed until the previous command
  execution is completed. False value disables that queue, so each driver command
  is executed independently and does not wait for anything.

#### Inherited from

BaseDriver.isCommandsQueueEnabled

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:82

___

### log

• `get` **log**(): [`AppiumLogger`](../interfaces/appium_types.AppiumLogger.md)

#### Returns

[`AppiumLogger`](../interfaces/appium_types.AppiumLogger.md)

#### Inherited from

BaseDriver.log

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:53

## Methods

### \_getCommandTimeout

▸ **_getCommandTimeout**(`cmdName`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmdName` | `any` |

#### Returns

`any`

#### Defined in

[lib/driver.js:1777](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1777)

___

### addManagedDriver

▸ **addManagedDriver**(`driver`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `driver` | [`Driver`](../interfaces/appium_types.Driver.md)<[`Constraints`](../modules/appium_types.md#constraints), [`StringRecord`](../modules/appium_types.md#stringrecord), [`StringRecord`](../modules/appium_types.md#stringrecord), [`DefaultCreateSessionResult`](../modules/appium_types.md#defaultcreatesessionresult)<[`Constraints`](../modules/appium_types.md#constraints)\>, `void`, [`StringRecord`](../modules/appium_types.md#stringrecord)\> |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[addManagedDriver](appium_base_driver.BaseDriver.md#addmanageddriver)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:150

___

### assertFeatureEnabled

▸ **assertFeatureEnabled**(`name`): `void`

Assert that a given feature is enabled and throw a helpful error if it's
not

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of feature/command |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[assertFeatureEnabled](appium_base_driver.BaseDriver.md#assertfeatureenabled)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:127

___

### assignServer

▸ **assignServer**(`server`, `host`, `port`, `path`): `void`

A helper function used to assign server information to the driver instance so the driver knows
where the server is Running

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | [`AppiumServer`](../modules/appium_types.md#appiumserver) | the server object |
| `host` | `string` | the server hostname |
| `port` | `number` | the server port |
| `path` | `string` | the server base url |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[assignServer](appium_base_driver.BaseDriver.md#assignserver)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:30

___

### canProxy

▸ **canProxy**(): `boolean`

#### Returns

`boolean`

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[canProxy](appium_base_driver.BaseDriver.md#canproxy)

#### Defined in

[lib/driver.js:1441](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1441)

___

### checkAutInstallationState

▸ **checkAutInstallationState**(): `Promise`<{ `install`: `boolean` = false; `skipUninstall`: `boolean` = true }\>

#### Returns

`Promise`<{ `install`: `boolean` = false; `skipUninstall`: `boolean` = true }\>

#### Defined in

[lib/driver.js:1604](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1604)

___

### clearNewCommandTimeout

▸ **clearNewCommandTimeout**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[clearNewCommandTimeout](appium_base_driver.BaseDriver.md#clearnewcommandtimeout)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:152

___

### configureApp

▸ **configureApp**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1085](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1085)

___

### createSession

▸ **createSession**(`w3cCaps1`, `w3cCaps2`, `w3cCaps3`, `driverData`): `Promise`<[`string`, [`DriverCaps`](../modules/appium_types.md#drivercaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>]\>

Historically the first two arguments were reserved for JSONWP capabilities.
Appium 2 has dropped the support of these, so now we only accept capability
objects in W3C format and thus allow any of the three arguments to represent
the latter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `w3cCaps1` | `any` |
| `w3cCaps2` | `any` |
| `w3cCaps3` | `any` |
| `driverData` | `any` |

#### Returns

`Promise`<[`string`, [`DriverCaps`](../modules/appium_types.md#drivercaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>]\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[createSession](appium_base_driver.BaseDriver.md#createsession)

#### Defined in

[lib/driver.js:392](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L392)

___

### createSim

▸ **createSim**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/driver.js:1350](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1350)

___

### deleteSession

▸ **deleteSession**(): `Promise`<`void`\>

Stop an automation session

**`See`**

[https://w3c.github.io/webdriver/#delete-session](https://w3c.github.io/webdriver/#delete-session)

#### Returns

`Promise`<`void`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[deleteSession](appium_base_driver.BaseDriver.md#deletesession)

#### Defined in

[lib/driver.js:959](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L959)

___

### determineDevice

▸ **determineDevice**(): `Promise`<{ `device`: `any` ; `realDevice`: `boolean` = false; `udid`: `any` = device.udid }\>

#### Returns

`Promise`<{ `device`: `any` ; `realDevice`: `boolean` = false; `udid`: `any` = device.udid }\>

#### Defined in

[lib/driver.js:1221](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1221)

___

### driverForSession

▸ **driverForSession**(`sessionId`): ``null`` \| [`Core`](../interfaces/appium_types.Core.md)<[`Constraints`](../modules/appium_types.md#constraints), [`StringRecord`](../modules/appium_types.md#stringrecord)\>

method required by MJSONWP in order to determine if the command should
be proxied directly to the driver

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |

#### Returns

``null`` \| [`Core`](../interfaces/appium_types.Core.md)<[`Constraints`](../modules/appium_types.md#constraints), [`StringRecord`](../modules/appium_types.md#stringrecord)\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[driverForSession](appium_base_driver.BaseDriver.md#driverforsession)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:102

___

### ensureFeatureEnabled

▸ **ensureFeatureEnabled**(`name`): `void`

Assert that a given feature is enabled and throw a helpful error if it's
not

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of feature/command |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[ensureFeatureEnabled](appium_base_driver.BaseDriver.md#ensurefeatureenabled)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:120

___

### executeCommand

▸ **executeCommand**(`cmd`, `...args`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmd` | `string` |
| `...args` | `any`[] |

#### Returns

`Promise`<`any`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[executeCommand](appium_base_driver.BaseDriver.md#executecommand)

#### Defined in

[lib/driver.js:1072](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1072)

___

### executeMethod

▸ **executeMethod**<`TArgs`, `TReturn`\>(`script`, `args`): `Promise`<`TReturn`\>

Call an `Execute Method` by its name with the given arguments. This method will check that the
driver has registered the method matching the name, and send it the arguments.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TArgs` | extends readonly `any`[] \| readonly [[`StringRecord`](../modules/appium_types.md#stringrecord)<`unknown`\>] = `unknown`[] |
| `TReturn` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `script` | `string` | the name of the Execute Method |
| `args` | `TArgs` | a singleton array containing an arguments object |

#### Returns

`Promise`<`TReturn`\>

The result of calling the Execute Method

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[executeMethod](appium_base_driver.BaseDriver.md#executemethod)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:148

___

### findElOrElsWithProcessing

▸ **findElOrElsWithProcessing**(`strategy`, `selector`, `mult`, `context?`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

This is a wrapper for [`findElOrEls`](appium_xcuitest_driver.XCUITestDriver.md#findelorels) that validates locator strategies
and implements the `appium:printPageSourceOnFindFailure` capability

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector |
| `mult` | ``true`` | whether or not we want to find multiple elements |
| `context?` | `any` | the element to use as the search context basis if desiredCapabilities |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

A single element or list of elements

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElOrElsWithProcessing](appium_base_driver.BaseDriver.md#findelorelswithprocessing)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:255

▸ **findElOrElsWithProcessing**(`strategy`, `selector`, `mult`, `context?`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `strategy` | `string` |
| `selector` | `string` |
| `mult` | ``false`` |
| `context?` | `any` |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElOrElsWithProcessing](appium_base_driver.BaseDriver.md#findelorelswithprocessing)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:256

___

### findElement

▸ **findElement**(`strategy`, `selector`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

Find a UI element given a locator strategy and a selector, erroring if it can't be found

**`See`**

[https://w3c.github.io/webdriver/#find-element](https://w3c.github.io/webdriver/#find-element)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector to combine with the strategy to find the specific element |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

The element object encoding the element id which can be used in element-related
commands

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElement](appium_base_driver.BaseDriver.md#findelement)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:176

___

### findElementFromElement

▸ **findElementFromElement**(`strategy`, `selector`, `elementId`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

Find a UI element given a locator strategy and a selector, erroring if it can't be found. Only
look for elements among the set of descendants of a given element

**`See`**

[https://w3c.github.io/webdriver/#find-element-from-element](https://w3c.github.io/webdriver/#find-element-from-element)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector to combine with the strategy to find the specific element |
| `elementId` | `string` | the id of the element to use as the search basis |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

The element object encoding the element id which can be used in element-related
commands

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElementFromElement](appium_base_driver.BaseDriver.md#findelementfromelement)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:199

___

### findElementFromShadowRoot

▸ `Optional` **findElementFromShadowRoot**(`strategy`, `selector`, `shadowId`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

Find an element from a shadow root

**`See`**

[https://w3c.github.io/webdriver/#find-element-from-shadow-root](https://w3c.github.io/webdriver/#find-element-from-shadow-root)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector to combine with the strategy to find the specific elements |
| `shadowId` | `string` | the id of the element to use as the search basis |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>\>

The element inside the shadow root matching the selector

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElementFromShadowRoot](appium_base_driver.BaseDriver.md#findelementfromshadowroot)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:221

___

### findElements

▸ **findElements**(`strategy`, `selector`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

Find a a list of all UI elements matching a given a locator strategy and a selector

**`See`**

[https://w3c.github.io/webdriver/#find-elements](https://w3c.github.io/webdriver/#find-elements)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector to combine with the strategy to find the specific elements |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

A possibly-empty list of element objects

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElements](appium_base_driver.BaseDriver.md#findelements)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:186

___

### findElementsFromElement

▸ **findElementsFromElement**(`strategy`, `selector`, `elementId`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

Find a a list of all UI elements matching a given a locator strategy and a selector. Only
look for elements among the set of descendants of a given element

**`See`**

[https://w3c.github.io/webdriver/#find-elements-from-element](https://w3c.github.io/webdriver/#find-elements-from-element)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector to combine with the strategy to find the specific elements |
| `elementId` | `string` | the id of the element to use as the search basis |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

A possibly-empty list of element objects

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElementsFromElement](appium_base_driver.BaseDriver.md#findelementsfromelement)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:211

___

### findElementsFromShadowRoot

▸ `Optional` **findElementsFromShadowRoot**(`strategy`, `selector`, `shadowId`): `Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

Find elements from a shadow root

**`See`**

[https://w3c.github.io/webdriver/#find-element-from-shadow-root](https://w3c.github.io/webdriver/#find-element-from-shadow-root)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategy` | `string` | the locator strategy |
| `selector` | `string` | the selector to combine with the strategy to find the specific elements |
| `shadowId` | `string` | the id of the element to use as the search basis |

#### Returns

`Promise`<[`Element`](../interfaces/appium_types.Element.md)<`string`\>[]\>

A possibly empty list of elements inside the shadow root matching the selector

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[findElementsFromShadowRoot](appium_base_driver.BaseDriver.md#findelementsfromshadowroot)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:231

___

### getDefaultUrl

▸ **getDefaultUrl**(): `string`

Returns the default URL for Safari browser

#### Returns

`string`

The default URL

#### Defined in

[lib/driver.js:472](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L472)

___

### getLog

▸ **getLog**(`logType`): `Promise`<`any`\>

Get the log for a given log type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `logType` | `string` | Name/key of log type as defined in ILogCommands.supportedLogTypes. |

#### Returns

`Promise`<`any`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getLog](appium_base_driver.BaseDriver.md#getlog)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:279

___

### getLogEvents

▸ **getLogEvents**(`type?`): `Promise`<[`EventHistory`](../interfaces/appium_types.EventHistory.md) \| `Record`<`string`, `number`\>\>

Get a list of events that have occurred in the current session

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` \| `string`[] | filter the returned events by including one or more types |

#### Returns

`Promise`<[`EventHistory`](../interfaces/appium_types.EventHistory.md) \| `Record`<`string`, `number`\>\>

The event history for the session

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getLogEvents](appium_base_driver.BaseDriver.md#getlogevents)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:136

___

### getLogTypes

▸ **getLogTypes**(): `Promise`<`string`[]\>

Get available log types as a list of strings

#### Returns

`Promise`<`string`[]\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getLogTypes](appium_base_driver.BaseDriver.md#getlogtypes)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:273

___

### getManagedDrivers

▸ **getManagedDrivers**(): [`Driver`](../interfaces/appium_types.Driver.md)<[`Constraints`](../modules/appium_types.md#constraints), [`StringRecord`](../modules/appium_types.md#stringrecord), [`StringRecord`](../modules/appium_types.md#stringrecord), [`DefaultCreateSessionResult`](../modules/appium_types.md#defaultcreatesessionresult)<[`Constraints`](../modules/appium_types.md#constraints)\>, `void`, [`StringRecord`](../modules/appium_types.md#stringrecord)\>[]

#### Returns

[`Driver`](../interfaces/appium_types.Driver.md)<[`Constraints`](../modules/appium_types.md#constraints), [`StringRecord`](../modules/appium_types.md#stringrecord), [`StringRecord`](../modules/appium_types.md#stringrecord), [`DefaultCreateSessionResult`](../modules/appium_types.md#defaultcreatesessionresult)<[`Constraints`](../modules/appium_types.md#constraints)\>, `void`, [`StringRecord`](../modules/appium_types.md#stringrecord)\>[]

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getManagedDrivers](appium_base_driver.BaseDriver.md#getmanageddrivers)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:151

___

### getProxyAvoidList

▸ **getProxyAvoidList**(): [`RouteMatcher`](../modules/appium_types.md#routematcher)[]

#### Returns

[`RouteMatcher`](../modules/appium_types.md#routematcher)[]

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[getProxyAvoidList](appium_base_driver.BaseDriver.md#getproxyavoidlist)

#### Defined in

[lib/driver.js:1434](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1434)

___

### getSession

▸ **getSession**(): `Promise`<{ `udid`: `any`  } & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `app`: { `isString`: ``true``  } ; `autoLaunch`: { `isBoolean`: ``true``  } ; `autoWebview`: { `isBoolean`: ``true``  } ; `automationName`: { `isString`: ``true``  } ; `eventTimings`: { `isBoolean`: ``true``  } ; `fullReset`: { `isBoolean`: ``true``  } ; `language`: { `isString`: ``true``  } ; `locale`: { `isString`: ``true``  } ; `newCommandTimeout`: { `isNumber`: ``true``  } ; `noReset`: { `isBoolean`: ``true``  } ; `orientation`: { `inclusion`: readonly [``"LANDSCAPE"``, ``"PORTRAIT"``]  } ; `platformName`: { `isString`: ``true`` ; `presence`: ``true``  } ; `platformVersion`: { `isString`: ``true``  } ; `printPageSourceOnFindFailure`: { `isBoolean`: ``true``  } ; `udid`: { `isString`: ``true``  } ; `webSocketUrl`: { `isBoolean`: ``true``  }  }\> & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\> & { `error?`: `string` ; `events?`: [`EventHistory`](../interfaces/appium_types.EventHistory.md)  } & [`StringRecord`](../modules/appium_types.md#stringrecord) & [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\>\>

Get session capabilities merged with what WDA reports
This is a library command but needs to call 'super' so can't be on
a helper object

#### Returns

`Promise`<{ `udid`: `any`  } & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `app`: { `isString`: ``true``  } ; `autoLaunch`: { `isBoolean`: ``true``  } ; `autoWebview`: { `isBoolean`: ``true``  } ; `automationName`: { `isString`: ``true``  } ; `eventTimings`: { `isBoolean`: ``true``  } ; `fullReset`: { `isBoolean`: ``true``  } ; `language`: { `isString`: ``true``  } ; `locale`: { `isString`: ``true``  } ; `newCommandTimeout`: { `isNumber`: ``true``  } ; `noReset`: { `isBoolean`: ``true``  } ; `orientation`: { `inclusion`: readonly [``"LANDSCAPE"``, ``"PORTRAIT"``]  } ; `platformName`: { `isString`: ``true`` ; `presence`: ``true``  } ; `platformVersion`: { `isString`: ``true``  } ; `printPageSourceOnFindFailure`: { `isBoolean`: ``true``  } ; `udid`: { `isString`: ``true``  } ; `webSocketUrl`: { `isBoolean`: ``true``  }  }\> & [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\> & { `error?`: `string` ; `events?`: [`EventHistory`](../interfaces/appium_types.EventHistory.md)  } & [`StringRecord`](../modules/appium_types.md#stringrecord) & [`StringRecord`](../modules/appium_types.md#stringrecord)<`any`\>\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[getSession](appium_base_driver.BaseDriver.md#getsession)

#### Defined in

[lib/driver.js:1791](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1791)

___

### getSessions

▸ **getSessions**(): `Promise`<[`MultiSessionData`](../interfaces/appium_types.MultiSessionData.md)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>[]\>

Get data for all sessions running on an Appium server

#### Returns

`Promise`<[`MultiSessionData`](../interfaces/appium_types.MultiSessionData.md)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\>[]\>

A list of session data objects

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getSessions](appium_base_driver.BaseDriver.md#getsessions)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:40

___

### getSettings

▸ **getSettings**(): `Promise`<[`StringRecord`](../modules/appium_types.md#stringrecord)\>

Get the current settings for the session

#### Returns

`Promise`<[`StringRecord`](../modules/appium_types.md#stringrecord)\>

The settings object

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getSettings](appium_base_driver.BaseDriver.md#getsettings)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:49

___

### getStatus

▸ **getStatus**(): `Promise`<{ `build`: { `version`: `string`  }  }\>

#### Returns

`Promise`<{ `build`: { `version`: `string`  }  }\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[getStatus](appium_base_driver.BaseDriver.md#getstatus)

#### Defined in

[lib/driver.js:362](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L362)

___

### getTimeouts

▸ **getTimeouts**(): `Promise`<`Record`<`string`, `number`\>\>

Get the current timeouts

**`See`**

[https://w3c.github.io/webdriver/#get-timeouts](https://w3c.github.io/webdriver/#get-timeouts)

#### Returns

`Promise`<`Record`<`string`, `number`\>\>

A map of timeout names to ms values

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[getTimeouts](appium_base_driver.BaseDriver.md#gettimeouts)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:66

___

### implicitWait

▸ **implicitWait**(`ms`): `Promise`<`void`\>

Set the implicit wait timeout

**`Deprecated`**

Use `timeouts` instead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `string` \| `number` | the timeout in ms |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[implicitWait](appium_base_driver.BaseDriver.md#implicitwait)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:45

___

### implicitWaitForCondition

▸ **implicitWaitForCondition**(`condition`): `Promise`<`unknown`\>

Periodically retry an async function up until the currently set implicit wait timeout

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `condition` | (...`args`: `any`[]) => `Promise`<`any`\> | the behaviour to retry until it returns truthy |

#### Returns

`Promise`<`unknown`\>

The return value of the condition

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[implicitWaitForCondition](appium_base_driver.BaseDriver.md#implicitwaitforcondition)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:59

___

### implicitWaitMJSONWP

▸ **implicitWaitMJSONWP**(`ms`): `Promise`<`void`\>

Set the implicit wait value that was sent in via the JSONWP

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | the timeout in ms |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[implicitWaitMJSONWP](appium_base_driver.BaseDriver.md#implicitwaitmjsonwp)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:79

___

### implicitWaitW3C

▸ **implicitWaitW3C**(`ms`): `Promise`<`void`\>

Set the implicit wait value that was sent in via the W3C protocol

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | the timeout in ms |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[implicitWaitW3C](appium_base_driver.BaseDriver.md#implicitwaitw3c)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:72

___

### installAUT

▸ **installAUT**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1675](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1675)

___

### installOtherApps

▸ **installOtherApps**(`otherApps`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `otherApps` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1716](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1716)

___

### isFeatureEnabled

▸ **isFeatureEnabled**(`name`): `boolean`

Check whether a given feature is enabled via its name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of feature/command |

#### Returns

`boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[isFeatureEnabled](appium_base_driver.BaseDriver.md#isfeatureenabled)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:112

___

### isMjsonwpProtocol

▸ **isMjsonwpProtocol**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[isMjsonwpProtocol](appium_base_driver.BaseDriver.md#ismjsonwpprotocol)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:103

___

### isRealDevice

▸ **isRealDevice**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/driver.js:1452](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1452)

___

### isSafari

▸ **isSafari**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/driver.js:1445](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1445)

___

### isSimulator

▸ **isSimulator**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/driver.js:1457](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1457)

___

### isW3CProtocol

▸ **isW3CProtocol**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[isW3CProtocol](appium_base_driver.BaseDriver.md#isw3cprotocol)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:104

___

### isXcodebuildNeeded

▸ **isXcodebuildNeeded**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/driver.js:388](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L388)

___

### logCustomEvent

▸ **logCustomEvent**(`vendor`, `event`): `Promise`<`void`\>

Add a custom-named event to the Appium event log

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vendor` | `string` | the name of the vendor or tool the event belongs to, to namespace the event |
| `event` | `string` | the name of the event itself |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[logCustomEvent](appium_base_driver.BaseDriver.md#logcustomevent)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:128

___

### logEvent

▸ **logEvent**(`eventName`): `void`

API method for driver developers to log timings for important events

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[logEvent](appium_base_driver.BaseDriver.md#logevent)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:87

___

### logExtraCaps

▸ **logExtraCaps**(`caps`): `void`

A helper function to log unrecognized capabilities to the console

**`Params`**

caps - the capabilities

#### Parameters

| Name | Type |
| :------ | :------ |
| `caps` | [`ConstraintsToCaps`](../modules/appium_types.md#constraintstocaps)<{ `absoluteWebLocations`: { `isBoolean`: ``true`` = true } ; `additionalWebviewBundleIds`: {} = {}; `agentPath`: { `isString`: ``true`` = true } ; `allowProvisioningDeviceRegistration`: { `isBoolean`: ``true`` = true } ; `app`: { `isString`: ``true`` = true } ; `appInstallStrategy`: { `inclusionCaseInsensitive`: readonly [``"serial"``, ``"parallel"``, ``"ios-deploy"``] ; `isString`: ``true`` = true } ; `appPushTimeout`: { `isNumber`: ``true`` = true } ; `autoAcceptAlerts`: { `isBoolean`: ``true`` = true } ; `autoDismissAlerts`: { `isBoolean`: ``true`` = true } ; `bootstrapPath`: { `isString`: ``true`` = true } ; `browserName`: { `isString`: ``true`` = true } ; `bundleId`: { `isString`: ``true`` = true } ; `calendarAccessAuthorized`: { `isBoolean`: ``true`` = true } ; `calendarFormat`: { `isString`: ``true`` = true } ; `clearSystemFiles`: { `isBoolean`: ``true`` = true } ; `commandTimeouts`: {} = {}; `connectHardwareKeyboard`: { `isBoolean`: ``true`` = true } ; `customSSLCert`: { `isString`: ``true`` = true } ; `derivedDataPath`: { `isString`: ``true`` = true } ; `deviceName`: { `isString`: ``true`` = true } ; `disableAutomaticScreenshots`: { `isBoolean`: ``true`` = true } ; `enableAsyncExecuteFromHttps`: { `isBoolean`: ``true`` = true } ; `enablePerformanceLogging`: { `isBoolean`: ``true`` = true } ; `enforceAppInstall`: { `isBoolean`: ``true`` = true } ; `enforceFreshSimulatorCreation`: { `isBoolean`: ``true`` = true } ; `forceAppLaunch`: { `isBoolean`: ``true`` = true } ; `forceTurnOnSoftwareKeyboardSimulator`: { `isBoolean`: ``true`` = true } ; `fullContextList`: { `isBoolean`: ``true`` = true } ; `ignoreAboutBlankUrl`: { `isBoolean`: ``true`` = true } ; `includeDeviceCapsToSessionInfo`: { `isBoolean`: ``true`` = true } ; `includeSafariInWebviews`: { `isBoolean`: ``true`` = true } ; `iosInstallPause`: { `isNumber`: ``true`` = true } ; `iosSimulatorLogsPredicate`: { `isString`: ``true`` = true } ; `isHeadless`: { `isBoolean`: ``true`` = true } ; `keepKeyChains`: { `isBoolean`: ``true`` = true } ; `keychainPassword`: { `isString`: ``true`` = true } ; `keychainPath`: { `isString`: ``true`` = true } ; `keychainsExcludePatterns`: { `isString`: ``true`` = true } ; `launchWithIDB`: { `isBoolean`: ``true`` = true } ; `localizableStringsDir`: { `isString`: ``true`` = true } ; `maxTypingFrequency`: { `isNumber`: ``true`` = true } ; `mjpegScreenshotUrl`: { `isString`: ``true`` = true } ; `mjpegServerPort`: { `isNumber`: ``true`` = true } ; `nativeTyping`: { `isBoolean`: ``true`` = true } ; `nativeWebTap`: { `isBoolean`: ``true`` = true } ; `nativeWebTapStrict`: { `isBoolean`: ``true`` = true } ; `otherApps`: { `isString`: ``true`` = true } ; `permissions`: { `isString`: ``true`` = true } ; `platformName`: { `inclusionCaseInsensitive`: readonly [``"iOS"``, ``"tvOS"``] ; `isString`: ``true`` = true; `presence`: ``true`` = true } ; `prebuildWDA`: { `isBoolean`: ``true`` = true } ; `prebuiltWDAPath`: { `isString`: ``true`` = true } ; `processArguments`: {} = {}; `reduceMotion`: { `isBoolean`: ``true`` = true } ; `reduceTransparency`: { `isBoolean`: ``true`` = true } ; `remoteDebugProxy`: { `isString`: ``true`` = true } ; `resetLocationService`: { `isBoolean`: ``true`` = true } ; `resetOnSessionStartOnly`: { `isBoolean`: ``true`` = true } ; `resultBundlePath`: { `isString`: ``true`` = true } ; `resultBundleVersion`: { `isNumber`: ``true`` = true } ; `safariAllowPopups`: { `isBoolean`: ``true`` = true } ; `safariGarbageCollect`: { `isBoolean`: ``true`` = true } ; `safariGlobalPreferences`: { `isObject`: ``true`` = true } ; `safariIgnoreFraudWarning`: { `isBoolean`: ``true`` = true } ; `safariIgnoreWebHostnames`: { `isString`: ``true`` = true } ; `safariInitialUrl`: { `isString`: ``true`` = true } ; `safariLogAllCommunication`: { `isBoolean`: ``true`` = true } ; `safariLogAllCommunicationHexDump`: { `isBoolean`: ``true`` = true } ; `safariOpenLinksInBackground`: { `isBoolean`: ``true`` = true } ; `safariShowFullResponse`: { `isBoolean`: ``true`` = true } ; `safariSocketChunkSize`: { `isNumber`: ``true`` = true } ; `safariWebInspectorMaxFrameLength`: { `isNumber`: ``true`` = true } ; `scaleFactor`: { `isString`: ``true`` = true } ; `screenshotQuality`: { `isNumber`: ``true`` = true } ; `shouldTerminateApp`: { `isBoolean`: ``true`` = true } ; `shouldUseSingletonTestManager`: { `isBoolean`: ``true`` = true } ; `showIOSLog`: { `isBoolean`: ``true`` = true } ; `showSafariConsoleLog`: { `isBoolean`: ``true`` = true } ; `showSafariNetworkLog`: { `isBoolean`: ``true`` = true } ; `showXcodeLog`: { `isBoolean`: ``true`` = true } ; `shutdownOtherSimulators`: { `isBoolean`: ``true`` = true } ; `simpleIsVisibleCheck`: { `isBoolean`: ``true`` = true } ; `simulatorDevicesSetPath`: { `isString`: ``true`` = true } ; `simulatorPasteboardAutomaticSync`: { `isString`: ``true`` = true } ; `simulatorStartupTimeout`: { `isNumber`: ``true`` = true } ; `simulatorTracePointer`: { `isBoolean`: ``true`` = true } ; `simulatorWindowCenter`: { `isString`: ``true`` = true } ; `skipLogCapture`: { `isBoolean`: ``true`` = true } ; `udid`: { `isString`: ``true`` = true } ; `updatedWDABundleId`: { `isString`: ``true`` = true } ; `useJSONSource`: { `isBoolean`: ``true`` = true } ; `useNativeCachingStrategy`: { `isBoolean`: ``true`` = true } ; `useNewWDA`: { `isBoolean`: ``true`` = true } ; `usePrebuiltWDA`: { `isBoolean`: ``true`` = true } ; `usePreinstalledWDA`: { `isBoolean`: ``true`` = true } ; `useSimpleBuildTest`: { `isBoolean`: ``true`` = true } ; `useXctestrunFile`: { `isBoolean`: ``true`` = true } ; `waitForIdleTimeout`: { `isNumber`: ``true`` = true } ; `waitForQuiescence`: { `isBoolean`: ``true`` = true } ; `wdaBaseUrl`: { `isString`: ``true`` = true } ; `wdaConnectionTimeout`: { `isNumber`: ``true`` = true } ; `wdaEventloopIdleDelay`: { `isNumber`: ``true`` = true } ; `wdaLaunchTimeout`: { `isNumber`: ``true`` = true } ; `wdaLocalPort`: { `isNumber`: ``true`` = true } ; `wdaStartupRetries`: { `isNumber`: ``true`` = true } ; `wdaStartupRetryInterval`: { `isNumber`: ``true`` = true } ; `webDriverAgentUrl`: { `isString`: ``true`` = true } ; `webkitResponseTimeout`: { `isNumber`: ``true`` = true } ; `webviewConnectRetries`: { `isNumber`: ``true`` = true } ; `webviewConnectTimeout`: { `isNumber`: ``true`` = true } ; `xcodeConfigFile`: { `isString`: ``true`` = true } ; `xcodeOrgId`: { `isString`: ``true`` = true } ; `xcodeSigningId`: { `isString`: ``true`` = true }  }\> |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[logExtraCaps](appium_base_driver.BaseDriver.md#logextracaps)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:46

___

### mergeCliArgsToOpts

▸ **mergeCliArgsToOpts**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/driver.js:373](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L373)

___

### newCommandTimeout

▸ **newCommandTimeout**(`ms`): `Promise`<`void`\>

Set Appium's new command timeout

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | the timeout in ms |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[newCommandTimeout](appium_base_driver.BaseDriver.md#newcommandtimeout)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:111

___

### onPostConfigureApp

▸ **onPostConfigureApp**(`«destructured»`): `Promise`<``false`` \| { `appPath`: `any` = cachedAppInfo.fullPath }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |

#### Returns

`Promise`<``false`` \| { `appPath`: `any` = cachedAppInfo.fullPath }\>

#### Defined in

[lib/driver.js:1186](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1186)

___

### onSettingsUpdate

▸ **onSettingsUpdate**(`key`, `value`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `any` |
| `value` | `any` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[lib/driver.js:315](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L315)

___

### onUnexpectedShutdown

▸ **onUnexpectedShutdown**(`handler`): `void`

Set a callback handler if needed to execute a custom piece of code
when the driver is shut down unexpectedly. Multiple calls to this method
will cause the handler to be executed mutiple times

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | (...`args`: `any`[]) => `void` | The code to be executed on unexpected shutdown. The function may accept one argument, which is the actual error instance, which caused the driver to shut down. |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[onUnexpectedShutdown](appium_base_driver.BaseDriver.md#onunexpectedshutdown)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:63

___

### parseTimeoutArgument

▸ **parseTimeoutArgument**(`ms`): `number`

Get a timeout value from a number or a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `string` \| `number` | the timeout value as a number or a string |

#### Returns

`number`

The timeout as a number in ms

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[parseTimeoutArgument](appium_base_driver.BaseDriver.md#parsetimeoutargument)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:119

___

### proxyActive

▸ **proxyActive**(): `boolean`

#### Returns

`boolean`

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[proxyActive](appium_base_driver.BaseDriver.md#proxyactive)

#### Defined in

[lib/driver.js:1430](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1430)

___

### proxyRouteIsAvoided

▸ **proxyRouteIsAvoided**(`sessionId`, `method`, `url`, `body?`): `boolean`

Whether a given command route (expressed as method and url) should not be
proxied according to this driver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sessionId` | `string` | the current sessionId (in case the driver runs multiple session ids and requires it). This is not used in this method but should be made available to overridden methods. |
| `method` | [`HTTPMethod`](../modules/appium_types.md#httpmethod) | HTTP method of the route |
| `url` | `string` | url of the route |
| `body?` | `any` | webdriver request body |

#### Returns

`boolean`

whether the route should be avoided

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[proxyRouteIsAvoided](appium_base_driver.BaseDriver.md#proxyrouteisavoided)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:145

___

### reset

▸ **reset**(): `Promise`<`void`\>

Reset the current session (run the delete session and create session subroutines)

#### Returns

`Promise`<`void`\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[reset](appium_base_driver.BaseDriver.md#reset)

#### Defined in

[lib/driver.js:1822](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1822)

___

### resetIos

▸ **resetIos**(): `void`

#### Returns

`void`

#### Defined in

[lib/driver.js:324](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L324)

___

### runReset

▸ **runReset**(`opts?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `XCUITestDriverOpts` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:947](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L947)

___

### sessionExists

▸ **sessionExists**(`sessionId`): `boolean`

method required by MJSONWP in order to determine whether it should
respond with an invalid session response

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |

#### Returns

`boolean`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[sessionExists](appium_base_driver.BaseDriver.md#sessionexists)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:97

___

### setImplicitWait

▸ **setImplicitWait**(`ms`): `void`

A helper method (not a command) used to set the implicit wait value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | the implicit wait in ms |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[setImplicitWait](appium_base_driver.BaseDriver.md#setimplicitwait)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:51

___

### setInitialOrientation

▸ **setInitialOrientation**(`orientation`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orientation` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1759](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1759)

___

### setNewCommandTimeout

▸ **setNewCommandTimeout**(`ms`): `void`

Set the new command timeout

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | the timeout in ms |

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[setNewCommandTimeout](appium_base_driver.BaseDriver.md#setnewcommandtimeout)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:36

___

### setProtocolMJSONWP

▸ **setProtocolMJSONWP**(): `void`

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[setProtocolMJSONWP](appium_base_driver.BaseDriver.md#setprotocolmjsonwp)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:105

___

### setProtocolW3C

▸ **setProtocolW3C**(): `void`

#### Returns

`void`

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[setProtocolW3C](appium_base_driver.BaseDriver.md#setprotocolw3c)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/core.d.ts:106

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:481](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L481)

___

### startNewCommandTimeout

▸ **startNewCommandTimeout**(): `Promise`<`void`\>

Start the timer for the New Command Timeout, which when it runs out, will stop the current
session

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[startNewCommandTimeout](appium_base_driver.BaseDriver.md#startnewcommandtimeout)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:29

___

### startSim

▸ **startSim**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1311](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1311)

___

### startUnexpectedShutdown

▸ **startUnexpectedShutdown**(`err?`): `Promise`<`void`\>

Signify to any owning processes that this driver encountered an error which should cause the
session to terminate immediately (for example an upstream service failed)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err?` | `Error` | the Error object which is causing the shutdown |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[startUnexpectedShutdown](appium_base_driver.BaseDriver.md#startunexpectedshutdown)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:28

___

### startWda

▸ **startWda**(`sessionId`, `realDevice`): `Promise`<`void`\>

Start WebDriverAgentRunner

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sessionId` | `string` | The id of the target session to launch WDA with. |
| `realDevice` | `boolean` | Equals to true if the test target device is a real device. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:731](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L731)

___

### startWdaSession

▸ **startWdaSession**(`bundleId`, `processArguments`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleId` | `any` |
| `processArguments` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1358](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1358)

___

### stop

▸ **stop**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/driver.js:1042](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1042)

___

### timeouts

▸ **timeouts**(`type`, `ms`, `script?`, `pageLoad?`, `implicit?`): `Promise`<`void`\>

Set the various timeouts associated with a session

**`See`**

[https://w3c.github.io/webdriver/#set-timeouts](https://w3c.github.io/webdriver/#set-timeouts)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | used only for the old (JSONWP) command, the type of the timeout |
| `ms` | `string` \| `number` | used only for the old (JSONWP) command, the ms for the timeout |
| `script?` | `number` | the number in ms for the script timeout, used for the W3C command |
| `pageLoad?` | `number` | the number in ms for the pageLoad timeout, used for the W3C command |
| `implicit?` | `string` \| `number` | the number in ms for the implicit wait timeout, used for the W3C command |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[timeouts](appium_base_driver.BaseDriver.md#timeouts)

#### Defined in

node_modules/@appium/types/build/lib/driver.d.ts:30

___

### unzipApp

▸ **unzipApp**(`appPath`, `depth?`): `Promise`<`string`\>

Unzip the given archive and find a matching .app bundle in it

**`Throws`**

If no matching .app bundles were found in the provided archive.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `appPath` | `string` | `undefined` | The path to the archive. |
| `depth` | `number` | `0` | [0] the current nesting depth. App bundles whose nesting level is greater than 1 are not supported. |

#### Returns

`Promise`<`string`\>

Full path to the first matching .app bundle..

#### Defined in

[lib/driver.js:1132](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1132)

___

### updateSettings

▸ **updateSettings**(`newSettings`): `Promise`<`void`\>

Update the session's settings dictionary with a new settings object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newSettings` | [`StringRecord`](../modules/appium_types.md#stringrecord) | A key-value map of setting names to values. Settings not named in the map will not have their value adjusted. |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BaseDriver](appium_base_driver.BaseDriver.md).[updateSettings](appium_base_driver.BaseDriver.md#updatesettings)

#### Defined in

node_modules/@appium/base-driver/build/lib/basedriver/driver.d.ts:48

___

### validateDesiredCaps

▸ **validateDesiredCaps**(`caps`): caps is DriverCaps<Object\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `caps` | `any` |

#### Returns

caps is DriverCaps<Object\>

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[validateDesiredCaps](appium_base_driver.BaseDriver.md#validatedesiredcaps)

#### Defined in

[lib/driver.js:1471](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1471)

___

### validateLocatorStrategy

▸ **validateLocatorStrategy**(`strategy`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `strategy` | `any` |

#### Returns

`void`

#### Overrides

[BaseDriver](appium_base_driver.BaseDriver.md).[validateLocatorStrategy](appium_base_driver.BaseDriver.md#validatelocatorstrategy)

#### Defined in

[lib/driver.js:1462](https://github.com/appium/appium-xcuitest-driver/blob/2ccfc9fb/lib/driver.js#L1462)
