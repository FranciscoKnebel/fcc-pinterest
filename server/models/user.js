const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autopopulate = require('mongoose-autopopulate');
const shortid = require('shortid');

// define the schema for our user model
var userSchema = mongoose.Schema({
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String,
		image: String,
		_id: false
	},
	links: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Link',
			autopopulate: true
		}
	],
	profile: {
		type: String,
		'default': shortid.generate
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

userSchema.plugin(autopopulate);

userSchema.methods.addLink = function (link) {
	this.links.push(link);
	this.markModified('links');

	return this.links;
}

// generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
