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
			unique: true,
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

		blockchain_privatekey: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		block_number: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		timestamp: true
	});

	User.associate = function(models) {
	}  
	// User.sync({force: true});
	return User;
};