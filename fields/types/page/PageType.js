/*
* @Author: django-wong
* @Date:   2018-09-29 00:24:21
* @Last Modified by:   django-wong
* @Last Modified time: 2018-09-29 01:36:31
*/

var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');

/**
 * PAGE FieldType Constructor
 * @extends    Field
 * @api        public
 */
function page (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || '300px';
	this.width = options.width || '100%';
	this._properties = ['height', 'width'];
	page.super_.call(this, list, path, options);
}

page.properName = 'Page';
util.inherits(page, FieldType);

page.prototype.validateInput = TextType.prototype.validateInput;
page.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
page.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = page;
