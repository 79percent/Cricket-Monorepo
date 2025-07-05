const JwtUtil = require("./jwt");
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const os = require("os");
const { isDevelopment } = require("./config");
const fs = require("fs");
const sharp = require("sharp");
const axios = require("axios");

/**
 * 检查token返回userId
 */
const checkToken = async (token) => {
  const { UsersModel } = require("../db/models");
  try {
    const jwt = new JwtUtil({ token });
    const userId = await jwt.verifyToken();
    if (!userId) {
      throw new Error("没有权限");
    }
    let isLogin = false,
      isAdmin = false;
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw new Error("没有找到用户");
    }
    isLogin = true;
    // 是否为管理员
    if (user.authority === "1") {
      isAdmin = true;
    }
    return {
      isAdmin,
      isLogin,
      userId,
      user,
    };
  } catch (error) {
    return {
      isAdmin: false,
      isLogin: false,
      userId: null,
      user: null,
    };
  }
};

/**
 * 过滤对象中值为undefined、null、''
 * @param {*} obj
 * @returns
 */
function filterEmpty(obj) {
  const entries = Object.entries(obj);
  const data = {};
  entries.forEach((item) => {
    const [key, value] = item;
    if (value !== undefined && value !== null && value !== "") {
      data[key] = value;
    }
  });
  return data;
}

/**
 * 对id去重
 * @param {*} arr
 */
function deWeightId(arr = []) {
  const newArr = [];
  arr.forEach((item) => {
    const id = String(item);
    const findIndex = newArr.findIndex((item2) => String(item2) === id);
    if (findIndex === -1) {
      newArr.push(id);
    }
  });
  return newArr;
}

/**
 * 生成关键字模糊查询和条件查询的_filter
 * @param {*} keyword string 关键字
 * @param {*} searchFields string[] 需要匹配的字段
 * @param {*} filter {} 精确查询的字段
 */
const createFilter = (keyword = "", searchFields = [], filter = {}) => {
  const _filter = {};
  if (keyword) {
    _filter["$or"] = [];
    for (let index = 0; index < searchFields.length; index++) {
      const field = searchFields[index];
      _filter["$or"].push({
        [field]: {
          $regex: keyword,
          $options: "$i",
        },
      });
    }
  }
  // 是否精确查询
  const entries = Object.entries(filter);
  if (entries.length > 0) {
    // _filter["$and"] = [];
    for (let index = 0; index < entries.length; index++) {
      const [key, value] = entries[index];
      _filter[key] = value;
      // if (value) {
      // _filter["$and"].push({
      //   [key]: {
      //     $regex: value,
      //     $options: "$i",
      //   },
      // });
      // }
    }
  }
  return _filter;
};

/**
 * 密码md加密
 */
function generateHash(password = "") {
  const md5 = crypto.createHash("md5");
  const hash = md5.update(password).digest("hex");
  return hash;
}

/**
 * 将本地路径转换为服务器路径
 */
function filepath2url(filePath) {
  const fpSplit = filePath.split(isDevelopment ? "test" : "static");
  const url = `/static${fpSplit[fpSplit.length - 1]}`.replace(/\\/g, "/");
  return removeImgFileExtension(url);
}

/**
 * 将服务器路径转换为本地路径
 */
function url2filepath(url) {
  let p = url.split("/static");
  p = p[p.length - 1];
  return path.join(
    __dirname,
    isDevelopment ? `../public/test${p}` : `../public/static${p}`
  );
}

/**
 * 获取本机ip
 * @returns
 */
function getIPAdress() {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

/**
 * 延迟函数
 * @param time
 * @returns
 */
function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
}

/**
 * 重命名文件名，去除中间小数点
 * @param {*} fname
 * a.png -> a.png
 * a.png.resize.webp -> apngresize.webp
 */
function renameImgFileName(fname) {
  const splitArr = fname.split(".");
  const extension = splitArr.pop();
  return [splitArr.join(""), extension].join(".");
}

/**
 * 去除文件名后缀
 * @param {*} fname
 * a.png -> a
 * a.png.resize.webp -> a.png.resize
 */
function removeImgFileExtension(fname) {
  const splitArr = fname.split(".");
  splitArr.pop();
  return splitArr.join(".");
}

/**
 * 根据url移除图片
 */
