/**
 * 修改数据库
 * 图片url去除后缀
 */
const mongoose = require("mongoose");
const { prd_DB_URL, dev_DB_URL } = require("../utils/config");

/**
 * 判断当前脚本执行环境
 * @returns development | production
 */
function getENV() {
  let env = "development"; //
  const scriptParams = process.env.npm_lifecycle_script
    .split(" ")
    .map((item) => item.split("="));
  scriptParams.forEach(([key, value]) => {
    if (key.toLocaleLowerCase() === "env") {
      env = value;
    }
  });
  return env;
}

const dbUrl = getENV() === "production" ? prd_DB_URL : dev_DB_URL;

const UsersModel = mongoose.model("users", require("../db/schema/users"));
const WorksItemModel = mongoose.model(
  "works_item",
  require("../db/schema/works_item")
);

const extensions = "webp,jpg,jpeg,png,gif";

let doneUser = [],
  isDoneUser = false;
let doneWorkItems = [],
  isDoneWorkItems = false;

/**
 * 转换url格式 "." 改成 "_"
 * 一
 * /static/illustrations/92a609b229b21a339eb933801.png.@_min.webp
 * ->
 * /static/illustrations/92a609b229b21a339eb933801_png_@_min
 *
 * 二
 *  * /static/illustrations/92a609b229b21a339eb933801.png.@_min
 * ->
 * /static/illustrations/92a609b229b21a339eb933801_png_@_min
 * @param {*} url
 */
const url2New = (url) => {
  const splitArr = url.split(".");
  if (splitArr.length === 1) {
    return url;
  }
  const extension = splitArr[splitArr.length - 1];
  if (extensions.includes(extension)) {
    splitArr.pop();
  }
  return splitArr.join("_");
};

/**
 * 更新User
 */
const updateUser = () => {
  UsersModel.find({}, (err, list) => {
    list.forEach((user, index) => {
      let { _id, avatarMin, avatar, background } = user;
      // avatarMin
      avatarMin = url2New(avatarMin);
      // avatar
      avatar = url2New(avatar);
      // background
      background = url2New(background);
      UsersModel.findByIdAndUpdate(
        _id,
        {
          avatar,
          avatarMin,
          background,
        },
        (e, d) => {
          if (e) {
            console.log("更新 User 失败", _id);
            console.log(e);
            return;
          }
          doneUser.push(_id);
          isDoneUser = doneUser.length === list.length;
        }
      );
    });
  });
};

/**
 * 更新Work
 */
const updateWorkItems = () => {
  WorksItemModel.find({}, (err, list) => {
    list.forEach((work, index) => {
      let { _id, url, urlMin } = work;
      // url
      url = url2New(url);
      // urlMin
      urlMin = url2New(urlMin);
      WorksItemModel.findByIdAndUpdate(
        _id,
        {
          url,
          urlMin,
        },
        (e, d) => {
          if (e) {
            console.log("更新 WorksItemModel 失败", _id);
            console.log(e);
            return;
          }
          doneWorkItems.push(_id);
          isDoneWorkItems = doneWorkItems.length === list.length;
        }
      );
    });
  });
};

console.log("连接数据库 -> " + dbUrl);

// 1.连接数据库
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("数据库连接成功");
    console.log("...开始更新...");
    updateUser();
    updateWorkItems();
  })
  .catch((err) => console.log("数据库连接失败", err));

setInterval(() => {
  if (isDoneWorkItems && isDoneUser) {
    console.log("更新完成，退出进程");
    process.exit(0);
  } else {
    console.log("...更新中...");
  }
}, 1000);
