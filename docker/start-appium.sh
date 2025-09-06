#!/bin/sh

set -e

# socat forwarding (background)
socat TCP-LISTEN:5554,fork TCP:host.docker.internal:5554 &
socat TCP-LISTEN:5555,fork TCP:host.docker.internal:5555 &

# Start the emulator in the background
# /start-emulator.sh &

# # Wait a bit for emulator to initialize
# sleep 10

CMD="appium server -pa $APPIUM_PATH --port $APPIUM_PORT --use-plugins=device-farm"

# List of supported device-farm arguments and their corresponding env vars
add_arg() {
  VAR_NAME="$1"
  ARG_NAME="$2"
  if [ -n "$(eval echo \$$VAR_NAME)" ]; then
    CMD="$CMD $ARG_NAME $(eval echo \$$VAR_NAME)"
  fi
}

add_flag() {
  VAR_NAME="$1"
  ARG_NAME="$2"
  if [ "$(eval echo \$$VAR_NAME)" = "true" ]; then
    CMD="$CMD $ARG_NAME"
  fi
}

# Map env vars to arguments (user should set these as env when running docker)
add_arg PLUGIN_DEVICE_FARM_PLATFORM --plugin-device-farm-platform
add_arg PLUGIN_DEVICE_FARM_ANDROID_DEVICE_TYPE --plugin-device-farm-android-device-type
add_arg PLUGIN_DEVICE_FARM_SIMULATORS --plugin-device-farm-simulators
add_arg PLUGIN_DEVICE_FARM_IOS_DEVICE_TYPE --plugin-device-farm-ios-device-type
add_arg PLUGIN_DEVICE_FARM_HUB --plugin-device-farm-hub
add_arg PLUGIN_DEVICE_FARM_REMOTE_MACHINE_PROXY_IP --plugin-device-farm-remote-machine-proxy-ip
add_arg PLUGIN_DEVICE_FARM_ADB_REMOTE --plugin-device-farm-adb-remote
add_flag PLUGIN_DEVICE_FARM_SKIP_CHROME_DOWNLOAD --plugin-device-farm-skip-chrome-download
add_arg PLUGIN_DEVICE_FARM_MAX_SESSIONS --plugin-device-farm-max-sessions
add_arg PLUGIN_DEVICE_FARM_CLOUD --plugin-device-farm-cloud
add_arg PLUGIN_DEVICE_FARM_DERIVED_DATA_PATH --plugin-device-farm-derived-data-path
add_arg PLUGIN_DEVICE_FARM_EMULATORS --plugin-device-farm-emulators
add_arg PLUGIN_DEVICE_FARM_PROXY --plugin-device-farm-proxy
add_arg PLUGIN_DEVICE_FARM_DEVICE_AVAILABILITY_TIMEOUT_MS --plugin-device-farm-device-availability-timeout-ms
add_arg PLUGIN_DEVICE_FARM_DEVICE_AVAILABILITY_QUERY_INTERVAL_MS --plugin-device-farm-device-availability-query-interval-ms
add_arg PLUGIN_DEVICE_FARM_SEND_NODE_DEVICES_TO_HUB_INTERVAL_MS --plugin-device-farm-send-node-devices-to-hub-interval-ms
add_arg PLUGIN_DEVICE_FARM_CHECK_STALE_DEVICES_INTERVAL_MS --plugin-device-farm-check-stale-devices-interval-ms
add_arg PLUGIN_DEVICE_FARM_CHECK_BLOCKED_DEVICES_INTERVAL_MS --plugin-device-farm-check-blocked-devices-interval-ms
add_arg PLUGIN_DEVICE_FARM_NEW_COMMAND_TIMEOUT_SEC --plugin-device-farm-new-command-timeout-sec
add_arg PLUGIN_DEVICE_FARM_BIND_HOST_OR_IP --plugin-device-farm-bind-host-or-ip
add_flag PLUGIN_DEVICE_FARM_ENABLE_DASHBOARD --plugin-device-farm-enable-dashboard
add_flag PLUGIN_DEVICE_FARM_REMOVE_DEVICES_FROM_DATABASE_BEFORE_RUNNING_THE_PLUGIN --plugin-device-farm-remove-devices-from-database-before-running-the-plugin
add_flag PLUGIN_DEVICE_FARM_BOOTED_SIMULATORS --plugin-device-farm-booted-simulators
add_arg PLUGIN_DEVICE_FARM_REMOTE_CONNECTION_TIMEOUT --plugin-device-farm-remote-connection-timeout
add_flag PLUGIN_DEVICE_FARM_LIVE_STREAMING --plugin-device-farm-live-streaming
add_arg PLUGIN_DEVICE_FARM_WDA_BUNDLE_ID --plugin-device-farm-wda-bundle-id
add_arg PLUGIN_DEVICE_FARM_PRE_BUILD_WDA_PATH --plugin-device-farm-pre-build-wda-path
add_flag PLUGIN_DEVICE_FARM_ENABLE_AUTHENTICATION --plugin-device-farm-enable-authentication
add_arg PLUGIN_DEVICE_FARM_ACCESS_KEY --plugin-device-farm-access-key
add_arg PLUGIN_DEVICE_FARM_TOKEN --plugin-device-farm-token
add_arg PLUGIN_DEVICE_FARM_NODE_NAME --plugin-device-farm-node-name

# Add --config if CONFIG_FILE is set
if [ -n "$CONFIG_FILE" ]; then
  CMD="$CMD --config=$CONFIG_FILE"
fi

# Run the final command
exec $CMD
