/*!
 * Module dependencies.
 */

var _ = require('underscore'),
  keystone = require('../../'),
  util = require('util'),
  utils = require('keystone-utils'),
  super_ = require('../field');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */

function array(list, path, options) {
  
  this._underscoreMethods = ['format'];

  // TODO: implement filtering, usage disabled for now
  options.nofilter = true;
  // TODO: implement initial form, usage disabled for now
  if (options.initial) {
    throw new Error('Invalid Configuration\n\n' +
      'Array fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
  }

  array.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(array, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */

array.prototype.addToSchema = function() {
  
  var mongoose = keystone.mongoose;
  
  var field = this,
    schema = this.list.schema;

  console.log("A-T-S O", this.options);
  
  // var paths = this.paths = {
  //   upload:     this._path.append('_upload'),
  //   uploads:    this._path.append('_uploads'),
  //   action:     this._path.append('_action'),
  //   order:      this._path.append('_order')
  // };

  var ItemSchema = new mongoose.Schema(this.options.schema);
  
  schema.add(this._path.addTo({}, [ImageSchema]));
    
  this.bindUnderscoreMethods();
}



/**
 * Formats the field value
 * 
 * @api public
 */

array.prototype.format = function(item) {
  return '[Array]';
}


/*!
 * Export class
 */

exports = module.exports = array;







