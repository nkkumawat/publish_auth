const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const contractService = require('../services/contractService');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const ipfsAPI = require('ipfs-api');
const fs = require('fs');

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const web3js = require('../middlewares/web3js');
var Tx = require('ethereumjs-tx')
const bookContract = require('../contracts/Book.json')

router.get('/', function(req, res, next) {
    res.render('dashboard', {});
});


router.post('/publish/create' , function(req,  res, next) {
    const bContract = new web3js.eth.Contract(bookContract.abi, null);
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            console.log(user.blockchain_address)
            web3js.eth.getGasPrice().then((averageGasPrice) => {
                console.log("Average gas price: " + averageGasPrice);
                gasPrice = averageGasPrice;
                bContract.deploy({
                    data:  bookContract.bytecode,
                    arguments: [params.publiaction_title, params.publication_hash]
                }).estimateGas().then((estimatedGas) => {
                    console.log("Estimated gas: " + estimatedGas);
                    gas = estimatedGas +1;
                    bContract.deploy({
                        data:  bookContract.bytecode,
                        arguments: [params.publiaction_title, params.publication_hash]
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
});


router.post('/publish/getall' , function(req, res, next) {

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


router.get('/publish/blockchain/get', function(req, res, next) {
    const bContract = new web3js.eth.Contract(bookContract.abi, '0x013876912a210a9748f484f289Fb696D53112c8B');
    bContract.methods.getBookDetails().call( {from: '0x32B320475245069F7D629785882F5F704cE22196'} , (err , result)=>{
        console.log(err , result);
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
    console.log("hello")



    // bContract.methods.getBookDetails().call({from: '0x32B320475245069F7D629785882F5F704cE22196'})
    // .then((result) => {
    //     console.log("dgxdddddddg")
    // });

    // bContract.methods.getBookDetails().call( {from: '0x32B320475245069F7D629785882F5F704cE22196'}).then(result => {
    //     res.json({
    //         success: true,
    //         result :  result
    //     })
    // }).catch(err => {
    //     console.log(err)
    //     res.json({
    //         success: false,
    //         result :  err
    //     })
    // })
})

// router.get('/create', function(req, res, next) {
//     // var bookContract = new web3js.eth.Contract(onlineAuth.abi );
//     // // console.log(bookContract.options)
//     // var contract =  bookContract.deploy()
//     // web3js.eth.getAccounts().then(acs => {
//     //     res.json({
//     //         acs : acs
//     //     })
//     // });
//     // // console.log(ac)


//     web3js.eth.defaultAccount = "0x83f0cc82da8d93ac9d300f1cc6651c7a670340d0";
//     web3js.eth.defaultGas = 0;
    
//     web3js.eth.getTransactionCount("0x83f0cc82da8d93ac9d300f1cc6651c7a670340d0").then((txCount) => {
//         const data = onlineAuth.bytecode   ;
//         web3js.eth.estimateGas({data: data}).then(gasEstimate => {
//             console.log(gasEstimate)
//             const txObject = {
//                 nonce:    web3js.utils.toHex(txCount),
//                 gasLimit: web3js.utils.toHex(1858379), 
//                 gasPrice: gasEstimate,
//                 data: data
//             }
//             const tx = new Tx(txObject)
//             const privateKey = Buffer.from('5ccc182b6a3eaaf029e529a80d9761a49442989f00aa9f7400c49c79e14add81', 'hex');
//             tx.sign(privateKey)
//             const serializedTx = tx.serialize()
//             const raw = '0x' + serializedTx.toString('hex')
        
//             web3js.eth.sendSignedTransaction(raw).then( (txHash) => {
//                 res.json({
//                     success: true,
//                     result:  txHash
//                 })
//             }).catch(err => {
//                 console.log(err)
//                 res.json({
//                     success: false,
//                     result: err 
//                 })
//             })
//         });           
//     }).catch(err => {
//         console.log(err)
//         res.json({
//             success: false,
//             result: err 
//         })
//     })
// });

module.exports = router;