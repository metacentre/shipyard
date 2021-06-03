const test = require('ava')
const createSsbServer = require('..')

test.serial('4. creates stack with custom options', t => {
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
