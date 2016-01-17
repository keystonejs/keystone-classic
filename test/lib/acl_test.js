'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var chaiAsPromised = require("chai-as-promised");
var chai = require("chai").use(chaiAsPromised).should();

var acl = null;
var permission = null;

// Mocked Models
var Permission = function Permission() {
	this.name = '';
	this.list = '';
	this.model = {};
};

var models = {
	List1: {
		List: {
			options: {
				noedit: false,
				nocreate: false,
				nodelete: false,
				autocreate: false
			}
		},
		key: 'List1',
		path: 'list1'
	}
};

// Mocked Keystone
var keystoneMock = {
	get: function(what) {
		switch(what){
			case 'models':
				return models;
				break;
			case 'permission model':
				return 'Permission';
				break;
			default:
				console.error('acl_test: invalid get value');
		}
	},
	list: function(which) {
		switch(which){
			case 'Permission':
				return permission;
				break;
			default:
				console.error('acl_test: invalid list value');
		}
	}
};

describe("Acl", function() {
	beforeEach(function () {
		acl = proxyquire("../../lib/acl", {
			'../': keystoneMock
		});

		permission = new Permission();
	});

	describe("getListPermissions", function() {
		it("should return an object with list permissions", function(done) {

			var createRoles = ['cr1'];
			var readRoles = ['rr1'];
			var updateRoles = ['ur1'];
			var deleteRoles = ['dr1'];

			permission.model.findOne = function(query) {
				return {
					exec: function (cb) {
						var permissions = {
							name: query.listName,
							listName: query.listName,
							create: createRoles,
							read: readRoles,
							update: updateRoles,
							delete: deleteRoles,
							toObject: function(){return this;}
						};
						cb(null, permissions);
					}
				}
			};

			var promise = acl.getListPermissions();
			promise.should.be.fulfilled.then(function (permissions) {
				permissions[models.List1.key].roles.create.must.equal(createRoles);
				permissions[models.List1.key].roles.read.must.equal(readRoles);
				permissions[models.List1.key].roles.update.must.equal(updateRoles);
				permissions[models.List1.key].roles.delete.must.equal(deleteRoles);
			}).should.notify(done);

		})
	});

});
