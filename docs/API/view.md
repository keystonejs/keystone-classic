# View

Keystone has a concept of views, which are used to help with rendering a view from the template you have set in your [configuration](/configuration). `keystone.View` is a constructor to create views for use. The view is intended to make it easy to add things such as locals, as well as change content based on server-side actions.

`keystone.View` should be used within a route:

```JS
module.exports = function (req, res) {
	var view = new keystone.View(req, res);

	view.render('view-filename');
};
```

The view constructor expects the request and response objects from an express route call, and will throw an error if this is not passed in.

There are also four options for pre-render hooks that can be added, which will be run in the following order.
- initQueue
- actionQueue
- queryQueue
- renderQueue

These allow the values to be changed and the render to be different based on the request, all within the view logic.

These can be set to either arrays or functions. It is recommended you use the `view.on()` method to add actions to your queue.

Each of these queues will be run in series, so `initQueue` will have all functions resolve before the `actionQueue` has started, however within queues, all actions are called in parallel. If an action must be resolved before another, it should be placed in an earlier queue.

Any globally defined `pre:render` hooks are added after the `queryQueue`. For more information on defining hooks globally, see [keystone.pre](/api/pre)

As these functions act as middleware, they expect a callback function as the first argument.

## render

`view.render(pathname:string, locals:object|function, callback:function)`

The render function renders the view, as well as providing the ability to have queries called as the last step before the content is returned to the user.

The pathname looks for the file or filepath within your defined [views](/configuration/#views) directory. You can also provide it with a function, which will be called. This circumvents project-wide settings.

Locals passed in will be added to the res.locals to be used by the view. Locals are made available to templating engines for modifying how the view is rendered.

Locals can also be passed a function, the return value of which will be passed in to locals. Note that this must be a synchronous function.

The callback is called once the view has successfully been sent.


## query

`view.query(key:String, query:QueryObject[, options:Object])`

Attaches a database query to be run before the render occurs, during the `queryQueue` run. The data returned from the query will be attached to the `locals` with the value of the key.

Example:

```JS
var User = keystone.list('User');

view.query('currentUser', User.model.findOne({ name: req.body.name }));
```

This query will add the user with a matching name to `locals.currentUser` for use by the template in rendering.

## on

`view.on(prerenderFunction:Function)` or `view.on(action:String, prerenderFunction:Function)`

Used to add functions to be called before the render. This can go into any of the four queues. If only a function is passed in, it will be added to the actionQueue by default.

If the action is `init`, the function will be pushed on to the `initQueue`.

Example:

```JS
view.on('init', function (next) {
	/* an action */
})
```


If the action is `render`, the function will be pushed on to the `renderQueue`.

If the action is `get`, `post`, `put` or `delete`, the function will only be called for the corresponding http method, added to the `actionQueue`.

For actions based on http methods, a third argument can be passed in between the two other arguments.

on a `POST` and `PUT` requests search the req.body for a matching value. On every other request search the query.

Example for post request:

```JS
view.on('post', { action: 'theAction' }, function(next) {
	// respond to the action
	next();
});
```

Example for get request:

```JS
view.on('get', { page: 2 }, function(next) {
	// do something specifically on ?page=2
	next();
});
```
