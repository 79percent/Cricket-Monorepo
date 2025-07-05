import React, { useState, useCallback, useEffect } from 'react';
import { SearchIcon, UserCircleIcon } from 'tdesign-icons-react';
import {
  Search,
  BackTop,
  PullDownRefresh,
  Toast,
  Avatar,
} from 'tdesign-mobile-react';
import LogoText from '@/components/mb/LogoText';
import SearchBar from '@/components/mb/SearchBar';
import {
  history,
  connect,
  Link,
  LoginModelState,
  HomeModelState,
  HeaderModelState,
  TagsModelState,
  ConnectProps,
  useModel,
  Dispatch,
  useAccess,
} from 'umi';
import styles from './styles.less';
import './header.less';

interface Props {
  dispatch: Dispatch;
  header: HeaderModelState;
  login: LoginModelState;
  tags: TagsModelState;
  onSearch?: (keyword: string) => void;
}

const MobileHeader = (props: Props) => {
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
    <div className={styles.mbHomeTop} id="mb-home-top">
      <div className={styles.mbHomeTopLeft}>
        <Link to="/">
          <LogoText
            style={{
              width: `10.226rem`,
              height: '2.8rem',
            }}
          />
        </Link>
      </div>
      <div className={styles.mbHomeTopCenter}>
        <SearchBar
          placeholder="请输入关键字"
          value={keyword}
          onChange={(value) => {
            dispatch({
              type: 'header/saveState',
              payload: {
                keyword: value,
              },
            });
          }}
          onClear={() => {
            dispatch({
              type: 'header/saveState',
              payload: {
                keyword: '',
              },
            });
          }}
          onSearch={onSearch}
        />
      </div>
      <div className={styles.mbHomeTopRight}>
        {userInfo._id ? (
          <Link to={`/mb/menu?id=${userInfo._id}`}>
            <Avatar
              size="3.8rem"
              image={userInfo.avatarMin}
              icon={
                userInfo.avatarMin || (
                  <UserCircleIcon
                    size="3.8rem"
                    style={{
                      color: '#b5b5b5',
                    }}
                  />
                )
              }
            />
          </Link>
        ) : (
          <Link to="/mb/login">登录/注册</Link>
        )}
      </div>
    </div>
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
)(MobileHeader);
