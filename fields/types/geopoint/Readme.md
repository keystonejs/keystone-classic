# GeoPoint Field

Stores an `Array` of `Number` values in the model.

Displayed as two text input fields in the Admin UI of latitude and longitude.

If you are updating the database, it requires the two numbers to be in [longitude, latitude] order.

## Example
```js
{ type: Types.GeoPoint }
```

Uses MongoDB's [2dsphere](https://docs.mongodb.com/manual/core/2dsphere/) index to add the longitude / latitude pair to schema.
