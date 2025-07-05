import { request } from 'umi';

// 上传文件到服务器
export const uploadFileAPI = (options): any => {
  return request('/file/upload', {
    method: 'post',
    ...options,
  });
};
