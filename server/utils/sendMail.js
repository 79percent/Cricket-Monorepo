const nodemailer = require("nodemailer");

/**
 * 发送邮件
 * @param {
      user: "per8695@163.com", // 发件人邮箱
      pass: "DNZUSUDRHXRSIUCF", //163IMAP/SMTP授权码密匙
    } param0 
 * @param {
      // 发件人地址
      from: "chn_licai@163.com",
      // 收件人列表, 向163邮箱, gmail邮箱, qq邮箱各发一封
      to: "chn_licai@163.com, 528343921@qq.com, 1419352779@qq.com,3485541522@qq.com",
      // 邮件主题
      subject: "系统管理员回复",
      // 文字内容
      text: "天气正好",
      // html内容
      html: "<b>发送时间:" + sendTime + "</b>",
    } mailOptions 
 * @returns info
 */
const sendMail = ({ user, pass }, mailOptions = {}) => {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        reject(err);
        return;
      }
      // 填入自己的账号和密码
      let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        secure: true, // 如果是 true 则port填写465, 如果 false 则可以填写其它端口号
        auth: {
          user,
          pass,
        },
      });
      // 发送邮件
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(info);
      });
    });
  });
};

module.exports = sendMail;
