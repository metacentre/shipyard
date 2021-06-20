// from ssb-server
const SecretStack = require('secret-stack')
const caps = require('ssb-caps')
const db = require('ssb-db')
const db2 = require('ssb-db2')

// create an sbot with default caps. these can be overridden again when you call create.
function createSsbServer() {
  return SecretStack({ caps })
  // .use(db2)
}
module.exports = createSsbServer()
