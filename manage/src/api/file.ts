import { request } from 'umi';
import type { RequestOptionsWithResponse } from 'umi-request';

// 上传文件到服务器
export const uploadFileAPI = (
  options: RequestOptionsWithResponse & {
    // 上传文件到服务器
    skipErrorHandler?: boolean | undefined;
  },
): any => {
  return request('/file/upload', {
    method: 'post',
    ...options,
  });
};
