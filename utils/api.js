const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

//正式
const BASE_URL = 'http://192.168.1.142:8080/steps';
//测试
const BASE_DEV_URL = 'http://192.168.1.142:8080/steps';

//网络请求
function request(method,url,data){
  return new Promise(function(resolve,reject){
    let header = {
      'content-type':"application/json"
    }
    wx.request({
      url: BASE_URL+url,
      method:method,
      data : method === POST ? JSON.stringify(data) : data,
      header : header,
      success:(res) =>{
        //请求成功 判断状态码 errCode
        if (res.data.code == 200) {
          resolve(res.data);
        }else{
          //其他错误
          reject(res.data.message);
        }
      },fail(err){
        //请求失败
        reject(err.errMsg)
        console.log(err)
      }
    })
  })
}

const API = {
  login : (data) => request(POST,'/wxlogin',data),
  getProductList : (data) => request(POST,'/product/productList',data),
  getProduct : (data) => request(POST,'/product/getProduct',data),
  checkBalance : (data) =>request(POST,'/order/checkBalance',data)
}

module.exports = {
  API : API
}