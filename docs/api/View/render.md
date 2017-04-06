# render

`view.render(pathname:string, locals:object|function, callback:function)`

The render function renders the view, as well as providing the ability to have queries called as the last step before the content is returned to the user.

The pathname looks for the file or filepath within your defined [views](/documentation/configuration/server-options/#views) directory. You can also provide it with a function, which will be called. This circumvents project-wide settings.

Locals passed in will be added to the res.locals to be used by the view. Locals are made available to templating engines for modifying how the view is rendered.

Locals can also be passed a function, the return value of which will be passed in to locals. Note that this must be a synchronous function.

The callback is called once the view has successfully been sent.
