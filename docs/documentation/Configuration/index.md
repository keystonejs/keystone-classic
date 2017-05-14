# Keystone Setup Options

## Setting Options

The options for KeystoneJS cover a range of behaviours, from how the express app is configured to enabling features and authentication options for integrated services.

There are three ways to set options:

- Passing a `{ key: 'value' }` configuration `Object` to the [keystone.init(options)](/api/methods/init) method
- Calling [keystone.set('key', 'value')](/api/methods/set)
- Setting environment variables in `process.env`. Only some options support this (noted below).

If you want to keep secret keys and configuration out of your codebase (especially important for open source projects, or projects where not all developers should have access to production config settings) the [dotenv](npmjs.org/package/dotenv) module makes this very easy to manage.

There are four main types of options, listed below:

- [Project Options](/documentation/configuration/project-options)
- [Web Server Options](/documentation/configuration/web-server-options)
- [Admin UI Options](/documentation/configuration/admin-ui-options)
- [Database and User Auth Options](/documentation/configuration/database-and-user-auth-options)

## Most Important Project Options

### Adding Routes

Keystone allows you to add routes to its internal express app. This is best achieved by setting routes using `keystone.set('routes', routes:Function)`.

The second argument of `set` here should be a function that takes in keystone's express instance, and will call express methods to add routes to it. An example of this can be found in our [setting up](/getting-started/setting-up/part-3) guide.

## Services

### Google Analytics

Keystone has support for Google Analytics tracking in the Admin UI. To enable tracking, set the following configuration options:

<h4 data-primitive-type="String"><code>ga property</code></h4>

Your Google Analytics Property. Will default to `process.env.GA_PROPERTY`.

<h4 data-primitive-type="String"><code>ga domain</code></h4>

Your Google Analytics Domain. Will default to `process.env.GA_DOMAIN`.

> Note if you only want to include Google Analytics tracking in the front-end of your project, you should use different variable names from those above.

### Google Maps

Keystone's [Location field type](/api/field/location/) supports integration with the [Google Maps API](https://www.morethanamap.com/) to auto-improve values (including discovering latitude and longitude) via the [Places Autocomplete API](https://developers.google.com/places/web-service/autocomplete).

To enable these features, [obtain an API Key from Google](https://code.google.com/apis/console/) and enable the Google Maps v3 and Google Places APIs for it, then set the following options:

<h4 data-primitive-type="String"><code>google api key</code></h4>

Your Google API browser key, used to authenticate the Javascript Maps API in the Admin UI. Will default to `process.env.GOOGLE_BROWSER_KEY`.

<h4 data-primitive-type="String"><code>google server api key</code></h4>

Your Google API server key, used to authenticate requests to the Maps API from the server. Will default to `process.env.GOOGLE_SERVER_KEY`.

<h4 data-primitive-type="String"><code>default region</code></h4>

Optional setting to limit autocomplete results to a specific region. This option takes a region code, specified as a [IANA language region](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) subtag.

Can be specified on a per-field basis by setting the `region` option on any `Location` field.

```javascript
keystone.set('google api key', 'your-browser-key');
keystone.set('google server api key', 'your-server-key');
keystone.set('default region', 'au'); // optional, will limit autocomplete results to Australia
```

> Note that the use of the Places Geocoding API is subject to a query limit of 2,500 geolocation requests per day, except with an enterprise license.

> The Places Geocoding API may only be used in conjunction with a Google map; geocoding results without displaying them on a map is prohibited. Please make sure your Keystone app complies with the Google Maps API License.

### Embed.ly

Embed.ly is a service that will parse a url (e.g. Youtube embed link) and return a whole lot of useful information, like the provider name, summary metadata, width and height of videos, as well as a clean link to use for embedding media in your views. They offer a free plan for up to 5,000 urls per month.

The Embedly field type is an easy way to integrate their API with your KeystoneJS app.

To configure KeystoneJS to support the Embed.ly API, simply sign up for an account, get your api key, and set the embedly api key option.

This option will default to the EMBEDLY_API_KEY environment variable if it is set.

```javascript
keystone.set('embedly api key', 'your-key');
```

## Disabling the Admin UI

You can disable the Admin UI by setting the `headless` option to `true`.

This will allow you to use `keystone.start()` or `keystone.set('routes', aRouter.)` without Keystone creating route bindings for the Admin UI routes under `/keystone`.
