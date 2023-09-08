export interface IMiniappRegistrationInfo {
  /**
   * 小程序唯一id
   */
  id: string;
  /**
   * 小程序名称
   */
  name: string;
  /**
   * 小程序的挂载点标识
   */
  entry: string[];
  __INTERNAL__entryInfoList?: IMiniappRegistrationEntry[];
  /**
   * 小程序的运行时类型
   */
  runtime: "IFRAME" | "VM" | "CROSS_SITE_IFRAME";
  /**
   * 小程序入口 url
   */
  endpoint: string;
  /**
   * 小程序开发者信息
   */
  developer?: string;
  /**
   * 限定通讯的 host origin 信息，如果没有则接口不会生效
   *
   * 宿主域名（支持泛域名）或 origin
   */
  hostOrigin?: string;
  /**
   * 小程序额外的注册信息
   */
  data?: any;
  /**
   * 禁用的 API 列表
   */
  forbiddenApis?: string[];
}

interface IMiniappRegistrationEntry {
  entryPosition: string;
  entryDesc?: string;
  icon: string;
  hoverIcon: string;
}

type PartialMiniappRegistrationInfo = Pick<IMiniappRegistrationInfo, "id" | "name" | "runtime">;

export type APISession = {
  get alive(): boolean;
  get afterInitialization(): boolean;
  /**
   * 返回当前Session状态
   */
  get state(): number;
  dispose?(): void;
  /**
   * 将一个变更放入Session的变更栈，会检验Session状态
   * @param restore 变更还原函数
   */
  pushChange(restore: () => void): void;
}

type APIBuilder<T = any, VMValueType = undefined> = (info: PartialMiniappRegistrationInfo, apiSession: APISession, checkAuthorization: (authorizationKey: string) => boolean) => {
  value: T;
  type: any & (VMValueType extends undefined ? {
    VALUE_TYPE?: undefined;
  } : {
    VALUE_TYPE: VMValueType;
  });
  /**
   * 当前接口组对应的namespace, 支持以'.'分隔，如'a.b.c'，最终会展示为'IDP.a.b.c'
   */
  namespace: string;
};


export interface IManager {
  enableDev(): void;
  disableDev(): void;
  enableDebug(): void;
  disableDebug(): void;
  killActive(info?: string | IMiniappRegistrationInfo): void;
  registerDynamicLoadedApis(loadFn: () => Promise<APIBuilder[]>): void;
  loadApp(): void;
  registerMiniapp(appInfo: IMiniappRegistrationInfo): void;
  unregisterMiniapp(appId: string): IMiniappRegistrationInfo | undefined;
}


/**
 * 小程序管理器
 */
export function getMiniAppManager(): IManager {
  const appCoreModule = (window as any).pubCmnPackages['@qunhe/app-core']('./index.js');
  const AppServicePlugin = appCoreModule.AppServicePlugin;

  const appServicePlugin = appCoreModule.app.pluginManager.pluginMap.get(AppServicePlugin);

  return appServicePlugin.miniappManager as any as IManager;
}

/**
 * 注册事件API
 * @param manager
 */
export function registryVmApiForRpc(manager: IManager) {
  console.log('eder mp-devtool: register idp apis for message');
  manager.registerDynamicLoadedApis(async () => {
    return [(info: any, apiSession: APISession) => {
      return {
        namespace: '_mpDevtool_',
        value: {
          __sendMessage(data: any) {
            console.log('eder data', data)
          },
          __receiveMessage(fn: (data: any) => any) {
          },
          __setTimeout(fn: () => any, time: number) {
            return setTimeout(fn, time);
          },
          __clearTimeout(timer: number) {
            clearTimeout(timer);
          },
          __getAppInfo() {
            return {
              id: info.id,
              name: info.name,
            }
          },
          checkApiBlock(api: string) {
            // return window.mpdevInterception.isBlockApi(api);
          },
          checkApiMock(api: string) {
            // return window.mpdevInterception.queryMockApi(api);
          }
        },
        type: {
          type: 3,
          properties: {
            __sendMessage: {
              name: '__sendMessage',
              varying: false,
              keepArgsHandle: true,
              args: [
                {
                  type: 7
                }
              ],
              type: 5,
              return: {
                type: 6
              }
            },
            __receiveMessage: {
              name: '__receiveMessage',
              varying: false,
              keepArgsHandle: true,
              args: [
                {
                  type: 5,
                  name: '__listenFn',
                  varying: false,
                  keepArgsHandle: true,
                  args: [
                    {
                      type: 7
                    },
                    {
                      type: 7
                    }
                  ],
                  return: {
                    type: 7
                  },
                }
              ],
              type: 5,
              return: {
                type: 6
              },
            },
            __setTimeout: {
              name: '__setTimeout',
              varying: false,
              keepArgsHandle: true,
              args: [
                {
                  type: 5,
                  name: '__listenFn',
                  varying: false,
                  keepArgsHandle: true,
                  args: [
                    {
                      type: 7
                    },
                    {
                      type: 7
                    },
                    {
                      type: 7
                    },
                  ],
                  return: {
                    type: 7
                  },
                },
                {
                  type: 7
                },
                {
                  type: 7
                }
              ],
              type: 5,
              return: {
                type: 6
              },
            },
            __clearTimeout: {
              name: '__clearTimeout',
              varying: false,
              keepArgsHandle: true,
              args: [
                {
                  type: 7
                }
              ],
              type: 5,
              return: {
                type: 6
              },
            },
            __getAppInfo: {
              name: '__getAppInfo',
              varying: false,
              keepArgsHandle: true,
              args: [],
              type: 5,
              return: {
                type: 7
              },
            },
            checkApiBlock: {
              name: 'checkApiBlock',
              varying: false,
              keepArgsHandle: true,
              args: [
                {
                  type: 7
                }
              ],
              type: 5,
              return: {
                type: 2
              }
            },
            checkApiMock: {
              name: 'checkApiBlock',
              varying: false,
              keepArgsHandle: true,
              args: [
                {
                  type: 7
                }
              ],
              type: 5,
              return: {
                type: 7
              }
            },
          }
        }
      };
    }];
  });
}

if (typeof (window as any).pubCmnPackages !== 'undefined') {
  const appManager = getMiniAppManager()
  registryVmApiForRpc(appManager);
}
