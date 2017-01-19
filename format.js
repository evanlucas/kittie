'use strict'

const util = require('util')
const inspect = util.inspect
const depth = 5

module.exports = function format(f) {
  if (typeof f !== 'string') {
    const objects = new Array(arguments.length)
    for (var index = 0; index < arguments.length; index++) {
      objects[index] = inspect(arguments[index], {
        depth: depth
      })
    }
    return objects.join(' ')
  }

  var argLen = arguments.length

  if (argLen === 1) return f

  var str = ''
  var a = 1
  var lastPos = 0
  for (var i = 0; i < f.length;) {
    if (f.charCodeAt(i) === 37/*'%'*/ && i + 1 < f.length) {
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
          if (a >= argLen)
            break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Number(arguments[a++])
          lastPos = i = i + 2
          continue
        case 106: // 'j'
          if (a >= argLen)
            break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += tryStringify(arguments[a++])
          lastPos = i = i + 2
          continue
        case 115: // 's'
          if (a >= argLen)
            break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += String(arguments[a++])
          lastPos = i = i + 2
          continue
        case 37: // '%'
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += '%'
          lastPos = i = i + 2
          continue
      }
    }
    ++i
  }
  if (lastPos === 0)
    str = f
  else if (lastPos < f.length)
    str += f.slice(lastPos)
  while (a < argLen) {
    const x = arguments[a++]
    if (x === null || (typeof x !== 'object' && typeof x !== 'symbol')) {
      str += ' ' + x
    } else {
      str += ' ' + inspect(x, {
        depth: depth
      })
    }
  }
  return str
}

function tryStringify(arg) {
  try {
    return JSON.stringify(arg)
  } catch (_) {
    return '[Circular]'
  }
}
