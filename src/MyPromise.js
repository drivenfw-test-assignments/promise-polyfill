const states = {
  pending: '<pending>',
  rejected: '<rejected>',
  resolved: '<resolved>'
}

export default class MyPromise {
  constructor(cb) {
    this._state = states.pending
    this._value
    this._error
    this._derivedPromisesToResolveFrom_Resolve = [] 
    this._derivedPromisesToResolveFrom_Reject = [] 
    this._derivedPromisesToReject = []

    cb(this._resolve.bind(this), this._reject.bind(this))
  }

  _resolveDerivedPromises(promises) {
    let i = promises.length

    while (i-- > 0) {
      const { onFulfilled, p } = promises[i]

      p._resolve(onFulfilled(this._value))
    }
  }

  _rejectDerivedPromises(promises) {
    let i = promises.length

    while (i-- > 0) {
      const { onRejected, p, doNotThrow } = promises[i]

      p._reject(onRejected(this._error), doNotThrow)
    }
  }

  _resolve(value) {
    this._state = states.resolved
    this._value = value

    // Asynchronously resolve derived promises
    setTimeout(() => {
      this._resolveDerivedPromises(this._derivedPromisesToResolveFrom_Resolve)
    }, 0)
  }

  _reject(error, doNotThrow = false) {
    this._state = states.rejected
    this._error = error

    // Asynchronously resolve/reject derived promises
    // and throw an error if necessary
    setTimeout(() => {
      this._resolveDerivedPromises(this._derivedPromisesToResolveFrom_Reject)
      this._rejectDerivedPromises(this._derivedPromisesToReject)

      if (!doNotThrow) {
        if (!this._derivedPromisesToResolveFrom_Reject.length &&
            !this._derivedPromisesToReject.length) {

          throw this._error
        } 
      }
    }, 0)
  }

  catch(onRejected) {
    // Create a new promise (in pending state)
    const p = new MyPromise(() => {})

    const handleRejection = () => {
      // If 'this' promise is 'rejected' (or goes from 'pending' to 'rejected')
      // we should either resolve the 'new promise' with the value 
      // returned from the onRejected callback
      // or reject it with this._error if no onRejected callback
      // has been passed in
      
      if (onRejected) {
        this._derivedPromisesToResolveFrom_Reject.push({ 
          onFulfilled: onRejected,
          p
        })
      } else {
        this._derivedPromisesToReject.push({ 
          onRejected: v => v, 
          p, 
          doNotThrow: true 
        })
      }
    }

    switch (this._state) {
      case states.resolved:
        // Asynchronously resolve new promise with this._value
        setTimeout(() => p._resolve(this._value), 0)
        break

      case states.pending:
        // If 'this' promise goes from 'pending' to 'resolved'
        // we should resolve the 'new promise' with this._value
        this._derivedPromisesToResolveFrom_Resolve.push({ onFulfilled: v => v, p })

        handleRejection()

        break

      case states.rejected:
        handleRejection()

        break
    }

    return p
  }

  /* then(onFulfilled, onRejected) {
    // Resolve with this._value if no 
    // onFulfilled callback has been passed
    if (!onFulfilled) onFulfilled = v => v

    // Create a new promise (in pending state)
    const p = new MyPromise(() => {})

    switch (this._state) {
      case states.resolved:
        // Asynchronously resolve new promise
        // with a value returned from onFulfilled
        setTimeout(() => p._resolve(onFulfilled(this._value)), 0)
        break

      case states.pending:
        // Resolve new promise later 
        // after 'this' promise has been resolved
        this._derivedPromises.push({ onFulfilled, p })
        break

      case states.rejected:
        if (onRejected) {
          // Asynchronously resolve new promise
          // with a value returned from onReject
          setTimeout(() => p._resolve(onRejected(this._error)), 0)
        } else {
          // Asynchronously reject new promise
          setTimeout(() => p._reject(this._error), 0)
        }
        break
    }

    return p
  } */

  toString() {
    return do {
      if (this._state === states.pending) {
        `MyPromise {${this._state}}`
      } else if (this._state === states.rejected) {
        `MyPromise {${this._state}: ${this._error}}`
      } else if (this._state === states.resolved) {
        `MyPromise {${this._state}: ${this._value}}`
      }
    }
  }
}

