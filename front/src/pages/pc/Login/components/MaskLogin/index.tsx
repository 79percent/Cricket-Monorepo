import React from 'react';
import styles from './styles.less';
import LoginBox from '../LoginBox';

const MaskLogin = () => {
  return (
    <div className={styles.pcMaskLogin}>
      <LoginBox />
      <div className={styles.blurBg}></div>
    </div>
  );
};

export default MaskLogin;
