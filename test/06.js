const test = require('ava')
const createSsbServer = require('..')
const { join } = require('path')

test.serial('6. creates stack and loads plugins from array', t => {
  const path = join(__dirname, 'ssb-shipyard/node_modules/@metacentre/test')

  const sbot = createSsbServer(
    { appname: 'ssb-shipyard-test3' },
    { plugins: ['ssb-identities', path] }
  )
  t.true(sbot.config.appname === 'ssb-shipyard-test3')
  t.truthy(sbot.identities.publishAs)
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  sbot.close()
})
