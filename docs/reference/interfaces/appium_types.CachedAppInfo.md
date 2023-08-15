# Interface: CachedAppInfo

[@appium/types](../modules/appium_types.md).CachedAppInfo

Information about a cached app instance.

## Table of contents

### Properties

- [fullPath](appium_types.CachedAppInfo.md#fullpath)
- [immutable](appium_types.CachedAppInfo.md#immutable)
- [integrity](appium_types.CachedAppInfo.md#integrity)
- [lastModified](appium_types.CachedAppInfo.md#lastmodified)
- [maxAge](appium_types.CachedAppInfo.md#maxage)
- [packageHash](appium_types.CachedAppInfo.md#packagehash)
- [timestamp](appium_types.CachedAppInfo.md#timestamp)

## Properties

### fullPath

• `Optional` **fullPath**: `string`

The full path to the cached app

#### Defined in

node_modules/@appium/types/lib/driver.ts:2088

___

### immutable

• `Optional` **immutable**: `boolean`

`true` if the file contains an `immutable` mark in `Cache-control` header

#### Defined in

node_modules/@appium/types/lib/driver.ts:2071

___

### integrity

• `Optional` **integrity**: { `file?`: `string`  } \| { `folder?`: `number`  }

An object containing either `file` property with SHA1 hash of the file or `folder` property
with total amount of cached files and subfolders

#### Defined in

node_modules/@appium/types/lib/driver.ts:2084

___

### lastModified

• `Optional` **lastModified**: `Date`

Date instance; the value of the file's `Last-Modified` header

#### Defined in

node_modules/@appium/types/lib/driver.ts:2067

___

### maxAge

• `Optional` **maxAge**: `number`

Integer representation of `maxAge` parameter in `Cache-control` header

#### Defined in

node_modules/@appium/types/lib/driver.ts:2075

___

### packageHash

• **packageHash**: `string`

SHA1 hash of the package if it is a file (and not a folder)

#### Defined in

node_modules/@appium/types/lib/driver.ts:2063

___

### timestamp

• `Optional` **timestamp**: `number`

The timestamp this item has been added to the cache (measured in Unix epoch milliseconds)

#### Defined in

node_modules/@appium/types/lib/driver.ts:2079
