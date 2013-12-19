// most of the code comes from Alleup node module
// https://github.com/tih-ra/alleup

/*

 (The MIT License)

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var util = require('util'),
    im = require('imagemagick'),
    fs = require('fs');

var config = {},
    uploaddir = undefined,
    scope = undefined;

var Uploader = exports = module.exports = function Uploader(options) {
    configJSON = options;

    if ( config['path'] == 'undefined' )
        throw new TypeError("No path defined in uploader config");

    eval('this.configSetup')(configJSON);
    eval('this.dirSetup')(configJSON);
};


Uploader.prototype = {

    dirSetup: function(options) {
        uploaddir = options['path'];
    },

    configSetup: function(jsonObject) {
        config = jsonObject;
    },

    genFileName: function(file, version) {
        return version + '_' + file;
    },

    remove: function(file, callback, _scope, variants) {
        scope = (arguments.length == 3) ? _scope : undefined

        var _variants = this.setupVariants(variants);
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
        fs.unlink(uploaddir + file, function(err){
            return callback(err);
        });
    },

    // upload directly with a file object (in case we don't need formidable request parsing)
    uploadFile : function(file, callback, _scope){
        scope = (arguments.length == 3) ? _scope : undefined
        var _this = this;

        _this.makeVariants(file, function(err,file){
            callback(err,file);
        });
    },

    makeVariants: function(file, callback) {

        var _this = this;
        var _variants = this.setupVariants();

        var _resize = _variants["resize"] || JSON.parse( JSON.stringify({"null" : "null"}) );
        var _crop = _variants["crop"] || JSON.parse( JSON.stringify({"null" : "null"}) );

        var new_file = Math.round(new Date().getTime());
        var ext = this.setExtension(file['type']);
        new_file += ext;

        var i = 0;
        for(prefix in _resize) {
            this.imAction('im.resize', file, this.genFileName( new_file, prefix ) , _resize[prefix], function(err){
                i++;
                if (i == Object.keys(_resize).length ) {
                    i = 0;
                    for(prefix in _crop) {
                        _this.imAction('im.crop', file, _this.genFileName( new_file, prefix ) , _crop[prefix], function(err){
                            i++;
                            if (i == Object.keys(_crop).length ) {
                                fs.unlink(file['path']);
                                callback(err, new_file);
                            };
                        });
                    };
                };
            });
        };
    },

    setupVariants: function(variants) {
        if (!!!variants){
            var resize = (typeof scope === 'undefined') ? config.variants.resize : eval('config.variants.'+scope+'.resize')
            var crop = (typeof scope === 'undefined') ? config.variants.crop : eval('config.variants.'+scope+'.crop')
            return { "resize" : resize, "crop" : crop }
        }
        else {
            var resize = variants.resize,
                crop = variants.crop ;
            return { "resize" : resize, "crop" : crop }
        }
    },

    imAction: function(action, file, prefix, size, callback) {
        if (size == "null") {
            return callback(null);
        }
        var dfile = prefix;
        var tfile = uploaddir + dfile;

        eval(action)( this.imOptions(file, tfile, size), function(err, stdout, stderr){
            return callback(err);
        });
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

};