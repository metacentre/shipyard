const test = require('ava')
const shipyard = require('..')
const client = require('ssb-client')

test('16. can connect to sbot with ssb-client', async t => {
  return new Promise((resolve, reject) => {
    const config = {
      appname: 'ssb-shipyard-test16',
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

    const sbot = shipyard(config, {
      plugins: ['ssb-ws']
    })

    sbot.on('multiserver:listening', () => {
      client(config.keys, config, async (error, rpc) => {
        if (error) reject(error)
      })
    })

    sbot.on('rpc:connect', rpc => {
      t.truthy(rpc)
      const id = rpc.stream.address.split(':').pop()
      resolve(t.true(config.keys.public.split('.ed25519')[0] === id))
      sbot.close()
    })
  })
})
