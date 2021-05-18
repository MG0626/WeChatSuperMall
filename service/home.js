import request from './request.js';

function getMultidata(){
  return request('/home/multidata')
}

function getGoodsData(type, page){
  return request("/home/data", {type, page})
}

export {
  getMultidata,
  getGoodsData
}