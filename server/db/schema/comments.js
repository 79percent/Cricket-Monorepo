// 作品评论表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  target: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 用户
  targetId: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 用户
  content: { type: String, required: true, default: "" }, // 评论内容
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
});

module.exports = Schema;
