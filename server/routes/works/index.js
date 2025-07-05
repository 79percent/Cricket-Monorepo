/**
 * 作品
 */
const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const formidable = require("formidable");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const sizeOf = require("image-size");
const nodejieba = require("nodejieba");
const {
  WorksModel,
  WorksItemModel,
  UsersModel,
  TagsModel,
  FavoritesItemsModel,
  PraiseStatusModel,
  CommentsModel,
  ReplysModel,
} = require("../../db/models");
const {
  checkToken,
  createFilter,
  generateHash,
  filepath2url,
  url2filepath,
  filterEmpty,
  isSupportImgType,
  generateImgFileName,
  delay,
} = require("../../utils/utils");
const { illustrationsPath } = require("../../utils/config");
const { getPraiseCount, getFavoriteCount } = require("./utils");
const sendEmail = require("../../utils/sendMail");
const lodash = require("lodash");

const task = async () => {
  const count = await WorksModel.count({
    status: "0",
  });
  if (Number(count) > 0) {
    sendEmail(
      {
        user: "per8695@163.com",
        pass: "DNZUSUDRHXRSIUCF",
      },
      {
        from: '"Cricket" <per8695@163.com>',
        to: "per7614@163.com, per8695@163.com",
        subject: "系统邮件 - 审核提醒",
        text: `审核提醒`,
        html: `<p>还有新的投稿未审核，快去后台看看吧！</p>`,
      }
    );
  }
};

/**
 * 每隔1小时判断有无待审核图片，有就发送邮件提醒去审核
 */
setInterval(() => {
  task();
}, 1000 * 60 * 60); // 1h

const router = express.Router();

// 新增
router.post("/add", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const Timestamp = moment().valueOf();
      const form = formidable({
        uploadDir: illustrationsPath,
        keepExtensions: true,
      });
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            next(err);
            return;
          }
          const entries = Object.entries(files);
          if (entries.length === 0) {
            res.send({ code: 1, message: "请上传图片", data: null });
            return;
          }
          if (entries.some(([key, work]) => !isSupportImgType(work.mimetype))) {
            entries.forEach(([key, work]) => {
              try {
                fs.unlinkSync(work.filepath);
              } catch (error) { }
            });
            res.send({ code: 1, message: "存在不符合格式的图片", data: null });
            return;
          }
          // 先把图片items保存到数据库
          const pArr = [];
          const worksList = entries.map(([key, work], index) => {
            const originFilePath = work.filepath;
            const [urlWebp, urlOrigin] = generateImgFileName(originFilePath);
            const [urlMinWebp, urlMinOrigin] = generateImgFileName(
              originFilePath,
              {
                resize: "@min",
              }
            );
            const url = filepath2url(urlWebp);
            const urlMin = filepath2url(urlMinWebp);
            const { width, height } = sizeOf(originFilePath);
            pArr.push(
              sharp(originFilePath, { animated: true }).toFile(urlWebp),
              sharp(originFilePath, { animated: true }).toFile(urlOrigin),
              sharp(originFilePath, { animated: true })
                .resize(240)
                .toFile(urlMinWebp),
              sharp(originFilePath, { animated: true })
                .resize(240)
                .toFile(urlMinOrigin)
            );
            return {
              url,
              urlMin,
              imgWidth: width,
              imgHeight: height,
              createTime: Timestamp,
              updateTime: Timestamp,
            };
          });
          await Promise.all(pArr);
          entries.forEach(([key, work]) => {
            try {
              fs.unlinkSync(work.filepath);
            } catch (error) { }
          });
          const imgs = await WorksItemModel.insertMany(worksList);
          // 再保存works
          const { content = "", tags = "", title = "" } = fields;
          const tagsArr = tags.split(",");
          const doc = await WorksModel.insertMany({
            imgs: imgs.map((item) => item._id),
            tags: tagsArr,
            title,
            content,
            creator: userId,
            creatorId: userId,
            createTime: Timestamp,
            updateTime: Timestamp,
          });
          const tagsList = tagsArr.map((tag) => ({
            text: tag,
            createTime: Timestamp,
            updateTime: Timestamp,
            creator: userId,
            creatorId: userId,
          }));
          await TagsModel.insertMany(tagsList).catch((err) => {
            return err;
          });
          res.send({ code: 0, message: "上传成功", data: null });
        } catch (error) {
          const entries = Object.entries(files);
          entries.forEach(([key, work]) => {
            try {
              fs.unlinkSync(work.filepath);
            } catch (error) { }
          });
          next(error);
        }
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    next(error);
  }
});

