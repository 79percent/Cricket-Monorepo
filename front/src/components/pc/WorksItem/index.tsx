import React from 'react';
import { Link } from 'umi';
import { Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { formatNumber, isMobile } from '@/utils';
import qs from 'qs';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import './styles2.less';
import IconFont from '@/components/pc/IconFont';

/**
 * 瀑布流组件Item
 * @param props
 */
const Item = (props) => {
  const {
    count = 0,
    boxWidth = 0,
    boxHeight = 0,
    imgWidth = 0,
    imgHeight = 0,
    infoWidth = 0,
    infoHeight = 0,
    top = 0,
    left = 0,
    url = '',
    title = '',
    content = '',
    creator = {},
    isLike = false,
    isCollect = false,
    isAttention = false,
    onLike = () => {},
    onCollect = () => {},
    onAttention = () => {},
    showAttention = true,
    likeCount = 0,
    collectionCount = 0,
    id = '',
  } = props;
  const prefix = isMobile ? '/mb' : '/pc';
  const href = `${prefix}/detail?${qs.stringify({ id })}`;
  return (
    <Link
      to={href}
      // target="_blank"
      className={`${styles.worksItemBox} works-item`}
      style={{
        width: boxWidth,
        height: boxHeight,
        top: top,
        left: left,
      }}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
    >
      <div
        style={{
          width: imgWidth,
          height: imgHeight,
          position: 'relative',
        }}
      >
        <div
          className={styles.mask}
          style={{ width: imgWidth, height: imgHeight }}
        ></div>
        <Image
          width={imgWidth}
          height={imgHeight}
          alt={content || title}
          style={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          src={url}
          fallback={guoqi}
          className={styles.itemImg}
        />
        {count > 1 && (
          <div className={styles.imgCount}>
            <IconFont
              type="icon-tupianjihe"
              style={{ fontSize: 18, color: '#fff' }}
            />
            <span className={styles.imgCountNum}>{count}</span>
          </div>
        )}
      </div>
      <div style={{ width: infoWidth, height: infoHeight }}>
        <div className={styles.infoContent}>
          <div className={styles.content}>{title || '无题'}</div>
          <div className={styles.avatarRow}>
            {creator?._id ? (
              <Link
                to={`${prefix}/space?id=${creator?._id}`}
                className={styles.avatarBox}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <Avatar
                  size="small"
                  icon={!creator?.avatar && <UserOutlined />}
                  src={creator?.avatar}
                />
                <span className={styles.name}>{creator?.name}</span>
              </Link>
            ) : (
              <span className={styles.avatarBox}>
                <Avatar size="small" icon={<UserOutlined />} />
                <span className={styles.name2}>用户不存在</span>
              </span>
            )}
            <div
              className={styles.iconRowItem}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (typeof onCollect === 'function') {
                  onCollect();
                }
              }}
            >
              <IconFont
                type={
                  isCollect ? 'icon-xihuan4' : 'icon-xinbaniconshangchuan-1'
                }
                style={{
                  fontSize: 20,
                  color: isCollect ? '#d41c1c' : '#a8a8a8',
                }}
              />
              {/* <HeartFilled
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (typeof onCollect === 'function') {
                    onCollect();
                  }
                }}
                style={{
                  fontSize: 20,
                  color: isCollect ? '#d41c1c' : '#a8a8a8',
                }}
              /> */}
              <span
                className={styles.count}
                style={{ color: isCollect ? '#d41c1c' : '#a8a8a8' }}
              >
                {collectionCount === 0 ? '' : formatNumber(collectionCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Item;
