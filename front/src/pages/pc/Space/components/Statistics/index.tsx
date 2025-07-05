import React from 'react';
import styles from './styles.less';

interface Props {
  onClick: (key: string) => void;
  data: {
    key: string;
    label: string;
    value: number;
  }[];
}

const Statistics: React.FC<Props> = ({ onClick, data }) => (
  <div className={styles.tabBarExtraContent}>
    {data.map((item) => {
      const { key, label, value } = item;
      return (
        <div
          key={key}
          className={styles.tabBarExtraContentItem}
          onClick={() => {
            if (typeof onClick === 'function') {
              onClick(key);
            }
          }}
        >
          <div className={styles.tabBarExtraContentItemLabel}>{label}</div>
          <div className={styles.tabBarExtraContentItemNum}>{value}</div>
        </div>
      );
    })}
  </div>
);

export default Statistics;
