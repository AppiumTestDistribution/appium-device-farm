# appium-device-farm

<h1 align="center">
	<br>
	<img src="assets/DeviceFarm-Logo.jpg" alt="DeviceFarm">
	<br>
	<br>
	<br>
</h1>

[![Build Status](https://dev.azure.com/saikrishna321/ATD/_apis/build/status/AppiumTestDistribution.appium-device-farm?branchName=main)](https://dev.azure.com/saikrishna321/ATD/_build/latest?definitionId=11&branchName=main) [![npm version](https://badge.fury.io/js/appium-device-farm.svg)](https://badge.fury.io/js/appium-device-farm)

Appium Device-farm is a powerful plugin designed specifically to manage and streamline the creation of driver sessions for connected devices, including Android and iOS real devices, emulators, and simulators. This plugin extends the capabilities of Appium, making it easier for developers and testers to automate testing processes across a wide range of device types, ensuring that applications function smoothly in diverse environments.

With Appium Device-farm, teams can:

 * Remotely manage sessions for physical Android and iOS devices, emulators, and simulators, allowing for extensive cross-platform testing without the need for manual device handling.
 * Automate test execution across multiple devices simultaneously, reducing the time and effort required to perform comprehensive application testing.
 * Scale testing efforts to cover a broad array of device and OS combinations, ensuring that apps perform consistently across different hardware and software configurations.
 * Integrate seamlessly with CI/CD pipelines to automate testing as part of continuous integration workflows, catching bugs and issues early in the development cycle.
 * Monitor and manage test sessions through a user-friendly dashboard, providing real-time visibility into ongoing tests and detailed logs for easy debugging and troubleshooting.
 * Record and replay test runs, enabling teams to review test executions, reproduce issues, and ensure thorough testing coverage.

Testimonial
 * Appium Device-farm Brought a Revolutionary Change to Our Team’s Testing Processes

One of the biggest challenges we faced in our software development projects was testing the consistency of our applications across different devices and operating systems. Accessing physical devices with various hardware and software combinations was always difficult and costly. However, Appium Device-farm completely solved this issue by making our testing processes both faster and more comprehensive. This has allowed us to effortlessly scale our testing efforts as project demands grow, while still delivering high-quality releases.

 * Remote Testing on Real Devices

One of its greatest benefits is the ability to remotely test on real devices. Without the need to own physical devices, we can test our applications on devices around the world. This has been especially advantageous for our teams developing cross-platform applications (iOS, Android). Thanks to the wide variety of devices available, we can ensure that our software runs smoothly on every device in the market. Additionally, this feature has drastically reduced the time we spend setting up and maintaining test environments, freeing up resources to focus more on development and innovation.

 * Accelerating Processes with Automated Test Integrations

Automated test integrations have significantly sped up our processes as well. With Appium Device-farm’s automated testing support, we can easily integrate tests into our continuous integration (CI) pipelines. This allows us to run automated tests across a broad range of devices immediately after code changes, reducing the manual testing load and identifying potential issues much earlier. Its seamless integration with our CI/CD workflows has improved our development cycle efficiency, ensuring faster release cycles without compromising quality.

 * Monitoring and Recording Test Runs via the Dashboard

Thanks to Appium Device-farm’s dashboard, we were able to monitor our automation test runs in real-time and even record them for later review. The detailed logs provided in the dashboard allowed us to resolve code errors quickly and with minimal effort. These monitoring and debugging capabilities have enabled our team to tackle issues more efficiently and provide rapid solutions.

 * Perfect Adaptation to Remote Work

Appium Device-farm has seamlessly adapted to our team’s remote working setup. Developers and test engineers located in different cities and countries can perform their tests without being limited by device availability. This has not only sped up our workflow but also strengthened collaboration within the team. The ability to share test results and logs in real time has improved communication across the team, allowing for quicker troubleshooting and more efficient collaboration between developers and testers.

 * Comprehensive Test Reporting and Insights

Another key feature that has been invaluable to our team is the detailed reporting and insights provided by Appium Device-farm. We can easily track the performance of our tests, identify potential bottlenecks, and analyze failures with clear, actionable data. This has allowed us to make informed decisions about where to focus our debugging efforts and has greatly improved visibility into the overall health of our applications.

 * More Reliable and Comprehensive Testing Processes

Appium Device-farm has not only optimized our testing processes but also significantly improved the quality of our software. It has enabled our team to perform more reliable, comprehensive, and faster tests, ensuring that our applications are robust against all scenarios before reaching the end-users. With its extensive device coverage, automation capabilities, and user-friendly interface, Appium Device-farm has become an indispensable part of our development and testing workflow.

Testimonial (Veera)

Appium device farms makes both developer and testers life easy with the capability and features available.

Due to pandemic situations we are unable to test different applications on different devices but with the remote control feature we are able to test everything by keeping all devices connected in one place…

With the help of appium dashboard feature it makes life easy to identify, debug and fix the issues without keeping more effort.

Previously we are using appium start the server and stop the server for each test and it needs to build the configuration files runtime by checking ports available and all… but with the help of device farm able to configure the grid within minutes without facing any issues which reduces the more manual and monitoring effort

With the help of apps feature we are able perform backward compatibility testing without doing any manual intervention just by passing automation name in the capacity with the help of appium device farm.

The support and resources provided by the Appium device farm team were invaluable in getting things running smoothly. We're incredibly grateful for the dedication and hard work of the Appium device farm team, and we look forward to seeing the platform continue to evolve.

## Documentation

The [Documentation](https://devicefarm.org/) is hosted separately at
[Device Farm](https://devicefarm.org/)

## Contributing & Development

Clone this project from GitHub and run:

```bash
npm install
```

To run unit/functional tests:

```bash
npm test # unit
npm run integration-android # Android integration tests
npm run integration-ios # iOS integration tests
```

To build docs locally:

```bash
npm install
npm run build
npm run install-docs-deps
npm run build:docs
```

Navigate to site directory and open index.html to view the site locally.

## Licensing

The Appium Device Farm Plugin uses a hybrid licensing model to balance open-source principles with the protection of certain proprietary components:

1. **Open Source Components**:
   The majority of this project is open source and licensed under the MIT License. This includes all files and directories except those explicitly listed as proprietary.

2. **Proprietary Components**:
   The following components, while included in the distribution, are proprietary and provided in an obfuscated form:

   - src/modules/
   - dashboard-frontend

   These components are integral parts of the plugin but their source code is not open for modification or redistribution.

### Using the Appium Device Farm Plugin

The Appium Device Farm Plugin, including both open source and obfuscated proprietary components, is freely available for use under the terms specified in the LICENSE file. Users can utilize all functionalities provided by the plugin, including those powered by the proprietary components.

### Important Notes on Proprietary Components

- While the proprietary components are included in the distribution, their source code is not available for viewing, modification, or redistribution.
- These components are provided in an obfuscated form to protect our intellectual property.
- Users are granted the right to use these components as part of the Appium Device Farm Plugin, but not to decompile, reverse engineer, or attempt to extract the original source code.

### Contributions and Modifications

- Contributions and modifications to the open-source portions of the plugin are welcome.
- Please note that it is not possible to contribute to or modify the proprietary components due to their obfuscated nature.

For full license details, please see the [LICENSE](LICENSE) file in this repository. If you have any questions about the licensing or use of the Appium Device Farm Plugin, please open an issue in this repository.

## Thanks to contributors 💙

<a href="https://github.com/AppiumTestDistribution/appium-device-farm/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AppiumTestDistribution/appium-device-farm" />
</a>
