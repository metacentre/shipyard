const test = require('ava')
const createSsbServer = require('../')

test('creates a default secret-stack', t => {
  const sbot = createSsbServer()

  t.truthy(sbot)
  t.truthy(sbot.version)
  t.truthy(sbot.whoami)
  t.truthy(sbot.config.caps)

  sbot.close()
})

test('creates stack with default appname data dir', t => {
  delete process.env.ssb_appname
  const sbot = createSsbServer()
  t.true(sbot.config.appname === 'ssb')
  sbot.close()
})

test('creates stack with custom appname data dir', t => {
  const sbot = createSsbServer({ appname: 'ssb-shipyard-test' })
  t.true(sbot.config.appname === 'ssb-shipyard-test')
  sbot.close()
})

test('creates stack with custom options', t => {
  const sbot = createSsbServer({
    appname: 'ssb-shipyard-test2',
    caps: {
      shs: 'MVZDyNf1TrZuGv3W5Dpef0vaITW1UqOUO3aWLNBp+7A=',
      sign: 'qym3eJKBjm0E0OIjuh3O1VX8+lLVSGV2p5UzrMStHTs='
    }
  })
  t.true(
    sbot.config.caps.shs === 'MVZDyNf1TrZuGv3W5Dpef0vaITW1UqOUO3aWLNBp+7A='
  )
  sbot.close()
})

test('creates stack and loads user plugins', t => {
  require('./utils/setup-test')

  const sbot = createSsbServer({ appname: 'ssb-shipyard' })
  t.true(sbot.config.appname === 'ssb-shipyard')
  t.truthy(sbot.test.test)
  t.true(sbot.test.test() === 'loaded')
  // console.log(sbot)
  sbot.close()
})
