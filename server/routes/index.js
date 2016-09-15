module.exports = function (app, passport, dirname) {

	require('./static')(app, dirname);
	require('./auth/twitter')(app, passport);

	app.get('/', function (req, res) {
		if (req.isAuthenticated()) {
			res.render('index.authenticated.ejs', {user: req.user})
		} else {
			res.render('index.ejs', {user: req.user});
		}
	});

	app.get('/logout', isLoggedIn, function (req, res) {
		req.logout();

		res.redirect('/');
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else {
		res.redirect('/');
	}
}
