# Application Updates

Keystone includes an updates framework, which you can enable by setting the `auto update` option to `true`.

Updates provide an easy way to seed your database, transition data when your models change, or run transformation scripts against your database.

Update files should be named using a semantic version followed by an optional key, like `0.0.1-init.js`. The version numbers are used to order the update scripts correctly, while the keys are a nice way to identify what each update does.

Each update file should export a single function, which should accept a single argument - the `next(err)` callback, to be called when the update is complete.

All the update files will be executed (each one waits for the previous update to complete) before the web server is started.

If the `next` callback is receives an error it will be reported to the console, and application initialisation will halt.

You can temporarily disable updates from running in development by setting a `__defer__` property on the exported function to `true`. Any subsequent updates will be skipped, but the application will be started.

Updates are only run once, and each completed update is logged in an `app_updates` collection in your database.

**Update Script Example**
Creates a new admin User

```javascript
var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(done) {
  new User.model({
    name: { first: 'Admin', last: 'User' },
    password: 'admin',
    isAdmin: true
  }).save(done);
};
```
