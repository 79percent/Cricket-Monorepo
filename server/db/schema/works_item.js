// 插画
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, default: Date.now }, // 创建时间
  updateTime: { type: Number, default: Date.now }, // 更新时间
  url: { type: String, require: true, default: "", trim: true }, // 图片url
  urlMin: { type: String, require: true }, // 压缩后的图片
  imgWidth: { type: Number, require: true }, // 图片宽
  imgHeight: { type: Number, require: true }, // 图片高
});

module.exports = Schema;
