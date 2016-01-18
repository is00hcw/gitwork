'use strict';

class People{
  constructor(name){
    this.name = name;
  }
  sayHi(){
    console.log(`hi ${this.name} !`);
  }
}
module.exports = People;