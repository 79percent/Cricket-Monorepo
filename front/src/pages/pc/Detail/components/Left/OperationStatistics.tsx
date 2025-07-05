import React, { useState, useEffect } from 'react';
import styles from './OperationStatistics.less';
import {
  LikeFilled,
  HeartFilled,
  LikeOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { formatNumber } from '@/utils';
import {
  connect,
  DetailModelState,
  LoginModelState,
  useModel,
  Dispatch,
  history,
} from 'umi';
import { updatePraiseAPI } from '@/api/praiseStatus';
import FavoriteModal from '@/components/pc/FavoriteModal';
import { favoriteWorkAPI } from '@/api/favoritesItems';
import IconFont from '@/components/pc/IconFont';
import { notification } from 'antd';

interface Props {
  dispatch: Dispatch;
  detail: DetailModelState;
  login: LoginModelState;
  id: string;
}

const OperationStatistics: React.FC<Props> = (props) => {
  const { detail, dispatch, login, id } = props;
  const [visible, setVisible] = useState(false);
  const { statistics, data } = detail;
  const { praise, favorite, comment } = statistics;
  const { _id = '', url } = data;
  const { initialState, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};
  const allPraise = initialState?.allPraise || [];
  const allFavorites = initialState?.allFavorites || [];
  const { userId } = login;
  const isLike = allPraise.findIndex((id) => id === _id) !== -1;
  const isFavorite = allFavorites.findIndex((id) => id === _id) !== -1;

  const handleLike = async () => {
    if (!userInfo?._id) {
      // 未登录
      notification.error({
        message: ``,
        description: '请先登录',
      });
      history.push('/login');
      return;
    }
    const value = !isLike;
    const id = _id;
    const res = await updatePraiseAPI({
      id,
      status: value ? 1 : 0,
    });
    const { code } = res;
    if (code === 0) {
      const newAllPraise = await initialState?.fetchAllPraise();
      await setInitialState({
        ...initialState,
        allPraise: newAllPraise,
      } as any);
      await dispatch({
        type: 'detail/fetchStatistics',
        payload: {
          workId: id,
        },
      });
    }
  };

  const handleFavorite = async () => {
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
    }
  };

  // 收藏确定
  const handleFavoriteOk = async (values: any) => {
    const { favorites } = values;
    const res = await favoriteWorkAPI({
      favoriteId: favorites,
      workId: _id,
    });
    if (res.code === 0) {
      sessionStorage.removeItem('favorite_work_id');
      setVisible(false);
      dispatch({
        type: 'detail/fetchStatistics',
        payload: {
          workId: _id,
        },
      });
      const newAllFavorites = await initialState?.fetchAllFavorites();
      await setInitialState({
        ...initialState,
        allFavorites: newAllFavorites,
      } as any);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'detail/fetchStatistics',
        payload: {
          workId: id,
        },
      });
    }
  }, [id]);

  return (
    <>
      <div className={styles.leftOperation}>
        {/* 点赞 */}
        <div className={styles.iconRowItem}>
          <IconFont
            type={isLike ? 'icon-icon-copy' : 'icon-icon'}
            onClick={handleLike}
            style={{
              fontSize: 32,
            }}
          />
          <span
            className={styles.count}
            style={{ color: isLike ? '#d41c1c' : '#808080' }}
          >
            {praise === 0 ? '' : formatNumber(praise)}
          </span>
        </div>
        {/* 评论 */}
        {/* <div className={styles.iconRowItem}>
          <MessageOutlined style={{ fontSize: 26, color: '#808080' }} />
          <span className={styles.count} style={{ color: '#808080' }}>
            {formatNumber(comment)}
          </span>
        </div> */}
        {/* 收藏 */}
        <div className={styles.iconRowItem}>
          <IconFont
            type={isFavorite ? 'icon-xihuan4' : 'icon-xinbaniconshangchuan-1'}
            onClick={handleFavorite}
            style={{
              fontSize: 32,
              color: isFavorite ? '#d41c1c' : '#a8a8a8',
            }}
          />
          <span
            className={styles.count}
            style={{ color: isFavorite ? '#d41c1c' : '#808080' }}
          >
            {favorite === 0 ? '' : formatNumber(favorite)}
          </span>
        </div>
        {/* <div className={styles.iconRowItem}>
          <a href={url} download target="_blank">
            <DownloadOutlined
              style={{
                fontSize: 32,
                color: '#808080',
              }}
            />
          </a>
        </div> */}
      </div>
      <FavoriteModal
        visible={visible}
        onOk={handleFavoriteOk}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

export default connect(
  ({
    detail,
    login,
  }: {
    detail: DetailModelState;
    login: LoginModelState;
  }) => ({
    detail,
    login,
  }),
)(OperationStatistics);
