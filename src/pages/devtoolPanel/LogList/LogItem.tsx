import { memo } from "react";
import styles from './LogItem.module.scss';
import { ILog } from "@root/src/types";
import day from 'dayjs';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';

const tFormat = (t: number) => day(t).format('YYYY/MM/DD HH:mm:ss');

interface IProps {
  data: ILog;
  onClick: (log: ILog) => void;
}

/** 单条日志记录 */
const LogItem = memo((props: IProps) => {
  const { data, onClick } = props;
  const {
    ns,
    t,
    type
  } = data;

  return (
    <div onClick={() => { onClick(data); }} className={styles.logItem}>
      <div title={type === 'call' ? 'Call' : 'Get'} className={styles.icon}>
        {
          type === 'call'
            ? <PlayArrowOutlinedIcon style={{color: '#b9f6ca', fontSize: '18px'}} />
            : <CloudDoneOutlinedIcon style={{color: '#ffe082',  fontSize: '14px'}} />
        }
      </div>
      <div className={styles.ns}>{ns}</div>
      <div className={styles.time}>{tFormat(t)}</div>
    </div>
  );
});

export { LogItem };
