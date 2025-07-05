import React from 'react';
import styles from './styles.less';

const Skeleton = (props) => {
  return <div className={styles.skeleton} {...props}></div>;
};

export default Skeleton;
