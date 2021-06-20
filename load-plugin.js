const debug = require('debug')('shipyard')
let index = 0
let ssbDbLoaded = false
let isSsbDb = false

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

function getPackageDir(packagePath) {
  const a = packagePath.split('node_modules/')
  return a[a.length - 1].split('/')[0]
}

function inLenientList(lenientList, packageName) {
  let beLenient = false
  lenientList.forEach(package => {
    if (package == packageName) beLenient = true
  })
  return beLenient
}

function isModuleToRequire(packagePath, lenientList) {
  try {
    const resolved = require.resolve(packagePath)
    const packageName = getPackageDir(resolved)

    if (lenientList && inLenientList(lenientList, packageName))
      return { toRequire: true, beLenient: true }
    else return { toRequire: true, beLenient: false }
  } catch (error) {
    throw error
  }
}

function requirePlugin(pluginName, lenientList) {
  /**
   * if pluginName is a string, assume it's an npm name
   * or a path to a module to be require'd
   * if it's not a string assume it's an already require'd module
   */
  let plugin
  var beLenient = false
  if (isString(pluginName)) {
    if (pluginName === 'ssb-db') isSsbDb = true
    var { toRequire, beLenient } = isModuleToRequire(pluginName, lenientList)
    if (toRequire) plugin = require(pluginName)
    else
      throw new Error(
        `pluginName is a string but not a module able to be require'd`
      )
  } else {
    if (lenientList) {
      /**
       * todo: if there is no name present we can't check it
       * find the resolved module path instead and look at that
       * e.g. ssb-db doesn't have a name. so to load it, we must have it in lenien list
       * and pass it as a string 'ssb-db' to load, not require('ssb-db')
       * */
      const { name } = pluginName

      /**
       * nasty hack!
       * if the module has previously been require'd and has no name to check
       * we can't determine if it's in the lenient list!
       * this stops both ssb-db and ssb-master from loading which are absolutely essential
       * we provide more leniency if it's one of the first two plugins to load
       * which they ought to be...
       * first test is for ssb-db, second for ssb-master
       * */
      if (!name && index < 3) {
        if (pluginName.init && isFunction(pluginName.init)) {
          if (pluginName.manifest?.getVectorClock) {
            isSsbDb = true
          }
        } else if (isFunction(pluginName)) beLenient = true
      }
      if (inLenientList(lenientList, name)) beLenient = true
    }
    plugin = pluginName
  }
  return { plugin, beLenient }
}

function loadPlugin(stack, pluginName, lenientList) {
  index++
  /** recursively load plugins */
  if (Array.isArray(pluginName)) {
    pluginName.forEach(p => loadPlugin(stack, p, lenientList))
  } else {
    try {
      const { plugin, beLenient } = requirePlugin(pluginName, lenientList)

      const { error, quacks } = isPlugin(plugin)
      if (error) throw error
      if (quacks || beLenient) {
        // it looks like a plugin and quacks like a plugin
        // or we're being lenient!
        const { name } = plugin
        debug(`Loading plugin: ${name}`, plugin)

        /**
         * hack to only try to load ssb-db once
         * otherwise we error on the flume log lock
         * todo: deduplicate the plugins list before loading them
         * */
        if (!isSsbDb) stack.use(plugin)
        else if (!ssbDbLoaded) {
          stack.use(plugin)
          ssbDbLoaded = true
        }
      } else
        console.info(
          "Skipping plugin because it doesn't quack like a plugin: ",
          plugin
        )
      isSsbDb = false
    } catch (error) {
      console.error('Error loading this plugin: ', pluginName, error)
    }
  }
}

module.exports = loadPlugin
