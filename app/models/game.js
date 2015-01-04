var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
	nom: {type:String, required: true},
	words: [String]
});

var gameUser = mongoose.model('gameUser', gameSchema);
module.exports = {
	gameUser:gameUser
};
