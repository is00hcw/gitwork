window.onerror = function(message, url, line) {
	try{
		if(typeof XMLHttpRequest !== 'undefined') {
			var rand = Math.floor(Math.random() * 100);
			if(88 == rand) {
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				xhr.open('post', 'http://h5.qzone.qq.com/report/jserror', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send('module=' + encodeURIComponent(location.href) + '&fileurl=' + encodeURIComponent(url) + '&line=' + line + '&message=' + message + '&uin=' + '');
			}
		}
	} catch(e) {

	}
};


function j() {
	var k = document.createElement("iframe");
	k.className = "_jsb";
	k.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;";
	k.frameBorder = "0";
	document.body.appendChild(k);
	return k
}

var getUrlParam = function(c, d, e) {
    var f = new RegExp("(?:^|[?&#])" + c + "=([^?&#]*)", "i"),
    a = f.exec(d || window.location.href),
    b = a ? a[1] : "";
    return e ? b: decodeURIComponent(b)
}