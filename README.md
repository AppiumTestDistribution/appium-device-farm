# appium-device-farm

<h1 align="center">
	<br>
	<img src="assets/DeviceFarm-Logo.jpg" alt="DeviceFarm">
	<br>
	<br>
	<br>
</h1>

[![Build Status](https://dev.azure.com/saikrishna321/ATD/_apis/build/status/AppiumTestDistribution.appium-device-farm?branchName=main)](https://dev.azure.com/saikrishna321/ATD/_build/latest?definitionId=11&branchName=main) [![npm version](https://badge.fury.io/js/appium-device-farm.svg)](https://badge.fury.io/js/appium-device-farm)

This is an Appium plugin designed to manage and create driver session on connected android, iOS real devices, emulators and Simulators.

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
