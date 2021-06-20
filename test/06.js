const test = require('ava')
const shipyard = require('..')
const { join } = require('path')

test.serial('6. creates stack and loads plugins from array', t => {
  const path = join(
    __dirname,
    'configs',
    'ssb-shipyard-test/node_modules/@metacentre/test'
  )

  const plugins = ['ssb-db', 'ssb-master']

  const sbot = shipyard(
    { appname: 'ssb-shipyard-test-6' },
    { plugins: [...plugins, 'ssb-identities', path], lenient: plugins }
  )
  t.truthy(sbot.identities.publishAs)
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  sbot.close()
})
