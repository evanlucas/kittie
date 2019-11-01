'use strict'

const Log = require('../')
Log._useColor = true

const obj = {
  name: 'evan'
, foo: 'bar'
, out: {
    a: 'b'
  , b: true
  , c: null
  , d: false
  , e: {
      name: 'I am a nested object'
    , nested: {
        a: 'even further'
      , b: {
          name: 'biscuits'
        , friend: {
            depth: 1
          }
        }
      }
    }
  }
}

const log = Log.child('silly')
log.level = 'silly'
log.silly('hello')
log.silly('hello', {name: 'evan'})
log.silly('hello', {name: 'evan'}, true)
log.silly('hello', {name: 'evan'}, true, 5)
log.silly(obj)
log.verbose('hello')
log.info('hello')
log.http('hello')
log.warn('hello')
log.error('hello')

const log2 = log.child('verbose')
log2.level = 'verbose'
log2.silly('hello')
log2.verbose('hello')
log2.info('hello')
log2.http('hello')
log2.warn('hello')
log2.error('hello')

const log3 = log.child('info')
log3.level = 'info'
log3.silly('hello')
log3.verbose('hello')
log3.info('hello')
log3.http('hello')
log3.warn('hello')
log3.error('hello')

const log4 = log.child('http')
log4.level = 'http'
log4.silly('hello')
log4.verbose('hello')
log4.info('hello')
log4.http('hello')
log4.warn('hello')
log4.error('hello')

const log5 = log.child('warn')
log5.level = 'warn'
log5.silly('hello')
log5.verbose('hello')
log5.info('hello')
log5.http('hello')
log5.warn('hello')
log5.error('hello')

const log6 = log.child('error')
log6.level = 'error'
log6.silly('hello')
log6.verbose('hello')
log6.info('hello')
log6.http('hello')
log6.warn('hello')
log6.error('hello')

const log7 = log.child('silent')
log7.level = 'silent'
log7.silly('hello')
log7.verbose('hello')
log7.info('hello')
log7.http('hello')
log7.warn('hello')
log7.error('hello')

const ar = new Array(20)
for (let i = 0; i < ar.length; i++) {
  ar[i] = `log-${i}`
}
ar.forEach((item) => {
  const log = Log.child(item)
  log.info('HELLO')
})
