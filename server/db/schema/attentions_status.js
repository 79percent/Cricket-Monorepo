// 关注状态表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  status: { type: Number, default: 0 }, // 状态 0 - 未关注 1 - 已关注
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  targetUser: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 关注用户
  targetUserId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 关注用户
});

module.exports = Schema;
