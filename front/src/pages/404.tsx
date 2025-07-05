import React from 'react';
import { history } from 'umi';
import { Button, Result } from 'antd';
import styles from './404.less';

const NoFoundPage = () => (
  <div className={styles.resultPage}>
    <Result
      title={<div className={styles.title}>404</div>}
      icon={
        <div className={styles.iconBox}>
          <div className={styles.icon}></div>
        </div>
      }
      subTitle={
        <div className={styles.subTitle}>
          没有找到页面(。・＿・。)ﾉI’m sorry~
        </div>
      }
      extra={
        <Button
          style={{ borderColor: '#4908B1', backgroundColor: '#4908B1' }}
          type="primary"
          onClick={() => history.goBack()}
        >
          返回
        </Button>
      }
    />
  </div>
);

export default NoFoundPage;
