const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const contractService = require('../services/contractService');
const requestService = require('../services/requestService');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const ipfsAPI = require('ipfs-api');
const fs = require('fs');

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const web3js = require('../middlewares/web3js');
var Tx = require('ethereumjs-tx')
const bookContract = require('../contracts/Book.json')
const authorContract = require('../contracts/Author.json')
const contractHelper = require('../middlewares/contractHelper');



router.post('/create' , function(req,  res, next) {
    if(req.cookies.role != "Author") {
        res.json({
            success: false,
            result: "You can`t do this ! You Are Not an Author"
        })
    }else {
        const bContract = contractHelper.getContractInstance(bookContract.abi, null);
        var params = req.body;
        utilityService.decodeToken(params.user_token).then(userdecoded =>{
            userService.getUser(userdecoded).then(user =>{
                console.log(user.blockchain_address)
                web3js.eth.getGasPrice().then((averageGasPrice) => {
                    console.log("Average gas price: " + averageGasPrice);
                    gasPrice = averageGasPrice;
                    bContract.deploy({
                        data:  bookContract.bytecode,
                        arguments: [params.publiaction_title, params.publication_hash , user.blockchain_contract_address]
                    }).estimateGas().then((estimatedGas) => {
                        console.log("Estimated gas: " + estimatedGas);
                        gas = estimatedGas +1;
                        bContract.deploy({
                            data:  bookContract.bytecode,
                            arguments: [params.publiaction_title, params.publication_hash , user.blockchain_contract_address]
                        }).send({
                            // from: user.blockchain_address,
                            from : "0x32B320475245069F7D629785882F5F704cE22196",
                            gasPrice: gasPrice, 
                            gas: gas
                        }).then((instance) => { 
                            console.log("Contract mined at " + instance.options.address);
                            var contract_info = {
                                "publication_title": params.publiaction_title,
                                "publication_hash" : params.publication_hash
                            }
                            var params_con = {
                                user_address : user.blockchain_address,
                                user_contract_address: user.blockchain_contract_address,
                                contract_address: instance.options.address,
                                contract_type: "publish",
                                user_id: user.id,
                                contract_info: JSON.stringify(contract_info)
                            }
                            contractService.saveContract(params_con).then(contract => {
                                res.json({
                                    success: true,
                                    result : params
                                })
                            }).catch(err => {
                                console.log(err);
                                res.json({
                                    success: false,
                                    result : err
                                })
                            })
                        }).catch(err => {
                            console.log(err);
                            res.json({
                                success: false,
                                result :  err
                            })
                        });
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            result :  err
                        })
                    });
                }).catch(err => {
                    console.log(err);
                    res.json({
                        success: false,
                        result :  err
                    })
                })
            }).catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    result :  err
                })
            })
        }).catch(err => {
            console.log(err);
            res.json({
                success: false,
                result :  err
            })
        })
    }
});

router.post('/getall' , function(req, res, next) {
    contractService.getAll().then(contracts => {
        res.json({
            success: true,
            result :  contracts
        })
    }).catch(err => {
        res.json({
            success: false,
            result :  err
        })
    })
});

router.post('/getall/byme' , function(req, res, next) {
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            contractService.getAllByMe(user.id).then(contracts => {
                res.json({
                    success: true,
                    result :  contracts
                })
            }).catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    result :  err
                })
            })
        }).catch(err => {
            console.log(err);
            res.json({
                success: false,
                result :  err
            })
        })
    }).catch(err => {
        console.log(err);
        res.json({
            success: false,
            result :  err
        })
    })
});


