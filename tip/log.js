baidu.sio = {};

/**
 * 通过请求一个图片的方式令服务器存储一条日志
 * @param   {string}    url  		要发送的地址.
 * @param	{Function=}	callback	回调函数（可选）
 */
baidu.sio.log = function(url, callback) {
    var img = new Image();
    var key = 'mini_tangram_log_' +
        Math.floor(Math.random() * 2147483648).toString(36);

    // 这里一定要挂在window下
    // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
    // 导致服务器收不到日志
    window[key] = img;

    img.onload = img.onerror = img.onabort = function() {
        // 下面这句非常重要
        // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
        // 则在gif动画播放过程中，img会多次触发onload
        // 因此一定要清空
        img.onload = img.onerror = img.onabort = null;

        window[key] = null;

        // 下面这句非常重要
        // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
        // 因此这里一定要置为null
        img = null;

		    if (callback) { 
            callback(url); 
		    }
    };

    // 一定要在注册了事件之后再设置src
    // 不然如果图片是读缓存的话，会错过事件处理
    // 最后，对于url最好是添加客户端时间来防止缓存
    // 同时服务器也配合一下传递Cache-Control: no-cache;
    img.src = url;
};

var LogStorage = (function() {
    // 保存到SessionStorage使用的键名
    var key = 'Mkt_unsent_' + c.id;

    /**
     * 把请求保存到sessionStorage中
     * @param   {string}    url 链接url
     */
    var add = function(url) {
        var unsent = baidu.sessionStorage.get(key) || '';

        // 保存url时要去掉协议，在重发时才加上，保证请求和页面的协议相同
        // 防止在https页面中发出http请求
        unsent = encodeURIComponent(url.replace(/^https?:\/\//, ''))
            + (unsent ? ',' + unsent : '');

        baidu.sessionStorage.set(key, unsent);
    };

    /**
     * 从sessionStorage中删除请求
     * @param   {string}    url 链接url
     */
    var remove = function(url) {
        var unsent = baidu.sessionStorage.get(key) || '';
        if (unsent) {

            // 从url中去掉协议，做url编码，然后把星号和括号做斜杠转义
            // 用来作为正则匹配的pattern
            url = encodeURIComponent(url.replace(/^https?:\/\//, ''))
                .replace(/([\*\(\)])/g, '\\$1');

            // 从unsent中删掉匹配的url及url后面的逗号
            // 如果url位于最后，之后还要去掉unsent最后面的逗号
            unsent = unsent.replace(new RegExp(url + ',?', 'g'), '')
                .replace(/,$/, '');

            if (unsent) {
                baidu.sessionStorage.set(key, unsent);
            } else {
                baidu.sessionStorage.remove(key);
            }
        }
    };

    /**
     * 重发前一页面未成功的统计请求
     */
    var resend = function() {
        var unsent = baidu.sessionStorage.get(key);
        if (unsent) {
            var reqs = unsent.split(',');
            for (var i = 0, l = reqs.length; i < l; i++) {
                // url解码之后加上当前页面的协议
                baidu.sio.log(PROTOCOL + '//' + decodeURIComponent(reqs[i]), 
                    function(req) {
                        remove(req);
                    }
                );
            }
        }
    };

    return {
        add: add,
        remove: remove,
        resend: resend
    };
})();

/**
 * 发送统计日志
 */
var log = function() {
    tags['rnd'] = Math.round(Math.random() * MAX_INT);
    var url = PROTOCOL + '//' + RCV + '?' + serializeTags();

    LogStorage.add(url);
    baidu.sio.log(url, function() {
        LogStorage.remove(url);
    });
};

// 页面打开时就重发日志
LogStorage.resend();