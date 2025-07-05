/**
 * 回复评论
 */
const express = require("express");
const moment = require("moment");
const {
  CommentsModel,
  WorksModel,
  ReplysModel,
  UsersModel,
  ReplyStatusModel,
} = require("../../db/models");
const { checkToken } = require("../../utils/utils");

const router = express.Router();

// 添加回复
router.post("/add", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { commentId, workId, content, parentId, targetUserId } = req.body;
      if (!content) {
        res.send({ code: 1, message: "回复失败" });
        return;
      }
      const comment = await CommentsModel.findOne({
        _id: commentId,
      });
      if (!comment) {
        res.send({ code: 1, message: "回复失败" });
        return;
      }
      const work = await WorksModel.findOne({
        _id: workId,
      });
      if (!work) {
        res.send({ code: 1, message: "回复失败" });
        return;
      }
      if (targetUserId) {
        const targetUser = await UsersModel.findOne({
          _id: targetUserId,
        });
        if (!targetUser) {
          res.send({ code: 1, message: "回复失败" });
          return;
        }
      }
      if (parentId) {
        const parent = await ReplysModel.findOne({
          _id: parentId,
        });
        if (!parent) {
          res.send({ code: 1, message: "回复失败" });
          return;
        }
      }
      const Timestamp = moment().valueOf();
      const doc = await ReplysModel.create({
        content,
        createTime: Timestamp,
        updateTime: Timestamp,
        target: workId,
        creator: userId,
        targetUser: targetUserId,
        parent: parentId,
        comment: commentId,
        targetId: workId,
        creatorId: userId,
        targetUserId: targetUserId,
        parentId: parentId,
        commentId: commentId,
      });
      const data = await ReplysModel.findOne({
        _id: doc._id,
      })
        .populate({
          path: "creator",
          select: "name avatar profile sex",
        })
        .populate({
          path: "targetUser",
          select: "name avatar profile sex",
        });
      res.send({ code: 0, message: "回复成功", data });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "回复失败" });
  }
});

// 删除
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const doc = await ReplysModel.findOneAndDelete({
        _id: id,
        creator: userId,
      });
      if (doc) {
        res.send({ code: 0, message: "删除成功" });
      } else {
        res.send({ code: 1, message: "删除失败" });
      }
    } else {
      res
        .status(401)
        .send({ code: 1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "删除失败" });
  }
});

// 获取评论下方的回复
router.get("/getReplyList", async (req, res) => {
  try {
    let { current = 1, pageSize = 10, workId, commentId } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      target: workId,
      comment: commentId,
    };
    const doc = await ReplysModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await ReplysModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: 1 }) // 倒序
        .skip(skipCount) //分页跳过条数
        .populate({
          path: "creator",
          select: "name avatar profile sex",
        })
        .populate({
          path: "targetUser",
          select: "name avatar profile sex",
        });
      // 获取回复的点赞点踩数量
      const getStatus = () => {
        return new Promise((resolve, reject) => {
          try {
            const map = {};
            if (list.length === 0) {
              resolve(map);
              return;
            }
            list.forEach(async (item, index) => {
              const { _id } = item;
              let likeCount = await ReplyStatusModel.count({
                target: _id,
                status: 1,
              });
              let disLikeCount = await ReplyStatusModel.count({
                target: _id,
                status: 2,
              });
              likeCount = likeCount || 0;
              disLikeCount = disLikeCount || 0;
              map[_id] = {
                like: likeCount,
                disLike: disLikeCount,
              };
              if (list.length === Object.keys(map).length) {
                resolve(map);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      };
      const statusMap = await getStatus();
      res.send({
        code: 0,
        data: {
          list,
          statusMap,
        },
        message: "获取成功",
        total,
        totalPage,
        current,
        pageSize,
      });
    } else {
      res.send({ code: 1, message: "获取失败" });
    }
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

module.exports = router;
