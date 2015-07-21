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