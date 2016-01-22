var assign = require('object-assign');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
function json (list, path, options) {
	this._nativeType = Object;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this._properties = ['editor', 'height'];
	this.codemirror = options.codemirror || {};
	this.editor = assign({ mode: json }, this.codemirror);
	json.super_.call(this, list, path, options);
}

json.properName = 'Json';
util.inherits(json, FieldType);

/* Inherit from TextType prototype */
json.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;


json.prototype.validateInput = function (data, required, item) {
	var value = this.getValueFromData(data);

	if (value === undefined && item && (item.get(this.path) || item.get(this.path) === 0)) {
		return true;
	}

	if (value == null && required) {
		return false;
	} else if (value == null && !required) {
		return true;
	} else {
		try {
			value = this.getValueFromData(data, true);

			if (typeof value !== 'object') {
				return false;
			} else {
				return true;
			}
		} catch (ex) {
			return false;
		}
	}
};

/* Export Field Type */
module.exports = json;
