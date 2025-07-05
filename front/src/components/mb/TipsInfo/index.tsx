/**
 * 网站施工提示
 */

import React, { useEffect } from 'react';
import { Modal } from 'antd';
import styles from './styles.less';
import { Button, Cell, CellGroup } from 'tdesign-mobile-react';
import { connect, Link, useModel, useDispatch, history } from 'umi';

export default ({ title, content }) => {
  useEffect(() => {
    Modal.info({
      title: title ?? '网站移动端页面正在施工中...',
      content: (
        <div>
          <p>{content ?? '请在电脑PC端打开浏览网站'}</p>
        </div>
      ),
      onOk() {},
    });
  }, []);

  return (
    <div className={styles.mbTipsInfo}>
      <div className={styles.infoImg}></div>
      <div className={styles.goback}>
        <Button
          size="large"
          theme="danger"
          shape="rectangle"
          block
          className={styles.btn}
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>
      </div>
    </div>
  );
};
