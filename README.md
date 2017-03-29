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

Each logger has the following methods:

#### silly(message[, meta])

* `message` [`<String>`][]
* `meta` [`<Object>`][]

Will only be logged if the logger's `level` is set to `silly`.

#### verbose(message[, meta])

* `message` [`<String>`][]
* `meta` [`<Object>`][]

Will only be logged if the logger's `level` is set to `silly` or `verbose`.

#### info(message[, meta])

* `message` [`<String>`][]
* `meta` [`<Object>`][]

Will only be logged if the logger's `level` is set to `silly`, `verbose`, or
`info`.

#### http(message[, meta])

* `message` [`<String>`][]
* `meta` [`<Object>`][]

Will only be logged if the logger's `level` is set to `silly`, `verbose`,
`info`, or `http`.

#### warn(message[, meta])

* `message` [`<String>`][]
* `meta` [`<Object>`][]

Will be logged unless the logger's `level` is set to `silent` or `error`.

#### error(message[, meta])

* `message` [`<String>`][]
* `meta` [`<Object>`][]

Will be logged unless the logger's `level` is set to `silent`.

#### inspect(obj[, depth])

`log.inspect()` is a bit different than the other log methods. It functions
at the `verbose` log level, but calls `util.inspect()` under the hood.

#### child(component)

Creates a new child logger that inherits settings from it's parent.
A child logger can be used to distinguish different modules inside
a single project.

## Examples

Check out the [`examples/`](examples/) directory to see some examples

## Log levels

* `silly`
* `verbose`
* `info` **(Default)**
* `http`
* `warn`
* `error`
* `silent`

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

[`<Object>`]: https://mdn.io/object
[`<String>`]: https://mdn.io/string
