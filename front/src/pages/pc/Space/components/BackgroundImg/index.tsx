import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { PictureOutlined } from '@ant-design/icons';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import { connect, Dispatch, SpaceModelState, history, useModel } from 'umi';
import { Upload, message, Progress, Button } from 'antd';
import { uploadBackgroundAPI } from '@/api/user';
import { delay } from '@/utils';

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

let i = 0,
  timer: null | NodeJS.Timer = null;

interface Props {
  dispatch: Dispatch;
  space: SpaceModelState;
}

const BackgroundImg: React.FC<Props> = ({ space, dispatch }) => {
  const { userInfo = {} } = space;
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const { query } = history.location;
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState || {};
  const { id } = query as { id?: string };
  const isSelf = currentUser?._id === userInfo?._id;
  const hasSetBackgroundImg = !!userInfo?.background;
  const backgroundImage = userInfo?.background
    ? `url(${userInfo?.background})`
    : undefined;

  const handleBefore = (file) => {
    const imgTypes = [
      'image/webp',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];

    const isImgType = imgTypes.indexOf(file.type.toLocaleLowerCase()) !== -1;
    if (!isImgType) {
      message.error(`不支持的图片格式`);
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 6;
    if (!isLt2M) {
      message.error('图片不能大于6MB!');
      return Upload.LIST_IGNORE;
    }
    setProgress(0);
    i = 0;
    return true;
  };

  const handleUpload = async (info) => {
    try {
      const formData = new FormData();
      formData.append('background', info.file);
      const res = await uploadBackgroundAPI(formData);
      if (res?.code === 0) {
        message.success(res?.message);
      } else {
        message.error(res?.message || '上传失败');
      }
      setProgress(100);
      await delay(300);
      await dispatch({
        type: 'space/fetchUserInfo',
        payload: {
          id,
        },
      });
      setShowProgress(false);
    } catch (error) {
      setShowProgress(false);
    }
  };

  useEffect(() => {
    if (showProgress) {
      if (progress === 100) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      } else {
        timer = setInterval(() => {
          if (i >= 1 && timer) {
            clearInterval(timer);
            timer = null;
          }
          i += 0.05;
          const newProgress = easeOutQuint(i) * 95;
          setProgress(newProgress);
        }, 1000);
      }
    } else {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      i = 0;
    }
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [showProgress, progress]);

  return (
    <div
      className={`${
        hasSetBackgroundImg ? styles.pcBackgroundImg : styles.noBackgroundImg
      }`}
      style={{
        backgroundImage,
      }}
    >
      {isSelf ? (
        hasSetBackgroundImg ? (
          <div className={styles.blurMask}>
            <div
              className={styles.blur}
              style={{
                filter: showProgress ? 'blur(10px)' : undefined,
                backgroundColor: showProgress ? '#ffffff8c' : undefined,
              }}
            ></div>
            {showProgress && (
              <Progress
                percent={progress}
                status="active"
                showInfo={false}
                strokeColor="#8462bb"
                trailColor="#CACACA"
                style={{
                  width: 400,
                }}
              />
            )}
            <Upload
              disabled={showProgress}
              accept=".jpg,.jpeg,.png,.webp,.gif"
              name="userbackground"
              showUploadList={false}
              maxCount={1}
              beforeUpload={handleBefore}
              onChange={({ file, fileList, event }) => {
                const { status } = file;
                if (status === 'uploading') {
                  setShowProgress(true);
                }
              }}
              customRequest={handleUpload}
            >
              <Button
                type="dashed"
                className={styles.uploadBtn}
                disabled={showProgress}
              >
                修改背景
              </Button>
            </Upload>
          </div>
        ) : (
          <Upload
            className={styles.uploadBox}
            accept=".jpg,.jpeg,.png,.webp,.gif"
            name="userbackground"
            showUploadList={false}
            maxCount={1}
            beforeUpload={handleBefore}
            onChange={({ file, fileList, event }) => {
              const { status } = file;
              if (status === 'uploading') {
                setShowProgress(true);
              }
            }}
            customRequest={handleUpload}
          >
            <div className={styles.uploadTips}>
              {showProgress ? (
                <Progress
                  percent={progress}
                  status="active"
                  showInfo={false}
                  strokeColor="#8462bb"
                  trailColor="#CACACA"
                  style={{
                    width: 400,
                  }}
                />
              ) : !hasSetBackgroundImg ? (
                <>
                  <PictureOutlined className={styles.icon} />
                  <div className={styles.text}>
                    快来设置封面，制作专属的个人资料页面吧！
                  </div>
                </>
              ) : null}
            </div>
          </Upload>
        )
      ) : hasSetBackgroundImg ? null : (
        <div className={styles.noSet}></div>
        // <div className={styles.noSet}>他还没有设置封面背景</div>
      )}
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({ space }))(
  BackgroundImg,
);
