const test = require('ava')
const shipyard = require('..')
const { join } = require('path')

test.serial(
  "9. creates stack and loads plugins array of require'd modules require'd from module",
  t => {
    const pluginsModule = join(
      __dirname,
      'configs',
      'ssb-shipyard-test/node_modules/plugins'
    )
    const { plugins } = require(pluginsModule)

    const sbot = shipyard({ appname: 'ssb-shipyard-test9' }, { plugins })
    t.truthy(sbot.identities.publishAs)
    sbot.close()
  }
)
