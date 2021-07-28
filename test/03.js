const test = require('ava')
const shipyard = require('..')

test.serial('creates stack with custom appname data dir', t => {
  const plugins = ['ssb-db', 'ssb-master']
  const sbot = shipyard({ appname: 'ssb-shipyard-test3' }, { plugins })
  t.true(sbot.config.appname === 'ssb-shipyard-test3')
  sbot.close()
})
