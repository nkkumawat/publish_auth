const env = process.env.NODE_ENV || 'development';
const models = require('../models');

module.exports = {
    saveContract: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.user_address || !params.contract_address || !params.contract_type) {
                reject('Missing params');
            } else {
                models.contract.create(params).then(contract => {
                    resolve(contract.dataValues);
                }).catch((err) => {
                    console.error('Error occured while creating user:', err);
                    reject('Server side error');
                });
            }
        });
    }
};