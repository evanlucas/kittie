'use strict'

const Log = require('../').Log

const log = new Log({
  inheritLogLevel: true
, level: 'info'
, component: 'parent'
, useColor: true
})

log.info('log level', log.level)

const child1 = log.child('child1')
child1.info('log level', child1.level)
const child2 = log.child('child2')
child2.info('log level', child2.level)

log.level = 'silly'

log.silly('log level', log.level)
child1.silly('log level', child1.level)
child2.silly('log level', child2.level)

log.level = 'info'

// these won't show since we are inheriting the parent's log level
log.silly('log level again', log.level)
child1.silly('log level again', child1.level)
child2.silly('log level again', child2.level)

log.info('log level again', log.level)
child1.info('log level again', child1.level)
child2.info('log level again', child2.level)
