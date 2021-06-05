const Server = require('./create')
const Config = require('ssb-config/inject')
const ssbPlugins = require('ssb-plugins')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const loadPlugin = require('./load-plugin')

// prettier-ignore
function createServer(options = {}, { plugins = [], pluginsPath, lenient = [] } = {}) { 
  const appname = options.appname || process.env.ssb_appname || 'ssb'
  console.info(`${pkg.name} v${pkg.version}`)
  console.info('creating ssb server with appname: ', appname)

  const config = Config(appname, { ...options, appname })
  // prettier-ignore
  const createStack = Server
    .use(require('ssb-master'))
    .use(ssbPlugins)

  // load user plugins from ~/.ssb/node_modules
  // must be configured in ~/.ssb/config or
  // passed into this function as options
  ssbPlugins.loadUserPlugins(createStack, config)

  // load plugins from array
  if (plugins.length > 0) {
    plugins.forEach(plugin => {
      loadPlugin(createStack, plugin, lenient)
    })
  }

  // load plugins from a path
  if (pluginsPath) {
    console.info(`Loading plugins from ${pluginsPath}`)
    fs.readdirSync(pluginsPath).map(fileName => {
      if (fileName.startsWith('.')) return
      const pluginPath = path.join(pluginsPath, fileName)
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

  return server
}

module.exports = createServer
