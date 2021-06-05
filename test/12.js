const test = require('ava')
const createSsbServer = require('..')

test.serial(
  '12. creates stack and loads ssb-server plugins being lenient with plugin shape',
  t => {
    const ssbServerPlugins = require('@metacentre/shipyard-ssb')
    const lenientList = require('@metacentre/shipyard-ssb/lenient')

    const sbot = createSsbServer(
      { appname: 'ssb-shipyard-test8' },
      { plugins: ssbServerPlugins, lenient: lenientList }
    )
    t.true(sbot.config.appname === 'ssb-shipyard-test8')
    t.truthy(sbot.ooo.get)
    sbot.close()
  }
)
