// 插画表集合
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  status: { type: String, default: "0" }, // 0 默认未审核，1 通过，2 未通过（0和1未页面可见）
  reason: { type: String, default: "" }, // 审核未通过的原因
  createTime: { type: Number, default: Date.now }, // 创建时间
  updateTime: { type: Number, default: Date.now }, // 更新时间
  imgs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "works_item",
      default: [],
    },
  ],
  tags: [
    {
      type: String,
      required: true,
      default: [],
    },
  ], // 标签分类
  title: { type: String, default: "" }, // 标题
  content: { type: String, default: "" }, // 文字内容
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  }, // 创建人
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  }, // 创建人
});

module.exports = Schema;
