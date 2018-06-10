# Money Field

Stores a `Number` in the model.
Displayed as a number field in the Admin UI.

Input should either be a valid `Number`, or a string that can be converted to a number (leading symbols are allowed; can be blank unless field is required).

## Example

```js
{ type: Types.Money }
```

## Options

`format` `String` - formats the stored value using [numeraljs](http://numeraljs.com/).

```js
{ type: Types.Money, format: '$0,0.00' }
```

## Underscore Methods

`format(string)` - formats the stored value using [numeraljs](http://numeraljs.com/). Set to `false` to disable automatic formatting.

Format string defaults to `$0,0.00`.

## Methods

### Inherits from [`Number`](../number)

* `format`
* `validateInput`
* `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Number`](../number) field type.
