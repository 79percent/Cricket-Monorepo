import { request } from 'umi';

// 添加回复
export const addReplyAPI = (data) => {
  return request('/api/reply/add', {
    data,
    method: 'post',
  });
};

// 删除回复
export const deleteReplyAPI = (data) => {
  return request('/api/reply/delete', {
    data,
    method: 'post',
  });
};

// 获取评论下方的回复列表
export const getReplyListAPI = (params) => {
  return request('/api/reply/getReplyList', {
    params,
  });
};
