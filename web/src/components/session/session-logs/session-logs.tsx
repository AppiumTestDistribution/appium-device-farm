import { useEffect, useState } from 'react';
import './session-logs.css';
import { ISessionLogs } from '../../../interfaces/ISessionLogs';
import TextLogs from './text-logs/text-logs';
import DeviceFarmApiService from '../../../api-service';

enum ActiveTab {
  TextLogs = 'textLogs',
  DeviceLogs = 'deviceLogs',
  DebugLogs = 'debugLogs',
  AppProfiling = 'appProfiling',
}

function SessionLogs(sessionId: any) {
  const [sessionLogs, setSessionLogs] = useState<ISessionLogs[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.TextLogs);


  useEffect(() => {
    async function init() {
      try {
        const sessionLogs = await DeviceFarmApiService.getSessionLogs(sessionId);
        setSessionLogs(sessionLogs);
      } catch (error) {
        console.log(error);
      }
    }
    // fetch sessions
    // const builds: IBuild[] = [
    //   {
    //     id: '3ca00106-507f-45ed-8d8f-d9c89f74c7be',
    //     name: 'Webdriver io weekly build 2023-12-26',
    //     createdAt: '2023-12-26T16:13:27.287Z',
    //     updatedAt: '2023-12-26T16:13:27.287Z',
    //   },
    //   {
    //     id: '3ca00106-507f-45ed-8d8f-d89f74c7be',
    //     name: 'Webdriver io weekly build 2023-12-26',
    //     createdAt: '2023-12-26T16:13:27.287Z',
    //     updatedAt: '2023-12-26T16:13:27.287Z',
    //   },
    //   {
    //     id: '3ca00106-507f-45ed-8d8f-d9c894c7be',
    //     name: 'Webdriver io weekly build 2023-12-26',
    //     createdAt: '2023-12-26T16:13:27.287Z',
    //     updatedAt: '2023-12-26T16:13:27.287Z',
    //   },
    // ];
    //
    // const sessions: ISession[] = [
    //   {
    //     id: 'c5fbf9dc-1d84-439b-9bff-dc270bf05a87',
    //     build_id: '3ca00106-507f-45ed-8d8f-d9c89f74c7be',
    //     name: 'Test session',
    //     status: 'running',
    //     desired_capabilities:
    //       '{"platformName":"Android","df:build":"Failed webdriver IO build","df:record_video":false,"df:screeenshot_on_failure":true,"deviceName":"Pixel_4_31","platformVersion":"12","orientation":"PORTRAIT","automationName":"UiAutomator2","app":"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk","appWaitActivity":"com.wdiodemoapp.MainActivity","newCommandTimeout":240,"udid":"emulator-5554","systemPort":57577,"chromeDriverPort":57578,"adbPort":5037,"mjpegServerPort":57575}',
    //     session_capabilities:
    //       '{"platformName":"Android","df:build":"Failed webdriver IO build","df:record_video":false,"df:screeenshot_on_failure":true,"deviceName":"emulator-5554","platformVersion":"12","orientation":"PORTRAIT","automationName":"UiAutomator2","app":"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk","appWaitActivity":"com.wdiodemoapp.MainActivity","newCommandTimeout":240,"udid":"emulator-5554","systemPort":57577,"chromeDriverPort":57578,"adbPort":5037,"mjpegServerPort":57575,"platform":"LINUX","webStorageEnabled":false,"takesScreenshot":true,"javascriptEnabled":true,"databaseEnabled":false,"networkConnectionEnabled":true,"locationContextEnabled":false,"warnings":{},"deviceUDID":"emulator-5554","appPackage":"com.wdiodemoapp","pixelRatio":"2.75","statBarHeight":66,"viewportRect":{"left":0,"top":66,"width":1080,"height":2082},"deviceApiLevel":31,"deviceManufacturer":"Google","deviceModel":"sdk_gphone64_arm64","deviceScreenSize":"1080x2280","deviceScreenDensity":440}',
    //     node_id: '53146bd9-3d62-4ab7-b1e9-d151e3f1b0ed',
    //     has_live_video: true, //sample live url - http://127.0.0.1:31337/device-farm/api/session/c5fbf9dc-1d84-439b-9bff-dc270bf05a87/live_video
    //     video_recording:
    //       'c5fbf9dc-1d84-439b-9bff-dc270bf05a87/video/c5fbf9dc-1d84-439b-9bff-dc270bf05a87.mp4',
    //     startTime: '2024-01-13T08:56:20.723Z',
    //     endTime: null,
    //     failure_reason: null,
    //     device_udid: 'emulator-5554',
    //     device_platform: 'android',
    //     device_version: '12',
    //     device_name: 'sdk_gphone64_arm64',
    //     createdAt: '2023-12-26T16:13:43.723Z',
    //     updatedAt: '2023-12-26T16:13:43.723Z',
    //   },
    //   {
    //     id: '8544d114-b90f-496e-9929-205eb069e9cd',
    //     build_id: '3ca00106-507f-45ed-8d8f-d9c89f74c7be',
    //     name: null,
    //     status: 'unmarked',
    //     desired_capabilities:
    //       '{"platformName":"Android","df:build":"Failed webdriver IO build","df:record_video":false,"df:screeenshot_on_failure":true,"deviceName":"Pixel_4_31","platformVersion":"12","orientation":"PORTRAIT","automationName":"UiAutomator2","app":"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk","appWaitActivity":"com.wdiodemoapp.MainActivity","newCommandTimeout":240,"udid":"emulator-5554","systemPort":57135,"chromeDriverPort":57136,"adbPort":5037,"mjpegServerPort":57132}',
    //     session_capabilities:
    //       '{"platformName":"Android","df:build":"Failed webdriver IO build","df:record_video":false,"df:screeenshot_on_failure":true,"deviceName":"emulator-5554","platformVersion":"12","orientation":"PORTRAIT","automationName":"UiAutomator2","app":"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk","appWaitActivity":"com.wdiodemoapp.MainActivity","newCommandTimeout":240,"udid":"emulator-5554","systemPort":57135,"chromeDriverPort":57136,"adbPort":5037,"mjpegServerPort":57132,"platform":"LINUX","webStorageEnabled":false,"takesScreenshot":true,"javascriptEnabled":true,"databaseEnabled":false,"networkConnectionEnabled":true,"locationContextEnabled":false,"warnings":{},"deviceUDID":"emulator-5554","appPackage":"com.wdiodemoapp","pixelRatio":"2.75","statBarHeight":66,"viewportRect":{"left":0,"top":66,"width":1080,"height":2082},"deviceApiLevel":31,"deviceManufacturer":"Google","deviceModel":"sdk_gphone64_arm64","deviceScreenSize":"1080x2280","deviceScreenDensity":440}',
    //     node_id: '53146bd9-3d62-4ab7-b1e9-d151e3f1b0ed',
    //     has_live_video: false,
    //     video_recording: null,
    //     startTime: '2023-12-26T16:13:27.293Z',
    //     endTime: '2023-12-26T16:13:36.884Z',
    //     failure_reason: null,
    //     device_udid: 'emulator-5554',
    //     device_platform: 'android',
    //     device_version: '12',
    //     device_name: 'sdk_gphone64_arm64',
    //     createdAt: '2023-12-26T16:13:27.293Z',
    //     updatedAt: '2023-12-26T16:13:36.886Z',
    //     live: 'http://127.0.0.1:31337/device-farm/api/session/8544d114-b90f-496e-9929-205eb069e9cd/live_video',
    //   },
    // ];

    init();
  }, []);


  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="session-logs">
      <div className="tabs">
        <div
          className={`tab-header ${activeTab === ActiveTab.TextLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.TextLogs)}
        >
          Text Logs
        </div>
        <div
          className={`tab-header ${activeTab === ActiveTab.DeviceLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.DeviceLogs)}
        >
          Device Logs
        </div>
        <div
          className={`tab-header ${activeTab === ActiveTab.DebugLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.DebugLogs)}
        >
          Debug Logs
        </div>
        <div
          className={`tab-header ${activeTab === ActiveTab.AppProfiling ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.AppProfiling)}
        >
          App Profiling
        </div>
      </div>
      <div className='tab-filter'>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="show-images"
            checked={showImages}
            onChange={() => setShowImages(!showImages)}
          />
          <label htmlFor="show-images">Show Images</label>
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="show-errors"
            checked={showErrorsOnly}
            onChange={() => setShowErrorsOnly(!showErrorsOnly)}
          />
          <label htmlFor="show-errors">Show Errors Only</label>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === ActiveTab.TextLogs && (
          <TextLogs
            sessionLogs={sessionLogs}
            showImages={showImages}
            showErrorsOnly={showErrorsOnly}
          />
        )}
      </div>
    </div>
  );
}

export default SessionLogs;
