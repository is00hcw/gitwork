var ALY = require('aliyun-sdk');

var cdn = new ALY.CDN({
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: 'http://cdn.aliyuncs.com',
    apiVersion: '2014-11-11'
  }
);

cdn.refreshObjectCaches({
  ObjectType: 'File',
  ObjectPath: 'http://cdn.xxx/css/mother.css'
}, function(err, res) {
  console.log("++refreshObjectCaches ", err, res);
});

cdn.describeCdnMonitorData({
  DomainName: "cdn.xxx",
  StartTime: new Date("2015-08-10T00:00:00Z"),
  EndTime: new Date("2015-09-07T00:10:00Z")
}, function(err, res) {
  console.log("++describeCdnMonitorData",  err, res);
});