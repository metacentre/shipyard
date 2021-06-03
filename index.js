const Server = require('./create')
const Config = require('ssb-config/inject')
const ssbPlugins = require('ssb-plugins')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')

function createServer(options = {}, { plugins = [], pluginsPath } = {}) {
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
      createStack.use(require(plugin))
    })
  }

  // load plugins from a path
  if (pluginsPath) {
    console.info(`Loading plugins from ${pluginsPath}`)
    fs.readdirSync(pluginsPath).map(fileName => {
      if (fileName.startsWith('.')) return
      const pluginPath = path.join(pluginsPath, fileName)
      try {
        const plugin = require(pluginPath)
        const { name, version, manifest, init } = plugin
        if (!isString(name))
          throw new Error('The plugin "name" argument a is not a string')
        if (!isString(version))
          throw new Error('The plugin "version" argument is not a string')
        if (!isObject(manifest))
          throw new Error('The plugin "manifest" argument is not an object')
        if (!isFunction(init))
          throw new Error('The plugin "init" argument is not a function')
        // it looks like a plugin and quacks like a plugin
        console.info(`Loading plugin: ${name}`)
        createStack.use(plugin)
      } catch (error) {
        console.error(
          "Can't load this plugin. It may not be a plugin anyway...",
          pluginPath,
          error
        )
      }
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

function isString(s) {
  return !!(typeof s === 'string' || s instanceof String)
}

function isObject(o) {
  return !!(typeof o === 'object' && o !== null)
}

function isFunction(f) {
  return !!(f && f.constructor && f.call && f.apply)
}
