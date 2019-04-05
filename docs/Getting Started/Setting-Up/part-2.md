# Part 2: Data Model Setup

Keystone has an easy database integration with [MongoDB](https://mongodb.com), and uses the [Mongoose ODM](http://mongoosejs.com/) under the hood to help manage your data. In this section of the tutorial you are going to connect your app to MongoDB and add a user model so you can log into the admin UI.

## Setup

From [Part 1: Initial Setup](/getting-started/setting-up/part-1), you should have the following files:

```sh
| MyProject
|--node_modules/
|--package.json
|--keystone.js
```

You should have installed Keystone with at least the following in your `keystone.js` file:

```javascript
var keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

## Adding a User model

### Modifying the `keystone.js` file

As mentioned in Part 1, `keystone.init` defines initial options for Keystone's startup. For configuring a database connection, you are going to add four new properties to your `keystone.init`:

 1. `name`: This is used as the site name and defaults to `KeystoneJS`. This will also be the name of your database in MongoDB.

 2. `'user model'`: The name of your user model. Let's use `'User'` to keep things simple.
 
 3. `auth`: Set this to `true` so accessing the Keystone admin UI requires a user to log in.

 4. `'auto update'`:  Set this to `true` to enable Keystone's application update feature. This is will make it very easy to get seed data into your project.

Your `keystone.init` should now have at least the following properties:

```javascript
keystone.init({
  'cookie secret': 'secure string goes here',
  'name': 'my-project',
  'user model': 'User',
  'auto update': true,
  'auth': true,
});
```

> NOTE: If you want to read more about available configuration options, see [Keystone Setup Options](/documentation/configuration).

Finally, add a new line to import your models. This should be placed after `keystone.init` but before `keystone.start`:

```javascript
keystone.import('models');
```

The `import` method pulls in an entire folder (in this case the `models` folder) and allows you to add as many models as you want without having to come back and let Keystone know you've added something new. New models will be noticed each time Keystone starts.

> NOTE: If you want to learn more, see [`keystone.import()`](/api/methods/import).

### Adding a model file

Next up, you're going to add a file to hold the code which will define your `User` model.

First you need to create a directory called `models` and make a new file `User.js` in it.

Your project folder should now look like:

```sh
| MyProject
|--node_modules/
|--models
|	|--User.js
|--package.json
|--keystone.js
```

In `User.js` you are going to start by creating a new list. You'll need the following code:

```javascript
var keystone = require('keystone');

var User = new keystone.List('User');
```

This constructor will create a User model which is a `keystone.List`. This list doesn't have any properties yet, so isn't going to be very useful. Let's add some data fields below this code:

```javascript
User.add({
  displayName: { type: String },
  password: { type: keystone.Field.Types.Password },
  email: { type: keystone.Field.Types.Email, unique: true },
});
```

This adds three fields to your model: a display name, a password field, and an email field. Let's break down the structure of these.

```javascript
displayName: { type: String }
```

This demonstrates the most basic field definition. Every field needs a `type` property defined: `displayName` uses JavaScript's default `String` type.

```javascript
password: { type: keystone.Field.Types.Password }
```

The `password` field is using a Keystone-specific field type. This adds a defined shape to the data and some extra UI and data layer validation. Keystone's Password field types are automatically encrypted when saved. In addition, the Keystone admin UI will not display the contents of the `password` field and will require a password to be entered twice to change it.

This takes care of a lot of our password security for us.

```javascript
email: { type: keystone.Field.Types.Email, unique: true },
```

The `email` field is similar to `password` in that it is using another Keystone-specific field type. Keystone's Email type validates that field entries look like valid email addresses. In addition, we have passed a second option of `unique: true` which forces the field to be unique within the database. No doubling up on email addresses for accounts.

If you want to know about all the field types Keystone offers, you can find the full list of options in the [Field API documentation](/api/field). Also, for options like `unique` which are available to all fields, you can read more about the [Field options API](/api/field/options). Understanding available field types and options will be very useful when you are making your own data models.

There are three more steps remaining to get your user model working. The first is to register the model so Keystone knows to include User in its list of models.

To do this, add the following line to the bottom of the `User.js` file:

```javascript
User.register();
```

### canAccessKeystone

Next, since this User model will be used for logging into the admin UI you need to add the property `canAccessKeystone`. We are going have a User model that allows all users to access to Keystone, but you will likely want to implement more fine-grained control for your own apps.

Add this above `User.register`:

```javascript
User.schema.virtual('canAccessKeystone').get(function () {
  return true;
});
```

> NOTE: If you want to know more about virtuals and other schema methods, you can find the [schema documentation](/api/list/schema).

#### Default columns to display

The final part of setting up your user model is to define the default columns to be displayed in the admin UI.

Add this line just above `User.register`:

```javascript
User.defaultColumns = 'id, displayName, email';
```

#### A working User model

Alright, that's your User model complete!

You should now have a file that looks like this:

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

User.defaultColumns = 'id, displayName, email';
User.register();
```

### Adding an update script

There's one more thing to do before you can launch your app. You need to have an initial user in your database. You can do this through an update script, which Keystone will run on startup.

Make a new directory called `updates` and make a file `0.0.1-first-user.js` in it. 

Add the following code to `0.0.1-first-user.js`:

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

This will create a user with these details (though the password will be hashed before saving) when Keystone is started up. If you want to know more about update scripts, see [Application Updates](/documentation/database/application-updates).

> NOTE: You will likely end up committing your update scripts to your project, so you should not include sensitive information. Any passwords added in an update script should be manually changed afterwards.

## Exploring the Admin UI

Now you're ready! You should be able to run `node keystone.js` to start up your app.

If you point your favourite web browser at `http://localhost:3000/keystone` you should now be presented with a login page. Log in using the email address and password you just added, and have a bit of a play around.

### Event model

Below is a more interesting model to play with. Add this in and then restart your Keystone application.

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

Event.defaultColumns = 'name, description';
Event.register();
```

## Next Steps

This tutorial continues in [Part 3: Routing](/getting-started/setting-up/part-3), which walks you through adding static pages to your site.

## Learn more about:

- [Keystone Setup Options](/documentation/configuration)
- [Importing models](/api/methods/import)
- [Keystone Field Types](/api/field)
- [Keystone Field Options](/api/field/options)
- [Application Updates](/documentation/database/application-updates)
- [Virtuals and schema methods](/api/list/schema)
