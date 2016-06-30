'use strict'

const Log = require('./')
const log = Log.child('test')
log._useColor = true
Log.info(Log.color, 'works, but has no heading')

log.level = 'silly'
const m = 'This is a log message'
log.silly('silly', m)
log.verbose('verbose', m)
log.info('info', m)
log.http('http', m)
log.warn('warn', m)
log.error('error', m)

const log2 = log.child('biscuits')
log.info('log2 level', log2.level)
log2.level = 'info'
log2._useColor = true
log.info('log2 level', log2.level)
log2.silly('SHOULD NOT SEE')
log2.info('SHOULD SEE ME')

const log3 = log.child('another log')

log3.info('HELLOOOOO!!! I have some cut off')
log3.maxComponentLength = 20
log3.info('HELLO!!!')
log3.info('now you can see more')
