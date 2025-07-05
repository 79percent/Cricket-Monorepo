import { request } from 'umi';

// 上传作品
export const addWorkAPI = (data) => {
  return request('/api/works/add', {
    data,
    method: 'post',
    requestType: 'form',
  });
};

// 删除作品
export const deleteWorkAPI = (data) => {
  return request('/api/works/delete', {
    data,
    method: 'post',
  });
};

// 删除作品图片item
export const deleteWorkItemAPI = (data) => {
  return request('/api/works/delete/item', {
    data,
    method: 'post',
  });
};

// 获取作品列表
export const getWorkListAPI = (params) => {
  return request('/api/works/getWorkList', {
    params,
  });
};

// 获取相关推荐
export const getRecommendAPI = (params) => {
  return request('/api/works/getRecommend', {
    params,
  });
};

// 获取作品详情
export const getDetailAPI = (params) => {
  return request('/api/works/getDetail', {
    params,
  });
};

// 获取作者其他作品
export const getOtherAPI = (params) => {
  return request('/api/works/getOther', {
    params,
  });
};

// 获取作品统计数
export const getStatisticsAPI = (params) => {
  return request('/api/works/getStatistics', {
    params,
  });
};
