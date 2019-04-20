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
                    reject('Server side error' + err);
                });
            }
        });
    },
    getAllByMe: function(user_id) {
        return new Promise((resolve, reject) => {
            models.contract.findAll({
                where: {
                    user_id: user_id
                },
                include: [{
                      model: models.user,
                      attributes: ['id', 'name' , 'email' , 'blockchain_address']
                    }]
            }).then(contracts => {
                resolve(contracts);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },
    getAll: function() {
        return new Promise((resolve, reject) => {
            models.contract.findAll({
                include: [{
                        model: models.user,
                        attributes: ['id', 'name'] 
                    }]
            }).then(contracts => {
                resolve(contracts);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
        });
    },
    getAllPublished: function() {
        return new Promise((resolve, reject) => {
            models.contract.findAll({
                where : { 
                    published : "yes"
                },
                include: [{
                    model: models.user,
                    attributes: ['id', 'name'] 
                }]
            }).then(contracts => {
                resolve(contracts);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
        });
    },
    updateStatus: function(params) {
        return new Promise((resolve, reject) => {

            models.contract.findOne({
                where: {
                    id: params.id
                }
            }).then(contract => {
                if (contract) {
                    contract.updateAttributes({"published" : "yes"})
                        .then(contrat => {
                            resolve(contrat.dataValues);
                        }).catch(err => {
                            reject('Server side error');
                        });
                } else {
                    reject('No such User exist');
                }
            }).catch(err => {
                reject('Server side error');
            });    
        });
    },
};