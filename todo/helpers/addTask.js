
var fs = require('fs');
var path = require('path');

var Web3 = require('web3');

const rpc_geth = 'http://localhost:8545';

const web3 = new Web3(new Web3.providers.HttpProvider(rpc_geth));

const removeSpaces = (str) => ((str || '') + '').replace(/\s/g, '');

function getBlockNumber() {
    return new Promise((res, rej) => {
        web3.eth.getBlockNumber(function (err, number) {
            if (err) {
                rej(err)
            } else {
                res(number)
            }
        })
    })
}

function addTask() {
    getBlockNumber().then(number => {
        console.log('START => current Block: ', number);
        const user = '0x6f41fffc0338e715e8aac4851afc4079b712af70';
        //
        const datTime = new Date();
        //
        var day = datTime.getDate();
        var month = datTime.getMonth() + 1;
        var year = datTime.getFullYear();
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        const date = `${year}/${month}/${day}`;
        //
        var hour = datTime.getHours();
        var minute = datTime.getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        const time = `${hour}:${minute}`;
        //
        const defaultTaskContent = `This task has been created automatically at ${datTime.toString()}`;
        const contentFromConsole = process.argv[2] || '';
        const tmpContent = removeSpaces(contentFromConsole);
        const content = tmpContent.length > 0 ? contentFromConsole : defaultTaskContent;
        //
        const todoListContractAddress = require(path.resolve(__dirname, '..', 'build', 'config.json')).todoListContractAddress;
        const todoContractABI = require(path.resolve(__dirname, '..', 'build', 'contracts', 'TodoList.json')).abi;
        const todoContract = web3.eth.contract(todoContractABI);
        const contractInst = todoContract.at(todoListContractAddress);
        // push new task to block chain
        const blockHash = contractInst.add.sendTransaction(date, time, content, { from: user, gas: 1000000 });
        if (blockHash) {
            console.log('A new task has been pushed into blockchain with block hash: ', blockHash)
        }
        else {
            console.log('Cannot push new task to blockchain');
        }
        //
        getBlockNumber().then(number => {
            console.log('END => current Block: ', number);
        }).catch(err => {
            console.log('get block error: ', err);
        });
    }).catch(err => {
        console.log('get block error: ', err);
    });
}

module.exports = addTask();
