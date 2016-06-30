'use strict'

const util = require('util')
const mapUtil = require('map-util')

const has = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

var currentColor

const logLevels = new Map([
  ['silly', -Infinity]
, ['verbose', 1000]
, ['info', 2000]
, ['http', 3000]
, ['warn', 4000]
, ['error', 5000]
, ['silent', Infinity]
])

const reverseLogLevels = new Map([
  [-Infinity, 'silly']
, [1000, 'verbose']
, [2000, 'info']
, [3000, 'http']
, [4000, 'warn']
, [5000, 'error']
, [Infinity, 'silent']
])

const black = 30
const green = 32
const yellow = 33
const white = 37
const brightRed = 91
const brightGreen = 92
const brightBlue = 94

const colors = new Map([
  ['blue', 34]
, ['red', 31]
, ['green', 32]
, ['yellow', 33]
, ['magenta', 35]
, ['cyan', 36]
, ['white', 37]
, ['gray', 90]
, ['brightRed', 91]
, ['brightGreen', 92]
, ['brightYellow', 93]
, ['brightBlue', 94]
, ['brightMagenta', 95]
, ['brightCyan', 96]
, ['brightWhite', 97]
])

function levelIsValid(lvl) {
  return logLevels.has(lvl)
}

function assertLevel(lvl) {
  if (!levelIsValid(lvl)) {
    throw new Error(`Invalid log level: "${lvl}"`)
  }
}

currentColor = 94

function Log(options) {
  const opts = Object.assign({
    stream: process.stderr
  , level: 'info'
  , heading: ''
  , color: ''
  , maxComponentLength: 10
  }, options)

  this.color = mapUtil.nextVal(currentColor, colors, true)
  currentColor = this.color

  this.stream = opts.stream
  this._useColor = has(opts, 'useColor')
    ? !!opts.useColor
    : this.stream.isTTY

  this._level = null

  this.maxComponentLength = opts.maxComponentLength

  Object.defineProperty(this, 'level', {
    get() {
      return reverseLogLevels.get(this._level)
    }
  , set(lvl) {
      assertLevel(lvl)
      this._level = logLevels.get(lvl)
    }
  })

  Object.defineProperty(this, 'component', {
    get() {
      if (!this._component) return ''
      return leftPad(this._component, this.maxComponentLength)
    }

  , set(comp) {
      this._component = comp
    }
  })

  this.level = opts.level
  assertLevel(this.level)
  this.heading = opts.heading
  this._component = opts.component
}

Log.prototype.child = function child(comp) {
  return new Log(Object.assign({
    heading: this.heading
  , level: this.level
  , stream: this.stream
  , maxComponentLength: this.maxComponentLength
  , useColor: this._useColor
  }, {
    component: comp
  }))
}

Log.prototype._shouldLog = function _shouldLog(lvl) {
  if (this._level === Infinity) return false
  const l = logLevels.get(lvl)
  if (!l) return false
  if (l < this._level) return false
  return true
}

Log.prototype._log = function _log(str) {
  this.stream.write(str)
  this.stream.write('\n')
}

Log.prototype._writeComponent = function _writeComponent(str) {
  this._writeHeading(this.heading)
  if (str) this.stream.write(str)
  if (this.component)
    this._writePrefix(this.component)
}

Log.prototype.inspect = function inspect(obj, depth) {
  if (!this._shouldLog('verbose')) return false
  const str = util.inspect(obj, {
    colors: this._useColor
  , depth: typeof depth === 'number' ? depth : null
  })
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyFG('INSP', brightBlue, this._useColor))
    this._log(line)
  })
}

Log.prototype.silly = function silly() {
  if (!this._shouldLog('silly')) return false

  let str
  switch (arguments.length) {
    case 1:
      str = util.format(arguments[0])
      break
    case 2:
      str = util.format(arguments[0], arguments[1])
      break
    case 3:
      str = util.format(arguments[0], arguments[1], arguments[2])
      break
    default:
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
      }
      str = util.format.apply(util, args)
      break
  }
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyInverse('sill', this._useColor))
    this._log(line)
  })
}

Log.prototype.verbose = function verbose() {
  if (!this._shouldLog('verbose')) return false

  let str
  switch (arguments.length) {
    case 1:
      str = util.format(arguments[0])
      break
    case 2:
      str = util.format(arguments[0], arguments[1])
      break
    case 3:
      str = util.format(arguments[0], arguments[1], arguments[2])
      break
    default:
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
      }
      str = util.format.apply(util, args)
      break
  }
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyFG('verb', brightBlue, this._useColor))
    this._log(line)
  })
}

Log.prototype.info = function info() {
  if (!this._shouldLog('info')) return false

  let str
  switch (arguments.length) {
    case 1:
      str = util.format(arguments[0])
      break
    case 2:
      str = util.format(arguments[0], arguments[1])
      break
    case 3:
      str = util.format(arguments[0], arguments[1], arguments[2])
      break
    default:
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
      }
      str = util.format.apply(util, args)
      break
  }
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyFG('info', brightGreen, this._useColor))
    this._log(line)
  })
}

Log.prototype.http = function http() {
  if (!this._shouldLog('http')) return false

  let str
  switch (arguments.length) {
    case 1:
      str = util.format(arguments[0])
      break
    case 2:
      str = util.format(arguments[0], arguments[1])
      break
    case 3:
      str = util.format(arguments[0], arguments[1], arguments[2])
      break
    default:
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
      }
      str = util.format.apply(util, args)
      break
  }
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyFG('http', green, this._useColor))
    this._log(line)
  })
}

Log.prototype.warn = function warn() {
  if (!this._shouldLog('warn')) return false

  let str
  switch (arguments.length) {
    case 1:
      str = util.format(arguments[0])
      break
    case 2:
      str = util.format(arguments[0], arguments[1])
      break
    case 3:
      str = util.format(arguments[0], arguments[1], arguments[2])
      break
    default:
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
      }
      str = util.format.apply(util, args)
      break
  }
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyFGBG('WARN', black, yellow, this._useColor))
    this._log(line)
  })
}

Log.prototype.error = function error() {
  if (!this._shouldLog('error')) return false

  let str
  switch (arguments.length) {
    case 1:
      str = util.format(arguments[0])
      break
    case 2:
      str = util.format(arguments[0], arguments[1])
      break
    case 3:
      str = util.format(arguments[0], arguments[1], arguments[2])
      break
    default:
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i]
      }
      str = util.format.apply(util, args)
      break
  }
  str.split(/\r?\n/).forEach((line) => {
    this._writeComponent(applyFG('ERR!', brightRed, this._useColor))
    this._log(line)
  })
}

Log.prototype._writeHeading = function _writeHeading(heading) {
  if (heading)
    this.stream.write(applyFG(heading, white, this._useColor))
}

Log.prototype._writePrefix = function _writePrefix(prefix) {
  this.stream.write(applyFG(prefix, this.color, this._useColor))
}

function applyFG(str, fg, color) {
  if (color)
    return `\x1b[${fg}m${str}\x1b[0m `

  return `${str} `
}

function applyFGBG(str, fg, bg, color) {
  if (color)
    return `\x1b[${fg};${bg + 10}m${str}\x1b[0m `

  return `${str} `
}

function applyInverse(str, color) {
  if (color)
    return `\x1b[7m${str}\x1b[27m `

  return `${str} `
}

function leftPad(str, max) {
  if (str.length < max) {
    return ' '.repeat(max - str.length) + str + ' |'
  }

  if (str.length === max) return str + ' |'
  return str.slice(0, max) + ' |'
}

module.exports = new Log()
module.exports.Log = Log
