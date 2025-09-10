# Use the official Appium base image
FROM --platform=$BUILDPLATFORM appium/appium:v2.19.0-p4

# Install appium-device-farm globally
USER root
RUN apt-get update && apt-get install -y git
RUN npm install -g mjpeg-consumer

RUN appium driver install --source=npm appium-uiautomator2-driver@4.2.9
RUN appium plugin install --source=npm appium-device-farm

# Set environment variables for ports (change these if needed)
ENV APPIUM_PORT=4723
ENV APPIUM_PATH=/wd/hub

# Expose Appium port and device farm default port (7000)
EXPOSE $APPIUM_PORT

# Copy and use dynamic entrypoint script
COPY start-appium.sh /start-appium.sh
RUN chmod +x /start-appium.sh

CMD ["/start-appium.sh"]