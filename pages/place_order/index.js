//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;

// 在页面中定义激励视频广告
var videoAd = null

Page({
  data: {
    baseurl: app.globalData.BASE_URL,
    userid: wx.getStorageSync('uid'),
    item: {},
    address: {}
  },
  onLoad: function (e) {
    //获取商品详情
    if (e.id > 0) {
      this.getProduct(e.id)
    }
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-8892aa0bddba8e1c'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      //监听用户关闭广告
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          console.log("正常播放结束，可以下发游戏奖励");
          this.placeDialog();
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showModal({
            title: '提示',
            content: '看完完整的广告才可以下单哦~\n（ 广告是为了更多的免费 ）',
            showCancel: false
          })
        }
      })
    }
  },
  onShow: function (e) {
    //获取用户收货地址
    if (this.data.userid) {
      this.getAddress(this.data.userid);
    }
  },
  /**
   * 我的地址
   */
  toMyAddress: function () {
    //去编辑收货地址
    wx.navigateTo({
      url: '/pages/address/index',
    })
  },
  //点击下单
  convertClick: function (e) {
    //判断收货地址
    if (!this.data.address.address) {
      wx.showModal({
        title: '提示',
        content: '请先添加收货地址，以保证您选择的商品正常兑换！~',
        showCancel: false
      })
      return;
    }

    //用户确认下单
    wx.showModal({
      title: '提示',
      content: '需要看完一段广告才可进行下单 ~\n（ 广告是为了更多的免费 ）',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          // 用户触发广告后，显示激励视频广告
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                  console.log('激励视频 广告显示失败')
                })
            })
          }
        } else {
          //取消下单
          wx.showToast({
            title: '取消下单',
          })
        }
      }
    })

  },
  /**
   * 用户确认下单
   */
  placeDialog: function () {
    let that = this;
    //用户确认下单
    wx.showModal({
      title: '提示',
      content: '下单成功后我们扣除您对应的金币！~',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          //确认下单
          let pid = that.data.item.id;
          let uid = that.data.userid;
          let adid = that.data.address.id;
          that.placeOrder(pid, uid, adid);
        } else {
          //取消下单
          wx.showToast({
            title: '取消下单',
          })
        }
      }
    })
  },

  /**
   * 获取商品信息
   * @param {*商品id} id 
   */
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
  },

  /**
   * 获取收货地址
   * @param {*用户id} uid 
   */
  getAddress: function (uid) {
    //填充参数
    let data = {
      'id': uid
    }
    //下面开始调用获取收货地址接口
    $api.getAddress(data).then(res => {
      this.setData({
        address: res.data
      })
    }).catch(err => {
      //请求失败
      console.log(err);
    })
  },

  /**
   * 用户确认下单 进行扣款
   * @param {*商品id} pid  
   * @param {*用户id} uid  
   */
  placeOrder: function (pid, uid, adid) {
    //显示loading
    wx.showLoading({
      title: '兑换中',
    })
    //填充参数
    let data = {
      'pid': pid,
      'uid': uid,
      'adid': adid
    }
    //下面开始调用用户下单扣款接口
    $api.placeOrder(data).then(res => {
      //隐藏loading
      wx.hideLoading();
      //请求成功  判断状态码
      if (res.code == 200) {
        //tips
        $api.showToast(res.message, 'success')
        //延时跳转
        setTimeout(this.jumpSUccess, 1000);
      } else {
        $api.showModal('提示', res.message, false);
      }
    }).catch(err => {
      //隐藏loading
      wx.hideLoading();
      //请求失败
      $api.showToast(err, 'none')
    })
  },
  jumpSUccess: function () {
    //关闭当前页和商品详情页
    wx.navigateBack({
      delta: 2,
    })
    //保存商品列表刷新状态
    wx.setStorageSync('pro_refresh', 10)
    //跳转成功页
    wx.navigateTo({
      url: '/pages/order_complete/index',
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