import { request } from 'umi';

// 更新状态
export const updatePraiseAPI = (data) => {
  return request('/api/praise/update', {
    data,
    method: 'post',
  });
};

// 获取用户点赞列表
export const getPraiseListAPI = (params) => {
  return request('/api/praise/getPraiseList', {
    params,
  });
};

// 获取所有点赞作品id
export const getAllPraiseAPI = (params) => {
  return request('/api/praise/getAllPraise', {
    params,
  });
};
