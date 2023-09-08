import { ILog } from '@root/src/types';
import { trackObj } from './track';

/** 获取VM全局对象 */
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

// 重写VM代码，监听IDP执行
const {
  value,
} = trackObj(getGlobalObject(), {
  include(propKey: string | symbol | number, target: any, parentNamespace: (string | symbol | number)[]): boolean {
    // 仅IDP api拦截
    return (propKey === 'IDP' || parentNamespace[0] === 'IDP') &&
      parentNamespace[1] !== '_mpDevtool_';
  },
  whenCalled(log: ILog) {
    originIDP._mpDevtool_.__sendMessage(log);
  },
  whenGet(log: ILog) {
    originIDP._mpDevtool_.__sendMessage(log);
  },
});

getGlobalObject().IDP = value.IDP;
