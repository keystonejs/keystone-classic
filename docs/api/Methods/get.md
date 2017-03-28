# Get

## `keystone.get(key:String)`

Retrieve a property from keystone's options. For information about keystone's options, see [configuration](/documentation/configuration) documentation.

This can be used to retrieve information about keystone's running once it has started.

Example:

```javascript
keystone.get('env')
```

> NOTE: `keystone.get` is an alias for [keystone.set](/api/methods/set). As such, passing in a second argument will cause it to set the value of the keystone option to the second argument before returning the value.
