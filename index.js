const Server = require('./create')
const Config = require('ssb-config/inject')
const ssbPlugins = require('ssb-plugins')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const loadPlugin = require('./load-plugin')
const debug = require('debug')('shipyard')
const { announce } = require('./logging')

// prettier-ignore
function createServer(options = {}, { plugins = [], pluginsPath, lenient = [] } = {}) {
  const appname = options.appname || process.env.ssb_appname || 'ssb'

  const config = Config(appname, { ...options, appname })
  console.info(`${pkg.name} v${pkg.version} ${appname} ${config.config}`)
  console.info()

  // prettier-ignore
  const createStack = Server
    .use(require('ssb-master'))
    .use(ssbPlugins)

  /**
   * https://github.com/ssbc/ssb-plugins#load-user-configured-plugins
   *
   * load user plugins from ~/.ssb/node_modules
   * must be configured in ~/.ssb/config or
   * passed into shipyard as options
   */
  if (config.plugins) {
    announce(config, `config.plugins`, `${config.path}/node_modules`)
    ssbPlugins.loadUserPlugins(createStack, config)
  }

  // load plugins from array
  if (plugins.length > 0) {
    announce(config, `config.shipyard.packages or config.mfe.apps[{packages}] or shipyard({},{plugins})=>`, `plugins array`)
    plugins.forEach(plugin => {
      loadPlugin(createStack, plugin, lenient)
    })
  }

  // load plugins from a path
  if (pluginsPath) {
    announce(config, `config.shipyard.pluginsPath`, pluginsPath)
    fs.readdirSync(pluginsPath).map(fileName => {
      if (fileName.startsWith('.')) return
      const pluginPath = path.join(pluginsPath, fileName)
      debug('Plugin path: ', pluginPath)
      loadPlugin(createStack, pluginPath, lenient)
    })
  }

  // start server
  const server = createStack(config)

  // write RPC manifest to ~/.ssb/manifest.json
  fs.writeFileSync(
    path.join(config.path, 'manifest.json'),
    JSON.stringify(server.getManifest(), null, 2)
  )

  global.sbot = process.env.shipyard_test ? server : undefined
  return server
}

module.exports = createServer
