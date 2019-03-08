'use strict';

module.exports = function(sequelize, DataTypes) {
	var Contract = sequelize.define('contract', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		contract_address: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true
		},
		user_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		contract_type: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		timestamp: true
	});

	Contract.associate = function(models) {
	}  
	
	return Contract;
};