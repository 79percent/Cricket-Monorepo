/**
 * 收藏作品到收藏夹
 */
const express = require("express");
const { checkToken } = require("../../utils/utils");
const {
  FavoritesModel,
  FavoritesItemsModel,
  WorksModel,
} = require("../../db/models");

const router = express.Router();

// 创建
router.post("/add", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      const Timestamp = new Date().valueOf();
      let { favoriteId, workId } = req.body;
      const favoriteIdArr = favoriteId;
      await FavoritesItemsModel.updateMany(
        {
          creator: userId,
          work: workId,
        },
        {
          status: 0,
          updateTime: Timestamp,
        }
      );
      const addFavoriteItems = () => {
        return new Promise((resolve, reject) => {
          let count = 0;
          if (favoriteIdArr.length === 0) {
            resolve(favoriteIdArr.length);
            return;
          }
          favoriteIdArr.forEach(async (item) => {
            try {
              const favoriteItem = await FavoritesItemsModel.findOne({
                creator: userId,
                work: workId,
                favorite: item,
              });
              if (favoriteItem) {
                await FavoritesItemsModel.findByIdAndUpdate(favoriteItem._id, {
                  status: 1,
                  updateTime: Timestamp,
                });
                count++;
              } else {
                const favorite = await FavoritesModel.findById(item);
                if (!favorite) {
                  reject("找不到收藏夹");
                  return;
                }
                const work = await WorksModel.findById(workId);
                if (!work) {
                  reject("找不到作品");
                  return;
                }
                const doc = await FavoritesItemsModel.create({
                  createTime: Timestamp,
                  updateTime: Timestamp,
                  status: 1,
                  creator: userId,
                  work: workId,
                  favorite: item,
                  creatorId: userId,
                  workId: workId,
                  favoriteId: item,
                });
                count++;
              }
              if (count === favoriteIdArr.length) {
                resolve(favoriteIdArr.length);
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      };
      const count = await addFavoriteItems();
      res.send({
        code: 0,
        message: count === 0 ? "已取消收藏" : "收藏成功",
      });
    } else {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
    }
  } catch (error) {
    res.send({ code: 1, message: "收藏失败" });
  }
});

// 获取收藏夹下的作品列表
router.get("/getFavoriteItemsList", async (req, res) => {
  try {
    let { current = 1, pageSize = 10, favoriteId, id } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = {
      creator: id,
      status: 1,
    };
    if (favoriteId) {
      _filter["favorite"] = favoriteId;
    }
    const doc = await FavoritesItemsModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const list = await FavoritesItemsModel.find(_filter)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount)
        .populate({
          path: "work",
          populate: { path: 'imgs', select: "url urlMin imgWidth imgHeight", }
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

// 获取全部收藏作品Id
router.get("/getAllFavoriteItems", async (req, res) => {
  try {
    const { userId } = req.query;
    const _filter = {
      creator: userId,
      status: 1,
    };
    const list = await FavoritesItemsModel.find(_filter).sort({
      createTime: -1,
    });
    const workArr = list.map((item) => item.work);
    const data = [...new Set(workArr)];
    res.send({
      code: 0,
      message: "获取成功",
      data,
    });
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

// 获取作品被收藏至哪些收藏夹下
router.get("/getWorkFavorite", async (req, res) => {
  try {
    const { userId, workId } = req.query;
    if (!userId) {
      res
        .status(401)
        .send({ code: -1, message: "当前用户登录信息已失效，请重新登录！" });
      return;
    }
    const _filter = {
      creator: userId,
      work: workId,
      status: 1,
    };
    const list = await FavoritesItemsModel.find(_filter).sort({
      createTime: -1,
    });
    res.send({
      code: 0,
      message: "获取成功",
      data: list.map((item) => item.favorite),
    });
  } catch (error) {
    res.send({ code: 1, message: "获取失败" });
  }
});

// 移除收藏夹下的作品
router.post("/delete", async (req, res) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId, user } = await checkToken(token);
    if (isLogin) {
      const { id } = req.body;
      const doc = await FavoritesItemsModel.findOneAndDelete({
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

// 获取作品的收藏数
router.get("/getFavoritesCount", async (req, res) => {
  try {
    const { workId } = req.query;
    let count = await FavoritesItemsModel.count({
      work: workId,
      status: 1,
    });
    if (typeof count !== "number") {
      count = 0;
    }
    const data = {};
    data[workId] = count;
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
