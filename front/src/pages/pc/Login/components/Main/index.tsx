import React from 'react';
import styles from './styles.less';
import LoginBox from '../LoginBox';
import Title from '../Title';
import VideoBox from '../VideoBox';

const Main = () => {
  return (
    <section className={styles.pcLoginMain}>
      <div className={styles.left}>
        <div className={styles.titleBox}>
          <Title />
        </div>
        <div className={styles.videoBox}>
          <VideoBox />
        </div>
      </div>
      <div className={styles.right}>
        <LoginBox />
      </div>
    </section>
  );
};

export default Main;
