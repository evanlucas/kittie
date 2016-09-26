'use strict'

const test = require('tap').test
const path = require('path')
const spawn = require('child_process').spawn

const exp1 = [
  'info 95 \'works, but has no heading\''
, '[7msill[27m [96m      test |[0m silly This is a log message'
, '[94mverb[0m [96m      test |[0m verbose This is a log message'
, '[92minfo[0m [96m      test |[0m info This is a log message'
, '[32mhttp[0m [96m      test |[0m http This is a log message'
, '[30;43mWARN[0m [96m      test |[0m warn This is a log message'
, '[91mERR![0m [96m      test |[0m error This is a log message'
, '[92minfo[0m [96m      test |[0m log2 level silly'
, '[92minfo[0m [96m      test |[0m log2 level info'
, '[92minfo[0m [97m  biscuits |[0m SHOULD SEE ME'
, '[92minfo[0m [34manother lo |[0m HELLOOOOO!!! I have some cut off'
, '[92minfo[0m [34m         another log |[0m HELLO!!!'
, '[92minfo[0m [34m         another log |[0m now you can see more'
]

test('log', (t) => {
  t.plan(exp1.length + 1)
  const fp = path.join(__dirname, 'examples/example-1.js')
  const child = spawn(process.execPath, [fp], {
    cwd: process.cwd()
  })

  let buf = ''

  child.stderr.on('data', (chunk) => {
    buf += chunk.toString()
  })

  child.on('close', (code) => {
    t.equal(code, 0, 'code')
    buf.trim().split('\n').forEach((item, idx) => {
      t.equal(item, exp1[idx])
    })
  })
})

