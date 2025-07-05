import { request } from 'umi';

// 提交意见反馈
export const addFeedbackAPI = (data) => {
  return request('/api/feedback/add', {
    data,
    method: 'post',
  });
};

// 删除
export const deleteFeedbackAPI = (data) => {
  return request('/api/feedback/delete', {
    data,
    method: 'post',
  });
};

// 获取意见反馈列表
export const getFeedbackListAPI = (params) => {
  return request('/api/feedback/getFeedbackList', {
    params,
  });
};
