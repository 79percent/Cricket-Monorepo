import React from 'react';
import styles from './styles.less';
import { RightOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Image } from 'antd';
import { history, connect, Link, SpaceModelState, Dispatch } from 'umi';
import moment from 'moment';
import { UserOutlined, PlusOutlined, StarTwoTone } from '@ant-design/icons';
import ImgView from '@/components/pc/ImgView';

interface Props {
  data?: any;
}

/**
 * 动态Item卡片
 * @param param0
 */
const RecentCard: React.FC<Props> = ({ data = {} }) => {
  const {
    creator = {},
    updateTime,
    _id = '',
    title = '',
    content = '',
    imgs = [],
  } = data;
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <Avatar
            src={creator?.avatar}
            size={50}
            icon={!creator?.avatar && <UserOutlined />}
            className={styles.headerAvatar}
          />
          <div className={styles.headerInfo}>
            <span className={styles.headerName}>{creator?.name}</span>
            <span className={styles.headerTime}>
              {updateTime ? moment(updateTime).fromNow() : null}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}></div>
      </div>
      <div className={styles.cardContent}>
        <Link
          to={`/pc/detail?id=${_id}`}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <h2 className={styles.title}>{title || '无题'}</h2>
        </Link>
        <div className={styles.contentText}>
          <Link
            to={`/pc/detail?id=${_id}`}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <span className={styles.content}>{content}</span>
          </Link>
        </div>
        <ImgView style={{ marginTop: 10 }} data={imgs} />
      </div>
    </div>
  );
};

export default RecentCard;
