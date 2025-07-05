/**
 * 备份线上数据和图片
 * 1. 备份数据库cricket 到 cricket_test
 * 2. 备份服务器图片文件 到 本地项目
 */
const { exec, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const FTP = require("ftp");
const FTPS = require("ftps");
const { Client } = require("ssh2");
const ssh2fs = require("ssh2-fs");

/**
 * 删除文件夹
 * @param {*} filePath
 * @param {*} callback
 */
function rmdir(filePath, callback) {
  // 先判断当前filePath的类型(文件还是文件夹,如果是文件直接删除, 如果是文件夹, 去取当前文件夹下的内容, 拿到每一个递归)
  fs.stat(filePath, function (err, stat) {
    if (err) {
      callback();
      return;
    }
    if (stat.isFile()) {
      fs.unlink(filePath, callback);
    } else {
      fs.readdir(filePath, function (err, data) {
        if (err) return console.log(err);
        let dirs = data.map((dir) => path.join(filePath, dir));
        let index = 0;
        !(function next() {
          // 此处递归删除掉所有子文件 后删除当前 文件夹
          if (index === dirs.length) {
            fs.rmdir(filePath, callback);
          } else {
            rmdir(dirs[index++], next);
          }
        })();
      });
    }
  });
}

/**
 * 备份线上数据库
 */
function backupDB() {
  // 数据库备份目录
  const dumpDir = path.resolve(__dirname, "../db/dump");
  // 数据库cricket备份目录
  const cricketDumpDir = path.resolve(__dirname, "../db/dump/cricket");

  const mongodumpShell = [
    "mongodump",
    '--uri="mongodb://cricket_admin:cricket_666@cricket.cab:27017/cricket?authSource=admin&readPreference=primary&directConnection=true&ssl=false"',
    `--out=${dumpDir}`,
  ];

  const mongorestoreShell = [
    "mongorestore",
    '--uri="mongodb://cricket_admin:cricket_666@cricket.cab:27017/cricket_test?authSource=admin&readPreference=primary&directConnection=true&ssl=false"',
    "--drop",
    cricketDumpDir,
  ];

  exec(mongodumpShell.join(" "), (error, stdout, stderr) => {
    if (error) {
      console.log("数据库备份到本地失败");
      console.log(error);
      return;
    }
    console.log(`已备份数据库到本地${dumpDir}`);
    // 将数据库文件备份到cricket_test数据库
    exec(mongorestoreShell.join(" "), (error, stdout, stderr) => {
      if (error) {
        console.log("数据库备份到cricket_test失败");
        console.log(error);
        return;
      }
      console.log(`已备份数据库cricket到cricket_test`);
    });
  });
}

/**
 * 不需要删除旧文件，会替换文件夹
 */
// rmdir(dumpDir, () => {
//   console.log("已清除本地数据库");
//   backupDB();
// });
// backupDB();

/**
 * 备份服务器图片到本地
 */
function backupImg() {
  // const ftp = new FTP();
  // ftp.on("ready", function () {
  //   ftp.list(function (err, list) {
  //     if (err) throw err;
  //     console.dir(11, list);
  //     ftp.end();
  //   });
  // });
  // ftp.connect({
  //   host: "42.192.22.24",
  //   user: "root",
  //   password: "Gechaofeng7614",
  //   port: "22",
  // });

  // const ftps = new FTPS({
  //   host: "42.192.22.24", // required
  //   username: "root", // Optional. Use empty username for anonymous access.
  //   password: "Gechaofeng7614", // Required if username is not empty, except when requiresPassword: false
  //   protocol: "sftp", // Optional, values : 'ftp', 'sftp', 'ftps', ... default: 'ftp'
  //   port: 22, // Optional
  // });
  // ftps.cd('/home').mkdir('/home/test', '-p')

  /**
   * 1. ssh 连接服务器
   * 2. 进入目录
   * 3. 下载服务器文件到本地
   * 4. 断开连接
   */
  const conn = new Client();
  conn
    .on("ready", () => {
      console.log("服务器连接成功 root@cricket.cab ");
      // conn.shell((err, stream) => {
      //   if (err) throw err;
      //   stream
      //     .on("close", () => {
      //       console.log("Stream :: close");
      //       conn.end();
      //     })
      //     .on("data", (data) => {
      //       console.log("OUTPUT: " + data);
      //     });
      //   stream.end("ls -l\nexit\n");
      // });
      conn.sftp((err, sftp) => {
        if (err) throw err;
        // sftp.readdir('/home/node/cricket-api/public/static', (err, list) => {
        //   if (err) throw err;
        //   console.dir(list);
        //   list.forEach((file, index) => {
        //     console.log(index, file)
        //   })
        //   conn.end();
        // });

        // sftp.opendir("/home/node/cricket-api/public/static", (err, handle) => {
        //   console.log(handle);
        //   console.log(handle.length)
        //   console.log(typeof handle);
        //   console.log(handle instanceof Buffer);
        //   console.log(Buffer.isBuffer(handle));
        //   console.log(handle.stream());
        //   // const stream = fs.createReadStream({
        //   //   path: handle
        //   // });
        //   // console.log(stream)
        //   conn.end();
        // });

        sftp.on("error", (err) => {
          if (err) throw err;
        });

        sftp.readFile("/home/node/cricket-api/public/static", (err, handle) => {
          if (err) throw err;
          console.log(handle);
          conn.end();
        });
        // const readStream = sftp.createReadStream(
        //   "/home/node/cricket-api/public/static"
        // );
        // const writeStream = fs.createWriteStream(
        //   path.resolve(__dirname, "./static")
        // );
        // readStream.once("error", (err) => {
        //   console.log("error", err);
        // });
        // readStream.pipe(writeStream);
      });
    })
    .connect({
      host: "cricket.cab",
      port: 22,
      username: "root",
      password: "Gechaofeng7614",
      privateKey: fs.readFileSync(path.resolve(__dirname, "./id_rsa_tencent")),
    });
}

backupImg();
