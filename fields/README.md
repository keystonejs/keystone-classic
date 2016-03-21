# Fields

Each field is a combination of four parts: The field react component, a filter, a column and a type.

## Type

The Type is the part of the field users use in their Keystone models, e.g. `postTitle: { type: Types.Text }`. Each type should have four main functions:

- The type itself: Attaches a bunch of properties and methods and inherits from the main, generic `Type`.

	```JS
	function text (list, path, options) {
		// Attach a bunch of properties to this type
		this._nativeType = String;
		this._properties = ['monospace'];
		this._underscoreMethods = ['crop'];
		text.super_.call(this, list, path, options);
	}
	// Inherit from the generic Type
	util.inherits(text, FieldType);
	```

- `updateItem`: Saves and updates the corresponding data to a field to the database whenever a user submits a form in the admin interface.

  ```JS
	Field.prototype.updateItem = function (item, data, callback) {
		// Utility function to get that exact field value from all the form data
		var value = this.getValueFromData(data);
		// If the value isn't undefined and changed, save it
		if (value !== undefined && value != item.get(this.path)) {
			item.set(this.path, value);
		}
		process.nextTick(callback);
	};
	```

- `validateInput`: Gets called every time before a user tries to save a value. Validates that the input has a value and is in a form we accept. (e.g. that a date field value has the form of a valid date) Generally also lets `undefined`, `null` and `""` through, which clear the value in the database.

	```JS
	text.prototype.validateInput = function (data, callback) {
		// Utility function to get that exact field value from all the form data
		var value = this.getValueFromData(data);
		// Checks that the value is either undefined, null or a string
		var result = value === undefined || value === null || typeof value === 'string';
		utils.defer(callback, result);
	};
	```

- `validateRequiredInput`: Gets called every time before a user tries to save a required field. Validates that the input exists and is not empty. (i.e. generally no `undefined`, `null` and `""`)

	```JS
	text.prototype.validateRequiredInput = function (item, data, callback) {
		// Utility function to get that exact field value from all the form data
		var value = this.getValueFromData(data);
		// If the value is null, undefined or empty string this will be false
		var result = !!value;
		// If the value is undefined but we have something in the database already we can let it pass
		if (value === undefined && item.get(this.path)) {
			result = true;
		}
		utils.defer(callback, result);
	};
	```
