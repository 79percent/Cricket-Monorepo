// 分类标签表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  text: { type: String, require: true, unique: true }, // 标签文本
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
});

module.exports = Schema;
