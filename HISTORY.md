# Keystone 

## v0.1.39 / 2013-11-07

* improved; the `utils` library has been moved to its own npm package, `keystone-utils`
* changed; default date format changed from `YYYY-MM-DD` to `Do MMM YYYY`, it's friendlier
	* the `format` option for `Date` and `Datetime` fields can be used to override this setting on a per-field basis

## v0.1.38 / 2013-11-06

* added; ability to use dependsOn with headers [itzaks](https://github.com/itzaks)
	* new syntax is `{ heading: 'Heading with dependency', dependsOn: { field: 'value'} }`
* added; url parameter for the admin list view that updates all items in a list, optionally with data
	* `/keystone/list?update`
	* `/keystone/list?update={"field":"value"}`
* added; ability to override `changedOn` value when using the `standard meta` fields
* fixed; cell overflow is now hidden in the admin list view
* added; support for additional cloudinary transformations
* added; support for passing options to cloudinary transformation shortcut underscore methods
* fixed; the default field validator now trims strings before testing for length when determining validity
* changed; mongoose >3.6.20 is now required, allowing usage of 3.8 +

## v0.1.37 / 2013-11-04

* improved; added webp and progressive jpeg options to `cloudinaryimage` field
* improved; added ability to pass options to `cloudinaryimage` underscore shortcuts (`limit`, `fill`, etc.)
* fixed; underscoreMethods for fields that implement their own addToSchema method (were missing .format, etc)
* improved; `format` function for `location` fields now supports a list of fields to include

## v0.1.36 / 2013-11-03

* added; new embedly field type

## v0.1.35 / 2013-10-31

* added; client-side deleting of items in the list view
* added; ability to use custom validation methods with updatehandlers
* improved; autokeys can now build a key from multiple paths, and support format strings
* improved; autokeys now understand virtual paths (and will always regenerate if one is detected)
* improved; default format settings for uneditable date fields
* fixed; incorrect path in public underscore.map file
* site; minor updates
* changed; switched to bcrypt-nodejs module becase of build issues on windows [sullivanpt](https://github.com/sullivanpt)
* improved; added intelliJ project files to .gitignore [sullivanpt](https://github.com/sullivanpt)

## v0.1.34 / 2013-10-24

* fixed; utils.htmlToText was removing &nbsp; without adding a space
* added; coffeescript file support in the importer [itzaks](https://github.com/itzaks)