const test = require('ava')
const createSsbServer = require('..')
const { join } = require('path')

test.serial(
  "8. creates stack and loads plugins array of npm package names require'd from module",
  t => {
    const pluginsModule = join(__dirname, 'ssb-shipyard/node_modules/plugins')
    const { npm } = require(pluginsModule)

    const sbot = createSsbServer(
      { appname: 'ssb-shipyard-test5' },
      { plugins: npm }
    )
    t.true(sbot.config.appname === 'ssb-shipyard-test5')
    t.truthy(sbot.identities.publishAs)
    sbot.close()
  }
)
