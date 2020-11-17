Page({
 
  /**
   * 页面的初始数据
   */
  data: {
   
    maskData:[
      {
        showIndex: 0,
        title:'1.初次进入时，运动步数为什么不显示？',
        text:'请先确认你的“微信运动步数”是否授权小程序。如果确认已授权，仍无法显示，建议关闭小程序重新登录尝试'
      },
      {
        showIndex: 0,
        title:'2.如何开启微信运动步数？',
        text:'在微信内直接搜索“微信运动”，进入后点击“启用”，然后进入小程序允许授权，就能够显示你的运动步数了。',
      },
      {
        showIndex: 0,
        title:'3.我的步数增加了，为什么没有获得快币？',
        text:'每人每日的有效步数最多为20000步。例如：你当日行走了30000步，小程序平台只认定20000步为有效，超过后无法兑换金币。',
      },
      {
        showIndex: 0,
        title:'4.我邀请了好友，为什么金币没有增加？',
        text:'1、你邀请的好友不是新用户，无法给您带来奖励； \n 2、有违规作弊行为，系统判定你邀请的用户为无效邀请。',
      },
      {
        showIndex: 0,
        title:'5.金币会每日清零吗，能不能提现？',
        text:'金币可以累积不会清零，且不支持提现。',
      },
      {
        showIndex: 0,
        title:'6.步数会每日清零吗？',
        text:'小程序的步数数据来源于微信运动，并且会跟随微信运动每日清零。',
      },
      {
        showIndex: 0,
        title:'7.商城内兑换的商品什么时间发货呢？',
        text:'确认兑换后，我们会在1~5工作日内确认订单并安排发货，新疆、西藏暂不支持发货。',
      },
      {
        showIndex: 0,
        title:'8.下订单时填写错地址能够修改吗？',
        text:'目前不允许修改收货地址，请在下订单钱仔细确认您的收货地址和联系方式。由于填错地址或联系方式导致兑换商品无法收到，本小程序不承担任何责任。',
      },
      {
        showIndex: 0,
        title:'9.商城商品什么时间更新？',
        text:'商城中的可兑换商品库存每日不定时会更新，如果你本次兑换时显示剩余未0，可以隔一段时间再来兑换。',
      },
      {
        showIndex: 0,
        title:'10.兑换的商品不想要了能退货吗？',
        text:'目前小程序内所有商品暂不支持退还，兑换之前请确认好。',
      }

    ]
  },
 
  panel: function (e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.maskData;
    if (item[index].showIndex === 1) {
      item[index].showIndex = 0;
      this.setData({
        maskData: item
      })
    } else {
      item[index].showIndex = 1;
      this.setData({
        maskData: item
      })
    }
  },
 
 
})