function unlinkUrlFile(url) {
  const filePath = url2filepath(url);
  const dirPath = path.resolve(filePath, "../");
  let fileNameFront = filePath.split(dirPath).join("");
  fileNameFront = fileNameFront.slice(1, fileNameFront.length);
  fs.readdir(dirPath, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    data.forEach((file) => {
      const arr = file.split(".");
      arr.pop();
      const file_front = arr.join(".");
      if (file_front === fileNameFront) {
        const realPath = path.join(dirPath, file);
        fs.unlinkSync(realPath);
      }
    });
  });
}

/**
 * 支持的图片格式
 */
const mimetypes = "image/jpeg, image/webp, image/gif, image/png";
/**
 * 图片格式后缀map
 */
const mimetypeExtensionMap = {
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/png": "png",
};
/**
 * 判断图片格式是否支持
 * @param {*} type
 */
function isSupportImgType(type) {
  return mimetypes.includes(type);
}

/**
 * 生成图片文件名
 * @returns [webp, 原格式]
 */
function generateImgFileName(filepath, options = {}) {
  const { resize } = options;
  let extension = "";
  if (filepath.includes(".")) {
    const arr = filepath.split(".");
    if (arr.length > 1) {
      extension = arr.pop(); // 原始扩展名
    }
  }
  if (extension.toLocaleLowerCase() === "webp") {
    extension = "jpg";
  }
  extension = extension ? `.${extension}` : "";
  const replaceFilepath = filepath.replace(/\./g, "_"); // a.jpg -> a_jpg
  const resizeStr = Array.isArray(resize)
    ? `_@${resize[0]}x${resize[1]}`
    : typeof resize === "string"
      ? `_${resize}`
      : "";
  let fileWebp = `${replaceFilepath}${resizeStr}.webp`;
  let fileOrigin = `${replaceFilepath}${resizeStr}${extension}`;
  return [fileWebp, fileOrigin];
}

/**
 * 从请求中获取客户端IP
 */
function getClientIp(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    "";
  const matchIp = ip.match(/\d+.\d+.\d+.\d+/);
  return matchIp ? matchIp.join(".") : null;
}

/**
 * 从html中匹配归属地
 * @param {string} html
 */
function matchLoaction4Html(html = "", host) {
  let reg, matchArr;

  switch (host) {
    case "https://www.ipshudi.com/":
      reg = /(<span>).*(<\/span>)/g;
      matchArr = html.match(reg)
      if (matchArr.length > 0) {
        function getText(code) {
          let arr = code.split('<span>')
          let _code = arr[1];
          arr = _code.split('</span>');
          return arr[0];
        }
        let [_, html1, html2] = matchArr;
        return `${getText(html1)} ${getText(html2)}`;
      }
      return '';

    // 服务已挂
    case "https://www.ip.cn/ip/":
      reg = /(<div id=\"tab0_address\">).*?(<\/div>)/g;
      matchArr = html.match(reg)
      if (matchArr.length > 0) {
        let htmlStr = matchArr[0];
        let splitArr = htmlStr.split('>');
        splitArr.shift();
        splitArr.pop();
        htmlStr = splitArr[0];

        splitArr = htmlStr.split('<');
        splitArr.pop();
        return splitArr[0];
      }
      return '';

    default:
      break;
  }
}

/**
 * 查询IP归属地
 * @param {string} ip
 * @returns {Promise}
 */
function matchLocation(ip) {
  // console.log('获取IP归属地: https://www.ip.cn/ip/' + ip + '.html')
  // return axios('https://www.ip.cn/ip/' + ip + '.html').then((res) => {
  const host = "https://www.ipshudi.com/"
  const end = '.htm';
  const url = host + ip + end;
  // console.log(url);
  return axios(url, {
    timeout: 2000,
  }).then(
    (res) => {
      const { status, data } = res;
      // console.log(status, data);
      if (status === 200) {
        return matchLoaction4Html(data, host);
      }
      return "";
    },
    () => {
      return "";
    }
  );
}

module.exports = {
  mimetypes,
  mimetypeExtensionMap,
  isSupportImgType,
  generateImgFileName,
  checkToken,
  filterEmpty,
  deWeightId,
  createFilter,
  generateHash,
  filepath2url,
  url2filepath,
  getIPAdress,
  delay,
  renameImgFileName,
  removeImgFileExtension,
  unlinkUrlFile,
  getClientIp,
  matchLocation,
};
