/*!
 * Module dependencies.
 */

var util = require('util'),
  utils = require('keystone-utils'),
  super_ = require('../field');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */

function array(list, path, options) {
  this._nativeType = String;
  this._underscoreMethods = ['crop'];
  array.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(array, super_);


/**
 * Crops the string to the specifed length.
 * 
 * @api public
 */

array.prototype.crop = function(item, length, append, preserveWords) {
  return utils.cropString(item.get(this.path), length, append, preserveWords);
}


/*!
 * Export class
 */

exports = module.exports = array;