/* eslint-disable */
const exp2 = [
  '[7msill[27m [96m     silly |[0m hello'
, '[7msill[27m [96m     silly |[0m hello { name: \'evan\' }'
, '[7msill[27m [96m     silly |[0m hello { name: \'evan\' } true'
, '[7msill[27m [96m     silly |[0m hello { name: \'evan\' } true 5'
, '[7msill[27m [96m     silly |[0m { name: \'evan\','
, '[7msill[27m [96m     silly |[0m   foo: \'bar\','
, '[7msill[27m [96m     silly |[0m   out: '
, '[7msill[27m [96m     silly |[0m    { a: \'b\','
, '[7msill[27m [96m     silly |[0m      b: true,'
, '[7msill[27m [96m     silly |[0m      c: null,'
, '[7msill[27m [96m     silly |[0m      d: false,'
, '[7msill[27m [96m     silly |[0m      e: { name: \'I am a nested object\', nested: [Object] } } }'
, '[94mINSP[0m [96m     silly |[0m { name: [32m\'evan\'[39m,'
, '[94mINSP[0m [96m     silly |[0m   foo: [32m\'bar\'[39m,'
, '[94mINSP[0m [96m     silly |[0m   out: '
, '[94mINSP[0m [96m     silly |[0m    { a: [32m\'b\'[39m,'
, '[94mINSP[0m [96m     silly |[0m      b: [33mtrue[39m,'
, '[94mINSP[0m [96m     silly |[0m      c: [1mnull[22m,'
, '[94mINSP[0m [96m     silly |[0m      d: [33mfalse[39m,'
, '[94mINSP[0m [96m     silly |[0m      e: { name: [32m\'I am a nested object\'[39m, nested: { a: [32m\'even further\'[39m } } } }'
, '[94mINSP[0m [96m     silly |[0m { name: [32m\'evan\'[39m, foo: [32m\'bar\'[39m, out: [36m[Object][39m }'
, '[94mverb[0m [96m     silly |[0m hello'
, '[92minfo[0m [96m     silly |[0m hello'
, '[32mhttp[0m [96m     silly |[0m hello'
, '[30;43mWARN[0m [96m     silly |[0m hello'
, '[91mERR![0m [96m     silly |[0m hello'
, '[94mverb[0m [97m   verbose |[0m hello'
, '[92minfo[0m [97m   verbose |[0m hello'
, '[32mhttp[0m [97m   verbose |[0m hello'
, '[30;43mWARN[0m [97m   verbose |[0m hello'
, '[91mERR![0m [97m   verbose |[0m hello'
, '[92minfo[0m [34m      info |[0m hello'
, '[32mhttp[0m [34m      info |[0m hello'
, '[30;43mWARN[0m [34m      info |[0m hello'
, '[91mERR![0m [34m      info |[0m hello'
, '[32mhttp[0m [31m      http |[0m hello'
, '[30;43mWARN[0m [31m      http |[0m hello'
, '[91mERR![0m [31m      http |[0m hello'
, '[30;43mWARN[0m [32m      warn |[0m hello'
, '[91mERR![0m [32m      warn |[0m hello'
, '[91mERR![0m [33m     error |[0m hello'
, '[92minfo[0m [36m     log-0 |[0m HELLO'
, '[92minfo[0m [37m     log-1 |[0m HELLO'
, '[92minfo[0m [90m     log-2 |[0m HELLO'
, '[92minfo[0m [91m     log-3 |[0m HELLO'
, '[92minfo[0m [92m     log-4 |[0m HELLO'
, '[92minfo[0m [93m     log-5 |[0m HELLO'
, '[92minfo[0m [94m     log-6 |[0m HELLO'
, '[92minfo[0m [95m     log-7 |[0m HELLO'
, '[92minfo[0m [96m     log-8 |[0m HELLO'
, '[92minfo[0m [97m     log-9 |[0m HELLO'
, '[92minfo[0m [34m    log-10 |[0m HELLO'
, '[92minfo[0m [31m    log-11 |[0m HELLO'
, '[92minfo[0m [32m    log-12 |[0m HELLO'
, '[92minfo[0m [33m    log-13 |[0m HELLO'
, '[92minfo[0m [35m    log-14 |[0m HELLO'
, '[92minfo[0m [36m    log-15 |[0m HELLO'
, '[92minfo[0m [37m    log-16 |[0m HELLO'
, '[92minfo[0m [90m    log-17 |[0m HELLO'
, '[92minfo[0m [91m    log-18 |[0m HELLO'
, '[92minfo[0m [92m    log-19 |[0m HELLO'
]
/* eslint-enable */
test('log', (t) => {
  t.plan(exp2.length + 1)
  const fp = path.join(__dirname, 'examples/example-2.js')
  const child = spawn(process.execPath, [fp], {
    cwd: process.cwd()
  })

  let buf = ''

  child.stderr.on('data', (chunk) => {
    buf += chunk.toString()
  })

  child.on('close', (code) => {
    t.equal(code, 0, 'code')
    buf.trim().split('\n').forEach((item, idx) => {
      t.equal(item, exp2[idx])
    })
  })
})

const exp3 = [
  '[92minfo[0m [96m    parent |[0m log level info'
, '[92minfo[0m [97m    child1 |[0m log level info'
, '[92minfo[0m [34m    child2 |[0m log level info'
, '[7msill[27m [96m    parent |[0m log level silly'
, '[7msill[27m [97m    child1 |[0m log level silly'
, '[7msill[27m [34m    child2 |[0m log level silly'
, '[92minfo[0m [96m    parent |[0m log level again info'
, '[92minfo[0m [97m    child1 |[0m log level again info'
, '[92minfo[0m [34m    child2 |[0m log level again info'
]

test('log', (t) => {
  t.plan(exp3.length + 1)
  const fp = path.join(__dirname, 'examples/example-3.js')
  const child = spawn(process.execPath, [fp], {
    cwd: process.cwd()
  })

  let buf = ''

  child.stderr.on('data', (chunk) => {
    buf += chunk.toString()
  })

  child.on('close', (code) => {
    t.equal(code, 0, 'code')
    buf.trim().split('\n').forEach((item, idx) => {
      t.equal(item, exp3[idx])
    })
    t.end()
  })
})
