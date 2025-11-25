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
import { registerAuthenticationRoutes } from '../auth/routers';
import { userService } from '../auth/services/user.service';
import { IPluginArgs } from '../interfaces/IPluginArgs';

const dashboardPluginUrl: any = null;

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

  registerAuthenticationRoutes(apiRouter, pluginArgs);

  return router;
}

export { createRouter };
