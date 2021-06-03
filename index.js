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
      loadPlugin(createStack, plugin)
    })
  }

  // load plugins from a path
  if (pluginsPath) {
    console.info(`Loading plugins from ${pluginsPath}`)
    fs.readdirSync(pluginsPath).map(fileName => {
      if (fileName.startsWith('.')) return
      const pluginPath = path.join(pluginsPath, fileName)
      loadPlugin(createStack, pluginPath)
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

function isPlugin(plugin) {
  try {
    const { name, version, manifest, init } = plugin
    if (!isString(name))
      return new Error('The plugin "name" argument a is not a string')
    if (!isString(version))
      return new Error('The plugin "version" argument is not a string')
    if (!isObject(manifest))
      return new Error('The plugin "manifest" argument is not an object')
    if (!isFunction(init))
      return new Error('The plugin "init" argument is not a function')
  } catch (error) {
    return { error }
  }
  return { quacks: true }
}

function isModuleToRequire(path) {
  try {
    require.resolve(path)
    return true
  } catch (e) {
    return false
  }
}

function loadPlugin(stack, pluginName) {
  try {
    /**
     * if pluginName is a string, assume it's an npm name
     * or a path to a module to be require'd
     * if it's not a string assume it's an already require'd module
     */
    let plugin
    if (isString(pluginName)) {
      if (isModuleToRequire(pluginName)) plugin = require(pluginName)
      else
        throw new Error(
          `pluginName is a string but not a module able to be require'd`
        )
    } else plugin = pluginName

    const { error, quacks } = isPlugin(plugin)
    if (error) throw error
    if (quacks) {
      // it looks like a plugin and quacks like a plugin
      const { name } = plugin
      console.info(`Loading plugin: ${name}`)
      stack.use(plugin)
    } else
      console.info(
        "Skipping plugin because it doesn't quack like a plugin: ",
        plugin
      )
  } catch (error) {
    console.error(
      "Can't load this plugin. It may not be a plugin anyway...",
      pluginName,
      error
    )
  }
}
