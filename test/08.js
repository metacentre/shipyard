const test = require('ava')
const shipyard = require('..')
const { join } = require('path')

test.serial(
  "creates stack and loads plugins array of npm package names require'd from module",
  t => {
    const pluginsModule = join(
      __dirname,
      'configs',
      'ssb-shipyard-test/node_modules/plugins'
    )
    const { npm } = require(pluginsModule)

    const sbot = shipyard({ appname: 'ssb-shipyard-test8' }, { plugins: npm })
    t.truthy(sbot.identities.publishAs)
    sbot.close()
  }
)
