# Part 2 - Database Setup

Keystone has an easy database integration with [mongodb](mongodb.com), and uses [mongoose](http://mongoosejs.com/) under the hood to help manage your data. In part 2, we are going to connect our app to mongo, and add a user model, so we can log in to and look at the admin UI.

## Setup

From [Part 1](/getting-started/setting-up/part-1), we should have the following files:

```sh
| our Project folder
|--node_modules/
|--package.json
|--keystone.js
```

We should have installed keystone. We need at least the following in our `keystone.js` folder:

```javascript
var keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

## Adding a `User` model

### Modifying our `keystone.js` file

As we mentioned in part one, keystone.init allows us to define our initial options for keystone's startup. For configuring our database connection, we are going to add 4 new properties to our `keystone.init`.

Firstly, we are going to add a `name`. This is used as the site name, and defaults to `KeystoneJS`. This will also be the name of our database in mongo.

Next, we want to define what our `'user model'` will be. Let's call it `'User'` to keep it simple.

We want to set `auth` to be `true` so accessing the keystone admin UI requires a person to log in.

Finally we want to set `'auto update'` to be `true`. This is going to make it very easy to get our seed data in to our project.

Our init should now have at least the following properties:

```javascript
keystone.init({
  'cookie secret': 'secure string goes here',
  'name': 'our-project',
  'user model': 'User',
  'auto update': true,
  'auth': true,
});
```

If you want to read more about these options, you can find the documentation [here](/documentation/configuration).

Finally, we are going to add a new line to the file, which is going to import our models. This should be placed after `keystone.init` but before `keystone.start`

```javascript
keystone.import('models');
```

The `import` method allows us to pull in an entire folder, in this case the entire models folder, and will allow us to add as many models as we want without having to come back and let keystone know we've added something new. New models will be noticed each time keystone starts.

If you want to know more about `keystone.import()` the documentation is [here](/api/methods/import).

### Adding our model file

Next up, we're going to add a file to hold the code which will define our `User` model for us.

First we need to create a directory called `models` and make a new file `User.js` in it.

Our folder should now look like:

```sh
| our Project folder
|--node_modules/
|--models
|	|--User.js
|--package.json
|--keystone.js
```

In User.js, we are going to start by creating a new list. We'll need the following code:

```javascript
var keystone = require('keystone');

var User = new keystone.List('User');
```

We now have a User model from our constructor. This list doesn't have any properties yet, so isn't going to be very useful to us, so let's add some data fields below this code.

```javascript
User.add({
  displayName: { type: String },
  email: { type: keystone.Field.Types.Email, unique: true },
  password: { type: keystone.Field.Types.Password },
});
```

This adds new fields to our model. Here we are adding a display name, as well as an email field and a password field. Let's break down the structure of these.

```javascript
displayName: { type: String }
```

This is our most basic field here. Every field needs a `type` property defined, and here we are using one of the base types in javascript to define what our field is.

```javascript
password: { type: keystone.Field.Types.Password }
```

Our email field is using a keystone-specific field type. This adds a defined shape to the data, as well as a collection of extra validation. For the password field, it will encrypt it for us. In addition, in the keystone admin UI, it will not display the contents of the password field, and will require a password to be entered twice to change it.

This takes care of a lot of our password security for us.

```javascript
email: { type: keystone.Field.Types.Email, unique: true },
```

Email is similar to password in that it is using a keystone-specific field type, in this case to ensure that when this field is filled, it has the shape of an email. In addition, we have passed a second option of `unique: true`, which forces the field to be unique within the database. No doubling up on email addresses for accounts.

// The following para really needs more work. Needs lightness and timing
If you want to know about all the field types keystone offers, you can find the information find the full list of options in the [field docs](/api/field) Also, for the options like `unique` which are available to all fields, you can read more [here](/api/field/options), for when you are making your own models.

There are three more parts we are going to need to get our user model working. The first is to register it to keystone. This will tell keystone to include it in its list of models. To do this, add the following line to the bottom of the file:

```javascript
User.register();
```

Next, as we want this to be our User model for logging in to the admin UI, we needs to add the property for `canAccessKeystone` to the model. We are going have a User model that allows all users to access to keystone, but you will likely want to implement more fine-grained control for your own apps. Add this above `User.register`:

```javascript
User.schema.virtual('canAccessKeystone').get(function () {
  return true;
});
```

If you want to know more about virtuals and other schema methods, you can find the [schema documentation](/api/list/schema).

The final part of setting up our user model is to define the default columns to be displayed in the admin UI.

Add this line just above `User.register`:

```javascript
`User.defaultColumns = 'id, displayName, email';`
```

Alright, that's our user model complete. We should now have a file that looks like this:

```javascript
var keystone = require('keystone');

var User = new keystone.List('User');

User.add({
  displayName: {type: String },
  email: { type: keystone.Field.Types.Email, unique: true },
  password: { type: keystone.Field.Types.Password },
});

User.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

User.register();
```

### Adding an update script

There's one more thing to do before we can launch our app. We need to have an initial user in our database. We can do this through an update script, which keystone will run on startup.

Make a new directory called `updates` and make a file `0.0.1-first-user.js` in it. Next we can just drop in the following code:

```javascript
exports.create = {
  User: [
    {
      displayName: 'user1',
      email: 'user@keystonejs.com',
      password: 'admin',
    },
  ],
};

```

This will create a user with these details (though the password will be hashed before saving) when keystone is started up. If you want to know more about update scripts, you can find the information [here](/documentation/configuration).

An important note is that you will likely end up committing your update scripts to your project, so you should not include sensitive information in here. Any passwords added in an update script should be manually changed afterwards.

## Exploring the Admin UI

And now we're ready! We can run `node keystone.js` to start up our app.

We can now navigate to `localhost:3000/keystone` and be presented with a login page. Log in using the email address and password you just added, and have a bit of a play around. In fact, here are two more models to make this easier. Add these in and then restart your app.

`models/Event.js`

```javascript
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event');

Event.add({
  name: { type: String, required: true, initial: true },
  description: { type: Types.Html, wysiwyg: true },
  cost: { type: Number, default: 0, size: 'small' },
  startTime: { type: Types.Datetime, required: true, initial: true, index: true },
  endTime: { type: Types.Datetime, required: true, initial: true, index: true },
  location: { type: Types.Location, initial: true },
  published: { type: Boolean },
  publishDate: { type: Types.Date, index: true },
});

Event.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Event.schema.pre('save', function (next) {
  let event = this;
  if (event.isModified('published') && event.published) {
    this.publishDate = Date.now();
  }
  return next();
});

Event.defaultColumns = 'displayName, email';
Event.register();
```

## Next Steps
Check out [part 3](/getting-started/setting-up/part-3) of our setting up keystone guide, which walks you through adding your own pages to your site, or if you want to read more about any of the parts we set up, you can check out these links:

learn more about:

- [configuring keystone](/documentation/configuration)
- [importing models](/api/methods/import)
- [list of keystone fields](/api/field)
- [keystone field options](/api/fields/options)
- [update scripts](/documentation/application-updates)
- [virtuals and schema methods](/api/list/schema)
