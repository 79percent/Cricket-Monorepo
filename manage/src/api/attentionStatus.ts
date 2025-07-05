import { request } from 'umi';

// 更新状态
export const updateAttentionAPI = (data: any) => {
  return request('/api/user/attention/update', {
    data,
    method: 'post',
  });
};

// 取消关注
export const deleteAttentionAPI = (data: any) => {
  return request('/api/user/attention/delete', {
    data,
    method: 'post',
  });
};

// 获取用户关注列表
export const getAttentionListAPI = (params: any) => {
  return request('/api/user/attention/getAttentionList', {
    params,
  });
};

// 获取粉丝列表
export const getFansListAPI = (params: any) => {
  return request('/api/user/attention/getFansList', {
    params,
  });
};

// 获取所有关注用户id
export const getAllAttentionAPI = (params: any) => {
  return request('/api/user/attention/getAllAttention', {
    params,
  });
};
