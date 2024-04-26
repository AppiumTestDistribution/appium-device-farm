if [ -d "dashboard-web" ]; then
  # shellcheck disable=SC2164
  cd dashboard-frontend
  npm install --force
  npm run build
  # shellcheck disable=SC2103
  cd ..
  rm -rf src/public
  mkdir src/public
  cp -R ./dashboard-frontend/dist/* src/public/
  echo "Build date - `date` by `whoami`" > src/public/version.txt
else
  echo "Directory dashboard-web does not exist."
fi
