module.exports = {
  name: 'test2',
  version: '1.0.0',
  manifest: {
    test: 'sync'
  },
  init: (api, config, permissions, manifest) => {
    return {
      test: () => 'loaded'
    }
  }
}
