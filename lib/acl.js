/**
  The ACL API manages keystone roles, user roles, as well as list crud permission roles.
*/
'use strict';

let keystone = require('../');
let async = require('async');


/**
 getListPermissions( )
 Return an object whose keys are the configured keystone lists with all permissions set.
 @return {Promise} Promise resolved when finished
 */
function getListPermissions () {
	let permissionModel = keystone.get('permission model');
	let Permission = keystone.list(permissionModel);
	let models = keystone.get('models');
	let permissions = {};

	return new Promise((resolve, reject) => {
		async.each(Object.keys(models), function (list, done) {
			permissions[list] = {
				key: models[list].key,
				path: models[list].path,
				roles: {}
			};

			Permission.model.findOne( { listName: list } ).exec(function (err, permission) {
				if (!err && permission) {
					var aclo = permission.toObject();
					permissions[list]['roles'] = {
						create: aclo.create,
						read: aclo.read,
						update: aclo.update,
						delete: aclo.delete
					};
				} else {
					permissions[list]['roles'] = {
						create: [],
						read: [],
						update: [],
						delete: []
					};
				}
				done(err);
			});
		}, function (err) {
			if (!err) {
				resolve(permissions);
			} else {
				console.error('getListPermissions failed: ' + err);
				reject(err);
			}
		});
	});
}

// Exports
let Acl = {
	getListPermissions: getListPermissions
};

module.exports = Acl;
