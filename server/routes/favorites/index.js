/**
 * 收藏夹
 */
const express = require("express");
const { checkToken } = require("../../utils/utils");
const { FavoritesModel, FavoritesItemsModel } = require("../../db/models");

const router = express.Router();

// 创建
router.post("/add", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      let { content, title } = req.body;
      if (!title) {
        res.send({
          code: 1,
          message: "创建失败",
        });
        return;
      }
      const Timestamp = new Date().valueOf();
      const doc = await FavoritesModel.create({
        createTime: Timestamp,
        updateTime: Timestamp,
        content,
        title,
        creator: userId,
        creatorId: userId,
      });
      res.send({
        code: 0,
        message: "创建成功",
        data: doc,
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "创建失败" });
  }
});

// 修改
router.post("/update", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      let { id, content, title } = req.body;
      if (!id) {
        res.send({
          code: 1,
          message: "修改失败",
        });
        return;
      }
      if (!title) {
        res.send({
          code: 1,
          message: "修改失败",
        });
        return;
      }
      const Timestamp = new Date().valueOf();
      await FavoritesModel.findOneAndUpdate(
        {
          _id: id,
          creator: userId,
        },
        {
          updateTime: Timestamp,
          title,
          content,
        }
      );
      res.send({
        code: 0,
        message: "修改成功",
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "修改失败" });
  }
});

// 获取用户收藏夹列表
router.get("/getFavoritesList", async (req, res, next) => {
  try {
    let { current = 1, pageSize = 10, id = "" } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      creator: id,
    };
    const doc = await FavoritesModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await FavoritesModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount);
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
    next(error);
  }
});

// 获取用户收藏夹列表以及每个收藏夹下的作品
router.get("/getFavoritesListIllustrations", async (req, res, next) => {
  try {
    let { current = 1, pageSize = 10, id = "" } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      creator: id,
    };
    const doc = await FavoritesModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await FavoritesModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount);
      const queryWorks = (arr = []) => (new Promise((resolve, reject) => {
        try {
          const wkArr = [];
          arr.forEach(async (item, index) => {
            const { _id,
              createTime,
              updateTime,
              content,
              title,
              creator,
              creatorId,
            } = item;
            const illustrations = await FavoritesItemsModel.find({
              favorite: _id,
              status: 1,
            }).populate({
              path: "work",
              populate: { path: 'imgs', select: "url urlMin imgWidth imgHeight", }
            });
            wkArr.push({
              _id,
              createTime,
              updateTime,
              content,
              title,
              creator,
              creatorId,
              works: illustrations
            })
            if (wkArr.length === arr.length) {
              resolve(wkArr)
            }
          })
        } catch (error) {
          reject(error)
        }
      }))
      const data = await queryWorks(list);
      res.send({
        code: 0,
        message: "获取成功",
        data,
        list,
        total,
        totalPage,
        current,
        pageSize,
      });
    } else {
      res.send({ code: 1, message: "获取失败" });
    }
  } catch (error) {
    next(error);
  }
});

// 获取用户的所有收藏夹
router.get("/getAllFavorites", async (req, res) => {
  try {
    const { id = "" } = req.query;
    const _filter = {
      creator: id,
    };
    const list = await FavoritesModel.find(_filter).sort({
      createTime: -1,
    });
    // 获取每个收藏夹的收藏数量
    const getItemsCount = () => {
      return new Promise((resolve, reject) => {
        try {
          const map = {};
          if (list.length === 0) {
            resolve(map);
            return;
          }
          list.forEach(async (item, index) => {
            const { _id } = item;
            const count = await FavoritesItemsModel.count({
              favorite: _id,
              creator: id,
              status: 1,
            });
            if (typeof count === "number") {
              map[_id] = count;
            } else {
              map[_id] = 0;
            }
            if (list.length === Object.keys(map).length) {
              resolve(map);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    };
    const countMap = await getItemsCount();
    res.send({
      code: 0,
      message: "获取成功",
      data: {
        list,
        countMap,
      },
    });
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

// 删除收藏夹
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const doc = await FavoritesModel.findOneAndDelete({
        _id: id,
        creator: userId,
      });
      if (doc) {
        res.send({
          code: 0,
          message: "删除成功",
        });
      } else {
        res.send({
          code: 1,
          message: "删除失败",
        });
      }
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "删除失败" });
  }
});

module.exports = router;
