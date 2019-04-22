const express = require('express');
const router = express.Router();
const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const contractService = require('../services/contractService');
const requestService = require('../services/requestService');
const bookAuthorService = require("../services/bookAuthorService");
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const bs58 = require("bs58");
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
const web3js = require('../middlewares/web3js');
const bookContract = require('../contracts/Book.json')
const authorContract = require('../contracts/Author.json');
const bookAuthorContract = require('../contracts/BookAuthor.json')
const contractHelper = require('../middlewares/contractHelper');

router.post('/create' , function(req,  res, next) {
    if(req.cookies.role != "Author") {
        res.json({
            success: false,
            result: "You can`t do this ! You Are Not an Author"
        })
    }else {
        var params = req.body;
        utilityService.decodeToken(params.user_token).then(userdecoded =>{
            userService.getUser(userdecoded).then(user =>{
                web3js.eth.getGasPrice().then((averageGasPrice) => {
                    console.log("Average gas price: " + averageGasPrice);
                    gasPrice = averageGasPrice;
                    const aContract = contractHelper.getContractInstance(authorContract.abi, user.blockchain_contract_address);
                    aContract.methods.addNewBook(params.publiaction_title, params.publication_hash.split(",")[0] )
                    .estimateGas().then((estimatedGas) => {
                        console.log("Estimated gas: " + estimatedGas);
                        gas = estimatedGas +1;
                        aContract.methods.addNewBook(params.publiaction_title, params.publication_hash.split(",")[0] )
                        .send({
                            // from: user.blockchain_address,
                            from : config.defaultUserAddress,
                            gasPrice: gasPrice, 
                            gas: gas
                        }).then((txHash) => { 
                            aContract.methods.getLatestBookAddress()
                            .estimateGas({from: config.defaultUserAddress}).then(estimatedGas=>{  
                                aContract.methods.getLatestBookAddress()
                                .call({from: config.defaultUserAddress, gas: estimatedGas+1 }).then(result => {
                                    var contract_info = {
                                        "publication_title": params.publiaction_title,
                                        "publication_hash" : params.publication_hash.split(",")[0],
                                        "thumbnail" : params.publication_hash.split(",")[1]
                                    }
                                    var params_con = {
                                        user_address : user.blockchain_address,
                                        user_contract_address: user.blockchain_contract_address,
                                        contract_address: result,
                                        contract_type: "publish",
                                        user_id: user.id,
                                        publisher_id: user.id,
                                        contract_info: JSON.stringify(contract_info)
                                    }
                                    contractService.saveContract(params_con).then(contract => {
                                        bookAuthorService.getAll().then(bookAuthor => {                                            
                                            const bytes = bs58.decode(params.publication_hash.split(",")[0]);
                                            const multiHashId = 2;
                                            var ipfsHashBytes =  bytes.slice(multiHashId, bytes.length);
                                            var bookAthcontract = contractHelper.getContractInstance(bookAuthorContract.abi , bookAuthor[0].dataValues.contract_address);
                                            bookAthcontract.methods.insertBook(ipfsHashBytes, params_con.user_contract_address )
                                            .estimateGas({from: /*user.blockchain_address*/ config.defaultUserAddress}).then(estimatedGas=>{  
                                                // console.log(result)
                                                bookAthcontract.methods.insertBook(ipfsHashBytes, params_con.user_contract_address)
                                                .send({from: /*user.blockchain_address*/ config.defaultUserAddress, gas: estimatedGas+1 }).then(transactionReceipt => {
                                                    res.json({
                                                        success: true,
                                                        result : params
                                                    })
                                                }).catch(err => {
                                                    console.log(err);
                                                    res.json({
                                                        success: false,
                                                        result :  err
                                                    });
                                                });                                                                                                           
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
                                                result : err
                                            })
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
router.post('/getallpublished' , function(req, res, next) {
    contractService.getAllPublished().then(contracts => {
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
                .estimateGas({from: /*user.blockchain_address*/ config.defaultUserAddressSUP}).then(estimatedGas=>{  
                    console.log(estimatedGas)
                    aContract.methods.requestApproval(user.blockchain_address , params.ipfs_hash, params.requested_contract_address)
                    .send({from: /*user.blockchain_address*/ config.defaultUserAddressSUP, gas: estimatedGas+1 }).then(transactionReceipt => {
                        console.log(transactionReceipt);
                         aContract.methods.getRequestIndex().call( {from: /*user.blockchain_address*/ config.defaultUserAddress}).then(index_of_request => {
                            params.publisher_id = user.id;
                            params.publisher_address = user.blockchain_address;
                            params.request_blockchain_id = index_of_request
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
                console.log(params.author_contract_address)
                var aContract = contractHelper.getContractInstance(authorContract.abi , params.author_contract_address);
                aContract.methods.approveRequest(params.request_blockchain_id-1)
                .estimateGas({from: config.defaultUserAddress}).then(estimatedGas=>{  
                    aContract.methods.approveRequest(params.request_blockchain_id-1)
                    .send({from: config.defaultUserAddress, gas: estimatedGas+1 }).then(result => {
                        console.log(result);
                        var par = {
                            id: params.request_id
                        };
                        requestService.updateStatus(par).then(requ => {
                            par.id = params.contract_id;
                            par.publisher_id = params.publisher_id;
                            contractService.updateStatus(par).then(contract => {
                                res.json({
                                    success: true,
                                    result : requ
                                }) 
                            }).catch(err => {
                                res.json({
                                    success: false,
                                    result : err
                                }) 
                            })                  
                        }).catch(err => {
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
            requestService.getAllForMeNotApproved(user.id,req.cookies.role).then(requests => {
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

router.post('/request/get/approved', function(req, res, next) {
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            requestService.getAllForMeApproved(user.id,req.cookies.role).then(requests => {
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
router.post('/request/get/rejected', function(req, res, next) {
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            requestService.getAllForMeRejected(user.id,req.cookies.role).then(requests => {
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

router.post('/request/reject', function(req, res, next) {
    // console.log("nk---------")
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            requestService.rejectRequest(params).then(requests => {
                res.json({
                    success: true,
                    result : requests
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
        console.log(err);
        res.json({
            success: false,
            result :  err
        })
    })
});

router.post('/request/delete', function(req, res, next) {
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            requestService.deleteRequest(params).then(requests => {
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
                console.log(result );
                if(err) {
                    res.json({
                        success: false,
                        result :  err
                    })
                } else {
                    const validCID = result[2]
                    ipfs.files.get(validCID, function (err, files) {
                        console.log(files)
                        if(err){
                            res.json({
                                success: false,
                                result :  err
                            })
                        } else {
                            var file = files[0];
                            console.log(file.path);
                            var pathOfFile = "/public/pdfs/"+ Date.now()+".pdf";
                            fs.writeFile("."+pathOfFile, file.content, function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                                console.log("The file was saved!");
                                result[2] = pathOfFile;
                                res.json({
                                    success: true,
                                    result :  result
                                })
                            }); 
                        }
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

router.post('/checkauth', function(req, res, next) {
    var params = req.body;
    console.log(params.publication_hash);
    bookAuthorService.getAll().then(bookAuthor => {
        const bookAuthContract = contractHelper.getContractInstance(bookAuthorContract.abi, bookAuthor[0].dataValues.contract_address);
        const bytes = bs58.decode(params.publication_hash.split(",")[0]);
        const multiHashId = 2;
        console.log(bytes);
        var ipfsHashBytes =  bytes.slice(multiHashId, bytes.length);
        console.log(ipfsHashBytes);
        bookAuthContract.methods.checkAuthenticity(ipfsHashBytes).call( {from: config.defaultUserAddress } , (err , result)=>{            
            if(!err) {
                console.log(err);
                if(parseInt(result)){
                    params = {}
                    params.blockchain_contract_address = result;
                    userService.getUserByContractAddress(params).then(user =>{
                        res.json({
                            success: true,
                            result :  user,
                            message: "authentic"
                        });
                    }).catch(err => {
                        console.log(err)
                        res.json({
                            success: true,
                            result :  result,
                            message : "not authentic"
                        }); 
                    })                    
                }else {
                    res.json({
                        success: true,
                        result :  result,
                        message : "not authentic "
                    }); 
                }
            } else {
                res.json({
                    success: false,
                    result : err
                });                
            }
        })
    }).catch(err => {
        console.log(err);
        res.json({
            success: false,
            result :  err
        });
    })
})

module.exports = router;