router.post('/request' , function(req, res, next) {
    var params = req.body;
    if(req.cookies.role != 'Publisher'){
        res.json({
            success : false,
            result: "you are not a publisher"
        })
    }else {
        utilityService.decodeToken(params.user_token).then(userdecoded =>{
            userService.getUser(userdecoded).then(user =>{
                var aContract = contractHelper.getContractInstance(authorContract.abi , params.author_contract_address);
                aContract.methods.requestApproval(user.blockchain_address , params.ipfs_hash, params.requested_contract_address)
                .estimateGas({from: /*user.blockchain_address*/ "0x7dD4030E676B66D34424755C145992D184E48e7A"}).then(estimatedGas=>{  
                    // console.log(result)
                    aContract.methods.requestApproval(user.blockchain_address , params.ipfs_hash, params.requested_contract_address)
                    .send({from: /*user.blockchain_address*/ "0x7dD4030E676B66D34424755C145992D184E48e7A", gas: estimatedGas+1 }).then(transactionReceipt => {
                        // console.log(result);
                         aContract.methods.getRequestIndex().call( {from: /*user.blockchain_address*/ "0x7dD4030E676B66D34424755C145992D184E48e7A"}).then(index_of_request => {
                            params.publisher_id = user.id;
                            params.publisher_address = user.blockchain_address;
                            params.request_blockchain_id = index_of_request
                            // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",index_of_request);
                            requestService.saveRequest(params).then(request => {
                                res.json({
                                    success: true,
                                    result : request
                                })
                            }).catch(err => {
                                res.json({
                                    success: false,
                                    result :  err
                                })
                            })
                    }).catch(err => {
                        console.log(err)
                        res.json({
                            success: false,
                            result :  err
                        })
                    })  
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            result :  err
                        })
                    })                                                                                                           
                }).catch(err => {
                    console.log(err)
                    res.json({
                        success: false,
                        result :  err
                    })
                })
            }).catch(err => {
                console.log(err)
                res.json({
                    success: false,
                    result :  err
                })
            })
        }).catch(err => {
            console.log(err)
            res.json({
                success: false,
                result :  err
            })
        })
    }

});



router.post('/request/approve' , function(req, res, next) {
    var params = req.body;
    if(req.cookies.role != 'Author'){
        res.json({
            success : false,
            result: "you are not a author"
        })
    }else {
        utilityService.decodeToken(params.user_token).then(userdecoded =>{
            userService.getUser(userdecoded).then(user =>{
                console.log(params.author_contract_address, "addddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
                var aContract = contractHelper.getContractInstance(authorContract.abi , params.author_contract_address);
                aContract.methods.approveRequest(params.request_blockchain_id-1)
                .estimateGas({from: "0xb0a37d82c0757C3d34982bfe1b88C6FD674b6341"}).then(estimatedGas=>{  
                    // console.log(result,"addddddzddddddddddddddddddddddddddddddd")
                    aContract.methods.approveRequest(params.request_blockchain_id-1)
                    .send({from: "0xb0a37d82c0757C3d34982bfe1b88C6FD674b6341", gas: estimatedGas+1 }).then(result => {
                        console.log(result);

                        res.json({
                            success: true,
                            result : result
                        })                         
                     
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            result :  err
                        })
                    })                                                                                          
                }).catch(err => {
                    console.log("addddddddddddddddddddddddddddd",err)
                    res.json({
                        success: false,
                        result :  err
                    })
                })
            }).catch(err => {
                console.log(err)
                res.json({
                    success: false,
                    result :  err
                })
            })
        }).catch(err => {
            console.log(err)
            res.json({
                success: false,
                result :  err
            })
        })
    }

});



router.post('/request/count', function(req, res, next) {
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            requestService.getAllCount(user.id,req.cookies.role).then(requests => {
                res.json({
                    success: true,
                    result : requests
                })
            }).catch(err => {
                res.json({
                    success: false,
                    result :  err
                })
            })
        }).catch(err => {
            res.json({
                success: false,
                result :  err
            })
        })
    }).catch(err => {
        res.json({
            success: false,
            result :  err
        })
    })

});



router.post('/request/get', function(req, res, next) {
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            requestService.getAllForMe(user.id,req.cookies.role).then(requests => {
                res.json({
                    success: true,
                    result : requests
                })
            }).catch(err => {
                res.json({
                    success: false,
                    result :  err
                })
            })
        }).catch(err => {
            res.json({
                success: false,
                result :  err
            })
        })
    }).catch(err => {
        res.json({
            success: false,
            result :  err
        })
    })
});

router.post('/blockchain/get', function(req, res, next) {
    var params = req.body;
    console.log(params.contract_address);
    
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            const bContract = contractHelper.getContractInstance(bookContract.abi, params.contract_address);
            bContract.methods.getBookInfo().call( {from: user.blockchain_address} , (err , result)=>{
                console.log(result);
                if(err) {
                    res.json({
                        success: false,
                        result :  err
                    })
                } else {
                    res.json({
                        success: true,
                        result :  result
                    })
                }
            })
        }).catch(err => {
            res.json({
                success: false,
                result :  err
            })
        })
    }).catch(err => {
        res.json({
            success: false,
            result :  err
        })
    })
})

module.exports = router;