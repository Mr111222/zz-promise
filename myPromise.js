const isFunction = variable => typeof variable === 'function'
class MyPromise{
  constructor (executor) {
    if (!isFunction(executor)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    this.state = MyPromise.PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = [] // 成功
    this.onRejectedCallbacks = []  // 失败
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (err) {
      this.reject(err)
    }
  }
  resolve(value){
    if(this.state === MyPromise.PENDING) {
      this.state = MyPromise.FULFILLED
      this.value = value
      // 状态改变直接发布之前的订阅者
      this.onFulfilledCallbacks.forEach(fn=>fn())
    }
  }
  reject(reason){
    if(this.state === MyPromise.PENDING) {
      this.state = MyPromise.REJECTED
      this.reason = reason
      // 状态改变直接发布之前的订阅者
      this.onRejectedCallbacks.forEach(fn=>fn())
    }
  }

  then (onFulfilled, onRejected){
    var promise2 = new MyPromise((resolve, reject) => {
      if(this.state === MyPromise.FULFILLED) {
        setTimeout(()=>{
          const x = onFulfilled(this.value)
          promiseResolve(promise2, x, resolve, reject)
        })  
      }
      if(this.state === MyPromise.REJECTED) {
        setTimeout(()=>{
          const x = onRejected(this.reason)
          promiseResolve(promise2, x, resolve, reject)
        })
      }
      // 当前状态是否为异步进行发布订阅者模式
      if(this.state === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(()=>{
          setTimeout(()=>{
            const x = onFulfilled(this.value)
            promiseResolve(promise2, x, resolve, reject)
          })
        })
        this.onRejectedCallbacks.push(()=>{
          setTimeout(()=>{
            const x = onRejected(this.reason)
            promiseResolve(promise2, x, resolve, reject)
          })
        })
      }
    })
    return promise2
  }

  static all (list) {
    return new MyPromise((resolve, reject) => {
      /**
       * 返回值的集合
       */
      let values = []
      let count = 0
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(res => {
          values[i] = res
          count++
          // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
          if (count === list.length) resolve(values)}, err => {
          // 有一个被rejected时返回的MyPromise状态就变成rejected
          reject(err)
        })
      }
    })
  }
  static race (list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
  static resolve (value) {
    // 如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
  // 添加静态reject方法
  static reject (reason) {
    return new MyPromise((resolve ,reject) => reject(reason))
  }
}

const promiseResolve = (promise2, x, resolve, reject) => {
  if(promise2 === x) {
    return reject(new TypeError(`Chaining cycle detected for promise #<Promise>`)) 
  }
  if(typeof x === 'function' || (typeof x === 'object' && x !== null)) {
    try{
      const then = x.then
      if(typeof then === 'function') { // 认为是promise
        then.call(x, y=>{
          promiseResolve(promise2, y, resolve, reject) // 利用递归调取嵌套返回new Promise
        },e=>{
          reject(e)
        })
      }
    }catch(e) {
      reject(e)
    }
  }else{
    resolve(x)
  }
}


MyPromise.PENDING = 'pending'
MyPromise.FULFILLED = 'fulfilled'
MyPromise.REJECTED = 'rejected'




// 检测类型
const isPromise = (value) => {
  if(typeof value === 'function' || (typeof value === 'undefined' && value != null)){
      if(typeof value.then === 'function'){
          return true;
      }
  }
  return false;
}

module.exports = MyPromise