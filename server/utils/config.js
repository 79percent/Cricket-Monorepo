const os = require("os");
const path = require("path");

// 系统类别
const osType = os.type();
const isWindows = osType === "Windows_NT";
const isMac = osType === "Darwin";
const isLinux = osType === "Linux";

// 是否为开发模式
const isDevelopment = process.env.ENV === "development";

// 域名
const hostName = "127.0.0.1";

// 生成连接数据库url
const getDbURL = ({ host, port = 27017, userName, password, db }) => {
  return `mongodb://${host}:${port}/cricket`;
};

// 根据环境的数据库url
const dbUrl = getDbURL({
  host: hostName,
  port: 27017,
  db: "cricket",
});
// 静态资源存储目录
const staticPath = path.join(__dirname, "../public/static");
// 头像存储目录
const avatarPath = path.join(__dirname, "../public/static/avatar");
// 插画存储目录
const illustrationsPath = path.join(__dirname, "../public/static/illustrations");
// 个人空间背景存储目录
const backgroundPath = path.join(__dirname, "../public/static/background");

module.exports = {
  isWindows,
  isMac,
  isLinux,
  isDevelopment,
  dbUrl,
  staticPath,
  avatarPath,
  illustrationsPath,
  backgroundPath,
};
