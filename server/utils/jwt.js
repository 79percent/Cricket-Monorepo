/**
 * 生成Token和验证Token
 */
const jwt = require('jsonwebtoken');
const moment = require('moment');

// 创建 token 类
class Jwt {
  constructor({ id, token }) {
    // 传入id || token
    this.id = id;
    this.token = token;
  }

  //生成token
  generateToken(day = 30) {
    //这里设置token有效期天数
    const newToken = jwt.sign({
      data: this.id,
      exp: Math.floor(moment().add(day, 'days').unix()),
    }, 'secret');
    return `${newToken}`;
  }

  // 校验token,返回token对应的userId, 或者false
  verifyToken = async () => {
    let res = null;
    if (typeof this.token === 'string') {
      try {
        const token = this.token;
        const current = moment().unix();
        const result = jwt.verify(token, 'secret') || null;
        if (result) {
          const { data, exp } = result;
          //对比当前时间和设置的有效期时间
          if (current <= exp) {
            res = data;
          }
        }
      } catch (err) {
        res = null;
      }
    }
    return res
  }
}

module.exports = Jwt;
