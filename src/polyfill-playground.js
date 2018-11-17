import MyPromise from './MyPromise'


const p1 = new MyPromise(resolve => resolve(1))

console.log('p1 = ', p1.toString())


const p2 = new MyPromise(resolve => {
  setTimeout(() => resolve(2), 1000)
})

console.log('p2 = ', p2.toString())

p2.then(v => { 
  console.log('p2 = ', p2.toString())
})


const p3 = new MyPromise(resolve => resolve(3))
  .then(v => v * 3)

console.log('p3 = ', p3.toString())

setTimeout(() => console.log('p3 = ', p3.toString()))

