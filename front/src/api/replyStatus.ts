import { request } from 'umi';

// 更新状态
export const updateReplyStatusAPI = (data) => {
  return request('/api/reply/status/update', {
    data,
    method: 'post',
  });
};

// 获取所有状态评论id
export const getAllStatusAPI = (params) => {
  return request('/api/reply/status/getAllStatus', {
    params,
  });
};

// 获取某条回复的点赞 点踩数量
export const getReplyStatusByIdAPI = (params) => {
  return request('/api/reply/status/getStatusById', {
    params,
  });
};
