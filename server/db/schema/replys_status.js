// 回复点赞/点踩状态表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  status: { type: Number, default: 0 }, // 状态：0 - 无操作；1 - 点赞；2 - 点踩
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  target: { type: mongoose.Schema.ObjectId, required: true, ref: 'replys' }, // 回复
  work: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  targetId: { type: mongoose.Schema.ObjectId, required: true, ref: 'replys' }, // 回复
  workId: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
});

module.exports = Schema;
