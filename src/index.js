const states = {
  pending: '<pending>',
  rejected: '<rejected>',
  resolved: '<resolved>'
}

export default class MyPromise {
  constructor(cb) {
    this._state = states.pending
    this._value = undefined // TODO: without undefined - ?

    // Promises returned from 'then'
    // alongside the callbacks passed to 'then'
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

    // We should also resolve all promises that were returned from 'then'
    // while this promise was in pending state
    this._resolveThenedPromises()
  }

  _reject() {
    this._state = states.rejected
  }

  catch() {

  }

  then(onFulfilled, onRejected) {
    // Resolve with the same value if no onFulfilled callback
    // has been passed
    if (!onFulfilled) onFulfilled = v => v

    const p = new MyPromise(() => {})

    switch (this._state) {
      case states.resolved:
        // Resolve returned promise asynchronously
        setTimeout(() => p._resolve(onFulfilled(this._value)), 0)
        return p

      case states.pending:
        this._thenedPromises.push({ onFulfilled, p })
        return p

      // case rejected:
      // TODO
    }
  } 
}

