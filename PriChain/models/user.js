'use strict';
module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		mobile: {
			type: DataTypes.STRING,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
	    type: DataTypes.STRING,
			allowNull: false
	  },
		deactivated: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false
		},
		blockchain_address: {
			type: DataTypes.TEXT,
			allowNull: false
		},

		blockchain_contract_address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		block_number: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		picture_url: {
			type: DataTypes.STRING,
			defaultValue: "/public/images/avatar_m.jpeg",
		}
	}, {
		timestamp: true
	});

	User.associate = function(models) {
	}  
	return User;
};