var requests = require( '../../requests/request.js' );

Page( {
  data: {
    acskey: null,
    loading: false,
    toastHidden: true,
    commentData: [],
    loadingMsg: '加载中...',
    toastMsg: ''
  },

  //获取传递过来的日报id 和 评论数目
  onLoad: function( options ) {
    var acskey = options[ 'id' ];
    // var longCommentCount = parseInt( options[ 'lcount' ] );
    // var shortCommentCount = parseInt( options[ 'scount' ] );
    this.setData( { acskey: acskey });
  },

  //加载长评列表
  onReady: function() {
    var acskey = this.data.acskey;
    var _this = this;
    this.setData( { loading: true, toastHidden: true });

    //如果长评数量大于0，则加载长评，否则加载短评
    // if( this.data.longCommentCount > 0 ) {
    //   requests.getStoryLongComments( storyId, ( data ) => {
    //     console.log( data );
    //     _this.setData( { longCommentData: covertDate(data.comments) });
    //   }, () => {
    //     _this.setData( { toastHidden: false, toastMsg: '请求失败' });
    //   }, () => {
    //     _this.setData( { loading: false });
    //   });
    // } else {
    //   loadShortComments.call( this );
    // }
    loadComments.call( this );
  },

  //加载短评列表
  loadCommentEvent: function() {
    //已经夹在过就无需再次加载 判断是否为null
    if( this.data.commentData )
      return;
    loadComments.call( this );
  },

  toastChangeEvent: function() {
    this.setData( { toastHidden: true });
  },

  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
});

/**
 * 加载短评列表
 */
function loadComments() {
  var acskey = this.data.acskey;
  var _this = this;
  this.setData( { loading: true, toastHidden: true });


  requests.getCommentList( acskey, ( data ) => {
    let result = data.result
    // console.log(result);
    _this.setData( { commentData: result });
  }, () => {
    _this.setData( { toastHidden: false, toastMsg: '请求失败' });
  }, () => {
    _this.setData( { loading: false });
  });
}
