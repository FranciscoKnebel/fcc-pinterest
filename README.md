# fcc-pinterest


##### User Stories
* As an unauthenticated user, I can login with Twitter.
* As an authenticated user, I can link to images.
* As an authenticated user, I can delete images that I've linked to.
* As an authenticated user, I can see a Pinterest-style wall of all the images I've linked to.
* As an unauthenticated user, I can browse other users' walls of images.
* As an authenticated user, if I upload an image that is broken, it will be replaced by a placeholder image.

#### Deployment
###### .env file:
```
PORT=80
NODE_ENV=development

MONGODB_URI=
SESSION_SECRET=

TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_CALLBACK=
```

#### Demo
Demo is currently running at Heroku. [Click here to access it.](https://limitless-lowlands.herokuapp.com/)

#### License
MIT License. [Click here for more information.](LICENSE)
