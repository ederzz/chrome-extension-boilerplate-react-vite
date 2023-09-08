import { ILog } from '@root/src/types';
import { uniqueId } from './like-lodash';

export interface ITrackOption<T = string | symbol | number, O = any> {
  /**
   * 是否要包含当前的props
   * @param propKey
   * @param target
   * @param parentNamespace
   */
  include?(propKey: T, target: O, parentNamespace: T[]): boolean;

  /**
   * 当变量被读取时，记录命名空间
   * @param name
   * @param value
   */
  whenGet(log: ILog): void;

  /**
   * 当方法开始调用时
   * @param requestId
   * @param namespace
   * @param args
   */
  whenCalledBefore?: (requestId: number, namespace: T[], args: any[]) => void;

  /**
   * 当方法被调用时，将会被调用
   * @param requestId
   * @param namespace 命名空间
   * @param executeTime 方法执行时长
   * @param args 方法的入参
   * @param ret 方法的返回值，如果是Promise，则是Promise里面的值
   * @param err 如果报错就是err对象，否则为null
   */
  whenCalled(log: ILog): void;

  /**
   * 检查api是否被屏蔽
   * @param api api path
   */
  checkBlock?: (api: T[]) => boolean;
  /**
   * 检查api是否有mock数据
   * @param api api path
   */
  checkMock?: (api: T[]) => { hasMock: boolean; data: any; };
}

/**
 * track一个对象
 * @param obj
 * @param option
 */
export function trackObj<T extends Record<string, unknown> | ((...args: any[]) => any)>(
  obj: T,
  option: ITrackOption
): {
  value: T,
  unTrack: () => T
} {
  const namespaceWeakMap = new Map<any, Array<string | symbol | number>>();
  const proxyWeakMap = new Map<any, any>();
  const valueProxyMap = new Map<any, any>();
  const include = option.include ? option.include : () => true;

  namespaceWeakMap.set(obj, []);

  const handler: ProxyHandler<T> = {
    get(target, propKey, receiver) {
      const value = Reflect.get(target, propKey, receiver);
      const parentNamespace = namespaceWeakMap.get(target)!;
      if (proxyWeakMap.has(value)) {
        if (typeof value === 'function') {
          option.whenGet({
            ns: [...parentNamespace, propKey].join('.'),
            type: 'get',
            t: Date.now()
          });
        }
        return proxyWeakMap.get(value)!;
      }

      const isInclude = include(propKey, target, parentNamespace);

      if ((typeof value === 'object' || typeof value === 'function') && value !== null && isInclude) {
        const pxy = new Proxy(value, handler as any);
        proxyWeakMap.set(value, pxy);
        valueProxyMap.set(pxy, value);
        namespaceWeakMap.set(value, [...parentNamespace, propKey]);
        if (typeof value === 'function') {
          option.whenGet({
            ns: [...parentNamespace, propKey].join('.'),
            type: 'get',
            t: Date.now()
          });
        }
        return pxy;
      }

      if (isInclude) {
        option.whenGet({
          ns: [...parentNamespace, propKey].join('.'),
          type: 'get',
          t: Date.now()
        });
      }
      return value;
    },
    apply(target, thisArg, args) {
      const start = Date.now();
      let result: any;
      let err: Error | null = null;
      const namespace = namespaceWeakMap.get(target)!;
      const requestId = uniqueId();
      try {
        option.whenCalledBefore && option.whenCalledBefore(requestId, namespace, thisArg);
        if (option.checkBlock && option.checkBlock(namespace)) {
          throw new Error(`api: ${namespace.join('.')} has been blocked!`)
        }
        const mockRes = option.checkMock && option.checkMock(namespace);
        if (mockRes && mockRes.hasMock) {
          result = mockRes.data;
        } else {
          const currentThis = valueProxyMap.get(thisArg);
          result = Reflect.apply(target as (...args: any[]) => any, currentThis, args);
        }
      } catch (e) {
        err = e as unknown as Error;
      }

      if (
        result !== null &&
        typeof result === 'object' &&
        typeof result.then === 'function' &&
        typeof result.catch === 'function'
      ) {
        return result.then(
          (res: any) => {
            const end = Date.now();
            option.whenCalled({
              ns: namespace.join('.'),
              type: 'call',
              args,
              res: result,
              t: Date.now()
            });
            return res;
          },
          (error: Error) => {
            const end = Date.now();
            const namespace = namespaceWeakMap.get(target)!;
            option.whenCalled({
              ns: namespace.join('.'),
              type: 'call',
              args,
              t: Date.now(),
              err: error
            });
            return Promise.reject(error);
          }
        );
      } else {
        const end = Date.now();
        option.whenCalled({
          ns: namespace.join('.'),
          type: 'call',
          args,
          t: Date.now(),
          res: result,
          err
        });
      }
      if (err !== null) {
        throw err;
      }
      return result;
    },
  };

  return {
    value: new Proxy(obj, handler),
    unTrack: () => {
      namespaceWeakMap.clear();
      proxyWeakMap.clear();
      return obj;
    },
  }
}

