'use strict'

const util = require('util')
const test = require('tap').test
const format = require('../format')
const symbol = Symbol('foo')

// These are from node core which is MIT licensed.
// https://github.com/nodejs/node/blob/master/test/parallel/test-util-format.js

test('format()', (t) => {
  t.equal(format(), '')
  t.equal(format(''), '')
  t.equal(format([]), '[]')
  t.equal(format([0]), '[ 0 ]')
  t.equal(format({}), '{}')
  t.equal(format({foo: 42}), '{ foo: 42 }')
  t.equal(format(null), 'null')
  t.equal(format(true), 'true')
  t.equal(format(false), 'false')
  t.equal(format('test'), 'test')

  t.equal(format('foo', 'bar', 'baz'), 'foo bar baz')
  t.equal(format(symbol), 'Symbol(foo)')
  t.equal(format('foo', symbol), 'foo Symbol(foo)')
  t.equal(format('%s', symbol), 'Symbol(foo)')
  t.equal(format('%j', symbol), 'undefined')
  t.throws(() => {
    format('%d', symbol)
  }, TypeError)

  t.equal(format('%d', 42.0), '42')
  t.equal(format('%d', 42), '42')
  t.equal(format('%s', 42), '42')
  t.equal(format('%j', 42), '42')

  t.equal(format('%d', '42.0'), '42')
  t.equal(format('%d', '42'), '42')
  t.equal(format('%s', '42'), '42')
  t.equal(format('%j', '42'), '"42"')

  t.equal(format('%%s%s', 'foo'), '%sfoo')

  t.equal(format('%s'), '%s')
  t.equal(format('%s', undefined), 'undefined')
  t.equal(format('%s', 'foo'), 'foo')
  t.equal(format('%s:%s'), '%s:%s')
  t.equal(format('%s:%s', undefined), 'undefined:%s')
  t.equal(format('%s:%s', 'foo'), 'foo:%s')
  t.equal(format('%s:%s', 'foo', 'bar'), 'foo:bar')
  t.equal(format('%s:%s', 'foo', 'bar', 'baz'), 'foo:bar baz')
  t.equal(format('%%%s%%', 'hi'), '%hi%')
  t.equal(format('%%%s%%%%', 'hi'), '%hi%%')
  t.equal(format('%sbc%%def', 'a'), 'abc%def')

  t.equal(format('%d:%d', 12, 30), '12:30')
  t.equal(format('%d:%d', 12), '12:%d')
  t.equal(format('%d:%d'), '%d:%d')

  t.equal(format('o: %j, a: %j', {}, []), 'o: {}, a: []')
  t.equal(format('o: %j, a: %j', {}), 'o: {}, a: %j')
  t.equal(format('o: %j, a: %j'), 'o: %j, a: %j')

  {
    const o = {}
    o.o = o
    t.equal(format('%j', o), '[Circular]')
  }

  const err = new Error('foo')
  t.equal(format(err), err.stack)

  function CustomError(msg) {
    Error.call(this)
    Object.defineProperty(this, 'message', {
      value: msg
    , enumerable: false
    })
    Object.defineProperty(this, 'name', {
      value: 'CustomError'
    , enumerable: false
    })
    Error.captureStackTrace(this, CustomError)
  }
  util.inherits(CustomError, Error)

  const customError = new CustomError('bar')
  t.equal(format(customError), customError.stack)

  // Doesn't capture stack trace
  function BadCustomError(msg) {
    Error.call(this)
    Object.defineProperty(this, 'message', {
      value: msg
    , enumerable: false
    })

    Object.defineProperty(this, 'name', {
      value: 'BadCustomError'
    , enumerable: false
    })
  }
  util.inherits(BadCustomError, Error)
  t.equal(format(new BadCustomError('foo')), '[BadCustomError: foo]')
  t.end()
})
