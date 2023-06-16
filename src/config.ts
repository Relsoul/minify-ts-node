import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';
export default () => {
  // 新增用户直接在user字段新增就ok
  const jsonData = fs.readJsonSync(path.join(__dirname, '../config.json'));
  const conf = jsonData || {
    port: 10244,
    secret: 'nKSXWSpbGCIFgMs',
    host: 'http://127.0.0.1:10244/',
    compressImage: true,
    compressImageOpt: {
      imgExt: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
      allowFormat: ['png', 'jpg', 'jpeg', 'webp'],
      width: 4000,
      quality: 79,
      format: false,
    },

    accept: {
      '.jpg|.png|.jpeg|.webp': {
        maxSize: 100,
      },
      '.zip|.gif': {
        maxSize: 50,
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
