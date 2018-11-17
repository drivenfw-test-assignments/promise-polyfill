const p1 = new Promise(resolve => resolve(1))

console.log('p1 = ', p1)


const p2 = new Promise(resolve => {
  setTimeout(() => resolve(2), 1000)
})

console.log('p2 = ', p2)

p2.then(v => { 
  console.log('p2 = ', p2)
})


const p3 = new Promise(resolve => resolve(3))
  .then(v => v * 3)

console.log('p3 = ', p3)

setTimeout(() => console.log('p3 = ', p3))
