# kittie

[![Build Status](https://travis-ci.org/evanlucas/kittie.svg)](https://travis-ci.org/evanlucas/kittie)

A fast, simple logger with children

## Install

```bash
$ npm install [--save] kittie
```

## API

### log

A logger is exported. To use:

```js
const log = require('kittie')
log.silly('hello')
log.verbose('hello')
log.info('hello')
log.http('hello')
log.warn('hello')
log.error('hello')

// to change the log level
log.level = 'silly'

// we also support child loggers
const debug = log.child('debug')
debug.level = process.env.DEBUG
  ? 'silent'
  : 'silly'

debug.info('Hey! This is a debug message')
```

Try it out by pasting the above into a file and running it with node.

## Test

```bash
$ npm test
```

## TODO

* Add better documentation

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
