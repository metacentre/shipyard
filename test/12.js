const test = require('ava')
const shipyard = require('..')

test.serial(
  '12. creates stack and loads ssb-server plugins being lenient with plugin shape',
  t => {
    const ssbServerPlugins = require('@metacentre/shipyard-ssb')
    const lenientList = require('@metacentre/shipyard-ssb/lenient')

    const sbot = shipyard(
      { appname: 'ssb-shipyard-test12' },
      {
        plugins: ssbServerPlugins,
        lenient: lenientList
      }
    )
    t.true(sbot.hasOwnProperty('local'))
    sbot.close()
  }
)
