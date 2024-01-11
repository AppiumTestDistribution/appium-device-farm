import express from 'express';
import path from 'path';

import { getCLIArgs } from '../data-service/pluginArgs';
import cors from 'cors';
import AsyncLock from 'async-lock';
import axios from 'axios';
import { config } from '../config';
import _ from 'lodash';

import DashboardRouter from './routers/dashboard';
import GridRouter from './routers/grid';

let dashboardPluginUrl: any = null;

const ASYNC_LOCK = new AsyncLock();

const router = express.Router(),
  apiRouter = express.Router(),
  staticFilesRouter = express.Router();

router.use(cors());
apiRouter.use(cors());
staticFilesRouter.use(cors());

/**
 * Middleware to check if the appium-dashboard plugin is installed
 * If the plugin is runnig, then we should enable the react app to
 * open the dashboard link upon clicking the device card in the UI.
 */

//TODO: Remove the middleware after integrating with dashbaod
apiRouter.use(async (req, res, next) => {
  await ASYNC_LOCK.acquire('dashboard-plugin-check', async () => {
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

apiRouter.get('/cliArgs', async (req, res) => {
  res.json(await getCLIArgs());
});

staticFilesRouter.use(express.static(path.join(__dirname, '..', '..', 'public')));
router.use('/api', apiRouter);
router.use('/assets', express.static(config.sessionAssetsPath));
router.use(
  '/ui-assets',
  express.static(path.join(__dirname, '..', '..', 'public', 'device-farm', 'ui-assets')),
);
router.use(staticFilesRouter);
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

DashboardRouter.register(apiRouter);
GridRouter.register(apiRouter);

export { router };
