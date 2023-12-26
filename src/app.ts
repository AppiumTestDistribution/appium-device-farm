import express from 'express';
import path from 'path';
import log from './logger';
import { ADTDatabase } from './data-service/db';
import { getCLIArgs } from './data-service/pluginArgs';
import cors from 'cors';
import AsyncLock from 'async-lock';
import axios from 'axios';
import {
  addNewDevice,
  userBlockDevice,
  getDevice,
  removeDevice,
  userUnblockDevice,
} from './data-service/device-service';
import { prisma } from './prisma';
import { MjpegProxy } from 'mjpeg-proxy';
import { SESSION_MANAGER } from './sessions/SessionManager';
import { config } from './config';
import _ from 'lodash';

const asyncLock = new AsyncLock(),
  serverUpTime = new Date().toISOString();
let dashboardPluginUrl: any = null;

const router = express.Router(),
  apiRouter = express.Router(),
  staticFilesRouter = express.Router();

const MJPEG_PROXY_CACHE: Map<string, any> = new Map();

router.use(cors());
apiRouter.use(cors());
staticFilesRouter.use(cors());

/**
 * Middleware to check if the appium-dashboard plugin is installed
 * If the plugin is runnig, then we should enable the react app to
 * open the dashboard link upon clicking the device card in the UI.
 */
apiRouter.use(async (req, res, next) => {
  await asyncLock.acquire('dashboard-plugin-check', async () => {
    if (dashboardPluginUrl == null) {
      const pingurl = `${req.protocol}://${req.get('host')}/dashboard/api/ping`;
      try {
        const response: any = await axios.get(pingurl);
        if (response.data['pong']) {
          dashboardPluginUrl = `${req.protocol}://${req.get('host')}/dashboard`;
        } else {
          dashboardPluginUrl = '';
        }
      } catch (err) {
        dashboardPluginUrl = '';
      }
    }
  });
  (req as any)['dashboard-plugin-url'] = dashboardPluginUrl;
  return next();
});

apiRouter.get('/devices', async (req, res) => {
  let devices = (await ADTDatabase.DeviceModel).find();
  if (req.query.sessionId) {
    return res.json(devices.find((value) => value.session_id === req.query.sessionId));
  }
  /* dashboard-plugin-url is the base url for opening the appium-dashboard-plugin
   * This value will be attached to all express request via middleware
   */
  const dashboardPluginUrl = (req as any)['dashboard-plugin-url'];
  if (dashboardPluginUrl) {
    const sessions =
      (await axios.get(`${dashboardPluginUrl}/api/sessions?start_time=${serverUpTime}`)).data
        ?.result?.rows || [];
    const deviceSessionMap: any = {};
    sessions.forEach((session: any) => {
      if (!deviceSessionMap[session.udid]) {
        deviceSessionMap[session.udid] = [];
      }
      deviceSessionMap[session.udid].push(session);
    });
    devices = devices.map((d) => {
      d.dashboard_link = `${dashboardPluginUrl}?device_udid=${d.udid}&start_time=${serverUpTime}`;
      d.total_session_count = deviceSessionMap[d.udid]?.length || 0;
      return d;
    });
  }
  return res.json(devices);
});

apiRouter.get('/queues/length', async (req, res) => {
  res.json((await ADTDatabase.PendingSessionsModel).chain().find().count());
});

apiRouter.get('/queues', async (req, res) => {
  res.json((await ADTDatabase.PendingSessionsModel).chain().find().data());
});

apiRouter.get('/cliArgs', async (req, res) => {
  res.json(await getCLIArgs());
});

apiRouter.get('/devices/android', async (req, res) => {
  res.json(
    (await ADTDatabase.DeviceModel).find({
      platform: 'android',
    }),
  );
});

apiRouter.post('/register', async (req, res) => {
  const requestBody = req.body;
  if (req.query.type === 'add') {
    const addedDevices = await addNewDevice(requestBody);
    if (addedDevices.length > 0) log.info(`Added new devices: ${JSON.stringify(addedDevices)}`);
  } else if (req.query.type === 'remove') {
    await removeDevice(requestBody);
  }
  res.json('200');
});

apiRouter.post('/block', async (req, res) => {
  const requestBody = req.body;

  const device = await getDevice(requestBody);
  if (device != undefined) await userBlockDevice(device.udid, device.host);

  res.json('200');
});

apiRouter.post('/unblock', async (req, res) => {
  const requestBody = req.body;

  const device = await getDevice(requestBody);
  if (device != undefined) await userUnblockDevice(device.udid, device.host);

  res.json('200');
});

apiRouter.get('/devices/ios', async (req, res) => {
  const devices = (await ADTDatabase.DeviceModel).find({
    platform: 'ios',
  });
  if (req.query.deviceType === 'real') {
    const realDevices = devices.filter((value) => value.deviceType === 'real');
    res.json(realDevices);
  } else if (req.query.deviceType === 'simulated') {
    const simulators = devices.filter((value) => value.deviceType === 'simulator');
    if (Object.hasOwn(req.query, 'booted')) {
      res.json(simulators.filter((value) => value.state === 'Booted'));
    } else {
      res.json(simulators);
    }
  } else {
    res.json(devices);
  }
});

apiRouter.get('/session', async (req, res) => {
  const buildId = req.query.buildId;
  const sessions = await prisma.session.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      build_id: buildId as any,
    },
  });
  return res.status(200).json(sessions);
});

apiRouter.get('/build', async (req, res) => {
  const builds = await prisma.build.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).json(builds);
});

apiRouter.get('/session/:sessionId/live_video', async (req, res) => {
  const sessionId = req.params.sessionId;
  const session = SESSION_MANAGER.getSession(req.params.sessionId);
  if (!session) {
    return res.status(404).send({
      error: true,
      message: `Sesssion with id ${sessionId} not found`,
    });
  }

  const videoUrl = session.getLiveVideoUrl();
  if (videoUrl) {
    if (!MJPEG_PROXY_CACHE.has(sessionId)) {
      MJPEG_PROXY_CACHE.set(sessionId, new MjpegProxy(videoUrl));
    }

    MJPEG_PROXY_CACHE.get(sessionId)?.proxyRequest(req, res);
  } else {
    return res.status(500).send({
      error: true,
      message: `Live video not available for session with id ${sessionId}`,
    });
  }
});

staticFilesRouter.use(express.static(path.join(__dirname, '..', 'public')));
router.use('/api', apiRouter);
router.use(staticFilesRouter);
router.use('/assets', express.static(config.sessionAssetsPath));

export { router };
