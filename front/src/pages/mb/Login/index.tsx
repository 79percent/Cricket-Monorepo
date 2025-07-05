/**
 * 移动端登录
 */
import React, { useEffect } from 'react';
import styles from './styles.less';
import LoginBox from './components/LoginBox';

const LoginPage = () => {
  return (
    <div className={styles.mbLoginContainer}>
      <div className={styles.mbLoginCardBox}>
        <LoginBox />
      </div>
    </div>
  );
};

export default LoginPage;
