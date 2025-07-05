import React from 'react';
import styles from './styles.less';
import { Skeleton } from 'tdesign-mobile-react';

const SkeletonList = () => {
  const rowCols = [
    {
      height: '171px',
      borderRadius: '8px',
    },
    1,
    {
      width: '80%',
    },
    [
      {
        width: '60%',
      },
      {
        width: '20%',
      },
    ],
  ];
  return (
    <div className={styles.content}>
      {Array.from(Array(8), (item, index) => (
        <div className={styles.row} key={index}>
          {Array.from(Array(2), (v, key) => (
            <div className={styles.item} key={key}>
              <Skeleton theme="text" rowCol={rowCols} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
