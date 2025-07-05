import React, { useState } from 'react';
import { Button, Upload, Avatar, message } from 'antd';
import { useModel } from 'umi';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { uploadAvatarAPI } from '@/api/user';
import styles from './styles.less';

const Right = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};
  const [uploading, setUploading] = useState(false);
  return (
    <div className={styles.right}>
      <div className={styles.avatar}>
        <Avatar
          style={{ border: '1px solid #ccc' }}
          size={160}
          src={userInfo?.avatar}
          icon={!userInfo?.avatar && <UserOutlined />}
        />
      </div>
      <Upload
        name="avatar"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        showUploadList={false}
        maxCount={1}
        beforeUpload={(file) => {
          const imgTypes = [
            'image/webp',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
          ];

          const isImgType =
            imgTypes.indexOf(file.type.toLocaleLowerCase()) !== -1;
          if (!isImgType) {
            message.error(`不支持的图片格式`);
            return Upload.LIST_IGNORE;
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            message.error('图片不能大于2MB!');
            return Upload.LIST_IGNORE;
          }
          return true;
        }}
        onChange={({ file, fileList, event }) => {
          const { status } = file;
          if (status === 'uploading') {
            setUploading(true);
          }
        }}
        customRequest={async (info) => {
          try {
            const formData = new FormData();
            formData.append('avatar', info.file);
            const res = await uploadAvatarAPI(formData);
            if (res?.code === 0) {
              sessionStorage.removeItem('user_info');
              const newUserInfo = await initialState?.fetchUserInfo();
              await setInitialState({
                ...initialState,
                currentUser: newUserInfo,
              } as any);
              message.success(res?.message);
            } else {
              message.error(res?.message || '更新失败');
            }
            setUploading(false);
          } catch (error) {
            setUploading(false);
          }
        }}
      >
        <Button loading={uploading}>
          <UploadOutlined />
          更换头像
        </Button>
      </Upload>
      <div className={styles.tips}>*支持格式：jpg/jpeg/png/webp/gif</div>
    </div>
  );
};

export default Right;
