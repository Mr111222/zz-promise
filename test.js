const Promise = require('./myPromise.js')

/**
 * 普通示例
 * 
 */
// new Promise((resolve, reject) => {
//   setTimeout(()=>{
//     resolve(12)
//   }, 2000)

//   // resolve(2000)
// })
// .then(res=>{
//   console.log(`${res}---->success`)
// }, err=>{
//   console.log(`${err}---->error`)
// })

// var s = Promise.resolve(1)
// s.then(res => console.log(res))

/**
 * 递归调用示例
 * 
 */
new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve(12)
    // reject('err')
  }, 2000)
})
.then(res=>{
  return new Promise((resolve, reject)=>{  // 多级嵌套实现利用递归调取
    resolve(
      new Promise((resolve, reject) =>{
        resolve('hehehhe')
      })
    )
  })
}, err=>{
  console.log(`${err}---->error`)
})
.then(res=>{
  console.log(res, '返回值')
})


/** 
 * 循环引用测试
 * 
*/
// var p = new Promise((resolve, reject) => {
// 		resolve(12)
// })
// var p1 = p.then(res=>{
//   return p1
// })

// var p2 = p1.then(res=>{
//   console.log(res)
// })



/*
*	all 方法
*/
// var p1 = Promise.resolve('a');
//  var p2 = Promise.resolve('b');
//  var p3 = Promise.resolve('c');
// Promise.all([p1,p2,p3]).then(value => {
//     console.log(value);
// })
