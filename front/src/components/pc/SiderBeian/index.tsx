import React from 'react';
import styles from './styles.less';
import recordIcon from '@/assets/icon/record.png';

const SiderBeian = () => {
  return (
    <div className={styles.siderBeian}>
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902003088"
      >
        <img src={recordIcon} />
        <div>浙公网安备 33010902003088号</div>
      </a>
      <a
        style={{ marginLeft: 6 }}
        target="_blank"
        href="https://beian.miit.gov.cn/"
      >
        <div>浙I C P备 2021034750号</div>
      </a>
    </div>
  );
};

export default SiderBeian;
