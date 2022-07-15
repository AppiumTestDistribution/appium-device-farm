#!/bin/bash

until $(curl --output /dev/null --silent --head --fail http://localhost:4723/device-farm/); do
    printf '.'
    sleep 5
done

device=$(curl http://localhost:4723/device-farm/api/devices/android/count)
echo $device
./node_modules/.bin/_mocha --require ts-node/register -p --jobs=$device ./test/e2e/android/*.spec.js --timeout 260000