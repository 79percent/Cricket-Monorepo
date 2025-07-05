import React, { useState, useEffect, useRef } from 'react';
import './styles.less';
import { ImageProps, Image, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface Props extends ImageProps {
  minUrl?: string;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

let i = 1;
let timer;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

/**
 * 渐进式加载的图片
 */
const ImageProgressive: React.FC<Props> = ({ minUrl, ...rest }) => {
  const [showMin, setShowMin] = useState(true);
  const [blur, setBlur] = useState(20);

  const MinImage = (
    <Image
      {...rest}
      src={minUrl}
      preview={false}
      style={{
        filter: `blur(${blur}px)`,
      }}
    />
  );
  const BigImage = (
    <Image
      {...rest}
      onLoad={() => {
        setShowMin(false);
      }}
    />
  );

  useEffect(() => {
    if (!showMin) {
      window.cancelAnimationFrame(timer);
      return;
    }
    function anime() {
      timer = window.requestAnimationFrame(() => {
        if (i < 0.05) {
          i = 0.05;
        }
        const newBlur = easeOutCubic(i) * 20;
        setBlur(newBlur);
        if (i <= 0.05) {
          window.cancelAnimationFrame(timer);
          return;
        } else {
          i -= 0.002;
          anime();
        }
      });
    }
    anime();
    return () => {
      window.cancelAnimationFrame(timer);
    };
  }, [showMin]);

  return (
    <>
      {/* {showMin ? MinImage : BigImage} */}
      <div
        className="image-progressive"
        style={{ display: showMin ? undefined : 'none' }}
      >
        {MinImage}
      </div>
      <div style={{ display: showMin ? 'none' : undefined }}>{BigImage}</div>
    </>
  );
};

export default ImageProgressive;
