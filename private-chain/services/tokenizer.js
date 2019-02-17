const jwt = require('jsonwebtoken'); 
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const responseCode = require('../config/responseCodes');

module.exports = {

    getToken: function(user) {
        const expiresIn = 2 * 60 * 60 // 2 hrs
        const token = jwt.sign(user, config.superSecret, {
            expiresIn: expiresIn
        });
        return token;
    },
    varifyUser: function(token) {
        return new Promise((resolve , reject)=> {
            jwt.verify(token, config.superSecret
            , function(err, decoded) {
                if(err){
                    reject(responseCode.unAuthorized);
                }else{
                    resolve ({ status: responseCode.ok, data : decoded  });
                }
            });
        })
        
    },
    isInt: function(value) {
        return !isNaN(value) 
                && (parseInt(Number(value)) == value) 
                && (!isNaN(parseInt(value, 10)));
    },
    getUserInfoFromHeader: function(reqHeader){
        value = Buffer.from(reqHeader.split(" ")[1], "base64").toString("ascii");
        return {
            username: value.split(":")[0],
            password: value.split(":")[1]
        }
    }
};