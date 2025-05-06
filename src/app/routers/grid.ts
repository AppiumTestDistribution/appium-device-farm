import { Response, Request, Router } from 'express';
import { ATDRepository } from '../../data-service/db';
import axios from 'axios';
import _ from 'lodash';
import {
  addNewDevice,
  userBlockDevice,
  getDevice,
  removeDevice,
  userUnblockDevice,
  getAllDevices,
} from '../../data-service/device-service';
import log from '../../logger';
import { DeviceFarmManager } from '../../device-managers';
import Container from 'typedi';
import { IPluginArgs } from '../../interfaces/IPluginArgs';
import { IDevice } from '../../interfaces/IDevice';
import { saveTestExecutionMetaData } from '../../wdio-service/wdio-service';
import { DevicePlugin } from '../../plugin';
import { prisma } from '../../prisma';
import {
  adminOnly,
  AuthenticatedRequest,
  authMiddleware,
} from '../../auth/middleware/auth.middleware';

const SERVER_UP_TIME = new Date().toISOString();

async function getSavedDevices(request: Request, response: Response) {
  const devices = await prisma.device.findMany();
  return response.json(devices);
}

async function getDevices(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const filterOptions = user?.role === 'admin' ? {} : { userId: user?.userId };
  let devices = await getAllDevices(filterOptions as any);
  const { sessionId } = request.query;
  if (sessionId) {
    return response.json(devices.find((value) => value.session_id === sessionId));
  }
  return response.json(devices);
}

async function getDeviceByPlatform(request: Request, response: Response) {
  const { platform } = request.params;
  const { deviceType, booted } = request.query;
  if (!platform || ['ios', 'android'].indexOf(platform.toLowerCase()) < 0) {
    return response.status(200).send([]);
  }
  let devices = (await ATDRepository.DeviceModel).find({
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

async function registerDevice(request: Request, response: Response) {
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

async function updateDeviceInfo(request: Request, response: Response) {
  const requestBody = request.body;
  const { udid, ...deviceInfo } = requestBody;
  const devices = (await ATDRepository.DeviceModel).find({ udid });
  if (devices.length === 0) {
    return response.status(404).send(`Device with udid ${udid} not found`);
  }
  const device = devices[0];
  const updatedDevice = {
    ...device,
    ...deviceInfo,
  };
  await (await ATDRepository.DeviceModel).update(updatedDevice);
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
  if (device?.nodeId != DevicePlugin.NODE_ID) {
    await axios.post(`${device?.host}/device-farm/api/unblock`, requestBody);
  }
  response.status(200).send({
    success: true,
  });
}

async function getQueuedSessionLength(request: Request<void>, response: Response<number>) {
  response.json((await ATDRepository.PendingSessionsModel).chain().find().count());
}

async function getQueuedSessionRequests(request: Request<void>, response: Response<unknown[]>) {
  response.json((await ATDRepository.PendingSessionsModel).chain().find().data());
}

async function getNodes(request: Request, response: Response<string[]>) {
  // unfortunately, lokijs does not support field projection
  const nodes = (await ATDRepository.DeviceModel)
    .chain()
    .find()
    .data()
    .map((node) => {
      // return ony host
      return node.host;
    });
  // unique nodes
  const uniqueNodes = _.uniq(nodes);
  response.json(uniqueNodes);
}

async function nodeAdbStatusOnOtherHost(
  currentHost: string,
  request: Request<{ host: string }>,
  response: Response<{ udid: string; host: string; state: string; platform: string }[] | string>,
) {
  const { host } = request.params;
  // when host is this hub, return status from AndroidDeviceManager directly
  // otherwise, forward request to the node
  log.info(`currentHost: ${currentHost}, host: ${host}`);
  if (host === currentHost) {
    const devices = await getDevicesFromDeviceManager();
    response.json(
      devices.map((device) => {
        return {
          udid: device.udid,
          host: device.host,
          state: device.state,
          platform: device.platform,
        };
      }),
    );
  } else {
    // find node url from database of devices
    const devices = (await (
      await ATDRepository.DeviceModel
    )
      .chain()
      .find({ host: { $contains: host } })
      .data()) as IDevice[];
    if (devices.length === 0) {
      response
        .status(404)
        .send(
          `Host ${host} does not have any devices listed in database. I don't know how to forward request to that host`,
        );
      return;
    }
    const device = devices[0];

    // if device is a cloud device, return error
    if (device.cloud) {
      response.status(400).send('Getting status from cloud node is not supported');
      return;
    }

    // remove wd/hub from url
    const normalizedUrl = device.host.replace(/\/wd\/hub$/, '');
    const url = `${normalizedUrl}/device-farm/api/node/status`;
    const result = await axios.get(url);
    response.json(result.data);
  }
}

async function nodeAdbStatusOnThisHost(
  request: Request<void>,
  response: Response<{ udid: string; host: string; state: string; platform: string }[]>,
) {
  const devices = await getDevicesFromDeviceManager();
  // return udid, host, state
  response.json(
    devices.map((device) => {
      return {
        udid: device.udid,
        host: device.host,
        state: device.state,
        platform: device.platform,
      };
    }),
  );
}

/**
 * Returns all devices from all device managers (this host only)
 * @returns IDevice[]
 */
async function getDevicesFromDeviceManager() {
  const dfm = Container.get(DeviceFarmManager);
  const instances = await dfm.deviceInstances();

  // return devices from all device managers
  const devices = [];
  for (const instance of instances) {
    const instanceDevices = await instance.getDevices(
      {
        androidDeviceType: 'both',
        iosDeviceType: 'both',
      },
      [],
    );
    devices.push(...instanceDevices);
  }

  return devices;
}

async function handleTestExecutionMetaData(req: Request, res: Response) {
  try {
    await saveTestExecutionMetaData(req);
    log.info('Saved Test Execution Meta Data.');
    res.status(200).send('{"message": "Saved Test Execution Meta Data"}');
  } catch (e) {
    const response = { message: `Failed to save Test Execution Meta Data. Error: ${e}` };
    log.error('Error while handling TestExecutionMetaData.');
    log.error(`Sending response - ${response}.`);
    res.status(500).json(response);
  }
}

function register(router: Router, pluginArgs: IPluginArgs) {
  router.get('/device', authMiddleware(pluginArgs), getDevices);
  router.get('/device/:platform', authMiddleware(pluginArgs), getDeviceByPlatform);
  router.post('/register', registerDevice);
  router.post('/updateDeviceInfo', updateDeviceInfo);
  router.post('/block', blockDevice);
  router.post('/unblock', unBlockDevice);

  // session related
  router.get('/queue/length', getQueuedSessionLength);
  router.get('/queue', getQueuedSessionRequests);

  // node related routes
  router.get('/node', getNodes);
  router.get('/node/status', nodeAdbStatusOnThisHost);
  router.get('/node/:host/status', _.curry(nodeAdbStatusOnOtherHost)(pluginArgs.bindHostOrIp));

  //router.post('/upload', uploadFile);
  //router.post('/tap', clickElementFromScreen);
  // node status
  router.get(
    '/status',
    (request: Request<void>, response: Response<{ status: string; version: string }>) => {
      response.json({
        status: 'ok',
        version: process.env.npm_package_version || 'unknown (not running from npm package)',
      });
    },
  );
  // test execution meta data
  router.post('/handleTestExecutionMetaData', handleTestExecutionMetaData);
}

export default {
  register,
};
