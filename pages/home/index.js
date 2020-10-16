//index.js
//获取应用实例
const app = getApp();
const AUTH = require('../../utils/auth');
const $api = require("../../utils/api").API;

//获取微信运动 拒绝后不再获取
var isGetRunData = true;

Page({
  data: {
    wxlogin: true,
    userInfo: app.globalData.userInfo,
    coin:1024,
    steps:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {

  },

  onShow: function(e){
    //个人信息回显
    if(e){
      app.globalData.userInfo = e;
      this.setData({
        userInfo: e,
      })
    }
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
            const encryptedData = result.encryptedData;
            isGetRunData = true;
            // 发送请求 处理数据
            let data = {
              'uid': wx.getStorageSync('uid'),
              'data':encryptedData,
              'iv':result.iv
            }
            this.getRunSteps(data);
          },
          fail:(err) =>{
            console.log(err);
            isGetRunData = false;
          }
        })
      }
    })
  },
  /**
   * 点击 步数兑换金币
   */
  converClick:function(){
    let steps = this.data.steps;
    let that = this;
    if(steps === 0){
      $api.showModal('兑换提示','步数为0无法兑换金币，多走一点步数再来兑换吧~',false);
      return;
    }
    let uid = wx.getStorageSync('uid');
    if(uid){
      let coin = steps / 1000;
      wx.showModal({
        title: '兑换提示',
        content:'确定用'+steps+'步兑换'+coin+'个金币吗？',
        showCancel:true,
        success(res){
          if(res.confirm){
            that.convertSteps(uid);
          }
        }
      })
    }else{
      this.setData({
        wxlogin: false
      })
    }
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
    AUTH.userLogin(this);
  },
  /**
   * 获取当日可兑换步数
   * @param {*请求参数} data 
   */
  getRunSteps:function(data){
    $api.getRunSteps(data).then(res =>{
      //请求成功 判断状态码
      if(res.code == 200){
        //可兑换运动步数
        this.setData({
          steps : res.data
        })
      } 
    }).catch(err => {
      //请求失败
      console.log(err);
    })
  },
  /**
   * 步数兑换金币
   * @param {*请求参数} uid 
   */
  convertSteps:function(uid){
    //封装请求参数
    let data = {
      'id':uid
    }
    $api.convertSteps(data).then(res =>{
      //请求成功 判断状态码
      if(res.code == 200){
        $api.showToast("兑换成功",'success')
        //可兑换运动步数
        this.setData({
          steps : res.data
        })
      } else{
        $api.showToast(res.message,'none')
      }
    }).catch(err => {
      //请求失败
      $api.showToast(err,'none')
    })
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
