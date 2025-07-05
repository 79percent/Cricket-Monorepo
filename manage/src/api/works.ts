import { request } from 'umi';

// 上传作品
export const addWorkAPI = (data: any) => {
  return request('/api/works/add', {
    data,
    method: 'post',
    requestType: 'form',
  });
};

// 管理员发布作品
export const adminAddWorkAPI = (data: any) => {
  return request('/api/works/admin/add', {
    data,
    method: 'post',
    requestType: 'form',
  });
};

// 删除作品
export const deleteWorkAPI = (data: any) => {
  return request('/api/works/delete', {
    data,
    method: 'post',
  });
};

/**
 * 审核作品
 * @param data
 * @returns
 */
export const auditWorkAPI = (data: { id: string | string[]; status: string; reason?: string }) => {
  return request('/api/works/audit', {
    data,
    method: 'post',
  });
};

// 获取作品列表
export const getWorkListAPI = (params: any) => {
  return request('/api/works/getWorkList', {
    params,
  });
};

/**
 * 获取待审核的作品列表
 * @param params
 */
export const getWaitAuditListAPI = (params: any) => {
  return request('/api/works/getWorkList', {
    params: {
      status: '0',
      ...params,
    },
  }).then((res) => {
    const { data, total } = res;
    return {
      total,
      data: data.list,
      success: true,
    };
  });
};

/**
 * 获取所有的作品列表
 * @param params
 */
export const getAllWorkListAPI = (params: any) => {
  return request('/api/works/getWorkList', {
    params: {
      status: 'all',
      ...params,
    },
  }).then((res) => {
    const { data, total } = res;
    return {
      total,
      data: data.list,
      success: true,
    };
  });
};

/**
 * 获取审核通过的作品列表
 * @param params
 */
export const getPassAuditListAPI = (params: any) => {
  return request('/api/works/getWorkList', {
    params: {
      status: '1',
      ...params,
    },
  }).then((res) => {
    const { data, total } = res;
    return {
      total,
      data: data.list,
      success: true,
    };
  });
};

/**
 * 获取审核未通过的作品列表
 * @param params
 */
export const getUnPassAuditListAPI = (params: any) => {
  return request('/api/works/getWorkList', {
    params: {
      status: '2',
      ...params,
    },
  }).then((res) => {
    const { data, total } = res;
    return {
      total,
      data: data.list,
      success: true,
    };
  });
};

// 获取相关推荐
export const getRecommendAPI = (params: any) => {
  return request('/api/works/getRecommend', {
    params,
  });
};

// 获取作品详情
export const getDetailAPI = (params: any) => {
  return request('/api/works/getDetail', {
    params,
  });
};

// 获取作者其他作品
export const getOtherAPI = (params: any) => {
  return request('/api/works/getOther', {
    params,
  });
};

// 获取作品统计数
export const getStatisticsAPI = (params: any) => {
  return request('/api/works/getStatistics', {
    params,
  });
};
