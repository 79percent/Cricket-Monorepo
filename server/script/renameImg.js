/**
 * 批量图片重命名
 */
const fs = require("fs");
const path = require("path");

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

const isPrd = getENV() === "production";

// 文件目录判断
const avatarPath = isPrd
  ? path.join(__dirname, "../public/static/avatar")
  : path.join(__dirname, "../public/test/avatar"); // 头像存储目录
const illustrationsPath = isPrd
  ? path.join(__dirname, "../public/static/illustrations")
  : path.join(__dirname, "../public/test/illustrations"); // 插画存储目录
const backgroundPath = isPrd
  ? path.join(__dirname, "../public/static/background")
  : path.join(__dirname, "../public/test/background"); // 个人空间背景存储目录

/**
 * 转换文件名格式
 * 92a609b229b21a339eb933801.png.@_min.webp
 * ->
 * 92a609b229b21a339eb933801_png_@_min.webp
 * @param {*} fname
 */
const name2New = (fname) => {
  const splitArr = fname.split(".");
  const extension = splitArr.pop();
  return [splitArr.join("_"), extension].join(".");
};

const ignore = ".gitkeep"; // 忽略文件

let num = 0; // 文件数量

/**
 * 输入文件夹路径，修改所有图片
 * @param {} path
 * 92a609b229b21a339eb933801.png.@_min.webp
 * ->
 * 92a609b229b21a339eb933801_png_@_min.webp
 */
const work = (dirPath) => {
  // 同步读取文件
  let files = fs.readdirSync(dirPath);

  files.forEach((fileName) => {
    const filePath = path.join(dirPath, fileName);
    const needIgnore = fileName.includes(ignore);
    if (fs.statSync(filePath).isFile() && !needIgnore) {
      try {
        const newFileName = name2New(fileName);
        const newPath = path.join(dirPath, newFileName);
        fs.renameSync(filePath, newPath);
        console.log(`${num}： ${fileName} —> ${newFileName}`);
      } catch (error) {
        console.log(`${num} ${fileName} 转换失败`);
        console.log(err);
      }
      num++;
    }
  });
};

work(avatarPath);
work(illustrationsPath);
work(backgroundPath);
