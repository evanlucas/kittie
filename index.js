'use strict'

const util = require('util')
const mapUtil = require('map-util')

const has = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

const splitRE = /\r?\n/

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

function Log(options, parent) {
  const opts = Object.assign({
    stream: process.stderr
  , level: 'info'
  , heading: ''
  , color: ''
  , maxComponentLength: 10
  , inheritLogLevel: false
  }, options)

  this._parent = parent
  this._children = new Set()
  this._inheritLogLevel = opts.inheritLogLevel

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
      const level = logLevels.get(lvl)
      this._setLogLevel(level)
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

Log.prototype._setLogLevel = function _setLogLevel(level) {
  this._level = level

  // update all children
  if (this._inheritLogLevel && this._children.size) {
    for (const child of this._children) {
      // call directly, no need to do Map#get() for each child
      child._setLogLevel(level)
    }
  }
}

Log.prototype.child = function child(comp) {
  const log = new Log(Object.assign({
    heading: this.heading
  , level: this.level
  , stream: this.stream
  , maxComponentLength: this.maxComponentLength
  , useColor: this._useColor
  , inheritLogLevel: this._inheritLogLevel
  }, {
    component: comp
  }), this)

  this._children.add(log)
  return log
}

Log.prototype._shouldLog = function _shouldLog(lvl) {
  if (this._level === Infinity) return false
  const l = logLevels.get(lvl)
  if (!l) return false
  if (l < this._level) return false
  return true
}

Log.prototype._log = function _log(str) {
  this.stream.write(str + '\n')
}

Log.prototype._writeComponent = function _writeComponent(str) {
  if (this.heading)
    this._writeHeading(this.heading)
  if (str) this.stream.write(str)
  if (this.component)
    this._writePrefix(this.component)
}

Log.prototype.inspect = function inspect(obj, depth) {
  if (!this._shouldLog('verbose')) return
  const str = util.inspect(obj, {
    colors: this._useColor
  , depth: typeof depth === 'number' ? depth : null
  })
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyFG('INSP', brightBlue, this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
  })
}

Log.prototype.silly = function silly() {
  if (!this._shouldLog('silly')) return

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
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyInverse('sill', this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
  })
}

Log.prototype.verbose = function verbose() {
  if (!this._shouldLog('verbose')) return

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
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyFG('verb', brightBlue, this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
  })
}

Log.prototype.info = function info() {
  if (!this._shouldLog('info')) return

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
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyFG('info', brightGreen, this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
  })
}

Log.prototype.http = function http() {
  if (!this._shouldLog('http')) return

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
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyFG('http', green, this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
  })
}

Log.prototype.warn = function warn() {
  if (!this._shouldLog('warn')) return

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
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyFGBG('WARN', black, yellow, this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
  })
}

Log.prototype.error = function error() {
  if (!this._shouldLog('error')) return

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
  str.split(splitRE).forEach((line) => {
    var s = ''
    if (this.heading) s += applyFG(this.heading, white, this._useColor)
    s += applyFG('ERR!', brightRed, this._useColor)
    if (this.component)
      s += applyFG(this.component, this.color, this._useColor)
    s += line
    this._log(s)
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
