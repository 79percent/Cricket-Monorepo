/**
 * 登录
 */
import React from 'react';
import styles from './styles.less';
import Main from './components/Main';
import MaskLogin from './components/MaskLogin';
import Footer from '@/components/pc/Footer';
import LoginHeader from './components/LoginHeader';

const LoginPage = () => {
  return (
    <div className={styles.pcUser}>
      <LoginHeader />
      <Main />
      <div className={styles.footer}>
        <Footer />
      </div>
      <MaskLogin />
    </div>
  );
};

export default LoginPage;
