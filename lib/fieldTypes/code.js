/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../field');

/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */

function code(list, path, options) {

	this._nativeType = String;

	this.height = options.height || 180;
	this.lang = options.lang;
	this.mime = getMime(this.lang);

	code.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(code, super_);


/**
 * Gets the mime type for the specified language
 * @api private
 */

function getMime(lang) {

	var mime;

	switch (lang) {
		case 'c':
			mime = 'text/x-csrc'; break;
		case 'c++':
		case 'objetivec':
			mime = 'text/x-c++src'; break;
		case 'css':
			mime = 'text/css'; break;
		case 'asp':
			mime = 'application/x-aspx'; break;
		case 'c#':
			mime = 'text/x-csharp'; break;
		case 'vb':
			mime = 'text/x-vb'; break;
		case 'xml':
			mime = 'text/xml'; break;
		case 'php':
			mime = 'application/x-httpd-php'; break;
		case 'html':
			mime = 'text/html'; break;
		case 'ini':
			mime = 'text/x-properties'; break;
		case 'js':
			mime = 'text/javascript'; break;
		case 'java':
			mime = 'text/x-java'; break;
		case 'coffee':
			mime = 'text/x-coffeescript'; break;
		case 'lisp':
			mime = 'text/x-common-lisp'; break;
		case 'perl':
			mime = 'text/x-perl'; break;
		case 'python':
			mime = 'text/x-python'; break;
		case 'sql':
			mime = 'text/x-sql'; break;
		case 'json':
			mime = 'application/json'; break;
		case 'less':
			mime = 'text/x-less'; break;
		case 'sass':
			mime = 'text/x-sass'; break;
		case 'sh':
			mime = 'text/x-sh'; break;
		case 'ruby':
			mime = 'text/x-ruby'; break;
		case 'jsp':
			mime = 'application/x-jsp'; break;
		case 'tpl':
			mime = 'text/x-smarty'; break;
		case 'jade':
			mime = 'text/x-jade'; break;
	}

	return mime;

}


/*!
 * Export class
 */

exports = module.exports = code;
