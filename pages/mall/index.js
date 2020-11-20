//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;



Page({
  data: {
    baseurl: app.globalData.BASE_URL,
    userInfo: app.globalData.userInfo,
    page: 1,
    hasNextPage: true,
    items: [],
    banners: [{
        "picUrl": "img/product/banner_01.png",
        "id":60
      },
      {
        "picUrl": "img/product/banner_02.png",
        "id":61
      },
      {
        "picUrl": "img/product/banner_03.png",
        "id":63
      }
    ]
  },
  //页面加载
  onLoad: function (e) {
    //获取商品列表
    this.products();
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  //下拉刷新触发函数
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    //导航条显示加载动画
    wx.showNavigationBarLoading();
    this.products()
  },
  //触底函数
  onReachBottom: function () {
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
  },
  /**
   * banner点击
   */
  tapBanner: function (e) {
    if(this.data.userInfo.coin_total){
      wx.navigateTo({
        url: '/pages/product/index?id=' + e.currentTarget.id + '&mycoin=' + this.data.userInfo.coin_total
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
      'size': 10
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
    if(this.data.userInfo.coin_total){
      wx.navigateTo({
        url: '/pages/product/index?id=' + e.currentTarget.id + '&mycoin=' + this.data.userInfo.coin_total
      })
    }
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
      url = '/pages/home/index?inviter_id=' + uid;
    } else {
      url = '/pages/home/index';
    }
    return {
      title: '换金币兑超值商品',
      query: url
    }
  }
})