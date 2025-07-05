import React from 'react';
import styles from './styles.less';
import { Checkbox } from 'antd';
import { Link } from 'umi';

const ImgItem = (props) => {
  const {
    _id,
    imgUrl,
    imgWidth,
    imgHeight,
    href,
    checkBoxVisible = true,
    ...restProps
  } = props;
  return (
    <div className={styles.imgItem} {...restProps}>
      <Link to={href} target="_blank">
        <img
          src={imgUrl}
          alt=""
          style={{ width: imgWidth, height: imgHeight }}
        />
      </Link>
      {checkBoxVisible && (
        <Checkbox
          value={_id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            paddingLeft: 5,
            zIndex: 99,
          }}
        >
          <div className={styles.mask}></div>
        </Checkbox>
      )}
    </div>
  );
};

export default ImgItem;
