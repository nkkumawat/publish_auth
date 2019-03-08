const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');
const validationService = require('../services/validationService');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const web3js = require('../middlewares/web3js')

/* GET home page. */
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
	userService.loginUser(params)
		.then(user => {
			const token = utilityService.getToken(user);
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
	// const block_chain_account = web3js.eth.accounts.create();
	// console.log(block_chain_account)
	// params.blockchain_address = block_chain_account.address
	// params.blockchain_privatekey = block_chain_account.privateKey

	web3js.eth.personal.newAccount(params.password).then(block_chain_user => {
		console.log(block_chain_user)
		web3js.eth.personal.unlockAccount(block_chain_user, params.password, 150000).then(user => {
			console.log(user)
			params.blockchain_address = block_chain_user;
			userService.signup(params).then(user => {
				const token = utilityService.getToken(user);
				console.log(token)
				res.json({
					success: true,
					user_token: token
				});
			}).catch(err => {
				res.json({
					success: false,
					message: err
				});
			}); 
	
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
router.get('/logout', function(req, res, next) {
	res.render('logout');
});

module.exports = router;