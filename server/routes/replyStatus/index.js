/**
 * 回复状态
 */
const express = require("express");
const { checkToken } = require("../../utils/utils");
const { ReplyStatusModel, ReplysModel, WorksModel } = require("../../db/models");

const router = express.Router();

// 更新状态
router.post("/update", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      let { id, status, workId } = req.body;
      status = Number(status);
      if (![0, 1, 2].includes(status)) {
        res.send({
          code: 1,
          message: "操作失败",
        });
        return;
      }
      const work = await WorksModel.findOne({
        _id: workId,
      });
      if (!work) {
        res.send({ code: 1, message: "操作失败" });
        return;
      }
      const targetReplyDoc = await ReplysModel.findOne({
        _id: id,
      });
      if (!targetReplyDoc) {
        res.send({
          code: 1,
          message: "操作失败",
        });
        return;
      }
      const Timestamp = new Date().valueOf();
      const doc = await ReplyStatusModel.findOne({
        creator: userId,
        target: id,
        work: workId,
      });
      if (doc) {
        // 已经操作过
        await ReplyStatusModel.findByIdAndUpdate(
          { _id: doc._id },
          {
            updateTime: Timestamp,
            status,
          }
        );
      } else {
        // 没有操作过
        await ReplyStatusModel.create({
          createTime: Timestamp,
          updateTime: Timestamp,
          status,
          creator: userId,
          target: id,
          work: workId,
          creatorId: userId,
          targetId: id,
          workId: workId,
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

// 获取当前用户下，某个作品的回复状态
router.get("/getAllStatus", async (req, res) => {
  try {
    let { workId, userId } = req.query;
    const _filter = {
      work: workId,
      creator: userId,
      status: {
        $in: [1, 2]
      },
    };
    const list = await ReplyStatusModel.find(_filter);
    res.send({
      code: 0,
      message: "获取成功",
      data: list,
    });
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

// 获取某条回复的点赞 点踩数量
router.get("/getStatusById", async (req, res) => {
  try {
    const { id, } = req.query;
    const likeCount = await ReplyStatusModel.count({
      target: id,
      status: 1,
    });
    const disLikeCount = await ReplyStatusModel.count({
      target: id,
      status: 2,
    });
    const data = {
      [id]: {
        like: likeCount,
        disLike: disLikeCount,
      }
    }
    res.send({
      code: 0,
      message: "获取成功",
      data,
    });
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

module.exports = router;
