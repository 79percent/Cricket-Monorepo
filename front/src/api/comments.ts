import { request } from 'umi';

// 添加评论
export const addCommentAPI = (data) => {
  return request('/api/comment/add', {
    data,
    method: 'post',
  });
};

// 删除评论
export const deleteCommentAPI = (data) => {
  return request('/api/comment/delete', {
    data,
    method: 'post',
  });
};

// 获取评论列表
export const getCommentListAPI = (params) => {
  return request('/api/comment/getCommentList', {
    params,
  });
};
