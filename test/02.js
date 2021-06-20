const test = require('ava')
const shipyard = require('..')

test.serial('2. creates stack with default appname data dir', t => {
  delete process.env.ssb_appname
  const plugins = ['ssb-db', 'ssb-master']
  const sbot = shipyard({}, { plugins, lenient: plugins })
  t.true(sbot.config.appname === 'ssb')
  sbot.close()
})
