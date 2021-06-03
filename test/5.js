const test = require('ava')
const createSsbServer = require('../')

require('./utils/setup-test')

test.serial('5. creates stack and loads user plugins', t => {
  const sbot = createSsbServer({ appname: 'ssb-shipyard' })
  t.true(sbot.config.appname === 'ssb-shipyard')
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  sbot.close()
})
