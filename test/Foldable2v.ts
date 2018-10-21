import * as assert from 'assert'
import { array } from '../src/Array'
import { fieldNumber } from '../src/Field'
import {
  elem,
  find,
  fold,
  foldM,
  getFoldableComposition,
  intercalate,
  maximum,
  minimum,
  oneOf,
  product,
  sequence_,
  sum,
  toArray,
  traverse_
} from '../src/Foldable2v'
import { IO, io } from '../src/IO'
import { monoidString } from '../src/Monoid'
import * as option from '../src/Option'
import { ordNumber } from '../src/Ord'
import { setoidNumber } from '../src/Setoid'

export const ArrayOptionURI = 'ArrayOption'

export type ArrayOptionURI = typeof ArrayOptionURI

describe('Foldable2v', () => {
  it('toArray', () => {
    assert.deepEqual(toArray(array)([1, 2, 3]), [1, 2, 3])
  })

  it('getFoldableComposition', () => {
    const F = getFoldableComposition(array, option.option)
    // reduce
    assert.strictEqual(F.reduce([option.some('a'), option.some('b'), option.some('c')], '', monoidString.concat), 'abc')
    assert.strictEqual(F.reduce([option.none, option.some('b'), option.none], '', monoidString.concat), 'b')
    assert.strictEqual(F.reduce([option.none, option.none, option.none], '', monoidString.concat), '')
    assert.strictEqual(F.reduce([], '', monoidString.concat), '')
    // foldMap
    assert.strictEqual(F.foldMap(monoidString)([option.some('a'), option.some('b'), option.some('c')], a => a), 'abc')
    assert.strictEqual(F.foldMap(monoidString)([option.none, option.some('b'), option.none], a => a), 'b')
    assert.strictEqual(F.foldMap(monoidString)([option.none, option.none, option.none], a => a), '')
    assert.strictEqual(F.foldMap(monoidString)([], (a: string) => a), '')
    // foldr
    assert.strictEqual(F.foldr([option.some('a'), option.some('b'), option.some('c')], '', monoidString.concat), 'abc')
    assert.strictEqual(F.foldr([option.none, option.some('b'), option.none], '', monoidString.concat), 'b')
    assert.strictEqual(F.foldr([option.none, option.none, option.none], '', monoidString.concat), '')
    assert.strictEqual(F.foldr([], '', monoidString.concat), '')
  })

  it('intercalate', () => {
    assert.strictEqual(intercalate(monoidString, array)(',')(['a', 'b', 'c']), 'a,b,c')
  })

  it('traverse', () => {
    let counter = ''
    const x = traverse_(io, array)(['a', 'b', 'c'], a => new IO(() => (counter += a)))
    x.run()
    assert.strictEqual(counter, 'abc')
  })

  it('sequence', () => {
    let counter = ''
    const x = sequence_(io, array)([
      new IO(() => (counter += 'a')),
      new IO(() => (counter += 'b')),
      new IO(() => (counter += 'c'))
    ])
    x.run()
    assert.strictEqual(counter, 'abc')
  })

  it('minimum', () => {
    assert.deepEqual(minimum(ordNumber, array)([]), option.none)
    assert.deepEqual(minimum(ordNumber, array)([1, 2, 3, 4, 5]), option.some(1))
  })

  it('maximum', () => {
    assert.deepEqual(maximum(ordNumber, array)([]), option.none)
    assert.deepEqual(maximum(ordNumber, array)([1, 2, 3, 4, 5]), option.some(5))
  })

  it('sum', () => {
    assert.strictEqual(sum(fieldNumber, array)([1, 2, 3, 4, 5]), 15)
  })

  it('product', () => {
    assert.strictEqual(product(fieldNumber, array)([1, 2, 3, 4, 5]), 120)
  })

  it('foldM', () => {
    assert.deepEqual(foldM(option.option, array)([], 1, (b, a) => option.none), option.some(1))
    assert.deepEqual(foldM(option.option, array)([2], 1, (b, a) => option.none), option.none)
    assert.deepEqual(foldM(option.option, array)([2], 1, (b, a) => option.some(b + a)), option.some(3))
  })

  it('oneOf', () => {
    assert.deepEqual(oneOf(option.option, array)([]), option.none)
    assert.deepEqual(oneOf(option.option, array)([option.none]), option.none)
    assert.deepEqual(oneOf(option.option, array)([option.none, option.some(1)]), option.some(1))
    assert.deepEqual(oneOf(option.option, array)([option.some(2), option.some(1)]), option.some(2))
  })

  it('elem', () => {
    assert.strictEqual(elem(setoidNumber, array)(1, [1, 2, 3]), true)
    assert.strictEqual(elem(setoidNumber, array)(4, [1, 2, 3]), false)
  })

  it('find', () => {
    assert.deepEqual(find(array)([1, 2, 3], a => a > 4), option.none)
    assert.deepEqual(find(array)([1, 2, 3, 5], a => a > 4), option.some(5))
  })

  it('fold', () => {
    assert.deepEqual(fold(monoidString, array)(['a', 'b', 'c']), 'abc')
  })
})