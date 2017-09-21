# Location Field

`Object` — Displayed as a combination of fields in the Admin UI

Contains a standard set of strings for storing an address, and a longitude / latitude point with a `2dsphere` index.

Also provides autocomplete functionality using Google's Places API (requires a Google Maps API Key to be provided, must only be used in accordance with Google's terms of service).

Google Places integration requires the `google api key` option to be set for Keystone. See the [Google configuration documentation](http://keystonejs.com/docs/configuration/#services-google) for details.

```
{ type: Types.Location, defaults: { country: 'Australia' } }
```

> Note: the schema paths are based on Australian address formats, and should be updated to be more appropriate for other international formats. If you have feedback on how the structure should be internationalised, please open a ticket.

## Options

`defaults` `Object` - default values for each path in the field schema

`Schema`

`name` `String` - building name

`number` `String` - unit or shop number

`street1` `String` - street address

`street2` `String` - street address line 2

`suburb` `String`

`state` `String`

`postcode` `String`

`country` `String`

`geo` `Array` longitude, latitude

> Important: as per the MongoDB convention, the order for the geo array must be lng, lat which is the opposite of the order used by Google's API.

`enableImprove` `boolean`

Options sets `enableMapsAPI` to true. If it is not set, `enableMapsAPI` is set to true if `google server api key` is set in keystone.

`required` `Array or String or Boolean`

Required works differently for location than for most other properties. There are three different types of require.

If passed an `array`, it uses it to set which parts of the location field are required.

If passed a comma-separated-value `string`, it will transform it into an array of required parts of the location field.

If any positive value is passed in, the location field becomes required for validation, including either of the above options.

## Underscore methods

`googleLookup(region, update, callback)` - autodetect the full address and lng, lat from the stored value.

`region` `String` is passed to the Places API for regional biasing and filtering.
`update` `String` passing "overwrite" will completely overwrite existing data with the result. true will set blank properties on the field with the result.
`callback(err, location, result)` - is passed the parsed **location** object, and the raw **result** from Google.

Internal status codes mimic the Google API status codes. See [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding) for more information.

Use of the Google Geocoding API is subject to a query limit of 2,500 geolocation requests per day, except with an enterprise license.

The Geocoding API may only be used in conjunction with a Google map; geocoding results without displaying them on a map is prohibited. Please make sure your Keystone app complies with the Google Maps API License.

## Underscore methods

`kmFrom([lng, lat])` - Takes a 2dsphere as an array of longitude then latitude, and then returns the distance in kilometres from the location's long/lat. Uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)

`milesFrom` - Takes a 2dsphere as an array of longitude then latitude, and then returns the distance in miles from the location's long/lat. Uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)
