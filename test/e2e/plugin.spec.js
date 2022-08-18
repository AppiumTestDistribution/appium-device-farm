// eslint-disable-next-line @typescript-eslint/no-var-requires
var chai = require('chai'),
  // eslint-disable-next-line no-unused-vars
  should = chai.should();
import axios from 'axios';

describe('Basic Plugin Test', () => {
  it('Basic Plugin test', async () => {
    (await axios.get('http://localhost:4723/device-farm/api/devices')).status.should.eql(200);
  });
});
