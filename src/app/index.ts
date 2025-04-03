import express from 'express';
import path from 'path';
import fs from 'fs';
import { getCLIArgs } from '../data-service/pluginArgs';
import cors from 'cors';
import AsyncLock from 'async-lock';
import axios from 'axios';
import { config } from '../config';
import _ from 'lodash';

import GridRouter from './routers/grid';
import authRouter from '../auth/routers';
import { userService } from '../auth/services/user.service';
import { IPluginArgs } from '../interfaces/IPluginArgs';

let dashboardPluginUrl: any = null;

const ASYNC_LOCK = new AsyncLock();

const router = express.Router(),
  apiRouter = express.Router(),
  staticFilesRouter = express.Router();

router.use(cors());
apiRouter.use(cors());
staticFilesRouter.use(cors());

function getPublicDirectory() {
  return fs.existsSync(path.join(__dirname, 'public')) &&
    fs.statSync(path.join(__dirname, 'public')).isDirectory()
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '..', '..', 'public');
}

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

const PUBLIC_DICRECTORY = getPublicDirectory();
staticFilesRouter.use(express.static(PUBLIC_DICRECTORY));

router.use('/api', apiRouter);
router.use('/assets', express.static(config.sessionAssetsPath));
router.use('/apps', express.static(config.appsPath));
router.use('/ui-assets', express.static(path.join(PUBLIC_DICRECTORY, 'device-farm', 'ui-assets')));
router.use(staticFilesRouter);

function createRouter(pluginArgs: IPluginArgs) {
  GridRouter.register(apiRouter, pluginArgs);

  // Initialize admin user if needed
  userService.createInitialAdminIfNeeded().catch((err) => {
    console.error('Error creating initial admin user:', err);
  });

  // Mount the auth router
  router.use('/admin', authRouter);

  return router;
}

export { createRouter };
