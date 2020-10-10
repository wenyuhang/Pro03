//获取应用实例
const app = getApp();
const $api = require("../../utils/api").API;



Page({
  data: {
    'baseurl':app.globalData.BASE_URL,
    'page' : 1,
    'hasNextPage' : true,
    "items": [
    ],
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
  onLoad:function(e){
    //获取商品列表
    this.products();
  },
  //触底函数
  onReachBottom: function() {
    if (this.data.hasNextPage) {
      this.products(this.data.page)
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
      
      let dataList = this.data.items.concat(res.data.list);
     
      this.setData({
        items:dataList,
        hasNextPage : res.data.hasNextPage,
        page : res.data.nextPage
      })
    }).catch(err => {
      //请求失败
      console.log(err);
    })
  },


  tabClick: function (e) {
    wx.navigateTo({
      url: '/pages/product/index?id=' + e.currentTarget.id,
    })
  }
})