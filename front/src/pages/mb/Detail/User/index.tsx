import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import {
  connect,
  Link,
  useModel,
  InitialState,
  history,
  DetailModelState,
  HeaderModelState,
  LoginModelState,
  ConnectProps,
  Dispatch,
} from 'umi';
import { Avatar, message, notification } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { updateAttentionAPI } from '@/api/attentionStatus';

interface Props {
  detail: DetailModelState;
  header: HeaderModelState;
  login: LoginModelState;
  dispatch: Dispatch;
}

const User: React.FC<Props> = (props) => {
  const { dispatch, detail, header, login } = props;
  const { data } = detail;
  const { creator = {}, updateTime } = data;
  const { userId } = login;
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};
  const { allAttention = [], currentUser = {} } = initialState || {};
  const href = `/mb/space?id=${creator?._id}`;
  const avatar = creator?.avatar;
  const hideAttention = userId === creator?._id;
  const hasAttention =
    allAttention.findIndex((id) => id === creator?._id) !== -1;

  const handleAttention = async (hasAttention) => {
    if (!userInfo?._id) {
      // 未登录
      notification.error({
        message: ``,
        description: '请先登录',
      });
      history.push('/login');
      return;
    }
    const res = await updateAttentionAPI({
      id: creator?._id,
      status: hasAttention ? 0 : 1,
    });
    if (res?.code === 0) {
      message.success(res?.message);
      const newAllAttention = await initialState?.fetchAllAttention();
      setInitialState({
        ...initialState,
        allAttention: newAllAttention,
      } as any);
    } else {
      message.error(res?.message || '关注失败');
    }
  };
  return (
    <div className={styles.mbDetailUser}>
      <div className={styles.mbDetailUserLeft}>
        <Link to={href}>
          <Avatar src={avatar} style={{ width: '100%', height: '100%' }} />
        </Link>
      </div>
      <div className={styles.mbDetailUserCneter}>
        <div className={styles.container}>
          {creator?._id && (
            <Link to={href}>
              <span className={styles.name}>{creator?.name}</span>
            </Link>
          )}
        </div>
      </div>
      <div className={styles.mbDetailUserRight}>
        {!hideAttention && creator?._id && (
          <div
            className={`${styles.button} ${
              hasAttention ? styles.hasAttention : styles.noAttention
            }`}
            onClick={() => handleAttention(hasAttention)}
          >
            {hasAttention ? (
              '已关注'
            ) : (
              <>
                <PlusOutlined />
                <span>关注</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(
  ({
    detail,
    header,
    login,
  }: {
    detail: DetailModelState;
    header: HeaderModelState;
    login: LoginModelState;
  }) => ({
    detail,
    header,
    login,
  }),
)(User);
