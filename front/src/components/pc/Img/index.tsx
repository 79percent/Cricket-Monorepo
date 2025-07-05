import React, { useState } from 'react';
import styles from './styles.less';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import { Image } from 'antd';
import { calculateImgSize } from '@/utils';

interface Props {
  data?: any;
}

/**
 * 单张图片展示组件
 */
const Img: React.FC<Props> = ({ data = {} }) => {
  const { imgWidth = 0, imgHeight = 0 } = data;
  const [visible, setVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const { width, height } = calculateImgSize(
    imgWidth,
    imgHeight,
    isError ? 120 : 400,
    isError ? 120 : 400,
  );

  return (
    <>
      <div className={styles.box} style={{ height }}>
        <Image
          width={width}
          height={height}
          preview={{ visible: false }}
          alt={data?.content}
          src={data?.urlMin}
          fallback={guoqi}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className={styles.imgView}
          onClick={() => {
            // if(!isError){
            setVisible(true);
            // }
          }}
          onError={() => {
            setIsError(true);
          }}
        />
      </div>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          <Image src={data?.url} />
        </Image.PreviewGroup>
      </div>
    </>
  );
};

export default Img;
