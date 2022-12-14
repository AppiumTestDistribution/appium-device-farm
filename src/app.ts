import express from 'express';
import path from 'path';
import log from './logger';
import { DeviceModel, PendingSessionsModel } from './data-service/db';
import { getCLIArgs } from './data-service/pluginArgs';
import cors from 'cors';
import AsyncLock from 'async-lock';
import axios from 'axios';

const asyncLock = new AsyncLock(),
  serverUpTime = new Date().toISOString();
let dashboardPluginUrl: any = null;

const router = express.Router(),
  apiRouter = express.Router();

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
  res.json(devices);
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

router.use('/api', apiRouter);
router.use(express.static(path.join(__dirname, 'public')));

export { router };
