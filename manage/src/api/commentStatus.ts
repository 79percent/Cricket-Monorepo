import { request } from 'umi';

// 更新状态
export const updateCommentStatusAPI = (data: any) => {
  return request('/api/comment/status/update', {
    data,
    method: 'post',
  });
};

// 获取所有状态评论id
export const getAllStatusAPI = (params: any) => {
  return request('/api/comment/status/getAllStatus', {
    params,
  });
};

// 获取某条评论的点赞 点踩数量
export const getCommentStatusByIdAPI = (params: any) => {
  return request('/api/comment/status/getStatusById', {
    params,
  });
};
