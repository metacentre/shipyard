const test = require('ava')
const shipyard = require('..')

test.serial(
  "14. creates stack and loads require'd ssb-server plugins being lenient with plugin shape",
  t => {
    const lenientList = require('@metacentre/shipyard-ssb/lenient')

    const ssbServerPlugins = [
      require('ssb-private1'),
      require('ssb-onion'),
      require('ssb-unix-socket'),
      require('ssb-no-auth'),
      require('ssb-gossip'),
      require('ssb-replicate'),
      require('ssb-friends'),
      require('ssb-blobs'),
      require('ssb-invite'),
      require('ssb-local'),
      require('ssb-logging'),
      require('ssb-query'),
      require('ssb-links'),
      require('ssb-ws'),
      require('ssb-ebt'),
      require('ssb-ooo')
    ]
    const sbot = shipyard(
      { appname: 'ssb-shipyard-test14' },
      { plugins: ssbServerPlugins, lenient: lenientList }
    )

    t.true(sbot.hasOwnProperty('getVectorClock')) // ssb-db
    t.true(sbot.hasOwnProperty('plugins'))
    t.true(sbot.hasOwnProperty('private1'))
    t.true(sbot.hasOwnProperty('onion'))
    t.true(sbot.hasOwnProperty('unixSocket'))
    t.true(sbot.hasOwnProperty('noAuth'))
    t.true(sbot.hasOwnProperty('gossip'))
    t.true(sbot.hasOwnProperty('replicate'))
    t.true(sbot.hasOwnProperty('blobs'))
    t.true(sbot.hasOwnProperty('invite'))
    t.true(sbot.hasOwnProperty('local'))
    t.true(sbot.hasOwnProperty('logging'))
    t.true(sbot.hasOwnProperty('query'))
    t.true(sbot.hasOwnProperty('links'))
    t.true(sbot.hasOwnProperty('links2'))
    t.true(sbot.hasOwnProperty('ws'))
    t.true(sbot.hasOwnProperty('ebt'))
    t.true(sbot.hasOwnProperty('ooo'))
    t.truthy(sbot.ooo.get)
    sbot.close()
  }
)
