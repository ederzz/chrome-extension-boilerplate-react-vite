// // 重写VM代码，监听IDP执行
// import ProxyDeep from 'proxy-deep';

// export const getGlobalObject = function (): any {
//   if (typeof window === 'object') {
//     return window;
//   }
//   if (typeof globalThis === 'object') {
//     return globalThis;
//   }
//   return {};
// }


// const originIDP = getGlobalObject().IDP;

// getGlobalObject().IDP = new ProxyDeep(getGlobalObject().IDP, {
//   get(target, key: string, receiver) {
//     const val = Reflect.get(target, key, receiver);
//     originIDP.UI.toast.warn('ederget:IDP.' + this.path.join('.') + '.' + key);
//     console.log('ederget:IDP.' + this.path.join('.') + '.' + key);
//     if (typeof val === 'object') {
//       return this.nest(val);
//     }
//     return val;
//   },
//   apply(target, thisArg, argList) {
//     console.log('eder:called', 'IDP.' + this.path.join('.'))
//     return target.apply(thisArg, argList);
//   }
// });
