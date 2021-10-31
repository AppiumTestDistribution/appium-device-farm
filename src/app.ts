import express from 'express';
import path from 'path';
import log from './logger';
// eslint-disable-next-line
import {
  listAllAndroidDevices,
  listAlliOSDevices,
  listAllDevices,
} from './Devices';
import { numberOfPendingSessionRequests } from './plugin';

const router = express.Router(),
  apiRouter = express.Router();

apiRouter.get('/devices', (req, res) => {
  res.send(JSON.stringify(listAllDevices()));
});

apiRouter.get('/queue', (req, res) => {
  res.send(JSON.stringify(numberOfPendingSessionRequests()));
});

apiRouter.get('/devices/android', (req, res) => {
  res.send(JSON.stringify(listAllAndroidDevices()));
});

apiRouter.get('/devices/ios', (req, res) => {
  res.send(JSON.stringify(listAlliOSDevices()));
});

router.use('/api', apiRouter);
router.use(express.static(path.join(__dirname, 'public')));

export { router };
