var twitterStrategy = require("passport-twitter").Strategy;
var User = require('../models/user');
var configAuth = require('./config');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	//TWITTER
	passport.use(new twitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL,
		passReqToCallback: true
	}, function (req, token, tokenSecret, profile, done) {
		process.nextTick(function () {
			if (!req.user) {
				User.findOne({
					'twitter.id': profile.id
				}, function (err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err);

					// if the user is found then log them in, after updating.
					if (user) {
						user.twitter.token = token;
						user.twitter.username = profile.username;
						user.twitter.displayName = profile.displayName;
						user.twitter.image = profile.photos[0].value.replace('_normal', ''); // cut _normal

						User.findOneAndUpdate({
							'twitter.id': profile.id
						}, {
							twitter: user.twitter
						}, function (err, userfound) {
							if (err)
								throw err;

							return done(null, user); // user found, return that user
						});
					} else {
						// if there is no user, create them
						var newUser = new User();

						// set all of the user data that we need
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.twitter.image = profile.photos[0].value.replace('_normal', ''); // cut _normal

						// save our user into the database
						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			} else {
				var user = req.user;

				user.twitter.id = profile.id;
				user.twitter.token = token;
				user.twitter.username = profile.username;
				user.twitter.displayName = profile.displayName;
				user.twitter.image = profile.photos[0].value.replace('_normal', '');

				// save the user
				user.save(function (err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		});

	}));
};
