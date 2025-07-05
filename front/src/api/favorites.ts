import { request } from 'umi';

// 创建收藏夹
export const addFavoriteAPI = (data) => {
  return request('/api/favorite/add', {
    data,
    method: 'post',
  });
};

// 更新
export const updateFavoriteAPI = (data) => {
  return request('/api/favorite/update', {
    data,
    method: 'post',
  });
};

// 删除
export const deleteFavoriteAPI = (data) => {
  return request('/api/favorite/delete', {
    data,
    method: 'post',
  });
};

// 获取收藏夹列表
export const getFavoritesListAPI = (params) => {
  return request('/api/favorite/getFavoritesList', {
    params,
  });
};

// 获取所有收藏夹
export const getAllFavoritesAPI = (params) => {
  return request('/api/favorite/getAllFavorites', {
    params,
  });
};

// 获取收藏夹列表以及收藏的作品
export const getFavoritesListIllustrationsAPI = (params) => {
  return request('/api/favorite/getFavoritesListIllustrations', {
    params,
  });
};
