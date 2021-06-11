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
const debug = require('debug')('shipyard:bin')

const shipyardTest = process.env.shipyard_test
if (shipyardTest) process.argv = ['', '', shipyardTest, '--global=true']

const args = process.argv.slice(2)
const attachGlobal = args[1] === '--global=true'

const appname = process.argv.slice(2)[0] || process.env.ssb_appname || 'ssb'
const config = Config(appname)

const shipyardConfig = config.shipyard

if (shipyardConfig) {
  const { pluginsPath, packages } = shipyardConfig

  const requireArray = input => {
    if (Array.isArray(input)) {
      const result = []
      input.forEach(p => result.push(require(p)))
      return result
    } else return require(input)
  }

  let pkgs = {}
  if (packages) {
    debug(`Assembling packages to pass to shipyard,`)
    debug(`from ${config.config} config.shipyard.packages: [{plugins}]`)
    pkgs = packages.reduce(
      (acc, pkg) => {
        let p = pkg.plugins ? [requireArray(pkg.plugins)] : acc.plugins
        const l = pkg.lenient ? [...require(pkg.lenient)] : acc.lenient
        debug(p)
        return {
          plugins: [...acc.plugins, ...p],
          lenient: [...acc.lenient, ...l]
        }
      },
      { plugins: [], lenient: [] }
    )
  }

  const { plugins, lenient } = pkgs
  shipyard({ appname }, { plugins, lenient, pluginsPath, attachGlobal })
} else shipyard({ appname }, { attachGlobal })
