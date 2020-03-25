# KeystoneJS Changelog

KeystoneJS is maintained by [@JedWatson](https://github.com/JedWatson) and an amazing team of contributors. All contributions are given credit here except for Jed's.

As of version 4 we have moved our changelog to the [GitHub releases]( https://github.com/keystonejs/keystone/releases) page. See there for the latest release notes.

Changes for 3.x releases are included below.

## v0.3.22 / 2016-07-22

* added; support for automatic SSL with Let's Encrypt, thanks [Wout Mertens](https://github.com/wmertens)
* fixed; Date field formatting, thanks [Jared Collier](https://github.com/autoboxer)
* fixed; Filtering for related items, thanks [Max Koryukov](https://github.com/maxkoryukov)
- fixed; Relationship initial value loading

## v0.3.21 / 2016-06-19

* fixed; Issue preventing you from specifying the `pretty` option in the `locals` setting

## v0.3.20 / 2016-06-17

* fixed; Boolean fields with noedit:false and hidden:true do not retain value
* fixed; Default formatString for Datetime fields didn't show minutes with a leading 0
* fixed; Date format option works correctly, thanks [Jared Collier](https://github.com/autoboxer)
* fixed; Datetime format option works correctly, thanks [Jared Collier](https://github.com/autoboxer)
* fixed; Double password-hashing issue when the Users list inherits from another list, thanks [Jared Collier](https://github.com/autoboxer)

## v0.3.19 / 2016-05-04

* added; support for Mailgun, thanks [Wolfgang](https://github.com/w01fgang)
* fixed; issues with connect-mongo on Node 0.12, thanks [gemscng](https://github.com/gemscng)

## v0.3.18 / 2016-04-27

* fixed; make localfiles previews properly show up in admin ui column, thanks [Gabor K](https://github.com/krksgbr)
* improved; allow adding headers when sending email, thanks [Joss Mackison](https://github.com/JossMac)

This is a hotfix release to allow for adding headers when sending emails.

## v0.3.17 / 2016-03-23

* fixed; issue when keystone is a dependency of a global package, thanks [Robert Jensen](https://github.com/erg0dic)
* added; allow custom logging middleware, thanks [Greg Meyer](https://github.com/gmmeyer)
* improved; allow negative numbers in the number field, thanks [Brett Newman](https://github.com/snowkeeper)
* improved; allow seeding an s3file field with an application update, thanks [Younes Riad](https://github.com/yn5)
* improved; allow the deletion of localfiles, thanks [Jacob Jenkins](https://github.com/jacobj)
* updated; update babel to v6, thanks [Alexandre Joly](https://github.com/kilokilo)
* improved; tighten redirection destination sanitation after successful sign in, thanks [Camille Reynders](https://github.com/creynders)
* improved; handle missing relations in the relationship field, thanks [Wout Mertens](https://github.com/wmertens)
* fixed; show validation errors in pre save, thanks [gemng888](https://github.com/gemng888)
* updated; update tinymce and add the imagetools, thanks [Riyadh Al Nur](https://github.com/riyadhalnur)
* fixed; show notes in boolean field, thanks [Camille Reynders](https://github.com/creynders)

## v0.3.15 / 2015-10-15

* added; new hooks in the app middleware setup are available, see [#1736](https://github.com/keystonejs/keystone/issues/1736) for documentation.
* updated; all packages, including pre-build client side bundles

## v0.3.14 / 2015-08-25

* improved; internal cleanup and refactoring
* added; new API routes for future use by the Admin UI, including signin and signout
* added; support for selecting arbitrary document paths in `List.getData`
* added; new search query generation functionality for `List` and `Field` classes
* fixed; vertical alignment of Format menu icons in the WYSIWYG editor, thanks [Jeffrey](https://github.com/jeffreypriebe)
* fixed; validation issues with the `GeoLocation` field type, thanks [Vintesh](https://github.com/vintesh)
* fixed; use of 'select' and 'selectPrefix' options in CloudinaryImage type, thanks [azterix](https://github.com/azterix)
* updated; grappling-hook @ v3.0.0, thanks [Camille Reynders](https://github.com/creynders)

## v0.3.13 / 2015-08-03

* improved; major speed increase for initialisation
* improved; codemirror is now only loaded as required, thanks [Carlos Colon](https://github.com/webteckie)
* fixed; correctly handling blank values in the DateInput component
* changed; switched to babyparse for CSV generation
* fixed; docs links now point to keystone site
* fixed; add Maps API key to request, allow override per model, check for server instead of browser key, thanks [stosorio](https://github.com/stosorio)
* fixed; added check for duplicate `_revisions` models, thanks [Jeffrey](https://github.com/jeffreypriebe)
* fixed; localFile .format property ignored by Admin U, thanks [Javier Castro](https://github.com/jacargentina)
* fixed; href working correctly on LocalFiles Type, thanks [Matthias Tylkowski](https://github.com/tylkomat)
* added; several new API endpoints for the Admin UI in preparation of the 0.4 release


## v0.3.12 / 2015-06-26

* fixed; `height` option for TextArea fields was not respected in the Admin UI, thanks [Eóin Martin](https://github.com/SlashmanX)
* fixed; API error string was missing `not` in message, thanks [Daniel Cousens](https://github.com/dcousens)
* improved; better instructions for installing missing session store modules
* fixed; delete confirmation was not working (items could be deleted with a single click), thanks [gerotakke](gerotakke)
* added; new `utc` option for `Date` and `DateTime` field types, see [#1487](https://github.com/keystonejs/keystone/issues/1487) for more details.

## v0.3.11 / 2015-06-12

* fixed; issues with file field types not working correclty with getters, thanks [Alexander Shemetovsky](https://github.com/AlexKVal)
* fixed; bug saving lat / lng in location fields, thanks [Al Connelly](https://github.com/WingedToaster)
* fixed; issue saving blank values in money fields, thanks [Harry Moreno](https://github.com/morenoh149)
* fixed; Admin UI issues caused by custom toJSON / toObject transforms configured for models
* improved; optimised items list

All is not as quiet as this release implies; we are working aggressively through the next big update in the `elemental-integration` branch, which will see the Admin UI released as a Single Page Application built with [Elemental UI](http://elemental-ui.com) components, and the foundation for much better customisation features to come.

If you are interested in being part of Keystone's development team and aren't in our Slack channel, ping @JedWatson to get an invite!

## v0.3.10 / 2015-05-19

* fixed; worked around an intermittent issue with the new browserify build process
* added; new hooks `updates`, `signin` and `signout`, thanks [Camille Reynders](https://github.com/creynders)
* added; `parseFormat` option for `Date` / `Datetime` field types, and more robust validation in `DateArray`
* added; `logger options` setting, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)

Also, our site and documentation have been split out into their own repository: [keystonejs/keystonejs-site](https://github.com/keystonejs/keystonejs-site). Please contribute any changes, additions and issues to that new repo going forward.

## v0.3.9 / 2015-05-17

* added; Babel `object-assign` plugin for the Admin UI browserify build process
* improved; The whole Admin UI JS build system has been rewritten and should now be completely stable and much faster than any previous setup. You can enable development mode with the `KEYSTONE_DEV=true` environment variable
* fixed / changed; the LESS config api was changed with `less-middleware@2.0.0` and you should now just use the `less options` setting, thanks [Francesco Nero](https://github.com/francesconero). Old options will log warnings if you use them.
* fixed; The path to `react-select`'s less file is now dynamically detected, see #1384
* fixed; The `href` method of localfile/s shouldn't use `path.join`, see #1406
* fixed; display issues with Type.GeoPoint and Type.Location, thanks [Al Connelly](https://github.com/WingedToaster)
* added; SVG Support for Cloudinary Image fields, thanks [Christian Nolte](https://github.com/drlogout)
* fixed; Disabled drag and drop sorting in list view when filters are applied, thanks [Michael](https://github.com/mldangelo)
* improved; Now using [grappling-hook](https://github.com/keystonejs/grappling-hook), thanks [Camille Reynders](https://github.com/creynders)
* improved; The Location field throws an error if `googleLookup` fails, thanks [Daniel Cousens](https://github.com/dcousens)
* fixed; issues with schema inheritance and schemaPlugins, thanks [Robert Clark](https://github.com/lojack)
* fixed; default `formatString` for Datetime fields now includes `h:m:s a`, thanks [Al Connelly](https://github.com/WingedToaster)
* fixed; `Keystone.prototype.static(app)` was removed in 0.3.7, has been reintroduced for backwards-compatibility
* changed; `react-alt-text` is now its own npm package
* changed; The Admin UI is being consolidated into `/admin` and many files have moved, thanks to [Milos Dakic](https://github.com/milosdakic) for helping with this.

Also in this release: Keystone is completely free of ESLint warnings thanks to the incredible efforts of [Camille Reynders](https://github.com/creynders) and [Jed Watson](https://github.com/JedWatson).


## v0.3.8 / 2015-04-23

* fixed; worked around a breaking issue with the `bytes` package by downgrading it and including it in the pre-built Admin UI packages bundle

## v0.3.7 / 2015-04-23

* changed; switched from pre-built admin scripts to pre-built browserify packages and on-demand admin UI scripts w/ browserify-middleware
* fixed; TinyMCE image upload fail due to "Bad response", thanks [Alberto Gasparin](https://github.com/albertogasparin)
* fixed; case-insensitive user lookup in .session.signin(), thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; Reloading tinyMCE if dependencies matches dependsOn, thanks [Christian Nolte](https://github.com/drlogout)

## v0.3.6 / 2015-04-14

* fixed; `list.schema.path("field")` would not return the field schema before the List had been registered
* fixed; `evalDependsOn` not working correctly with `Boolean` field types
* fixed; whitespaces issues in the Admin UI LESS file

## v0.3.5 / 2015-04-12

* changed; Switched from SJCS to ESLint for project linting and style checking
* changed; Item data is now loaded via JSON API in the Admin UI, fixes escaping edge-case issues and paves the way forward
* added; List history feature for tracking document revisions
* added; Schema inheritance for lists, thanks [Robert Clark](https://github.com/lojack)
* added; yearRange option for Date fields, thanks [Robert Clark](https://github.com/lojack)
* fixed; intermittend ordering issues with Relationship fields, thanks [Robert Clark](https://github.com/lojack)
* added; `format` option for Url fields to prevent stripping http/https, thanks [Daniel Zurawski](https://github.com/danielzurawski)
* added; color preview in list view, thanks [Teemu Sirkiä](https://github.com/ttsirkia)
* added; ability to add mandrill template content, thanks [Brett Newman](https://github.com/snowkeeper)
* added; original file name is saved for AWS uploads, thanks [Subash Pathak](https://github.com/Subash)
* fixed; `wysiwyg cloudinary images` key is no longer required to be global, can be set per-field, thanks [Alberto Gasparin](https://github.com/albertogasparin)
* fixed; refactored `doSignin()`, now exposed as `keystone.session.signinWithUser()`, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; Use filename without suffix as default publicID for cloudinary, thanks [@aschwersenz](https://github.com/aschwersenz)
* added; support for custom headers in S3 File Fields, thanks [Chris Montoro](https://github.com/montmanu)
* added; currency option for the Money field, thanks [@douglasf](https://github.com/douglasf)
* fixed; markdown field collapse behaviour, thanks [Pat Cavit](https://github.com/tivac)
* fixed; wysiwyg & file field collapse behaviour, thanks [Robert Clark](https://github.com/lojack)
* fixed; scripts are no longer minified in dev mode

## v0.3.4 / 2015-03-10

* fixed; missing less variable for react-select was breaking the less>css build, thanks everyone involved and [esparragito](https://github.com/esparragito) for the fix
* fixed; the missing line numbers in CodeMirror are back again, thanks [Carlos Colon](https://github.com/webteckie)

## v0.3.3 / 2015-03-08

* added; new DateArray field type, thanks [Liam Wooding](https://github.com/liamwooding)
* added; new `editor Object` config option for Code fields, thanks [Pat Cavit](https://github.com/tivac)
* added; new `wysiwyg Object` config option for Html fields, thanks [Pat Cavit](https://github.com/tivac)
* changed; limits lifted for relationship autocomplete results
* changed; makefile deprecated in favor of npm scripts, thanks [Pat Cavit](https://github.com/tivac)
* changed; asyncdi updated and moved into its own npm package, fixes thanks to [Camille Reynders](https://github.com/creynders)
* fixed; collapse logic for relationship (many: true) and Array-type fields, thanks [Pat Cavit](https://github.com/tivac)
* fixed; Rendering of uneditable relationship fields, thanks [Camille Reynders](https://github.com/creynders)
* fixed; OpenShift deployment issues, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; item name rendering issues in Admin UI / Edit view, thanks [Camille Reynders](https://github.com/creynders)
* fixed; LocalFile field issues, thanks [Camille Reynders](https://github.com/creynders)
* fixed; Markdown field collapse logic and other UI issues, thanks [Pat Cavit](https://github.com/tivac)
* fixed; validation override error in UndateHandler, thanks [douglasf](https://github.com/douglasf)
* fixed; validation logic issues with Number fields

## v0.3.2 / 2015-02-27

* added; new Geopoint field type, thanks [Sebastian McKenzie](https://github.com/sebmck)
* added; lots of server-side field type unit tests
* added; `frame guard` option, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; objects with IDs like `{ id: ObjectId }` can now be provided as Relationship values in data to `keystone.createItems(data, options, callback)`
* added; `options.refs` can be provided as an option to `keystone.createItems(data, options, callback)`
* added; focus issues with the WYSIWIG Html and Code fields
* changed; `lang` option because `language` for the `Code` field type as per the 0.3.x docs
* changed; Code fields are now allowed to be initial fields
* updated; TinyMCE to 4.1.7
* updated; Many packages, see [e561fa6](https://github.com/keystonejs/keystone/commit/e561fa6c32a059f847283e98e2ecc95255829056)
* fixed; issues with the `ipRangeRestrict` option, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; relationship reorder is persisted even when the linked IDs haven't changed, thanks [Robert Clark](https://github.com/lojack)
* fixed; check for existence req.user on DELETE action, thanks [Josh Lasdin](https://github.com/joshlasdin)
* fixed; `updatedAt`, `updatedBy`, `createdAt` and `createdBy` are no longer set on create w/ tracking if already set, thanks [Sebastian McKenzie](https://github.com/sebmck)
* fixed; bug with the datepicker that caused an infinite loop in some timezones
* fixed; bug in deprecation warning helper, thanks [Nicolas Dutil](https://github.com/nicdutil)

## v0.3.1 / 2015-02-13

* fixed; validation and updating issues with Number, Money, TextArray and NumberArray Fields
* fixed; slightly broken regex for resource redirection, thanks [Nicolas Dutil](https://github.com/nicdutil)
* fixed; the S3File field now surfaces errors correctly, thanks [Harry Moreno](https://github.com/morenoh149)
* changed; `keystone.connect` was broken in 0.3.0, it has been replaced by the `keystone.set('express', ...)` and `keystone.set('mongoose', ...)` options

Also more tests and general cleanup. Thanks especially to [Sebastian McKenzie](https://github.com/sebmck) and [Johnny Estilles](https://github.com/JohnnyEstilles) for their work on this release.

## v0.3.0 / 2015-02-06

This is a major new version of KeystoneJS. The changes are too many to simply enumerate here, however we've done our best to ensure compatibility and feature parity with 0.2.x. If you experience any unexpected issues or behaviours, please let us know by opening a [Github Issue](https://github.com/keystonejs/keystone/issues).

For notes regarding breaking changes in the release, please see our [0.2.x to 0.3.x Changes wiki page](https://github.com/keystonejs/keystone/wiki/0.2.x-to-0.3.x-Changes).

Thanks to [all our contributors](https://github.com/keystonejs/keystone/graphs/contributors) for the huge amount of effort that went into this release, and the ongoing work designing, programming, testing and documenting KeystoneJS.

### Updated Express to 4.0

Express 4 included several breaking changes from Express 3. Keystone simplifies most of these changes, and if you're using `keystone.start()` to initialise your web server things will _probably just work_; however the more complicated your app, the more likely you will need to take these changes into account. Please review the [Moving to Express 4 Guide](http://expressjs.com/guide/migrating-4.html) for more information.

### Admin UI forms rewritten in React.js

The Admin UI forms have been rebuilt from the ground up with React.js. This is part of a larger, ongoing effort to move the Admin UI entirely towards a rich, customisable single page web app.

The UI has been cleaned up and improved, and the field types should support the same features and behaviours as in 0.2.x. If any field types or features don't continue to work as expected, please open a [GitHub Issue](https://github.com/keystonejs/keystone/issues) so we can fix it!


## v0.2.42 / 2015-01-20

* fixed; backwards-compatibility issues with older versions of connect-mongo
* fixed; file type / mimetype issues with S3File / AzureFile and LocalFile fields

## v0.2.41 / 2015-01-18

* fixed; issues relating to using mongo and redis as session stores
* added; option to use the `importcss` plugin for TinyMCE; set `wysiwyg importcss`, thanks [aschwersenz](https://github.com/aschwersenz)
* added; `MONGODB_URL` environment variable support, thanks [jdr0dn3y](https://github.com/jdr0dn3y)

## v0.2.40 / 2014-12-31

* fixed; issue setting `Boolean` fields to `false` in the Admin UI
* added; `cors` middleware is now available as `Keystone.cors`
* fixed; redis session middleware doesn't support callbacks, should now initialise correctly
* fixed; issues parsing options in keystone.Email, thanks [Brett Newman](https://github.com/snowkeeper)


## v0.2.39 / 2014-12-20

* fixed; regression in the Admin UI introduced in 0.2.37, sorry!

## v0.2.38 / 2014-12-19

* fixed; a bug where location field filters were not being applied in the Admin UI
* fixed; a bug where boolean field filters were not being applied in the Admin UI

## v0.2.37 / 2014-12-19

* added; check for refsLookup existence to core/createItem, thanks [Sebastian McKenzie](https://github.com/sebmck)
* added; dump current list key and data onto createItems error, thanks [Sebastian McKenzie](https://github.com/sebmck)
* added; ability to bypass bcrypt hashing for password fields when required
* added; SSL CA configuration option, thanks [Brett Newman](https://github.com/snowkeeper)
* added; `static options` option to control static middleware configuration, thanks [Sebastian McKenzie](https://github.com/sebmck)
* fixed; error thrown in the Admin UI when no user model is available
* fixed; handle undefined boolean update values, thanks [Carlos Colon](https://github.com/webteckie)
* fixed; logging error for misconfigured Embedly fields
* fixed; mimetype bug in S3 file field, thanks [Harry Moreno](https://github.com/morenoh149)
* updated; multilanguage docs and new site architecture
* improved; password field validation now in UpdateHandler

Huge thanks to [@wuhaixing](https://github.com/wuhaixing) for the Chinese translation in this release.

## v0.2.36 / 2014-12-07

* fixed; several issues with the `localfile` field type
* improved; `localfile.options.format` is called with the `field` context
* improved; `localfile.href` is now available as a virtual
* improved; switched to `fs-extra` so missing paths for `localfile` uploads will be created automatically
* improved; `localfiles` field type has been completely overhauled, now in line with `localfile` and supports `prefix` and `format` options
* removed; the autodetection of image file types in the `localfiles` field has been removed, use the `format` option instead (like `localfile`)
* fixed; admin UI template caching bug, may help improve Admin UI performance
* fixed; `callback` is now correctly optional in `keystone.Email.send()`, thanks [Brett Newman](https://github.com/snowkeeper)
* improved; a `ReferenceError` is now thrown when an invalid list is requested with `keystone.list`, thanks [Sebastian McKenzie](https://github.com/sebmck)

## v0.2.35 / 2014-12-02

*This release fixes an issue in the Admin UI introduced in 0.2.34, our sincere apologies to anyone who was affected by this!*

* fixed; an issue to do with admin links introduced by the new custom nav functionality, thanks [Camille Reynders](https://github.com/creynders)

## v0.2.34 / 2014-11-29

* added; ability to specify custom navigation items in the header menu, thanks [Camille Reynders](https://github.com/creynders)
* added; ability to specify multiple values for a dependsOn field with an Array, thanks [Brett Newman](https://github.com/snowkeeper)
* improved; more dynamic import extensions, thanks [Sebastian McKenzie](https://github.com/sebmck)
* fixed; several issues relating to validation in the UpdateHandler
* fixed; issues deleting users, thanks [Ignacio Lago](https://github.com/ignlg)
* fixed; potential issues comparing csrf and password tokens, thanks [Mickael van der Beek](https://github.com/Mickael-van-der-Beek)
* fixed; incorrect whitespace in UI when ordering lists, thanks [Tiago Martins](https://github.com/Gank)
* fixed; callback in Email class is now correctly optional, thanks [Ignacio Lago](https://github.com/ignlg)
* fixed; UI inconsistencies when deleting items, thanks [Ignacio Lago](https://github.com/ignlg)
* fixed; date formatting issues with tracking meta, thanks [Jacques Lareau](https://github.com/jacqueslareau)


## v0.2.33 / 2014-11-04

* fixed; Issues where the session store would not always wait for a database connection before initialising the web server
* fixed; Compatibility issues with changes made to the azure-storage blobservice.js, thanks [Pete Amundson](https://github.com/peteamundson)
* added; Mandrill templates and render support, thanks [Ignacio Lago](https://github.com/ignlg)

## v0.2.32 / 2014-10-16

* fixed; Issues with less middleware options when using multiple paths
* fixed; Error in Admin UI when filters are applied to a Relationship field, thanks [Ignacio Lago](https://github.com/ignlg)

## v0.2.31 / 2014-10-14

* added; `TextArray` and `NumberArray` field types, thanks [bardzusny](https://github.com/bardzusny)
* added; Markdown editor headers buttons and customisation, thanks [Alberto Gasparin](https://github.com/albertogasparin)
* added; `filename` and `format` optionss for the s3file field, thanks [Aleksej Kamynin](https://github.com/Bubujka)
* added; Support for array values for `less` and `sass` options (allows multiple paths to be specified)
* fixed; Invalid field types throw errors on init, making debugging easier
* fixed; Keystone throws a warning when you add fields to a List that are implemented by the `track` option
* fixed; Errors returned by schema.pre('remove') middleware don't display in the Admin UI, thanks [Ian Dilling](https://github.com/ianbjorndilling)
* fixed; Minor issued with the WYSIWYG editor in the Admin UI

## v0.2.30 / 2014-10-02

* fixed; Do not crash process for schema validation errors, thanks [David Banham](https://github.com/davidbanham)

## v0.2.29 / 2014-09-30

* fixed; localfiles implementation, thanks [Darkin8](https://github.com/Darkin8)
* fixed; whitespace issues in the Admin UI when in production mode
* added; proper ascending / descending UI for tracking sort
* added; sorting UI for tracking date fields
* added; can toggle display of created / updated dates in list view
* added; displaying tracked metadata in the Admin UI
* added; displaying current user in the footer
* fixed; cross-platform issues moving files into place, thanks [Alan Shaw](https://github.com/alanshaw)
* fixed; sortOrder type detection, thanks [Darkin8](https://github.com/Darkin8)
* fixed; use buttons where possible for accessibility

## v0.2.28 / 2014-09-12

* added; thumbnail for embedly fields, thanks [Pavel Vlasov](https://github.com/freakycue)
* fixed; various cloudinary issues, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; `cloudinary folders` option, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* added; ability to filter relationship by any input field or _id, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; notes are now displayed for name fields, thanks [Ignacio Lago](https://github.com/ignlg)
* added; support for csrf headers, thanks [Johnny Estilles](https://github.com/JohnnyEstilles)
* fixed; consistency issues with `noedit` and `initial` options for fields
* fixed; issues retaining entered values in the Admin UI's create form after validation failures
* fixed; all remaining jshint warnings :)


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
* added; `CloudinaryImage.updateItem()` allows updates from data, thanks [Carlos Colon](https://github.com/webteckie)
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

* fixed; issues with Keystone.prototype.import, see [#348](https://github.com/keystonejs/keystone/issues/348), thanks [ashleycorker](https://github.com/ashleycoker)
* fixed; issues with geo handling in Location fields, see [#344](https://github.com/keystonejs/keystone/issues/344), thanks [mandb](https://github.com/mandb)

## v0.2.15 / 2014-05-13

* fixed; Added note to fields that didnt have one, thanks [Ötvös Richárd](https://github.com/RichardOtvos)
* fixed; Only show "Open Keystone" link to admins, thanks [John Beppu](https://github.com/beppu)
* fixed; Password fields are formatted correctly on the list screen of the Admin UI
* added; Support for custom MongoDB collection names (and other Schema options, see [#292](https://github.com/keystonejs/keystone/issues/292))
* added; Support for clearing password fields (if not required)
* added; Password.compare is now available on the Field object
* added; Support for loading fixture data with `keystone.createItems()` and in update scripts, see [this gist](https://gist.github.com/JedWatson/10739959) for an example
* added; Basic support for redirects, see [#303](https://github.com/keystonejs/keystone/issues/303) for details
* added; Support for excluding the blank option in Select fields with the `emptyOption` option
* improved; Nicer exception on EADDRINUSE error
* added; Warning when required fields aren't initial, see [#300](https://github.com/keystonejs/keystone/issues/300)
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
* fixed; accented characters are converted correctly when generating slugs, thanks to [keystone-utils](https://github.com/keystonejs/keystone-utils) 0.1.7

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
* improved; much more flexible support for http server startup options, see [#154](https://github.com/keystonejs/keystone/issues/154)


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
