//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;
const $util = require("../../utils/util");

Page({
  data:{
    baseurl: app.globalData.BASE_URL,
    items: [],
    topone: {},
    toptwo: {},
    topthree: {},
    userRanking: 0
  },
  onLoad:function(){
    let uid = wx.getStorageSync('uid');
    if (uid) {
      this.getInviteRankList(uid);
    }
  },
/**
   * 获取邀请排行榜
   * @param {*} id 
   */
  getInviteRankList: function (id) {
    //填充参数
    let data = {
      'id': id,
      'page': 1,
      'size': 30
    }
    //下面开始调用邀请排行榜接口
    $api.getInviteRankList(data).then(res => {
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
          dataList[i].tvSteps= $util.bigNumberTransform(dataList[i].invite_total);
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
      } else {
        $api.showToast(res.message, 'none');
      }
    }).catch(err => {
      //网络错误
      $api.showToast();
    })
  }
})