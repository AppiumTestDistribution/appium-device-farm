import express from 'express';
import path from 'path';
import log from './logger';
import { DeviceModel, PendingSessionsModel } from './data-service/db';
import { getCLIArgs } from './data-service/pluginArgs';
import cors from 'cors';
import AsyncLock from 'async-lock';
import axios from 'axios';
import { addNewDevice, getDevice, removeDevice, updateDevice } from './data-service/device-service';
import { prisma } from './prisma';
import { MjpegProxy } from 'mjpeg-proxy';
import { SESSION_MANAGER } from './sessions/SessionManager';
import { config } from './config';

const asyncLock = new AsyncLock(),
  serverUpTime = new Date().toISOString();
let dashboardPluginUrl: any = null;

const router = express.Router(),
  apiRouter = express.Router();

const MJPEG_PROXY_CACHE: Map<string, any> = new Map();

router.use(cors());
apiRouter.use(cors());

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
  let devices = DeviceModel.find();
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

apiRouter.get('/queue', (req, res) => {
  res.json(PendingSessionsModel.chain().find().data().length);
});

apiRouter.get('/cliArgs', (req, res) => {
  res.json(getCLIArgs());
});

apiRouter.get('/devices/android', (req, res) => {
  res.json(
    DeviceModel.find({
      platform: 'android',
    })
  );
});

apiRouter.post('/register', (req, res) => {
  const requestBody = req.body;
  if (req.query.type === 'add') {
    addNewDevice(requestBody);
    requestBody.forEach((device: any) => {
      return log.info(`Adding device ${device.udid} from host ${device.host} to list!`);
    });
  } else if (req.query.type === 'remove') {
    removeDevice(requestBody);
    log.info(
      `Removing device ${requestBody.udid} from host ${requestBody.host} from list as the device was unplugged!`
    );
  }
  res.json('200');
});

apiRouter.post('/block', (req, res) => {
  const requestBody = req.body;

  const device = getDevice(requestBody);
  updateDevice(device, { busy: true, userBlocked: true });

  res.json('200');
});

apiRouter.post('/unblock', (req, res) => {
  const requestBody = req.body;

  const device = getDevice(requestBody);
  updateDevice(device, { busy: false, userBlocked: false });

  res.json('200');
});

apiRouter.get('/devices/ios', (req, res) => {
  const devices = DeviceModel.find({
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
  const sessions = await prisma.session.findMany();
  return res.json(sessions);
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

router.use('/api', apiRouter);
router.use(express.static(path.join(__dirname, 'public')));
router.use('/assets', express.static(config.sessionAssetsPath));

export { router };
