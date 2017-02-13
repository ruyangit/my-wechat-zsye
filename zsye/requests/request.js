var util = require('../utils/util.js');
var api = require('./api.js');

var app = getApp();

/**
 * 网络请求方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestData(options, successCallback, errorCallback, completeCallback) {
    if (app.debug) {
        console.log('request options: ', options);
    }
    wx.request({
        url: options.url,
        data: options.data,
        method: options.method,
        dataType: options.dataType,
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
            if (app.debug) {
                console.log('response data: ', res);
            }
            if (res.statusCode == 200)
                util.isFunction(successCallback) && successCallback(JSON.parse(res.data));
            else
                util.isFunction(errorCallback) && errorCallback();
        },
        error: function () {
            util.isFunction(errorCallback) && errorCallback();
        },
        complete: function () {
            util.isFunction(completeCallback) && completeCallback();
        }
    });
}
//
function getCommonJson(url, successCallback, errorCallback, completeCallback){
    var options = api.getBase({});
    options.url = options.url+url;
    requestData(options, successCallback, errorCallback, completeCallback);
}

function getHomeList(lastid, reqdate, babydate, babysex, successCallback, errorCallback, completeCallback) {
    requestData(api.getHomeList(lastid, reqdate, babydate, babysex), successCallback, errorCallback, completeCallback);
}

function getReadInfo(evereadid, successCallback, errorCallback, completeCallback) {
    requestData(api.getReadInfo(evereadid), successCallback, errorCallback, completeCallback);
}

function getCommentList(evereadid, successCallback, errorCallback, completeCallback) {
    requestData(api.getCommentList(evereadid), successCallback, errorCallback, completeCallback);
}

function getRemindList(reqdate, babydate, babysex, successCallback, errorCallback, completeCallback) {
    requestData(api.getRemindList(reqdate, babydate, babysex), successCallback, errorCallback, completeCallback);
}

function getTopStoryList(babydate, successCallback, errorCallback, completeCallback) {
    requestData(api.getTopStoryList(babydate), successCallback, errorCallback, completeCallback);
}



module.exports = {
    getCommonJson:getCommonJson,
    getHomeList: getHomeList,
    getReadInfo: getReadInfo,
    getCommentList: getCommentList,
    getRemindList:getRemindList,
    getTopStoryList:getTopStoryList
    
};