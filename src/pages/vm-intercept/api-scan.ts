/**
 * 消息类型
 */
export enum ETestTrackType {
  /**
   * 读取常量
   */
  CONST,
  /**
   * 读取函数
   */
  FUNCTION,
  /**
   * 函数调用
   */
  FUNCTION_CALL
}

export interface ITestApiItem {
  /**
   * API命名空间
   */
  namespace: string;
  /**
   * 类型
   */
  type: ETestTrackType;
  /**
   * 读取次数
   */
  readCount: number;
  /**
   * 执行次数
   */
  runCount: number;
  /**
   * 执行失败次数
   */
  runFailedCount: number;
  /**
   * 最后一次出错时，错误信息
   */
  exceptions?: Array<string | null>;
  /**
   * 多次调用时的函数的入参
   */
  args?: any[][];
  /**
   * 多次调用时，函数的返回值
   */
  retValues?: any[];
}

/**
 * 通过指定对象，扫描出对应的api list
 */
export function scanApiList<T extends Record<string, unknown> | ((...args: any[]) => any)>(obj: T, namespace = ''): ITestApiItem[] {
  const result: ITestApiItem[] = [];
  const stack: [string, any][] = [[namespace, obj]];
  const uniqueSet = new Set<any>([obj]);

  while (stack.length > 0) {
    const [namespace, node] = stack.pop()!;

    if (
      ['function', 'symbol', 'undefined', 'string', 'boolean', 'number', 'bigint'].includes(typeof node)
      || node == null
      || [Map, WeakMap, Set, WeakSet, Promise, Date, RegExp, ArrayBuffer, typeof SharedArrayBuffer != 'undefined' ? SharedArrayBuffer : undefined, DataView]
        .filter(i => !!i)
        .some((i: any) => node instanceof i)
    ) {
      result.push({
        namespace,
        type: typeof node === 'function' ? ETestTrackType.FUNCTION : ETestTrackType.CONST,
        readCount: 0,
        runCount: 0,
        runFailedCount: 0,
      });
    } else if (typeof node === 'object') {
      for (const key in node) {
        const descriptor = Reflect.getOwnPropertyDescriptor(node, key);
        if (typeof key !== 'symbol' && descriptor && !uniqueSet.has(node[key])) {
          const subNamespace = namespace ? `${namespace}.${key}` : key;
          uniqueSet.add(node[key]);
          stack.push([subNamespace, node[key]]);
        }
      }
    }
  }

  return result;
}
