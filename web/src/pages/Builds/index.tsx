import { useEffect, useState } from 'react';
import './builds.css';
import Header from '../../components/header/header';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';
import BuildContainer from '../../components/build-container/build-container';
import SessionCard from '../../components/build-container/session-card/session-card';

function Builds() {
  const [selectedBuild, setSelectedBuild] = useState<IBuild>();
  const [builds, setBuilds] = useState<IBuild[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);

  useEffect(() => {
    // fetch builds
    // fetch sessions
    const builds: IBuild[] = [
      {
        "id": "3ca00106-507f-45ed-8d8f-d9c89f74c7be",
        "name": "Webdriver io weekly build 2023-12-26",
        "createdAt": "2023-12-26T16:13:27.287Z",
        "updatedAt": "2023-12-26T16:13:27.287Z"
      },
      {
        "id": "3ca00106-507f-45ed-8d8f-d89f74c7be",
        "name": "Webdriver io weekly build 2023-12-26",
        "createdAt": "2023-12-26T16:13:27.287Z",
        "updatedAt": "2023-12-26T16:13:27.287Z"
      },
      {
        "id": "3ca00106-507f-45ed-8d8f-d9c894c7be",
        "name": "Webdriver io weekly build 2023-12-26",
        "createdAt": "2023-12-26T16:13:27.287Z",
        "updatedAt": "2023-12-26T16:13:27.287Z"
      },
    ]

    const sessions: ISession[] = [
      {
        "id": "c5fbf9dc-1d84-439b-9bff-dc270bf05a87",
        "build_id": "3ca00106-507f-45ed-8d8f-d9c89f74c7be",
        "name": "Test session",
        "status": "running",
        "desired_capabilities": "{\"platformName\":\"Android\",\"df:build\":\"Failed webdriver IO build\",\"df:record_video\":false,\"df:screeenshot_on_failure\":true,\"deviceName\":\"Pixel_4_31\",\"platformVersion\":\"12\",\"orientation\":\"PORTRAIT\",\"automationName\":\"UiAutomator2\",\"app\":\"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk\",\"appWaitActivity\":\"com.wdiodemoapp.MainActivity\",\"newCommandTimeout\":240,\"udid\":\"emulator-5554\",\"systemPort\":57577,\"chromeDriverPort\":57578,\"adbPort\":5037,\"mjpegServerPort\":57575}",
        "session_capabilities": "{\"platformName\":\"Android\",\"df:build\":\"Failed webdriver IO build\",\"df:record_video\":false,\"df:screeenshot_on_failure\":true,\"deviceName\":\"emulator-5554\",\"platformVersion\":\"12\",\"orientation\":\"PORTRAIT\",\"automationName\":\"UiAutomator2\",\"app\":\"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk\",\"appWaitActivity\":\"com.wdiodemoapp.MainActivity\",\"newCommandTimeout\":240,\"udid\":\"emulator-5554\",\"systemPort\":57577,\"chromeDriverPort\":57578,\"adbPort\":5037,\"mjpegServerPort\":57575,\"platform\":\"LINUX\",\"webStorageEnabled\":false,\"takesScreenshot\":true,\"javascriptEnabled\":true,\"databaseEnabled\":false,\"networkConnectionEnabled\":true,\"locationContextEnabled\":false,\"warnings\":{},\"deviceUDID\":\"emulator-5554\",\"appPackage\":\"com.wdiodemoapp\",\"pixelRatio\":\"2.75\",\"statBarHeight\":66,\"viewportRect\":{\"left\":0,\"top\":66,\"width\":1080,\"height\":2082},\"deviceApiLevel\":31,\"deviceManufacturer\":\"Google\",\"deviceModel\":\"sdk_gphone64_arm64\",\"deviceScreenSize\":\"1080x2280\",\"deviceScreenDensity\":440}",
        "node_id": "53146bd9-3d62-4ab7-b1e9-d151e3f1b0ed",
        "has_live_video": true, //sample live url - http://127.0.0.1:31337/device-farm/api/session/c5fbf9dc-1d84-439b-9bff-dc270bf05a87/live_video
        "video_recording": "c5fbf9dc-1d84-439b-9bff-dc270bf05a87/video/c5fbf9dc-1d84-439b-9bff-dc270bf05a87.mp4",
        "startTime": "2024-01-13T08:56:20.723Z",
        "endTime": null,
        "failure_reason": null,
        "device_udid": "emulator-5554",
        "device_platform": "android",
        "device_version": "12",
        "device_name": "sdk_gphone64_arm64",
        "createdAt": "2023-12-26T16:13:43.723Z",
        "updatedAt": "2023-12-26T16:13:43.723Z",
      },
      {
        "id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "build_id": "3ca00106-507f-45ed-8d8f-d9c89f74c7be",
        "name": null,
        "status": "unmarked",
        "desired_capabilities": "{\"platformName\":\"Android\",\"df:build\":\"Failed webdriver IO build\",\"df:record_video\":false,\"df:screeenshot_on_failure\":true,\"deviceName\":\"Pixel_4_31\",\"platformVersion\":\"12\",\"orientation\":\"PORTRAIT\",\"automationName\":\"UiAutomator2\",\"app\":\"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk\",\"appWaitActivity\":\"com.wdiodemoapp.MainActivity\",\"newCommandTimeout\":240,\"udid\":\"emulator-5554\",\"systemPort\":57135,\"chromeDriverPort\":57136,\"adbPort\":5037,\"mjpegServerPort\":57132}",
        "session_capabilities": "{\"platformName\":\"Android\",\"df:build\":\"Failed webdriver IO build\",\"df:record_video\":false,\"df:screeenshot_on_failure\":true,\"deviceName\":\"emulator-5554\",\"platformVersion\":\"12\",\"orientation\":\"PORTRAIT\",\"automationName\":\"UiAutomator2\",\"app\":\"/Users/sselvarj/Documents/git/oss/appium-boilerplate/apps/Android-NativeDemoApp-0.4.0.apk\",\"appWaitActivity\":\"com.wdiodemoapp.MainActivity\",\"newCommandTimeout\":240,\"udid\":\"emulator-5554\",\"systemPort\":57135,\"chromeDriverPort\":57136,\"adbPort\":5037,\"mjpegServerPort\":57132,\"platform\":\"LINUX\",\"webStorageEnabled\":false,\"takesScreenshot\":true,\"javascriptEnabled\":true,\"databaseEnabled\":false,\"networkConnectionEnabled\":true,\"locationContextEnabled\":false,\"warnings\":{},\"deviceUDID\":\"emulator-5554\",\"appPackage\":\"com.wdiodemoapp\",\"pixelRatio\":\"2.75\",\"statBarHeight\":66,\"viewportRect\":{\"left\":0,\"top\":66,\"width\":1080,\"height\":2082},\"deviceApiLevel\":31,\"deviceManufacturer\":\"Google\",\"deviceModel\":\"sdk_gphone64_arm64\",\"deviceScreenSize\":\"1080x2280\",\"deviceScreenDensity\":440}",
        "node_id": "53146bd9-3d62-4ab7-b1e9-d151e3f1b0ed",
        "has_live_video": false,
        "video_recording": null,
        "startTime": "2023-12-26T16:13:27.293Z",
        "endTime": "2023-12-26T16:13:36.884Z",
        "failure_reason": null,
        "device_udid": "emulator-5554",
        "device_platform": "android",
        "device_version": "12",
        "device_name": "sdk_gphone64_arm64",
        "createdAt": "2023-12-26T16:13:27.293Z",
        "updatedAt": "2023-12-26T16:13:36.886Z",
        "live": "http://127.0.0.1:31337/device-farm/api/session/8544d114-b90f-496e-9929-205eb069e9cd/live_video"
      }
    ]
    setBuilds(builds);
    setSessions(sessions);
    setSelectedBuild(builds[0]);
  }, []);

  const handleSelectedBuildChange = (build: IBuild) => {
    setSelectedBuild(build);
  }


  return (
    <div className="app-container">
      <Header />
      <div className="app-body-container">
        <BuildContainer selectedBuild={selectedBuild} handleBuildClick={handleSelectedBuildChange} builds={builds} sessions={sessions} />
        {selectedBuild && <div className="build-sessions-container">
          {sessions.filter(session => session.build_id === selectedBuild.id).map(session => {
            return (
              <SessionCard session={session} />
            )
          })}
        </div>}
      </div>
    </div>
  );
}

export default Builds;
