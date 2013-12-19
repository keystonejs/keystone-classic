/*!
 * Module dependencies.
 */

var _ = require('underscore'),
    keystone = require('../../'),
    util = require('util'),
    utils = require('keystone-utils'),
    super_ = require('../field');

/**
 * FsImage FieldType Constructor
 * @extends Field
 * @api public
 */

function fsimage(list, path, options) {
    this._underscoreMethods = ['format'];
    // TODO: implement filtering, hard-coded as disabled for now

    var config = keystone.get('fsimage config'),
        scope = options.scope,
        inside = _.find(config.variants, function(fn,key){return key == scope});

    if (inside == undefined) {
        throw new Error("Field scope set in model definition doesn't exist" +
            " in fsimage config definition (in your web.js keystone config)," +
            " if you didn't configurated anything just set it to default");
    }

    this.scope = options.scope;

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
        scope:       this._path.append('.scope'),
        variants:       this._path.append('.variants'),
        // virtuals
        exists: 		this._path.append('.exists'),
        upload: 		this._path.append('_upload'),
        action: 		this._path.append('_action')
    };

    var schemaPaths = this._path.addTo({}, {
        url:			String,
        scope:       String,
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
            scope :'',
            variants : ''
        });
    }

    // get rid of images generated with previous config
    var remove = function(item){
        var uploader = keystone.get('uploader'),
            url = item.get(field.paths.url),
            scope = item.get(field.paths.scope),
            variants = JSON.parse(item.get(field.paths.variants));

        if (!!variants && !!scope){
            uploader.remove(url, function(err) {
                reset(item);
            },scope,variants);
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
        },
        /**
         * Deletes the image from file system and resets the field
         *
         * @api public
         */
        delete: function() {
            remove(this);
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
        uploader = keystone.get('uploader'),
        config = keystone.get('fsimage config'),
        scope = field.scope,
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
                field.apply(item, action);
        }

        if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {

            // the delete action seems to not working properly
            // so i delete the previous one every time we upload a new one, if a previous one exists
            if(!!url && url != '')
                field.apply(item, 'delete');

            uploader.uploadFile(req.files[paths.upload], function(err,file){
                // store url and curent config
                item.set(field.path,
                    {
                        url : file+'',
                        scope : scope,
                        variants : JSON.stringify(config.variants[scope])
                    });
                callback();
            },scope);

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
