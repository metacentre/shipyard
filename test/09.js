const test = require('ava')
const createSsbServer = require('..')
const { join } = require('path')

test.serial(
  "9. creates stack and loads plugins array of require'd modules require'd from module",
  t => {
    const pluginsModule = join(__dirname, 'ssb-shipyard/node_modules/plugins')

    const { plugins } = require(pluginsModule)

    const sbot = createSsbServer({ appname: 'ssb-shipyard-test5' }, { plugins })
    t.true(sbot.config.appname === 'ssb-shipyard-test5')
    t.truthy(sbot.identities.publishAs)
    sbot.close()
  }
)
