/** vm 日志格式 */
export interface ILog {
  /** api路径 */
  ns: string;
  /** log时间 */
  t: number;
  /** 行为 */
  type: 'get' | 'call';
  /** 调用参数 */
  args?: any;
  /** api返回值 */
  res?: any;
  /** api错误 */
  err?: any;
}
