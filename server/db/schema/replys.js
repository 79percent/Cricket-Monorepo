// 评论回复表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  content: { type: String, required: true, default: "" }, // 评论内容
  target: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 用户
  targetUser: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    default: null,
  }, // 回复目标用户Id, 如果直接回复楼主，则会null
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: "replys",
    default: null,
  }, // 父级id,如果是直接回复楼主，则会null
  comment: {
    type: mongoose.Schema.ObjectId,
    ref: "comments",
    required: true,
  }, // 父评论的id
  targetId: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 用户
  targetUserId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    default: null,
  }, // 回复目标用户Id, 如果直接回复楼主，则会null
  parentId: {
    type: mongoose.Schema.ObjectId,
    ref: "replys",
    default: null,
  }, // 父级id,如果是直接回复楼主，则会null
  commentId: {
    type: mongoose.Schema.ObjectId,
    ref: "comments",
    required: true,
  }, // 父评论的id
});

module.exports = Schema;
