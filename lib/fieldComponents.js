var fs = require('fs');
var path = require('path');

function FieldComponentRegistry () {
}

FieldComponentRegistry.prototype = {
	registerDirectory: function registerDirectory (name, dirPath) {
		var files = fs.readdirSync(dirPath);
		var prop = this[name] = {};
		files.forEach(function (file) {
			var basename = path.basename(file, '.js');
			if (basename.substr(0, name.length) === name) {
				prop[basename.substr(name.length)] = path.join(dirPath, file);
				// console.log(name, ".", basename.substr(name.length), "=", path.join(dirPath, file));
			}
		});
	},
	generateJSForComponentType: function generateJSForComponentType (type, transformKey) {
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
	},
};

var registry = module.exports = new FieldComponentRegistry();

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
