import React from 'react';
import styles from './styles.less';
import { Popover } from 'antd';
import { FileImageTwoTone } from '@ant-design/icons';
import qs from 'qs';
import moment from 'moment';
import { Link } from 'umi';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import IconFont from '@/components/pc/IconFont';

/**
 * 收藏夹图片Item
 * @param props
 */
const Item = (props) => {
  const {
    showOperation,
    onDelete,
    work,
    createTime,
    imgHeight,
    imgWidth,
    ...rest
  } = props;
  const { _id = '', imgs = [], title = '', content = '' } = work || {};
  const query = {
    id: _id,
  };
  const { urlMin = '' } = imgs[0];
  const href = `/pc/detail?${qs.stringify(query)}`;
  return (
    <div className={styles.imgItem} {...rest}>
      {work ? (
        <Link to={href} target="_blank">
          <img
            className={styles.img}
            src={urlMin}
            alt={content || title || '无题'}
            style={{ width: imgWidth, height: imgHeight }}
            onError={(e) => {
              e.target.src = guoqi;
              e.target.style.background = '#eee';
            }}
          />
        </Link>
      ) : (
        <div
          className={styles.emptyBox}
          style={{ width: imgWidth, height: imgHeight }}
        >
          <FileImageTwoTone style={{ fontSize: 26, color: '#ccc' }} />
          <span className={styles.emptyText}>图片已删除</span>
        </div>
      )}
      {work ? (
        <Link to={href} target="_blank" className={styles.imgContent}>
          {title || '无题'}
        </Link>
      ) : (
        <div className={styles.failure}>已失效</div>
      )}
      <div className={styles.info}>
        <span className={styles.infoLeft}>
          收藏于：{createTime ? moment(createTime).fromNow() : null}
        </span>
        {showOperation && (
          <Popover
            placement="bottomLeft"
            trigger="click"
            content={
              <div className={styles.deleteButton} onClick={onDelete}>
                移除
              </div>
            }
            title=""
          >
            <IconFont
              type="icon-gengduo"
              style={{ fontSize: 18, cursor: 'pointer' }}
            />
          </Popover>
        )}
      </div>
    </div>
  );
};

export default Item;
