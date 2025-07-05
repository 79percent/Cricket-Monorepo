import React from 'react';
import Collections from './Collections';
import Illustrations from './Illustrations';
import Recent from './Recent';
import styles from './styles.less';

const Content = () => {
  return (
    <div className={styles.tabContent}>
      <Illustrations />
      <Recent />
      <Collections />
    </div>
  );
};

export default Content;
