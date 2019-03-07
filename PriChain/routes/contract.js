const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const ipfsAPI = require('ipfs-api');
const fs = require('fs');

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const web3js = require('../middlewares/web3js');
var Tx = require('ethereumjs-tx')
const onlineAuth = require('../contracts/OnlineBooksAuthenticity.json')

router.get('/', function(req, res, next) {
    res.render('dashboard', {});
});


router.post('/create' , function(req,  res, next) {
    console.log("nk")
    const contract1 = new web3js.eth.Contract(onlineAuth.abi, null, { data:  onlineAuth.bytecode});
    var params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            console.log(user.blockchain_address)
            web3js.eth.getGasPrice().then((averageGasPrice) => {
                console.log("Average gas price: " + averageGasPrice);
                gasPrice = averageGasPrice;
                contract1.deploy().estimateGas().then((estimatedGas) => {
                    console.log("Estimated gas: " + estimatedGas);
                    gas = estimatedGas +1;
                    contract1.deploy().send({
                        // from: user.blockchain_address,
                        from : "0x32B320475245069F7D629785882F5F704cE22196",
                        gasPrice: gasPrice, 
                        gas: gas
                    }).then((instance) => { 
                        console.log("Contract mined at " + instance.options.address);
                        res.json({
                            success: true,
                            result : instance.options
                        })
                    }).catch(err => {
                        console.log(err)
                        res.json({
                            success: false,
                            result :  err
                        })
                    });
                }).catch(err => {
                    console.log(err)
                    res.json({
                        success: false,
                        result :  err
                    })
                });
            }).catch(err => {
                console.log(err)
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
})

router.get('/get', function(req, res, next) {
    const contract1 = new web3js.eth.Contract(onlineAuth.abi, '0x04faC7AF93Fe95cD5ea126583Bd1a918A1B46c04');
    contract1.methods.createContract().send( {from: '0x7dD4030E676B66D34424755C145992D184E48e7A'}).then(result => {
        res.json({
            success: true,
            result :  result
        })
    }).catch(err => {
        console.log(err)
        res.json({
            success: false,
            result :  err
        })
    })
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