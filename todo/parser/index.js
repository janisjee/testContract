var fs = require('fs');
var path = require('path');

var keccak = require('keccak');

const InputDataDecoder = require('ethereum-input-data-decoder');    // https://github.com/miguelmota/ethereum-input-data-decoder

const abiDecoder = require('abi-decoder');  // https://github.com/ConsenSys/abi-decoder

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

//
const contractConfig = require(path.resolve(__dirname, '..', 'build', 'config.json'));

var env = Object.assign({}, contractConfig, process.env);

// ------------------------------------------------------------------------

var Web3Lib = require('web3');

if (typeof web3 !== 'undefined') {
    var web3 = new Web3Lib(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    var web3 = new Web3Lib(new Web3Lib.providers.HttpProvider("http://localhost:8545"));
}

// ------------------------------------------------------------------------

function startWith0x(input) {
    input += '';
    return (input.slice(0, 2) === '0x');
}

function add0x(input) {
    input += '';
    if (startWith0x(input)) return input;
    return ('0x' + input);
}

function isValidHash(input) {
    input += '';
    if (!startWith0x(input)) return false;
    return (input.length > 2);
}

function createKeccakHash(input) {
    var str = keccak('keccak256').update(input).digest().toString('hex') + '';
    if (str.length === 0) return str;
    return add0x(str);
}

// ------------------------------------------------------------------------
var contractsABI = {}; // contractAddress => contractABI
var contractsEventMap = {}; // contract => eventMask => eventName

// map parser contract addresses & ABI
function mapping() {

    //
    var tmpEnv = {};
    for (var key in env) {
        if (env.hasOwnProperty(key)) {
            tmpEnv[key.toLowerCase().replace(/_/gi, '')] = env[key];
        }
    }

    //
    var dirPath = path.resolve(__dirname, '..', 'build', 'contracts');
    var files = fs.readdirSync(dirPath);
    files.forEach((item) => {
        var fn = item + '';
        var tmpArr = fn.toLowerCase().split('.');
        if (fs.lstatSync(path.resolve(dirPath, fn)).isFile() && tmpArr.length > 1 && tmpArr[tmpArr.length - 1] === 'json') {
            delete tmpArr[tmpArr.length - 1];
            var expectedKey = (tmpArr.join('_') + '_CONTRACT_ADDRESS').toLowerCase().replace(/_/gi, '');
            if (typeof tmpEnv[expectedKey] !== 'undefined') {
                //
                var contractAddr = tmpEnv[expectedKey];
                contractsABI[contractAddr] = require(path.resolve(dirPath, fn)).abi;
                //
                if (typeof contractsEventMap[contractAddr] === 'undefined') {
                    contractsEventMap[contractAddr] = {};
                    contractsABI[contractAddr].forEach((abiItem) => {
                        if (abiItem.type === 'event') {
                            var inpTmpArr = [];
                            abiItem.inputs.forEach((inputVal) => {
                                // console.log('inputVal: ', inputVal);
                                inpTmpArr.push(inputVal.type);
                            })
                            var fullEventStructure = abiItem.name + '(' + inpTmpArr.join(',') + ')';
                            var evtMask = createKeccakHash(fullEventStructure);
                            contractsEventMap[contractAddr][evtMask] = abiItem;
                        }
                    });
                    // console.log('ABI============> : ', contractsABI[contractAddr])
                }
                //
            }
        }
    });
}

// ------------------------------------------------------------------------

function watch() {
    web3.eth.filter('latest').watch((error, blockHash) => {
        // console.log('block hash: ', blockHash)
        if (isValidHash(blockHash)) {
            // 
            web3.eth.getBlock(blockHash, true, function (error, block) {
                if (!error && block) {
                    // console.log('==========> block data: ', block)
                    var transactions = block.transactions || [];
                    //
                    transactions.forEach((tx) => {
                        // console.log('=============> tx details: ', tx);
                        web3.eth.getTransactionReceipt(tx.hash, (error, txrs) => {
                            // console.log('=============> transaction receipt: ', txrs);
                            (txrs.logs || []).forEach((log) => {
                                //
                                var data = {
                                    blockHash: block.hash,
                                    blockNumber: block.number,
                                    blockTimeStamp: block.timestamp,
                                    //
                                    transactionHash: tx.hash,
                                    transactionIndex: tx.transactionIndex,
                                    //
                                    transactionFrom: tx.from,
                                    transactionTo: tx.to,
                                    transactionValue: tx.value,
                                    //
                                    logIndex: log.logIndex,
                                    logContractAddress: log.address,
                                    logData: log.data,
                                    logTopics: log.topics,
                                    logEventMask: log.topics ? log.topics[0] : '',
                                    //
                                    cusEventABI: '',
                                    cusEventName: '',
                                    cusFunctionInfo: '',
                                    cusDecodedEventLog: '',
                                    //
                                }
                                if (typeof contractsEventMap[data.logContractAddress] !== 'undefined' && typeof contractsEventMap[data.logContractAddress][data.logEventMask] !== 'undefined') {
                                    data.cusEventABI = contractsEventMap[data.logContractAddress][data.logEventMask];
                                    data.cusEventName = data.cusEventABI.name;
                                }
                                //
                                if (typeof contractsABI[data.logContractAddress] !== 'undefined' && tx.input) {
                                    const theContractABI = contractsABI[data.logContractAddress];
                                    // decode function info base on transaction input
                                    if (tx.input) {
                                        const decoder = new InputDataDecoder(theContractABI);
                                        data.cusFunctionInfo = decoder.decodeData(tx.input);
                                        // console.log('====================> Input decoded data: ', data.cusFunctionInfo);
                                    }
                                    //
                                    abiDecoder.addABI(theContractABI);
                                    const decodedLogs = abiDecoder.decodeLogs([log]);
                                    data.cusDecodedEventLog = decodedLogs[0];
                                    // console.log('-----------------> decoded event log: ', data.cusDecodedEventLog);
                                    //
                                }
                                //
                                console.log('-----------------> expected data: ', data);
                                //
                            })
                        });
                    });
                }
            })
        }
    });
}

function run() {
    mapping();
    watch();
}

run();

