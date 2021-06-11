const debug = require('debug')('shipyard')

module.exports.announce = (config, configPath, location) => {
  debug(
    '=================================================================================='
  )
  debug(
    `Loading plugins configured in: ${config.path}/config 
{
  ${configPath}
}`
  )
  debug(`Loading plugins from ${location}`)
  debug(
    '=================================================================================='
  )
}
