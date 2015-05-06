/*!
 * Module dependencies.
 */

var util = require('util'),
  _ = require('underscore'),
  utils = require('keystone-utils'),
  super_ = require('../Type');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */

function text(list, path, options) {
  this._nativeType = String;
  this._underscoreMethods = ['crop'];

  this._properties = ['maxLen'];

  // if max option, set maxLen
  this.maxLen = null;
  if (options.max) {
    this.maxLen = { chars: 255, mode: 'limit' };
    if (typeof options.max !== 'object') {
      this.maxLen.chars = +options.max;
    } else {
      _.assign(this.maxLen, options.max);
    }
  }

  text.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(text, super_);


/**
 * Validates that length is within the max range
 *
 * @api public
 */

text.prototype.validateInput = function(data, required, item) {
  var validateMax = this.maxLen && this.maxLen.mode == 'limit';
  if (!required && !validateMax) return true;
  var value = this.getValueFromData(data);
  if (value === undefined && item && item.get(this.path)) return true;
  if(validateMax) {
    return data[this.path].length <= this.maxLen.chars;
  } else {
    return (data[this.path].trim()) ? true : false;
  }
};


/**
 * Crops the string to the specifed length.
 *
 * @api public
 */

text.prototype.crop = function(item, length, append, preserveWords) {
  return utils.cropString(item.get(this.path), length, append, preserveWords);
};


/*!
 * Export class
 */

exports = module.exports = text;
