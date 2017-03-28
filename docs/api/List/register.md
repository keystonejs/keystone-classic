# Register

Adds a list to keystone's know lists.

This checks the options chosen for a list and validates them, and then makes them available through [keystone.list](/api/methods/list). Without register being run, the list will not be added to either mongoose or keystone.

This should be run before [keystone.start](/api/methods/start)
