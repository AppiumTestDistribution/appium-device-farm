cd appium-dashboard
npm install --force
npm run build
cd ..
rm -rf src/public
mkdir src/public
cp -R ./appium-dashboard/dist/* src/public/
echo "Build date - `date` by `whoami`" > src/public/version.txt
