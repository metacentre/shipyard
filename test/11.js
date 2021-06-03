const test = require('ava')
const createSsbServer = require('..')
const { join } = require('path')

test.serial(
  '11. creates stack and loads plugins all the way down the rabbit hole',
  t => {
    const pluginsModule = join(__dirname, 'ssb-shipyard/node_modules/plugins')

    const { rabbitHole } = require(pluginsModule)

    const sbot = createSsbServer(
      { appname: 'ssb-shipyard-test7' },
      { plugins: rabbitHole }
    )
    t.true(sbot.config.appname === 'ssb-shipyard-test7')
    t.truthy(sbot.identities.publishAs)
    t.truthy(sbot.lan.start)
    sbot.close()
  }
)
