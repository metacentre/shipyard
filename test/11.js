const test = require('ava')
const shipyard = require('..')
const { join } = require('path')

test.serial(
  '11. creates stack and loads plugins all the way down the rabbit hole',
  t => {
    const pluginsModule = join(
      __dirname,
      'configs',
      'ssb-shipyard-test/node_modules/plugins'
    )

    const { rabbitHole } = require(pluginsModule)

    const sbot = shipyard(
      { appname: 'ssb-shipyard-test11' },
      {
        plugins: rabbitHole,
        lenient: require('@metacentre/shipyard-ssb/lenient')
      }
    )
    t.truthy(sbot.identities.publishAs)
    t.truthy(sbot.lan.start)
    sbot.close()
  }
)
