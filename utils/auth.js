const $api = require("api").API;

//检测session有效状态
async function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: (res) => {
        return resolve(true);
      },
      fail: (err) => {
        return resolve(false);
      }
    })
  })
}

//检测登录状态 返回 true/false
async function checkHasLogined() {
  const uid = wx.getStorageSync('uid');
  if (!uid) {
    return false;
  }
  const logined = await checkSession();
  if (!logined) {
    wx.removeStorageSync('uid');
    return false;
  }

  return true;
}

//注册用户
async function userLogin(page) {
  let _this = this;
  wx.login({
    success: (res) => {
      let code = res.code;
      //发送res.code 到后台换取 openId sessionKey unionId
      wx.getUserInfo({
        success: res => {
          let iv = res.iv; //解密初始向量
          let encryptedData = res.encryptedData; //用户数据 加密
          let referrer = ''; //推荐人
          let referrer_storge = wx.getStorageSync('referrer');
          if (referrer_storge) {
            referrer = referrer_storge;
          }
          //填充参数
          let data = {
            'code': code,
            'encryptedData': encryptedData,
            'iv': iv,
            'referrer': referrer
          }
          //下面开始调用注册接口
          $api.login(data).then(res => {
            //请求成功
            wx.setStorageSync('uid', res.data.id);
            //回调页面 刷新数据
            if (page) {
              page.onShow(res.data);
            }
          }).catch(err => {
            //请求失败
            console.log(err);
          })
        },
      })


    },
    fail: err => {
      console.log(res);
    }
  })
}


module.exports = {
  checkSession: checkSession,
  userLogin: userLogin,
  checkHasLogined: checkHasLogined
}