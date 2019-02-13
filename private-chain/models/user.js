var mongoose = require('mongoose')
var env = process.env.NODE_ENV || 'development'
var config = require('../../config/config')[env],
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  _account_token : String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
