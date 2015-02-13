var userModel = require("../models/user.js").userModel;
module.exports = function(app, passport) {
	function ensureAuthenticated(req, res, callback) {
		if (req.isAuthenticated()) {
			return callback();
		}
		res.redirect('/login');
	}
	app.get('/', function(req, res) {
		res.render('index', {
			user: req.user
		});
	});
	app.get('/account', ensureAuthenticated, function(req, res) {
		res.render('account', {
			user: req.user
		});
	});
	app.get('/login', function(req, res) {
		res.render('login', {
			user: req.user,
			message: req.session.messages
		});
	});
	app.get('/register', function(req, res, next) {
		res.render('register', {
			user: req.user
		});
	});
	app.post('/register', function(req, res, next) {
		var user = new userModel({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
		});
		user.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('user: ' + user.username + " saved.");
			}
		});
		res.redirect('/login');
	});
	app.post('/login', function(req, res, user) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.session.messages = [info.message];
				return res.redirect('/login');
			}
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				return res.redirect('/');
			});
		})(req, res);
	});
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};
