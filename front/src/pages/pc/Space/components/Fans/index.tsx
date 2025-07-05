import React, { Component, useEffect, useState } from 'react';
import styles from './styles.less';
import {
  connect,
  FansModelState,
  history,
  HeaderModelState,
  LoginModelState,
  SpaceModelState,
  Dispatch,
} from 'umi';
import { Avatar, Button, Pagination } from 'antd';
import {
  LikeOutlined,
  HeartOutlined,
  HomeOutlined,
  PlusOutlined,
  PictureOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { deleteAttentionAPI } from '@/api/attentionStatus';
import Title from '@/components/pc/Title';

interface Props {
  space: SpaceModelState;
  header: HeaderModelState;
  login: LoginModelState;
  fans: FansModelState;
  dispatch: Dispatch;
}

const Content: React.FC<Props> = ({ dispatch, fans, login }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const { userId } = login;
  const { list = [], pageParams } = fans;
  const { current = 1, pageSize = 10 } = pageParams;
  const isSelf = id === userId;

  const fetchList = (params = {}): any => {
    dispatch({
      type: 'fans/fetchFansList',
      payload: {
        id,
        ...params,
      },
    });
  };

  const handleChangePage = async (current, pageSize) => {
    const res = fetchList({ current, pageSize });
    if (res?.code === 0) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchList({
      current: 1,
      pageSize: 10,
    });
  }, [id]);

  return (
    <div className={styles.contentBox}>
      <Title title={isSelf ? '我的粉丝' : '他的粉丝'} />
      <div className={styles.listBox}>
        {list.length > 0 ? (
          list.map((item) => {
            const { status, _id, createTime, updateTime, creator, targetUser } =
              item;
            const { avatar, profile, sex, name } = creator || {};
            return (
              <div className={styles.item}>
                <div className={styles.itemLeft}>
                  <Avatar
                    src={avatar}
                    size={68}
                    icon={avatar ? null : <UserOutlined />}
                  />
                  <div className={styles.leftInfo}>
                    {creator ? (
                      <>
                        {name && <div className={styles.name}>{name}</div>}
                        {profile && (
                          <div className={styles.profile}>{profile}</div>
                        )}
                      </>
                    ) : (
                      <div className={styles.name}>用户已注销</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyBox}>
            还没有粉丝{isSelf ? '' : '，快来关注他吧！'}
          </div>
        )}
      </div>
      {pageParams.total > 0 && (
        <div className={styles.pageination}>
          <Pagination
            showQuickJumper
            showSizeChanger={true}
            pageSizeOptions={['5', '10', '20', '50']}
            onChange={handleChangePage}
            {...pageParams}
          />
        </div>
      )}
    </div>
  );
};

export default connect(
  ({
    space,
    header,
    login,
    fans,
  }: {
    space: SpaceModelState;
    header: HeaderModelState;
    login: LoginModelState;
    fans: FansModelState;
  }) => ({
    space,
    header,
    login,
    fans,
  }),
)(Content);
