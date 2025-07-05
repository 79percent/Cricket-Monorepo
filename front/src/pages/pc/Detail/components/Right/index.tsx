import React, { useState } from 'react';
import { connect, Link, useModel, InitialState, history } from 'umi';
import styles from './styles.less';
import { Avatar, message, notification } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { updateAttentionAPI } from '@/api/attentionStatus';

const Right = (props) => {
  const { id, dispatch, detail, header, login } = props;
  const { recommendList, data } = detail;
  const { creator = {}, updateTime } = data;
  const { userId } = login;
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};
  const { allAttention = [], currentUser = {} } = initialState || {};
  const href = `/pc/space?id=${creator?._id}`;
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
    <div className={styles.right}>
      <div className={styles.avatarBox}>
        <Link to={href} target="_blank">
          <Avatar
            src={avatar}
            size="large"
            icon={!avatar && <UserOutlined />}
          />
        </Link>
        {creator?._id && (
          <Link to={href} target="_blank">
            <span className={styles.name}>{creator?.name}</span>
          </Link>
        )}
      </div>
      {!hideAttention && creator?._id && (
        <div
          className={`${styles.attentionBox} ${
            hasAttention ? styles.hasAttention : styles.noAttention
          }`}
          onClick={() => handleAttention(hasAttention)}
        >
          {hasAttention ? (
            '已关注'
          ) : (
            <>
              <PlusOutlined />
              <span>加关注</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// @ts-ignore
export default connect(({ detail, header, login }) => ({
  detail,
  header,
  login,
}))(Right);
