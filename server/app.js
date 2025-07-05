const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { loggerError, loggerInfo } = require("./logger");
const { staticPath, isDevelopment } = require("./utils/config");

const emailAPI = require("./routes/email");
const userAPI = require("./routes/user");
const tagAPI = require("./routes/tag");
const worksAPI = require("./routes/works");
const commentsAPI = require("./routes/comments");
const commentStatusAPI = require("./routes/commentStatus");
const replyAPI = require("./routes/reply");
const replyStatusAPI = require("./routes/replyStatus");
const feedbackAPI = require("./routes/feedback");
const favoritesAPI = require("./routes/favorites");
const favoritesItemsAPI = require("./routes/favoritesItems");
const attentionStatusAPI = require("./routes/attentionStatus");
const praiseStatusAPI = require("./routes/praiseStatus");
const deleteAPI = require("./routes/deleteData");
const buriedPointAPI = require("./routes/buriedPoint");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html")); //设置/ 下访问文件位置
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use("/static", express.static(staticPath))
app.use("/static", (req, res, next) => {
  const extensions = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
  // 判断浏览器是否支持webp,决定是否返回webp图片，兼容处理
  const accept = req.get('Accept');
  let isSupportWebp = accept.includes('image/webp');
  if (isSupportWebp) {
    extensions.unshift('webp', 'WEBP');
  }
  return express.static(staticPath, {
    extensions
  })(req, res, next);
});

app.use(loggerInfo);

app.use("/api/email", emailAPI);
app.use("/api/user", userAPI);
app.use("/api/user/attention", attentionStatusAPI);
app.use("/api/tag", tagAPI);
app.use("/api/works", worksAPI);
app.use("/api/praise", praiseStatusAPI);
app.use("/api/favorite", favoritesAPI);
app.use("/api/favorite/items", favoritesItemsAPI);
app.use("/api/comment", commentsAPI);
app.use("/api/comment/status", commentStatusAPI);
app.use("/api/reply", replyAPI);
app.use("/api/reply/status", replyStatusAPI);
app.use("/api/feedback", feedbackAPI);
app.use("/api/buriedPoint", buriedPointAPI);
if (isDevelopment) {
  app.use("/api/delete", deleteAPI);
}

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(loggerError);

app.use(function (err, req, res, next) {
  res.status(500).send({
    code: 1,
    message: isDevelopment ? err.message : "未知错误",
    data: null,
  });
});

module.exports = app;
