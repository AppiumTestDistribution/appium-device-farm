const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
// eslint-disable-next-line import/named
import { listAllDevices } from './Devices';

app.get('/devices', (req, res) => {
  res.send(JSON.stringify(listAllDevices()));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));
