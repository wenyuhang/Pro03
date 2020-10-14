//index.js
//获取应用实例
const app = getApp();
const AUTH = require('../../utils/auth');

//获取微信运动 拒绝后不再获取
var isGetRunData = true;

Page({
  data: {
    wxlogin: true,
    userInfo: app.globalData.userInfo,
    coin:1024,
    energy:88.88,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {

  },

  onShow: function(){
    //检查登录状态
    AUTH.checkHasLogined().then(res =>{
      this.setData({
        wxlogin: res
      })
      //获取微信运动 拒绝后不再获取
      if(res && isGetRunData){
        //获取微信步数
        wx.getWeRunData({
          success: (result) => {
            const data = result.encryptedData;
            isGetRunData = true;
            //发送请求 处理数据
            console.log(data);
          },
          fail:(err) =>{
            console.log(err);
            isGetRunData = false;
          }
        })
      }
    })
  },
  //授权登录 获取用户信息回调
  processLogin(e) {
    if(!e.detail.userInfo){
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
  /**
   * 用户点击分享
   */
  onShareAppMessage:function(res){
    let url = '';
    let uid = wx.getStorageSync('uid');
    if(uid > 0){
      url = '/pages/home/index?inviter_id='+uid;
    }else{
      url = '/pages/home/index';
    }
    console.log(url)
      return{
        title:'步数多多',
        path:url
      }
  },
  /**
   * 用户分享到朋友圈
   */
  onShareTimeline:function(res){
    let url = '';
    let uid = wx.getStorageSync('uid');
    if(uid > 0){
      url = '/pages/home/index?inviter_id='+uid;
    }else{
      url = '/pages/home/index';
    }
    return{
      title:'步数多多',
      query:url
    }
  },

  //取消授权
  cancelLogin(){
    this.setData({
      wxlogin: true
    })
  }










})
