import React from 'react';
import { history } from 'umi';
import { Button } from 'antd';
import styles from './styles.less';

const Home = () => {
  return (
    <div className={styles.home}>
      <Button
        style={{ borderColor: '#4908B1', backgroundColor: '#4908B1' }}
        type="primary"
        onClick={() => history.push('/login')}
      >
        返回
      </Button>
    </div>
  );
};

export default Home;
