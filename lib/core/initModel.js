/*
* @Author: django-wong
* @Date:   2018-10-10 01:20:55
* @Last Modified by:   django-wong
* @Last Modified time: 2018-10-10 10:58:24
*/

var importer = require('./importer');

module.exports = function initModel () {
	importer(__dirname)('../../models');
};
