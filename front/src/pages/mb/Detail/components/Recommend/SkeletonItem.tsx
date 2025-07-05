import React, { Component } from 'react';
import styles from './skeletonItem.less';
import Skeleton from '@/components/mb/Skeleton';

const SkeletonItem = () => {
  return (
    <div className={styles.mbDetailRecommendItem}>
      <div className={styles.itemImg}>
        <Skeleton />
      </div>
      <div className={styles.itemTitleBox}>
        <div className={styles.title}>
          <Skeleton />
        </div>
        <div className={styles.creator}>
          <Skeleton />
        </div>
      </div>
    </div>
  );
};

export default SkeletonItem;
