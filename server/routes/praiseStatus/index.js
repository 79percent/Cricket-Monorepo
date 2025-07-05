/**
 * 点赞状态
 */
const express = require("express");
const { checkToken } = require("../../utils/utils");
const { PraiseStatusModel } = require("../../db/models");

const router = express.Router();

// 更新状态
router.post("/update", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      let { id, status } = req.body;
      status = Number(status);
      if (![0, 1].includes(status)) {
        res.send({
          code: 1,
          message: "操作失败",
        });
        return;
      }
      const Timestamp = new Date().valueOf();
      const doc = await PraiseStatusModel.findOne({
        creator: userId,
        target: id,
      });
      if (doc) {
        // 已经操作过
        await PraiseStatusModel.findByIdAndUpdate(
          { _id: doc._id },
          {
            updateTime: Timestamp,
            status,
          }
        );
      } else {
        // 没有操作过
        await PraiseStatusModel.create({
          createTime: Timestamp,
          updateTime: Timestamp,
          status,
          creator: userId,
          target: id,
          creatorId: userId,
          targetId: id,
        });
      }
      res.send({
        code: 0,
        message: "操作成功",
        data: {
          status,
        },
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "操作失败" });
  }
});

// 获取用户收藏列表
router.get("/getPraiseList", async (req, res) => {
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
    const doc = await PraiseStatusModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await PraiseStatusModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount)
        .populate({
          path: "target",
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

// 获取当前用户的所有收藏id
router.get("/getAllPraise", async (req, res) => {
  try {
    const { userId } = req.query;
    const _filter = {
      creator: userId,
      status: 1,
    };
    const list = await PraiseStatusModel.find(_filter).sort({
      createTime: -1,
    }); // 倒序
    res.send({
      code: 0,
      message: "获取成功",
      data: list.map((item) => item.target),
    });

  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

module.exports = router;
