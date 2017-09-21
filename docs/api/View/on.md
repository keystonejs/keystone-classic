# on

`view.on(prerenderFunction:Function)` or `view.on(action:String, prerenderFunction:Function)`

Used to add functions to be called before the render. This can go into any of the four queues. If only a function is passed in, it will be added to the actionQueue by default.

If the action is `init`, the function will be pushed on to the `initQueue`.

Example:

```javascript
view.on('init', function (next) {
  /* an action */
})
```


If the action is `render`, the function will be pushed on to the `renderQueue`.

If the action is `get`, `post`, `put` or `delete`, the function will only be called for the corresponding http method, added to the `actionQueue`.

For actions based on http methods, a third argument can be passed in between the two other arguments.

on a `POST` and `PUT` requests search the req.body for a matching value. On every other request search the query.

Example for post request:

```javascript
view.on('post', { action: 'theAction' }, function(next) {
  // respond to the action
  next();
});
```

Example for get request:

```javascript
view.on('get', { page: 2 }, function(next) {
  // do something specifically on ?page=2
  next();
});
```
