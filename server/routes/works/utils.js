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

/**
 * 根据作品id arr[] 获取点赞数量 map{}
 * @param {*} list
 * @returns
 */
const getPraiseCount = async (list = []) => {
  const map = await new Promise((resolve, reject) => {
    try {
      const map = {};
      if (list.length === 0) {
        resolve(map);
        return;
      }
      list.forEach(async (item, index) => {
        const { _id } = item;
        const count = await PraiseStatusModel.count({
          target: _id,
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
  return map;
};

/**
 * 获取收藏数量
 * @returns 
 */
const getFavoriteCount = (list = []) => {
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
          work: _id,
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

module.exports = {
  getPraiseCount,
  getFavoriteCount,
};
