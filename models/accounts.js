var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	username: String,
	password: String,
	emailAddress: String,
	token: String,
	frequency: String,
	quantity: Number,
	grindType: String,
	fullname: String,
	addressOne: String,
	addressTwo: String,
	city: String,
	state: String,
	zip: Number,
	deliveryDate: Date,
	totalCost: Number
});

module.exports = mongoose.model('Account', Account);
