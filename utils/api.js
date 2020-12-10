const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

//正式
const BASE_PRO_URL = 'https://www.manysteps.cn/steps';
//测试
const BASE_DEV_URL = 'https://192.168.1.142/steps';


//api
const BASE_URL = BASE_PRO_URL;

//网络请求
function request(method, url, data) {
  return new Promise(function (resolve, reject) {
    let header = {
      'content-type': "application/json"
    }
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: method === POST ? JSON.stringify(data) : data,
      header: header,
      success: (res) => {
        //请求成功 errCode
        if(res.statusCode === 200){
          resolve(res.data);
        }

      },
      fail(err) {
        //请求失败s
        reject(err.errMsg)
      }
    })
  })
}

/**
 * 封装toast 
 * @param {*内容} msg 
 * @param {*logo} icon 
 */
function showToast(msg, icon) {
  wx.showToast({
    title: msg,
    icon: icon
  })
}

/**
 * 封装 dialog
 * @param {*标题} title 
 * @param {*内容} msg 
 * @param {*是否显示取消按钮} bool 
 */
function showModal(title, msg, bool) {
  wx.showModal({
    title: title,
    content: msg,
    showCancel: bool
  })
}

const API = {
  //封装Toast
  showToast: (msg, icon) => showToast(msg, icon),
  //封装弹框
  showModal: (title, msg, bool) => showModal(title, msg, bool),
  //登录注册
  login: (data) => request(POST, '/wxlogin', data),
  //获取商品列表
  getProductList: (data) => request(POST, '/product/productList', data),
  //获取单个商品详情
  getProduct: (data) => request(POST, '/product/getProduct', data),
  //下单前查询余额
  checkBalance: (data) => request(POST, '/order/checkBalance', data),
  //获取收货地址
  getAddress: (data) => request(POST, '/userinfo/getAddress', data),
  //添加收货地址
  addAddress: (data) => request(POST, '/userinfo/addAddress', data),
  //更新收货地址
  updateAddress: (data) => request(POST, '/userinfo/updateAddress', data),
  //确认下单
  placeOrder: (data) => request(POST, '/order/placeOrder', data),
  //获取我的订单记录
  getMyOrder: (data) => request(POST, '/order/myOrder', data),
  //获取邀请好友记录
  getInviteRecord: (data) => request(POST, '/userinfo/getInviteRecord', data),
  //获取金币交易记录
  getCoinRecord:(data) => request(POST,'/userinfo/coinRecord',data),
  //解密微信步数
  getRunSteps:(data) => request(POST,'/userinfo/getRunSteps',data),
  //步数转换金币
  convertSteps:(data) => request(POST,'/userinfo/convertSteps',data),
  //获取用户信息
  getUserInfo:(data) => request(POST,'/userinfo/getUserInfo',data),
  //获取商品兑换记录
  getProConvertList:(data) => request(POST,'/order/orderListByProduct',data),
  //用户步数记录
  getStepsRecord:(data) => request(POST,'/userinfo/stepsRecord',data),
  //用户步数排行榜
  getStepsRankList:(data) => request(POST,'/userinfo/getStepsRankList',data),
  //用户邀请排行榜
  getInviteRankList:(data) => request(POST,'/userinfo/getInviteRankList',data)
}

module.exports = {
  API: API
}