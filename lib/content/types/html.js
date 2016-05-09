/*!
 * Module dependencies.
 */

var util = require('util');
var super_ = require('../type');

/**
 * HTML ContentType Constructor
 * @extends Field
 * @api public
 */

function html (path, options) {
	html.super_.call(path, options);
}

/*!
 * Inherit from Type
 */

util.inherits(html, super_);


/*!
 * Export class
 */

module.exports = html;
