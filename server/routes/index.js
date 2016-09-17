const isimageurl = require('is-image-url');
var Link = require('../models/link');

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

	app.post('/new/link', isLoggedIn, function (req, res) {
		var data = req.body;
		if (!(data.image.length > 0)) {
			res.render('link.ejs', {
				user: req.user,
				message: {
					header: "Oops!",
					description: "Image field not filled.",
					type: "error"
				}
			});
		} else if (!isimageurl(data.image)) {
			res.render('link.ejs', {
				user: req.user,
				message: {
					header: "Oops!",
					description: "Invalid image URL.",
					type: "error"
				}
			});
		} else {
			var tags = [];
			if (data.tags.length > 0) {
				var strs = data.tags.split(',');

				for (var i = 0; i < strs.length; i++) {
					tags.push(strs[i].trim());
				}
			} else {
				tags = undefined;
			}

			var link = new Link();
			link.newLink(data.image, req.user, tags);
			console.log(link);

			res.render('link.ejs', {
				user: req.user,
				message: {
					header: "Success!",
					description: "New link created.",
					type: "success",
					image: data.image,
					tags: tags
				}
			});
		};
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else {
		res.redirect('/');
	}
}
