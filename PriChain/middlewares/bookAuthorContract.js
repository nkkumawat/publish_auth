const bookAuthorContract = require('../contracts/BookAuthor.json');
const contractHelper = require('../middlewares/contractHelper');
const booAuthorService = require('../services/bookAuthorService');
const web3js = require('../middlewares/web3js');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports =  { 
    createContract : function() {
        var params = {};
        var contractInstance = contractHelper.getContractInstance(bookAuthorContract.abi, null);
        web3js.eth.getGasPrice().then((averageGasPrice) => {
            console.log("Average gas price: " + averageGasPrice);
            gasPrice = averageGasPrice;
            contractInstance.deploy({
                data:  bookAuthorContract.bytecode,
                arguments: []
            }).estimateGas().then((estimatedGas) => {
                console.log("Estimated gas: " + estimatedGas);
                gas = estimatedGas +1;
                contractInstance.deploy({
                    data:  bookAuthorContract.bytecode,
                    arguments: []
                }).send({
                    from : config.defaultUserAddress,
                    gasPrice: gasPrice, 
                    gas: gas
                }).then((instance) => { 
                    console.log("Contract mined at " + instance.options.address);
                    params.contract_address = instance.options.address;
                    booAuthorService.saveContractInfo(params).then(bookathr => {
                        console.log(bookathr)
                    }).catch(err => {
                        console.log(err);
                    }); 
                }).catch(err => {
                    console.log(err);                
                });
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        })
    }
};