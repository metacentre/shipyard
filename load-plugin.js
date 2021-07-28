let ssbDbLoaded = false
let isSsbDb = false

function isString(s) {
  return !!(typeof s === 'string' || s instanceof String)
}

function isModuleToRequire(packagePath) {
  try {
    require.resolve(packagePath)
    return true
  } catch (error) {
    throw error
  }
}

function requirePlugin(pluginName) {
  /**
   * if pluginName is a string, assume it's an npm name
   * or a path to a module to be require'd
   * if it's not a string assume it's an already require'd module
   */
  let plugin
  if (isString(pluginName)) {
    if (pluginName === 'ssb-db') isSsbDb = true
    const toRequire = isModuleToRequire(pluginName)
    if (toRequire) plugin = require(pluginName)
    else
      throw new Error(
        `pluginName is a string but not a module able to be require'd`
      )
  } else {
    plugin = pluginName
  }
  return plugin
}

function loadPlugin(stack, pluginName) {
  isSsbDb = false

  /** recursively load plugins */
  if (Array.isArray(pluginName)) {
    pluginName.forEach(p => loadPlugin(stack, p))
  } else {
    try {
      const plugin = requirePlugin(pluginName)
      // don't load ssb-db twice.
      if (isSsbDb) {
        if (ssbDbLoaded) {
          console.error('ssb-db has already been loaded... skipping')
          return
        }
        stack.use(plugin)
        ssbDbLoaded = true
        return
      }
      stack.use(plugin)
    } catch (error) {
      console.error('Error loading this plugin: ', pluginName, error)
    }
  }
}

module.exports = loadPlugin
