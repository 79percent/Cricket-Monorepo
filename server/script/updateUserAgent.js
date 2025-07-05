/**
 * 更新userAgent信息
 */
const mongoose = require("mongoose");
const { prd_DB_URL, dev_DB_URL } = require("../utils/config");
var parser = require('ua-parser-js');

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

const BuriedPointModel = mongoose.model(
  "buried_point",
  require("../db/schema/buried_point")
);

console.log("连接数据库 -> " + dbUrl);

let isDone = false, done = [];

function update() {
  BuriedPointModel.find({}, (err, list) => {
    list.forEach((info, index) => {
      const { _id, userAgent } = info;
      const ua = parser(userAgent);
      const { browser, engine, os, device } = ua;
      // const browserInfo = `浏览器：${browser.name || ''} v${browser.version || ''}`;
      const browserInfo = `浏览器：${browser.name || ''} ${browser.version ? 'v' + browser.version : ''}`;
      const engineInfo = `引擎：${engine.name || ''} ${engine.version ? 'v' + engine.version : ''}`;
      const osInfo = `系统：${os.name || ''} ${os.version ? 'v' + os.version : ''}`;
      const deviceInfo = `设备：${device.type || ''} ${device.vendor || ''} ${device.model || ''}`;
      // 合并
      const joinDevice = `${browserInfo}\n${engineInfo}\n${osInfo}\n${deviceInfo}`;
      BuriedPointModel.findByIdAndUpdate(_id, {
        device: joinDevice
      }, (e, d) => {
        if (e) {
          console.log("更新 User 失败", _id);
          console.log(e);
          return;
        }
        done.push(_id);
        isDone = done.length === list.length;
      })
    })
  })
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("数据库连接成功");
    update();
  })
  .catch((err) => console.log("数据库连接失败", err));

setInterval(() => {
  if (isDone) {
    console.log("更新完成，退出进程");
    process.exit(0);
  } else {
    console.log("...更新中...");
  }
}, 1000);