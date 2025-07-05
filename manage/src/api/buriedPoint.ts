/**
 * 数据埋点 网站访问量
 */
import { request } from 'umi';

// 获取
export const getBuriedPointAPI = (params: any) => {
  return request('/api/buriedPoint/getTraffic', {
    params,
  });
};
