# Interface: IDeviceSettings<T\>

[@appium/types](../modules/appium_types.md).IDeviceSettings

Interface implemented by the `DeviceSettings` class in `@appium/base-driver`

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`StringRecord`](../modules/appium_types.md#stringrecord) |

## Table of contents

### Methods

- [getSettings](appium_types.IDeviceSettings.md#getsettings)
- [update](appium_types.IDeviceSettings.md#update)

## Methods

### getSettings

▸ **getSettings**(): `T`

#### Returns

`T`

#### Defined in

node_modules/@appium/types/lib/driver.ts:17

___

### update

▸ **update**(`newSettings`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newSettings` | `T` |

#### Returns

`Promise`<`void`\>

#### Defined in

node_modules/@appium/types/lib/driver.ts:16
