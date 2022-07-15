#!/bin/bash

device=$(curl http://localhost:4723/device-farm/api/devices/android/count)
echo $device
./node_modules/.bin/_mocha --require ts-node/register -p --jobs=$device ./test/e2e/android/*.spec.js --timeout 260000