var mongoose = require('mongoose');

// define the schema for our user model
var linkSchema = mongoose.Schema({
	image: String,
	likes: [
		{
			owner: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			when: Date
		}
	],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	tags: [String]
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

linkSchema.methods.toggleLike = function (owner) {
	//check if user already liked
	if (likes.find({owner: owner.id})) {}
	//if yes, splice like from likes array
	//if no, push like object into likes array
}

linkSchema.methods.addTag = function (tag) {
	//check if tag is already added
	//if yes, return false
	//if no, push tag into tags array
}

linkSchema.methods.newLink = function (image, owner, tags) {
	this.image = image;
	this.owner = owner;
	this.tags = tags;

	return this;
}

linkSchema.methods.newLink = function (image, owner) {
	this.image = image;
	this.owner = owner;

	return this;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Link', linkSchema);
