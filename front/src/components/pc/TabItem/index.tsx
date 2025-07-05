import React, { Component, ReactElement } from 'react';
import styles from './styles.less';

interface Props {
  icon?: ReactElement;
  text?: string;
}

/**
 * 个人空间tabs切换组件
 * @param props
 */
const TabItem = (props: Props) => {
  const { icon, text } = props;
  return (
    <div className={styles.tabItem}>
      {icon}
      <span className={styles.tabItemText}>{text}</span>
    </div>
  );
};

export default TabItem;
