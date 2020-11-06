//index.js
//获取应用实例
const app = getApp();
const AUTH = require('../../utils/auth');
const $api = require("../../utils/api").API;

//获取微信运动 拒绝后不再获取
var isGetRunData = true;
//是否已经点击兑换 
var isConvert = false;

Page({
  data: {
    wxlogin: true,
    userInfo: app.globalData.userInfo,
    coin: 0.00,
    steps: 0,
    items: []
  },
  //事件处理函数
  onLoad: function () {

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
      //获取微信运动 拒绝后不再获取
      if (res && isGetRunData) {
        //获取微信步数
        wx.getWeRunData({
          success: (result) => {
            const encryptedData = result.encryptedData;
            isGetRunData = true;
            // 发送请求 处理数据
            let data = {
              'uid': wx.getStorageSync('uid'),
              'data': encryptedData,
              'iv': result.iv
            }
            this.getRunSteps(data);
          },
          fail: (err) => {
            console.log(err);
            isGetRunData = false;
          }
        })
      }
      //获取用户信息
      let uid = wx.getStorageSync('uid');
      if (!e && !this.data.userInfo.openid && res && uid) {
        this.getUserInfo(uid);
      }
      //获取邀请用户列表
      if(uid){
        this.getInviteRecord(uid);
      }
    })
  },
  /**
   * 按钮点击 步数兑换金币
   */
  converClick: function () {
    //判断是否点击兑换 防止二次点击
    if(isConvert)return
    let steps = this.data.steps;
    let that = this;
    if (steps === 0) {
      $api.showModal('兑换提示', '步数为0无法兑换金币，多走一点步数再来兑换吧~', false);
      return;
    }
    let uid = wx.getStorageSync('uid');
    if (uid) {
      let coin = steps / 1000;
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
  //授权登录 获取用户信息回调
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none'
      })
      return;
    }
    AUTH.userLogin(this);
  },
  /**
   * 获取当日可兑换步数
   * @param {*请求参数} data 
   */
  getRunSteps: function (data) {
    $api.getRunSteps(data).then(res => {
      //请求成功 判断状态码
      if (res.code == 200) {
        //可兑换运动步数
        this.setData({
          steps: res.data
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
  convertSteps: function (uid) {
    isConvert = true;
    //封装请求参数
    let data = {
      'id': uid
    }
    $api.convertSteps(data).then(res => {
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

      } else {
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
    console.log(url)
    return {
      title: '步数多多',
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
      url = '/pages/home/index?inviter_id=' + uid;
    } else {
      url = '/pages/home/index';
    }
    return {
      title: '步数多多',
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