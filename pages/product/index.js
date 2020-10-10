//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;

Page({
  data: {
    'baseurl': app.globalData.BASE_URL,
    'item': {}
  },
  onLoad: function (option) {
    //获取商品详情
    if (option.id > 0) {
      this.getProduct(option.id)
    }
  },
  //查询余额
  convertClick: function (e) {
    //填充参数
    let data = {
      'pid': e.currentTarget.id,
      'uid': wx.getStorageSync('uid')
    }
    //下面开始调用查询余额接口
    $api.checkBalance(data).then(res => {
      //请求成功
      wx.navigateTo({
        url: '/pages/place_order/index?id=' + e.currentTarget.id,
      })
    }).catch(err => {
      //请求失败
      wx.showToast({
        title: err,
      })
    })
  },
  //获取商品信息
  getProduct: function (id) {
    //填充参数
    let data = {
      'id': id
    }
    //下面开始调用商品详情接口
    $api.getProduct(data).then(res => {
      this.setData({
        item: res.data
      })
    }).catch(err => {
      //请求失败
      console.log(err);
    })
  }
})