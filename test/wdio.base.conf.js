const maxInstances = 1;
const mochaTimeout = 60000;
const waitTimeout = 10000;
const retryTimeout = 120000;
const retryCount = 3;
const logPath = './logs';
const logType = 'trace';
const bailCount = 0;

exports.logPath = logPath;
exports.config = {
  runner: 'local',
  path: '/wd/hub',
  maxInstances: maxInstances,
  logLevel: logType,
  bail: bailCount,
  waitforTimeout: waitTimeout,
  connectionRetryTimeout: retryTimeout,
  connectionRetryCount: retryCount,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: mochaTimeout,
  },
};
