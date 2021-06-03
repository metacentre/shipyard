const test = require('ava')
const createSsbServer = require('..')
const { join } = require('path')

test.serial('7. creates stack and loads plugins from directory', t => {
  const pluginsPath = join(__dirname, 'ssb-shipyard/node_modules/@metacentre')

  const sbot = createSsbServer(
    { appname: 'ssb-shipyard-test4' },
    { pluginsPath }
  )
  t.true(sbot.config.appname === 'ssb-shipyard-test4')
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  sbot.close()
})
