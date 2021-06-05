const test = require('ava')
const createSsbServer = require('..')

test.serial(
  '13. creates stack and loads ssb-server plugins without being lenient with ssb-onion',
  t => {
    const ssbServerPlugins = require('@metacentre/shipyard-ssb')
    const lenientList = [
      // 'ssb-onion',
      // 'onion',
      'ssb-unix-socket',
      'unix-socket',
      'ssb-no-auth',
      'no-auth',
      'ssb-local',
      'local',
      'ssb-logging',
      'logging'
    ]
    const sbot = createSsbServer(
      { appname: 'ssb-shipyard-test9' },
      { plugins: ssbServerPlugins, lenient: lenientList }
    )

    t.true(sbot.config.appname === 'ssb-shipyard-test9')
    t.truthy(sbot.ooo.get)
    t.false(sbot.hasOwnProperty('onion')) // sbot.onion = undefined when plugin loaded. absent otherwise
    sbot.close()
  }
)