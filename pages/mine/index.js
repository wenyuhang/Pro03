const app = getApp();
const AUTH = require('../../utils/auth');



Page({
  data: {
    wxlogin: true,
    userInfo: {},
    energy:'88.88',
    coin:'1024',
    invite:'0'
  },
  //事件处理函数
  onLoad: function () {

  },

  onShow: function () {
    //检查登录状态
    AUTH.checkHasLogined().then(res => {
      this.setData({
        wxlogin: res,
        userInfo: app.globalData.userInfo
      })
      if(res && !this.userInfo){
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo;
            this.setData({
              wxlogin: true,
              userInfo: res.userInfo
            })
           
          }
        })
      }
     
    })
  },
  //授权登录 获取用户信息回调
  processLogin(e) {
    if (!this.data.userInfo) return;
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none'
      })
      return;
    }
    console.log("已授权");
    app.globalData.userInfo = e.detail.userInfo;
    AUTH.userLogin(this);

  },

  //取消授权
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  goLogin() {
    this.setData({
      wxlogin: false
    })
  }


})