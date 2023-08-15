# Interface: ServerOpts<\>

[@appium/base-driver](../modules/appium_base_driver.md).ServerOpts

## Table of contents

### Properties

- [allowCors](appium_base_driver.ServerOpts.md#allowcors)
- [basePath](appium_base_driver.ServerOpts.md#basepath)
- [cliArgs](appium_base_driver.ServerOpts.md#cliargs)
- [extraMethodMap](appium_base_driver.ServerOpts.md#extramethodmap)
- [hostname](appium_base_driver.ServerOpts.md#hostname)
- [keepAliveTimeout](appium_base_driver.ServerOpts.md#keepalivetimeout)
- [port](appium_base_driver.ServerOpts.md#port)
- [routeConfiguringFunction](appium_base_driver.ServerOpts.md#routeconfiguringfunction)
- [serverUpdaters](appium_base_driver.ServerOpts.md#serverupdaters)

## Properties

### allowCors

• **allowCors**: `undefined` \| `boolean`

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:303

___

### basePath

• **basePath**: `undefined` \| `string`

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:304

___

### cliArgs

• **cliArgs**: `undefined` \| [`ServerArgs`](../modules/appium_types.md#serverargs)

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:301

___

### extraMethodMap

• **extraMethodMap**: `undefined` \| `Readonly`<[`DriverMethodMap`](appium_types.DriverMethodMap.md)<[`ExternalDriver`](appium_types.ExternalDriver.md)<[`Constraints`](../modules/appium_types.md#constraints), `string`, [`StringRecord`](../modules/appium_types.md#stringrecord), [`StringRecord`](../modules/appium_types.md#stringrecord), [`DefaultCreateSessionResult`](../modules/appium_types.md#defaultcreatesessionresult)<[`Constraints`](../modules/appium_types.md#constraints)\>, `void`, [`StringRecord`](../modules/appium_types.md#stringrecord)\>\>\>

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:305

___

### hostname

• **hostname**: `undefined` \| `string`

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:302

___

### keepAliveTimeout

• **keepAliveTimeout**: `undefined` \| `number`

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:307

___

### port

• **port**: `number`

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:300

___

### routeConfiguringFunction

• **routeConfiguringFunction**: `RouteConfiguringFunction`

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:299

___

### serverUpdaters

• **serverUpdaters**: `undefined` \| [`UpdateServerCallback`](../modules/appium_types.md#updateservercallback)[]

#### Defined in

node_modules/@appium/base-driver/lib/express/server.js:306
