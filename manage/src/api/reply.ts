import { request } from 'umi';

// 添加回复
export const addReplyAPI = (data: any) => {
  return request('/api/reply/add', {
    data,
    method: 'post',
  });
};

// 删除回复
export const deleteReplyAPI = (data: any) => {
  return request('/api/reply/delete', {
    data,
    method: 'post',
  });
};

// 获取评论下方的回复列表
export const getReplyListAPI = (params: any) => {
  return request('/api/reply/getReplyList', {
    params,
  });
};
