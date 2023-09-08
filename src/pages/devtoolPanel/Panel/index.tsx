import React, { useEffect, useState, useMemo } from "react";
import { LogList } from "../LogList";
import { ILog } from "@root/src/types";
import styles from './index.module.scss';
import { cx, tFormat } from "../utils";
import { JSONTree } from 'react-json-tree';
import {} from 'react';

type TabValue = 'all' | 'get' | 'call';
const tabs: {label: string; value: TabValue;}[] = [
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '获取日志',
    value: 'get'
  },
  {
    label: '执行日志',
    value: 'call'
  },
];

const jsonTreeTheme = {
  scheme: 'default',
  author: 'Mihail Diordiev (https://github.com/zalmoxisus)',
  base00: '#ffffff',
  base01: '#f3f3f3',
  base02: '#e8e8e8',
  base03: '#b8b8b8',
  base04: '#585858',
  base05: '#383838',
  base06: '#282828',
  base07: '#181818',
  base08: '#d80000',
  base09: '#d65407',
  base0A: '#dc8a0e',
  base0B: '#236e25',
  base0C: '#86c1b9',
  base0D: '#1155cc',
  base0E: '#aa17e6',
  base0F: '#a16946',
};

/** devtool面板 */
const Panel: React.FC = () => {
  const [apiLogs, setApiLogs] = useState<ILog[]>([]);
  const [getApiLogs, setGetApiLogs] = useState<ILog[]>([]);
  const [callApiLogs, setCallApiLogs] = useState<ILog[]>([]);
  const [logTab, setLogTab] = useState<TabValue>('all');
  const [logDetail, setLogDetail] = useState<object | undefined>();

  // 同background.js建立连接，接收日志消息
  useEffect(() => {
    const backgroundPageConnection = chrome.runtime.connect({
      name: "panel"
    });
    backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    backgroundPageConnection.onMessage.addListener((log: ILog) => {
      setApiLogs(prev => ([...prev, log]));
      if (log.type === 'call') {
        setCallApiLogs(prev => ([...prev, log]));
      } else {
        setGetApiLogs(prev => ([...prev, log]));
      }
    });
  }, []);

  const renderLogs = useMemo(() => {
    return logTab === 'all'
      ? apiLogs
      : logTab === 'get'
        ? getApiLogs
        : callApiLogs;
  }, [getApiLogs, callApiLogs, apiLogs, logTab]);

  const updateLogDetail = (log: ILog) => {
    const data: Record<string, any> = {
      'time': tFormat(log.t),
      'type': log.type,
      'API': log.ns,
      'arguments': log.args || '无',
      'error': log.err || '无',
      'return': log.res || '无'
    };
    setLogDetail(data);
  }

  return (
    <div className={styles.devtoolPanel}>
      <div className={styles.left}>
        <div className={styles.tabs}>
          {
            tabs.map(tab => (
              <div key={tab.value} className={cx([styles.tab, tab.value === logTab ? styles.active : ''])} onClick={() => { setLogTab(tab.value); }}>{tab.label}</div>
            ))
          }
        </div>
        <LogList pickLog={updateLogDetail} data={renderLogs} />
      </div>
      <div className={styles.right}>
        {
          logDetail &&
            <JSONTree hideRoot theme={jsonTreeTheme} data={logDetail} />
        }
      </div>
    </div>
  );
};

export default Panel;
