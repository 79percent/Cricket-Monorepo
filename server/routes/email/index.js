/**
 * 邮箱
 */
var express = require('express');
const moment = require('moment');
const sendEmail = require('../../utils/sendMail');

var router = express.Router();

router.get('/send', async (req, res) => {
  let sendTime = moment().format('YYYY-MM-DD hh:mm:ss');
  const info = await sendEmail({
    user: "per8695@163.com", // 发件人邮箱
    pass: "DNZUSUDRHXRSIUCF" //163IMAP/SMTP授权码密匙
  }, {
    // 发件人地址
    from: 'per8695@163.com',
    // 收件人列表, 向163邮箱, gmail邮箱, qq邮箱各发一封
    to: 'per8695@163.com, per7614@163.com, 1445188798@qq.com',
    // 邮件主题
    subject: '系统管理员回复',
    // 文字内容
    text: '天气正好',
    // html内容
    html: '<b>发送时间:' + sendTime + '</b>',
  })
  res.send({
    code: 0,
    message: '邮件发送成功',
    data: {
      info
    }
  });
});

module.exports = router;
