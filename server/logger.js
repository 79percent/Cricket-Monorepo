/**
 * 自定义日志
 */
const log4js = require("log4js"); // 加载log4js模块
const path = require("path");
const {getIPAdress} = require('./utils/utils');

const myIp = getIPAdress();

log4js.configure({
  appenders: {
    // 控制台输出
    console: { type: "console" },
    // 全部日志文件
    app: {
      type: "file",
      filename: path.join(__dirname, "./logs/app/logs"),
      maxLogSize: 1024 * 500, //一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: "_yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
    // 错误日志文件
    errorFile: {
      type: "file",
      filename: path.join(__dirname, "./logs/error/logs"),
      maxLogSize: 1024 * 500, // 一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: "_yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
  },
  categories: {
    // 默认日志，输出debug 及以上级别的日志
    default: {
      appenders: [
        "app",
        "console", // 不向控制台输出
      ],
      level: "info",
    },
    // 错误日志，输出error 及以上级别的日志
    error: { appenders: ["errorFile"], level: "error" },
  },
  replaceConsole: true, // 替换console.log
});

// 获取默认日志
const logger = log4js.getLogger();
// 获取错误级别日志
const errorLogger = log4js.getLogger("error");

const loggerInfo = (req, res, next) => {
  const {
    method,
    ip,
    ips,
    url,
    _remoteAddress,
    originalUrl,
    protocol,
    httpVersion,
    headers,
  } = req;
  const { referer, origin } = headers;
  const info = `${myIp} - ${method} - ${protocol}${httpVersion} - ${originalUrl} - ${referer} - ${_remoteAddress}`;
  logger.info(info);
  next();
};

const loggerError = (err, req, res, next) => {
  const {
    method,
    ip,
    ips,
    hostname,
    originalUrl,
    query,
    params,
    body,
    _remoteAddress,
    protocol,
    httpVersion,
    headers,
  } = req;
  const { referer, origin } = headers;
  const contentType = req.get("Content-Type");
  const info = `${err.message} - ${myIp} - ${method} - ${protocol}${httpVersion} - ${originalUrl} - ${referer} - ${_remoteAddress}`;
  errorLogger.error(info);
  next(err);
};

module.exports = {
  log4js,
  appLogger: logger,
  errorLogger,
  loggerInfo,
  loggerError,
};
