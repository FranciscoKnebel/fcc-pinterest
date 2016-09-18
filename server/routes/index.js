const isimageurl = require('is-image-url');
var Link = require('../models/link');
var User = require('../models/user');
const shortid = require('shortid');
const formatDate = require('format-date');
const dateDifference = require('date-difference');
const mongoose = require('mongoose');

module.exports = function (app, passport, dirname) {
	require('./static')(app, dirname);
	require('./auth/twitter')(app, passport);
	require('./api/index')(app, dirname);

	app.get('/', function (req, res) {
		if (req.isAuthenticated()) {
			Link.findRandom().limit(16).exec(function (err, links) {
				res.render('index.authenticated.ejs', {
					user: req.user,
					links: links
				})
			});
		} else {
			Link.findRandom().limit(16).exec(function (err, links) {
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

	app.get('/profile/:id', function (req, res) {
		var id = req.params.id;
		User.findOne({
			'twitter.username': id
		}, function (err, profile) {
			if (err) {
				res.render('profile.invalid.ejs', {
					user: req.user,
					message: {
						header: "Ooops!",
						description: err.message
					}
				});
			}

			if (!profile) {
				res.render('profile.invalid.ejs', {
					user: req.user,
					message: {
						header: "Ooops!",
						description: "User " + id + " is invalid."
					}
				});
			} else {
				res.render('profile.ejs', {
					user: req.user,
					profile: profile,
					since: formatDate('{utc-day} of {utc-month-name}, {utc-year}', profile.createdAt),
					lastseen: dateDifference(profile.updatedAt, new Date(), {compact: true})
				});
			}
		});
	});

}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else {
		res.redirect('/');
	}
}
