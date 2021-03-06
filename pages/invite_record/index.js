//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;

Page({
  data: {
    baseurl: app.globalData.BASE_URL,
    page: 1,
    hasNextPage: true,
    items: []
  },
  onLoad: function (e) {
    let uid = wx.getStorageSync('uid');
    if (uid) {
      this.getInviteRecord(uid);
    }
  },
   //触底函数
   onReachBottom: function () {
    if (this.data.hasNextPage) {
      //显示loading 框 需主动关闭
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      let uid = wx.getStorageSync('uid');
      this.getInviteRecord(uid)
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  /**
   * 获取我的邀请记录
   * @param {*} id 
   */
  getInviteRecord: function (id) {
    //填充参数
    let data = {
      'id': id,
      'page': this.data.page,
      'size': 20
    }
    //下面开始调用邀请记录接口
    $api.getInviteRecord(data).then(res => {
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
  }
})