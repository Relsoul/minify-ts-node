# 说明

本仓库为原有仓库的ts版本，并且新增了格式化等功能，[原有仓库](https://github.com/Relsoul/minify-upload)不再进行维护

本项目为利用闲置服务器资源，比如某些服务器月流量1T不限速,服务器是空闲状态,可以利用服务器做一个个人图床系统

轻量，简约基于nestjs+nodejs的文件上传服务器。chrome插件github地址:[戳我查看](https://github.com/Relsoul/minify-upload-chrome-extension)
>最近写markdown没办法快捷的上传图片和文件，又不想额外打开窗口去上传文件。于是做了一个比较简约的文件上传服务器。

# 客户端
- [chrome插件](https://github.com/Relsoul/minify-upload-chrome-extension)
- [picgo插件](https://github.com/Relsoul/minify-picgo-host)

# 图片格式化教程
上传后图片范例 
> [https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png](https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png)

**format格式**

`?f=webp|png|jpeg`
>[https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?f=webp](https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?f=webp)

**调整宽度**

传递宽度不传递高度的情况图片会自适应处理

`?w=200`

> [https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?w=200](https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?w=200)


**调整高度**

`?h=200`
>[https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?h=200](https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?h=200)


**整合范例**

>[https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?f=webp&w=200&h=200](https://cdn.relsoul.com/public/uploads/soul/2023-06-16/38c5c5e8-9b4c-4a04-ae73-67e8dc894abd.png?f=webp&w=200&h=200)


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
      "maxSize": 100 //单位为M 最大上传尺寸限制
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



# 优化图片
此接口为处理已经上传的图片(public目录下的所有图片)进行压缩
```
curl --request GET \
  --url http://xxx.com/optimize \
  --header 'utoken: 生成的token'
```
token生成的规则为
```js
const hmac = crypto.createHmac('sha256', secret);
hmac.update(`${name}-${pw}`);
token = hmac.digest('hex');
```
目前暂未提供图形化界面操作,有需要的话后期再迭代添加。

依据图片的数量需要一定时间的处理，哪怕后台接口返回了状态码为`502`等情况，实际上是正在处理中，可以忽略，切记不要重复运行.
压缩规则跟上传图片压缩规则一致，如果不想转换格式切记设置`format:false`, 建议在转化前备份一下原有文件。

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

