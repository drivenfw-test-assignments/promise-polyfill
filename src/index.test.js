import MyPromise from './index'


describe('MyPromise', () => {
  describe('then', () => {
    it('returns a new promise', () => {
      const p = new MyPromise(() => {})

      expect(p.then()).toBeInstanceOf(MyPromise)
    })

    it('asynchronously calls the passed in callback with the resolved value', () => {
      const p = new MyPromise(resolve => resolve(5))
      let resolvedValue

      p.then(value => {
        resolvedValue = value
      })

      expect(resolvedValue).toBe(undefined)

      p.then(value => {
        expect(value).toBe(5)
        done()
      })
    })

    it('resolves a newly returned promise with the same value if no callback passed in', () => {
      const p = new MyPromise(resolve => resolve(3)).then()

      p.then(value => { 
        expect(value).toBe(3)
        done()
      })
    })

    it('resolves a newly returned promise with the value returned by onFulfilled callback', () => {
      const p = new MyPromise(resolve => resolve(1)).then(v => v * 2)

      p.then(value => { 
        expect(value).toBe(2)
        done()
      })
    })

    it('supports chaining', () => {
      const increment = value => value + 1
      const p = new MyPromise(resolve => resolve(1))
        .then(increment)
        .then(increment)
        .then(increment)

      expect(p).toBeInstanceOf(MyPromise)

      p.then(value => {
        expect(value).toBe(4)
        done()
      })
    })
  })
})

