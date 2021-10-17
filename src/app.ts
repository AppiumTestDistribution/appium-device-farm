import express from 'express';
const app = express();
const port = 3333;
import path from 'path';
import log from './logger';
// eslint-disable-next-line
import {
  listAllAndroidDevices,
  listAlliOSDevices,
  listAllDevices,
} from './Devices';
import { numberOfPendingSessionRequests } from './plugin';

app.get('/devices', (req, res) => {
  res.send(JSON.stringify(listAllDevices()));
});

app.get('/queue', (req, res) => {
  res.send(JSON.stringify(numberOfPendingSessionRequests()));
});

app.get('/devices/android', (req, res) => {
  res.send(JSON.stringify(listAllAndroidDevices()));
});

app.get('/devices/ios', (req, res) => {
  res.send(JSON.stringify(listAlliOSDevices()));
});

app.listen(port, () => {
  log.info(`Device Dashboard listening at http://localhost:${port}`);
});
app.use(express.static(path.join(__dirname, 'public')));
