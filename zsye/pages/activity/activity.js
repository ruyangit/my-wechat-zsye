var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    id: '',
    bpicurl:'',
    loading: false,
    detail: {} //日报详情
  },
  onShareAppMessage: function () {
    return {
      title: this.data.detail.subject,
      desc: '更懂你的私人育儿管家',
      path: '/pages/activity/activity?id=' + this.data.id+'&bpicurl='+this.data.bpicurl
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;
    var id = options.id;
    var bpicurl = options.bpicurl;
    console.log(bpicurl);
    this.setData({ id: id ,bpicurl:bpicurl});
    requests.getActivityInfo(id, (data) => {
      let result = data.result;
      console.log(result);
      _this.setData({ loading: true });

      WxParse.wxParse('content', 'html', result.content, _this, 5);

      _this.setData({ detail: result });
      wx.setNavigationBarTitle({ title: result.subject }); //设置标题
    }, null, () => {
      _this.setData({ loading: false });
    });
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
  searchClickEvent: function () {
    wx.showToast({
      title: '暂无活动内容',
      // icon: 'loading',
      duration: 10000
    })

    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  }
})