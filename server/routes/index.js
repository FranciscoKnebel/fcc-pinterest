const isimageurl = require('is-image-url');
var Link = require('../models/link');

module.exports = function (app, passport, dirname) {
	require('./static')(app, dirname);
	require('./auth/twitter')(app, passport);

	app.get('/', function (req, res) {
		if (req.isAuthenticated()) {
			Link.findRandom().limit(15).exec(function (err, links) {
				res.render('index.authenticated.ejs', {
					user: req.user,
					links: links
				})
			});
		} else {
			Link.findRandom().limit(15).exec(function (err, links) {
				res.render('index.ejs', {
					user: req.user,
					links: links
				})
			});
		}
	});

	app.get('/logout', isLoggedIn, function (req, res) {
		req.logout();

		res.redirect('/');
	});

	app.post('/new/link', isLoggedIn, function (req, res) {
		var data = req.body;

		if (!(data.title.length > 0)) {
			res.render('link.ejs', {
				user: req.user,
				message: {
					header: "Oops!",
					description: "Title field not filled.",
					type: "error"
				}
			});
		} else if (!(data.image.length > 0)) {
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
			var user = req.user;
			var link = new Link();
			link.newLink(data.image, user, data.title);

			if (data.tags.length > 0) {
				var strs = data.tags.split(',');

				for (var i = 0; i < strs.length; i++) {
					link.addTag(strs[i].trim());
				}
			} else {
				tags = undefined;
			}
			link.save(function () {
				console.log("ID: " + link.id);
				Link.findById(link.id, function (err, doc) {
					console.log(doc);
					res.render('link.ejs', {
						user: req.user,
						message: {
							header: "Success!",
							description: "New link created.",
							type: "success"
						},
						link: doc
					});
				})
			});

			user.addLink(link);
			user.save();

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
