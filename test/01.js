const test = require('ava')
const shipyard = require('..')

test.serial('1. creates a default secret-stack', t => {
  process.env.ssb_appname = 'shipyard-test1'
  const plugins = ['ssb-db', 'ssb-master']
  const sbot = shipyard({}, { plugins, lenient: plugins })

  t.truthy(sbot)
  t.truthy(sbot.version)
  t.truthy(sbot.whoami)
  t.truthy(sbot.config.caps)

  sbot.close()
})
