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

    // Promises & callbacks from 'then'
    this._thenedPromises = [] 

    cb(this._resolve.bind(this), this._reject.bind(this))
  }

  _resolveThenedPromises() {
    let i = this._thenedPromises.length

    while (i-- > 0) {
      const { onFulfilled, p } = this._thenedPromises.shift()

      p._resolve(onFulfilled(this._value))
    }
  }

  _resolve(value) {
    this._state = states.resolved
    this._value = value

    // Asynchronously resolve all promises returned from 'then'
    setTimeout(this._resolveThenedPromises(), 0)
  }

  _reject(error) {
    this._state = states.rejected
    this._error = error

    // Asynchronously throw an error: TODO
    // setTimeout(() => { throw error }, 0)
  }

  catch() {

  }

  then(onFulfilled, onRejected) {
    // Resolve with the same value if no 
    // onFulfilled callback has been passed
    if (!onFulfilled) onFulfilled = v => v

    // Create a new promise (in pending state)
    const p = new MyPromise(() => {})

    switch (this._state) {
      case states.resolved:
        // Asynchronously resolve returned promise
        setTimeout(() => p._resolve(onFulfilled(this._value)), 0)
        break

      case states.pending:
        // Resolve the new promise later 
        // after 'this' promise has been resolved
        this._thenedPromises.push({ onFulfilled, p })
        break

      // case rejected: TODO
    }

    return p
  } 

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