// 管理员发布作品
router.post("/admin/add", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, isAdmin } = await checkToken(token);
    if (isAdmin) {
      const Timestamp = moment().valueOf();
      const form = formidable({
        uploadDir: illustrationsPath,
        keepExtensions: true,
      });
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            next(err);
            return;
          }
          const entries = Object.entries(files);
          if (entries.length === 0) {
            res.send({ code: 1, message: "请上传图片", data: null });
            return;
          }
          if (entries.some(([key, work]) => !isSupportImgType(work.mimetype))) {
            entries.forEach(([key, work]) => {
              try {
                fs.unlinkSync(work.filepath);
              } catch (error) { }
            });
            res.send({ code: 1, message: "存在不符合格式的图片", data: null });
            return;
          }
          // 先把图片items保存到数据库
          const pArr = [];
          const worksList = entries.map(([key, work], index) => {
            const originFilePath = work.filepath;
            const [urlWebp, urlOrigin] = generateImgFileName(originFilePath);
            const [urlMinWebp, urlMinOrigin] = generateImgFileName(
              originFilePath,
              {
                resize: "@min",
              }
            );
            const url = filepath2url(urlWebp);
            const urlMin = filepath2url(urlMinWebp);
            const { width, height } = sizeOf(originFilePath);
            pArr.push(
              sharp(originFilePath, { animated: true }).toFile(urlWebp),
              sharp(originFilePath, { animated: true }).toFile(urlOrigin),
              sharp(originFilePath, { animated: true })
                .resize(240)
                .toFile(urlMinWebp),
              sharp(originFilePath, { animated: true })
                .resize(240)
                .toFile(urlMinOrigin)
            );
            return {
              url,
              urlMin,
              imgWidth: width,
              imgHeight: height,
              createTime: Timestamp,
              updateTime: Timestamp,
            };
          });
          await Promise.all(pArr);
          entries.forEach(([key, work]) => {
            try {
              fs.unlinkSync(work.filepath);
            } catch (error) { }
          });
          const imgs = await WorksItemModel.insertMany(worksList);
          // 再保存works
          const { content = "", tags = "", title = "", creator } = fields;
          const tagsArr = tags.split(",");
          const doc = await WorksModel.insertMany({
            imgs: imgs.map((item) => item._id),
            tags: tagsArr,
            title,
            content,
            creator,
            creatorId: creator,
            createTime: Timestamp,
            updateTime: Timestamp,
          });
          const tagsList = tagsArr.map((tag) => ({
            text: tag,
            createTime: Timestamp,
            updateTime: Timestamp,
            creator,
            creatorId: creator,
          }));
          await TagsModel.insertMany(tagsList).catch((err) => {
            return err;
          });
          res.send({ code: 0, message: "上传成功", data: null });
        } catch (error) {
          const entries = Object.entries(files);
          entries.forEach(([key, work]) => {
            try {
              fs.unlinkSync(work.filepath);
            } catch (error) { }
          });
          next(error);
        }
      });
    } else {
      throw new Error("无权限");
    }
  } catch (error) {
    next(error);
  }
});

// 根据id获取详情
router.get("/getDetail", async (req, res, next) => {
  try {
    const { id } = req.query;
    const data = await WorksModel.findById(id)
      .populate({
        path: "creator",
        select: "name avatar avatarMin",
      })
      .populate({
        path: "imgs",
        select: "url urlMin imgWidth imgHeight",
      });
    if (data) {
      res.send({
        code: 0,
        data,
        message: "获取成功",
      });
    } else {
      res.send({
        code: 1,
        data: null,
        message: "获取失败",
      });
    }
  } catch (error) {
    next(error);
  }
});

// 根据id获取点赞数、评论数、收藏数
router.get("/getStatistics", async (req, res, next) => {
  try {
    const { workId } = req.query;
    const praiseCount = await PraiseStatusModel.count({
      target: workId,
      status: 1,
    });
    const favoriteCount = await FavoritesItemsModel.count({
      work: workId,
      status: 1,
    });
    const commentCount = await CommentsModel.count({
      target: workId,
    });
    const replyCount = await ReplysModel.count({
      target: workId,
    });
    res.send({
      code: 0,
      data: {
        praise: praiseCount,
        favorite: favoriteCount,
        comment: commentCount + replyCount,
      },
      message: "获取成功",
    });
  } catch (error) {
    next(error);
  }
});

