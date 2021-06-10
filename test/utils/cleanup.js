const rimraf = require('rimraf')
const home = require('os').homedir()
const { join } = require('path')

rimraf.sync(join(home, '.ssb-shipyard-test*'))
