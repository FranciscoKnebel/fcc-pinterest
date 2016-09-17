var mongoose = require('mongoose');
const isimageurl = require('is-image-url');
var autopopulate = require('mongoose-autopopulate');
var random = require('mongoose-random');

// define the schema for our user model
var linkSchema = mongoose.Schema({
	title: String,
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
		ref: 'User',
		autopopulate: {
			select: 'twitter'
		}
	},
	tags: [String]
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

linkSchema.plugin(autopopulate);
linkSchema.plugin(random, {path: 'r'});

linkSchema.methods.toggleLike = function (owner) {
	//check if user already liked
	var foundIndex = findById(this.likes, owner.id);

	if (foundIndex) { //if yes, splice like from likes array
		this.likes.splice(foundIndex, 1);
	} else { //if no, push like object into likes array
		this.likes.push({owner: owner, when: new Date()});
	}
	this.markModified('likes');
	return this.likes;
}

linkSchema.methods.addTag = function (tag) {
	//check if tag is already added
	//if yes, return false
	for (var i = 0; i < this.tags.length; i++) {
		if (this.tags[i] == tag) {
			return false;
		}
	}
	//if no, push tag into tags array
	this.tags.push(tag);
	this.markModified('tags');
	return this.tags;
}

linkSchema.methods.newLink = function (image, owner, title) {
	this.title = title;
	this.markModified('title');

	if (isimageurl(image)) {
		this.image = image;
		this.markModified('image');
	}
	this.owner = owner;
	this.markModified('owner');

	return this;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Link', linkSchema);

function findOwnerById(source, id) {
	console.log(id);

	for (var i = 0; i < source.length; i++) {
		console.log(source[i].owner === id);
		if (source[i].owner === id) {
			return i;
		}
	}

	return false;
}
