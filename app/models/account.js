var mongoose = require("mongoose");

var accountSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	balance: {
		type: Number,
		required: true
	},
});

var accountModel = mongoose.model('accountModel', accountSchema);

module.exports = {
	accountModel:accountModel
};
