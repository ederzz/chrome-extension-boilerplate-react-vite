// 重写VM代码，监听IDP执行
import ProxyDeep from 'proxy-deep';

export const getGlobalObject = function (): any {
    if (typeof window === 'object') {
      return window;
    }
    if (typeof globalThis === 'object') {
      return globalThis;
    }
    return {};
  }
  
  
const originIDP = getGlobalObject().IDP;
originIDP.UI.toast.warn('called:IDP.');

getGlobalObject().IDP = new ProxyDeep(getGlobalObject().IDP, {
    get(target, key, receiver) {
      const val = Reflect.get(target, key, receiver);
      originIDP.UI.toast.warn('called:IDP.' + this.path.join('.') + (typeof val));
      if (typeof val === 'function') {
        return val;
      }
      return this.nest(val);
    },
    apply(target, thisArg, argList) {
        originIDP.UI.toast.warn('run:IDP.' + argList.join('.'));
        target(...argList);
    }
});