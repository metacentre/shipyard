const rimraf = require('rimraf')
const home = require('os').homedir()
const { join } = require('path')
const fse = require('fs-extra')
const fs = require('fs')
const mkdirp = require('mkdirp')

const path = join(home, '.ssb-shipyard-test-bin-mfe')
rimraf.sync(path)
mkdirp.sync(path)

const src = join(__dirname, '../configs/ssb-shipyard-test-bin-plugins')

fs.writeFileSync(join(path, 'config'), config(home))

try {
  fse.copySync(src, path)
  console.log(`COPY from ${src} to ${path} OK`)
} catch (error) {
  console.error(error)
}

function config(homeDir) {
  return `{
  "mfe": {
    "apps": [
      {
        "name": "@metacentre/mf-silly",
        "activeWhen": ["/silly"],
        "packages": [
          {
            "plugins": "${src}/plugins/plugin1"
          }
        ]
      }     
    ]
  },
  "shipyard": {
    "packages": [
      {
        "plugins": ["ssb-db", "ssb-master", "ssb-ws"],
        "lenient": ["ssb-db", "ssb-master"]
      }
    ]
  },
  "caps": {
    "shs": "InRNDNSnLJasGWEPLe7zPAj8kHAgOesoPgczeV3g4Y0=",
    "sign": "mH1wBje2HmVQgG6yXxkwrUTqseLOwgDEnq2IPJJYX0I="
  },
  "keys": {
    "curve": "ed25519",
    "public": "oyWQIW14NUVZ5VNiktFYPsIPDwEcH/Re4R9REpDHWn0=.ed25519",
    "private": "fxxkI3cbj3dgzngKVR1aIlsa6hBgq2YgsZATqDlPL/qjJZAhbXg1RVnlU2KS0Vg+wg8PARwf9F7hH1ESkMdafQ==.ed25519",
    "id": "@oyWQIW14NUVZ5VNiktFYPsIPDwEcH/Re4R9REpDHWn0=.ed25519"
  },
  "remote": "ws://localhost:8989~shs:oyWQIW14NUVZ5VNiktFYPsIPDwEcH/Re4R9REpDHWn0="
}
`
}
