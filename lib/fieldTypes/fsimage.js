/*!
 * Module dependencies.
 */

var _ = require('underscore'),
    keystone = require('../../'),
    util = require('util'),
    utils = require('keystone-utils'),
    super_ = require('../field'),
    fs = require('fs'),
    gm = require('gm');

/**
 * FsImage FieldType Constructor
 * @extends Field
 * @api public
 */


/****************************************** Fsimage field declaration example
 path :  'public/images/upload/',

 variants : {
    resize : {                  RESIZE : ratio is maintained
        picture_resized : {    <-- variant name
            dim : [800,800],
            quality : 90
        }
    },
    crop : {                    CROP : automatically centers the crop for the moment
        picture_crop : {       <-- variant name
            dim : [300,300],
            quality : 90
        }
    },
    thumb : {
        picture_thumb : {      <-- variant name
            dim : [100,100],
            quality : 80
        }
    }
 }

 Then you can access the picture in the template code :

 - assuming data.picture is your picture object :
    img(src='/images/upload/' + 'variantName' + '_' + data.picture.generatedFileName)

 - or by using one of the generated Urls shown in by the admin UI, removing the public root directory
 at the beginning of the urls, since you don't need to precise it template side

 - or (assuming data.picture is your picture object)
    by parsing jade side publicUrls object :
    -var urls = JSON.parse(data.picture.publicUrls)
    img(src= urls.variantName)
******************************************/


