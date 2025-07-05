/**
 * 意见反馈
 */
const express = require("express");
const moment = require('moment');
const { FeedbacksModel } = require("../../db/models");
const { checkToken, createFilter } = require("../../utils/utils");
const sendEmail = require('../../utils/sendMail');

const router = express.Router();

// 新增
router.post("/add", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      const { content } = req.body;
      if (content) {
        const Timestamp = moment().valueOf();
        const doc = await FeedbacksModel.create({
          content,
          createTime: Timestamp,
          updateTime: Timestamp,
          creator: userId,
          creatorId: userId,
        });
        if (doc) {
          res.send({ code: 0, message: "提交成功", doc, show: true });
          const sendTime = moment().format('YYYY-MM-DD hh:mm:ss');
          const info = await sendEmail({
            user: "per8695@163.com",
            pass: "DNZUSUDRHXRSIUCF"
          }, {
            from: '"Cricket" <per8695@163.com>',
            to: 'per8695@163.com, per7614@163.com',
            subject: '系统邮件 - 用户意见反馈',
            text: '',
            html: `<p>${content}</p><p>发送时间: ${sendTime}</p><p>提交人: ${user.name}</p>`,
          })
        } else {
          res.send({ code: 1, message: "提交失败", show: true });
        }
      } else {
        res.send({ code: 1, message: "提交失败", show: true });
      }
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "提交失败", show: true });
  }
});

// 获取列表 支持分页和条件查询
router.get("/getFeedbackList", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user, isAdmin } = await checkToken(token);
    if (isAdmin) {
      let {
        current = 1,
        pageSize = 10,
      } = req.query;
      current = Number(current);
      pageSize = Number(pageSize);
      let total = 0; //总数
      let totalPage = 0; //总页数
      let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
      const _filter = {}
      const doc = await FeedbacksModel.count(_filter);
      if (typeof doc === "number") {
        total = doc;
        totalPage = Math.ceil(doc / pageSize);
        const data = await FeedbacksModel.find(_filter)
          .limit(pageSize) // 最多显示pageSize条
          .sort({ createTime: -1 }) // 倒序
          .skip(skipCount) //分页跳过条数
          .populate({
            path: "creator",
            select: "name avatar profile sex",
          });
        res.send({
          code: 0,
          data,
          message: "获取成功",
          total,
          totalPage,
          current,
          pageSize,
        });
      } else {
        res.send({ code: 1, message: "获取失败" });
      }
    } else {
      res
        .status(401)
        .send({ code: -1, message: "获取失败" });
    }
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

// 删除
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, isAdmin } = await checkToken(token);
    if (isAdmin) {
      const { id } = req.body;
      const doc = await FeedbacksModel.findByIdAndDelete(id);
      if (doc) {
        res.send({ code: 0, message: "删除成功!" });
      } else {
        res.send({ code: 1, message: "删除失败" });
      }
    } else {
      res
        .status(401)
        .send({ code: 1, message: "删除失败" });
    }
  } catch (error) {
    res.send({ code: 1, message: "删除失败" });
  }
});

module.exports = router;
