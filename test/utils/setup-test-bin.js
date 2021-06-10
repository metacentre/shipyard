const rimraf = require('rimraf')
const home = require('os').homedir()
const { join } = require('path')
const fse = require('fs-extra')

const path = join(home, '.ssb-shipyard-test-bin')
rimraf.sync(path)

const src = join(__dirname, '../configs/ssb-shipyard-test-bin')

try {
  fse.copySync(src, path)
  console.log(`COPY from ${src} to ${path} OK`)
} catch (error) {
  console.error(error)
}
