  send: function (times, flag3, isTest) {
            if (flag3 == 6 && isTest) {
                var t = new Image;
                t.src = "http://isdspeed.qq.com/cgi-bin/r.cgi?" + this.flag.join("&") + "&flag3=6&" + times.join("&"),
                t.onload = t.onerror = function () {
                    t = null
                }
            } else {
                var t = document.createElement("script");
                t.src = "http://isdspeed.qq.com/cgi-bin/r.cgi?" + this.flag.join("&") + "&flag3=" + (flag3 || this.pageFlag[M.currentRoute]) + "&" + times.join("&"),
                t.onload = t.onerror = function () {
                    $(t).remove()
                };
                $("head").append(t)
            }
        }