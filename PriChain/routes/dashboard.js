const express = require('express');
const router = express.Router();

const utilityService = require('../services/utilityService');
const userService = require('../services/userService');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const middlewares = require('../middlewares');

// middleware to verify a token
// router.use(middlewares.verifyToken);

router.use('/save', function(req, res, next) {
    const params = req.body;
    try {
        Object.keys(params).forEach(function(key) {
            if (params[key] == '') {
                params[key] = null;
            }
        });
    } catch (e) {
        console.error('Exception at save middleware', e);
    }
    next();
});
router.get('/', function(req, res, next) {
    // console.log("answer")
    // var params = req.query;


    var iam = req.cookies.role
    console.log( req.cookies.role)
    if(iam == "Author"){
        res.render('dashboard_author', {});
    }else if(iam == "Publisher") {
        res.render('dashboard_publisher', {});
    }else if(iam == "User") {
        res.render('dashboard_user', {});
    }else {
        res.redirect('logout');
    }
});

router.post('/get/user/profile', function(req, res, next) {
    console.log("profile");
    const params = req.body;
    utilityService.decodeToken(params.user_token).then(userdecoded =>{
        userService.getUser(userdecoded)
        .then(user => {
            res.json({
                success: true,
                result: user
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
    }).catch(err => {
        res.json({
            success: false,
            message: err
        })
    })
});

router.post('/update/user', function(req, res, next) {
    const params = req.body;

    // can't update email and password
    params.email = req.decoded.email;
    delete params.password;
    
    userService.updateUser(params)
        .then(user => {
            res.json({
                success: true,
                result: user
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err
            });
        });
});

module.exports = router;