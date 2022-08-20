rm -rf /tmp/some-temp-dir
export APPIUM_HOME=/tmp/some-temp-dir
echo 'Building Plugin'
npm run build
echo 'Uninstall Plugin'
./node_modules/.bin/appium plugin uninstall device-farm
echo 'Install Plugin'
./node_modules/.bin/appium plugin install --source=local .