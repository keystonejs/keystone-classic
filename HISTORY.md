# Keystone

## v0.2.10 / 2014-03-18

* added; new `AzureFile` field type, thanks [Juan Benavides Romero](https://github.com/jbalde)
* added; new toolbar and preview mode for `Markdown` fields, thanks [Thomas Pedersen](https://github.com/thedersen)
* fixed; issue with the 'new item' button on the item details page in the Admin UI triggering autocreate functionality incorrectly, thanks [Thomas Pedersen](https://github.com/thedersen)
* fixed; redirect parameter for signin page now protects against open redirect attacks, thanks [Oliver Jenkins](https://github.com/oliverjenkins)
* fixed; 'host is undefined' issue with certain configurations, see #241
* fixed; accented characters are converted correctly when generating slugs, thanks to [keystone-utils](https://github.com/JedWatson/keystone-utils) 0.1.7

(emergency version bump from 0.2.9 because of white-space issue with new Jade version)

## v0.2.8 / 2014-03-12

* fixed; issues getting path options correctly on Windows (was causing update issues)
* fixed; support for tagging images uploaded to Cloudinary client-side in the Admin UI for `CloudinaryImages` fields, thanks [Mike Causer](https://github.com/mcauser)
* improved; filtering on `Number` fields can now find null values
* fixed; height option now supported on `Markdown` and `Textarea` field types
* added; support for `PUT` and `DELETE` http methods in `View.on`

## v0.2.7 / 2014-03-11

* fixed; minor issues to improve auto-creation of items
* improved; ability to chain `keystone.pre`, `keystone.init`, `keystone.start`, `keystone.static`, `keystone.routes` and `keystone.bindEmailTestRoutes`
* improved; callbacks / error handling in View class
* improved; handling of MongoDB errors before app starts (now much more debuggable)
* added; field notes are now parsed using `marked` so you can use markdown syntax if desired
* added; new field type `Code`, uses the CodeMirror editor in the Admin UI, thanks [Juan Benavides Romero](https://github.com/jbalde)
* fixed; error thrown when requesting an invalid page in the Admin UI list view
* fixed; correctly trigger mongoose middleware when removing items, thanks [Chris Dion](https://github.com/cdion)
* added; ability to use custom paths for updates (issue #205)
* added; optional callback to View.render (issue #215)
* improved; tweaked some option keys, added a warning for deprecated options
* added; ability to specify signin and signout redirect paths or functions
* added; https server and ssl configuration now supported by keystone.start(), thanks [snowkeeper](https://github.com/snowkeeper)
* improved; tweaks to native signin UI, thanks [jossmackison](https://github.com/JossMackison)

This version also contains the new docs and website developed by @jossmackison and @jedwatson. To view the docs locally, open `keystone/docs` and run `node docs`.

## v0.2.6 / 2014-02-25

* improved; implementation of `hidden` option for fields
* improved; refactored the Email class and implemented friendlier errors
* improved; email test route binding, including ability to use a function to provide template locals to tests
* added; custom template support in the Email class
* added; email button mixin supports default styling and style overrides
* improved; email locals and options can be combined in a single object argument
* fixed; location field auto-improve error
* fixed; relationship fields display old ID when related item is missing, thanks [Mark Bayfield](https://github.com/mbayfield)
* added; `autocreate` option for Lists (see issue #21)
* improved; signin page looks better when you're alredy signed in
* improved; `location.requiredPaths` field option supports comma-delimited values
* improved; `UpdateHandler` now updates `noedit` fields when they are explicitly provided (issue #194)
* added; ability to specify custom validation / required messages in the UpdateHandler (issue #195)
* added; ability to provide custom lists of required fields to the `UpdateHandler` (issue #196)

## v0.2.5 / 2014-02-17

* improved; dropdown styles are nicer
* improved; default signin ui tweaks
* improved; hidden lists warn when included in `nav` config option
* fixed; hidden lists are accessible through the API
* improved; warnings are thrown when autokey option config is invalid
* improved; autokey values are now included in CSV exports
* improved; markdown and html fields render nicely in the Admin UI list view

## v0.2.4 / 2014-02-15

* improved; new sign in/out screen design, thanks [jossmackison](https://github.com/JossMackison)
  * improved; the default error screen is now responsive, thanks [jossmackison](https://github.com/JossMackison)
* improved; additional supported file types for CloudinaryImage fields, thanks [James Allen](https://github.com/jamlen)
    -  Supported types are [`image/gif`, `image/png`, `image/jpeg`, `image/bmp`, `image/x-icon`, `application/pdf`, `image/x-tiff`, `image/x-tiff`, `application/postscript`, `image/vnd.adobe.photoshop`]
* improved; you can now use Relationship fields with `multi: true` as `initial` fields
* added; Relationship fields can now be used as filters in the Admin UI
* fixed; scope issue in Relationship field type, thanks [Tom Walker](https://github.com/bladey)

## v0.2.3 / 2014-02-11

* added; new `localFile` field type, thanks [Alan Shaw](https://github.com/alanshaw)
* added; `hidden: true` option for lists
* fixed; uploading works again for `cloudinaryImages` fields


## v0.2.2 / 2014-02-05

* fixed; "moment not defined" error in S3File field type, thanks [Olivier Vaillancourt](https://github.com/ovaillancourt)
* added; ability to define attachments to emails via Mandrill, thanks [Tom Walker](https://github.com/bladey)
* improved; log formatting and error output
* fixed; default 404 handling, thanks [Lepi](https://github.com/lepilepi)
* added; new `keystone.import(path)` method for recusrively requiring all `.js` / `.coffee` files in a path relative to the project root, e.g. `keystone.import('models')`. Similar to but simpler than `keystone.importer()`.
* improved; the default 404 and 500 error handlers have been cleaned up, and have a simple HTML template
* added; filtering now implemented for location fields
* improved; the list download > csv feature in the Admin UI now respects the current filters


## v0.2.1 / 2014-02-04

* added; more flexible environment variable defaults for mongo connection strings. It supports `env.MONGO_URI`, `env.MONGO_URL`, `env.MONGOLAB_URI` and `env.MONGOLAB_URL`, so whatever default you're using, it should be there.
* added; the http server is now accessible as `keystone.httpServer`, thanks [B. August](https://github.com/TheBenji)
* added; pre upload queue for s3file field type (set the `pre.upload` option, or call `{list}.fields.{s3filefield}.pre('upload', ...)`)
* added; initial (create form) support for location fields
* added; initial (create form) support for markdown fields, thanks [Jimmy Hillis](https://github.com/jimmyhillis)
* improved; much more flexible support for http server startup options, see [#154](https://github.com/JedWatson/keystone/issues/154)


## v0.2.0 / 2014-01-26

A bumper release for the new year! We've moved to v0.2.x because some packages have been updated to new minor versions that may cause compatibility issues, specifically:

KeystoneJS now requires mongoose 3.8.5+. Please test compatibility with your application before deploying this update to production.

This version also requires Jade 1.x, which includes some breaking changes from the 0.x branch, particularly to doctype definition. Updating your app should be simple, but again, be sure to test before deploying to production.

One of the other big changes in this release is the work done by [Iulian Meghea](https://github.com/iulian-meghea) breaking up all the field templates into individual files, in preparation for introducing field type plugins in the future.

* lots of website, readme and documentation improvements
* fixed; potential issue with flash errors erroring with TypeError: Cannot read property 'flash' of undefined, thanks [James Allen](https://github.com/jamlen)
* improved; Add options to s3file field type to support allowedTypes, thanks [James Allen](https://github.com/jamlen)
* added; host option to specify the ip address to listen on, thanks [Jose Carvajal](https://github.com/Sgitario)
* improved; better error handling, see #144
* fixed; placeholder for items without a name when creating a relationship in the admin UI, see #117
* fixed; keystone error on blank date / date time fields, thanks [Mark Bayfield](https://github.com/mbayfield)
* fixed; columns filter button position in development env, thanks [Mike Causer](https://github.com/mcauser)
* added; mongo connection defaults, see #124
* improved; sign-out page text
* fixed; hard-to-debug errors in schemaPlugins when callbacks are omitted
* fixed; compatibility for location auto-improve w/ mongoose 3.8.2+
* added; gravatar functionality for email fields, including gravatar display in the Admin UI's list and edit views, and a `gravatarUrl` underscore method, thanks [Mike Causer](https://github.com/mcauser)
* fixed; try/catch for missing Pre-route middleware, thanks [Mark Bayfield](https://github.com/mbayfield)
* fixed; .env defaults for s3 config, see #143
* fixed; check for cloudinary config when `CloudinaryImage` fields are initialised, see #28
* added; current KeystoneJS version displayed in footer of Admin UI, see #130
* updated; marked v0.3.0
* updated; mongoose v0.8.5
* updated; keystone-utils v0.1.5
* updated; jade v1.1.5
* updated; async v0.2.10
* updated; moment v2.5.1
* updated; less-middleware v0.1.15


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

* added; you can now provide a `paths` option to the `UpdateHandler` to map custom field names to item field paths for processing
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
