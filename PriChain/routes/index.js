const express = require('express');
const router = express.Router();
const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const web3js = require('../middlewares/web3js');
const authorConract = require('../contracts/Author.json');
const publisherConract = require('../contracts/Publisher.json');
const userConract = require('../contracts/User.json');
const contractHelper = require('../middlewares/contractHelper');

router.get('/', (req, res, next) => {
    res.render('signin' , {});
});

router.get('/signin', (req, res, next) => {
    res.render('signin', {});
});

router.get('/signup', (req, res, next) => {
    res.render('signup', {});
});

router.post('/signin', (req, res, next) => {
	const params = req.body;
	userService.loginUser(params).then(user => {
		const token = utilityService.getToken(user);
		res.cookie('role', user.role, { 
			maxAge: 2 * 60 * 60 * 1000, httpOnly: true 
		}); 
		res.json({
			success: true,
			user_token : token
		});
	}).catch(err => {
		res.json({
			success: false,
			message: err
		});
	});
});

router.post('/signup', function(req, res, next) {
	const params = req.body;
	web3js.eth.personal.newAccount(params.password).then(block_chain_user => {
		console.log(block_chain_user)
		web3js.eth.personal.unlockAccount(block_chain_user, params.password, 150000).then(user => {
			console.log(user)
			params.blockchain_address = block_chain_user;
			var contractInstance; 
			if(params.role == "Author" ) {
				contractInstance = contractHelper.getContractInstance(authorConract.abi , null);
			}else if(params.role == "Publisher") {
				contractInstance = contractHelper.getContractInstance(publisherConract.abi, null);
			}else {
				contractInstance = contractHelper.getContractInstance(userConract.abi, null);
			}
			web3js.eth.getGasPrice().then((averageGasPrice) => {
                console.log("Average gas price: " + averageGasPrice);
                gasPrice = averageGasPrice;
                contractInstance.deploy({
                    data:  authorConract.bytecode,
                    arguments: [params.name]
                }).estimateGas().then((estimatedGas) => {
                    console.log("Estimated gas: " + estimatedGas);
                    gas = estimatedGas +1;
                    contractInstance.deploy({
                        data:  authorConract.bytecode,
                        arguments: [params.name]
                    }).send({
                        // from: user.blockchain_address,
                        from : config.defaultUserAddress,
                        gasPrice: gasPrice, 
                        gas: gas
                    }).then((instance) => { 
                        console.log("Contract mined at " + instance.options.address);
                        params.blockchain_contract_address = instance.options.address;
						userService.signup(params).then(user => {
							const token = utilityService.getToken(user);
							console.log(token);
							res.cookie('role', user.role, { 
										maxAge: 2 * 60 * 60 * 1000, httpOnly: true 
							}); 
							res.json({
								success: true,
								user_token: token,
							});
						}).catch(err => {
							res.json({
								success: false,
								message: err
							});
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
		})
	}).catch(err => {
		res.json({
			success: false,
			message: err
		})
	});	
});

router.post('/update', (req, res, next) => {
	const params = req.body;
	utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded)
        .then(user => {
			console.log(user.email);
			params.email = user.email;
            userService.updateUser(params)
				.then(user => {
					res.json({
						success: true,
						user : user
					});
				}).catch(err => {
					console.log(err);
					res.json({
						success: false,
						message: err
					});
				});
        }).catch(err => {
			console.log(err);
            res.json({
                success: false,
                message: err
            });
        });
    }).catch(err => {
		console.log(err);
        res.json({
            success: false,
            message: err
        })
    })
	
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('role');
	res.render('logout');
});

module.exports = router;