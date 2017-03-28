# View

Keystone has a concept of views, which are used to help with rendering a view from the template you have set in your [configuration](/documentation/configuration). `keystone.View` is a constructor to create views for use. The view is intended to make it easy to add things such as locals, as well as change content based on server-side actions.

`keystone.View` should be used within a route:

```javascript
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

These can be set to either arrays or functions. It is recommended you use the [view.on()](/api/view/on) method to add actions to your queue.

Each of these queues will be run in series, so `initQueue` will have all functions resolve before the `actionQueue` has started, however within queues, all actions are called in parallel. If an action must be resolved before another, it should be placed in an earlier queue.

Any globally defined `pre:render` hooks are added after the `queryQueue`. For more information on defining hooks globally, see [keystone.pre](/api/method/pre)

As these functions act as middleware, they expect a callback function as the first argument.

A view has the following methods:

- [render](/api/view/render)
- [query](/api/view/query)
- [on](/api/view/on)
