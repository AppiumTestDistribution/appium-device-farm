#!/bin/bash

# Start Xvfb for headless display
Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &
export DISPLAY=:99

# Wait for Xvfb to start
sleep 2

# Start Android emulator
echo "Starting Android emulator..."
$ANDROID_SDK_ROOT/emulator/emulator -avd test_emulator \
    -no-audio \
    -no-window \
    -gpu swiftshader_indirect \
    -no-snapshot \
    -no-boot-anim \
    -camera-back none \
    -camera-front none \
    -qemu -m 2048 &

# Wait for emulator to be ready
echo "Waiting for emulator to start..."
adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed | tr -d '\r') ]]; do sleep 1; done; input keyevent 82'

echo "Emulator is ready!"