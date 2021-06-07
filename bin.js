#! /usr/bin/env node

/**
 * $ shipyard
 * run shipyard with default settings - appname comes from ssb_appname env var
 *
 * $ shipyard appname?
 * optionally pass in the appname
 *
 *
 * shipyard plugins can be specified in ~/.<appname>/config eg: ~/.ssb/config
 * under the shipyard property like so:
 *
 * "shipyard": {
 *    "pluginsPath": null,
 *    "packages": [
 *       {
 *        "plugins": "@metacentre/shipyard-ssb",
 *        "lenient": "@metacentre/shipyard-ssb/lenient"
 *      },
 *      {
 *        "plugins": "@metacentre/shipyard-oasis",
 *        "lenient": "@metacentre/shipyard-oasis/lenient"
 *      }
 *    ]
 *  },
 */

const shipyard = require('./index.js')
const Config = require('ssb-config/inject')
const pkg = require('./package.json')

const shipyardTest = process.env.shipyard_test
if (shipyardTest) process.argv = ['', '', shipyardTest, '--global=true']

const args = process.argv.slice(2)
const attachGlobal = args[1] === '--global=true'

const appname = process.argv.slice(2)[0] || process.env.ssb_appname || 'ssb'
console.info(`${pkg.name} v${pkg.version} appname:, ${appname}`)
const config = Config(appname)

const shipyardConfig = config.shipyard

if (shipyardConfig) {
  const { pluginsPath, packages } = shipyardConfig

  const pkgs = packages.reduce((acc, pkg) => {
    const plugins = acc.plugins || []
    const lenient = acc.lenient || []
    return {
      plugins: [...plugins, require(pkg.plugins)],
      lenient: [...lenient, ...require(pkg.lenient)]
    }
  }, {})

  const { plugins, lenient } = pkgs
  shipyard({ appname }, { plugins, lenient, pluginsPath, attachGlobal })
} else shipyard({ appname }, { attachGlobal })
