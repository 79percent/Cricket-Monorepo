import React from 'react';
import styles from './styles.less';

const Title = () => {
  return (
    <div className={styles.pcTextBox}>
      <div className={styles.big}>加入这里</div>
      <div className={styles.big}>让更多人看到你的作品</div>
      <div className={styles.small}>动漫爱好者的聚集地，只因热爱，无关其他</div>
    </div>
  );
};

export default Title;
