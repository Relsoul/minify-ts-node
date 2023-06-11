type buildResult = {
  code: -1 | 0 | 1 | 401; // 0/-1 错误，1:成功, 401 登录相关问题
  msg: string; // 验证失败
  data: object; // 返回值
};
export function buildResult(
  code: buildResult['code'] = 1,
  msg: buildResult['msg'] = '',
  data: buildResult['data'] = null,
) {
  return {
    code,
    msg,
    data,
  };
}
