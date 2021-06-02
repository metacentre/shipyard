const rimraf = require('rimraf')
const home = require('os').homedir()
const { join } = require('path')
const fse = require('fs-extra')

const path = join(home, '.ssb-shipyard')
rimraf.sync(path)
rimraf.sync(join(home, '.ssb-shipyard-test'))
rimraf.sync(join(home, '.ssb-shipyard-test2'))
rimraf.sync(join(home, '.ssb-shipyard-test3'))

const src = '/home/av8ta/metacentre/shipyard/test/ssb-shipyard'

try {
  fse.copySync(src, path)
  console.log(`COPY from ${src} to ${path} OK`)
} catch (error) {
  console.error(error)
}
