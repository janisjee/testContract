var TodoList = artifacts.require("./TodoList.sol");

module.exports = function(deployer) {
  var todoListInst = null;

  TodoList.new().then(inst => {
    todoListInst = inst;
    console.log('TodoList contract address: ', inst.address);
  }).catch(err => {
    console.log('-----------------------------------------');
    console.log('DEPLOYMENT ERROR');
    console.log('-----------------------------------------');
    console.log(err);
    console.log('-----------------------------------------');
  });
};
