import React, { useEffect } from 'react';
import { connect, SpaceModelState, ConnectProps, Dispatch } from 'umi';
import UserInfo from './components/User';
import SpaceTabs from './components/Tabs';
import styles from './styles.less';
import BackgroundImg from './components/BackgroundImg';
import { BackTop } from 'antd';

interface Props extends ConnectProps {
  space: SpaceModelState;
  dispatch: Dispatch;
}

const Page: React.FC<Props> = ({ space, dispatch, location }) => {
  const { userInfo } = space;
  const { query } = location;
  const { id, tab } = query as { id?: string; tab?: string };

  // 设置网页标题
  useEffect(() => {
    const { name } = userInfo;
    if (name) {
      document.title = `${name} - Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图`;
    }
  }, [userInfo]);

  // 获取用户信息
  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch({
      type: 'space/fetchUserInfo',
      payload: {
        id,
      },
    });
  }, [id]);

  return (
    <div className={styles.pcSpace}>
      <BackTop style={{ right: 40 }} />
      <BackgroundImg />
      <UserInfo />
      <SpaceTabs />
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({
  space,
}))(Page);
