import React from 'react';
import styles from './styles.less';

/**
 * 页面内容组件
 * @param props
 */
const Content: React.FC = (props) => {
  return (
    <section className={styles.pcContent}>
      <div className={styles.content}>{props.children}</div>
    </section>
  );
};

export default Content;
