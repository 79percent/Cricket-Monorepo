/**
 * 用户
 */
const fs = require("fs");
const express = require("express");
const moment = require("moment");
const sharp = require("sharp");
const sizeOf = require("image-size");
const formidable = require("formidable");
const JwtUtil = require("../../utils/jwt");
const { emailReg } = require("../../utils/regs");
const { avatarPath, backgroundPath } = require("../../utils/config");
const sendEmail = require("../../utils/sendMail");
const {
  UsersModel,
  WorksModel,
  AttentionsStatusModel,
  FavoritesItemsModel
} = require("../../db/models");
const {
  checkToken,
  filterEmpty,
  createFilter,
  generateHash,
  filepath2url,
  url2filepath,
  delay,
  renameImgFileName,
  removeImgFileExtension,
  unlinkUrlFile,
  isSupportImgType,
  generateImgFileName,
} = require("../../utils/utils");

// 防止文件死锁
sharp.cache({ files: 0 });

const router = express.Router();
const codeEffectiveTime = 1000 * 60 * 2; // 验证码有效时长 2分钟
const formatCodeTime = moment(codeEffectiveTime).format("m分钟s秒");
const codeMap = new Map(); // 验证码Map
const ipMap = new Map(); // 获取验证码IP Map 每2小时只能获取5次验证码， 2小时后清空
const loginEffectiveTime = 365; // 登录有效天数

// 校验字段是否已存在
router.get("/verifyField", async (req, res, next) => {
  try {
    const { name, email, account } = req.query;
    const user = await UsersModel.findOne(
      filterEmpty({
        name,
        account,
        email,
      })
    );
    if (user) {
      res.send({ code: 1, message: "已被使用", data: null });
    } else {
      res.send({ code: 0, message: "可以使用", data: null });
    }
  } catch (error) {
    next(error);
  }
});

