import React from 'react';
import styles from './styles.less';
import {
  connect,
  RecommendModelState,
  DetailModelState,
  ConnectProps,
  Dispatch,
  Link,
} from 'umi';
import IconFont from '@/components/pc/IconFont';
import { Avatar, message, notification } from 'antd';
import SkeletonItem from './SkeletonItem';

interface Props {
  recommend: RecommendModelState;
  detail: DetailModelState;
  dispatch: Dispatch;
}

const SkeletonList = () => {
  return (
    <>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </>
  );
};

const Recommend: React.FC<Props> = (props) => {
  const { recommend } = props;
  const { recommendList, recommendPageParams, recommendListLoading } =
    recommend;
  console.log(recommendPageParams);
  return (
    <div className={styles.mbDetailRecommend}>
      {recommendList.map((item) => {
        const { _id, imgs, title, creator } = item;
        const count = imgs.length;
        return (
          <Link
            to={`/mb/detail?id=${_id}`}
            key={_id}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <div className={styles.mbDetailRecommendItem}>
              <div className={styles.itemImg}>
                <img src={imgs[0].urlMin} alt={title} />
                {count > 1 && (
                  <div className={styles.imgCount}>
                    <IconFont
                      type="icon-tupianjihe"
                      style={{ fontSize: '1.6rem', color: '#fff' }}
                    />
                    <span className={styles.imgCountNum}>{count}</span>
                  </div>
                )}
              </div>
              <div className={styles.itemTitleBox}>
                <div className={styles.title}>
                  <span>{title || '无题'}</span>
                </div>
                <div className={styles.creator}>
                  <Avatar
                    src={creator.avatar}
                    style={{ width: '2rem', height: '2rem' }}
                  />
                  <div className={styles.name}>{creator.name}</div>
                </div>
                {/* <div className={styles.countNum}></div> */}
              </div>
            </div>
          </Link>
        );
      })}
      {recommendListLoading && <SkeletonList />}
    </div>
  );
};

export default connect(
  ({
    detail,
    recommend,
  }: {
    detail: DetailModelState;
    recommend: RecommendModelState;
  }) => ({
    detail,
    recommend,
  }),
)(Recommend);
