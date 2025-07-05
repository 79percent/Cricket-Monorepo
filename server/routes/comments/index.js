/**
 * 评论
 */
const express = require("express");
const moment = require("moment");
const {
  CommentsModel,
  WorksModel,
  ReplysModel,
  ReplyStatusModel,
  CommentStatusModel,
} = require("../../db/models");
const { checkToken } = require("../../utils/utils");

const router = express.Router();

// 添加评论
router.post("/add", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { workId, content } = req.body;
      const work = await WorksModel.findOne({
        _id: workId,
      });
      if (!work) {
        res.send({ code: 1, message: "评论失败" });
        return;
      }
      const Timestamp = moment().valueOf();
      const doc = await CommentsModel.create({
        content,
        createTime: Timestamp,
        updateTime: Timestamp,
        target: workId,
        creator: userId,
        targetId: workId,
        creatorId: userId,
      });
      const data = await CommentsModel.findOne({
        _id: doc._id,
      }).populate({
        path: "creator",
        select: "name avatar profile sex",
      });
      res.send({ code: 0, message: "评论成功", data });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "评论失败" });
  }
});

// 删除
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const doc = await CommentsModel.findOneAndDelete({
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

// 获取评论列表 支持分页
router.get("/getCommentList", async (req, res) => {
  try {
    let { current = 1, pageSize = 10, workId } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      target: workId,
    };
    const doc = await CommentsModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await CommentsModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: 1 }) // 倒序
        .skip(skipCount) //分页跳过条数
        .populate({
          path: "creator",
          select: "name avatar profile sex",
        });
      // 获取评论的回复数量
      const getReplyCount = () => {
        return new Promise((resolve, reject) => {
          try {
            const map = {};
            if (list.length === 0) {
              resolve(map);
              return;
            }
            list.forEach(async (item, index) => {
              const { _id } = item;
              const replyCount = await ReplysModel.count({
                comment: _id,
              });
              map[_id] = replyCount;
              if (list.length === Object.keys(map).length) {
                resolve(map);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      };
      const replyCountMap = await getReplyCount();
      // 获取评论的点赞点踩数量
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
              let likeCount = await CommentStatusModel.count({
                target: _id,
                status: 1,
              });
              let disLikeCount = await CommentStatusModel.count({
                target: _id,
                status: 2,
              });
              likeCount = likeCount;
              disLikeCount = disLikeCount;
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
      // 获取每个评论的回复
      const getReplys = async () => {
        return new Promise((resolve, reject) => {
          try {
            const data = {};
            if (list.length === 0) {
              resolve(data);
              return;
            }
            list.forEach(async (item, index) => {
              const { _id } = item;
              const current = 1;
              const pageSize = 3;
              let skipCount = Math.floor((current - 1) * pageSize);
              const _filter = {
                target: workId,
                comment: _id,
              };
              const total = await ReplysModel.count(_filter);
              const totalPage = Math.ceil(doc / pageSize);
              const replylist = await ReplysModel.find(_filter)
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
              const getReplyStatus = () => {
                return new Promise((resolve, reject) => {
                  try {
                    const map = {};
                    if (replylist.length === 0) {
                      resolve(map);
                      return;
                    }
                    replylist.forEach(async (reply, index) => {
                      const { _id } = reply;
                      let likeCount = await ReplyStatusModel.count({
                        target: _id,
                        status: 1,
                      });
                      let disLikeCount = await ReplyStatusModel.count({
                        target: _id,
                        status: 2,
                      });
                      console.log(item._id, _id, likeCount, disLikeCount)
                      likeCount = likeCount || 0;
                      disLikeCount = disLikeCount || 0;
                      map[_id] = {
                        like: likeCount,
                        disLike: disLikeCount,
                      };
                      if (replylist.length === Object.keys(map).length) {
                        resolve(map);
                      }
                    });
                  } catch (error) {
                    reject(error);
                  }
                });
              };
              const statusMap = await getReplyStatus();
              data[_id] = {
                list: replylist,
                statusMap,
                pageParams: {
                  total,
                  totalPage,
                  current,
                  pageSize,
                }
              }
              if (list.length === Object.keys(data).length) {
                resolve(data);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }
      const replys = await getReplys();
      res.send({
        code: 0,
        data: {
          list,
          replyCountMap,
          statusMap,
          replys,
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
