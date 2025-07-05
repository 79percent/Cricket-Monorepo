// 用户表users
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 昵称
  account: { type: String, required: true, unique: true }, // 用户名
  password: { type: String, required: true }, // 密码
  // phone: { type: String, default: "", unique: true }, // 手机号
  // email: { type: String, default: "", unique: true }, // 邮箱
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  authority: { type: String, default: '0' }, // 权限 0 user  1 admin 2 管理员创建的账号
  avatarMin: { type: String, default: "" }, // 小头像
  avatar: { type: String, default: "" }, // 大头像
  profile: { type: String, default: "" }, // 简介
  sex: { type: String, default: '0' }, // 性别 0保密 1男 2女
  birthDay: { type: Number, default: undefined }, // 出生日期
  lastLoginTime: { type: Number, default: undefined }, // 上一次登录时间
  background: { type: String, default: "" }, // 个人空间背景图片
});

module.exports = Schema;
