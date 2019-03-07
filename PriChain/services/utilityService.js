const fs = require('fs');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const request = require('request');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports = {

    getToken: function(user) {
        let expiresIn = 2 * 60 * 60 // expires in 2 hours
        if (user.keepMeLoggedIn) {
            expiresIn = 7 * 24 * 60 * 60 // expires in 7 days
        }

        // create a token
        const token = jwt.sign({
            mobile: user.mobile,
            name: user.name,
            id: user.id,
            email: user.email
        }, config.superSecret, {
            expiresIn: expiresIn
        });
        return token;
    },
    decodeToken: function(user_token){
        return new Promise((resolve , reject) => {
            if(!user_token){
                reject('Provide token');
            }else {
                jwt.verify(user_token, config.superSecret, function(err, decoded) {
                    if(err){
                        reject('wrong token or expired' + err);
                    }else {
                        resolve(decoded)
                    }
                });
            }
        })
    },

    isInt: function(value) {
        return !isNaN(value) 
                && (parseInt(Number(value)) == value) 
                && (!isNaN(parseInt(value, 10)));
    }

};