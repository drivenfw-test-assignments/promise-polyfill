import MyPromise from './MyPromise'


// -----------------------------------------------------------------------------------------------
// Example 1

const p1 = new MyPromise(resolve => resolve(1))

console.log('p1 = ', p1.toString())

// -----------------------------------------------------------------------------------------------
// Example 2

const p2 = new MyPromise(resolve => {
  setTimeout(() => resolve(2), 1000)
})

console.log('p2 = ', p2.toString())

p2.then(v => { 
  console.log('p2 = ', p2.toString())
})

// -----------------------------------------------------------------------------------------------
// Example 3

const p3 = new MyPromise(resolve => resolve(3))
  .then(v => v * 3)

console.log('p3 = ', p3.toString())

setTimeout(() => console.log('p3 = ', p3.toString()))

// -----------------------------------------------------------------------------------------------
// Example 4

const p4 = new MyPromise((resolve, reject) => reject('Error'))

p4.catch()

console.log('p4 = ', p4.toString())

// -----------------------------------------------------------------------------------------------

