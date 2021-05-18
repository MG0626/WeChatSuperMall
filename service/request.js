// 导入服务器配置
import { host } from './config.js'
// 封装微信网络请求函数
export default (url, data={}, method='GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      data,
      method,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}