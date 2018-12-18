# Underscore methods

Many fields have special functions to allow you to manipulate data, which are referred to throughout the documentation called `underscore methods`. These allow specific actions to be called that relate to the data in that field. An example is the `password.compare` method.

To access an underscore method, you can use an instance of the object. For example, if you have a user with a password field, you may want to access the compare method.

Once you have retrieved a user from the database you can find the method at:

```js
user._.password.compare()
```

> NOTE: Underscore Methods in Keystone have no relation to the javascript underscore library.
