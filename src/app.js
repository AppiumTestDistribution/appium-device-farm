const express = require('express');
const app = express();
const port = 3000;
// eslint-disable-next-line import/named
import { listAllDevices } from './Devices';

app.get('/devices', (req, res) => {
  res.send(JSON.stringify(listAllDevices()));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.static('public'));
