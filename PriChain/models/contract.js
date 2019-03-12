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
		}
	}, {
		timestamp: true,
	});
	Contract.associate = function(models) {
		Contract.belongsTo(models.user, {foreignKey: 'user_id', targetKey: 'id'})
	} 
	return Contract;
};