const rimraf = require('rimraf')
const home = require('os').homedir()
const { join } = require('path')

rimraf.sync(join(home, '.ssb-shipyard-test'))
rimraf.sync(join(home, '.ssb-shipyard-test2'))
rimraf.sync(join(home, '.ssb-shipyard-test3'))
rimraf.sync(join(home, '.ssb-shipyard-test4'))
