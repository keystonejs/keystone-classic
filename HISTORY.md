# Keystone

## v0.1.55 / 2013-12-30

* fixed; incompatibility with mongoose 3.8.2+ for location fields has been resolved, thanks [jbalde](https://github.com/jbalde)
* fixed; compatibibility issues with Jade 1.0.0, preparing for update
* improved; nicer default .env keys for mandrill and embedly api key config, falls back to legacy / heroku default key names

## v0.1.54 / 2013-12-23

* fixed; problem with the new options implementation when cloudinary is not used

## v0.1.53 / 2013-12-23

* fixed; correctly escaping HTML entities in names through the API
* updated; keystone-utils to 0.1.4
* fixed; better implementation of cloudinary config, fixes #69
* improved; more robust / consistent initialisation of options with process.env variables
* added; new `custom engine` option for using view engines not natively supported by `express`, thanks [JeremyFouriaux](https://github.com/JeremyFouriaux)

## v0.1.52 / 2013-12-12

* improved; the updateHandler will now allow required fields to be omitted from input data when an item already has a value for the field
* improved; relationship fields now support custom labels and notes, thanks [mbayfield](https://github.com/mbayfield)
* fixed; support for `heading` as a field path, thanks [mbayfield](https://github.com/mbayfield)

## v0.1.51 / 2013-12-11

* fixed; res.apiError was broken (when using `keystone.initAPI`)
* fixed; minor tweaks to the Email class and default template

## v0.1.50 / 2013-12-09

* updated; keystone-utils to 0.1.3

## v0.1.49 / 2013-12-04

* added; `moment` and `parse` underscore methods for the `date` and `datetime` fields
* fixed; bugs searching lists with name fields in the admin ui
* fixed; sorting by name fields in the admin ui was not working correctly

## v0.1.48 / 2013-12-03

* added; you can now provide a `paths` option to the `UpdateHander` to map custom field names to item field paths for processing
* improved; default email templates have been redesigned, with new theme options and defaults, thanks [jossmackison](https://github.com/JossMackison)
* improved; s3file fields expose a direct `uploadFile` underscore method, for use outside of an `updateHandler`, thanks [bladey](https://github.com/bladey)
* fixed; support for extended characters in utils.pathToLabel (via `keystone-utils`), thanks [itzaks](https://github.com/itzaks)

## v0.1.47 / 2013-12-02

* added; new `s3file` field, thanks [bladey](https://github.com/bladey)

## v0.1.46 / 2013-11-27

* added; new `list.getUniqueValue(path, generator, limit, callback)` method
* added; lots of new documentation in the website
* fixed; updating relationship fields from arrays
* improved; updates to the Email class, adding default email templates (based on VIRB Ink, currently very basic)
* removed; br() method from Email template locals (vendor prefixes not necessary in modern browsers anymore)

If you are currently using the `br` method in your email templates, make sure it is removed or your templates will break.

Note: To run the docs website locally, go to `/docs` and run `node web`. It will start up at http://localhost:8080

## v0.1.45 / 2013-11-20

* misc bug fixes

## v0.1.44 / 2013-11-20

* added; new `markdown` field type
* improved; massive enhancements to the `cloudinaryimage(s)` fields, thanks [bladey](https://github.com/bladey)

## v0.1.43 / 2013-11-20

* added; `keystone.content` class and the start of a page-content management framework
* added; new functionality for integrating front-end editing
* fixed; minor issues with the list controls in the admin UI

## v0.1.42 / 2013-11-19

* fixed; passing populateRelated string as 3rd argument of View.query

## v0.1.41 / 2013-11-18

* improved; support for detecting presence of `req.body` / `req.query` keys on `View.on('post' || 'get')`
* added; support for callbacks in the `keystone.View` class. available callbacks are `err` (when the first argument returned by the query callback is not null, takes a single argument which is the error), `none` (when the results array is empty or the results argument is null), `then` (called unless `err` or `none` is present and called, takes three arguments: `err`, `results`, `next`)
	* e.g. `view.query(as, query, { err: errorHandlerCallback, none: noResultsCallback })` or
	* `view.query(as, query).none(noResultsCallback).then(defaultCallback)`

## v0.1.40 / 2013-11-14

* added; autokey now supports a `unique` option
	* set to `true` for unique keys within the whole collection, or a filters object for unique keys within a specific set of documents
* improved; document id is now hidden in favour of the autokey (if there is one)
	* press `alt` to see the document id
* added; you can now navigate to the linked document in a relationship field (only updated on load, for now)

## v0.1.39 / 2013-11-07

* improved; the `utils` library has been moved to its own npm package, `keystone-utils`
* changed; default date format changed from `YYYY-MM-DD` to `Do MMM YYYY`, it's friendlier
	* the `format` option for `Date` and `Datetime` fields can be used to override this setting on a per-field basis

## v0.1.38 / 2013-11-06

* added; ability to use dependsOn with headers, thanks [itzaks](https://github.com/itzaks)
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
* changed; switched to bcrypt-nodejs module becase of build issues on windows, thanks [sullivanpt](https://github.com/sullivanpt)
* improved; added intelliJ project files to .gitignore, thanks [sullivanpt](https://github.com/sullivanpt)

## v0.1.34 / 2013-10-24

* fixed; utils.htmlToText was removing &nbsp; without adding a space
* added; coffeescript file support in the importer, thanks [itzaks](https://github.com/itzaks)
