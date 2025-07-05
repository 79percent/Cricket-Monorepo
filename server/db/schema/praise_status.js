// 点赞状态表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  status: { type: Number, default: 0 }, // 状态：0 - 未点赞；1 - 已点赞
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  target: { type: mongoose.Schema.ObjectId, required: true, ref: 'works' }, // 作品
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  targetId: { type: mongoose.Schema.ObjectId, required: true, ref: 'works' }, // 作品
});

module.exports = Schema;
