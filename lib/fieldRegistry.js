var fs = require('fs');
var path = require('path');
var EventEmitter = require('events');

function FieldRegistry () {
}

FieldRegistry.prototype = new EventEmitter();

FieldRegistry.prototype.register = function register (name, componentName, requireSpec) {
	if (typeof this[name] === 'undefined') {
		this[name] = {};
	}
	this[name][componentName] = requireSpec;
	this.emit('added', { name: name, componentName: componentName, path: requireSpec });
};

FieldRegistry.prototype.registerDirectory = function registerDirectory (name, dirPath) {
	var files = fs.readdirSync(dirPath);
	files.forEach(function (file) {
		var basename = path.basename(file, '.js');
		if (basename.substr(0, name.length) === name) {
			this.register(name, basename.substr(name.length), path.join(dirPath, file));
		}
	}.bind(this));
};

Object.defineProperty(FieldRegistry.prototype, 'fieldNames', {
	get: function getFieldNames () {
		return Object.keys(this);
	},
});

FieldRegistry.prototype.generateJSForComponentType = function generateJSForComponentType (type, transformKey) {
	if (typeof transformKey !== 'function') transformKey = function (x) { return x; };
	var registry = this;
	var fields = Object.keys(this);
	var code = 'module.exports = {\n';
	fields.forEach(function (field) {
		var components = registry[field];
		if (typeof components[type] !== 'undefined') {
			code += '  "' + transformKey(field) + '": require("' + components[type] + '"),\n';
		}
	});
	code += '};';
	return code;
};

var registry = module.exports = new FieldRegistry();

// Register components for built-in types

registry.registerDirectory('AzureFile', path.resolve(__dirname, '../fields/admin/azurefile/'));
registry.registerDirectory('Boolean', path.resolve(__dirname, '../fields/admin/boolean/'));
registry.registerDirectory('CloudinaryImage', path.resolve(__dirname, '../fields/admin/cloudinaryimage/'));
registry.registerDirectory('CloudinaryImages', path.resolve(__dirname, '../fields/admin/cloudinaryimages/'));
registry.registerDirectory('Code', path.resolve(__dirname, '../fields/admin/code/'));
registry.registerDirectory('Color', path.resolve(__dirname, '../fields/admin/color/'));
registry.registerDirectory('Date', path.resolve(__dirname, '../fields/admin/date/'));
registry.registerDirectory('DateArray', path.resolve(__dirname, '../fields/admin/datearray/'));
registry.registerDirectory('Datetime', path.resolve(__dirname, '../fields/admin/datetime/'));
registry.registerDirectory('Email', path.resolve(__dirname, '../fields/admin/email/'));
registry.registerDirectory('Embedly', path.resolve(__dirname, '../fields/admin/embedly/'));
// registry.registerDirectory('GeoPoint', path.resolve(__dirname, '../fields/admin/geopoint/'));
registry.registerDirectory('Html', path.resolve(__dirname, '../fields/admin/html/'));
registry.registerDirectory('Key', path.resolve(__dirname, '../fields/admin/key/'));
registry.registerDirectory('LocalFile', path.resolve(__dirname, '../fields/admin/localfile/'));
registry.registerDirectory('LocalFiles', path.resolve(__dirname, '../fields/admin/localfiles/'));
registry.registerDirectory('Location', path.resolve(__dirname, '../fields/admin/location/'));
registry.registerDirectory('Markdown', path.resolve(__dirname, '../fields/admin/markdown/'));
registry.registerDirectory('Money', path.resolve(__dirname, '../fields/admin/money/'));
registry.registerDirectory('Name', path.resolve(__dirname, '../fields/admin/name/'));
registry.registerDirectory('Number', path.resolve(__dirname, '../fields/admin/number/'));
registry.registerDirectory('NumberArray', path.resolve(__dirname, '../fields/admin/numberarray/'));
registry.registerDirectory('Password', path.resolve(__dirname, '../fields/admin/password/'));
registry.registerDirectory('Relationship', path.resolve(__dirname, '../fields/admin/relationship/'));
registry.registerDirectory('S3File', path.resolve(__dirname, '../fields/admin/s3file/'));
registry.registerDirectory('Select', path.resolve(__dirname, '../fields/admin/select/'));
registry.registerDirectory('Text', path.resolve(__dirname, '../fields/admin/text/'));
registry.registerDirectory('TextArray', path.resolve(__dirname, '../fields/admin/textarray/'));
registry.registerDirectory('Textarea', path.resolve(__dirname, '../fields/admin/textarea/'));
registry.registerDirectory('Url', path.resolve(__dirname, '../fields/admin/url/'));

registry.registerDirectory('AzureFile', path.resolve(__dirname, '../fields/types/azurefile/'));
registry.registerDirectory('Boolean', path.resolve(__dirname, '../fields/types/boolean/'));
registry.registerDirectory('CloudinaryImage', path.resolve(__dirname, '../fields/types/cloudinaryimage/'));
registry.registerDirectory('CloudinaryImages', path.resolve(__dirname, '../fields/types/cloudinaryimages/'));
registry.registerDirectory('Code', path.resolve(__dirname, '../fields/types/code/'));
registry.registerDirectory('Color', path.resolve(__dirname, '../fields/types/color/'));
registry.registerDirectory('Date', path.resolve(__dirname, '../fields/types/date/'));
registry.registerDirectory('DateArray', path.resolve(__dirname, '../fields/types/datearray/'));
registry.registerDirectory('Datetime', path.resolve(__dirname, '../fields/types/datetime/'));
registry.registerDirectory('Email', path.resolve(__dirname, '../fields/types/email/'));
registry.registerDirectory('Embedly', path.resolve(__dirname, '../fields/types/embedly/'));
// registry.registerDirectory('GeoPoint', path.resolve(__dirname, '../fields/types/geopoint/'));
registry.registerDirectory('Html', path.resolve(__dirname, '../fields/types/html/'));
registry.registerDirectory('Key', path.resolve(__dirname, '../fields/types/key/'));
registry.registerDirectory('LocalFile', path.resolve(__dirname, '../fields/types/localfile/'));
registry.registerDirectory('LocalFiles', path.resolve(__dirname, '../fields/types/localfiles/'));
registry.registerDirectory('Location', path.resolve(__dirname, '../fields/types/location/'));
registry.registerDirectory('Markdown', path.resolve(__dirname, '../fields/types/markdown/'));
registry.registerDirectory('Money', path.resolve(__dirname, '../fields/types/money/'));
registry.registerDirectory('Name', path.resolve(__dirname, '../fields/types/name/'));
registry.registerDirectory('Number', path.resolve(__dirname, '../fields/types/number/'));
registry.registerDirectory('NumberArray', path.resolve(__dirname, '../fields/types/numberarray/'));
registry.registerDirectory('Password', path.resolve(__dirname, '../fields/types/password/'));
registry.registerDirectory('Relationship', path.resolve(__dirname, '../fields/types/relationship/'));
registry.registerDirectory('S3File', path.resolve(__dirname, '../fields/types/s3file/'));
registry.registerDirectory('Select', path.resolve(__dirname, '../fields/types/select/'));
registry.registerDirectory('Text', path.resolve(__dirname, '../fields/types/text/'));
registry.registerDirectory('TextArray', path.resolve(__dirname, '../fields/types/textarray/'));
registry.registerDirectory('Textarea', path.resolve(__dirname, '../fields/types/textarea/'));
registry.registerDirectory('Url', path.resolve(__dirname, '../fields/types/url/'));
