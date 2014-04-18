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

  this.fields = {};

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
  
  var self = this;

  var mongoose = keystone.mongoose;
  
  var field = this,
    schema = this.list.schema;

  // console.log("A-T-S O", this._path);
  
  var ItemSchema = new mongoose.Schema();

  _.each(this.options.schema, function(options, key) {
    var pathStr = self._path.append('.' + key);

    // TODO: If we have array inside array, hiding fields with `hidden` param in options may not work with this implementation.
    options.sub_hidden = options.hidden;
    options.hidden = true;

    // TODO: need to set field label here or pass an option to field creator.
    // Otherwise, all labels are prefixed with array label, which is not what we want.
    options.label = options.label || utils.keyToLabel(key);


    self.fields[key] = self.list.field(pathStr, options);
  });


  // var paths = this.paths = {
  //   upload:     this._path.append('_upload'),
  //   uploads:    this._path.append('_uploads'),
  //   action:     this._path.append('_action'),
  //   order:      this._path.append('_order')
  // };

  // var ItemSchema = new mongoose.Schema(this.options.schema);
  
  // console.log('MADE SOME WRONG SCHEMA');

  // schema.add(this._path.addTo({}, [ItemSchema]));
    
  this.bindUnderscoreMethods();
}



/**
 * Formats the field value
 * 
 * @api public
 */

array.prototype.format = function(item) {
  var array = item.get(this.path);
  if(!array) return '[empty]';
  return '[' + array.length + ' items]';
}


/*!
 * Export class
 */

exports = module.exports = array;







