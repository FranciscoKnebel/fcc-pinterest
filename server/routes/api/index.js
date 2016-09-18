var Link = require('../../models/link');
const isimageurl = require('is-image-url');

module.exports = function (app, dirname) {
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

			user.addLink(link);

			link.save(function () {
				res.render('link.ejs', {
					user: req.user,
					message: {
						header: "Success!",
						description: "New link created.",
						type: "success"
					},
					link: link
				});
			});

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
