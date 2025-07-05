/**
 * 删除数据和文件
 */
const express = require("express");
const {
  UsersModel,
  TagsModel,
  WorksModel,
  WorksItemModel,
  FavoritesModel,
  FeedbacksModel,
  AttentionsStatusModel,
  PraiseStatusModel,
  FavoritesItemsModel,
} = require("../../db/models");
const fs = require('fs');

const router = express.Router();

router.get('/data', async (req, res, next) => {
  try {
    const taskArr = [
      TagsModel.deleteMany({}),
      WorksModel.deleteMany({}),
      WorksItemModel.deleteMany({}),
      FavoritesModel.deleteMany({}),
      FeedbacksModel.deleteMany({}),
      AttentionsStatusModel.deleteMany({}),
      PraiseStatusModel.deleteMany({}),
      FavoritesItemsModel.deleteMany({}),
    ]
    await Promise.all(taskArr);
    res.send({
      code: 0,
      message: '删除成功'
    })
  } catch (error) {
    next(error);
  }
});

module.exports = router;