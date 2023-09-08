import { memo } from "react";
import styles from "./index.module.scss";
import { LogItem } from "./LogItem";
import { ILog } from "@root/src/types";

interface IProps {
  data: ILog[];
  pickLog: (log: ILog) => void;
}

/** API日志列表 */
const LogList = memo((props: IProps) => {
  const { data, pickLog } = props;
  return (
    <div className={styles.list}>
      <div className={styles.logs}>
        {data.map((d) => (
          <LogItem onClick={pickLog} key={d.t} data={d} />
        ))}
      </div>
    </div>
  );
});

export { LogList };
