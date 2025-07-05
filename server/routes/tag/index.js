/**
 * 分类标签
 */
const express = require("express");
const moment = require("moment");
const { TagsModel } = require("../../db/models");
const { checkToken, createFilter } = require("../../utils/utils");

const router = express.Router();

// 新增
router.post("/add", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { text } = req.body;
      if (text) {
        const Timestamp = moment().valueOf();
        const doc = await TagsModel.create({
          text,
          createTime: Timestamp,
          updateTime: Timestamp,
          creator: userId,
          creatorId: userId,
        });
        res.send({ code: 0, message: "创建成功", data: doc });
      } else {
        res.send({ code: 1, message: "创建失败" });
      }
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "创建失败" });
  }
});

// 修改信息
router.post("/update", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { id, text } = req.body;
      const Timestamp = new Date().valueOf();
      const doc = await TagsModel.findOneAndUpdate(
        { _id: id, creator: userId },
        {
          updateTime: Timestamp,
          text,
        }
      );
      if (doc) {
        res.send({ code: 0, message: "修改成功" });
      } else {
        res.send({ code: 1, message: "修改失败" });
      }
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "修改失败" });
  }
});

// 获取列表 支持分页和条件查询
router.get("/getTagList", async (req, res) => {
  try {
    let { current = 1, pageSize = 10, keyword = "" } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = createFilter(keyword, ["text"]);
    const doc = await TagsModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const data = await TagsModel.find(_filter)
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
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

// 删除
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const doc = await TagsModel.findByIdAndDelete(id);
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

module.exports = router;
