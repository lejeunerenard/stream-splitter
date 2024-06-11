const { Writable } = require('stream')

class SplitterStream extends Writable {
  constructor (splitCb, streams, ...args) {
    super(...args)
    this.splitCb = splitCb
    this.streams = streams
    // TODO Notify the downstream streams they are 'pipe'ed
  }

  _write (chunk, enc, cb) {
    const stream = this.splitCb(chunk, enc, this.streams)
    stream.write(chunk)
    cb(null)
  }

  _final (cb) {
    for (const stream of this.streams) {
      stream.end()
    }
    cb()
  }
}

module.exports = SplitterStream