// 获取列表 支持分页和条件查询
router.get("/getWorkList", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isAdmin } = await checkToken(token);
    const statusFilterMap = {
      0: "0",
      1: "1",
      2: "2",
      all: undefined,
      s: {
        $in: ["0", "1"],
      },
    };
    let {
      current = 1,
      pageSize = 10,
      keyword = "",
      userId = "", // 创建人
      sort = -1, // 排序
      statistics = "1", // 是否需要统计 1 需要
      status = "s",
      id,
    } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    sort = Number(sort);
    let total = 0; //总数
    let totalPage = 0; //总页数
    const skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = createFilter(
      keyword,
      ["content", "tags", "title"],
      filterEmpty({
        creator: userId,
        status: statusFilterMap[status] || {
          $in: ["0", "1"],
        },
        _id: isAdmin ? id : undefined,
      })
    );
    const docCount = await WorksModel.count(_filter);
    total = docCount;
    totalPage = Math.ceil(total / pageSize);
    const list = await WorksModel.find(_filter)
      .limit(pageSize)
      .sort({ createTime: sort })
      .skip(skipCount)
      .populate({
        path: "creator",
        select: "name avatar avatarMin",
      })
      .populate({
        path: "imgs",
        select: "url urlMin imgWidth imgHeight",
      });
    let praiseCount = {},
      favoriteCount = {};
    if (String(statistics) === "1") {
      praiseCount = await getPraiseCount(list);
      favoriteCount = await getFavoriteCount(list);
    }
    res.send({
      code: 0,
      data: {
        list,
        praiseCount,
        favoriteCount,
      },
      message: "获取成功",
      total,
      totalPage,
      current,
      pageSize,
    });
  } catch (error) {
    next(error);
  }
});

// 相关推荐 支持分页和条件查询
router.get("/getRecommend", async (req, res, next) => {
  try {
    let { current = 1, pageSize = 10, id } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    let total = 0; //总数
    let totalPage = 0; //总页数
    const skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const originWork = await WorksModel.findById(id);
    if (!originWork) {
      res.send({
        code: 1,
        message: "获取失败",
      });
      return;
    }
    const { tags, content, title } = originWork;
    // 相似标签、相似内容
    const _filter = {
      status: {
        $in: ["0", "1"],
      },
      _id: {
        $ne: id,
      },
      $or: [
        {
          tags: {
            $in: tags, // 满足其中一个元素的数据
          },
        },
      ],
    };
    if (content) {
      const cuts = nodejieba.cut(content);
      const reg = new RegExp(cuts.join("|"));
      _filter.$or.push({
        content: {
          $regex: reg,
          $options: "$i",
        },
      });
    }
    if (title) {
      const cuts = nodejieba.cut(title);
      const reg = new RegExp(cuts.join("|"));
      _filter.$or.push({
        title: {
          $regex: reg,
          $options: "$i",
        },
      });
    }
    const docCount = await WorksModel.count(_filter);
    total = docCount;
    totalPage = Math.ceil(total / pageSize);
    const list = await WorksModel.find(_filter)
      .limit(pageSize)
      .sort({ createTime: -1 })
      .skip(skipCount)
      .populate({
        path: "creator",
        select: "name avatar avatarMin",
      })
      .populate({
        path: "imgs",
        select: "url urlMin imgWidth imgHeight",
      });
    res.send({
      code: 0,
      data: list,
      message: "获取成功",
      total,
      totalPage,
      current,
      pageSize,
      _filter,
    });
  } catch (error) {
    next(error);
  }
});

