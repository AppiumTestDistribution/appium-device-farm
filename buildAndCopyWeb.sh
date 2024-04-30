#!/bin/bash
if [ -d "dashboard-frontend" ]; then
  cd dashboard-frontend
  if [ -e "package.json" ]; then
      # shellcheck disable=SC2164
      echo 'Building dashboard-frontend...'
      npm install --force
      npm run build
      # shellcheck disable=SC2103
      cd ..
      rm -rf src/public
      mkdir src/public
      cp -R ./dashboard-frontend/dist/* src/public/
      echo "Build date - `date` by `whoami`" > src/public/version.txt
  else
    echo "Directory dashboard-frontend exists but empty."
  fi
else
  echo "Directory dashboard-frontend does not exist."
fi
