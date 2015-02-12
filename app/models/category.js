var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
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

var categoryModel = mongoose.model('categoryModel', categorySchema);

module.exports = {
	categoryModel:categoryModel
};
