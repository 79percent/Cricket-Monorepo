import React from 'react';
import styles from './styles.less';

interface Props {
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  right?: React.ReactNode;
}

/**
 * 个人空间标题组件
 * @param param0
 */
const Title: React.FC<Props> = ({
  title = '',
  className = '',
  style,
  right,
}) => {
  return (
    <div className={`${styles.header} ${className}`} style={style}>
      <h2 className={styles.title}>{title}</h2>
      {right}
    </div>
  );
};

export default Title;
