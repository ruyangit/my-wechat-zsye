const API_BASE = 'https://wx.zsye.com';
//const API_BASE = 'http://127.0.0.1:8080';
const API_ACS = API_BASE + '/zhangy/servlet/ACSClientHttp';

const def = {
    imei: '0000000',
    appcode: 'ZHANGY',
    devicetype: 'wx',
    version: 'v0.1',
    request_code: 1,
    page: 1,
    pagesize: 10
};

const getBase = (options) => {
    options.url = API_BASE;
    options.method = options.method || 'GET';
    options.dataType = 'JSON';
    return options;
}

const getOptions = (options) => {
    options = getBase(options);
    options.url = API_ACS;
    for (var i in def) {
        options.data[i] = options.data[i] || def[i];
    }
    return options;
}

const getHomeList = (lastid, reqdate, babydate, babysex) => {
    var options = {
        data: {
            beanName: 'zhangyreadhttpservice',
            methodName: 'getHomeList',
            lastid: lastid,
            reqdate: reqdate,
            babydate: babydate,
            babysex: babysex
        }
    }
    return getOptions(options);
}

const getReadInfo = (evereadid) => {
    var options = {
        data: {
            beanName: 'zhangyreadhttpservice',
            methodName: 'getReadInfo',
            evereadid: evereadid,
            isaddhtml: 0
        }
    }
    return getOptions(options);
}

const getCommentList = (evereadid) => {
    var options = {
        data: {
            beanName: 'zhangyreadhttpservice',
            methodName: 'getCommentList',
            evereadid: evereadid
        }
    }
    return getOptions(options);
}

const getRemindList = (reqdate, babydate, babysex) => {
    var options = {
        data: {
            beanName: 'zhangyreadhttpservice',
            methodName: 'getRemindList',
            reqdate: reqdate,
            babydate: babydate,
            babysex: babysex
        }
    }
    return getOptions(options);
}

const getTopStoryList = (babydate) => {
    var options = {
        data: {
            beanName: 'zhangysonghttpservice',
            methodName: 'getTopStoryList',
            babydate: babydate
        }
    }
    return getOptions(options);
}
const getActivityList = (babydate, viewtype) => {
    var options = {
        data: {
            beanName: 'zhangyreadhttpservice',
            methodName: 'getActivityList',
            babydate: babydate,
            viewtype: viewtype
        }
    }
    return getOptions(options);
}
const getActivityInfo = (activityid) => {
    var options = {
        data: {
            beanName: 'zhangyreadhttpservice',
            methodName: 'getActivityInfo',
            activityid: activityid,
            isaddhtml: 0
        }
    }
    return getOptions(options);
}

module.exports = {
    getBase,
    getHomeList,
    getReadInfo,
    getCommentList,
    getRemindList,
    getTopStoryList,
    getActivityList,
    getActivityInfo
};
