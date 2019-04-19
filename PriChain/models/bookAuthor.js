'use strict';
module.exports = function(sequelize, DataTypes) {
	var BookAuthor = sequelize.define('bookAuthor', {
		id: { 
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		contract_address: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true
		}
	}, {
		timestamp: true,
	});
	// BookAuthor.sync({force: true});
	return BookAuthor;
};