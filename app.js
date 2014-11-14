var express = require('express'),
	mongodb = require('mongodb'),
	mongoose = require ("mongoose"),
	Schema = mongoose.Schema,
	uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose',
	port = process.env.PORT || 80,
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session');
	

mongoose.connect(uristring, function (err, res) {
	if (err) { 
		console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + uristring);
	}
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('Connected to DB');
});

User = require("./models/user.js").User;
User.remove({}, function(err) {
	if (err) {
		console.log ('error deleting old data.');
	}
});
var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
user.save(function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('user: ' + user.username + " saved.");
	}
});

gameUser = require("./models/game.js").gameUser;
gameUser.remove({}, function(err) {
	if (err) {
		console.log ('error deleting old data.');
	}
});

var gameOne = new gameUser ({
	nom: "est", 
	words:["best","test","guest"]
});

var gameTwo = new gameUser ({
	nom: "it", 
	words:["bit","quit","sit"]
});

gameOne.save(function (err) {if (err) console.log ('Error on save!')});
gameTwo.save(function (err) {if (err) console.log ('Error on save!')});

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(logger("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/client",express.static(__dirname + "/client"));
app.use("/stylesheets",express.static(__dirname + "/stylesheets"));
app.use("/jasmine",express.static(__dirname + "/jasmine"));

app.use(methodOverride());
app.use(session({
	secret: 'keyboard cat',
	name: 'cookie_name',
	//	store: sessionStore, // connect-mongo session store
	proxy: true,
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


require('./routes/routes.js')(app);

app.listen(port, function() {
	console.log('Express server listening on port' + port);
});