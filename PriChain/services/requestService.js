const env = process.env.NODE_ENV || 'development';
const models = require('../models');

module.exports = {
    saveRequest: function(params) {
        return new Promise((resolve, reject) => {
            models.request.create(params).then(request => {
                resolve(request.dataValues);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },
    getAllCount: function(user_id , role) {
        if(role =='Author'){
            return new Promise((resolve, reject) => {
                models.request.count({
                    where: {
                        author_id: user_id
                    }
                }).then(request => {
                    resolve(request);
                }).catch((err) => {
                    console.error('Error occured while creating user:', err);
                    reject('Server side error');
                });
                
            });
        }else {
            return new Promise((resolve, reject) => {
                models.request.count({
                    where: {
                        publisher_id: user_id
                    }
                }).then(request => {
                    resolve(request);
                }).catch((err) => {
                    console.error('Error occured while creating user:', err);
                    reject('Server side error');
                });
                
            });
        }
        
    },
    getAll: function() {
        // return new Promise((resolve, reject) => {
        //     models.contract.findAll({
        //         include: [
        //             {
        //                 model: models.user,
        //                 attributes: ['id', 'name']
                      
        //             }
        //         ]
        //     }).then(contracts => {
        //         resolve(contracts);
        //     }).catch((err) => {
        //         console.error('Error occured while creating user:', err);
        //         reject('Server side error');
        //     });
            
        // });
    }
};