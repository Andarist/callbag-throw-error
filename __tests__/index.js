import forEach from 'callbag-for-each'
import pipe from 'callbag-pipe'
import subscribe from 'callbag-subscribe'
import tap from 'callbag-tap'

import throwError from '../src'

test('does not emit any values', () => {
  const actual = []

  pipe(
    throwError('err'),
    forEach(value => {
      actual.push(value)
    }),
  )

  expect(actual).toEqual([])
})

test('does fail immediately with error', done => {
  const actual = []

  const fail = () => {
    done.fail('This should not happen.')
  }

  pipe(
    throwError('err'),
    subscribe({
      next: fail,
      error(error) {
        actual.push(error)
      },
      complete: fail,
    }),
  )

  expect(actual).toEqual(['err'])
  done()
})

test('should default to dummy error', () => {
  let error

  pipe(
    throwError(),
    subscribe({
      error(_error) {
        error = _error
      },
    }),
  )

  expect(error).toBeInstanceOf(Error)
})

test('does not emit error if sink unsubscribes immediately', done => {
  const fail = () => {
    done.fail('This should not happen.')
  }

  const makeSink = () => source => {
    source(0, (start, talkback) => {
      if (start !== 0) return
      talkback(2)
    })
  }

  pipe(
    throwError('err'),
    tap(fail, fail, fail),
    makeSink(),
  )

  done()
})
