module.exports = function(app, passport){
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	}

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
			if (err) {
				return next(err);
			}
			if (!user) {
				req.session.messages =  [info.message];
				return res.redirect('/login');
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/');
			});
		})(req, res, next);
	});
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
}
