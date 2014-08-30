# Keystone

## v0.2.27 / 2014-08-30

* fixed; exception when deleting item that has many-many relation from list view, thanks [Thomas Pedersen](https://github.com/thedersen)
* fixed; issues related to sortOrder calculation, thanks [Alberto Gasparin](https://github.com/albertogasparin)
* updated; Markdown visual editor (bootstrap-markdown.js) to (v2.5.0), thanks [Alberto Gasparin](https://github.com/albertogasparin)
* improved; createItems is more robust when linking new items, thanks [Carlos Colon](https://github.com/webteckie)
* fixed; remaining link to create new items when a list is set to `nocreate`
* fixed; Field `watch` option issues, thanks [Markus Padourek](https://github.com/Globegitter)
* added; more options to customise the WYSIWYG editor toolbar, thanks [Michael Abadilla](https://github.com/mjmaix)
* improved; users can no longer delete themselves, thanks [Brett Newman](snowkeeper)
* added; new option `mongo replica set` for using a MongoDB Replica Set, thanks [Ivan Fuyivara](https://github.com/ifuyivara)
* added; `csv field delimiter` option to specify a custom CSV field delimiter, thanks [Louis-Michel Couture](https://github.com/louim)
* improved; redirects and error handlers are now the last items set up in `keystone.mount()`, thanks [Brett Newman](snowkeeper)


## v0.2.26 / 2014-08-14

* added; 'today' button in the datepicker for quick selection of the current day, thanks [Markus Padourek](Globegitter)
* fixed; linked to/not linked to toggle not respecting currently applied filter
* added; new `track` option for `List` that enables tracking of standard metadata on documents, including `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy`, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; `_req_user` property is available on documents in `pre('save')` middleware when the `UpdateHandler` is used (which includes updates in the Admin UI), thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; edge-case errors in `lib/core/mount`, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; AzureFile upload error, thanks [Emmanuel Nelson](https://github.com/manuelnelson)
* added; more details, including document name, included for relationship fields in CSV download, thanks [Michael Abadilla](https://github.com/mjmaix)
* improved; general UI and code clean up
* fixed; regression of ipRangeRestrict option
* fixed; path nesting for `Boolean` fields works correctly
* added; `additionalPlugins` and `additionalOptions` options for `wysiwyg` fields
* fixed; static value support for `Relationship` field `filters` option, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)


## v0.2.25 / 2014-07-27

* fixed; issue #492 - errors uploading to cloudinary fields, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; issues starting with SSL


## v0.2.24 / 2014-07-25

* fixed; issues saving location field values
* fixed; filtering on select fields was broken in the Admin UI
* added; list totals are recalculated after items are deleted, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; feature to select images from cloudinary, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; issues with field required / initial validation, thanks [Oleg Shparber](https://github.com/trollixx)
* fixed; better handling of default / alt behaviour for remove / delete functionality with cloudinary fields


## v0.2.23 / 2014-07-20

* improved; more Admin UI visual tweaks, thanks [Joss Mackison](https://github.com/JossMac)
* fixed; allowing nested values to be provided to the UpdateHandler for name and location fields
* added; cloudinary folders feature, enabled with field option `folder` or defaulting to `[prefix (if exists)]/[list path]/[path]`, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; ability to specify a field to use as the cloudinary public_id, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; cloudinary image replace on upload option, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; initial sortOrder on a sortable List, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; ability to read multiple static files from an Array, thanks [Mike Grabowski](https://github.com/grabbou)
* added; default values for text fields are displayed in the create items form now, thanks [Brandon Taylor](https://github.com/alsoicode)


## v0.2.22 / 2014-06-29

* fixed; autokey being added with a unique index when not specified as unique, thanks [trentmillar](https://github.com/trentmillar)
* fixed; "bullet-proof" buttons in the email template were breaking because of a b/c in Jade 1.x, thanks [Heracles Kasimis](https://github.com/heracleskasimis)
* fixed; view cache issue (see #430), thanks [Aleksej Kamynin](https://github.com/Bubujka)
* added; new localfiles field type, thanks [Tom Kremer](https://github.com/TomKremer)
* added; new `file limit` option, passed to `express.limit` middleware, thanks [Fabrizio Fortunato](izifortune)
* added; errorMessage option for `UpdateHandler.process()`, thanks [Heracles Kasimis](https://github.com/heracleskasimis)
* added; support for `connect-mongostore` to support MongoDB replica sets as the session store database, thanks [Abe](https://github.com/coldfire22x)
* added; support for Redis as a session store via `connect-redis`
* fixed; boolean fields with `default: true` are now checked when creating new items, thanks [Aleksandr](https://github.com/amurchick)
* updated; `less-middleware` is now updated to version `1.0.3` (new API)

With this release, `connect-mongo` has been removed from Keystone's `package.json` and all three supported session store packages are optional. If you specify one, be sure to include it as a dependency in your project's `package.json` (Keystone will warn you on startup if you haven't).

Because of the way **npm** resolved paths, if you are using Keystone in development mode (via `npm link`) *and* using a session store, you have to `npm install <session-store>` in your local Keystone folder as well or it won't find the package.

## v0.2.21 / 2014-06-16

* updated; Admin UI visual tweaks by [Joss Mackison](https://github.com/JossMac)
* added; new CSRF implementation for more granular control
* fixed; several UI and functionality issues with the new list recent-searches feature
* added; S3 file - ability to specify a protocol for the file url, thanks [Cosmina](https://github.com/cosmina)
* added; `cookie signin` option to control session persistence
* added; `session options` option for better control over keys and stores, also exposes the final configuration after `start()` is called, thanks [killerbobjr](https://github.com/killerbobjr)
* improved; Keystone now throws an error when no cookie secret is provided

## v0.2.20 / 2014-06-06

* added; recent searches UI and functionality in the Admin UI, thanks [Benjamin Lupton](https://github.com/balupton)
* fixed; strict type checking for field.options.required, see #393
* added; `CloudinaryImage.updateItem()` allows updates from data, thanks [webteckie](https://github.com/webteckie)
* added; native support for node-sass via the `sass` option, make sure you include `node-sass` in your project dependencies to use it. thanks [Fabrizio Fortunato](https://github.com/izifortune)
* fixed; field validation methods for location & password fields
* fixed; `keystone.createItems()` now creates items in series, not parallel
* added; support for dynamic queries for relationship values in `keystone.createItems()`
* added; verbose logging and strict ref checking options for `keystone.createItems()`
* improved; performance when using the `id` property as part of a field's autokey

## v0.2.19 / 2014-05-28

* added; ability to change the filename in Types.LocalFile by specifying the `filename: function() {}` option, thanks [Stefan Aebischer](https://github.com/pAlpha627)
* improved; read-only tinyMCE editor is used for htmlFields when noedit is true, thanks [Frederic Beaudet](https://github.com/fbeaudet)
* fixed; Extracting and scoping `keystone.initAPI` to work correctly when used directly as middleware
* improved; Added better MongoDB indexes for schemaPlugins
* improved; invalid config handling for fields
* fixed; relationship filters now work correctly
* added; ability to prefix all MongoDB Collection names, thanks [David Björklund](https://github.com/kesla)
* improved; output stack traces with error logs, thanks [Benjamin Lupton](https://github.com/balupton)
* fixed; issues signing in users by UserID directly (introduced in 0.2.18)
* fixed; users without passwords (auth via facebook / github / etc) will not have their sessions persisted outside of the memory store.
* added; support for using MongoDB as the session store. set `'session store': 'mongo'` to enable this feature.
* deprecated; support for providing the `mongo` option as an array. Use a MongoDB connection string instead, e.g. `'mongodb://localhost/db_name`

## v0.2.18 / 2014-05-22

* added; callbacks passed to `View.render()` are now passed `err, req, res`
* fixed; console logging is suppressed when the option `logger` is `false`
* fixed; issues relating to session cookies
* fixed; a lot of minor code issues and cleanup
* improved; test coverage

## v0.2.17 / 2014-05-19

* added; between filtering to date, datetime, money, and number field
types, thanks [Benjamin Lupton](https://github.com/balupton)
* added; new color field, thanks [Frederic Beaudet](https://github.com/fbeaudet)
* added; automated unit tests with TravisCI, thanks [James Allen](https://github.com/jamlen) and [Andri Möll](https://github.com/moll)
* added; .jshintrc config and better settings for .editorconfig, thanks [James Allen](https://github.com/jamlen) and [Benjamin Lupton](https://github.com/balupton)
* added; code documentation for `/lib/view.js` class, thanks [Talon](https://github.com/LegitTalon)
* added; coverage report and default gulp task, thanks [James Allen](https://github.com/jamlen)

## v0.2.16 / 2014-05-14

* fixed; issues with Keystone.prototype.import, see [#348](https://github.com/JedWatson/keystone/issues/348), thanks [ashleycorker](https://github.com/ashleycoker)
* fixed; issues with geo handling in Location fields, see [#344](https://github.com/JedWatson/keystone/issues/344), thanks [mandb](https://github.com/mandb)

## v0.2.15 / 2014-05-13

* fixed; Added note to fields that didnt have one, thanks [Ötvös Richárd](https://github.com/RichardOtvos)
* fixed; Only show "Open Keystone" link to admins, thanks [John Beppu](https://github.com/beppu)
* fixed; Password fields are formatted correctly on the list screen of the Admin UI
* added; Support for custom MongoDB collection names (and other Schema options, see [#292](https://github.com/JedWatson/keystone/issues/292))
* added; Support for clearing password fields (if not required)
* added; Password.compare is now available on the Field object
* added; Support for loading fixture data with `keystone.createItems()` and in update scripts, see [this gist](https://gist.github.com/JedWatson/10739959) for an example
* added; Basic support for redirects, see [#303](https://github.com/JedWatson/keystone/issues/303) for details
* added; Support for excluding the blank option in Select fields with the `emptyOption` option
* improved; Nicer exception on EADDRINUSE error
* added; Warning when required fields aren't initial, see [#300](https://github.com/JedWatson/keystone/issues/300)
* fixed; Truthy check for port breaks listening on any open port
* fixed; Changed how updates are discovered and included, fixes previous issues with .DS_Store files
* added; test script to package.json, spec reporter for Mocha tests and other test improvements, thanks [David Banham](https://github.com/davidbanham)
* added; cookie secret to environment defaults init, thanks [Tom Walker](https://github.com/bladey)
* added; separated Express setup from http server setup to enable easier Express sub-app mounting, thanks [ryedin](https://github.com/ryedin)
* fixed; Errors are caught on item deletion, thanks [fbeaudet](https://github.com/fbeaudet)
* fixed; Issues where `Email.send()` wasn't consistently async
* added; Support for the argument `row` in custom `List.schema.methods.toCSV` implementations, provides the original `toCSV` data for simpler customisation

...as well as several other miscellaneous fixes and improvements, thanks to all our contributors who keep making Keystone better!

Also; all dependencies are up to date with their latest published versions, except for `express` and `less-middleware` which require further testing to ensure compatibility.

## v0.2.14 / 2014/04-16

* added; new `createItems()` method to quickly populate data, see [this gist](https://gist.github.com/JedWatson/10739959) for usage instructions and examples
* improved; `.toCSV()` method for lists now uses dependency injection and can be asynchronous (just pass `callback` as the last argument)
* added; basic implementation of field watching
* fixed; issue with dateTime fields not updating correctly
* added; `perPage` option for lists that controls the number of items displayed per page in the Admin UI, thanks [Galaczi Endre Elek](https://github.com/chiller)
* added; gulp, and more tests! thanks [Morgan Craft](https://github.com/mgan59)
* improved; link fields are now anchors in the Admin UI list view, thanks [DrMoriarty](https://github.com/DrMoriarty)
* fixed; height of admin header and signout link placement with a lot of lists in the navigation, thanks [Ötvös Richárd](https://github.com/RichardOtvos)
* added; support for adding additional toolbar buttons to tinymce, thanks [Eric](https://github.com/theskabeater)

## v0.2.13 / 2014-04-04

* added; `onHttpServerCreated` and `onHttpsServerCreated` events now fired during `keystone.start()`, allows for integration of things like socket.io

## v0.2.12 / 2014-04-03

* added; initial field support for HTML and Markdown fields
* improved; some client-side scripts (e.g. TinyMCE) are no longer included when they're not going to be used

## v0.2.11 / 2014-04-02

* added; `.toCSV()` method now supported on schemas to transform data when exported in the Admin UI
* added; image and uploadimage plugin support for TinyMCE
* added; cloudinary upload api for generic image uploads, thanks [Branko Sekulic](https://github.com/brankosekulic)
* added; csrf middleware support, thanks [Lasana Murray](https://github.com/metasansana)
* added; `express` is now available as a property of `keystone`
* added; optional support for a the `S3_REGION` environment variable, thanks [DrMoriarty](https://github.com/DrMoriarty)
* added; IP address range restrictions, thanks [Robert Medeiros](https://github.com/crimeminister)
* added; support for express `trust proxy` setting, thanks [Robert Medeiros](https://github.com/crimeminister)
* fixed; Boolean field notes were being escaped incorrectly

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
