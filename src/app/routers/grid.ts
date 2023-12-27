import { Response, Request, Router } from 'express';
import { ADTDatabase } from '../../data-service/db';
import axios from 'axios';
import _ from 'lodash';
import {
  addNewDevice,
  userBlockDevice,
  getDevice,
  removeDevice,
  userUnblockDevice,
} from '../../data-service/device-service';
import log from '../../logger';

const SERVER_UP_TIME = new Date().toISOString();

async function getDevices(request: Request, response: Response) {
  let devices = (await ADTDatabase.DeviceModel).find();
  const { sessionId } = request.query;
  if (sessionId) {
    return response.json(devices.find((value) => value.session_id === sessionId));
  }
  /* dashboard-plugin-url is the base url for opening the appium-dashboard-plugin
   * This value will be attached to all express request via middleware
   */
  const dashboardPluginUrl = (request as any)['dashboard-plugin-url'];
  if (dashboardPluginUrl) {
    const sessions =
      (await axios.get(`${dashboardPluginUrl}/api/sessions?start_time=${SERVER_UP_TIME}`)).data
        ?.result?.rows || [];
    const deviceSessionMap: any = {};
    sessions.forEach((session: any) => {
      if (!deviceSessionMap[session.udid]) {
        deviceSessionMap[session.udid] = [];
      }
      deviceSessionMap[session.udid].push(session);
    });
    devices = devices.map((d) => {
      d.dashboard_link = `${dashboardPluginUrl}?device_udid=${d.udid}&start_time=${SERVER_UP_TIME}`;
      d.total_session_count = deviceSessionMap[d.udid]?.length || 0;
      return d;
    });
  }
  return response.json(devices);
}

async function getDeviceByPlatform(request: Request, response: Response) {
  const { platform } = request.params;
  const { deviceType, booted } = request.query;
  if (!platform || ['ios', 'android'].indexOf(platform.toLowerCase()) < 0) {
    return response.status(200).send([]);
  }
  let devices = (await ADTDatabase.DeviceModel).find({
    platform: platform.toLowerCase(),
  });

  if (!_.isNil(deviceType)) {
    devices = devices.filter((value) => value.deviceType === deviceType);
  }

  if (!_.isNil(booted)) {
    devices = devices.filter((d) => d.state === 'Booted');
  }

  return response.status(200).send(devices);
}

async function registerNode(request: Request, response: Response) {
  const requestBody = request.body;
  const { type } = request.query;
  if (type === 'add') {
    const addedDevices = await addNewDevice(requestBody);
    if (addedDevices.length > 0) {
      log.info(`Added new devices: ${JSON.stringify(addedDevices)}`);
    }
  } else if (type === 'remove') {
    await removeDevice(requestBody);
  }
  response.status(200).send({
    success: true,
  });
}

async function blockDevice(request: Request, response: Response) {
  const requestBody = request.body;
  const device = await getDevice(requestBody);
  if (!_.isNil(device)) {
    await userBlockDevice(device.udid, device.host);
  }
  response.status(200).send({
    success: true,
  });
}

async function unBlockDevice(request: Request, response: Response) {
  const requestBody = request.body;
  const device = await getDevice(requestBody);
  if (!_.isNil(device)) {
    await userUnblockDevice(device.udid, device.host);
  }
  response.status(200).send({
    success: true,
  });
}

async function getQueuedSessionLength(request: Request, response: Response) {
  response.json((await ADTDatabase.PendingSessionsModel).chain().find().count());
}

async function getQueuedSessionRequests(request: Request, response: Response) {
  response.json((await ADTDatabase.PendingSessionsModel).chain().find().data());
}

function register(router: Router) {
  router.get('/device', getDevices);
  router.get('/device/:platform', getDeviceByPlatform);
  router.post('/register', registerNode);
  router.post('/block', blockDevice);
  router.post('/unblock', unBlockDevice);
  router.get('/queue/length', getQueuedSessionLength);
  router.get('/queue', getQueuedSessionRequests);
}

export default {
  register,
};
