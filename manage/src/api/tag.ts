import { request } from 'umi';

// 创建标签
export const addTagAPI = (data: any) => {
  return request('/api/tag/add', {
    data,
    method: 'post',
  });
};

// 修改标签
export const updateTagAPI = (data: any) => {
  return request('/api/tag/update', {
    data,
    method: 'post',
  });
};

// 删除标签
export const deleteTagAPI = (data: any) => {
  return request('/api/tag/delete', {
    data,
    method: 'post',
  });
};

// 获取标签列表
export const getTagListAPI = (params: any) => {
  return request('/api/tag/getTagList', {
    params,
  });
};
