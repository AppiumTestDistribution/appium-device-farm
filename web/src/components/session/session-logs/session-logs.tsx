import { useEffect, useState } from 'react';
import './session-logs.css';
import { ISessionLogs } from '../../../interfaces/ISessionLogs';
import TextLogs from './text-logs/text-logs';

enum ActiveTab {
  TextLogs = 'textLogs',
  DeviceLogs = 'deviceLogs',
  DebugLogs = 'debugLogs',
  AppProfiling = 'appProfiling',
}

function SessionLogs() {
  const [sessionLogs, setSessionLogs] = useState<ISessionLogs[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.TextLogs);


  useEffect(() => {
    const sessionLogs: ISessionLogs[] = [
      {
        "id": "f352733e-6d94-4ae6-bb79-b21aefe8e304",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000036/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:36.604Z",
        "updatedAt": "2023-12-26T16:13:36.604Z"
      },
      {
        "id": "b5890b6c-9b52-4919-9cc4-80b25690e39d",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home-screen\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000036\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000036\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:36.529Z",
        "updatedAt": "2023-12-26T16:13:36.529Z"
      },
      {
        "id": "2999d69e-fd7c-4b44-ab52-6b760b44b85b",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "execute",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/execute/sync",
        "method": "POST",
        "title": "Execute",
        "subtitle": "",
        "body": "{\"script\":\"mobile:deepLink\",\"args\":[{\"url\":\"wdio://home\",\"package\":\"com.wdiodemoapp\"}]}",
        "response": "{\"value\":null}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:35.902Z",
        "updatedAt": "2023-12-26T16:13:35.902Z"
      },
      {
        "id": "99c3dd91-9098-4ed7-b8f2-2b75ef33236a",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000015/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:35.769Z",
        "updatedAt": "2023-12-26T16:13:35.769Z"
      },
      {
        "id": "dc53038d-4bcb-4925-8839-b883e54955d0",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000015\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000015\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:35.731Z",
        "updatedAt": "2023-12-26T16:13:35.731Z"
      },
      {
        "id": "832ffc34-4ddc-40f8-b356-74b71e9122a3",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff000000b7/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:35.618Z",
        "updatedAt": "2023-12-26T16:13:35.618Z"
      },
      {
        "id": "c812555a-d01b-41bf-8cfe-e5e43ee640f2",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Drag-drop-screen\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff000000b7\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff000000b7\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:35.577Z",
        "updatedAt": "2023-12-26T16:13:35.577Z"
      },
      {
        "id": "6014dad3-1302-41d4-81b2-d5dda8ece1ea",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Drag-drop-screen\"}",
        "response": "{\"value\":{\"error\":\"no such element\",\"message\":\"An element could not be located on the page using the given search parameters.\",\"stacktrace\":\"NoSuchElementError: An element could not be located on the page using the given search parameters.\\n    at AndroidUiautomator2Driver.findElOrEls (/private/tmp/some-temp-dir/node_modules/appium-uiautomator2-driver/node_modules/appium-android-driver/lib/commands/find.ts:87:11)\\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at AndroidUiautomator2Driver.findElOrElsWithProcessing (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/basedriver/commands/find.ts:60:12)\\n    at AndroidUiautomator2Driver.findElement (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/basedriver/commands/find.ts:75:12)\"}}",
        "screenshot": "8544d114-b90f-496e-9929-205eb069e9cd/screenshots/6f3d86d9-4ffc-44c4-9a59-a70692a3c463.jpg",
        "is_success": false,
        "createdAt": "2023-12-26T16:13:35.289Z",
        "updatedAt": "2023-12-26T16:13:35.289Z"
      },
      {
        "id": "06dca3ec-975a-4a95-bf96-870e9ed758a6",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "execute",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/execute/sync",
        "method": "POST",
        "title": "Execute",
        "subtitle": "",
        "body": "{\"script\":\"mobile:deepLink\",\"args\":[{\"url\":\"wdio://drag\",\"package\":\"com.wdiodemoapp\"}]}",
        "response": "{\"value\":null}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:34.905Z",
        "updatedAt": "2023-12-26T16:13:34.905Z"
      },
      {
        "id": "52f6059e-058e-4fcf-b93f-713fde8991df",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000015/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:34.773Z",
        "updatedAt": "2023-12-26T16:13:34.773Z"
      },
      {
        "id": "608c24ad-cdcb-4f97-a677-23294639b046",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000015\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000015\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:34.693Z",
        "updatedAt": "2023-12-26T16:13:34.693Z"
      },
      {
        "id": "68d38de3-134f-4447-9c2a-71a94f698899",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff0000008e/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:34.633Z",
        "updatedAt": "2023-12-26T16:13:34.633Z"
      },
      {
        "id": "3ff7a474-ec0f-4005-a701-c4cb70eea4df",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Swipe-screen\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff0000008e\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff0000008e\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:34.589Z",
        "updatedAt": "2023-12-26T16:13:34.589Z"
      },
      {
        "id": "fa39ddb7-2148-40fc-bb77-d42145266055",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "execute",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/execute/sync",
        "method": "POST",
        "title": "Execute",
        "subtitle": "",
        "body": "{\"script\":\"mobile:deepLink\",\"args\":[{\"url\":\"wdio://swipe\",\"package\":\"com.wdiodemoapp\"}]}",
        "response": "{\"value\":null}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:32.690Z",
        "updatedAt": "2023-12-26T16:13:32.690Z"
      },
      {
        "id": "664ef383-941d-467d-a1b5-15efb0efc333",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000015/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:32.578Z",
        "updatedAt": "2023-12-26T16:13:32.578Z"
      },
      {
        "id": "c5def2e8-9ac3-4c8e-a825-7735e332e8eb",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000015\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000015\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:32.526Z",
        "updatedAt": "2023-12-26T16:13:32.526Z"
      },
      {
        "id": "b26563f3-0f27-4721-ad92-8d017eabb748",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000069/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:32.447Z",
        "updatedAt": "2023-12-26T16:13:32.447Z"
      },
      {
        "id": "a0d6cffc-44be-41cf-b14a-30ccfab04760",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Forms-screen\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000069\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000069\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:31.960Z",
        "updatedAt": "2023-12-26T16:13:31.960Z"
      },
      {
        "id": "4473374d-17c8-4b6d-8cd2-23132cdc555f",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "execute",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/execute/sync",
        "method": "POST",
        "title": "Execute",
        "subtitle": "",
        "body": "{\"script\":\"mobile:deepLink\",\"args\":[{\"url\":\"wdio://forms\",\"package\":\"com.wdiodemoapp\"}]}",
        "response": "{\"value\":null}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:31.892Z",
        "updatedAt": "2023-12-26T16:13:31.892Z"
      },
      {
        "id": "208dfb54-9f08-49da-b203-39679289a72b",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000015/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:31.783Z",
        "updatedAt": "2023-12-26T16:13:31.783Z"
      },
      {
        "id": "7400d696-6ad9-4b82-8a1a-74e80d1a6274",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000015\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000015\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:31.727Z",
        "updatedAt": "2023-12-26T16:13:31.727Z"
      },
      {
        "id": "52e19799-0ad1-49bb-bbb5-5aaa24f7212f",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff0000004c/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:31.668Z",
        "updatedAt": "2023-12-26T16:13:31.668Z"
      },
      {
        "id": "27a51db0-c522-437f-a08d-e362971a92c0",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Login-screen\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff0000004c\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff0000004c\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:31.617Z",
        "updatedAt": "2023-12-26T16:13:31.617Z"
      },
      {
        "id": "7440134b-38b3-4f50-9db8-0625d44a9e0c",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "execute",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/execute/sync",
        "method": "POST",
        "title": "Execute",
        "subtitle": "",
        "body": "{\"script\":\"mobile:deepLink\",\"args\":[{\"url\":\"wdio://login\",\"package\":\"com.wdiodemoapp\"}]}",
        "response": "{\"value\":null}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:30.916Z",
        "updatedAt": "2023-12-26T16:13:30.916Z"
      },
      {
        "id": "5a3b95ff-f44f-494e-ba7a-12014f0ff7af",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000015/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:30.792Z",
        "updatedAt": "2023-12-26T16:13:30.792Z"
      },
      {
        "id": "c495f9fb-c8ea-4e82-ac6f-9d5b786a373e",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000015\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000015\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:30.760Z",
        "updatedAt": "2023-12-26T16:13:30.760Z"
      },
      {
        "id": "e41617a8-be90-49cd-9306-3807efc92f47",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "setContext",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/context",
        "method": "POST",
        "title": "Set Context",
        "subtitle": "",
        "body": "{\"name\":\"WEBVIEW_com.wdiodemoapp\"}",
        "response": "{\"value\":{\"error\":\"unknown error\",\"message\":\"An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\",\"stacktrace\":\"UnknownError: An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\\n    at getResponseForW3CError (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/errors.js:1092:9)\\n    at asyncHandler (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/protocol.js:491:57)\"}}",
        "screenshot": "8544d114-b90f-496e-9929-205eb069e9cd/screenshots/606acf64-bd52-46f0-a57c-815d371054f5.jpg",
        "is_success": false,
        "createdAt": "2023-12-26T16:13:30.748Z",
        "updatedAt": "2023-12-26T16:13:30.748Z"
      },
      {
        "id": "160035ab-a7ca-4c76-b786-39318fde2dd9",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "setContext",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/context",
        "method": "POST",
        "title": "Set Context",
        "subtitle": "",
        "body": "{\"name\":\"WEBVIEW_com.wdiodemoapp\"}",
        "response": "{\"value\":{\"error\":\"unknown error\",\"message\":\"An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\",\"stacktrace\":\"UnknownError: An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\\n    at getResponseForW3CError (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/errors.js:1092:9)\\n    at asyncHandler (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/protocol.js:491:57)\"}}",
        "screenshot": "8544d114-b90f-496e-9929-205eb069e9cd/screenshots/9f344a03-72b4-42d6-acd3-c65e95d4ed5a.jpg",
        "is_success": false,
        "createdAt": "2023-12-26T16:13:30.164Z",
        "updatedAt": "2023-12-26T16:13:30.164Z"
      },
      {
        "id": "baf87068-52dd-4ec3-afc0-37ce2d2f3bc7",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "setContext",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/context",
        "method": "POST",
        "title": "Set Context",
        "subtitle": "",
        "body": "{\"name\":\"WEBVIEW_com.wdiodemoapp\"}",
        "response": "{\"value\":{\"error\":\"unknown error\",\"message\":\"An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\",\"stacktrace\":\"UnknownError: An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\\n    at getResponseForW3CError (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/errors.js:1092:9)\\n    at asyncHandler (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/protocol.js:491:57)\"}}",
        "screenshot": "8544d114-b90f-496e-9929-205eb069e9cd/screenshots/bde53ce3-f475-45ad-8930-728827f03972.jpg",
        "is_success": false,
        "createdAt": "2023-12-26T16:13:29.540Z",
        "updatedAt": "2023-12-26T16:13:29.540Z"
      },
      {
        "id": "a2ba0c36-a560-42ad-81f1-ca884e55e63c",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "setContext",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/context",
        "method": "POST",
        "title": "Set Context",
        "subtitle": "",
        "body": "{\"name\":\"WEBVIEW_com.wdiodemoapp\"}",
        "response": "{\"value\":{\"error\":\"unknown error\",\"message\":\"An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\",\"stacktrace\":\"UnknownError: An unknown server-side error occurred while processing the command. Original error: No Chromedriver found that can automate Chrome '91.0.4472'. You could also try to enable automated chromedrivers download as a possible workaround.\\n    at getResponseForW3CError (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/errors.js:1092:9)\\n    at asyncHandler (/Users/sselvarj/.nvm/versions/node/v18.16.0/lib/node_modules/appium/node_modules/@appium/base-driver/lib/protocol/protocol.js:491:57)\"}}",
        "screenshot": "8544d114-b90f-496e-9929-205eb069e9cd/screenshots/baaba393-8da0-4923-ae7c-2c4dae9bc3a6.jpg",
        "is_success": false,
        "createdAt": "2023-12-26T16:13:29.115Z",
        "updatedAt": "2023-12-26T16:13:29.115Z"
      },
      {
        "id": "69c43af1-a7fd-4f67-b6db-a62460799a8e",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "getContexts",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/contexts",
        "method": "GET",
        "title": "Get Contexts",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":[\"NATIVE_APP\",\"WEBVIEW_com.wdiodemoapp\"]}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:28.377Z",
        "updatedAt": "2023-12-26T16:13:28.377Z"
      },
      {
        "id": "9e64bf50-707c-4712-957a-53d22f7f340a",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "getContexts",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/contexts",
        "method": "GET",
        "title": "Get Contexts",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":[\"NATIVE_APP\",\"WEBVIEW_com.wdiodemoapp\"]}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:28.035Z",
        "updatedAt": "2023-12-26T16:13:28.035Z"
      },
      {
        "id": "6d8b751b-5259-47fe-8cd8-c4cf9979b4f4",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "execute",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/execute/sync",
        "method": "POST",
        "title": "Execute",
        "subtitle": "",
        "body": "{\"script\":\"mobile:deepLink\",\"args\":[{\"url\":\"wdio://webview\",\"package\":\"com.wdiodemoapp\"}]}",
        "response": "{\"value\":null}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:27.706Z",
        "updatedAt": "2023-12-26T16:13:27.706Z"
      },
      {
        "id": "b51a3f9f-9b98-4a46-b07f-b69ba10e1f70",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "elementDisplayed",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element/00000000-0000-0520-ffff-ffff00000015/displayed",
        "method": "GET",
        "title": "Element Displayed",
        "subtitle": "",
        "body": "{}",
        "response": "{\"value\":true}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:27.517Z",
        "updatedAt": "2023-12-26T16:13:27.517Z"
      },
      {
        "id": "5528f4cd-7b40-456b-8063-4698ce5084eb",
        "session_id": "8544d114-b90f-496e-9929-205eb069e9cd",
        "command_name": "findElement",
        "url": "/wd/hub/session/8544d114-b90f-496e-9929-205eb069e9cd/element",
        "method": "POST",
        "title": "Find Element",
        "subtitle": "",
        "body": "{\"using\":\"accessibility id\",\"value\":\"Home\"}",
        "response": "{\"value\":{\"element-6066-11e4-a52e-4f735466cecf\":\"00000000-0000-0520-ffff-ffff00000015\",\"ELEMENT\":\"00000000-0000-0520-ffff-ffff00000015\"}}",
        "screenshot": null,
        "is_success": true,
        "createdAt": "2023-12-26T16:13:27.436Z",
        "updatedAt": "2023-12-26T16:13:27.436Z"
      }
    ]
    setSessionLogs(sessionLogs);
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
