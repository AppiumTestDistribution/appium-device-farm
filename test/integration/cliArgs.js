export const serverCliArgs = {
  subcommand: 'server',
  address: '0.0.0.0',
  allow_cors: undefined,
  allow_insecure: undefined,
  basePath: '/wd/hub',
  callback_address: undefined,
  callback_port: undefined,
  debug_log_spacing: undefined,
  default_capabilities: undefined,
  deny_insecure: undefined,
  keepAliveTimeout: 800,
  local_timezone: undefined,
  log: undefined,
  log_filters: undefined,
  log_level: undefined,
  log_no_colors: undefined,
  log_timestamp: undefined,
  long_stacktrace: undefined,
  no_perms_check: undefined,
  nodeconfig: undefined,
  port: 31337,
  relaxed_security: undefined,
  session_override: undefined,
  strict_caps: undefined,
  tmp: undefined,
  trace_dir: undefined,
  use_drivers: undefined,
  usePlugins: ['device-farm'],
  webhook: undefined,
  driver_xcuitest_webdriveragent_port: undefined,
  plugin_device_farm_platform: undefined,
  plugin_device_farm_android_device_type: undefined,
  plugin: {
    'device-farm': {
      iosDeviceType: 'simulated',
      platform: 'ios',
      androidDeviceType: 'both',
      skipChromeDownload: true,
    },
  },
  plugin_device_farm_hub: undefined,
  plugin_device_farm_adb_remote: undefined,
  plugin_device_farm_skip_chrome_download: undefined,
  plugin_device_farm_max_sessions: undefined,
  plugin_device_farm_cloud: undefined,
  plugin_device_farm_derived_data_path: undefined,
  shell: undefined,
  showBuildInfo: undefined,
  showConfig: undefined,
  configFile: './server-config.json',
  extraArgs: [],
  allowCors: false,
  allowInsecure: [],
  callbackPort: 4723,
  debugLogSpacing: false,
  denyInsecure: [],
  localTimezone: false,
  loglevel: 'debug',
  logNoColors: false,
  logTimestamp: false,
  longStacktrace: false,
  noPermsCheck: false,
  relaxedSecurityEnabled: false,
  sessionOverride: false,
  strictCaps: false,
  useDrivers: [],
  driver: { xcuitest: { wdaLocalPort: 8100 } },
  tmpDir: '/var/folders/fr/l_lyyktd2l3dq2yq3x3qdmbw0000gn/T',
};
