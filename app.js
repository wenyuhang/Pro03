//app.js

const AUTH = require('utils/auth');

//正式
const BASE_PRO_URL = 'http://8.131.75.5/steps/';
//测试
const BASE_DEV_URL = 'http://192.168.1.142/steps/';


//api
const BASE_URL = BASE_PRO_URL;

App({
  onLaunch: function () {
   const that = this;
   //检测新版本
   const updateManager = wx.getUpdateManager();
   updateManager.onUpdateReady(function(){
     wx.showModal({
       title: '更新提示',
       content: '新版本已准备好，是否重启应用？',
       success: (res) =>{
         if(res.confirm){
           //新版本下载好了 调用applyUpdate 应用新版本并重启
           updateManager.applyUpdate();
         }
       }
     })
   })

   /**
    * 初次加载判断网络情况
    * 无网络状态下根据实际情况进行调整
    */
   wx.getNetworkType({
     success: (result) => {
       const networkType = result.networkType;
       if (networkType === 'none') {
         that.globalData.isConnected = false;
         wx.showToast({
           title: '当前无网络',
           icon: 'loading',
           duration : 2000
         })
       }
     },
   })

   /**
    * 监听网络状态变化
    * 可根据业务需求进行调整
    */
   wx.onNetworkStatusChange((result) => {
     if(!result.isConnected){
       that.globalData.isConnected = false;
       wx.showToast({
         title: '网络已断开',
         icon: 'loading',
         duration: 2000
       })
     }else{
       that.globalData.isConnected = true;
       wx.hideToast();
     }
   })


  },

  onShow(e){
    //保存邀请人
    if (e && e.query && e.query.inviter_id) {
      if(!(wx.getStorageSync('uid') === e.query.inviter_id)){
        console.log("不相等")
        wx.setStorageSync('referrer',e.query.inviter_id);
      }else{
        console.log("相等")
      }
   
    }
  },

  globalData: {
    BASE_URL : BASE_URL,
    isConnected: true,
    userInfo:{
      name:'立即登录',
      headimgurl:'',
      coin_total:0,
      invite_total:0
    }
  }
})