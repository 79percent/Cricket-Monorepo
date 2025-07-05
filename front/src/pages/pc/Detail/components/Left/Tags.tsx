import React from 'react';
import styles from './Tags.less';
import { history, connect, Link } from 'umi';

interface Props {
  dispatch: (params: any) => void;
  detail: any;
  header: any;
  login: any;
}

const Tags = (props: Props) => {
  const { detail } = props;
  const { data } = detail;
  const { tags = [] } = data;
  return (
    <div className={styles.leftTags}>
      {tags.map((item) => {
        return (
          <Link
            key={item}
            target="_blank"
            style={{ marginRight: 20 }}
            to={`/pc/home?keyword=${item}`}
          >
            #{item}
          </Link>
        );
      })}
    </div>
  );
};

// @ts-ignore
export default connect(({ detail, header, login }) => ({
  detail,
  header,
  login,
}))(Tags);
