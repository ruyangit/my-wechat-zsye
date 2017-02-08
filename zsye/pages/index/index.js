var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');

var weekdayStr = ['日', '一', '二', '三', '四', '五', '六'];

var app = getApp();

// var sliderData = [
//   { id: 1, image: "http://wx.zsye.com:20163/wxsmall/aazdpinpai_02.png", title: "小时候的动手能力" },
//   { id: 2, image: "http://wx.zsye.com:20163/wxsmall/newyear.png", title: "超越自我，成就未来" }
// ];

Page({
  data: {
    // pageData: {}, //列表数据
    //themeData: {}, //主题菜单数据
    sliderData: [], //轮播图数据
    currentDateStr: '',
    // currentDate: new Date(),
    refreshAnimation: {}, //加载更多旋转动画数据
    loadingMore: false, //是否正在加载
    avatarUrl: '',
    nickName: '',

    loading: false,
    loadingMsg: '加载中...',

    pageShow: 'none',

    maskDisplay: 'none',

    slideHeight: 0,
    slideRight: 0,
    slideWidth: 0,
    slideDisplay: 'block',
    screenHeight: 0,
    screenWidth: 0,
    slideAnimation: {},

    ballBottom: 20,
    ballRight: 30,
    ballOpacity: '.9',
    modalMsgHidden: true,
    themeId: 0,//当前主题id

    id: null,
    //pageShow: 'display',
    background: '',
    pageData: [], //列表数据源
    // editorData: [], //主编数据
    description: '',
    //loading: false,
    //loadingMsg: '数据加载中...'

    lastid: '',
    reqdate: '',
    babydate: '',
    babysex: 0,

    remindData: {},
    babyAgeDate: '宝宝健康成长'
  },
  onShareAppMessage: function () {
    return {
      title: '掌上育儿',
      desc: '更懂你的私人育儿管家',
      path: '/pages/index/index'
    }
  },

  //获取设备信息，屏幕的高度宽度
  onLoad: function () {
    var _this = this;
    //检查账户信息设置
    var babyData = app.globalData.babySetting;
    if (babyData.babyNickName == '' || babyData.babyDateValue == '') {
      wx.redirectTo({
        url: '../baby/setting/setting'
      });
    }

    // console.log(goUrl);

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          slideHeight: res.windowHeight,
          slideRight: res.windowWidth,
          slideWidth: res.windowWidth * 0.7
        });
      }
    });

    app.getUserInfo(function (data) {
      _this.setData({ avatarUrl: data.avatarUrl, nickName: data.nickName });
    });

  },

  //从详细页面返回时会刷新
  onShow: function () {
    // if (this.data.themeId == -1) {
    //   var pageData = wx.getStorageSync('pageData') || []
    //   console.log(pageData);
    //   this.setData({
    //     pageData: pageData
    //   })
    // }
  },

  onReady: function () {
    if (app.debug) {
      console.log('onReady');
    }
    var date = utils.getCurrentData();
    // this.setData({ currentDateStr: '今天'+date.month + '月' + date.day + '日' + '星期' + weekdayStr[date.weekday] });
    this.setData({ currentDateStr: '今天' + date.month + '月' + date.day + '日' });

    var _this = this;


    //请求banner信息
    requests.getCommonJson("/wxsmall/common.json", (data) => {
      // console.log(data);sliderData
      _this.setData({
        sliderData: data
      });
    });


    var babyData = app.globalData.babySetting;

    _this.setData({
      lastid: '',
      reqdate: utils.formatDate(new Date()),
      babydate: babyData.babyDateValue,
      babysex: babyData.babySex,
      pageData: []
    });

    let lastid = _this.data.lastid;
    let reqdate = _this.data.reqdate;
    let babydate = _this.data.babydate;
    let babysex = _this.data.babysex;

    _this.setData({ loading: true });
    requests.getHomeList(lastid, reqdate, babydate, babysex, (data) => {

      var result = data.result;
      let pageData = _this.data.pageData;

      _this.setData({ babyAgeDate: result.babyAgeDate });

      if (result.countList != null && result.countList.length >= 2) {
        _this.setData({
          reqdate: result.countList[result.countList.length - 1].reqdate
        });
      }

      pageData = pageData.concat(result.dataList)

      var date = new Date();
      for (var i in pageData) {
        var hour = date.getHours() * 60 * 60;
        var minute = date.getMinutes() * 60;
        var second = date.getSeconds();

        var sxs = hour + minute + second - parseInt(pageData[i].addminute);
        var dxs = new Date(pageData[i].reqdate);
        var value = new Date(dxs.getFullYear(), dxs.getMonth(), dxs.getDate(), 0, 0, sxs, 0);  //转换为Date对象
        pageData[i].datediff = utils.getDateDiff(value);

      }

      _this.setData({
        pageData: pageData,
        lastid: result.lastid
      });

      _this.setData({ pageShow: 'block' });
    }, null, () => {
      _this.setData({ loading: false });
      wx.stopPullDownRefresh();
    });

    //专家提醒getRemindList
    requests.getRemindList(reqdate, babydate, babysex, (data) => {
      let result = data.result;
      let remindData = result.dataList[0];
      _this.setData({ remindData: remindData });
    });
    //根据宝宝生日计算成长天数babyDateStr - babydate



  },

  //列表加载更多
  loadingMoreEvent: function (e) {
    if (app.debug) {
      console.log('loadingMoreEvent');
    }
    var _this = this;
    if (_this.data.loadingMore) return;

    // console.log(this.data.currentDate);


    // var date = new Date(Date.parse(this.data.currentDate) - 1000 * 60 * 60 * 24);
    // var _this = this;
    // var pageData = [];

    _this.setData({ loadingMore: true });
    updateRefreshIcon.call(_this);
    // var y = date.getFullYear();
    // var m = (date.getMonth() + 1);
    // var d = date.getDate();
    // m = m > 9 ? m : '0' + m;
    // d = d > 9 ? d : '0' + d;
    // var dateStr = [y, m, d].join('');

    let lastid = _this.data.lastid;
    let reqdate = _this.data.reqdate;
    let babydate = _this.data.babydate;
    let babysex = _this.data.babysex;

    requests.getHomeList(lastid, reqdate, babydate, babysex, (data) => {

      let result = data.result;
      let pageData = _this.data.pageData;

      if (result.countList != null && result.countList.length >= 2) {
        let n_reqdate = result.countList[result.countList.length - 1].reqdate;
        if (babydate != n_reqdate) {
          pageData.push({ readtype: '3', picList: [''], content: '时间：' + n_reqdate });
        }
        _this.setData({
          reqdate: n_reqdate
        });


      }

      pageData = pageData.concat(result.dataList)

      var date = new Date();
      for (var i in pageData) {
        var hour = date.getHours() * 60 * 60;
        var minute = date.getMinutes() * 60;
        var second = date.getSeconds();

        var sxs = hour + minute + second - parseInt(pageData[i].addminute);
        var dxs = new Date(pageData[i].reqdate);
        var value = new Date(dxs.getFullYear(), dxs.getMonth(), dxs.getDate(), 0, 0, sxs, 0);  //转换为Date对象
        pageData[i].datediff = utils.getDateDiff(value);
      }

      _this.setData({
        pageData: pageData,
        lastid: result.lastid
      });

    }, null, () => {
      _this.setData({ loadingMore: false });
    });



    // requests.getBeforeNews(dateStr, (data) => {
    //   data = utils.correctData(data);
    //   console.log(data);
    //   pageData = _this.data.pageData;
    //   pageData.push({ type: '3', title: ([y, m, d].join('.') + '  星期' + weekdayStr[date.getDay()]) });
    //   pageData = pageData.concat(data.stories);

    //   _this.setData({ currentDate: date, pageData: pageData });
    // }, null, () => {
    //   _this.setData({ loadingMore: false });
    // });
  },

  //浮动球移动事件
  // ballMoveEvent: function (e) {
  //   var touchs = e.touches[0];
  //   var pageX = touchs.pageX;
  //   var pageY = touchs.pageY;
  //   if (pageX < 25) return;
  //   if (pageX > this.data.screenWidth - 25) return;
  //   if (this.data.screenHeight - pageY <= 25) return;
  //   if (pageY <= 25) return;
  //   var x = this.data.screenWidth - pageX - 25;
  //   var y = this.data.screenHeight - pageY - 25;
  //   this.setData({
  //     ballBottom: y,
  //     ballRight: x
  //   });
  // },

  toDetailPage: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },
  toBannerPage: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activity/activity?id=' + id
    });
  },
  // toSettingPage: function () {
  //   wx.navigateTo({
  //     url: '../setting/setting'
  //   });
  // },
  //toCollectPage: function() {
  //  wx.redirectTo( {
  //    url: '../collect/collect'
  //  });
  //},

  // toHomePage: function (e) {
  //   var _this = this;
  //   _this.setData({ loading: true, themeId: 0 });
  //   console.log('themeId', _this.data.themeId);
  //   requests.getNewsLatest((data) => {
  //     data = utils.correctData(data);
  //     console.log(data);
  //     _this.setData({
  //       sliderData: data.top_stories,
  //       pageData: data.stories
  //     });
  //     slideDown.call(this);
  //     _this.setData({ pageShow: 'block' });
  //   }, null, () => {
  //     _this.setData({ loading: false });
  //   });
  // },

  // toThemePage: function (e) {
  //   var _this = this;
  //   _this.setData({ loading: true, themeId: e.currentTarget.dataset.id });
  //   console.log('themeId', _this.data.themeId);
  //   requests.getThemeStories(_this.data.themeId, (data) => {
  //     //console.log(data);
  //     data.background = data.background.replace("pic1.", "pic3.");
  //     data.background = data.background.replace("pic2.", "pic3.");
  //     for (var i = 0; i < data.editors.length; i++) {
  //       data.editors[i].avatar = data.editors[i].avatar.replace("pic1.", "pic3.");
  //       data.editors[i].avatar = data.editors[i].avatar.replace("pic2.", "pic3.");
  //     }
  //     data = utils.correctData(data);
  //     console.log(data);
  //     _this.setData({
  //       pageData: data.stories,
  //       background: data.background,
  //       description: data.description,
  //       editorData: data.editors
  //     });
  //     slideDown.call(this);
  //     //wx.setNavigationBarTitle( { title: data.name }); //设置标题
  //   }, null, () => {
  //     _this.setData({ loading: false });
  //   });
  // },

  // toCollectPage: function () {
  //   var _this = this;
  //   _this.setData({ themeId: -1 });
  //   var pageData = wx.getStorageSync('pageData') || []
  //   console.log(pageData);
  //   _this.setData({
  //     themeId: -1,
  //     pageData: pageData
  //   })
  //   //_this.setData( {
  //   //  pageData: data.stories,
  //   //  background: data.background,
  //   //  description: data.description,
  //   //  editorData: data.editors
  //   slideDown.call(this);
  //   //wx.setNavigationBarTitle( { title: data.name }); //设置标题

  // },
  //toThemePage: function( e ) {
  //  var themeId = e.currentTarget.dataset.id;
  //  console.log( 'themeId', themeId );
  //  wx.navigateTo( {
  //    url: '../theme/theme?themeId=' + themeId
  //  });
  //},

  //浮动球点击 侧栏展开
  ballClickEvent: function () {
    //slideUp.call(this);
    this.setData({ maskDisplay: 'block' });
  },

  //遮罩点击  侧栏关闭
  slideCloseEvent: function () {
    // slideDown.call(this);
    this.setData({ maskDisplay: 'none' });
  },

  authorShowEvent: function () {
    this.setData({ modalMsgHidden: false });
  },

  modalMsgHiddenEvent: function () {
    this.setData({ modalMsgHidden: true });
  },
  onClickMsgNo: function () {
    wx.showModal({
      title: '提示',
      content: '功能暂未开放！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        }
      }
    })
  }

  // onPullDownRefresh: function () {
  //   //console.log('onPullDownRefresh', new Date())
  //   this.onReady();
  // },
  // onReachBottom: function () {
  //   //console.log('onReachBottom', new Date())
  //   this.loadingMoreEvent();
  // }
});

//侧栏展开
function slideUp() {
  console.log('slideUp');
  var animation = wx.createAnimation({
    duration: 300
  });
  this.setData({ maskDisplay: 'block' });
  animation.translateX('100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
}

//侧栏关闭
function slideDown() {
  var animation = wx.createAnimation({
    duration: 300
  });
  animation.translateX('-100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
  this.setData({ maskDisplay: 'none' });
}


/**
 * 旋转上拉加载图标
 */
function updateRefreshIcon() {
  var deg = 360;
  var _this = this;

  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(function () {
    if (!_this.data.loadingMore)
      clearInterval(timer);
    animation.rotateZ(deg).step();
    deg += 360;
    _this.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
}