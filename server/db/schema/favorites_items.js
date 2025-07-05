// 收藏表
const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  createTime: { type: Number, required: true }, // 创建时间
  updateTime: { type: Number, required: true }, // 更新时间
  status: { type: Number, default: 0 }, // 状态：0 - 不收藏；1 - 收藏
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  work: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  favorite: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "favorites",
  }, // 所属的收藏夹
  creatorId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }, // 创建人
  workId: { type: mongoose.Schema.ObjectId, required: true, ref: "works" }, // 作品
  favoriteId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "favorites",
  }, // 所属的收藏夹
});

module.exports = Schema;
