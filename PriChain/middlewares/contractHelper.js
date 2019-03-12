const web3js = require('./web3js');

module.exports = {
    getContractInstance: function(contractAbi , contractAddress) {
        var contractInstance = new web3js.eth.Contract(contractAbi, contractAddress);
        return contractInstance;
    }
};