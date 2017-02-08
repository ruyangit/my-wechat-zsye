App({
  onLaunch: function () {
    var _this = this;
    //获取应用设置
    var settingData = wx.getStorageSync(_this.constant.SETTING);
    if (settingData) {
      this.globalData.appSetting = settingData;
    }
    //baby信息获取
    var settingBabyData = wx.getStorageSync(_this.constant.SETTING_BABY);
    if (settingBabyData) {
      this.globalData.babySetting = settingBabyData;
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {
          // let code = data.code;
          if (that.debug) {
            //微信登录
            that.globalData.appSetting.wxCode = data.code;


            var appid = 'wx362cc582a5623e1d'; //填写微信小程序appid  
            var secret = 'f9b1f11f821d2c9acf316fca010c43d0'; //填写微信小程序secret  

            //调用request请求api转换登录凭证  
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + data.code,
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res) //获取openid  
              }
            });

          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              if (that.debug) { console.log(res); }
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //更新应用设置
  updateAppSetting: function (data) {
    var _this = this;
    try {
      wx.setStorageSync(_this.constant.SETTING, data);
    } catch (e) {
      return false;
    }
    return true;
  },
  //获取缓存
  getCache: function () {
    return wx.getStorageSync(_this.constant.CACHE);
  },
  globalData: {
    userInfo: null,
    //应用设置
    appSetting: {
      theme: 'light', //主题
      noPicMode: false, //无图模式
      wxCode: ''
    },
    babySetting: {
      babyAvatarUrl:'',
      babyNickName: '',
      babyDateValue: '',
      babySex: 0
    }
  },
  constant: {
    SETTING: 'ZHANGY_SETTING',
    SETTING_BABY: 'ZHANGY_SETTING_BABY',
    CACHE: 'ZHANGY_CACHE'
  },
  debug: false //程序调试
})