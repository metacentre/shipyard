const test = require('ava')
const createSsbServer = require('../')

test.serial('3. creates stack with custom appname data dir', t => {
  const sbot = createSsbServer({ appname: 'ssb-shipyard-test' })
  t.true(sbot.config.appname === 'ssb-shipyard-test')
  sbot.close()
})
