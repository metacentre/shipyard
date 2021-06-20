const test = require('ava')
const shipyard = require('..')

test.serial('4. creates stack with custom options', t => {
  const plugins = ['ssb-db', 'ssb-master']

  const sbot = shipyard(
    {
      appname: 'ssb-shipyard-test4',
      caps: {
        shs: 'InRNDNSnLJasGWEPLe7zPAj8kHAgOesoPgczeV3g4Y0=',
        sign: 'mH1wBje2HmVQgG6yXxkwrUTqseLOwgDEnq2IPJJYX0I='
      }
    },
    { plugins, lenient: plugins }
  )
  t.true(
    sbot.config.caps.shs === 'InRNDNSnLJasGWEPLe7zPAj8kHAgOesoPgczeV3g4Y0='
  )
  sbot.close()
})
