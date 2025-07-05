import { request } from 'umi';

// 校验字段值是否已存在
export const verifyFieldAPI = (params) => {
  return request('/api/user/verifyField', {
    params,
  });
};

// 获取用户列表
export const getUserListAPI = (params) => {
  return request('/api/user/getUserList', {
    params,
  });
};

// 获取用户信息
export const getInfoAPI = (params) => {
  return request('/api/user/getInfo', {
    params,
  });
};

// 获取用户统计数
export const getStatisticsAPI = (params) => {
  return request('/api/user/getStatistics', {
    params,
  });
};

// 获取用户统计数移动端
export const getMbStatisticsAPI = (params) => {
  return request('/api/user/getMbStatistics', {
    params,
  });
};

// 账号密码登录
export const loginAPI = (data) => {
  return request('/api/user/login', {
    data,
    method: 'post',
  });
};

// 修改用户信息
export const updateInfoAPI = (data) => {
  return request('/api/user/update', {
    data,
    method: 'post',
  });
};

// 更新头像
export const uploadAvatarAPI = (data) => {
  return request('/api/user/uploadAvatar', {
    data,
    method: 'post',
  });
};

// 设置个人空间背景图片
export const uploadBackgroundAPI = (data) => {
  return request('/api/user/uploadBackground', {
    data,
    method: 'post',
  });
};

// 发送邮箱验证码
export const sendEmailCodeAPI = (data) => {
  return request('/api/user/sendEmailCode', {
    data,
    method: 'post',
  });
};

// 删除用户
export const deleteUserAPI = (data) => {
  return request('/api/user/delete', {
    data,
    method: 'post',
  });
};

// 注册
export const registerAPI = (data) => {
  return request('/api/user/register', {
    data,
    method: 'post',
  });
};

// 注销
export const cancelAPI = (data) => {
  return request('/api/user/cancel', {
    data,
    method: 'post',
  });
};

// 修改密码
export const updatePasswordAPI = (data) => {
  return request('/api/user/updatePassword', {
    data,
    method: 'post',
  });
};

// 修改邮箱
export const updateEmailAPI = (data) => {
  return request('/api/user/updateEmail', {
    data,
    method: 'post',
  });
};

// 重置密码
export const resetPasswordAPI = (data) => {
  return request('/api/user/resetPassword', {
    data,
    method: 'post',
  });
};
