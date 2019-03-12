'use strict';


module.exports = function(sequelize, DataTypes) {
	var Request = sequelize.define('request', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		request_blockchain_id: { 
			type: DataTypes.INTEGER,
			allowNull: false
		},
		author_id: { 
			type: DataTypes.INTEGER,
			allowNull: false
        },
		author_address: { 
			type: DataTypes.TEXT,
			allowNull: false
		},
		requested_contract_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		publisher_id: { 
			type: DataTypes.INTEGER,
			allowNull: false
        },
		publisher_address: {
			type: DataTypes.TEXT,
			allowNull: false,			
		},
		contract_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamp: true,
	});
	Request.associate = function(models) {
		Request.belongsTo(models.user, {foreignKey: 'author_id', targetKey: 'id'})
		Request.belongsTo(models.user, {foreignKey: 'publisher_id', targetKey: 'id'})
		Request.belongsTo(models.contract, {foreignKey: 'contract_id', targetKey: 'id'})
	} 
	return Request;
};