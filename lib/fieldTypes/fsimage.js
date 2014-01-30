/*!
 * Module dependencies.
 */

var _ = require('underscore'),
    keystone = require('../../'),
    util = require('util'),
    utils = require('keystone-utils'),
    super_ = require('../field'),
    im = require('imagemagick'),
    fs = require('fs');

/**
 * FsImage FieldType Constructor
 * @extends Field
 * @api public
 */


function fsimage(list, path, options) {
    this._underscoreMethods = ['format'];

    if (!!!options.variants || _.isEmpty(options.variants))
        throw new Error("FsImage fields require a valid config object for setting up variants.");

    // default variant config for admin feedback
    var adminConfig = {
        "resize": {
            "admin" : "300x200"
        }
    };
    // default path for upload
    var defaultPath = 'public/images/upload/';

    // if path not precised push the default one
    if (!!!options.path || _.isEmpty(options.path)){
        options.path = defaultPath;
    }
    if (!_.has(options.variants.resize,"admin")){ // push the admin config into variants
        options.variants.resize.admin = adminConfig.resize.admin;
    }
    
    // TODO: implement filtering, hard-coded as disabled for now
    options.nofilter = true;

    fsimage.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */

util.inherits(fsimage, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

fsimage.prototype.addToSchema = function() {

    var field = this,
        schema = this.list.schema;

    var paths = this.paths = {
        // image fields
        url: 			this._path.append('.url'),
        path:           this._path.append('.path'),
        variants:       this._path.append('.variants'),

        // virtuals
        exists: 		this._path.append('.exists'),
        upload: 		this._path.append('_upload'),
        action: 		this._path.append('_action')
    };

    var schemaPaths = this._path.addTo({}, {
        url:			String,
        path:           String,
        variants:       String
    });

    schema.add(schemaPaths);

    var exists = function(item) {
        return (item.get(paths.url) ? true : false);
    }

    // The .exists virtual indicates whether an image is stored
    schema.virtual(paths.exists).get(function() {
        return schemaMethods.exists.apply(this);
    });


    var reset = function(item) {
        item.set(field.path, {
            url: '',
            path : '',
            variants : ''
        });
    }

    // initialize uploader config before upload or remove
    var init = function(item,path,variants) {
        var path = path || item.get(field.paths.path),
            variants = variants || JSON.parse(item.get(field.paths.variants));
        uploaderMethods.init(path,variants);
    }

    // get rid of images generated with previous config
    var remove = function(item){
        if (!!item.get(field.paths.url)){ // means that once our item has been filled
            init(item);
            var url = item.get(field.paths.url);
            uploaderMethods.remove(url, function(err) {});
        }
    }

    // upload picture with config specified in options object
    this.upload = function(item,file,callback){
        remove(item);
        init(item,field.options.path,field.options.variants);
        uploaderMethods.uploadFile(file,callback);
    }

    /******* upload / imagemagick methods ********/
    var uploaderMethods = {

        uploadDir : undefined,
        variants : undefined,

        init : function(path,variants){
            this.uploadDir = path;
            this.variants = variants;
        },

        genFileName: function(file, version) {
            return version + '_' + file;
        },

        remove: function(file, callback) {
            var _variants = this.setupVariants();
            var _resize = _variants['resize'];
            var _crop = _variants['crop'];

            for(version in _resize) {
                this.dirRemove( this.genFileName( file, version ),  function(err) {
                    callback(err);
                });
            };

            for(version in _crop) {
                this.dirRemove( this.genFileName( file, version ),  function(err) {
                    callback(err);
                });
            };
            return callback(null);
        },

        dirRemove: function(file, callback){
            var uploaddir = this.uploadDir;
            fs.unlink(uploaddir + file, function(err){
                return callback(err);
            });
        },

        // upload directly with a file object (in case we don't need formidable request parsing)
        uploadFile : function(file, callback){

            //console.log("upload", file);

            this.makeVariants(file, function(err,file){
                callback(err,file);
            });
        },

        makeVariants: function(file, callback) {

            var _this = this;
            var _variants = this.setupVariants();

            var _resize = _variants["resize"] || null;
            var _crop = _variants["crop"] || null;

            var new_file = Math.round(new Date().getTime());
            var ext = this.setExtension(file['type']);
            new_file += ext;

            var count = 0; // counts the number of variants

            if (_resize != '' && !!_resize && Object.keys(_resize).length  > 0) {
                count += Object.keys(_resize).length ;
            }
            if (_crop != '' && !!_crop && Object.keys(_crop).length > 0) {
                count += Object.keys(_crop).length;
            }

            var renderImages = _.after(count, function(err){  // trigger our callback when all the variants are processed
                callback(err, new_file);
            });

            for(prefix in _resize) {
                this.imAction('resize', file, this.genFileName( new_file, prefix ) , _resize[prefix], function(err){
                    renderImages(err);
                });
            }

            for(prefix in _crop) {
                _this.imAction('crop', file, _this.genFileName( new_file, prefix ) , _crop[prefix], function(err){
                    renderImages(err);
                });
            };

        },

        setupVariants: function() {
            var resize = this.variants.resize,
                crop = this.variants.crop ;
            return { "resize" : resize, "crop" : crop }
        },

        imAction: function(action, file, prefix, size, callback) {
            if (size == "null") {
                return callback(null);
            }
            var dfile = prefix;
            var tfile = this.uploadDir + dfile;

            if (action == 'resize'){
                im.resize(this.imOptions(file, tfile, size), function(err, stdout, stderr){
                    return callback(err);
                });
            }
            else {
                im.crop(this.imOptions(file, tfile, size), function(err, stdout, stderr){
                    return callback(err);
                });
            }
        },

        setExtension: function(content_type) {
            switch(content_type) {
                case 'image/jpeg':
                    var ext = '.jpg'
                    break;
                case 'image/png':
                    var ext = '.png'
                    break;
                case 'image/gif':
                    var ext = '.gif'
                    break;
            };
            return ext;
        },

        imOptions: function(file, tfile, size) {
            var _size = size.split('x');
            return options = {
                srcPath: file['path'],
                dstPath: tfile,
                width: _size[0],
                height: _size[1],
                quality: 1
            };
        }
    }

    var schemaMethods = {
        exists: function() {
            return exists(this);
        },
        /**
         * Resets the value of the field
         *
         * @api public
         */
        reset: function() {
            remove(this);
            reset(this);
        },

        //remove picture file and reset model
        delete : function() {
            remove(this);
            reset(this);
        }
    }

    _.each(schemaMethods, function(fn, key) {
        field.underscoreMethod(key, fn);
    });

    // expose a method on the field to call schema methods
    this.apply = function(item, method) {
        return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
    };

    this.bindUnderscoreMethods();
}


/**
 * Formats the field value
 *
 * @api public
 */

fsimage.prototype.format = function(item) {
    return item.get(this.paths.url);
}


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

fsimage.prototype.isModified = function(item) {
    return item.isModified(this.paths.url);
}


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

fsimage.prototype.validateInput = function(data) {
    // TODO - how should image field input be validated?
    return true;
}


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

fsimage.prototype.updateItem = function(item, data) {
    // TODO - direct updating of data (not via upload)
}


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the image to file system)
 *
 * @api public
 */

fsimage.prototype.getRequestHandler = function(item, req, paths, callback) {

    var field = this,
        url = item.get(field.paths.url);

    if (utils.isFunction(paths)) {
        callback = paths;
        paths = field.paths;
    } else if (!paths) {
        paths = field.paths;
    }

    callback = callback || function() {};

    return function() {

        if (req.body) {
            var action = req.body[paths.action];
            if (/^(delete|reset)$/.test(action))
                    field.apply(item,action);
        }

        if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {

            field.upload(item,req.files[paths.upload], function(err,file){
                // store url and curent config
                item.set(field.path,{
                    url : file+'',
                    path : field.options.path,
                    variants : JSON.stringify(field.options.variants)
                });
                callback();
            });

        } else {
            callback();
        }

    }

}

/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

fsimage.prototype.handleRequest = function(item, req, paths, callback) {
    this.getRequestHandler(item, req, paths, callback)();
}

/*!
 * Export class
 */

exports = module.exports = fsimage;
