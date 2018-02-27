var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

var counterContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"incrementCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"decrementCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
var counter = counterContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x606060405260008055341561001357600080fd5b60fb806100216000396000f3006060604052600436106053576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635b34b966146058578063a87d942c14606a578063f5c5ad83146090575b600080fd5b3415606257600080fd5b606860a2565b005b3415607457600080fd5b607a60b4565b6040518082815260200191505060405180910390f35b3415609a57600080fd5b60a060bd565b005b60016000808282540192505081905550565b60008054905090565b600160008082825403925050819055505600a165627a7a72305820e93be1b549d7deb04da629a50577ba251d40f2da73f7fa425f89de553e1a57ac0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })