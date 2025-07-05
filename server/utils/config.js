const os = require("os");
const path = require("path");

// 系统类别
const osType = os.type();
const isWindows = osType === "Windows_NT";
const isMac = osType === "Darwin";
const isLinux = osType === "Linux";

// 是否为开发模式
const isDevelopment = process.env.ENV === "development";

// 阿里云服务器ip
const ali_cloud_IP = "47.99.201.87";
// 腾讯云服务器ip
const tec_cloud_IP = "42.192.22.24";
// 域名
const hostName = "cricket.cab";
// 数据库用户名
const dbUserName = "cricket_admin";
// 数据库密码
const dbPassword = "cricket_666";
// 生成连接数据库url
const getDbURL = ({ host, port = 27017, userName, password, db }) => {
  return `mongodb://${userName}:${password}@${host}:${port}/${db}?authSource=admin&readPreference=primary&directConnection=true&ssl=false`;
};
// 开发环境db url
const dev_DB_URL = getDbURL({
  host: hostName,
  port: 27017,
  userName: dbUserName,
  password: dbPassword,
  db: "cricket_test",
});
// 生产环境db url
const prd_DB_URL = getDbURL({
  host: hostName,
  port: 27017,
  userName: dbUserName,
  password: dbPassword,
  db: "cricket",
});
// 根据环境的数据库url
const dbUrl = isDevelopment ? dev_DB_URL : prd_DB_URL;
// 静态资源存储目录
const staticPath = isDevelopment
  ? path.join(__dirname, "../public/test")
  : path.join(__dirname, "../public/static");
// 头像存储目录
const avatarPath = isDevelopment
  ? path.join(__dirname, "../public/test/avatar")
  : path.join(__dirname, "../public/static/avatar");
// 插画存储目录
const illustrationsPath = isDevelopment
  ? path.join(__dirname, "../public/test/illustrations")
  : path.join(__dirname, "../public/static/illustrations");
// 个人空间背景存储目录
const backgroundPath = isDevelopment
  ? path.join(__dirname, "../public/test/background")
  : path.join(__dirname, "../public/static/background");

module.exports = {
  isWindows,
  isMac,
  isLinux,
  isDevelopment,
  ali_cloud_IP,
  tec_cloud_IP,
  dbUrl,
  dev_DB_URL,
  prd_DB_URL,
  staticPath,
  avatarPath,
  illustrationsPath,
  backgroundPath,
};
