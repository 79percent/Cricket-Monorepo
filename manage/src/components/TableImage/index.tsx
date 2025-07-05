import React, { useState } from 'react';
import type { ImageProps } from 'antd';
import { Image } from 'antd';
import guoqi from '@/assets/img/D-tupianguoqi1.svg';

interface Props extends ImageProps {
  data: {
    imgHeight: number;
    imgWidth: number;
    url: string;
    urlMin: string;
    _id: string;
  }[];
}

const TableImage: React.FC<Props> = ({ data, ...rest }) => {
  const [visible, setVisible] = useState(false);
  return data.length > 0 ? (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image
        {...rest}
        src={data[0].urlMin}
        style={{ objectFit: 'cover' }}
        preview={{ visible: false }}
        onClick={() => setVisible(true)}
        fallback={guoqi}
      />
      <span style={{ marginLeft: 10 }}>共 {data.length} 张</span>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
          {data.map((item) => {
            return <Image src={item.url} fallback={guoqi} />;
          })}
        </Image.PreviewGroup>
      </div>
    </div>
  ) : (
    <div>无图片</div>
  );
};

export default TableImage;
