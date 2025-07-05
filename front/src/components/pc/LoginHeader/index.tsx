import React from 'react';
import { Link } from 'umi';
import styles from './styles.less';

/**
 * 登录页面-顶部组件
 */
const LoginHeader = () => {
  return (
    <header className={styles.pcLoginHeader}>
      <Link to="/">
        <div className={styles.logo}></div>
      </Link>
      <Link to="/">
        <div className={styles.homeText}>首页</div>
      </Link>
    </header>
  );
};

export default LoginHeader;
