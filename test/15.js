const test = require('ava')
const createSsbServer = require('..')

test.serial.failing(
  '15. diffs ssb-server manifest. remove `.failing` to see...',
  t => {
    const lenientList = require('@metacentre/shipyard-ssb/lenient')
    const ssbServerPlugins = require('@metacentre/shipyard-ssb')

    const ssbServerManifest_15_3_0 = {
      auth: 'async',
      address: 'sync',
      manifest: 'sync',
      multiserver: {
        parse: 'sync',
        address: 'sync'
      },
      multiserverNet: {},
      get: 'async',
      createFeedStream: 'source',
      createLogStream: 'source',
      messagesByType: 'source',
      createHistoryStream: 'source',
      createUserStream: 'source',
      createWriteStream: 'sink',
      links: 'source',
      add: 'async',
      publish: 'async',
      getAddress: 'sync',
      getLatest: 'async',
      latest: 'source',
      latestSequence: 'async',
      whoami: 'sync',
      progress: 'sync',
      status: 'sync',
      getVectorClock: 'async',
      version: 'sync',
      help: 'sync',
      seq: 'async',
      usage: 'sync',
      clock: 'async',
      plugins: {
        install: 'source',
        uninstall: 'source',
        enable: 'async',
        disable: 'async',
        help: 'sync'
      },
      gossip: {
        add: 'sync',
        remove: 'sync',
        connect: 'async',
        disconnect: 'async',
        changes: 'source',
        reconnect: 'sync',
        disable: 'sync',
        enable: 'sync',
        ping: 'duplex',
        get: 'sync',
        peers: 'sync',
        help: 'sync'
      },
      replicate: {
        changes: 'source',
        upto: 'source',
        request: 'sync',
        block: 'sync'
      },
      friends: {
        hopStream: 'source',
        onEdge: 'sync',
        isFollowing: 'async',
        isBlocking: 'async',
        hops: 'async',
        help: 'sync',
        get: 'async',
        createFriendStream: 'source',
        stream: 'source'
      },
      blobs: {
        get: 'source',
        getSlice: 'source',
        add: 'sink',
        rm: 'async',
        ls: 'source',
        has: 'async',
        size: 'async',
        meta: 'async',
        want: 'async',
        push: 'async',
        changes: 'source',
        createWants: 'source',
        help: 'sync'
      },
      invite: {
        create: 'async',
        use: 'async',
        accept: 'async'
      },
      query: {
        read: 'source',
        explain: 'sync',
        help: 'sync'
      },
      links2: {
        read: 'source',
        help: 'sync'
      },
      ws: {},
      ebt: {
        replicate: 'duplex',
        request: 'sync',
        block: 'sync',
        peerStatus: 'sync'
      },
      ooo: {
        stream: 'duplex',
        get: 'async',
        help: 'sync'
      }
    }

    const sbot = createSsbServer(
      { appname: 'ssb-shipyard-test11' },
      { plugins: ssbServerPlugins, lenient: lenientList }
    )
    t.true(sbot.config.appname === 'ssb-shipyard-test11')
    t.true(sbot.hasOwnProperty('getVectorClock')) // ssb-db
    t.true(sbot.hasOwnProperty('plugins'))
    t.true(sbot.hasOwnProperty('private1'))
    t.true(sbot.hasOwnProperty('onion'))
    t.true(sbot.hasOwnProperty('unixSocket'))
    t.true(sbot.hasOwnProperty('noAuth'))
    t.true(sbot.hasOwnProperty('gossip'))
    t.true(sbot.hasOwnProperty('replicate'))
    t.true(sbot.hasOwnProperty('blobs'))
    t.true(sbot.hasOwnProperty('invite'))
    t.true(sbot.hasOwnProperty('local'))
    t.true(sbot.hasOwnProperty('logging'))
    t.true(sbot.hasOwnProperty('query'))
    t.true(sbot.hasOwnProperty('links'))
    t.true(sbot.hasOwnProperty('links2'))
    t.true(sbot.hasOwnProperty('ws'))
    t.true(sbot.hasOwnProperty('ebt'))
    t.true(sbot.hasOwnProperty('ooo'))
    t.truthy(sbot.ooo.get)

    const manifest = sbot.manifest()

    /** remove .failing from test to see diff */
    t.deepEqual(
      manifest,
      ssbServerManifest_15_3_0,
      'diff manifest compared to ssb-server'
    )
    sbot.close()
  }
)
