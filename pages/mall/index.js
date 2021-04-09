//获取应用实例
const app = getApp();
const AUTH = require('../../utils/auth');
const $api = require("../../utils/api").API;
const $util = require("../../utils/util");



Page({
  data: {
    version: 109,
    baseurl: app.globalData.BASE_URL,
    canIUseGetUserProfile: false,
    userInfo: app.globalData.userInfo,
    wxlogin: true,
    page: 1,
    hasNextPage: true,
    items: [],
    banners: [{
        "picUrl": "img/product/banner_01.png",
        "id": 60
      },
      {
        "picUrl": "img/product/banner_02.png",
        "id": 61
      },
      {
        "picUrl": "img/product/banner_03.png",
        "id": 63
      }
    ],
    topone: {},
    toptwo: {},
    topthree: {},
    isreview: false
  },
  //页面加载
  onLoad: function (e) {
    //获取配置项
    this.getConfig();
    //处理新版获取用户信息api
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  //页面显示
  onShow: function (e) {
    //是否刷新
    if (wx.getStorageSync('pro_refresh') === 10) {
      //清除状态
      wx.removeStorageSync('pro_refresh');
      //刷新用户信息
      this.getUserInfo(wx.getStorageSync('uid'));
    }
    //刷新用户信息
    if (e) {
      app.globalData.userInfo = e;
      this.setData({
        wxlogin: true,
        userInfo: e
      })
      if (!e.stepsRank && e.id) {
        this.getUserInfo(e.id);
      }
    } else {
      this.setData({
        wxlogin: true,
        userInfo: app.globalData.userInfo
      })
    }
  },
  //下拉刷新触发函数
  onPullDownRefresh: function () {
    if (this.data.isreview) {
      this.setData({
        page: 1
      })
      //导航条显示加载动画
      wx.showNavigationBarLoading();
      this.products()
    }
  },
  //触底函数
  onReachBottom: function () {
    if (this.data.isreview) {
      if (this.data.hasNextPage) {
        //显示loading 框 需主动关闭
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.products()
      } else {
        wx.showToast({
          title: '没有更多数据',
        })
      }
    }
  },
  /**
   * banner点击
   */
  tapBanner: function (e) {
    let uid = wx.getStorageSync('uid');
    if (uid) {
      wx.navigateTo({
        url: '/pages/product/index?id=' + e.currentTarget.id + '&mycoin=' + this.data.userInfo.coin_total
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }

  },
  /**
   * 获取商品列表
   */
  products: function () {
    //填充参数
    let data = {
      'page': this.data.page,
      'size': 20
    }
    //下面开始调用商品列表接口
    $api.getProductList(data).then(res => {
      //关闭刷新
      this.cancelLoading();
      //请求成功  判断状态码
      if (res.code == 200) {
        let dataList = [];
        if (this.data.page > 1) {
          dataList = this.data.items.concat(res.data.list);
        } else {
          dataList = res.data.list;
        }
        this.setData({
          items: dataList,
          hasNextPage: res.data.hasNextPage,
          page: res.data.nextPage
        })
      } else {
        $api.showToast(res.message, 'none');
      }

    }).catch(err => {
      //请求失败
      console.log(err);
      //关闭刷新
      this.cancelLoading();
      //网络错误
      $api.showToast();
    })
  },
  /**
   * 关闭刷新
   */
  cancelLoading: function () {
    //隐藏loading框
    wx.hideLoading();
    //隐藏导航条加载动画
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
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
        // $api.showToast(res.message, 'none')
      }
    }).catch(err => {
      //请求失败
      // $api.showToast(err, 'none')
    })
  },

  /**
   * 列表点击
   * @param {*} e 
   */
  tabClick: function (e) {
    let uid = wx.getStorageSync('uid');
    if (uid) {
      wx.navigateTo({
        url: '/pages/product/index?id=' + e.currentTarget.id + '&mycoin=' + this.data.userInfo.coin_total
      })
    } else {
      this.setData({
        wxlogin: false
      })
    }
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
  //取消授权
  cancelLogin() {
    this.setData({
      wxlogin: true
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
  /**
   * 获取步数排行榜
   * @param {*} id 
   */
  getStepsRankList: function (id) {
    //填充参数
    let data = {
      'id': id,
      'page': 1,
      'size': 50
    }
    //下面开始调用步数排行榜接口
    $api.getStepsRankList(data).then(res => {

      //请求成功 判断状态码
      if (res.code == 200) {
        let dataList = [];
        if (this.data.page > 1) {
          dataList = this.data.items.concat(res.data.rankList);
        } else {
          dataList = res.data.rankList;
        }
        //遍历数据 处理步数num
        for (var i = 0; i < dataList.length; i++) {
          dataList[i].tvSteps = $util.bigNumberTransform(dataList[i].steps_total);
        };
        //取出前三名数据
        let one = dataList[0];
        let two = dataList[1];
        let three = dataList[2];
        //排序列表移除前三名信息
        dataList.splice(0, 3);

        this.setData({
          items: dataList,
          topone: one,
          toptwo: two,
          topthree: three,
          userRanking: res.data.userRanking
        })
        //隐藏loading
        wx.hideLoading();
      } else {
        //隐藏loading
        wx.hideLoading();
        $api.showToast(res.message, 'none');
      }
    }).catch(err => {
      //隐藏loading
      wx.hideLoading();
      //网络错误
      $api.showToast(err.message, 'none');
    })
  },
  /**
   * 获取配置项
   */
  getConfig: function () {
    let data = {};
    //显示loading
    wx.showLoading({
      title: '加载中',
    })
    $api.getConfig(data).then(res => {
      //请求成功 判断状态码
      if (res.code == 200) {
        let vcode = res.data.version;
        //如果小于等于当前版本号 就显示商品模块 否则 榜单
        this.setData({
          isreview: this.data.version < vcode ? true : false
        });

        if (this.data.isreview) {
          //获取商品列表
          this.products();
        } else {
          this.getStepsRankList(22);
        }
      } else {
        //隐藏loading
        wx.hideLoading();
        $api.showToast(res.message, 'error');
      }
    }).catch(err => {
      //隐藏loading
      wx.hideLoading();
      //网络错误
      $api.showToast('访问失败', 'error');
    });
  }
})