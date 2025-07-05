# Cricket-back-end

Cricket back-end API

## install

> yarn

## start

> yarn start

## build

> yarn build

## 框架

Express

## 数据库

MongoDB

## API 返回示例

```javascript
{
  code: 0,
  msg: '提示信息',
  data: {}
}
```

### code

- -1 登录失效
- 0 成功
- 1 已知失败
- 2 未知错误

### 批量删除

```javascript
TagsModel.deleteMany({ _id: { $in: [...id] } });
```

### 图片存储格式

采用 webp, 在同样像素大小的图片 webp 明显比 jpg 要小，85kb 的 jpg 转换成 webp 只有 35kb
gif 转成 webp 会变大 236kb -> 250kb
png 1.25mb -> 43kb
缺点是兼容性问题

### mongoose 定义字段

```nodejs
var schema = new Schema({
  test: {
    type: String,
    lowercase: true, // 总是将test的值转化为小写
    uppercase: true, // 总是将test的值转化为大写
    required:true, //设定是否必填
    default:'star', //设定默认值
    index：true, //设定索引值
    unique：true, //索引值唯一
    sparse：true, //是否启用稀疏索引
    match：RegExp, //判断是否通过正则验证
    enum：Array， //判断test值是否包含于enmu对应的数组中
    min：Number， //判断对应值是否大于等于给定值
    max：Number， //判断对应值是否小于等于给定值
    trim:true //去除数据前后的空格
    capped:1024 //限定大小最大为1024字节
    validate：function，为此属性添加一个验证器函数，如demo1所示
    get：function，//为这个属性定义一个定制的getter Object.defineProperty()。如demo2所示
    set：function，//定义此属性的自定义设置Object.defineProperty()。如demo2所示
  }
});
```

### 修复

1. 后台系统普通用户仍可以登录，但是无法查看目录
2. safari 下 获取 MP4、webp 资源报错，原因是服务端不支持 range 请求头  

- 图片问题：用错误处理 testimg.html 或者服务端判断浏览器是否支持 webp
- MP4 视频无法播放问题：safari 中存在样式问题无法显示视频
