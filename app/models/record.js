var mongoose = require("mongoose");

var recordSchema = new mongoose.Schema({
	account_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'Account',
		required: true
	},
	user_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	category: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	is_expense: {
		type: Boolean,
		default: true
	},
	description: {
		type: String
	}
});

var recordModel = mongoose.model('recordModel', recordSchema);

module.exports = {
	recordModel:recordModel
};
