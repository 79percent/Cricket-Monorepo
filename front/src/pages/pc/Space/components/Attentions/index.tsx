import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import {
  AttentionsModelState,
  connect,
  HeaderModelState,
  LoginModelState,
  SpaceModelState,
  Dispatch,
  history,
  Link,
} from 'umi';
import { Avatar, Button, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { deleteAttentionAPI } from '@/api/attentionStatus';
import Title from '@/components/pc/Title';

interface Props {
  space: SpaceModelState;
  header: HeaderModelState;
  login: LoginModelState;
  attentions: AttentionsModelState;
  dispatch: Dispatch;
}

const Content: React.FC<Props> = ({ dispatch, attentions, login }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const { userId } = login;
  const { list = [], pageParams } = attentions;
  const { current = 1, pageSize = 10 } = pageParams;
  const isSelf = id === userId;

  const fetchList = (params = {}): any => {
    dispatch({
      type: 'attentions/fetchAttentionList',
      payload: {
        id,
        ...params,
      },
    });
  };

  const handleCancelAttention = async (_id) => {
    const res = await deleteAttentionAPI({
      id: _id,
    });
    const { code } = res;
    if (code === 0) {
      fetchList({
        current,
        pageSize,
      });
      dispatch({
        type: 'space/fetchUserStatisticsAPI',
        payload: {
          id,
        },
      });
    }
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
      <Title title={isSelf ? '我的关注' : '他的关注'} />
      <div className={styles.listBox}>
        {list.length > 0 ? (
          list.map((item) => {
            const { status, _id, createTime, updateTime, creator, targetUser } =
              item;
            const { avatar, profile, sex, name } = targetUser || {};
            return (
              <div className={styles.item}>
                <div className={styles.itemLeft}>
                  <Link to={`/pc/space?id=${targetUser?._id}`}>
                    <Avatar
                      src={avatar}
                      size={68}
                      icon={avatar ? null : <UserOutlined />}
                    />
                  </Link>
                  <div className={styles.leftInfo}>
                    {targetUser ? (
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
                {userId && userId === id && (
                  <Button
                    type="dashed"
                    onClick={() => handleCancelAttention(_id)}
                  >
                    取消关注
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.emptyBox}>
            还没有关注的人{isSelf ? '，快去关注喜欢的人吧！' : ''}
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
    attentions,
  }: {
    space: SpaceModelState;
    header: HeaderModelState;
    login: LoginModelState;
    attentions: AttentionsModelState;
  }) => ({
    space,
    header,
    login,
    attentions,
  }),
)(Content);
