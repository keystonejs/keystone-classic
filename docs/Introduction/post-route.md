# Part 4 -  Adding data to the database from a form

For the final part of this guide, we're going to set up an api endpoint, bringing together our routing configuration and database configuration, so we can see both working together.

## Setup

For part 4, we are going to use a second model, the Event model that was looked at briefly in part 2. Here it is again if you skipped it.

```JS
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event');

Event.add({
	name: { type: String, required: true, initial: true },
	description: { type: Types.Html, wysiwyg: true },
	cost: { type: Number, default: 0, size: 'small' },
	startTime: { type: Types.Datetime, required: true, initial: true, index: true },
	endTime: { type: Types.Datetime, required: true, initial: true, index: true },
	location: { type: Types.Location, required: false, initial: true },

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

We are going to be drawing together everything we added in both [part 2](/introduction/database-setup) and [part 3](/introduction/routing), so we recommend completing both of those.

Your source tree should look like the following:

```
| Our Project
|--node_modules/
|--models
|	|--User.js
|	|--Event.js
|--routes
|	|--index.js
|	|--views
|	|	|--index.js
|--templates
|	|--views
|	|	|--index.pug
|--keystone.js
```

## Adding a `addEvent` view

First we want our pair of new files to make up the route and the view, these should be `routes/views/addEvent` and `templates/views/addEvent.pug`.

As we are not a pug tutorial, here's a page we prepared earlier:

```
TK
```

Next, we want to add a really simple route. The contents of `routes/views/addEvent.js` should be:

```JS
module.exports = function (req, res) {
	res.render('addEvent');
};
```

Finally, we want to add our new route to our `routes/index.js` and add our new path to our app.

The new lines is:

```JS
app.get('/add-event', routes.views.addEvent)
```

so we should now have in our index:

```JS
exports = module.exports = function (app) {
	app.get('/', routes.views.index)
	app.get('/add-event', routes.views.addEvent)
};
```

With all this, we can start keystone, and go to our new route, and fill out the form. Our next step is to receive and process the data.


## Creating an `event/post.js` endpoint

We are going to create a new addition to our app, a handler for a post request, and then a request handler that can save the event information back to our database.

As this endpoint is not a view, we are going to have to modify our routes object. We are going to create a new folder to importRoutes from, called `api`. Beofre this though, let us set up our `routes/index` for it.

First, we want to add a second property to our routes object to read in our api folder. Our routes object should end up looking like:

```JS
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};
```

Second we are gloing to add our new route to our app. As this is not a get request, we need to let the app know. We use this by changing the verb.

```JS
app.post('/api/event', api.event.post);
```

Next we can create our `routes/api/event/post` route. It's alright that the api folder only contains another folder. This structure helps us get the very readable route definition above.

We start out the route much as we have before in the express style for a route:

```JS
module.exports = function (req, res) {
}
```

This time however, we're going to be doing some more complex things. First, we are going to be reading the form data, and second we are going to be saving this to the database.

### Reading the form data

The form data is located on the request object that is passed in, more specifically as the `req.body`. As we have constructed the `req.body` to consist only of fields that we will use, we are going to be able to pass it in directly, however to ensure there are no errors, we want to check our data now.

We can assign these to their own variables in our function to give us:

```JS
module.exports = function (req, res) {
	if (!req.body.name || !req.body.startTime || !req.body.endTime) {
		return res.sendError('incomplete data set');
	}
};
```

### Adding the event to the database

Once we have checked the data, we can move to looking at how data is saved back to the database. We are going to need to require a few things before we come back to our route function.

```JS
var keystone = require('keystone');
var Event = keystone.list('Event');
```

With these set up, we can start looking at how to save the data.

First, we can create a new item, passing in values we want to use as our initial values.

```JS
var newEvent = new Event(req.body);
```

This will return us an object with the properties of an Event from our schema however it has not yet been saved. You can use `newEvent.save()`, which implements mongoose's save method, however keystone provides an `updateItem` function that runs keystone's validators, to make sure the data in the fields complies with keystone's full schema. Yes, updateItem will create an item if it does not exist.

We can call this like so:

```JS
Event.updateItem(newEvent)
```

`updateItem` has a lot of other great features for helping you ensure your data integrity, and we recommend reading the full documentation [here](/list/update-item) when you have time.

This leaves us with a file looking like:

```JS
var keystone = require('keystone');
var Event = keystone.list('Event');

module.exports = function (req, res) {
	if (!req.body.name || !req.body.startTime || !req.body.endTime) {
		return res.sendError({ status: 'incomplete data set' });
	}

	var newEvent = new Event(req.body);
	Event.updateItem(newEvent)


};
```

### Don't leave me hanging

The one flaw here is we never give a response to our waiting website to tell it when we have successfully added an event. We are going to do this in the callback to updateItem. We can also add in some more error checking.

```JS
Event.updateItem(newEvent, function (err) {
	if (err) {
		return res.sendError({
			status: 'error saving the item',
			details: err,
		});
	}

	return res.send('success');
});
```

## Next Steps

- [updateItem](/list/update-item)
