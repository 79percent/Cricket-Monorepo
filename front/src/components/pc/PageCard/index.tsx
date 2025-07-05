import React from 'react';
import { history } from 'umi';
import { PageHeader } from 'antd';
import styles from './styles.less';

interface Props {
  title?: string;
  contentStyle?: React.CSSProperties;
}

/**
 * 页面卡片容器组件
 * @param param0
 */
const PageCard: React.FC<Props> = ({ children, title, contentStyle }) => {
  return (
    <div className={styles.setting}>
      <PageHeader ghost={false} onBack={() => history.goBack()} title={title} />
      <div className={styles.content} style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default PageCard;
