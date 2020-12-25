//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;

Page({
  data: {
    baseurl: app.globalData.BASE_URL,
    coin_total: 0,
    item: {},
    convertList:[]
  },
  onLoad: function (option) {
    //获取商品详情
    if (option.id > 0) {
      this.getProduct(option.id);
      this.getProConvertList(option.id);
    }
    //用户金币总数
    if (option.mycoin) {
      this.setData({
        coin_total: option.mycoin
      })
    }

  },
  //查询余额
  convertClick: function (e) {
    //判断库存
    if (this.data.item.stock <= 0) {
      wx.showModal({
        title: '提示',
        content: '商品已被兑换完毕，工作人员正在加紧补货！~',
        showCancel: false
      })
    } else {
      //填充参数
      let data = {
        'pid': e.currentTarget.id,
        'uid': wx.getStorageSync('uid')
      }
      //下面开始调用查询余额接口
      $api.checkBalance(data).then(res => {
        //请求成功  判断状态码
        if (res.code == 200) {
          wx.navigateTo({
            url: '/pages/place_order/index?id=' + e.currentTarget.id,
          })
        } else {
          $api.showModal('提示', res.message, false);
        }
      }).catch(err => {
        //请求失败
        wx.showToast({
          title: err,
          icon: 'none'
        })
      })
    }

  },
  //获取商品信息
  getProduct: function (id) {
    //填充参数
    let data = {
      'id': id
    }
    //下面开始调用商品详情接口
    $api.getProduct(data).then(res => {
      //请求成功  判断状态码
      if (res.code == 200) {
        this.setData({
          item: res.data
        })
      } else {
        $api.showToast(res.message, 'none');
      }
    }).catch(err => {
      //请求失败
      console.log(err);
      $api.showToast(res.message, 'none');
    })
  },
  //获取商品兑换记录
  getProConvertList: function (id) {
    //填充参数
    let data = {
      'page':1,
      'size':10,
      "isApp":1,
      'id': id
    }
    //下面开始调用商品详情接口
    $api.getProConvertList(data).then(res => {
      //请求成功  判断状态码
      if (res.code == 200) {
        this.setData({
          convertList: res.data.list
        })

      } else {
        $api.showToast(res.message, 'none');
      }
    }).catch(err => {
      //请求失败
      console.log(err);
      $api.showToast(res.message, 'none');
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
  }
})