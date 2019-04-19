const Web3 = require('web3');

const options = {
    defaultAccount: '0x0',
    defaultBlock: 'latest',
    defaultGas: 100000,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480
}
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545", options);

module.exports = web3 ;