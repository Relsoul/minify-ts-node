import * as crypto from 'crypto';

export default () => {
  // 新增用户直接在user字段新增就ok
  const conf = {
    port: 10244,
    secret: 'nKSXWSpbGCIFgMs',
    host: 'http://127.0.0.1:10244/',
    accept: {
      // 以竖线分隔
      '.jpg|.png|.jpeg|.webp': {
        // image类型的最大上传3M,maxSize:3M
        maxSize: 100,
      },
      '.zip|.gif': {
        maxSize: 4,
      },
    },
    user: [{ name: 'soul', pw: 'nKSXWSpbGCIFgMs' }],
  };

  // 预先编译存储至内存
  for (const i of conf.user) {
    const hmac = crypto.createHmac('sha256', conf.secret);
    hmac.update(`${i.name}-${i.pw}`);
    i['hex'] = hmac.digest('hex');
  }
  return conf;
};
