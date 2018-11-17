import MyPromise from '..//MyPromise'


const addOne = value => value + 1
const addTwo = value => value + 2
const addThree = value => value + 3

describe('crazy', () => {
  describe('synchronous resolution and rejection', () => {
    it('should pass', done => {
      const p = new MyPromise(resolve => resolve(1))

      const p1 = p
        .then(addOne)
        .then(addThree)

      const p2 = p
        .then(addTwo)
        .then(addThree)

      const p3 = p2
        .then(addOne)
        .then(addTwo)
        .then(addThree)

      expect(p.toString()).toBe('MyPromise {<resolved>: 1}')

      const checkPromises = () => {
        expect(p1.toString()).toBe('MyPromise {<resolved>: 5}')
        expect(p2.toString()).toBe('MyPromise {<resolved>: 6}')
        expect(p3.toString()).toBe('MyPromise {<resolved>: 12}')
        done()
      }

      setTimeout(checkPromises, 100)
    })

    it('should pass as well', done => {
      const p = new MyPromise((resolve, reject) => reject('Error'))

      const p1 = p
        .then(addOne)

      const p2 = p1
        .then(addOne)
        .then(addTwo)

      const p3 = p2
        .then(addOne)
        .catch(e => 5)
        .then(addTwo)
        .then(addThree)

      const p4 = p3
        .then(addOne)
        .catch()
        .then(addTwo)
        .catch()
        .then(addThree)

      expect(p.toString()).toBe('MyPromise {<rejected>: Error}')

      const checkPromises = () => {
        expect(p1.toString()).toBe('MyPromise {<rejected>: Error}')
        expect(p2.toString()).toBe('MyPromise {<rejected>: Error}')
        expect(p3.toString()).toBe('MyPromise {<resolved>: 10}')
        expect(p4.toString()).toBe('MyPromise {<resolved>: 16}')
        done()
      }

      setTimeout(checkPromises, 100)
    })
  })

  describe('asynchronous resolution and rejection', () => {
    it('should pass', done => {
      const p = new MyPromise(resolve => { 
        setTimeout(() => resolve(1), 100)
      })

      const p1 = p
        .then(addOne)
        .then(addThree)

      const p2 = p
        .then(addTwo)
        .then(addThree)

      const p3 = p2
        .then(addOne)
        .then(addTwo)
        .then(addThree)

      expect(p.toString()).toBe('MyPromise {<pending>}')

      const checkPromises = () => {
        expect(p1.toString()).toBe('MyPromise {<resolved>: 5}')
        expect(p2.toString()).toBe('MyPromise {<resolved>: 6}')
        expect(p3.toString()).toBe('MyPromise {<resolved>: 12}')
        done()
      }

      setTimeout(checkPromises, 200)
    })

    it('should pass as well', done => {
      const p = new MyPromise((resolve, reject) => {
        setTimeout(() => reject('Error'), 100)
      })

      const p1 = p
        .then(addOne)

      const p2 = p1
        .then(addOne)
        .then(addTwo)

      const p3 = p2
        .then(addOne)
        .catch(e => 5)
        .then(addTwo)
        .then(addThree)

      const p4 = p3
        .then(addOne)
        .catch()
        .then(addTwo)
        .catch()
        .then(addThree)

      expect(p.toString()).toBe('MyPromise {<pending>}')

      const checkPromises = () => {
        expect(p1.toString()).toBe('MyPromise {<rejected>: Error}')
        expect(p2.toString()).toBe('MyPromise {<rejected>: Error}')
        expect(p3.toString()).toBe('MyPromise {<resolved>: 10}')
        expect(p4.toString()).toBe('MyPromise {<resolved>: 16}')
        done()
      }

      setTimeout(checkPromises, 200)
    })
  })
})

