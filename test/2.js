const test = require('ava')
const createSsbServer = require('../')

test.serial('2. creates stack with default appname data dir', t => {
  delete process.env.ssb_appname
  const sbot = createSsbServer()
  t.true(sbot.config.appname === 'ssb')
  sbot.close()
})
