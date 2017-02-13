var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var app = getApp();
Page({
  data: {
    showTopTips: false,

    babySexNames: ["男", "女", "未知"],
    babySexValues: [1, 2, 0],
    babySexIndex: 0,

    babyAvatarUrl: '',
    babyNickName: '',
    babyDateValue: utils.formatDate(new Date())
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindDateChange: function (e) {
    this.setData({
      babyDateValue: e.detail.value
    })
  },
  bindSexChange: function (e) {
    this.setData({
      babySexIndex: e.detail.value
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    let _this = this;
    if (app.globalData.babySetting.babyNickName == '') {
      app.getUserInfo(function (data) {
        _this.setData({ babyAvatarUrl: data.avatarUrl, babyNickName: data.nickName });
      });
    }

    // //初始化缓存数据
    var settingBabyData = wx.getStorageSync(app.constant.SETTING_BABY);
    if (settingBabyData) {

      // this.globalData.babySetting = settingBabyData;
      let babySex = settingBabyData.babySex;
      let babySexIndex = 2;
      if (babySex == 1) {
        babySexIndex = 0;
      } else if (babySex == 2) {
        babySexIndex = 1;
      }

      _this.setData({
        babyAvatarUrl: settingBabyData.babyAvatarUrl,
        babyNickName: settingBabyData.babyNickName,
        babyDateValue: settingBabyData.babyDateValue,
        babySexIndex: babySexIndex
      });
    }

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  bindKeyInput: function (e) {
    this.setData({
      babyNickName: e.detail.value
    })
  },
  btnStart: function () {
    var _this = this;
    if (_this.data.babyNickName == "") {
      this.showTopTips();
      return null;
    }
    var data = {
      babyAvatarUrl: _this.data.babyAvatarUrl,
      babyNickName: _this.data.babyNickName,
      babyDateValue: _this.data.babyDateValue,
      babySex: _this.data.babySexValues[_this.data.babySexIndex]
    };
    app.globalData.babySetting = data;
    try {
      wx.setStorageSync(app.constant.SETTING_BABY, data);

      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })

      wx.switchTab({
        url: '../index/index'
      });


    } catch (e) {
      console.error(e);
    }

  }
});