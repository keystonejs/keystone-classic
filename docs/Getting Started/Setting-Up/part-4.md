# Part 4: Adding data from a form

For the final part of this Setting Up guide, we're going to set up an API endpoint to connect together the routing configuration and database configuration.

## Setup

We are going to use a second model, the Event model that was looked at briefly in [Part 2: Data Model Setup](/getting-started/setting-up/part-2):

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

We are going to be using everything added in [Part 2: Data Model Setup](/getting-started/setting-up/part-2) and [Part 3: Routing](/getting-started/setting-up/part-3), so we recommend completing both of those sections before continuing.

Your source tree should look like the following:

```sh
| MyProject
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

## Creating an addEvent view

First, we want to create a pair of new files to make up the route and the view. These should be `routes/views/addEvent` and `templates/views/addEvent.pug`.

As this is not a Pug tutorial, here's a page we prepared earlier for the `addEvent.pug` template:

```jade
doctype html
html(lang="en")
  head
    title= "Add Event"
  body
    if enquirySubmitted
      h3 Your Event has been added to the database
    else
      .container
        .row: .col-sm-8.col-md-6
          form(method='post')
            input(type='hidden', name='action')
            .form-group
              label Event Name
              input(type='text', name='name')
            .form-group
              label Start Time
              input(type='datetime-local', name='startTime')
            .form-group
              label End Time
              input(type='datetime-local', name='endTime')
            .form-group
              label Description
              textarea(name='description', placeholder='event description...' rows=4)
            .form-actions
              button(type='submit').btn.btn-primary Send
```

Next, we want to add a really simple route. The contents of `routes/views/addEvent.js` should be:

```javascript
module.exports = function (req, res) {
  res.render('addEvent');
};
```

Finally, we want to add this new route to `routes/index.js` and add a new path to our Keystone application.

The new route to add is:

```javascript
app.get('/add-event', routes.views.addEvent)
```

... so `/routes/index.js` should now contain:

```javascript
exports = module.exports = function (app) {
  app.get('/', routes.views.index)
  app.get('/add-event', routes.views.addEvent)
};
```

With this routing configured you should be able to start Keystone, go to the new route, and fill out the Event form. The next step will be to receive and process the data.

## Creating an `event/post.js` endpoint

We are now going to add a handler for a post request and a request handler that can save the event information back to our database.

As this endpoint is not a view, we are going to have to modify our routes object. We are going to create a new folder to importRoutes from, called `api`.

First we need to add a property to our `routes` object to read the `api` folder. The `routes` object should end up looking like:

```javascript
var routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api'),
};
```

Second we are going to add a new route to the application. As this is not a get request, we need to let the app know by changing the verb to `post`:

```javascript
app.post('/api/event', routes.api.event.post);
```

Next, we can create our `routes/api/event/post` route. It is alright that the api folder only contains another folder. This structure helps us get the very readable route definition above.

We start out the route much as we have before in the Express style for a route:

```javascript
module.exports = function (req, res) {
}
```

This time, however, we're going to be doing some more complex things. First we are going to be reading the form data, and then we are going to be saving this data to the database.

### Reading the form data

The form data is located on the request object that is passed in -- more specifically as the `req.body`. As we have constructed `req.body` to consist only of fields that we will use, we are going to be able to pass it in directly. However, to ensure there are no errors it is best to check for the expected values.

We can assign these to their own variables in our function to give us:

```javascript
module.exports = function (req, res) {
  if (!req.body.name || !req.body.startTime || !req.body.endTime) {
    return res.sendError('incomplete data set');
  }
};
```

### Adding the event to the database

Once the form data has been validated, we can move to looking at how data is saved back to the database.

We will require a few packages before we come back to our route function:

```javascript
var keystone = require('keystone');
var Event = keystone.List('Event');
```

With these set up, we can start looking at how to save the data.

First, we can create a new Event item including passing initial values:

```javascript
var newEvent = new Event.model(req.body);
```

This code will return an object with the properties of an Event from our schema, however the object has not yet been saved to the database. You can use `newEvent.save()` which implements Mongoose's `save()` method, however Keystone provides an `updateItem()` function that runs Keystone's validators (which can include additional validation). If an item does not already exist, `updateItem()` will create the item.

We can call this like so:

```javascript
Event.updateItem(newEvent)
```

> NOTE: [`updateItem()`](/api/list/update-item) has a lot of other great features for helping you ensure data integrity, and we recommend reading the full documentation when you have time.

This leaves us with a file looking like:

```javascript
var keystone = require('keystone');
var Event = keystone.List('Event');

module.exports = function (req, res) {
  if (!req.body.name || !req.body.startTime || !req.body.endTime) {
    return res.send({ status: 'incomplete data set' });
  }

  var newEvent = new Event.model();
  Event.updateItem(newEvent, req.body);

};
```

### Don't leave me hanging

The one flaw here is we never give a response to our waiting website to tell it when we have successfully added an event. We are going to do this in the callback to `updateItem`. We can also add in some more error checking.

```javascript
Event.updateItem(newEvent, req.body, function (error) {
  res.locals.enquirySubmitted = true;
  if (error) res.locals.saveError = true;
  res.render('addEvent');
});
```

## Congratulations
Well done! You have finished this four-step guide to getting started with Keystone, and you now have a basic Keystone app complete with an API for form handling that adds data to a database. For more information on list options and the field types Keystone supports, browse the [Database Configuration](/documentation/database/) documentation.

You should also [Follow @KeystoneJS on Twitter](https://twitter.com/keystonejs) for news and updates, [Star KeystoneJS on GitHub](https://github.com/keystonejs/keystone), and discuss this guide (or anything KeystoneJS related) on the [KeystoneJS Community Slack](https://launchpass.com/keystonejs).

Enjoy using KeystoneJS!

## Next Steps
- [Guides](/guides)
- [Documentation](/documentation)
- [API](/api)
- [updateItem()](/api/list/update-item)
