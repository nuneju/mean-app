var express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
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

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, function(err, user) {
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

app.get('/', function(req, res){
	res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
	res.render('login', { user: req.user, message: req.session.messages });
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) {
			req.session.messages =  [info.message];
			return res.redirect('/login')
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/');
		});
	})(req, res, next);
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}

app.get('/showlist', function (req, res) {
	res.send("<a href='/games'>Show Games</a>");
});

app.get('/games', function (req, res) {
	gameUser.find({}, function (err, docs) {
		res.json(docs);
	});
});

app.get('/games/:nom', function (req, res) {
	if (req.params.nom) {
		var name = req.params.nom;
		gameUser.find({nom:req.params.nom}, function (err, docs) {
			res.json(docs);
		});
	}
});
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.listen(port, function() {
	console.log('Express server listening on port' + port);
});