function fsimage(list, path, options) {
    this._underscoreMethods = ['format'];

    if (!gm) {
        throw new Error('Invalid Configuration\n\n' +
            'fsImage fields (' + list.key + '.' + path + ') require gm v1.14.2 to be installed.\n\n' +
            'See http://keystonejs.com/guide/fields/#fsimage for more information.\n');
    }

    if (!!!options.variants || _.isEmpty(options.variants)){
        throw new Error('Invalid Configuration\n\n' +
            'fsImage fields (' + list.key + '.' + path + ') require a valid config object for setting up variants.\n\n' +
            'See http://keystonejs.com/guide/fields/#fsimage for more information.\n');
    }

    // default variant config for admin feedback
    var adminConfig = {
        "resize": {
            "admin" : {
                dim : [300,200]
            }
        }
    };
    // default path for upload
    var defaultPath = 'public/images/upload/';

    // if path not precised push the default one
    if (!!!options.path || _.isEmpty(options.path)){
        options.path = defaultPath;
    }
    else {
        // CORRECT TINY PATH MISTAKE: if '/' missing at the end of the path, add it
        var lastLetterFromPath = options.path.slice(options.path.length - 1,options.path.length);
        if(lastLetterFromPath != '/') options.path += '/';
    }

    if (!_.has(options.variants.resize, "admin")){ // push the admin config into variants
        options.variants.resize.admin = adminConfig.resize.admin;
    }

    if (options.path.slice(0,6) != 'public') {
        throw new Error('Invalid Configuration\n\n' +
            'fsImage fields (' + list.key + '.' + path + ') only supports directory placed into public directory\n\n' +
            'See http://keystonejs.com/guide/fields/#fsimage for more information.\n');
    }

    if (!fs.existsSync(options.path)) {
        throw new Error('Invalid Configuration\n\n' +
            'fsImage fields (' + list.key + '.' + path + ') requires a consistent path, \n\n' +
            'The current target directory :'+ options.path +' doesn\'t exist, you need to create it\n\n' +
            'See http://keystonejs.com/guide/fields/#fsimage for more information.\n');
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
        generatedFileName: 			this._path.append('.generatedFileName'),   // generated file name from creation date
        path:           this._path.append('.path'), // directory where generated pictures are stored
        templatePath:   this._path.append('.templatePath'),  // directory path string for template use (without 'public at the beginning')
        variants:       this._path.append('.variants'),      // Stringified JSON arrays (see example above)
        publicUrls:   this._path.append('.publicUrls'),

        // virtuals
        exists: 		this._path.append('.exists'),
        upload: 		this._path.append('_upload'),
        action: 		this._path.append('_action')
    };

    var schemaPaths = this._path.addTo({}, {
        generatedFileName:			String,
        path:           String,
        templatePath:   String,
        variants:       String,
        publicUrls:   String
    });

    schema.add(schemaPaths);

    var exists = function(item) {
        return (item.get(paths.generatedFileName) ? true : false);
    }

    // The .exists virtual indicates whether an image is stored
    schema.virtual(paths.exists).get(function() {
        return schemaMethods.exists.apply(this);
    });


    var reset = function(item) {
        item.set(field.path, {
            generatedFileName: '',
            path : '',
            templatePath : '',
            variants : '',
            publicUrls: ''
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
        if (!!item.get(field.paths.generatedFileName)){ // means that once our item has been filled
            init(item);
            var generatedFileName = item.get(field.paths.generatedFileName);
            uploaderMethods.remove(generatedFileName, function(err) {});
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

        remove: function(file, callback) {
            var _resize = this.variants.resize || null;
            var _crop = this.variants.crop || null;
            var _thumb = this.variants.thumb || null;

            for(version in _resize) {
                this.dirRemove( version + '_' + file,  function(err) {
                    callback(err);
                });
            };

            for(version in _crop) {
                this.dirRemove( version + '_' + file,  function(err) {
                    callback(err);
                });
            };

            for(version in _thumb) {
                this.dirRemove( version + '_' + file,  function(err) {
                    callback(err);
                });
            };
            return callback(null);
        },

        dirRemove: function(file, callback){
            var filePath = this.uploadDir + file;
            fs.unlink(filePath, function(err){
                return callback(err);
            });
        },

        // upload directly with a file object (in case we don't need formidable request parsing)
        uploadFile : function(file, callback){
            this.makeVariants(file, function(err,file){
                callback(err,file);
            });
        },

        makeVariants: function(file, callback) {

            var _resize = this.variants.resize || null;
            var _crop = this.variants.crop || null;
            var _thumb = this.variants.thumb || null;

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
            if (_thumb != '' && !!_thumb && Object.keys(_thumb).length > 0) {
                count += Object.keys(_thumb).length;
            }

            var renderImages = _.after(count, function(err){  // trigger our callback when all the variants are processed
                callback(err, new_file);
            });

            for(prefix in _resize) {
                this.imAction('resize', file, prefix + '_' + new_file, _resize[prefix], function(err){
                    renderImages(err);
                });
            }

            for(prefix in _crop) {
                this.imAction('crop', file, prefix + '_' + new_file, _crop[prefix], function(err){
                    renderImages(err);
                });
            };

            for(prefix in _thumb) {
                this.imAction('thumb', file, prefix + '_' + new_file, _thumb[prefix], function(err){
                    renderImages(err);
                });
            };

        },

        imAction: function(action, file, prefix, options, callback) {

            // if options object is null or undefined
            if (!options) {
                return callback(null);
            }

            // images processing options
            var targetPath = this.uploadDir + prefix,
                srcPath = file['path'];

            switch (action) {
                case 'resize' :
                    var width = options.dim[0],
                        height = options.dim[1],
                        quality = options.quality || 75;

                    gm(srcPath).quality(quality).resize(width,height)
                        .write(targetPath, function (err) {
                            callback(err);
                        });
                    break;

                case 'crop' :
                    var width = options.dim[0],
                        height = options.dim[1],
                        quality = options.quality || 75;

                    gm(srcPath).quality(quality).gravity('Center').crop(width,height)
                        .write(targetPath, function (err) {
                            callback(err);
                        });

                    break;

                case 'thumb' :
                    var width = options.dim[0],
                        height = options.dim[1],
                        quality = options.quality;
                    gm(srcPath).thumb(width, height, targetPath, quality, callback);
                    break;
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

    var field = this;
        //generatedFileName = item.get(field.paths.generatedFileName);

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

                console.log(field.options.variants);

                // build publicUrls array
                var templatePath = field.options.path.slice(6,field.options.path.length),// remove 'public' string for template use
                    publicUrls = {},
                    _resize = field.options.variants.resize || null,
                    _crop = field.options.variants.crop || null,
                    _thumb = field.options.variants.thumb || null;
                if (_resize){
                    for (variantName in _resize) {
                        publicUrls[variantName] = templatePath + variantName + '_' + file;
                    }
                }
                if(_crop){
                    for (variantName in _crop) {
                        publicUrls[variantName] = templatePath + variantName + '_' + file;
                    }
                }
                if(_thumb){
                    for (variantName in _thumb) {
                        publicUrls[variantName] = templatePath + variantName + '_' + file;
                    }
                }


                // store generatedFileName and curent config
                item.set(field.path,{
                    generatedFileName : file+'',
                    path : field.options.path,
                    templatePath : templatePath,
                    variants : JSON.stringify(field.options.variants),
                    publicUrls : JSON.stringify(publicUrls)
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
