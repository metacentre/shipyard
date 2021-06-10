const test = require('ava')
const shipyard = require('..')

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
    const sbot = shipyard(
      { appname: 'ssb-shipyard-test13' },
      { plugins: ssbServerPlugins, lenient: lenientList }
    )

    t.false(sbot.hasOwnProperty('onion')) // sbot.onion = undefined when plugin loaded. absent otherwise
    sbot.close()
  }
)
