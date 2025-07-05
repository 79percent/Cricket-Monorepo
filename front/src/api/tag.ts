import { request } from 'umi';

// 创建标签
export const addTagAPI = (data) => {
  return request('/api/tag/add', {
    data,
    method: 'post',
  });
};

// 修改标签
export const updateTagAPI = (data) => {
  return request('/api/tag/update', {
    data,
    method: 'post',
  });
};

// 删除标签
export const deleteTagAPI = (data) => {
  return request('/api/tag/delete', {
    data,
    method: 'post',
  });
};

// 获取标签列表
export const getTagListAPI = (params) => {
  return request('/api/tag/getTagList', {
    params,
  });
};
