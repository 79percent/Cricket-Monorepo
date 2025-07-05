/**
 * 移动端 首页
 */
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
} from 'umi';
import styles from './styles.less';
import './home.less';
import SkeletonList from '@/components/mb/SkeletonList';
import WorksList from '@/components/pc/WorksList';
import { Spin, notification } from 'antd';
import { useScrollEnd } from '@/utils/hooks';
import FavoriteModal from '@/components/pc/FavoriteModal';
import { favoriteWorkAPI } from '@/api/favoritesItems';

interface Props extends ConnectProps {
  login: LoginModelState;
  home: HomeModelState;
  header: HeaderModelState;
  tags: TagsModelState;
  dispatch: Dispatch;
}

let lastRequestPage = -1;

const Home: React.FC<Props> = (props) => {
  const {
    location: { query },
  } = history;
  const [value, setValue] = useState('');
  const { home, header, tags, dispatch, login } = props;
  const { userId } = login;
  const { keyword } = header;
  const { pageParams, worksList, praiseCount, favoriteCount, searchParams } =
    home;
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};
  const allPraise = initialState?.allPraise || [];
  const allAttention = initialState?.allAttention || [];
  const allFavorites = initialState?.allFavorites || [];
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [visible, setVisible] = useState(false);
  const [favoriteWorkId, setFavoriteWorkId] = useState('');

  // 点击收藏作品，弹出收藏分组弹框
  const handleCollect = async (value, id, index) => {
    if (!userInfo?._id) {
      // 未登录
      notification.error({
        message: ``,
        description: '请先登录',
      });
      history.push('/login');
      return;
    }
    const sessionWorkId = sessionStorage.getItem('favorite_work_id');
    if (sessionWorkId === id) {
      setVisible(true);
      setFavoriteWorkId(id);
      return;
    }
    sessionStorage.setItem('favorite_work_id', id);
    const [res0, res] = await Promise.all([
      dispatch({
        type: 'favorites/fetchAllFavorites',
        payload: {
          id: userId,
        },
      }),
      dispatch({
        type: 'favorites/fetchWorkFavoriteAPI',
        payload: {
          userId,
          workId: id,
        },
      }),
    ]);
    if (res.code === 0) {
      setVisible(true);
      setFavoriteWorkId(id);
    }
  };

  // 获取作品
  const fetchData = useCallback(
    (params = {}) => {
      const { current, pageSize } = pageParams;
      setLoadingWorks(true);
      dispatch({
        type: 'home/fetchWorksList',
        payload: {
          current,
          pageSize,
          keyword,
          ...params,
        },
      }).finally(() => {
        setLoadingWorks(false);
      });
    },
    [pageParams],
  );

  // 收藏确定
  const handleFavoriteOk = async (values: any) => {
    const { favorites } = values;
    const res = await favoriteWorkAPI({
      favoriteId: favorites,
      workId: favoriteWorkId,
    });
    if (res.code === 0) {
      sessionStorage.removeItem('favorite_work_id');
      setVisible(false);
      dispatch({
        type: 'home/fetchFavoritesCountAPI',
        payload: {
          workId: favoriteWorkId,
        },
      });
      const newAllFavorites = await initialState?.fetchAllFavorites();
      setInitialState({
        ...initialState,
        allFavorites: newAllFavorites,
      } as any);
    }
  };

  // 获取下一页作品
  const handleFetchNextPage = useCallback(() => {
    if (lastRequestPage === pageParams.current + 1) {
      return;
    }
    if (pageParams.current < pageParams.totalPage) {
      lastRequestPage = pageParams.current + 1;
      fetchData({
        current: pageParams.current + 1,
      });
    }
  }, [fetchData, pageParams]);

  useScrollEnd(handleFetchNextPage, 300, 0.6);

  useEffect(() => {
    // if (worksList.length > 0 && searchParams.keyword === query?.keyword) {
    //   return;
    // }
    // 初始化数据
    const initData = async () => {
      // 返回的情况下 如果已经存在数据，不再获取
      setLoadingWorks(true);
      await dispatch({
        type: 'home/fetchWorksList',
        payload: {
          current: 1,
          pageSize: 24,
          keyword: query?.keyword,
        },
      });
      setLoadingWorks(false);
    };
    initData();
  }, [query?.keyword]);

  return (
    <div>
      <BackTop theme="round-dark" style={{ backgroundColor: '#0000009e' }} />
      {/* <PullDownRefresh
        className="mb-home-content"
        loadingBarHeight={70}
        refreshTimeout={1000 * 5}
        onRefresh={() => {
          const initData = async () => {
            // 返回的情况下 如果已经存在数据，不再获取
            setLoadingWorks(true);
            await dispatch({
              type: 'home/fetchWorksList',
              payload: {
                current: 1,
                pageSize: 24,
                keyword: query?.keyword,
              },
            });
            setLoadingWorks(false);
          };
          return initData();
        }}
        onTimeout={() => {
          // @ts-ignore
          Toast.warning({ message: '刷新超时', direction: 'column' });
        }}
      > */}
      <div className={styles.mbHomeImgList}>
        <div className={styles.mbHomeImgListInner}>
          <WorksList
            column={2}
            list={worksList}
            praise={praiseCount}
            favorite={favoriteCount}
            userInfo={userInfo}
            allPraise={allPraise}
            allAttention={allAttention}
            allFavorites={allFavorites}
            onCollect={handleCollect}
          />
          {worksList.length === 0 || worksList.length < pageParams.total ? (
            // TODO: 有时没有出现骨架屏
            loadingWorks && <SkeletonList />
          ) : (
            <div className={styles.spinBox}>
              <span className={styles.last}>没有更多了~</span>
            </div>
          )}
        </div>
      </div>
      {/* </PullDownRefresh> */}
      <FavoriteModal
        visible={visible}
        onOk={handleFavoriteOk}
        onCancel={() => {
          setVisible(false);
        }}
        workId={favoriteWorkId}
      />
    </div>
  );
};

export default connect(
  ({
    login,
    home,
    header,
    tags,
  }: {
    login: LoginModelState;
    home: HomeModelState;
    header: HeaderModelState;
    tags: TagsModelState;
  }) => ({
    home,
    header,
    tags,
    login,
  }),
)(Home);
