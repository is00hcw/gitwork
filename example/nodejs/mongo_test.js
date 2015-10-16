var mongo = require('mongodb');
 
//http://www.dotblogs.com.tw/newmonkey48/archive/2012/10/17/77529.aspx
var server = new mongo.Server('115.28.225.5',29017,{auto_reconnect:true});
var db = new mongo.Db('test',server);

db.open(function(err,db){
    if(!err){
	    console.log("We are connected");
	    db.collection('users',function(err,collection){
	        var doc = {'first_name':'tom','last_name':'lai'};
			var doc2 = {'first_name':'tom_test','last_name':'lai_test'};
            collection.insert(doc);
            collection.insert(doc2);			
	    });
		
		db.collection('users',function(err,collection){
		    var query_doc = {'first_name':'tom'};			 
		    collection.update(query_doc,{'$set':{'age':26}});
		});
		
		db.collection('users',function(err,collection){
		    var query_doc = {'first_name':'tom_test'};
			collection.remove(query_doc);			
		});
		
		db.collection('users',function(err,collection){
		    var query_doc = {'first_name':'tom'};
			collection.findOne(query_doc,function(err,item){
			    console.log(item['first_name']);
				console.log(item['last_name']);
				console.log(item['age']);
			    console.log(item.first_name);
				console.log(item.last_name);
				console.log(item.age);
			});
		});
	}
});