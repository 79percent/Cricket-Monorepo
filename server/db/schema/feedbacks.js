// 意见反馈表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  content: { type: String, require: true }, // 内容
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
});

module.exports = Schema;
