const test = require('ava')
const shipyard = require('..')
const { join } = require('path')

test.serial('7. creates stack and loads plugins from directory', t => {
  const pluginsPath = join(
    __dirname,
    'configs',
    'ssb-shipyard-test/node_modules/@metacentre'
  )

  const sbot = shipyard({ appname: 'ssb-shipyard-test7' }, { pluginsPath })
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  sbot.close()
})
