//index.js
//获取应用实例
const app = getApp();
const AUTH = require('../../utils/auth');
const $api = require("../../utils/api").API;

//获取微信运动 拒绝后不再获取
var isGetRunData = true;
//是否已经点击兑换 
var isConvert = false;
//是否已获取过邀请记录
var isGetInviteData = false;
//是否首次获取数据
var isFirstReq = true;

Page({
  data: {
    canIUseGetUserProfile: false, 
    wxlogin: true,
    userInfo: app.globalData.userInfo,
    coin: 0.00,
    steps: 0,
    items: [],
    explain: ''
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
    }
    //检查登录状态
    AUTH.checkHasLogined().then(res => {
      this.setData({
        wxlogin: res,
        userInfo: app.globalData.userInfo
      })

      let uid = wx.getStorageSync('uid');
      //获取微信运动 拒绝后不再获取
      if (res && uid && isGetRunData) {
        this.authWeRunData(uid);
      }
      //

      // if (!e && !this.data.userInfo.openid && res && uid) {
      //   this.getUserInfo(uid);
      // }

      //获取邀请用户列表    获取用户信息
      if (uid && !isGetInviteData) {
        this.getUserInfo(uid);
        this.getInviteRecord(uid);
      }
    })
  },
  /**
   * 按钮点击 步数兑换金币
   */
  converClick: function () {
    //判断是否点击兑换 防止二次点击
    if (isConvert) return

    let steps = this.data.steps;
    let that = this;

    let uid = wx.getStorageSync('uid');
    if (uid) {
      //没有授权获取微信步数 重新授权
      if (!isGetRunData) {
        this.authWeRunData();
        return;
      }
      //判断可以兑换步数
      if (steps === 0) {
        $api.showModal('兑换提示', '步数为0无法兑换金币，多走一点步数再来兑换吧~', false);
        return;
      }

      let coin = (steps / 1000).toFixed(2);
      wx.showModal({
        title: '兑换提示',
        content: '确定用' + steps + '步兑换' + coin + '个金币吗？',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            that.convertSteps(uid);
          }
        }
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
  },
  //授权获取微信运动数据
  authWeRunData: function (id) {
    //获取微信步数
    wx.getWeRunData({
      success: (result) => {
        const encryptedData = result.encryptedData;
        isGetRunData = true;
        // 发送请求 处理数据
        let data = {
          'uid': id,
          'data': encryptedData,
          'iv': result.iv
        }
        this.getRunSteps(data);
      },
      fail: (err) => {
        isGetRunData = false;
      }
    })
  },
  //授权登录 获取用户信息回调
  processLogin(e) {
    // if (!e.detail.userInfo) {
    //   wx.showToast({
    //     title: '已取消',
    //     icon: 'none'
    //   })
    //   return;
    // }
    AUTH.userLogin(this);
  },
  /**
   * 获取当日可兑换步数
   * @param {*请求参数} data 
   */
  getRunSteps: function (data) {
    //首次请求显示dialog
    if (isFirstReq) {
      wx.showLoading({
        title: '数据获取中',
      })
    }
    $api.getRunSteps(data).then(res => {
      if (isFirstReq) {
        //隐藏loading
        wx.hideLoading();
        isFirstReq = false;
      }
      //请求成功 判断状态码
      if (res.code == 200) {
        //可兑换运动步数
        this.setData({
          steps: res.data,
          explain: res.message
        })
      }
    }).catch(err => {
      if (isFirstReq) {
        //隐藏loading
        wx.hideLoading();
        isFirstReq = false;
      }
      //请求失败
      console.log(err);
    })
  },
  /**
   * 步数兑换金币
   * @param {*请求参数} uid 
   */
  convertSteps: function (uid) {
    //显示loading
    wx.showLoading({
      title: '兑换中',
    })
    isConvert = true;
    //封装请求参数
    let data = {
      'id': uid
    }
    $api.convertSteps(data).then(res => {
      //隐藏loading
      wx.hideLoading();
      //修改状态  可点击兑换
      isConvert = false;
      //请求成功 判断状态码
      if (res.code == 200) {
        $api.showToast("兑换成功", 'success')
        //可兑换运动步数
        this.setData({
          steps: res.data
        })
        //刷新用户数据
        this.getUserInfo(uid);
      } else {
        $api.showToast(res.message, 'none')
      }
    }).catch(err => {
      //隐藏loading
      wx.hideLoading();
      //修改状态  可点击兑换
      isConvert = false;
      //请求失败
      $api.showToast(err, 'none')
    })
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
      //请求成功 判断状态码
      if (res.code == 200) {
        //更新用户信息
        app.globalData.userInfo = res.data;
        this.setData({
          userInfo: res.data
        })
        //查询是否含有公告
        // console.log(res.data.account_status+"====>"+res.data.haveNotice)
        if (res.data.haveNotice) {
          this.getUserNotices(uid);
        }
      } else {
        this.setData({
          wxlogin: false
        })
        wx.removeStorageSync('uid');
        $api.showToast(res.message, 'none')
      }
    }).catch(err => {
      //请求失败
      $api.showToast(err, 'none')
    })
  },
  /**
   * 获取我的邀请记录
   * @param {*} id 
   */
  getInviteRecord: function (id) {
    //填充参数
    let data = {
      'id': id,
      'page': 1,
      'size': 5
    }
    //下面开始调用邀请记录接口
    $api.getInviteRecord(data).then(res => {
      //请求成功  判断状态码
      if (res.code == 200) {
        //邀请记录已获取标识
        isGetInviteData = false;
        this.setData({
          items: res.data.list
        })
      } else {
        $api.showToast(res.message, 'none');
      }

    }).catch(err => {
      //网络错误
      $api.showToast(err, 'none');
    })
  },
  /**
   * 获取用户公告
   * @param {*} id 
   */
  getUserNotices: function (id) {
    //填充参数
    let data = {
      'id': id
    }
    //调用获取用户公告
    $api.getUserNotice(data).then(res =>{
      //请求成功 判断状态码
      if(res.code == 200){
        let notice = res.data.p_desc;
        if(notice){
          $api.showModal('提示', notice, false);
        }
      }
    }).catch(err =>{
      //网络错误
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
  },

  //取消授权
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  }










})