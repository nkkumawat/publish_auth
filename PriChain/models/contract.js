'use strict';


module.exports = function(sequelize, DataTypes) {
	var Contract = sequelize.define('contract', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: { 
			type: DataTypes.INTEGER,
			allowNull: false
		},
		contract_address: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true
		},
		user_address: {
			type: DataTypes.TEXT,
			allowNull: false,
						
		},
		user_contract_address: {
			type: DataTypes.TEXT,
			allowNull: false,
						
		},
		contract_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		contract_info: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		published :{
			type: DataTypes.STRING,
			defaultValue: "no"
		},
		publisher_id : {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamp: true,
	});
	Contract.associate = function(models) {
		Contract.belongsTo(models.user, {foreignKey: 'user_id', targetKey: 'id', as: 'authorInfo'});
		Contract.belongsTo(models.user, {foreignKey: 'publisher_id', targetKey: 'id', as: 'publisherInfo'});
	} 
	return Contract;
};