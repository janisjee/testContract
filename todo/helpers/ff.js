
var Web3 = require('web3');

const rpc_geth = 'http://localhost:8545';

const web3 = new Web3(new Web3.providers.HttpProvider(rpc_geth));

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

function sendMoney(fromAddress, toAddress, amountInETH) {
    return web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gasPrice: 20000000000,
        gas: 1000000,
        value: web3.toWei(amountInETH, "ether")
    });
}

function ff() {
    getBlockNumber().then(number => {
        console.log('START => current Block: ', number);
        const from = '0x6f41fffc0338e715e8aac4851afc4079b712af70';
        const to = '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97';
        const amount = 0.00001;
        const num = parseInt(process.argv[2]) || 1;
        for (var i = 0; i < num; i++) {
            const result = sendMoney(from, to, amount);
            console.log('------------------------------------');
            console.log('ff %s: ', (i + 1), result);
            console.log('------------------------------------');
        }
        getBlockNumber().then(number => {
            console.log('END => current Block: ', number);
        }).catch(err => {
            console.log('get block error: ', err);
        });
    }).catch(err => {
        console.log('get block error: ', err);
    });
}

module.exports = ff();
