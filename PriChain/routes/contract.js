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


router.post('/publish/blockchain/get', function(req, res, next) {
    var params = req.body;
    console.log(params.contract_address);
    const bContract = new web3js.eth.Contract(bookContract.abi, params.contract_address);
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded).then(user =>{
            bContract.methods.getBookDetails().call( {from: /*user.blockchain_address */ '0x2DaB9028c7436B428b95033bbe46A540127d626F'} , (err , result)=>{
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