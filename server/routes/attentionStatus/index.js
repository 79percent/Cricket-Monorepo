/**
 * 关注用户
 */
const express = require("express");
const { checkToken } = require("../../utils/utils");
const { AttentionsStatusModel, UsersModel } = require("../../db/models");

const router = express.Router();

// 更新状态
router.post("/update", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      const { id, status } = req.body;
      if (![0, 1].includes(Number(status))) {
        res.send({
          code: 1,
          message: "关注失败",
        });
        return;
      }
      if (userId === id) {
        res.send({ code: 1, message: "关注失败" });
        return;
      }
      const targetUserDoc = await UsersModel.findOne({
        _id: id,
      });
      if (!targetUserDoc) {
        res.send({ code: 1, message: "关注失败" });
        return;
      }
      const Timestamp = new Date().valueOf();
      const doc = await AttentionsStatusModel.findOne({
        creator: userId,
        targetUser: id,
      });
      if (doc) {
        // 已经关注过
        await AttentionsStatusModel.findByIdAndUpdate(
          { _id: doc._id },
          {
            updateTime: Timestamp,
            status: Number(status),
          }
        );
      } else {
        // 没有关注过
        await AttentionsStatusModel.create({
          createTime: Timestamp,
          updateTime: Timestamp,
          status: Number(status),
          creator: userId,
          targetUser: id,
          creatorId: userId,
          targetUserId: id,
        });
      }
      res.send({
        code: 0,
        message: Number(status) === 1 ? "关注成功" : "已取消关注",
        data: {
          status: Number(status),
        },
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "关注失败" });
  }
});

// 移除关注
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const doc = await AttentionsStatusModel.deleteOne({
        _id: id,
      });
      res.send({
        code: 0,
        message: "取关成功",
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "取关失败" });
  }
});

// 获取用户关注列表
router.get("/getAttentionList", async (req, res) => {
  try {
    let { current = 1, pageSize = 10, id = "" } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      creator: id,
      status: 1,
    };
    const doc = await AttentionsStatusModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await AttentionsStatusModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount)
        .populate({
          path: "targetUser",
          select: "name avatar profile sex",
        });
      res.send({
        code: 0,
        message: "获取成功",
        data: list,
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

// 获取粉丝列表
router.get("/getFansList", async (req, res) => {
  try {
    let { current = 1, pageSize = 10, id = "" } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      targetUser: id,
      status: 1,
    };
    const doc = await AttentionsStatusModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await AttentionsStatusModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount)
        .populate({
          path: "creator",
          select: "name avatar profile sex",
        });
      res.send({
        code: 0,
        message: "获取成功",
        data: list,
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

// 获取当前用户的所有关注id
router.get("/getAllAttention", async (req, res) => {
  try {
    const { userId } = req.query;
    const _filter = {
      creator: userId,
      status: 1,
    };
    const list = await AttentionsStatusModel.find(_filter).sort({
      createTime: -1,
    }); // 倒序
    res.send({
      code: 0,
      message: "获取成功",
      data: list.map((item) => item.targetUser),
    });
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

module.exports = router;
