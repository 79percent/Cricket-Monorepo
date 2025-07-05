import React, { useState, useEffect, useRef } from 'react';
import styles from './ImgBox.less';
import { connect } from 'umi';
import ReactDOM from 'react-dom';
import { Image } from 'antd';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import { calculateImgSize2 } from '@/utils';
import ImageProgressive from '@/components/pc/ImageProgressive';

interface Props {
  dispatch: (params: any) => void;
  detail: any;
  header: any;
  login: any;
}

interface ImgModalProps {
  visible?: boolean;
  onClose?: () => void;
  url?: string;
}

// 放大图片modal
const ImgModal = (props: ImgModalProps) => {
  const { visible, onClose, url } = props;
  const [selfVisible, setSelfVisble] = useState(false);
  const [scale, setScale] = useState(false);
  const imgModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof visible === 'boolean') {
      setSelfVisble(visible);
    }
  }, [visible]);

  useEffect(() => {
    if (selfVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selfVisible]);

  useEffect(() => {}, []);

  return ReactDOM.createPortal(
    <div
      className={styles.imgModalRoot}
      style={{ display: selfVisible ? 'block' : 'none' }}
    >
      <div ref={imgModalRef} className={styles.mask}></div>
      <div
        className={styles.contentWrap}
        onClick={() => {
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
      >
        <img
          className={styles.img}
          style={{
            cursor: scale ? 'zoom-out' : 'zoom-in',
            width: scale ? undefined : 'auto',
            height: scale ? undefined : '100%',
          }}
          src={url}
          onClick={(e) => {
            setScale(!scale);
            e.stopPropagation();
          }}
        />
      </div>
    </div>,
    document.body,
  );
};

const ImgBox = (props: Props) => {
  const { detail } = props;
  const { data } = detail;
  const { imgs = [] } = data;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCurrent, setCurrent] = useState(0);
  const [hasChangeInfoText, setHasChange] = useState(false);
  const [imgBoxWidth, setImgBoxWidth] = useState(0);
  const imgBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasChangeInfoText) {
      const maskInfo = imgBoxRef.current?.querySelectorAll(
        '.ant-image-mask-info',
      );
      maskInfo?.forEach((ele, index) => {
        if (index === maskInfo.length - 1) {
          setHasChange(true);
        }
        ele.innerHTML = ele.innerHTML.replace('预览', '查看大图');
      });
    }
  });

  useEffect(() => {
    setImgBoxWidth(imgBoxRef?.current?.clientWidth ?? 0);
  }, []);

  return (
    <>
      <div className={styles.leftImgBox} id="pc-detail-img-box" ref={imgBoxRef}>
        {imgs.map((item, index) => {
          const { _id, url, urlMin, imgWidth = 0, imgHeight = 0 } = item;
          const { width, height } = calculateImgSize2(
            imgWidth,
            imgHeight,
            imgBoxWidth,
            600,
            400,
            400,
          );
          return (
            <ImageProgressive
              key={_id}
              width={width}
              height={height}
              preview={{ visible: false }}
              onClick={() => {
                setPreviewVisible(true);
                setCurrent(index);
              }}
              src={url}
              minUrl={urlMin}
              fallback={guoqi}
            />
          );
        })}
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible: previewVisible,
              onVisibleChange: (vis) => setPreviewVisible(vis),
              current: previewCurrent,
            }}
          >
            {imgs.map((item) => {
              const { url, _id } = item;
              return <Image key={_id} src={url} />;
            })}
          </Image.PreviewGroup>
        </div>
      </div>
    </>
  );
};

// @ts-ignore
export default connect(({ detail, header, login }) => ({
  detail,
  header,
  login,
}))(ImgBox);
