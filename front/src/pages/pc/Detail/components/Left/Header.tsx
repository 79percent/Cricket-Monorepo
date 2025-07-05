import React from 'react';
import styles from './Header.less';
import { Avatar, Button } from 'antd';
import moment from 'moment';
import { Link, connect } from 'umi';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { updateAttentionAPI } from '@/api/attentionStatus';

interface Props {
  dispatch: (params: any) => void;
  detail: any;
  header: any;
  login: any;
}

const Header = (props: Props) => {
  const { dispatch, detail, header, login } = props;
  const { data } = detail;
  const { creator = {}, updateTime } = data;
  const { userId } = login;
  const { allAttention = [] } = header;
  const href = `/space?id=${creator?._id}`;
  const avatar = creator?.avatar;
  const hideAttention = userId === creator?._id;
  const hasAttention =
    allAttention.findIndex((id) => id === creator?._id) !== -1;

  const handleAttention = async (hasAttention) => {
    const res = await updateAttentionAPI({
      id: creator?._id,
      status: hasAttention ? 0 : 1,
    });
    const { code } = res;
    if (code === 0) {
      await dispatch({
        type: 'header/fetchAllAttention',
        payload: {
          userId,
        },
      });
    }
  };

  return (
    <div className={styles.leftHeader}>
      <div className={styles.avatarBox}>
        <Link to={href} target="_blank">
          <Avatar
            src={avatar}
            size="large"
            icon={!avatar && <UserOutlined />}
          />
        </Link>
        <div className={styles.nameBox}>
          {creator?._id ? (
            <Link to={href} target="_blank">
              <span className={styles.name}>{creator?.name}</span>
            </Link>
          ) : (
            <span className={styles.name}>用户已注销</span>
          )}
          <span className={styles.updatetime}>
            {updateTime ? moment(updateTime).fromNow() : null}
          </span>
        </div>
      </div>
      <div className={styles.attentionBox}>
        {!hideAttention && creator?._id && (
          <Button
            size="middle"
            onClick={() => handleAttention(hasAttention)}
            type={hasAttention ? 'dashed' : 'default'}
            icon={hasAttention ? undefined : <PlusOutlined />}
          >
            {hasAttention ? '取消关注' : '关注'}
          </Button>
        )}
      </div>
    </div>
  );
};

// @ts-ignore
export default connect(({ detail, header, login }) => ({
  detail,
  header,
  login,
}))(Header);
