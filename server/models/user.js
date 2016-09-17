var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

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
			ref: 'Link'
		}
	]
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

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
