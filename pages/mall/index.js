//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;



Page({
  data: {
    baseurl: app.globalData.BASE_URL,
    page: 1,
    hasNextPage: true,
    items: [],
    banners: [{
        "picUrl": "https://dcdn.it120.cc/2019/12/29/8396f65d-d615-46d8-b2e5-aa41820b9fe5.png"
      },
      {
        "picUrl": "https://dcdn.it120.cc/2019/12/29/daca65ee-4347-4792-a490-ccbac4b3c1d7.png"
      },
      {
        "picUrl": "https://dcdn.it120.cc/2019/12/29/2e79921a-92b3-4d1d-8182-cb3d524be5fb.png"
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
    // if (wx.getStorageSync('pro_refresh') === 10) {
    //   //清除状态
    //   wx.removeStorageSync('pro_refresh');
    //   //回到顶部
    //   this.goTop();
    //   //刷新商品列表
    //   this.onPullDownRefresh();
    // }
  },
  //下拉刷新触发函数
  onPullDownRefresh: function () {
    console.log("12345");
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

  tabClick: function (e) {
    wx.navigateTo({
      url: '/pages/product/index?id=' + e.currentTarget.id,
    })
  }
})