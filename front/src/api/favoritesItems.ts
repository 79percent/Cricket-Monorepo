import { request } from 'umi';

// 添加作品到收藏夹
export const favoriteWorkAPI = (data) => {
  return request('/api/favorite/items/add', {
    data,
    method: 'post',
  });
};

// 删除
export const deleteFavoriteWorkAPI = (data) => {
  return request('/api/favorite/items/delete', {
    data,
    method: 'post',
  });
};

// 获取收藏夹下的作品列表
export const getFavoriteItemsListAPI = (params) => {
  return request('/api/favorite/items/getFavoriteItemsList', {
    params,
  });
};

// 获取用户全部收藏作品Id
export const getAllFavoritesAPI = (params) => {
  return request('/api/favorite/items/getAllFavoriteItems', {
    params,
  });
};

// 获取作品被收藏至哪些收藏夹下
export const getWorkFavoriteAPI = (params) => {
  return request('/api/favorite/items/getWorkFavorite', {
    params,
  });
};

// 获取作品的收藏数
export const getFavoritesCountAPI = (params) => {
  return request('/api/favorite/items/getFavoritesCount', {
    params,
  });
};
