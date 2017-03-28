# Open Database Connection

## `keystone.openDatabaseConnection(callback:Function)`

Opens a database connection using the options set in keystone. If the keystone database settings are not configured, or the models are not registered, this will fail.

`openDatabaseConnection` is called by [start](/api/methods/start), and will be called before the express server is started.
