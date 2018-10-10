/*
* @Author: django-wong
* @Date:   2018-10-10 00:47:36
* @Last Modified by:   django-wong
* @Last Modified time: 2018-10-10 10:57:58
*/

var keystone = require('../index');
var Types = keystone.Field.Types;

/**
 * The Ads Model
 */
var Asset = new keystone.List('Asset', {
	label: 'Asset',
	plural: 'Assets',
	path: 'asset',
	track: true,
});

Asset.add({
	label: {
		type: String,
		required: false,
		index: true,
		label: 'Label',
		initial: true,
	},
	file: {
		type: Types.File,
		storage: keystone.get('default storage') || keystone.Storage.DefaultStorage,
		label: 'File',
	},
});


Asset.defaultColumns = 'id, name, type';
Asset.register();
