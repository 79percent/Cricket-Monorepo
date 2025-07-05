import React, { useEffect } from 'react';
import {
  connect,
  history,
  Link,
  useAccess,
  useModel,
  Dispatch,
  HeaderModelState,
  LoginModelState,
  TagsModelState,
} from 'umi';
import { Input, Space, Button, Dropdown, Avatar, Badge } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import styles from './styles.less';
import Menus from './Menus';
import IconFont from '@/components/pc/IconFont';

const { Search } = Input;

interface Props {
  dispatch: Dispatch;
  header: HeaderModelState;
  login: LoginModelState;
  tags: TagsModelState;
  onSearch?: (keyword: string) => void;
}

/**
 * 网站顶部
 * Logo、搜索、头像、登录注册
 * @param props
 */
const Header = (props: Props) => {
  const { dispatch, header, login, tags, onSearch } = props;
  const { userId } = login;
  const { searchLoading, keyword } = header;
  const { selectedTag } = tags;
  const {
    location: { query, pathname },
  } = history;
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};

  return (
    <header className={styles.header}>
      <Link to="/">
        <div className={styles.logo}></div>
      </Link>
      <div className={styles.searchBox}>
        <Search
          style={{
            height: 40,
          }}
          value={keyword}
          onChange={(e) => {
            dispatch({
              type: 'header/saveState',
              payload: {
                keyword: e.target.value,
              },
            });
          }}
          placeholder="输入关键字进行搜索"
          allowClear
          enterButton={
            <Button
              loading={searchLoading}
              size="large"
              type="primary"
              icon={<SearchOutlined />}
              style={{
                backgroundColor: '#8462bb',
                borderColor: '#8462bb',
                width: 60,
              }}
            ></Button>
          }
          size="large"
          onSearch={onSearch}
        />
      </div>
      <div className={styles.rightBox}>
        <Link
          to="/pc/publish"
          style={{
            marginRight: 30,
          }}
        >
          <Button
            icon={
              <IconFont
                type="icon-shangchuantupian1"
                style={{ color: '#fff' }}
              />
            }
            type="primary"
            className={styles.uploadBtn}
          >
            上传
          </Button>
        </Link>
        {userId ? (
          <Dropdown overlay={<Menus />} className={styles.avatarBox}>
            <Link to={`/pc/space?id=${userInfo._id}`}>
              <Space>
                <Badge dot={false}>
                  <Avatar
                    shape="circle"
                    icon={!userInfo.avatarMin && <UserOutlined />}
                    src={userInfo.avatarMin}
                    size={40}
                    className={styles.userAvatar}
                  />
                </Badge>
                <div className={styles.userName}>{userInfo.name}</div>
              </Space>
            </Link>
          </Dropdown>
        ) : (
          <Link to="/pc/login">
            <Button
              className={styles.loginBtn}
              onClick={() => {
                dispatch({
                  type: 'login/saveState',
                  payload: {
                    needGoBack: true,
                  },
                });
              }}
            >
              登录/注册
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default connect(
  ({
    header,
    login,
    tags,
  }: {
    header: HeaderModelState;
    login: LoginModelState;
    tags: TagsModelState;
  }) => ({
    header,
    login,
    tags,
  }),
)(Header);
