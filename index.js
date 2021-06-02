const Server = require('./create')
const Config = require('ssb-config/inject')
const ssbPlugins = require('ssb-plugins')
const path = require('path')
const fs = require('fs')

function createServer(options = {}) {
  const appname = options.appname || process.env.ssb_appname || 'ssb'
  console.log('creating ssb server with appname: ', appname)
  const config = Config(appname, { ...options, appname })
  // prettier-ignore
  const createServer = Server
    .use(require('ssb-master'))
    .use(ssbPlugins)

  // load user plugins from ~/.ssb/node_modules
  // must be configured in ~/.ssb/config or
  // passed into this function as options
  ssbPlugins.loadUserPlugins(createServer, config)

  // start server
  const server = createServer(config)

  // write RPC manifest to ~/.ssb/manifest.json
  fs.writeFileSync(
    path.join(config.path, 'manifest.json'),
    JSON.stringify(server.getManifest(), null, 2)
  )

  return server
}

module.exports = createServer
