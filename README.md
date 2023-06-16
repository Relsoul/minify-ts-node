# 说明

本仓库为原有仓库的ts版本，并且新增了格式化等功能，[原有仓库](https://github.com/Relsoul/minify-upload)不再进行维护

本项目为利用闲置服务器资源，比如某些服务器月流量1T不限速,服务器是空闲状态,可以利用服务器做一个个人图床系统

轻量，简约基于nestjs+nodejs的文件上传服务器。chrome插件github地址:[戳我查看](https://github.com/Relsoul/minify-upload-chrome-extension)
>最近写markdown没办法快捷的上传图片和文件，又不想额外打开窗口去上传文件。于是做了一个比较简约的文件上传服务器。


# 安装

node version >= 16.x，未在低版本测试过，理论上14也是可以正常运行

```
npm install
```

# 配置
`confis.json`
其中host为自己的域名，user为一个数组，可以自定义添加额外的用户。
**请运行前更改secret和user，password**

## 详解
```js
{
  "port": 10244, // 监听端口 
  "secret": "nKSXWSpbGCIFgMs", // 密钥 客户端加密用
  "host": "https://xxx.com/", // 配置好的url host, 这里会影响到上传成功后到返回host 必须以/结尾
  "compressImage": true, // 是否上传时压缩图片
  "compressImageOpt": {
    "imgExt": ["png", "jpg", "jpeg", "webp", "gif"], // 图片扩展名
    "allowFormat": ["png", "jpg", "jpeg", "webp"], // 允许转码的图片
    "width": 4000, // width 超过4000 转化为4000
    "quality": 79, // 输出质量
    "format": false // false为保持原有格式 你可以传递"webp"|"jpeg"等格式
  },

  "accept": {// 允许上传的后缀名
    ".jpg|.png|.jpeg|.webp": {
      "maxSize": 100
    },
    ".zip|.gif": {
      "maxSize": 50
    }
  },
  "user": [{ 
    "name": "soul", // 用户名
     "pw": "nKSXWSpbGCIFgMs"  // 用户密码 可以与密钥不一致
     }]
}
```

# 运行
```shell
npm run build
node dist/main.js
```

## pm2运行
```shell
npm run build
pm2 start dist/main.js
```
推荐使用pm2来管理运行。

## docker 运行
待完善



# changelog

### v1.0

- [x] 基于文件目录化的用户文件保存与查看
- [x] 文件大小等后端校验与过滤
- [x] 支持user认证
- [x] 文件上传与保存
- [x] 静态服务器
- [x] picgo插件支持
- [x] 上传压缩/转换图片
- [x] 读取图片支持调整宽高&输出格式
- [x] 支持批量压缩/转码原有图片

