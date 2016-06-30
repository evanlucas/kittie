'use strict'

const test = require('tap').test
const path = require('path')
const spawn = require('child_process').spawn
const fs = require('fs')

test('log', (t) => {
  t.plan(2)
  const fp = path.join(__dirname, 'example.js')
  const child = spawn(process.execPath, [fp], {
    cwd: process.cwd()
  })

  let buf = ''

  child.stderr.on('data', (chunk) => {
    buf += chunk.toString()
  })

  child.on('close', (code) => {
    t.equal(code, 0, 'code')
    t.equal(fs.readFileSync(path.join(__dirname, 'log.txt'), 'utf8'), buf)
  })
})
