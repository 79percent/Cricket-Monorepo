import React, { useEffect } from 'react';
import styles from './styles.less';
import { Button, Avatar } from 'antd';
import {
  Dispatch,
  history,
  useModel,
  connect,
  SpaceModelState,
  LoginModelState,
} from 'umi';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { updateAttentionAPI } from '@/api/attentionStatus';

interface Props {
  space: SpaceModelState;
  login: LoginModelState;
  dispatch: Dispatch;
}

const UserInfo: React.FC<Props> = ({ space, dispatch }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const { userInfo } = space;
  const { initialState, refresh } = useModel('@@initialState');
  const loginUserInfo = initialState?.currentUser || {};
  const allAttention = initialState?.allAttention || [];
  const hasAttention = allAttention.findIndex((item) => item === id) !== -1;
  const showAttention = loginUserInfo?._id !== id;

  // 关注
  const handleAttention = async () => {
    const res = await updateAttentionAPI({
      id,
      status: hasAttention ? 0 : 1,
    });
    const { code } = res;
    if (code === 0) {
      refresh();
      dispatch({
        type: 'space/fetchUserStatisticsAPI',
        payload: {
          id,
        },
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: 'space/fetchUserInfo',
      payload: {
        id,
      },
    });
  }, [id]);

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoLeft}>
        <Avatar
          src={userInfo?.avatar}
          size={50}
          icon={!userInfo?.avatar && <UserOutlined />}
        />
        <div className={styles.infoBasic}>
          <div className={styles.infoUserName}>{userInfo?.name}</div>
          <div className={styles.infoUserIntro}>{userInfo?.profile}</div>
        </div>
      </div>
      {showAttention && (
        <Button
          onClick={handleAttention}
          type={hasAttention ? 'dashed' : 'default'}
          icon={hasAttention ? undefined : <PlusOutlined />}
          style={{
            backgroundColor: '#8462bb',
            borderColor: '#8462bb',
            color: '#fff',
          }}
        >
          {hasAttention ? <span>取消关注</span> : <span>关注</span>}
        </Button>
      )}
    </div>
  );
};

export default connect(
  ({ space, login }: { space: SpaceModelState; login: LoginModelState }) => ({
    space,
    login,
  }),
)(UserInfo);
