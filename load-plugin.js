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
    return error
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
    var { toRequire, beLenient } = isModuleToRequire(pluginName, lenientList)
    if (toRequire) plugin = require(pluginName)
    else
      throw new Error(
        `pluginName is a string but not a module able to be require'd`
      )
  } else {
    if (lenientList) {
      const { name } = pluginName
      if (inLenientList(lenientList, name)) beLenient = true
    }
    plugin = pluginName
  }
  return { plugin, beLenient }
}

function loadPlugin(stack, pluginName, lenientList) {
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
}

module.exports = loadPlugin
