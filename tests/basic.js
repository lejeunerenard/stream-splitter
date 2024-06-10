const test = require('brittle')
const SplitterStream = require('../')
const { Writable } = require('stream')

const streamToArray = (array) => new Writable({
  objectMode: true,
  write (chunk, _, cb) {
    array.push(chunk)
    cb(null)
  }
})

test('basic', (t) => {
  const odds = []
  const oddsStream = streamToArray(odds)
  const evens = []
  const evenStream = streamToArray(evens)

  const splitter = new SplitterStream((chunk, enc, streams) => {
    return streams[chunk % 2]
  }, [evenStream, oddsStream], { objectMode: true })

  splitter.write(1)
  splitter.write(3)
  splitter.write(2)
  splitter.write(8)
  splitter.write(9)

  t.alike(odds, [1, 3, 9])
  t.alike(evens, [2, 8])
})
