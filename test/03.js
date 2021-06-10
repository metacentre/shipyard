const test = require('ava')
const shipyard = require('..')

test.serial('3. creates stack with custom appname data dir', t => {
  const sbot = shipyard({ appname: 'ssb-shipyard-test3' })
  t.true(sbot.config.appname === 'ssb-shipyard-test3')
  sbot.close()
})
