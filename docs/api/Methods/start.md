# Start

## `keystone.start([callbacks:Mixed])`

This function starts keystone's processes running, connecting to the database and starting the server. Anything that needs to be done to set up either of these must be done before `keystone.start()` is run.

Start can optionally take in either a function or an object as parameters.

If a function is passed in, it acts as a callback, being called once keystone has finished all startup processes.

Example:

```javascript
keystone.start(function () {
  console.log('Application is now running')
})
```

If you wish to be more granular, or have callbacks to specific processes, you can pass in an object, with functions attached to specific steps. You can pass a function in as the properties:

- `onMount` - called when the database connection has been opened.
- `onHttpsServerCreated` - called after the HTTP server has been created.
- `onSocketServerCreated` - if `unix socket` is set to true, will be called after the socket server is created.

> Note that these are run asynchronously to the keystone startup process and cannot interrupt or consistently effect

> Note: If you only require the database connection, you can start it using [openDatabaseConnection](/api/methods/open-database-connection)
