var fs = require('fs');
var path = require('path');

var TodoList = artifacts.require("./TodoList.sol");

module.exports = function (deployer) {
  var config = {};
  var todoListInst = null;

  TodoList.new().then(inst => {
    todoListInst = inst;
    console.log('TodoList contract address: ', inst.address);
    config.todoListContractAddress = inst.address;
    fs.writeFileSync(path.resolve(__dirname, '..', 'build', 'config.json'), JSON.stringify(config, null, 2))
    console.log('config has been written to file: build/config.json');
  }).catch(err => {
    console.log('-----------------------------------------');
    console.log('DEPLOYMENT ERROR');
    console.log('-----------------------------------------');
    console.log(err);
    console.log('-----------------------------------------');
  });
};
