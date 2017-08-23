
# Project Options

The following options control the branding, navigation and default export settings of the KeystoneJS application in the Admin UI:

<h4 data-primitive-type="String"><code>name</code></h4>

The name of the KeystoneJS application

<h4 data-primitive-type="String"><code>name</code></h4>

Displayed in the top left hand corner of the Admin UI

<h4 data-primitive-type="String"><code>module root</code></h4>

This setting tells Keystone the root path of your app. By default, `module root` points to the path of the first script that required Keystone within your app. This default may be undesirable at times.

Setting `module root` allows you to specify a custom root path for your app. Overriding the default `module root` may be useful, for example, when unit testing your app.

`module root` is used by Keystone's `.getPath()` method to resolve/expand the paths of the `views`, `favicon`, `extensions`, `ssl cert`, `ssl key`, `ssl ca`, `emails`, and `updates` settings.

When setting a custom `module root` you may use either an absolute or a relative path.

> NOTE: If a relative path is used, it will be considered relative to the location of the script from which the setting was made.

<h4 data-primitive-type="String|Boolean"><code>frame guard</code></h4>

This settings tells Keystone how to handle `iframe` tags. It does this by setting the response `X-Frame-Options` header. This header is used to protect against "ClickJacking" attacks.

The default setting is `sameorigin`.

Valid options are:

- `"sameorigin"` allows requests from iframe tags that originate from the same server
- `"deny"` denies requests form all iframe tags, regardless of origin
- `true` (same as "deny" )
- `false` disables frame guard

<h4 data-primitive-type="Object"><code>nav</code></h4>

An object that specifies the navigation structure for the Admin UI. Create a key for each section that should be visible in the primary navigation. Each key's value can be a single list path (as is seen in the URL when you view a list) or an array of list paths. When an array is used, secondary navigation is rendered in the Admin UI.

The nav is also used to generate the links on the Admin UI home page; any lists that are registered but not included in the `nav` will be grouped at the bottom of the screen under the 'Other' heading.

**Custom Navigation Example**

If you had `User`, `Post` and `PostCategory` models, you could group the posts and post categories into a **Content** navigation item like this:

```javascript
keystone.set('nav', {
  'users': 'users',
  'content': ['posts', 'post-categories']
});
```

<h4 data-primitive-type="String"><code>csv field delimiter</code></h4>

Allow you to choose a custom field delimiter to be used for CSV export instead of the default comma.

<h4 data-primitive-type="Object"><code>app</code></h4>

Instance of Express to be used instead of the default instance.

<h4 data-primitive-type="Object"><code>mongoose</code></h4>

Instance of Mongoose to be used instead of the default instance.

> NOTE
> The `app` and `mongoose` options replace the functionality of the `keystone.connect()` method which is now deprecated. Due to changes in Express 4, `keystone.connect()` no longer works as expected.
