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
      'CloudinaryImages fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
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

cloudinaryimages.prototype.addToSchema = function() {
  
  var mongoose = keystone.mongoose;
  
  var field = this,
    schema = this.list.schema;

  console.log("A-T-S", this);
  
  // var paths = this.paths = {
  //   upload:     this._path.append('_upload'),
  //   uploads:    this._path.append('_uploads'),
  //   action:     this._path.append('_action'),
  //   order:      this._path.append('_order')
  // };
  
  // var ImageSchema = new mongoose.Schema({
  //   public_id:    String,
  //   version:    Number,
  //   signature:    String,
  //   format:     String,
  //   resource_type:  String,
  //   url:      String,
  //   width:      Number,
  //   height:     Number,
  //   secure_url:   String
  // });
  
  // var src  = function(img, options) {
  //   if (keystone.get('cloudinary secure')) {
  //     options = options || {};
  //     options.secure = true;
  //   }
  //   return img.public_id ? cloudinary.url(img.public_id + '.' + img.format, options) : '';
  // }
  
  // var addSize = function(options, width, height) {
  //   if (width) options.width = width;
  //   if (height) options.height = height;
  //   return options;
  // };
  
  // ImageSchema.method('src', function(options) {
  //   return src(this, options);
  // });
  
  // ImageSchema.method('scale', function(width, height) {
  //   return src(this, addSize({ crop: 'scale' }, width, height));
  // });
  
  // ImageSchema.method('fill', function(width, height) {
  //   return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height));
  // });
  
  // ImageSchema.method('lfill', function(width, height) {
  //   return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height));
  // });
  
  // ImageSchema.method('fit', function(width, height) {
  //   return src(this, addSize({ crop: 'fit' }, width, height));
  // });
  
  // ImageSchema.method('limit', function(width, height) {
  //   return src(this, addSize({ crop: 'limit' }, width, height));
  // });
  
  // ImageSchema.method('pad', function(width, height) {
  //   return src(this, addSize({ crop: 'pad' }, width, height));
  // });
  
  // ImageSchema.method('lpad', function(width, height) {
  //   return src(this, addSize({ crop: 'lpad' }, width, height));
  // });
  
  // ImageSchema.method('crop', function(width, height) {
  //   return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height));
  // });
  
  // ImageSchema.method('thumbnail', function(width, height) {
  //   return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height));
  // });
  
  // schema.add(this._path.addTo({}, [ImageSchema]));
  
  // this.removeImage = function(item, id, method, callback) {
  //   var images = item.get(field.path);
  //   if ('number' != typeof id) {
  //     for (var i = 0; i < images.length; i++) {
  //       if (images[i].public_id == id) {
  //         id = i;
  //         break;
  //       }
  //     }
  //   }
  //   var img = images[i];
  //   if (!img) return;
  //   if (method == 'delete') {
  //     cloudinary.uploader.destroy(img.public_id, function() {});
  //   }
  //   images.splice(id, 1);
  //   if (callback) {
  //     item.save(('function' != typeof callback) ? callback : undefined);
  //   }
  // }
  
  // this.underscoreMethod('remove', function(id, callback) {
  //   field.removeImage(this, id, 'remove', callback);
  // });
  
  // this.underscoreMethod('delete', function(id, callback) {
  //   field.removeImage(this, id, 'delete', callback);
  // });
  
  this.bindUnderscoreMethods();
}



/**
 * Formats the field value
 * 
 * @api public
 */

cloudinaryimages.prototype.format = function(item) {
  return '[Array]';
}


/*!
 * Export class
 */

exports = module.exports = array;
