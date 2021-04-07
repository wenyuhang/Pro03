const app = getApp();
const AUTH = require('../../utils/auth');
const $api = require("../../utils/api").API;



Page({
  data: {
    canIUseGetUserProfile: false,
    wxlogin: true,
    userInfo: app.globalData.userInfo
  },
  //事件处理函数
  onLoad: function () {
   //处理新版获取用户信息api
   if (wx.getUserProfile) {
    this.setData({
      canIUseGetUserProfile: true
    })
  }
  },

  onShow: function (e) {
    //个人信息回显
    if (e) {
      app.globalData.userInfo = e;
      this.setData({
        userInfo: e,
      })
      if (!e.stepsRank && e.id) {
        this.getUserInfo(e.id);
      }
    }
    //检查登录状态
    AUTH.checkHasLogined().then(res => {
      this.setData({
        wxlogin: res,
        userInfo: app.globalData.userInfo
      })
      //获取用户信息
      let uid = wx.getStorageSync('uid');
      if (!e && !this.data.userInfo.openid && res && uid) {
        this.getUserInfo(uid);
      }
    })
  },
  //下拉刷新触发函数
  onPullDownRefresh: function () {
    //检查登录状态
    AUTH.checkHasLogined().then(res => {
      //获取用户信息
      let uid = wx.getStorageSync('uid');
      if (res && uid) {
        this.getUserInfo(uid);
      }
    })
  },
  /**
   * 步数排行榜
   */
  toStepsRank: function () {
    if (this.data.userInfo.id) {
      wx.navigateTo({
        url: '/pages/steps_rank/index'
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 邀请排行榜
   */
  toInviteRank: function () {
    if (this.data.userInfo.id) {
      wx.navigateTo({
        url: '/pages/invite_rank/index'
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 金币记录
   */
  coinRecord: function () {
    if (this.data.userInfo.id) {
      wx.navigateTo({
        url: '/pages/coin_record/index?coin_total=' + this.data.userInfo.coin_total
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 步数记录
   */
  stepsRecord: function () {
    if (this.data.userInfo.id) {
      wx.navigateTo({
        url: '/pages/steps_record/index?steps_total=' + this.data.userInfo.steps_total
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 邀请记录
   */
  inviteRecord: function () {
    if (this.data.userInfo.id) {
      wx.navigateTo({
        url: '/pages/invite_record/index'
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 我的订单
   */
  toMyOrder: function () {
    if (this.data.userInfo.id) {
      wx.navigateTo({
        url: '/pages/order_record/index'
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 我的地址
   */
  toMyAddress: function () {
    if (this.data.userInfo) {
      //去编辑收货地址
      wx.navigateTo({
        url: '/pages/address/index'
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  /**
   * 规则说明
   */
  toRule: function () {
    wx.navigateTo({
      url: '/pages/rule_desc/index'
    })
  },
  /**
   * 关于我们
   */
  toAbout: function () {
    wx.navigateTo({
      url: '/pages/about/index'
    })
  },
  /**
   * 常见问题
   */
  toFAQ: function () {
    wx.navigateTo({
      url: '/pages/faq/index'
    })
  },
  //授权登录 获取用户信息回调
  processLogin(e) {
    if (!this.data.userInfo) return;
    // if (!e.detail.userInfo) {
    //   wx.showToast({
    //     title: '已取消',
    //     icon: 'none'
    //   })
    //   return;
    // }
    app.globalData.userInfo = e.detail.userInfo;
    AUTH.userLogin(this);

  },
  /**
   * 获取用户信息
   * @param {*请求参数} uid 
   */
  getUserInfo: function (uid) {
    //封装请求参数
    let data = {
      'id': uid
    }
    $api.getUserInfo(data).then(res => {
      //隐藏loading
      wx.stopPullDownRefresh();
      //请求成功 判断状态码
      if (res.code == 200) {
        //更新用户信息
        app.globalData.userInfo = res.data;
        this.setData({
          userInfo: res.data
        })

      } else {
        this.setData({
          wxlogin: false
        });
        wx.removeStorageSync('uid');
        $api.showToast(res.message, 'none')
      }
    }).catch(err => {
      //隐藏loading
      wx.stopPullDownRefresh();
      //请求失败
      $api.showToast(err, 'none')
    })
  },
  //取消授权
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  //授权登录
  goLogin() {
    this.setData({
      wxlogin: false
    })
  },
  /**
   * 用户点击分享
   */
  onShareAppMessage: function (res) {
    let url = '';
    let uid = wx.getStorageSync('uid');
    if (uid > 0) {
      url = '/pages/home/index?inviter_id=' + uid;
    } else {
      url = '/pages/home/index';
    }
    return {
      title: '换金币兑超值商品',
      path: url
    }
  },
  /**
   * 用户分享到朋友圈
   */
  onShareTimeline: function (res) {
    let url = '';
    let uid = wx.getStorageSync('uid');
    if (uid > 0) {
      url = 'inviter_id=' + uid;
    }
    return {
      title: '换金币兑超值商品',
      query: url
    }
  }


})