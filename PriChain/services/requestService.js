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
                author_id : user_id,
                approved: "no"
            }           
        }else {
            condition = {
                publisher_id: user_id,
                approved: "no"
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

    updateStatus: function(params) {
        return new Promise((resolve, reject) => {

            models.request.findOne({
                where: {
                    id: params.id
                }
            }).then(request => {
                if (request) {
                    request.updateAttributes({"approved" : "yes"})
                        .then(request => {
                            resolve(request.dataValues);
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
    getAllForMeNotApproved: function(user_id , role) {
        if(role == 'Author'){
            condition = {
                author_id: user_id,
                approved: "no"
            }
        }else {
            condition = {
                publisher_id: user_id,
                approved: "no"
            }
        }
        return new Promise((resolve, reject) => {
            models.request.findAll({
                where : condition,
                include: [{
                        model: models.user,
                        attributes: ['id', 'name', 'email']
                    
                    }, {
                        model: models.contract
                    }]
            }).then(requests => {
                resolve(requests);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },
    getAllForMeRejected: function(user_id , role) {
        if(role == 'Author'){
            condition = {
                author_id: user_id,
                approved: "rejected"
            }
        }else {
            condition = {
                publisher_id: user_id,
                approved: "rejected"
            }
        }
        return new Promise((resolve, reject) => {
            models.request.findAll({
                where : condition,
                include: [{
                        model: models.user,
                        attributes: ['id', 'name', 'email']
                    
                    }, {
                        model: models.contract
                    }]
            }).then(requests => {
                console.log(requests , "Found")
                resolve(requests);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },
    getAllForMeApproved: function(user_id , role) {
        if(role == 'Author'){
            condition = {
                author_id: user_id,
                approved: "yes"
            }
        }else {
            condition = {
                publisher_id: user_id,
                approved: "yes"
            }
        }
        return new Promise((resolve, reject) => {
            models.request.findAll({
                where : condition,
                include: [{
                        model: models.user,
                        attributes: ['id', 'name', 'email']
                    
                    }, {
                        model: models.contract
                    }]
            }).then(requests => {
                resolve(requests);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },

    deleteRequest: function(params) {
        return new Promise((resolve, reject) => {
            models.request.destroy({
                where : {id : params.request_id}
            }).then(requests => {
                resolve(requests);
            }).catch((err) => {
                console.error('Error occured while creating user:', err);
                reject('Server side error');
            });
            
        });
    },
    rejectRequest: function(params) {
        return new Promise((resolve, reject) => {
            models.request.findOne({
                where: {
                    id: params.request_id
                }
            }).then(request => {
                if (request) {
                    request.updateAttributes({"approved" : "rejected"})
                        .then(request => {
                            // console.log(request , "Found")
                            resolve(request.dataValues);
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