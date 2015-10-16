/**
 * Created by Administrator on 2015/10/16.
 */

var request = require('request');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper')
    , Iconv = require('iconv').Iconv;
var cheerio = require('cheerio');


/**抓取网页全文源代码、主要用来抓取新闻正文
 * @param url 需要抓取的url地址
 * @param calback
 */
function fetchContent(url,calback){
    var req = request(url, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    req.on('error', function(err) {
        console.log(err);
    });
    req.on('response', function(res) {
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end',function(){
            var result = iconv.decode(bufferHelper.toBuffer(),'GBK');
           // console.log(result);
            calback(result);
        });
    });
}

fetchContent("http://news.163.com/14/0304/10/9MG1UUF400014JB6.html" , function(htmlData){

    var $ = cheerio.load(htmlData);
    var context = $("body").html();
    var img = $("body").find("img")[0];
    var imgPath ;
    if(img !== null){
        imgPath = $(img).attr("src");  //新闻的缩略图
    }
    console.log(imgPath);
})