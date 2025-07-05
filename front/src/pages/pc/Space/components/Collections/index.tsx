import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.less';
import { Menu, Pagination, ConfigProvider, message } from 'antd';
import {
  CollectionModelState,
  connect,
  FavoritesModelState,
  LoginModelState,
  Dispatch,
  history,
  useModel,
} from 'umi';
import CollectItem from '@/components/pc/CollectItem';
import { deleteFavoriteWorkAPI } from '@/api/favoritesItems';
import zhCN from 'antd/lib/locale/zh_CN';
import IconFont from '@/components/pc/IconFont';
import { getFavoriteItemsListAPI } from '@/api/favoritesItems';
import { getAllFavoritesAPI, addFavoriteAPI } from '@/api/favorites';
import { getWorkFavoriteAPI, getFavoritesCountAPI } from '@/api/favoritesItems';

const { SubMenu } = Menu;

interface Props {
  favorites: FavoritesModelState;
  collection: CollectionModelState;
  login: LoginModelState;
  dispatch: Dispatch;
}

const Content: React.FC<Props> = ({
  dispatch,
  favorites,
  login,
  collection,
}) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const { userId } = login;
  const { favoritesKey } = collection;
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const [favoritesList, setFavoritesList] = useState<any[]>([]); // 用户收藏夹列表
  const [favoritesCount, setFavoritesCount] = useState<any[]>([]); // 用户收藏夹的收藏总数量
  const [itemsList, setItemsList] = useState<any[]>([]); // 收藏夹下的作品列表
  const [pageParams, setPageParams] = useState<{
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }>({ current: 1, pageSize: 10, total: 0, totalPage: 0 }); // 收藏夹下的作品列表
  const isSelf = userId && id === userId;
  const gap = 20;
  const colums = 5;
  const titleHeight = 28;
  const infoHeight = 20;
  const rowsNum = Math.round(itemsList.length / colums);
  let itemWidth = Math.floor((1000 - 20 * 2 - (colums - 1) * gap) / colums);
  const itemHeight = itemWidth + titleHeight + infoHeight;

  // 获取收藏夹列表
  const fetchAllFavoritesList = async (params: any) => {
    const res = await getAllFavoritesAPI(params);
    if (res?.code === 0) {
      const { list = [], countMap } = res.data;
      setFavoritesList(list);
      setFavoritesCount(countMap);
    }
    return res;
  };

  // 获取收藏夹下的作品列表
  const fetchItemsList = async (params: any) => {
    const res = await getFavoriteItemsListAPI(params);
    const { code, data, current, pageSize, total, totalPage } = res;
    if (code === 0) {
      setItemsList(data || []);
      setPageParams({
        current,
        pageSize,
        total,
        totalPage,
      });
    }
    return res;
  };

  // 翻页
  const handleChangePage = async (newCurrent, newPageSize) => {
    try {
      await fetchItemsList({
        current: newCurrent,
        pageSize: newPageSize,
        id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 删除
  const handleDelete = async (_id) => {
    const res = await deleteFavoriteWorkAPI({
      id: _id,
    });
    if (res.code === 0 && favoritesKey[0]) {
      await fetchAllFavoritesList({
        id,
      });
      await fetchItemsList({
        current: pageParams.current,
        pageSize: pageParams.pageSize,
        id,
        favoriteId: favoritesKey[0],
      });
      const newAllFavorites = await initialState?.fetchAllFavorites();
      await setInitialState({
        ...initialState,
        allFavorites: newAllFavorites,
      } as any);
      message.success(res?.message);
    } else {
      message.error(res?.message || '删除失败');
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const init = async () => {
      try {
        const res = await fetchAllFavoritesList({
          id,
        });
        if (res?.code === 0) {
          const { list = [] } = res.data;
          if (list.length === 0) {
            return;
          }
          const isMatch = favoritesKey[0]
            ? list.some((item) => item._id === favoritesKey[0])
            : false;
          if (!favoritesKey[0] || (favoritesKey[0] && !isMatch)) {
            // 没有匹配到的收藏夹_id就选中并获取第一个
            const { _id } = list[0];
            await dispatch({
              type: 'collection/saveState',
              payload: {
                favoritesKey: [_id],
              },
            });
            await fetchItemsList({
              current: 1,
              pageSize: 10,
              favoriteId: _id,
              id,
            });
          } else if (favoritesKey[0] && isMatch) {
            await fetchItemsList({
              current: 1,
              pageSize: 10,
              favoriteId: favoritesKey[0],
              id,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [id, favoritesKey]);

  return (
    <div className={styles.contentBox}>
      <div className={styles.leftMenu}>
        <Menu
          style={{ width: '100%', borderWidth: 0 }}
          defaultOpenKeys={['all']}
          selectedKeys={favoritesKey}
          mode="inline"
          onSelect={async ({ selectedKeys }) => {
            await dispatch({
              type: 'collection/saveState',
              payload: {
                favoritesKey: selectedKeys,
              },
            });
            await fetchItemsList({
              current: 1,
              pageSize: 10,
              favoriteId: selectedKeys[0],
              id,
            });
          }}
        >
          <SubMenu
            key="all"
            title={isSelf ? '我的收藏夹' : '他的收藏夹'}
            style={{
              fontWeight: 600,
            }}
          >
            {favoritesList.map((item) => {
              const { _id, title } = item;
              return (
                <Menu.Item
                  key={_id}
                  icon={<IconFont type="icon-jihe" style={{ fontSize: 20 }} />}
                >
                  <div className={styles.menuItem}>
                    <span>{title}</span>
                    <span className={styles.itemcount}>
                      {favoritesCount[_id]}
                    </span>
                  </div>
                </Menu.Item>
              );
            })}
          </SubMenu>
        </Menu>
      </div>
      <div className={styles.rightContent}>
        {itemsList.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${colums}, ${itemWidth}px)`,
              gridTemplateRows: `repeat(${rowsNum}, ${itemHeight}px)`,
              gridGap: gap,
            }}
          >
            {itemsList.map((item, index) => {
              const { updateTime, work, _id } = item;
              return (
                <CollectItem
                  key={_id}
                  work={work}
                  imgWidth={itemWidth}
                  imgHeight={itemWidth}
                  createTime={updateTime}
                  onDelete={() => handleDelete(_id)}
                  showOperation={isSelf}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyBox}>
            这是一个空的收藏夹{isSelf ? '，快去收藏吧！' : ''}
          </div>
        )}
        {pageParams.total >= 1 && (
          <div className={styles.pageination}>
            <ConfigProvider locale={zhCN}>
              <Pagination
                showQuickJumper
                showSizeChanger={true}
                pageSizeOptions={['5', '10', '20', '50']}
                onChange={handleChangePage}
                {...pageParams}
              />
            </ConfigProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(
  ({
    favorites,
    collection,
    login,
  }: {
    favorites: FavoritesModelState;
    collection: CollectionModelState;
    login: LoginModelState;
  }) => ({
    favorites,
    collection,
    login,
  }),
)(Content);
