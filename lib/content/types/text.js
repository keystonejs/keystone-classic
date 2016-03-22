/*!
 * Module dependencies.
 */

var util = require('util');
var super_ = require('../type');

/**
 * Text ContentType Constructor
 * @extends Field
 * @api public
 */

function text (path, options) {
	text.super_.call(path, options);
}

/*!
 * Inherit from Type
 */

util.inherits(text, super_);


/*!
 * Export class
 */

module.exports = text;
