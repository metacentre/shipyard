const test = require('ava')
const shipyard = require('..')

test.serial('2. creates stack with default appname data dir', t => {
  delete process.env.ssb_appname
  const sbot = shipyard()
  t.true(sbot.config.appname === 'ssb')
  sbot.close()
})
