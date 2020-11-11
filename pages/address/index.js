//index.js
//获取api实例
const $api = require("../../utils/api").API;

Page({
  data: {
    userid: wx.getStorageSync('uid'),
    address: {},
    region: [],
  },
  onLoad: function (e) {
    let uid = wx.getStorageSync('uid');
    this.setData({
      userid:uid
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
    let obj = this.data.address;
    obj.receiver = e.detail.value;
    this.setData({
      address: obj
    })
  },
  /**
   * 手机号码输入监听
   * @param {*} e 
   */
  mobileInput: function (e) {
    let obj = this.data.address;
    obj.mobile = e.detail.value;
    this.setData({
      address: obj
    })
  },
  /**
   * 详细地址输入监听
   * @param {*} e 
   */
  addressInput: function (e) {
    let obj = this.data.address;
    obj.address = e.detail.value;
    this.setData({
      address: obj
    })
  },
  /**
   * 邮政编码输入监听
   * @param {*} e 
   */
  postInput: function (e) {
    let obj = this.data.address;
    obj.post = e.detail.value;
    this.setData({
      address: obj
    })
  },
  /**
   * 省市区选择器
   */
  bindRegionChange: function (e) {
    let value = e.detail.value;
    let obj = this.data.address;
    obj.province = value[0];
    obj.city = value[1];
    obj.area = value[2];
    this.setData({
      address: obj,
      region: value
    })
  },
  /**
   * 保存编辑
   */
  confirmClick: function () {
    let address = this.data.address;
    //收货人
    if (!address.receiver) {
      this.showToast('请输入收货人姓名');
      return;
    }
    //手机号码
    if (!address.mobile) {
      this.showToast('请输入11位手机号码');
      return;
    }
    //地址
    if (this.data.region.length <= 0) {
      this.showToast('请选择收货地区');
      return;
    }
    //详细地址
    if (!address.address) {
      this.showToast('请输入详细地址');
      return;
    }
    //邮政编码
    if (!address.post) {
      this.showToast('请输入邮政编码');
      return;
    }


    //填充参数
    let data = {
      "uid": this.data.userid,
      "receiver": address.receiver,
      "address": address.address,
      "mobile": address.mobile,
      "province": address.province,
      "city": address.city,
      "area": address.area,
      "post": address.post
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
      //新增完成
      this.showToast(res.message);
      //关闭当前页面
      setTimeout(this.finish, 1000);
    }).catch(err => {
      //关闭loading
      this.hideLoading();
      //请求失败
      this.showToast(err);
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
      //新增完成
      this.showToast(res.message);
      //关闭当前页面
      setTimeout(this.finish, 1000);
    }).catch(err => {
      //关闭loading
      this.hideLoading();
      //请求失败
      this.showToast(err);
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