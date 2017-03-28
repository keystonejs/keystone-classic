# Middleware

Middleware are functions that run before or after particular actions, normally to perform an authentication action, or to add extra information. For a full explanation of middleware, we recommend reading the express documentation on [middleware](https://expressjs.com/en/guide/using-middleware.html).

Keystone includes some middleware automatically, to handle login and auth.

All of keystone' middleware aside from the `pre:render` middleware are intended to run only within keystone-specific routes, and are added to the express router after your own routes have been registered.

In keystone, there are a number of middleware that can be added globally, which will then be called at defined times during routing. These can be passed into the [set](/api/methods/set) method. These are:

name | call time
---|---
`pre:static` |
`pre:logger` |
`pre:bodyparser` |
`pre:session` |
`pre:admin` |
`pre:routes` |
`pre:render` | Called before a keystone [view](/api/view) is rendered.
`updates` |
`signin` | Called before a user signs in to the keystone admin UI and the user is returned a view.
`signout` | Called before a user signs out of the admin UI and the user is returned a view.
