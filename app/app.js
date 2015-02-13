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
	session = require('express-session'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	//include models
	accountModel = require("./models/account.js").accountModel,
	categoryModel = require("./models/category.js").categoryModel,
	userModel = require("./models/user.js").userModel;

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	userModel.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	userModel.findOne({ username: username }, function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
		user.comparePassword(password, function(err, isMatch) {
			if (err) return done(err);
			if(isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));

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

var app = express();
app.use("/client", express.static(process.cwd() + '/client'));
app.use("/stylesheets", express.static(process.cwd() + '/css'));
app.use("/jasmine", express.static(process.cwd() + '/jasmine'));
app.set('views', __dirname + '/../views');


app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(logger("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
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

require('./routes/routes.js')(app, passport);


app.use(methodOverride());

app.listen(port, function() {
	console.log('Express server listening on port' + port);
});
