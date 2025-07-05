/**
 * 网站访问量
 */
const express = require("express");
const moment = require("moment");
const { BuriedPointModel, FeedbacksModel } = require("../../db/models");
const {
  checkToken,
  createFilter,
  getClientIp,
  matchLocation,
} = require("../../utils/utils");
var parser = require("ua-parser-js");

const router = express.Router();

// IP归属地缓存
const ipLocationMap = new Map();

// 新增
router.get("/add", async (req, res) => {
  try {
    const { resolution, loadTime } = req.query;
    const { host, origin, referer } = req.headers;
    const userAgent = req.headers["user-agent"];
    const createTime = moment(req._startTime).valueOf();
    const ip = getClientIp(req);
    const ua = parser(userAgent);
    const { browser, engine, os, device } = ua;
    const browserInfo = `浏览器：${browser.name || ""} ${
      browser.version ? "v" + browser.version : ""
      }`;
    const engineInfo = `引擎：${engine.name || ""} ${
      engine.version ? "v" + engine.version : ""
      }`;
    const osInfo = `系统：${os.name || ""} ${
      os.version ? "v" + os.version : ""
      }`;
    const deviceInfo = `设备：${device.type || ""} ${device.vendor || ""} ${
      device.model || ""
      }`;
    // 合并
    const joinDevice = `${browserInfo}\n${engineInfo}\n${osInfo}\n${deviceInfo}`;
    let location = '';
    if (ipLocationMap.get(ip)) {
      location = ipLocationMap.get(ip);
    } else {
      location = await matchLocation(ip);
      ipLocationMap.set(ip, location);
    }
    const doc = await BuriedPointModel.create({
      createTime,
      loadTime: Number(loadTime),
      ip,
      location,
      host,
      origin,
      referer,
      userAgent,
      resolution,
      device: joinDevice,
    });
    if (doc) {
      res.send({
        code: 0,
        message: "保存成功",
      });
    } else {
      res.send({ code: 1, message: "保存失败" });
    }
  } catch (error) {
    res.send({ code: 1, message: "保存失败" });
  }
});

// 获取列表 支持分页和条件查询
router.get("/getTraffic", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user, isAdmin } = await checkToken(token);
    if (isAdmin) {
      let { current = 1, pageSize = 10 } = req.query;
      current = Number(current);
      pageSize = Number(pageSize);
      let total = 0; //总数
      let totalPage = 0; //总页数
      let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
      const _filter = {};
      const doc = await BuriedPointModel.count(_filter);
      if (typeof doc === "number") {
        total = doc;
        totalPage = Math.ceil(doc / pageSize);
        const data = await BuriedPointModel.find(_filter)
          .limit(pageSize) // 最多显示pageSize条
          .sort({ createTime: -1 }) // 倒序
          .skip(skipCount); //分页跳过条数
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
      res.status(401).send({ code: -1, message: "获取失败" });
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
      const doc = await BuriedPointModel.findByIdAndDelete(id);
      if (doc) {
        res.send({ code: 0, message: "删除成功!" });
      } else {
        res.send({ code: 1, message: "删除失败" });
      }
    } else {
      res.status(401).send({ code: 1, message: "删除失败" });
    }
  } catch (error) {
    res.send({ code: 1, message: "删除失败" });
  }
});

module.exports = router;
