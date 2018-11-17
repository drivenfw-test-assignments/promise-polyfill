import MyPromise from '../MyPromise'


describe('MyPromise', () => {
  describe('constructor', () => {
    it('returns a resolved promise if \'resolve\' is called synchronously', () => {
      const p = new MyPromise(resolve => resolve(5))

      expect(p.toString()).toBe('MyPromise {<resolved>: 5}')
    })

    it('returns a pending promise if \'resolve\' is called asynchronously', () => {
      const p = new MyPromise(resolve => {
        setTimeout(() => resolve(3), 100)
      })

      expect(p.toString()).toBe('MyPromise {<pending>}')
    })

    it('asynchronously resolves promise if \'resolve\' is called asynchronously', done => {
      const p = new MyPromise(resolve => {
        setTimeout(() => resolve(3), 100)
      })

      const checkPromise = () => {
        expect(p.toString()).toBe('MyPromise {<resolved>: 3}')
        done()
      }
      
      setTimeout(checkPromise, 100) 
    })

    it('returns a rejected promise if \'reject\' is called synchronously', () => {
      const p = new MyPromise((resolve, reject) => reject('Error'))

      p.catch()

      expect(p.toString()).toBe('MyPromise {<rejected>: Error}')
    })

    it('returns a pending promise if \'reject\' is called asynchronously', () => {
      const p = new MyPromise((resolve, reject) => {
        setTimeout(() => reject('Error'), 100)
      })

      p.catch()

      expect(p.toString()).toBe('MyPromise {<pending>}')
    })

    it('asynchronously rejects promise if \'reject\' is called asynchronously', done => {
      const p = new MyPromise((resolve, reject) => {
        setTimeout(() => reject('Error'), 100)
      })

      p.catch()

      const checkPromise = () => {
        expect(p.toString()).toBe('MyPromise {<rejected>: Error}')
        done()
      }

      setTimeout(checkPromise, 100)
    })
  })


  describe('catch', () => {
    it('returns a new promise', () => {
      const p = new MyPromise(() => {})

      expect(p.catch()).toBeInstanceOf(MyPromise)
    })

    describe('with original promise resolved synchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise(resolve => resolve(1)).catch()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      it('resolves returned promise asynchronously', done => {
        const p = new MyPromise(resolve => resolve(3)).catch()

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 3}')
          done()
        }

        setTimeout(checkPromise, 0)
      })
    })

    describe('with original promise resolved asynchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise(resolve => {
          setTimeout(() => resolve(1), 100)
        }).catch()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      it('resolves returned promise asynchronously', done => {
        const p = new MyPromise(resolve => {
          setTimeout(() => resolve(3), 100)
        }).catch()

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 3}')
          done()
        }

        setTimeout(checkPromise, 200)
      })
    })

    describe('with original promise rejected synchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise((resolve, reject) => reject('Error')).catch()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      describe('with onRejected callback', () => {
        it('resolves returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .catch(() => {})

          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<resolved>: undefined}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      })

      describe('without onRejected callback', () => {
        it('rejects returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .catch()
         
          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<rejected>: Error}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      })
    })

    describe('with original promise rejected asynchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise((resolve, reject) => {
          setTimeout(() => reject('Error'), 100)
        }).catch()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      describe('with onRejected callback', () => {
        it('resolves returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => { 
            setTimeout(() => reject('Error'), 100)
          }).catch(() => {})

          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<resolved>: undefined}')
            done()
          }

          setTimeout(checkPromise, 200)
        })
      })

      describe('without onRejected callback', () => {
        it('rejects returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .catch()
         
          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<rejected>: Error}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      })
    })
  })


  describe('then', () => {
    it('returns a new promise', () => {
      const p = new MyPromise(() => {})

      expect(p.then()).toBeInstanceOf(MyPromise)
    })

    describe('with original promise resolved synchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise(resolve => resolve(1)).then()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      it('resolves returned promise asynchronously', done => {
        const p = new MyPromise(resolve => resolve(3)).then()

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 3}')
          done()
        }

        setTimeout(checkPromise, 0)
      })

      it('resolves returned promise with the value returned by onFulfilled callback', done => {
        const p = new MyPromise(resolve => resolve(3))
          .then(v => v * 2)

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 6}')
          done()
        }

        setTimeout(checkPromise, 0)
      })

      it('supports chaining', done => {
        const increment = value => value + 1

        const p = new MyPromise(resolve => resolve(1))
        const p1 = p
          .then(increment)
        const p2 = p1
          .then(increment)
          .then(increment)
        const p3 = p2
          .then(increment)
          .then(increment)
          .then(increment)

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 1}')
          expect(p1.toString()).toBe('MyPromise {<resolved>: 2}')
          expect(p2.toString()).toBe('MyPromise {<resolved>: 4}')
          expect(p3.toString()).toBe('MyPromise {<resolved>: 7}')
          done()
        }
       
        setTimeout(checkPromise, 10)
      })
    })

    describe('with original promise resolved asynchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise(resolve => {
          setTimeout(() => resolve(1), 100)
        }).then()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      it('resolves returned promise asynchronously', done => {
        const p = new MyPromise(resolve => {
          setTimeout(() => resolve(5), 100)
        }).then()

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 5}')
          done()
        }

        setTimeout(checkPromise, 200)
      })

      it('resolves returned promise with the value returned by onFulfilled callback', done => {
        const p = new MyPromise(resolve => {
          setTimeout(() => resolve(3), 100)
        }).then(v => v * 3)

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 9}')
          done()
        }

        setTimeout(checkPromise, 200)
      })

      it('supports chaining', done => {
        const increment = value => value + 1

        const p = new MyPromise(resolve => { 
          setTimeout(() => resolve(1), 100)
        })
        const p1 = p
          .then(increment)
        const p2 = p1
          .then(increment)
          .then(increment)
        const p3 = p2
          .then(increment)
          .then(increment)
          .then(increment)

        const checkPromise = () => {
          expect(p.toString()).toBe('MyPromise {<resolved>: 1}')
          expect(p1.toString()).toBe('MyPromise {<resolved>: 2}')
          expect(p2.toString()).toBe('MyPromise {<resolved>: 4}')
          expect(p3.toString()).toBe('MyPromise {<resolved>: 7}')
          done()
        }
       
        setTimeout(checkPromise, 120)
      })
    })

    describe('with original promise rejected synchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise((resolve, reject) => reject('Error')).then()

        p.catch()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      describe('with onRejected callback', () => {
        it('resolves returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .then(() => {}, () => {})

          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<resolved>: undefined}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      })

      describe('without onRejected callback', () => {
        it('rejects returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .then()
        
          p.catch()

          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<rejected>: Error}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      }) 
    })

    describe('with original promise rejected asynchronously', () => {
      it('returns a pending promise', () => {
        const p = new MyPromise((resolve, reject) => reject('Error')).then()

        p.catch()

        expect(p.toString()).toBe('MyPromise {<pending>}')
      })

      describe('with onRejected callback', () => {
        it('resolves returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .then(() => {}, () => {})

          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<resolved>: undefined}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      })

      describe('without onRejected callback', () => {
        it('rejects returned promise asynchronously', done => {
          const p = new MyPromise((resolve, reject) => reject('Error'))
            .then()
        
          p.catch()

          const checkPromise = () => {
            expect(p.toString()).toBe('MyPromise {<rejected>: Error}')
            done()
          }

          setTimeout(checkPromise, 10)
        })
      }) 
    })
  })
})

