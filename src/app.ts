import express from 'express';
import path from 'path';
import log from './logger';
import { DeviceModel, PendingSessionsModel } from './data-service/db';

const cors = require('cors');
const router = express.Router(),
  apiRouter = express.Router();

router.use(cors());
apiRouter.use(cors());

apiRouter.get('/devices', (req, res) => {
  res.json(DeviceModel.find());
});

apiRouter.get('/queue', (req, res) => {
  res.json(PendingSessionsModel.chain().find().data().length);
});

apiRouter.get('/devices/android', (req, res) => {
  res.json(
    DeviceModel.find({
      platform: 'android',
    })
  );
});

apiRouter.get('/devices/ios', (req, res) => {
  res.json(
    DeviceModel.find({
      platform: 'ios',
    })
  );
});

router.use('/api', apiRouter);
router.use(express.static(path.join(__dirname, 'public')));

export { router };
