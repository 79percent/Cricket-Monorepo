/*
包含n个操作数据库集合数据的Model模块
*/
var mongoose = require("mongoose");
const { dbUrl } = require("../utils/config");

console.log("连接数据库 -> " + dbUrl);

// 1.连接数据库
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("数据库连接成功"))
  .catch((err) => console.log("数据库连接失败", err));

const UsersModel = mongoose.model("users", require("./schema/users"));

const TagsModel = mongoose.model("tags", require("./schema/tags"));

const WorksModel = mongoose.model("works", require("./schema/works"));
const WorksItemModel = mongoose.model("works_item", require("./schema/works_item"));

const FavoritesModel = mongoose.model(
  "favorites",
  require("./schema/favorites")
);

const FavoritesItemsModel = mongoose.model(
  "favorites_items",
  require("./schema/favorites_items")
);

const CommentsModel = mongoose.model("comments", require("./schema/comments"));

const CommentStatusModel = mongoose.model(
  "comments_status",
  require("./schema/comments_status")
);

const ReplysModel = mongoose.model("replys", require("./schema/replys"));

const ReplyStatusModel = mongoose.model(
  "replys_status",
  require("./schema/replys_status")
);

const PraiseStatusModel = mongoose.model(
  "praise_status",
  require("./schema/praise_status")
);

const FeedbacksModel = mongoose.model(
  "feedbacks",
  require("./schema/feedbacks")
);

const AttentionsStatusModel = mongoose.model(
  "attentions_status",
  require("./schema/attentions_status")
);

const BuriedPointModel = mongoose.model(
  "buried_point",
  require("./schema/buried_point")
);

module.exports = {
  UsersModel,
  TagsModel,
  WorksModel,
  WorksItemModel,
  FavoritesModel,
  CommentsModel,
  CommentStatusModel,
  FeedbacksModel,
  AttentionsStatusModel,
  ReplysModel,
  ReplyStatusModel,
  PraiseStatusModel,
  FavoritesItemsModel,
  BuriedPointModel,
};
