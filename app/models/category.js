var mongoose = require("mongoose");
var category = new mongoose.Schema({
	user_id: {
		type:  mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: true
	}
});
module.exports = {
	category:category
};
