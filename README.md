# shipyard

> [secret-stack](https://github.com/ssb-js/secret-stack) server and flexible plugin loader

Secret-stack is an RPC framework where peers are connected and authenticated by their public/private keypairs using [secret-handshake](https://github.com/auditdrivencrypto/secret-handshake). Primarily used in [Secure Scuttlebutt](https://en.wikipedia.org/wiki/Secure_Scuttlebutt).

Shipyard loads [secret-stack plugins](https://github.com/ssb-js/secret-stack/blob/main/PLUGINS.md) from multiple sources and starts the server.

# Usage

`const sbot = shipyard(options = {}, { plugins = [], pluginsPath = '' })`

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard({}, plugins: ['ssb-db', 'ssb-master'])

console.log(sbot.whoami())
```

outputs

```
{ id: '@2Lfx/jcgfUH3edxD/PBoy6c9v06NhMZEXUADj1wpQhg=.ed25519' }
```

Started a server on the default ssb network key. The data directory defaults to `process.env.ssb_appname || 'ssb'`. Standard location in ssb is `~/.ssb`

# Minimum plugins required

If you're running an ssb server with shipyard the first two plugins you pass _*must*_ be `ssb-db` and `ssb-master`. Previously shipyard loaded them both by default, however to enable any secret-stack to be built, not necessarily ssb, they were removed. This also means shipyard can now use `ssb-db2` instead of `ssb-db`.

# Installation

With [npm](https://npmjs.org) installed, run

```shell
npm install @metacentre/shipyard
```

Alternatively ssb can host packages with [ssb-npm](https://github.com/hackergrrl/ssb-npm-101)

```shell
ssb-npm install @metacentre/shipyard
```

# Motivation

I want to bundle plugins that go together serving microfrontends. An effort in containing complexity for supporting many apps on ssb.

# API

## Config

Pass in custom ssb config.

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard(
  {
    appname: 'ssb-shipyard',
    caps: {
      shs: 'InRNDNSnLJasGWEPLe7zPAj8kHAgOesoPgczeV3g4Y0=',
      sign: 'mH1wBje2HmVQgG6yXxkwrUTqseLOwgDEnq2IPJJYX0I='
    }
  },
  { plugins: ['your-plugins'] }
)
```

Data directory is now `~/.ssb-shipyard`. Alternatively you can set the ssb_appname env var before running the server `ssb_appname=ssb-shipyard`. Precedence is `config.appname` or `process.env.ssb_appname`. `'ssb'` is used if neither of the first two are set.

Network is the testnet caps, not the main ssb network.

## Plugins

Load all plugins in a directory. Particularly useful for local development.

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard(
  {},
  { pluginsPath: '/home/av8ta/metacentre/ship/plugins' }
)
```

Load npm plugins from an array.

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard({}, { plugins: ['ssb-identities', 'ssb-lan'] })
```

Recursively load arrays of arrays of npm plugins. Left to right order is preserved.

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard({}, { plugins: ['ssb-identities', ['ssb-lan']] })
```

Load npm plugins or local plugins from paths. Must be absolute paths.

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard({}, { plugins: ['/home/av8ta/.ssb/plugins/ssb-viewer'] })
```

For relative path use `__dirname`.

```js
const shipyard = require('@metacentre/shipyard')
const { join } = require('path')

const relativePath = join(
  __dirname,
  'test',
  'ssb-shipyard',
  'node_modules',
  '@metacentre',
  'test'
)
const sbot = shipyard({}, { plugins: [relativePath] })
```

Load from commonjs modules. Modules can also require further modules.

```js
// rabbits/index.js
module.exports = [['ssb-plugin-on-npm'], [require('../more-rabbits')]]
```

```js
const shipyard = require('@metacentre/shipyard')
const { join } = require('path')
const packagePath = join(__dirname, 'test/ssb-shipyard/node_modules/rabbits')
const rabbitHole = require(packagePath)

const sbot = shipyard({}, { plugins: [rabbitHole] })
```

## Load user plugins from config

User plugins are loaded from `~/.ssb/node_modules` according to config as described in [ssb-plugins](https://github.com/ssbc/ssb-plugins#load-user-configured-plugins).

## Plugin loading order

To get a minimal, unopinionated secret-stack server running, only `ssb-plugins` is loaded by default. Following that plugins are loaded like so:

- user plugins from config
- shipyard plugins argument
- shipyard pluginsPath argument

Since subsequent plugins that have already been loaded are skipped by secret-stack; the above order is also the precedence. First priority is given to existing plugins defined by the user in config. Lowest priority is given to plugins loaded from a single directory.

## Leniency loading plugins

Pass the list of plugins you want to be lenient with when loading. Otherwise some plugins will not load. Why? Shipyard checks the shape of plugins to ensure they are:

```js
{
  name: '',
  version: '',
  manifest: {},
  init: () =>
}
```

However some plugins such as `ssb-unix-socket` are not of the standard shape. Some are missing the manifest because they don't add methods to the RPC. Some are not even objects; they're functions. These ssb-server plugins are well established and work well so we don't want to skip loading them, so instead we pass the list of plugins to be lenient when loading them.

Pass the list of plugins to shipyard to load along with a list of plugins to be lenient with.

```js
const shipyard = require('@metacentre/shipyard')
const ssbPlugins = require('a-list-of-plugins')
const lenientList = require('a-list-of-plugins/lenient')

const sbot = shipyard(
  {},
  {
    plugins: ssbPlugins,
    lenient: lenientList
  }
)
```

If you're building your own secret-stack rather than an ssb stack it's recommended to write plugins of the standard object shape described above. If you do this you won't need to use a lenient list at all.

## Lenient list names

When loading plugins by their npm package name such as `ssb-unix-socket` we supply that name to the list. However if we pass `require('ssb-unix-socket')` to `shipyard` we need to check the secret-stack plugin name which is `unix-socket`. Notice the lenient list exported at [@metacentre/shipyard-ssb/lenient](https://github.com/metacentre/shipyard-ssb/blob/master/lenient.js) has both names for each plugin that needs leniency (`ssb-unix-socket` and `unix-socket` etc).

# Make shipyard the same as ssb-server

ssb-server bundles many plugins. Configure shipyard like this to load the same plugins in the same order:

```js
const shipyard = require('@metacentre/shipyard')
const ssbServerPlugins = require('@metacentre/shipyard-ssb')
const lenientList = require('@metacentre/shipyard-ssb/lenient')

const sbot = shipyard(
  {},
  {
    plugins: ssbServerPlugins,
    lenient: lenientList
  }
)
```

Of course you can add further plugins to the array to augment ssb-server functionality. Be sure to pass a flattened array: `lenient: [...list1, ...list2]`. Plugins load recursively so the plugins array need not be flat.

# Usage as cli tool

```shell
shipyard
```

## Installation

```shell
npm i -g @metacentre/shipyard
```

This will start a server using the data directory defined by the env var ssb_appname. If the env var is not set the appname defaults to `ssb` storing data in `~/.ssb` including config in `~/.ssb/config`

## Configuration

Pass in the appname. All configuration comes from `~/.<appname>/config`

```shell
shipyard ssb-test
```

Reads configuration from `~/.ssb-test/config`

## Config options

- `pluginsPath` absolute path to directory of plugins to load
- `packages` list of npm packages of plugins to require

```json
{
  "shipyard": {
    "pluginsPath": "/home/av8ta/ssb/plugins",
    "packages": [
      {
        "plugins": "@ssb-org/ssb-plugins",
        "lenient": "@ssb-org/ssb-plugins/lenient"
      },
      {
        "plugins": "@ssb-org/other-ssb-plugins",
        "lenient": "@ssb-org/other-ssb-plugins/lenient"
      }
    ]
  }
}
```

`packages` are loaded from the first `node_modules` directory nodejs finds when trying to resolve them.

Simplest solution is to install the packages to `~/node_modules` as nodejs will look there and it makes a handy location to centralise your secret-stack plugins.

This way you can install them only once in the home directory and use shipyard with varying config (secret, caps, plugins etc) by simply passing a different appname for each one and setting the config file appropriately for your needs.

## Plugin loading order

The same as when used as a library:

- ssb-plugins user config
- shipyard packages config
- shipyard pluginsPath config

The ordering is the same with the cli command because `shipyard.packages` are reduced to an array and passed to `plugins` while `pluginsPath` is passed straight through to the library function.

If you want a different version of a plugin loaded for a certain appname, then install the plugin in the `~/.<appname>/node_modules` directory as per [ssb-plugins](https://github.com/ssbc/ssb-plugins#load-user-configured-plugins). That way the different versioned plugin will load first with the normal version in `~/node_modules` being skipped.

# Run server similar to ssb-server with the cli

```shell
shipyard
```

add to: `~/.ssb/config`

```json
{
  "shipyard": {
    "packages": [
      {
        "plugins": "@metacentre/shipyard-ssb",
        "lenient": "@metacentre/shipyard-ssb/lenient"
      },
      {
        "plugins": "@metacentre/shipyard-oasis",
        "lenient": "@metacentre/shipyard-oasis/lenient"
      }
    ]
  }
}
```

Install packages from npm to shared `node_modules` directory in home. shipyard will load them from there. You may want to set up a package.json in your home directory first if you haven't already.

```shell
cd ~
npm i @metacentre/shipyard-ssb @metacentre/shipyard-oasis flumedb
shipyard
```

This server will also talk to oasis, as it loads oasis plugins after the ssb-server plugins.

# Acknowledgments

shipyard is inspired by ssb-server

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- [`ssbc/ssb-server`](https://github.com/ssbc/ssb-server)
- [`secure scuttlebutt`](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html)
- [`ssb whitepaper in 4 minutes (archived)`](http://web.archive.org/web/20190716152343/https://infourminutes.co/whitepaper/scuttlebutt)

## License

MIT
