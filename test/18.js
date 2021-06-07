const test = require('ava')
const client = require('ssb-client')

require('./utils/setup-test')

test('18. can run sbot from ./bin.js and load plugins with shipyard config in ~/.ssb-shipyard/config', async t => {
  return new Promise((resolve, reject) => {
    const appname = 'ssb-shipyard'
    const clientConfig = {
      appname,
      caps: {
        shs: 'InRNDNSnLJasGWEPLe7zPAj8kHAgOesoPgczeV3g4Y0=',
        sign: 'mH1wBje2HmVQgG6yXxkwrUTqseLOwgDEnq2IPJJYX0I='
      },
      keys: {
        curve: 'ed25519',
        public: 'oyWQIW14NUVZ5VNiktFYPsIPDwEcH/Re4R9REpDHWn0=.ed25519',
        private:
          'fxxkI3cbj3dgzngKVR1aIlsa6hBgq2YgsZATqDlPL/qjJZAhbXg1RVnlU2KS0Vg+wg8PARwf9F7hH1ESkMdafQ==.ed25519',
        id: '@oyWQIW14NUVZ5VNiktFYPsIPDwEcH/Re4R9REpDHWn0=.ed25519'
      },
      remote:
        'ws://localhost:8989~shs:oyWQIW14NUVZ5VNiktFYPsIPDwEcH/Re4R9REpDHWn0='
    }

    /** equivalent to passing in
     * $ shipyard ssb-shipyard
     * */
    process.env.shipyard_test = appname
    require('../bin')

    global.sbot.on('multiserver:listening', () => {
      client(clientConfig.keys, clientConfig, async (error, rpc) => {
        if (error) reject(error)
      })
    })

    global.sbot.on('rpc:connect', rpc => {
      t.truthy(rpc)
      resolve(t.false(global.sbot?.tunnel?.isRoom === undefined))
      global.sbot.close()
    })
  })
})
