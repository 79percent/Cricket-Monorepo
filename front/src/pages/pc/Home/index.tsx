import React, { useState, useEffect, useCallback } from 'react';
import {
  history,
  connect,
  LoginModelState,
  HomeModelState,
  HeaderModelState,
  TagsModelState,
  ConnectProps,
  useModel,
  Dispatch,
} from 'umi';
import { Spin, BackTop, notification } from 'antd';
import Tags from '@/components/pc/Tags';
import WorksList from '@/components/pc/WorksList';
import FavoriteModal from '@/components/pc/FavoriteModal';
import { favoriteWorkAPI } from '@/api/favoritesItems';
import styles from './styles.less';
import { useScrollEnd } from '@/utils/hooks';

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
  const { home, header, tags, dispatch, login } = props;
  const { userId } = login;
  const { keyword } = header;
  const { selectedTag } = tags;
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
    <>
      <div className={styles.pcHome}>
        <BackTop style={{ right: 40 }} />
        <Tags />
        <div className={styles.worksList}>
          <WorksList
            column={6}
            list={worksList}
            praise={praiseCount}
            favorite={favoriteCount}
            userInfo={userInfo}
            allPraise={allPraise}
            allAttention={allAttention}
            allFavorites={allFavorites}
            onCollect={handleCollect}
          />
        </div>
        <div className={styles.spinBox}>
          {worksList.length === 0 || worksList.length < pageParams.total ? (
            <Spin spinning={loadingWorks} />
          ) : (
            <span className={styles.last}>没有更多了~</span>
          )}
        </div>
      </div>
      <FavoriteModal
        visible={visible}
        onOk={handleFavoriteOk}
        onCancel={() => {
          setVisible(false);
        }}
        workId={favoriteWorkId}
      />
    </>
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
