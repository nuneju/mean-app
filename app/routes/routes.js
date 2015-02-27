var userModel = require("../models/user.js").userModel,
	accountModel = require("../models/account.js").accountModel;

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
	app.get('/create_account', function(req, res) {
		res.render('create_account', {
			user: req.user
		});
	});
	app.post('/create_account', ensureAuthenticated, function(req, res) {
		var accountInstance = new accountModel({
			user_id: req.user._id,
			name: req.body.name,
			currency: req.body.currency,
			balance: 0
		});
		accountInstance.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('user: ' + req.user.username + ", account:" + req.body.name + " saved.");
			}
		});
		res.redirect('/account');
	});
	app.get('/account', ensureAuthenticated, function(req, res) {
		var accountInfo = accountModel.find({
			user_id: req.user._id
		}, function(err, records) {
			records.forEach(function(record) {
				//record.remove();
				console.log(record);
			});
			if (err) {
				console.log(err);
				return res.send(400);
			}
			res.render('account', {
				user: req.user,
				records: records
			});
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
