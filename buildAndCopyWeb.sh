#!/bin/bash
if [ -d "falx-ui" ]; then
  cd falx-ui
  if [ -e "package.json" ]; then
      # shellcheck disable=SC2164
      echo 'Building falx-ui...'
      npm install --force
      npm run build
      # shellcheck disable=SC2103
      cd ..
      rm -rf src/public
      mkdir src/public
      cp -R ./falx-ui/dist/* src/public/
      echo "Build date - `date` by `whoami`" > src/public/version.txt
  else
    echo "Directory falx-ui exists but empty."
  fi
else
  echo "Directory falx-ui does not exist."
fi
