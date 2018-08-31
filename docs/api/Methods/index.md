# Methods

Keystone has a number of methods available to it to help you out. Each of these are documented here, and can be accessed off the Keystone object. Note that Keystone stores a single global state, so methods such as the [set](/api/methods/set) method apply globally off keystone.

In addition to these methods, there are several constructors and more complex features accessible through keystone.

- [new keystone.List](/api/list) - used to register new lists to your database schema.
- [Field Types](/api/field) - used in constructing lists, this details the field types Keystone makes available to make shaping and displaying your data easy.
- [new keystone.View](/api/view) - used to create new views which have specific logic that is easy to parse and share between views.

You can access keystone's inherent mongoose instance on `keystone.mongoose`. You can access keystone's inherent express on `keystone.express`. If you need to access properties on either directly, you can fin them here.
