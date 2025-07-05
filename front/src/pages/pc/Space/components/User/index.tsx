import React from 'react';
import styles from './styles.less';
import { Avatar, message, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  connect,
  Dispatch,
  InitialState,
  SpaceModelState,
  useModel,
  history,
} from 'umi';
import { updateAttentionAPI } from '@/api/attentionStatus';

interface Props {
  dispatch: Dispatch;
  space: SpaceModelState;
}

const UserInfo: React.FC<Props> = ({ space, dispatch }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const { userInfo = {} } = space;
  const profileLength = userInfo?.profile?.length ?? 0;
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const { allAttention = [], currentUser = {} } = initialState || {};
  const hasAttention =
    allAttention.findIndex((i) => i === userInfo?._id) !== -1;
  const isSelf = currentUser?._id === userInfo?._id;

  const handleAttention = async () => {
    if (!currentUser?._id) {
      // 未登录
      notification.error({
        message: ``,
        description: '请先登录',
      });
      history.push('/login');
      return;
    }
    const res = await updateAttentionAPI({
      id: userInfo?._id,
      status: hasAttention ? 0 : 1,
    });
    if (res?.code === 0) {
      const newAllAttention = await initialState?.fetchAllAttention();
      await setInitialState({
        ...initialState,
        allAttention: newAllAttention,
      } as any);
      message.success(res?.message);
      dispatch({
        type: 'space/fetchUserStatisticsAPI',
        payload: {
          id,
        },
      });
    } else {
      message.error(res?.message || '关注失败');
    }
  };

  return (
    <div className={styles.pcSpaceUserInfo}>
      <Avatar
        src={userInfo?.avatar}
        icon={!userInfo?.avatar && <UserOutlined />}
        size={120}
        shape="circle"
        className={styles.userAvatar}
      />
      <h1 className={styles.userName}>{userInfo?.name}</h1>
      <div className={styles.userProfile}>
        {profileLength > 0 && (
          <div
            className={`${styles.profile} ${
              profileLength > 20 && styles.profileLong
            }`}
          >
            {userInfo?.profile}
          </div>
        )}
      </div>
      {!isSelf && (
        <div
          className={`${styles.attentionButton} ${
            hasAttention ? styles.hasAttention : styles.noAttention
          }`}
          onClick={handleAttention}
        >
          {hasAttention ? '已关注' : '加关注'}
        </div>
      )}
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({ space }))(
  UserInfo,
);
