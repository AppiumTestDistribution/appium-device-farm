const express = require('express');
const app = express();
const port = 3333;
const path = require('path');
import log from './logger';
// eslint-disable-next-line import/named
import { listAllDevices } from './Devices';

app.get('/devices', (req, res) => {
  res.send(JSON.stringify(listAllDevices()));
});

app.listen(port, () => {
  log.info(`Device Dashboard listening at http://localhost:${port}`);
});
app.use(express.static(path.join(__dirname, 'public')));
