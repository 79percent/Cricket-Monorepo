/**
 * 将图片生成webp和其他原格式 2种格式
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 防止文件死锁
sharp.cache({ files: 0 });

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

const ignore = ".gitkeep"; // 忽略文件

let num = 0; // 文件数量

async function work(dirPath) {
  try {
    console.log(`正在处理目录 ${dirPath}`)
    // 同步读取文件
    let files = fs.readdirSync(dirPath);

    const pArr = [];

    files.forEach((fileName) => {
      const filePath = path.join(dirPath, fileName);
      const needIgnore = fileName.includes(ignore);
      if (fs.statSync(filePath).isFile() && !needIgnore) {
        try {
          // 文件名、后缀
          const [frontName, extension] = fileName.split('.');
          let newFileName, newFilePath;
          if (extension.toLocaleLowerCase() === 'webp') {
            // 如果是webp文件，则生成一个同名的jpg文件
            newFileName = `${frontName}.jpg`;
            newFilePath = path.join(dirPath, newFileName);
          } else {
            // 非webp文件，则生成一个同名的webp文件
            newFileName = `${frontName}.webp`;
            newFilePath = path.join(dirPath, newFileName);
          }
          pArr.push(sharp(filePath, { animated: true }).toFile(newFilePath))
          console.log(`${num}： 生成 ${newFileName}`);
        } catch (error) {
          console.log(`${num} ${fileName} 生成失败`);
          console.log(err);
        }
        num++;
      }
    });
    await Promise.all(pArr);
    console.log(`目录 ${dirPath} 处理完成`)
  } catch (error) {
    console.log(error);
  }
}

async function toDo() {
  await work(avatarPath);
  await work(illustrationsPath);
  await work(backgroundPath);
}

toDo();