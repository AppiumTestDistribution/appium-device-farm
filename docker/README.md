# Appium Device Farm Docker Usage

This directory contains the Dockerfile and entrypoint script for running Appium with the device-farm plugin, supporting dynamic configuration via environment variables.

## Build the Docker Image

From the project root, run:

```sh
docker build -f docker/Dockerfile -t appium-device-farm .
```

## Run the Docker Container with Device Farm Arguments

You can pass any supported device-farm plugin argument as an environment variable. For example:

```sh
docker run --rm -p 4723:4723 \
  -e PLUGIN_DEVICE_FARM_PLATFORM=android \
  -e PLUGIN_DEVICE_FARM_MAX_SESSIONS=5 \
  -e CONFIG_FILE=/serverConfig/lt-config.json \
  -e PLUGIN_DEVICE_FARM_ENABLE_DASHBOARD=true \
  -v $(pwd)/serverConfig:/serverConfig \
  appium-device-farm
```

### Explanation

- `-e PLUGIN_DEVICE_FARM_PLATFORM=android` sets the platform argument.
- `-e PLUGIN_DEVICE_FARM_MAX_SESSIONS=5` sets the max sessions.
- `-e CONFIG_FILE=/serverConfig/lt-config.json` passes a config file (mounted from the host).
- `-e PLUGIN_DEVICE_FARM_ENABLE_DASHBOARD=true` enables the dashboard flag.
- `-v $(pwd)/serverConfig:/serverConfig` mounts the host's serverConfig directory into the container.
- You can add any other supported arguments as environment variables in the same way.

## Supported Environment Variables

You can set any of the following environment variables to configure the device-farm plugin:

- PLUGIN_DEVICE_FARM_PLATFORM
- PLUGIN_DEVICE_FARM_ANDROID_DEVICE_TYPE
- PLUGIN_DEVICE_FARM_SIMULATORS
- PLUGIN_DEVICE_FARM_IOS_DEVICE_TYPE
- PLUGIN_DEVICE_FARM_HUB
- PLUGIN_DEVICE_FARM_REMOTE_MACHINE_PROXY_IP
- PLUGIN_DEVICE_FARM_ADB_REMOTE
- PLUGIN_DEVICE_FARM_SKIP_CHROME_DOWNLOAD
- PLUGIN_DEVICE_FARM_MAX_SESSIONS
- PLUGIN_DEVICE_FARM_CLOUD
- PLUGIN_DEVICE_FARM_DERIVED_DATA_PATH
- PLUGIN_DEVICE_FARM_EMULATORS
- PLUGIN_DEVICE_FARM_PROXY
- PLUGIN_DEVICE_FARM_DEVICE_AVAILABILITY_TIMEOUT_MS
- PLUGIN_DEVICE_FARM_DEVICE_AVAILABILITY_QUERY_INTERVAL_MS
- PLUGIN_DEVICE_FARM_SEND_NODE_DEVICES_TO_HUB_INTERVAL_MS
- PLUGIN_DEVICE_FARM_CHECK_STALE_DEVICES_INTERVAL_MS
- PLUGIN_DEVICE_FARM_CHECK_BLOCKED_DEVICES_INTERVAL_MS
- PLUGIN_DEVICE_FARM_NEW_COMMAND_TIMEOUT_SEC
- PLUGIN_DEVICE_FARM_BIND_HOST_OR_IP
- PLUGIN_DEVICE_FARM_ENABLE_DASHBOARD
- PLUGIN_DEVICE_FARM_REMOVE_DEVICES_FROM_DATABASE_BEFORE_RUNNING_THE_PLUGIN
- PLUGIN_DEVICE_FARM_BOOTED_SIMULATORS
- PLUGIN_DEVICE_FARM_REMOTE_CONNECTION_TIMEOUT
- PLUGIN_DEVICE_FARM_LIVE_STREAMING
- PLUGIN_DEVICE_FARM_WDA_BUNDLE_ID
- PLUGIN_DEVICE_FARM_PRE_BUILD_WDA_PATH
- PLUGIN_DEVICE_FARM_ENABLE_AUTHENTICATION
- PLUGIN_DEVICE_FARM_ACCESS_KEY
- PLUGIN_DEVICE_FARM_TOKEN
- PLUGIN_DEVICE_FARM_NODE_NAME

Set these as `-e ENV_VAR=value` when running the container.
