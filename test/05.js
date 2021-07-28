const test = require('ava')
const shipyard = require('..')

require('./utils/setup-test')

test.serial('creates stack and loads user plugins', t => {
  const sbot = shipyard({ appname: 'ssb-shipyard-test' })
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  sbot.close()
})