// 注册
router.post("/register", async (req, res, next) => {
  try {
    const { name, account, password } = req.body;
    // 生成加密后的密码
    const hashPassword = generateHash(password);
    const Timestamp = moment().valueOf();
    const user = await UsersModel.create({
      name,
      account,
      password: hashPassword,
      createTime: Timestamp,
      updateTime: Timestamp,
    });
    if (user) {
      res.send({
        code: 0,
        message: "注册成功",
        data: null,
      });
    } else {
      res.send({
        code: 1,
        message: "注册失败",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 管理员创建用户
router.post("/admin/add", async (req, res, next) => {
  try {
    const { name, account, password, email, authority } = req.body;
    // 生成加密后的密码
    const hashPassword = generateHash(password);
    const Timestamp = moment().valueOf();
    const user = await UsersModel.create({
      name,
      account,
      password: hashPassword,
      email,
      authority,
      createTime: Timestamp,
      updateTime: Timestamp,
    });
    if (user) {
      res.send({
        code: 0,
        message: "注册成功",
        data: null,
      });
    } else {
      res.send({
        code: 1,
        message: "注册失败",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 账号密码登录 支持用户名 账号 邮箱登录
router.post("/login", async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const hashPassword = generateHash(password);
    const Timestamp = moment().valueOf();
    const user = await UsersModel.findOneAndUpdate(
      {
        $or: [
          {
            account,
          },
          {
            name: account,
          },
          {
            email: account,
          },
        ],
        password: hashPassword,
      },
      {
        lastLoginTime: Timestamp,
      }
    );
    if (!user) {
      res.send({ code: 1, message: "用户名或者密码不正确", data: null });
      return;
    }
    const { _id } = user;
    //生成一个token
    const jwt = new JwtUtil({ id: _id });
    const token = jwt.generateToken(loginEffectiveTime);
    const data = {
      id: _id,
      token,
    };
    res.send({ code: 0, message: "登录成功!", data });
  } catch (error) {
    next(error);
  }
});

// 后台账号密码登录 支持用户名 账号 邮箱登录 验证权限
router.post("/admin/login", async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const hashPassword = generateHash(password);
    const Timestamp = moment().valueOf();
    const user = await UsersModel.findOneAndUpdate(
      {
        $or: [
          {
            account,
          },
          {
            name: account,
          },
          {
            email: account,
          },
        ],
        password: hashPassword,
      },
      {
        lastLoginTime: Timestamp,
      }
    );
    if (!user) {
      res.send({ code: 1, message: "用户名或者密码不正确", data: null });
      return;
    }
    if (user?.authority !== '1') {
      res.send({ code: 1, message: "无权限", data: null });
      return;
    }
    const { _id } = user;
    //生成一个token
    const jwt = new JwtUtil({ id: _id });
    const token = jwt.generateToken(loginEffectiveTime);
    const data = {
      id: _id,
      token,
    };
    res.send({ code: 0, message: "登录成功!", data });
  } catch (error) {
    next(error);
  }
});

// 修改用户信息
router.post("/update", async (req, res, next) => {
  try {
    //验证token是否失效
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { name, profile, sex, birthDay } = req.body;
      const Timestamp = moment().valueOf();
      const user = await UsersModel.findByIdAndUpdate(
        { _id: userId },
        filterEmpty({
          name,
          profile,
          sex,
          birthDay,
          updateTime: Timestamp,
        })
      );
      if (user) {
        res.send({ code: 0, message: "修改成功", data: null });
      } else {
        res.send({ code: 1, message: "修改失败", data: null });
      }
    } else {
      res.status(401).send({
        code: -1,
        message: "当前用户登录信息已失效，请重新登录！",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 管理员删除用户
router.post("/delete", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isAdmin } = await checkToken(token);
    if (isAdmin) {
      const { id } = req.body;
      const user = await UsersModel.findByIdAndDelete(id);
      if (user) {
        res.send({ code: 0, message: "删除成功!", data: null });
      } else {
        res.send({ code: 1, message: "删除失败", data: null });
      }
    } else {
      throw new Error("无权限");
    }
  } catch (error) {
    next(error);
  }
});

// 注销用户
router.post("/cancel", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const user = await UsersModel.findByIdAndDelete(userId);
      if (user) {
        res.send({ code: 0, message: "注销成功!", data: null });
      } else {
        res.send({ code: 1, message: "注销失败", data: null });
      }
    } else {
      res.status(401).send({
        code: 1,
        message: "当前用户登录信息已失效，请重新登录！",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 获取用户信息
router.get("/getInfo", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isAdmin, userId } = await checkToken(token);
    const { id } = req.query;
    const _options = {
      password: 0,
    };
    if (!isAdmin && userId !== id) {
      // 非管理员 或者 非自己
      _options.account = 0;
    }
    if (!isAdmin) {
      _options.authority = 0;
    }
    const user = await UsersModel.findOne({ _id: id }, _options);
    if (user) {
      res.send({ code: 0, message: "获取成功", data: user });
    } else {
      res.send({ code: 1, message: "获取失败", data: null });
    }
  } catch (error) {
    next(error);
  }
});

// 获取用户投稿数、关注数、粉丝数
router.get("/getStatistics", async (req, res, next) => {
  try {
    const { id } = req.query;
    // 粉丝数
    const fansCount = await AttentionsStatusModel.count({
      targetUser: id,
      status: 1,
    });
    // 投稿数
    const contributeCount = await WorksModel.count({
      creator: id,
    });
    // 关注数
    const attentionsCount = await AttentionsStatusModel.count({
      creator: id,
      status: 1,
    });
    res.send({
      code: 0,
      message: "获取成功",
      data: {
        contributeCount: contributeCount || 0,
        attentionCount: attentionsCount || 0,
        fansCount: fansCount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 修改密码
router.post("/updatePassword", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { password } = req.body;
      const hashPassword = generateHash(password);
      const Timestamp = new Date().valueOf();
      const user = await UsersModel.findByIdAndUpdate(
        { _id: userId },
        {
          password: hashPassword,
          updateTime: Timestamp,
        }
      );
      if (user) {
        res.send({ code: 0, message: "修改成功", data: null });
      } else {
        res.send({ code: 1, message: "修改失败", data: null });
      }
    } else {
      res.status(401).send({
        code: -1,
        message: "当前用户登录信息已失效，请重新登录！",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 重置密码
router.post("/resetPassword", async (req, res, next) => {
  try {
    const { password, code, email } = req.body;
    const findOne = codeMap.get(email);
    if (findOne) {
      if (findOne !== code) {
        res.send({ code: 1, message: "验证码不正确", data: null });
        return;
      }
    }
    const hashPassword = generateHash(password);
    const Timestamp = new Date().valueOf();
    const user = await UsersModel.findOneAndUpdate(
      { email },
      {
        password: hashPassword,
        updateTime: Timestamp,
      }
    );
    if (user) {
      res.send({ code: 0, message: "重置密码成功", data: null });
    } else {
      res.send({ code: 1, message: "重置密码失败", data: null });
    }
  } catch (error) {
    next(error);
  }
});

// 修改邮箱
router.post("/updateEmail", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const { email, code } = req.body;
      const findOne = codeMap.get(email);
      if (findOne !== code) {
        res.send({ code: 1, message: "验证码不正确", data: null });
        return;
      }
      const Timestamp = new Date().valueOf();
      const user = await UsersModel.findByIdAndUpdate(
        { _id: userId },
        {
          email,
          updateTime: Timestamp,
        }
      );
      if (user) {
        codeMap.delete(email);
        res.send({ code: 0, message: "修改成功", data: null });
      } else {
        res.send({ code: 1, message: "修改失败", data: null });
      }
    } else {
      res.status(401).send({
        code: -1,
        message: "当前用户登录信息已失效，请重新登录！",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 修改用户权限
router.post("/updateAuthority", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isAdmin } = await checkToken(token);
    if (isAdmin) {
      const { id, authority } = req.body;
      const Timestamp = new Date().valueOf();
      const user = await UsersModel.findByIdAndUpdate(
        { _id: id },
        {
          authority,
          updateTime: Timestamp,
        }
      );
      if (user) {
        res.send({ code: 0, message: "修改成功", data: null });
      } else {
        res.send({ code: 1, message: "修改失败", data: null });
      }
    } else {
      throw new Error("没有权限！");
    }
  } catch (error) {
    next(error);
  }
});

// 上传头像
router.post("/uploadAvatar", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const form = formidable({
        uploadDir: avatarPath,
        keepExtensions: true,
      });
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            next(err);
            return;
          }
          const { avatar } = files;
          const { filepath, mimetype } = avatar;
          if (!isSupportImgType(mimetype)) {
            fs.unlinkSync(filepath);
            res.send({ code: 1, message: "图片格式错误", data: null });
            return;
          }
          const { width: imgWidth, height: imgHeight } = sizeOf(filepath);
          let size1 = 96,
            size2 = 160;
          let cropW = imgWidth,
            cropH = imgHeight,
            left = 0,
            top = 0;
          if (cropW > cropH) {
            cropW = cropH;
            left = Math.floor((imgWidth - cropW) / 2);
          } else {
            cropH = cropW;
            top = Math.floor((imgHeight - cropH) / 2);
          }
          const Timestamp = moment().valueOf();
          const [avatarSize1Webp, avatarSize1Origin] = generateImgFileName(filepath, {
            resize: [size1, size1]
          });
          const [avatarSize2Webp, avatarSize2Origin] = generateImgFileName(filepath, {
            resize: [size2, size2]
          });
          const newAvatarMin = (filepath2url(avatarSize1Webp));
          const newAvatar = (filepath2url(avatarSize2Webp));
          const oldUser = await UsersModel.findByIdAndUpdate(userId, {
            avatarMin: newAvatarMin,
            avatar: newAvatar,
            updateTime: Timestamp,
          });
          if (oldUser) {
            const imgCrop = await sharp(filepath, { animated: true })
              .extract({ left, top, width: cropW, height: cropH });
            const imgSize1 = await imgCrop
              .resize(size1);
            await imgSize1
              .toFile(avatarSize1Webp);
            await imgSize1
              .toFile(avatarSize1Origin);
            const imgSize2 = await imgCrop
              .resize(size2);
            await imgSize2
              .toFile(avatarSize2Webp);
            await imgSize2
              .toFile(avatarSize2Origin);
            res.send({
              code: 0,
              message: "修改成功",
              data: {
                avatarMin: newAvatarMin,
                avatar: newAvatar,
                updateTime: Timestamp,
              },
            });
            const { avatar, avatarMin } = oldUser;
            if (avatar) {
              unlinkUrlFile(avatar);
            }
            if (avatarMin) {
              unlinkUrlFile(avatarMin);
            }
            fs.unlinkSync(filepath);
            return;
          }
          res.send({ code: 1, message: "修改失败", data: null });
        } catch (error) {
          next(error);
        }
      });
    } else {
      res.status(401).send({
        code: -1,
        message: "当前用户登录信息已失效，请重新登录！",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 获取用户列表
router.get("/getUserList", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isAdmin } = await checkToken(token);
    let { current = 1, pageSize = 10, keyword = "", authority } = req.query;
    current = Number(current);
    pageSize = Number(pageSize);
    pageSize = pageSize > 100 ? 100 : pageSize;
    let total = 0; //总数
    let totalPage = 0; //总页数
    let skipCount = Math.floor((current - 1) * pageSize); //分页跳过条数
    const _filter = createFilter(
      keyword,
      ["email", "account", "name", "profile"],
      filterEmpty({
        authority: isAdmin ? authority : undefined,
      })
    );
    let options = {
      account: 0,
      password: 0,
      authority: 0,
    };
    if (isAdmin) {
      delete options.account;
      delete options.authority;
    }
    const doc = await UsersModel.count(_filter);
    if (typeof doc === "number") {
      total = doc;
      totalPage = Math.ceil(doc / pageSize);
      const data = await UsersModel.find(_filter, options)
        .limit(pageSize) // 最多显示pageSize条
        .sort({ createTime: -1 }) // 倒序
        .skip(skipCount);
      if (data) {
        res.send({
          code: 0,
          data,
          message: "获取成功",
          total,
          totalPage,
          current,
          pageSize,
        });
      } else {
        res.send({ code: 1, message: "获取失败" });
      }
    } else {
      res.send({ code: 1, message: "获取失败" });
    }
  } catch (error) {
    next(error);
  }
});

// 发送邮箱验证码 ip请求次数验证 验证码时效验证
router.post("/sendEmailCode", async (req, res, next) => {
  try {
    const ip = req.ip;
    const ipRequestCount = ipMap.get(ip) || 0; // ip请求次数
    if (ipRequestCount > 5) {
      // 次数大于5, 2小时后删除此ip
      setTimeout(() => {
        ipMap.delete(ip);
      }, 1000 * 60 * 60 * 2);
      res.send({
        code: 1,
        message: `请勿频繁操作，在2小时后重试`,
      });
      return;
    }
    const { email } = req.body;
    if (emailReg.test(email)) {
      const findOne = codeMap.get(email);
      // 已发送过验证码
      if (findOne) {
        res.send({
          code: 1,
          message: `验证码已发送，请登录邮箱查看`,
          data: null,
        });
      } else {
        // 还没有向该邮箱发送过验证码
        ipMap.set(req.ip, ipRequestCount + 1);
        let code = "";
        for (let index = 0; index < 4; index++) {
          const num = Math.floor(Math.random() * 10);
          code = `${code}${num}`;
        }
        await sendEmail(
          {
            user: "per8695@163.com",
            pass: "DNZUSUDRHXRSIUCF",
          },
          {
            from: '"Cricket" <per8695@163.com>',
            to: email,
            subject: "系统邮件 - 验证码",
            text: `${code}`,
            html: `<p>本次验证码：<strong>${code}</strong>，有效时长：${formatCodeTime}</p>`,
          }
        );
        codeMap.set(email, code);
        setTimeout(() => {
          // 超过有效时长后从队列删除
          codeMap.delete(email);
        }, codeEffectiveTime);
        res.send({
          code: 0,
          message: "验证码发送成功",
          data: null,
        });
      }
    } else {
      res.send({ code: 1, message: "邮箱格式不正确", data: null });
    }
  } catch (error) {
    next(error);
  }
});

// 设置个人空间背景图片
router.post("/uploadBackground", async (req, res, next) => {
  try {
    const { token } = req.headers;
    const { isLogin, userId } = await checkToken(token);
    if (isLogin) {
      const form = formidable({
        uploadDir: backgroundPath,
        keepExtensions: true,
      });
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            next(err);
            return;
          }
          const { background } = files;
          const { filepath, mimetype } = background;
          if (!isSupportImgType(mimetype)) {
            fs.unlinkSync(filepath);
            res.send({ code: 1, message: "图片格式错误", data: null });
            return;
          }
          const Timestamp = moment().valueOf();
          const [bgWebp, bgOrigin] = generateImgFileName(filepath, {
            resize: '@resize_1920'
          });
          const url = filepath2url(bgWebp);
          const oldUser = await UsersModel.findByIdAndUpdate(userId, {
            background: url,
            updateTime: Timestamp,
          });
          if (oldUser) {
            const resizeImg = await sharp(filepath, { animated: true })
              .resize(1920)
            await resizeImg
              .toFile(bgWebp);
            await resizeImg
              .toFile(bgOrigin);
            const { background } = oldUser;
            if (background) {
              unlinkUrlFile(background);
            }
            res.send({
              code: 0,
              message: "修改成功",
              data: {
                background: url,
                updateTime: Timestamp,
              },
            });
          } else {
            res.send({ code: 1, message: "修改失败", data: null });
          }
          fs.unlinkSync(filepath);
        } catch (error) {
          next(error);
        }
      });
    } else {
      res.status(401).send({
        code: -1,
        message: "当前用户登录信息已失效，请重新登录！",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 获取用户 动态、收藏、关注 统计数
router.get("/getMbStatistics", async (req, res, next) => {
  try {
    const { id } = req.query;
    // 投稿数、收藏数、关注数
    const [contributeCount, favoriteCount, attentionsCount] = await Promise.all([
      WorksModel.count({
        creator: id,
      }),
      FavoritesItemsModel.count({
        creator: id,
        status: 1,
      }),
      AttentionsStatusModel.count({
        creator: id,
        status: 1,
      })
    ])
    res.send({
      code: 0,
      message: "获取成功",
      data: {
        contributeCount: contributeCount || 0,
        attentionCount: attentionsCount || 0,
        favoriteCount: favoriteCount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
