import React from 'react';
import styles from './styles.less';
import recordIcon from '@/assets/icon/record.png';

/**
 * 网页底部组件
 */
const Footer = () => {
  return (
    <footer className={styles.pcFooter}>
      <span className={styles.aboutWebSite}>
        本站所有资源全部收集于互联网，分享目的仅供大家学习与参考，请遵循相关法律法规，如有任何问题，请联系
        <a className={styles.email}>per7614@163.com</a>
      </span>
    </footer>
  );
};

export default Footer;
