cd web
npm install
npm run build
cd ..
rm -rf src/public
mkdir src/public
cp -R ./web/dist/* src/public/
echo "Build date - `date` by `whoami`" > src/public/version.txt
