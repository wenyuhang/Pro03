//index.js
//获取api实例
const $api = require("../../utils/api").API;

Page({
  data: {
    userid: wx.getStorageSync('uid'),
    address: {},
    item: {},
    region: [],
  },
  onLoad: function (e) {
    let uid = wx.getStorageSync('uid');
    this.setData({
      userid: uid
    })
    //获取用户收货地址
    if (uid) {
      this.getAddress(uid);
    }
  },
  /**
   * 收货人输入监听
   * @param {*} e 
   */
  receiverInput: function (e) {
    let obj = this.data.item;
    obj.receiver = e.detail.value;
  },
  /**
   * 手机号码输入监听
   * @param {*} e 
   */
  mobileInput: function (e) {
    let obj = this.data.item;
    obj.mobile = e.detail.value;
  },
  /**
   * 详细地址输入监听
   * @param {*} e 
   */
  addressInput: function (e) {
    let obj = this.data.item;
    obj.address = e.detail.value;
  },
  /**
   * 邮政编码输入监听
   * @param {*} e 
   */
  postInput: function (e) {
    let obj = this.data.item;
    obj.post = e.detail.value;
  },
  /**
   * 省市区选择器
   */
  bindRegionChange: function (e) {
    let value = e.detail.value;
    let obj = this.data.item;
    obj.province = value[0];
    obj.city = value[1];
    obj.area = value[2];
    this.setData({
      region: value
    })
  },
  /**
   * 比较两个字符串 类型 值
   * @param {*} str1 
   * @param {*} str2 
   */
  equalsString: function (str1, str2) {
    if (str2 == null || str2.length == 0 || str1 === str2) {
      return true;
    }
    return false;
  },
  isEmpty: function (params) {
    if (params == null || params.length == 0) {
      return true;
    }
    return false;
  },

  /**
   * 保存编辑
   */
  confirmClick: function () {
    let address = this.data.address;
    let item = this.data.item;

    //收货人
    if (!address.receiver || (item.receiver != null && item.receiver.length == 0)) {
      this.showToast('请输入收货人姓名');
      return;
    }
    //手机号码
    if (!address.mobile || (item.mobile != null && item.mobile.length == 0)) {
      this.showToast('请输入11位手机号码');
      return;
    }
    //地址
    if (this.data.region.length <= 0) {
      this.showToast('请选择收货地区');
      return;
    }
    //详细地址
    if (!address.address || (item.address != null && item.address.length == 0)) {
      this.showToast('请输入详细地址');
      return;
    }
    //邮政编码
    // if (!address.post) {
    //   this.showToast('请输入邮政编码');
    //   return;
    // }



    //判断是否需要update
    if (this.equalsString(address.receiver, item.receiver) &&
      this.equalsString(address.mobile, item.mobile) &&
      this.equalsString(address.province, item.province) &&
      this.equalsString(address.city, item.city) &&
      this.equalsString(address.area, item.area) &&
      this.equalsString(address.address, item.address)
      // &&this.equalsString(address.post,item.post)
    ) {
      //关闭当前页面
      setTimeout(this.finish, 1000);
      return;
    }


    //填充参数
    let data = {
      "uid": this.data.userid,
      "receiver": this.isEmpty(item.receiver) ? address.receiver : item.receiver,
      "address": this.isEmpty(item.address) ? address.address : item.address,
      "mobile": this.isEmpty(item.mobile) ? address.mobile : item.mobile,
      "province": this.data.region[0],
      "city": this.data.region[1],
      "area": this.data.region[2],
      "post": '100000'
    }

    //判断新增还是更新
    if (address.createdate) {
      //更新
      this.updateAddress(data);
    } else {
      //新增
      this.addAddress(data);
    }
  },
  /**
   * tips
   * @param {*} e 
   */
  showToast: function (e) {
    if (!e) return;
    wx.showToast({
      title: e,
      icon: 'none'
    })
  },
  /**
   * 显示loading
   */
  showLoading: function (e) {
    wx.showLoading({
      title: e,
      mask: true
    })
  },
  /**
   * 关闭loading
   */
  hideLoading: function () {
    wx.hideLoading();
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
    //显示loading框 需要主动关闭
    this.showLoading('加载中...');
    //下面开始调用获取收货地址接口
    $api.getAddress(data).then(res => {
      //关闭loading
      this.hideLoading();
      this.setData({
        address: res.data,
        region: [res.data.province, res.data.city, res.data.area]
      })
    }).catch(err => {
      //关闭loading
      this.hideLoading();
      //请求失败
      this.showToast(err);
    })
  },
  /**
   * 新增收货地址
   */
  addAddress: function (data) {
    //显示loading框 需要主动关闭
    this.showLoading('处理中...');
    //下面开始调用新增收货地址接口
    $api.addAddress(data).then(res => {
      //关闭loading
      this.hideLoading();
      //请求成功  判断状态码  新增完成
      if (res.code == 200) {
        $api.showToast(res.message, 'success');
        //关闭当前页面
        setTimeout(this.finish, 1000);
      } else {
        $api.showToast(res.message, 'none');
      }
      
    }).catch(err => {
      //关闭loading
      this.hideLoading();
      //请求失败
      $api.showToast(err, 'none');
    })
  },
  /**
   * 更新收货地址
   */
  updateAddress: function (data) {
    data.id = this.data.address.id;
    data.createdate = this.data.address.createdate
    //显示loading框 需要主动关闭
    this.showLoading('处理中...');
    //下面开始调用新增收货地址接口
    $api.updateAddress(data).then(res => {
     //关闭loading
     this.hideLoading();
     //请求成功  判断状态码  更新完成
     if (res.code == 200) {
       $api.showToast(res.message, 'success');
       //关闭当前页面
       setTimeout(this.finish, 1000);
     } else {
       $api.showToast(res.message, 'none');
     }
    }).catch(err => {
      //关闭loading
      this.hideLoading();
      //请求失败
      $api.showToast(err, 'none');
    })
  },
  /**
   * 关闭当前页面
   */
  finish: function () {
    wx.navigateBack({
      delta: 1,
    });
  }

})