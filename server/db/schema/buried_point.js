/**
 * 数据埋点
 * 统计网站访问量
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, default: "" }, // 创建时间
  loadTime: { type: Number, default: "" }, // 加载时间
  ip: { type: String, default: "" }, // 客户端IP地址
  location: { type: String, default: "" }, // 客户端IP归属地
  origin: { type: String, default: "" }, // 请求源
  host: { type: String, default: "" }, // 请求目标地址
  referer: { type: String, default: "" }, // 请求地址
  userAgent: { type: String, default: "" }, // userAgent
  device: { type: String, default: "" }, // 设备信息
  resolution: { type: String, default: "" }, // 设备分辨率 1920*1560
});

module.exports = Schema;