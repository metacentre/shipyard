const test = require('ava')
const shipyard = require('..')
const { join } = require('path')

test.serial(
  "creates stack and loads plugins from array of array of require'd modules require'd from module",
  t => {
    const pluginsModule = join(
      __dirname,
      'configs',
      'ssb-shipyard-test/node_modules/plugins'
    )

    const { arrays } = require(pluginsModule)

    const sbot = shipyard(
      { appname: 'ssb-shipyard-test10' },
      { plugins: arrays }
    )
    t.truthy(sbot.identities.publishAs)
    t.truthy(sbot.lan.start)
    sbot.close()
  }
)
