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
            condition = {
                author_id : user_id
            }           
        }else {
            condition = {
                publisher_id: user_id
            }
        }
        return new Promise((resolve, reject) => {
            models.request.count({
                where: condition
            }).then(request => {
                resolve(request);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },

    getAllForMe: function(user_id , role) {
        if(role == 'Author'){
            condition = {
                author_id: user_id
            }
        }else {
            condition = {
                publisher_id: user_id
            }
        }
        return new Promise((resolve, reject) => {
            models.request.findAll({
                where : condition,
                include: [
                    {
                        model: models.user,
                        attributes: ['id', 'name']
                    
                    }, 
                    {
                        model: models.contract
                    }
                ]
            }).then(requests => {
                resolve(requests);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    }
};