// 相关作者其他作品 支持分页和条件查询
router.get("/getOther", async (req, res, next) => {
  try {
    let { current = 1, pageSize = 10, id } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    let total = 0; //总数
    let totalPage = 0; //总页数
    const skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const originWork = await WorksModel.findById(id);
    if (!originWork) {
      res.send({
        code: 1,
        message: "获取失败",
      });
      return;
    }
    const { tags, content, title, creator } = originWork;
    const _filter = {
      status: {
        $in: ["0", "1"],
      },
      _id: {
        $ne: id,
      },
      $or: [
        {
          creator,
        },
        {
          tags: {
            $in: tags,
          },
        },
      ],
    };
    if (content) {
      const cuts = nodejieba.cut(content);
      const reg = new RegExp(cuts.join("|"));
      _filter.$or.push({
        content: {
          $regex: reg,
          $options: "$i",
        },
      });
    }
    if (title) {
      const cuts = nodejieba.cut(title);
      const reg = new RegExp(cuts.join("|"));
      _filter.$or.push({
        title: {
          $regex: reg,
          $options: "$i",
        },
      });
    }
    const docCount = await WorksModel.count(_filter);
    total = docCount;
    totalPage = Math.ceil(total / pageSize);
    const data = await WorksModel.find(_filter)
      .limit(pageSize)
      .sort({ createTime: -1 })
      .skip(skipCount)
      .populate({
        path: "creator",
        select: "name avatar avatarMin",
      })
      .populate({
        path: "imgs",
        select: "url urlMin imgWidth imgHeight",
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
  } catch (error) {
    next(error);
  }
});

// 删除
router.post("/delete", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, isAdmin } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const idArr = Array.isArray(id) ? id : [id];
      const _filter = {
        _id: {
          $in: idArr,
        },
      };
      if (!isAdmin) {
        _filter.creator = userId;
      }
      const list = await WorksModel.find(_filter).populate({
        path: "imgs",
        select: "url urlMin _id",
      });
      // 删除图片文件
      const itemIdArr = list
        .map((item) => {
          const { imgs = [] } = item;
          imgs.forEach((img) => {
            const { url, urlMin } = img;
            const urlPath = url2filepath(url);
            const urlMinPath = url2filepath(urlMin);
            try {
              fs.unlinkSync(urlPath);
              fs.unlinkSync(urlMinPath);
            } catch (error) {
              console.log(error);
            }
          });
          return imgs;
        })
        .flat(Infinity)
        .map((item) => item._id);
      const itemDoc = await WorksItemModel.deleteMany({
        _id: {
          $in: itemIdArr,
        },
      });
      const doc = await WorksModel.deleteMany(_filter);
      if (doc) {
        res.send({ code: 0, message: "删除成功!", data: doc });
      } else {
        res.send({ code: 1, message: "删除失败", data: null });
      }
    } else {
      res
        .status(401)
        .send({ code: 1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    next(error);
  }
});

// 删除
router.post("/delete/item", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      /**
       * id: work ID
       * itemId: imgItem ID
       */
      const { id, itemId } = req.body;
      const idArr = Array.isArray(itemId) ? itemId : [itemId];
      const _filter = {
        _id: id,
        creator: userId,
      };
      const _filter2 = {
        _id: {
          $in: idArr,
        },
      };
      const work = await WorksModel.findOne(_filter);
      const { imgs } = work;
      if (
        !idArr.every((item) => imgs.some((i) => String(i) === String(item)))
      ) {
        throw new Error("id不存在");
      }
      const list = await WorksItemModel.find(_filter2);
      // 删除图片文件
      list.forEach((img) => {
        const { url, urlMin } = img;
        const urlPath = url2filepath(url);
        const urlMinPath = url2filepath(urlMin);
        try {
          fs.unlinkSync(urlPath);
          fs.unlinkSync(urlMinPath);
        } catch (error) {
          console.log(error);
        }
      });
      const itemDoc = await WorksItemModel.deleteMany(_filter2);
      const newImgs = [];
      imgs.forEach((item) => {
        if (!idArr.some((i) => String(i) === String(item))) {
          newImgs.push(item);
        }
      });
      let doc;
      if (newImgs.length > 0) {
        doc = await WorksModel.updateOne(_filter, {
          imgs: newImgs,
        });
      } else {
        doc = await WorksModel.deleteOne(_filter);
      }
      if (doc) {
        res.send({ code: 0, message: "删除成功!", data: doc });
      } else {
        res.send({ code: 1, message: "删除失败", data: null });
      }
    } else {
      res
        .status(401)
        .send({ code: 1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    next(error);
  }
});

// 审核
router.post("/audit", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, isAdmin } = await checkToken(token);
    if (isAdmin) {
      const { id, status, reason } = req.body;
      const idArr = Array.isArray(id) ? id : [id];
      const _filter = {
        _id: {
          $in: idArr,
        },
      };
      const Timestamp = moment().valueOf();
      const doc = await WorksModel.updateMany(_filter, {
        reason: status === "2" ? reason : "",
        status,
        updateTime: Timestamp,
      });
      res.send({
        code: 0,
        message: "操作成功",
        data: doc,
      });
    } else {
      res.send({ code: 1, message: "无权限，操作失败", data: null });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
