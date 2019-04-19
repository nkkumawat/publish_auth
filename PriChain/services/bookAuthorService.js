const env = process.env.NODE_ENV || 'development';
const models = require('../models');

module.exports = {
    saveContractInfo: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.contract_address) {
                reject('Missing params');
            } else {
                models.bookAuthor.create(params).then(contract => {
                    resolve(contract.dataValues);
                }).catch((err) => {
                    console.error('Error occured while creating user:', err);
                    reject('Server side error' + err);
                });
            }
        });
    },
    getAll: function() {
        return new Promise((resolve, reject) => {
            models.bookAuthor.findAll().then(contracts => {
                resolve(contracts);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },
    getCount: function() {
        return new Promise((resolve, reject) => {
            models.bookAuthor.findAll().then(contracts => {
                console.log(contracts.length,"narendra");
                if(!contracts.length){
                    resolve(1);
                }else {
                    resolve(0);
                }
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject(0);
            });
            
        });
    }
};