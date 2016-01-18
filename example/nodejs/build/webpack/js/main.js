'use strict';

require('../css/main.less');

require("./module1");
require("./module2");
require("./module3");

var People = require('./es6-module');
let p = new People("Yika");
p.sayHi();

console.log("main")