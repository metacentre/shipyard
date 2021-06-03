const test = require('ava')
const createSsbServer = require('../')

test.serial('1. creates a default secret-stack', t => {
  const sbot = createSsbServer()

  t.truthy(sbot)
  t.truthy(sbot.version)
  t.truthy(sbot.whoami)
  t.truthy(sbot.config.caps)

  sbot.close()
})
