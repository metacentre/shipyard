// from ssb-server
const SecretStack = require('secret-stack')
const caps = require('ssb-caps')
const db = require('ssb-db')

// create an sbot with default caps. these can be overridden again when you call create.
function createSsbServer() {
  return SecretStack({ caps }).use(db)
}
module.exports = createSsbServer()
