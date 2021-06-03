const test = require('ava')
const createSsbServer = require('..')
const { join } = require('path')

test.serial(
  "10. creates stack and loads plugins from array of array of require'd modules require'd from module",
  t => {
    const pluginsModule = join(__dirname, 'ssb-shipyard/node_modules/plugins')

    const { arrays } = require(pluginsModule)

    const sbot = createSsbServer(
      { appname: 'ssb-shipyard-test6' },
      { plugins: arrays }
    )
    t.true(sbot.config.appname === 'ssb-shipyard-test6')
    t.truthy(sbot.identities.publishAs)
    t.truthy(sbot.lan.start)
    sbot.close()
  }
)
