rm -rf /tmp/device-farm
export APPIUM_HOME=/tmp/device-farm
echo 'Building Plugin'
npm run build
echo 'Uninstall Plugin'
./node_modules/.bin/appium plugin uninstall device-farm
echo 'Install Plugin'
./node_modules/.bin/appium plugin install --source=local .

echo 'Plugin List'
./node_modules/.bin/appium plugin list

echo 'Installing UIAutomator2 driver'
./node_modules/.bin/appium driver install uiautomator2
#
#echo 'Installing XCUIDriver driver'
#./node_modules/.bin/appium driver install xcuitest