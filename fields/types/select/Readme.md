# Select Field

Stores a `String` or `Number` in the model.
Displayed as a select field in the Admin UI.
Does not allow for multiple items to be selected. If you want to provide multiple values, you can use `TextArray` or `NumberArray`, although neither will have the same constrained input. You can limit the options using a pre-save hook.

```js
  { type: Types.Select, options: 'first, second, third' }
```

> Note: Similar to `Enum` in other Frameworks.

## Methods

### `format`

Returns the `label` property of the selected option, or `""`.

### `updateItem`

The value `null` will always remove the value from the item. An empty string will remove the value from the item, _unless_ there is an option with the value of `""`.

### `validateInput`

Ensures the value, if provided, is a valid option. If `numeric`, strings are coerced to number values first.

Allows `null` and `""` to clear the field value.

### `validateRequiredInput`

Ensures a value has been provided. Empty strings are never valid, even if specified in the `options` array.

## Options

### `number`
`Boolean` when `true`, causes the value of the field to be stored as a `Number` instead of a `String`

```js
  { type: Types.Select, numeric: true, options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }] }
```

### `emptyOption` `Boolean`
when `undefined || true`, includes a blank value as the first option in the `<select>` field.

```js
  { type: Types.Select, required: true, options: 'first, second', emptyOption: false }
```

### `options` `String` or `Array`
the options for the select field.

Option values can be provided as a comma-delimited list `String` of values, in which the string is split into an `Array`.

For an Array of options, each option should be either:

* `String` representing the `value` of the option; the `label` is automatically generated

* `Object` with `value` and `label` `String` properties

You can mix `String` and `Object` items in the options `Array`:

```js
  { type: Types.Select, options: ['first', 'second', { value: 'third', label: 'The third one' }] }
```

`Object` options can have additional properties which are accessible when the current options data, or fields options are retrieved.

```js
{ type: Types.Select, options: [
  { value: 'first', label: 'The first option', custom: 'value' },
  { value: 'second', label: 'Second' }
]}
```

### Properties

`ops` `Array`
the field options array

`values` `Array`
all `option.value` properties

`labels` `Object`
all `option.label` properties, keyed by `option.value`

`map` `Object`
map of options, keyed by `option.value`

### Schema

The value of the current option will be stored at `{path}`. In addition, these virtuals are provided:

`pathLabel` `String` - the label of the currently selected **option**

`pathData` `Object` - the currently selected **option**, including any custom properties

`pathOptions` `Array` - the field **options** array

`pathOptionsMap` `Object` - map of options, keyed by `option.value`

### Underscore methods

`pluck(property, default)`
returns property value of the currently selected option, or default. Useful in conjunction with custom properties for options.

```js
  MyList.add({ state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' });

  MyList.fields.state.values == 'draft,published,archived';
  MyList.fields.state.labels == { draft: 'Draft', published: 'Published', archived: 'Archived' };
  MyList.fields.state.ops == [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];
  MyList.fields.state.map == {
    draft: { value: 'draft', label: 'Draft' },
    published: { value: 'published', label: 'Published' },
    archived: { value: 'archived', label: 'Archived' }
  };

  var item = new MyList.model();
  item.state == 'draft';
  item.stateLabel == 'Draft';
  item.stateData == { value: 'draft', label: 'Draft' };
  item.stateOptions == MyList.fields.state.ops;
  item.stateOptionsMap == MyList.fields.state.map;
```
