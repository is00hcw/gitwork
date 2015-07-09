// use addon to mock http request
module.exports = {
	"GET /oauth/token" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"access_token" : "1234abcd1234abcd",
			"refresh_token" : "abcd1234abcd1234",
			"expire_time" : 1000000
		}
	},
	"GET /auth/app/token" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"access_token" : "1234abcd1234abcd",
			"refresh_token" : "abcd1234abcd1234",
			"expire_time" : 1000000
		}
	},
	"GET /auth/device/token" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"access_token" : "1234abcd1234abcd",
			"refresh_token" : "abcd1234abcd1234",
			"expire_time" : 1000000
		}
	},
	"POST /user/create" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"user_id" : "oSsHRjhYSjWwQb56UWnMa0hh-Ee8",
			"user_type" : 1001,
			"user_group" : "admin"
		}
	},
	"GET /user/uid" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"user_id" : "oSsHRjhYSjWwQb56UWnMa0hh-Ee8",
			"user_type" : 1001,
			"user_group" : "admin"
		}
	},
	"POST /user/bind" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"POST /user/unbind" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"GET /device_info" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"device_id" : "99EC87E12F8F692B9978A57C21E4F56E2A373401",
			"device_sn" : "M5S01023CNAC7KZ",
			"device_mac" : "B5:2C:08:04:23:12",
			"product_id" : "M500",

		}
	},
	"GET /device/userlog" : {
		"code" : 200,
		"msg" : "",
		"data" : [ {
			optime : "2014-12-18 11:21:17",
			content : "设备解除绑定账号"
		}, {
			optime : "2014-12-17 11:21:17",
			content : "设备绑定账号"
		} ]
	},
	"GET /user/devicelist" : {
		"code" : 200,
		"msg" : "",
		"data" : [ {
			"device_id" : "99EC87E12F8F692B9978A57C21E4F56E2A373401",
			"user_group" : "user"
		} ]
	},
	"PUT /user/info" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"GET /user/info" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"user_id" : "oSsHRjhYSjWwQb56UWnMa0hh-Ee8",
			"user_type" : 1001,
			"user_group" : "admin"
		}
	},
	"GET /device/userlist" : {
		"code" : 200,
		"msg" : "",
		"data" : [ {
			"user_id" : "oSsHRjhYSjWwQb56UWnMa0hh-Ee8",
			"user_group" : "user"
		}, {
			"user_id" : "oSsHRjt2QbKrvXgXAZLYtH6dIdL0",
			"user_group" : "admin"
		} ]
	},
	"GET /device/setting" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"deviceName" : "我的插座 socket",
			"childrenInfo" : {
				"cid_1" : {
					"childId" : "cid_1",
					"childName" : "插孔1e"
				},
				"cid_2" : {
					"childId" : "cid_2",
					"childName" : "插孔2q"
				},
				"cid_3" : {
					"childId" : "cid_3",
					"childName" : "插孔3y"
				},
				"cid_4" : {
					"childId" : "cid_4",
					"childName" : "插孔4z"
				}
			}
		}
	},
	"POST /device/setting" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"DELETE /device/trigger" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"POST /device/trigger" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"PUT /device/trigger" : {
		"code" : 200,
		"msg" : "",
		"data" : {}
	},
	"GET /device/trigger" : function(req, res, next) {
		console.log(req.param("taskId"))
		if(req.param("taskId") == undefined ){
			res.send({
				"code" : 200,
				"msg" : "",
				"data" : [ {
					"taskId" : "d71a3da27e8f9b244cf25092b8b94a0e",
					"createTime" : "2014-11-25 14:53:25",
					"beginTime" : "14:53:00.000",
					"beginDate" : "2014-01-01",
					"endDate" : "2214-01-01",
					"endTime" : "14:54:00.000",
					"repeatMode" : "repeat",
					"repeatDay" : [ 0, 1, 2, 3, 4, 5, 6 ],
					"propertyId" : "p_port1",
					"methodId" : "on",
					"beginValue" : "on",
					"endValue" : "off",
					"enabled" : "true"
				} ]
			})
		}else{
			res.send({
				"code" : 200,
				"msg" : "",
				"data" : {
					"taskId" : "d71a3da27e8f9b244cf25092b8b94a0e",
					"createTime" : "2014-11-25 14:53:25",
					"beginTime" : "14:53:00.000",
					"beginDate" : "2014-01-01",
					"endDate" : "2214-01-01",
					"endTime" : "14:54:00.000",
					"repeatMode" : "repeat",
					"repeatDay" : [ 0, 1, 2, 3, 4, 5, 6 ],
					"propertyId" : "p_port1",
					"methodId" : "on",
					"beginValue" : "on",
					"endValue" : "off",
					"enabled" : "true"
				}
			})
		}
	},

	"GET /device/trigger/:id" : {
		"code" : 200,
		"msg" : "",
		"data" : {
			"taskId" : "d71a3da27e8f9b244cf25092b8b94a0e",
			"createTime" : "2014-11-25 14:53:25",
			"beginTime" : "14:53:00.000",
			"beginDate" : "2014-01-01",
			"endDate" : "2214-01-01",
			"endTime" : "14:54:00.000",
			"repeatMode" : "repeat",
			"repeatDay" : [ 0, 1, 2, 3, 4, 5, 6 ],
			"propertyId" : "p_port1",
			"methodId" : "on",
			"beginValue" : "on",
			"endValue" : "off",
			"enabled" : "true"
		}
	},

	"GET /device/property" : {
		"code" : 200,
		"msg" : "",
		"data" : [ {
			"id" : "p_deviceLock",
			"info" : {},
			"name" : "p_deviceLock",
			"range" : [ "lock", "unlock" ],
			"type" : "string",
			"value" : "unlock",
			"propertyid" : "p_deviceLock"
		}, {
			"id" : "p_deviceSN",
			"info" : {},
			"name" : "p_deviceSN",
			"range" : [],
			"type" : "string",
			"value" : "M5SA1406CNDVLB0K",
			"propertyid" : "p_deviceSN"
		}, {
			"id" : "p_onlineTime",
			"info" : {},
			"name" : "p_onlineTime",
			"range" : [],
			"type" : "string",
			"value" : "2014-01-01 00:00:00",
			"propertyid" : "p_onlineTime"
		}, {
			"id" : "p_port1",
			"info" : {},
			"name" : "p_port1",
			"range" : [ "on", "off" ],
			"type" : "string",
			"value" : "on",
			"propertyid" : "p_port1"
		}, {
			"id" : "p_port1_lock",
			"info" : {},
			"name" : "p_port1_lock",
			"range" : [ "lock", "unlock" ],
			"type" : "string",
			"value" : "unlock",
			"propertyid" : "p_port1_lock"
		}, {
			"id" : "p_port2",
			"info" : {},
			"name" : "p_port2",
			"range" : [ "on", "off" ],
			"type" : "string",
			"value" : "on",
			"propertyid" : "p_port2"
		}, {
			"id" : "p_port2_lock",
			"info" : {},
			"name" : "p_port2_lock",
			"range" : [ "lock", "unlock" ],
			"type" : "string",
			"value" : "unlock",
			"propertyid" : "p_port2_lock"
		}, {
			"id" : "p_port3",
			"info" : {},
			"name" : "p_port3",
			"range" : [ "on", "off" ],
			"type" : "string",
			"value" : "on",
			"propertyid" : "p_port3"
		}, {
			"id" : "p_port3_lock",
			"info" : {},
			"name" : "p_por3_lock",
			"range" : [ "lock", "unlock" ],
			"type" : "string",
			"value" : "unlock",
			"propertyid" : "p_port3_lock"
		}, {
			"id" : "p_port4",
			"info" : {},
			"name" : "p_port4",
			"range" : [ "on", "off" ],
			"type" : "string",
			"value" : "on",
			"propertyid" : "p_port4"
		}, {
			"id" : "p_port4_lock",
			"info" : {},
			"name" : "p_port4_lock",
			"range" : [ "lock", "unlock" ],
			"type" : "string",
			"value" : "unlock",
			"propertyid" : "p_port4_lock"
		}, {
			"id" : "p_userId",
			"info" : {},
			"name" : "p_userId",
			"range" : [],
			"type" : "string",
			"value" : "xxx",
			"propertyid" : "p_userId"
		}, {
			"id" : "p_version",
			"info" : {},
			"name" : "p_version",
			"range" : [],
			"type" : "string",
			"value" : "1.2.3.6",
			"propertyid" : "p_version"
		} ]
	},
	// ----------- sample below
	"OPTIONS /debuglog" : function(req, res, next) {
		 
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Credentials', 'true');
		res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS, DELETE');
		res.set('Content-Type', 'text/plain, charset=utf-8');
		res.set('Content-Length', 0);
		res.set('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, reqid, nid, host, x-real-ip, x-forwarded-ip, event-type, event-id, accept, content-type');
		res.status(200).send('ok');
	},
	"POST /debuglog" : function(req, res, next) {
		console.log(req.params);
		res.set('Access-Control-Allow-Origin', '*');
		res.send({
			content : "ok" 
		});
	},
	"GET /test" : function(req, res, next) {
		res.send({
			content : req.param("uid") + " , " + req.header("token")
		})

	},

	"GET /v1/posts/:id" : function(req, res, next) {
		// response json format
		res.send({
			title : "title changed",
			content : "tow post hahahah"
		})
	},
	"GET /test" : function(req, res, next) {
		res.send({
			content : req.param("uid") + " , " + req.header("token")
		})

	},
	// PUT POST DELETE is the same
	"PUT /v1/posts/:id" : function() {

	},

	"DELETE /v1/posts/:id" : function() {
	},
	"GET /v1/posts" : [ {
		message : "some message"
	} ],
	"GET /v1/posts/:id" : "hello.html",
	"GET /ajax" : "ajax.html"
}