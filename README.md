# shipyard

> [secret-stack](https://github.com/ssb-js/secret-stack) server and flexible plugin loader

Secret-stack is an RPC framework where peers are connected and authenticated by their public/private keypairs using [secret-handshake](https://github.com/auditdrivencrypto/secret-handshake). Primarily used in [Secure Scuttlebutt](https://en.wikipedia.org/wiki/Secure_Scuttlebutt).

Shipyard loads [secret-stack plugins](https://github.com/ssb-js/secret-stack/blob/main/PLUGINS.md) from multiple sources and starts the server.

## Usage

`const sbot = shipyard(options = {}, { plugins = [], pluginsPath = '' })`

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard()

console.log(sbot.whoami())
```

outputs

```
{ id: '@2Lfx/jcgfUH3edxD/PBoy6c9v06NhMZEXUADj1wpQhg=.ed25519' }
```

Started a server on the default ssb network key. The data directory defaults to `process.env.ssb_appname || 'ssb'`. Standard location in ssb is `~/.ssb`

## Motivation

I want to bundle plugins that go together serving microfrontends. An effort in containing complexity for supporting many apps on ssb.

## API

### Config

Pass in custom ssb config.

```js
const shipyard = require('@metacentre/shipyard')
const sbot = shipyard({
  appname: 'ssb-shipyard',
  caps: {
    shs: 'MVZDyNf1TrZuGv3W5Dpef0vaITW1UqOUO3aWLNBp+7A=',
    sign: 'qym3eJKBjm0E0OIjuh3O1VX8+lLVSGV2p5UzrMStHTs='
  }
})
```

Data directory is now `~/.ssb-shipyard`. Alternatively you can set the ssb_appname env var before running the server `ssb_appname=ssb-shipyard`. Precedence is `config.appname` or `process.env.ssb_appname`. `'ssb'` is used if neither of the first two are set.

Network is the testnet caps, not the main ssb network.

### Plugins

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

### Load user plugins from config

User plugins are loaded from `~/.ssb/node_modules` according to config as described in [ssb-plugins](https://github.com/ssbc/ssb-plugins#load-user-configured-plugins).

### Plugin loading order

To get a minimal, unopinionated ssb server running, only three plugins are loaded by default. `ssb-db`, `ssb-master`, and `ssb-plugins` in that order. Following that plugins are loaded like so:

- user plugins from config
- shipyard plugins argument
- shipyard pluginsPath argument

Since subsequent plugins that have already been loaded are skipped by secret-stack; the above order is also the precedence. First priority is given to existing plugins defined by the user in config. Lowest priority is given to plugins loaded from a single directory.

### Leniency loading plugins

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

### Lenient list names

Loading plugins by their package npm name such as `ssb-unix-socket` we supply that name to the list. However if we pass `require('ssb-unix-socket')` to `shipyard` we need to check the plugin name which is `unix-socket`. Notice the lenient list has both names for each plugin that needs leniency.

## Make shipyard the same as ssb-server

ssb-server bundles many plugins. Load shipyard like this to load the same plugins in the same order:

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

Of course you can add further plugins to the array to augment ssb-server functionality. Be sure to pass a flattened array to `lenient`.

## Installation

With [npm](https://npmjs.org) installed, run

```shell
npm install @metacentre/shipyard
```

Alternatively ssb can host packages with [ssb-npm](https://github.com/hackergrrl/ssb-npm-101)

```shell
ssb-npm install @metacentre/shipyard
```

## Acknowledgments

shipyard was inspired by ssb-server primarily

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- [`ssbc/ssb-server`](https://github.com/ssbc/ssb-server)
- [`secure scuttlebutt`](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html)
- [`ssb whitepaper in 4 minutes (archived)`](http://web.archive.org/web/20190716152343/https://infourminutes.co/whitepaper/scuttlebutt)

## License

MIT
