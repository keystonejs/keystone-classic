var demand = require('must'),
	keystone = require('../').init(),
	Types = keystone.Field.Types,
	Field = require('../lib/field'),
	Test = keystone.List('AuditMetaTest'),
	mongoose = require('mongoose'),
	createdByUserId = mongoose.Types.ObjectId('53d70dbf66100abc147f0000'),
	updatedByUserId = mongoose.Types.ObjectId('53d70dbf66100abc147f0001'),
	item;

before(function() {
	keystone.set('user model', 'User');
	Test.add({
		name: { type: String }
	});
});

describe('auditMeta schemaPlugin', function() {
	describe('testing when "audit meta" pattern is not added', function() {

		it('should not have an auditMetaUpdate() method', function() {
			demand(Test.schema.methods.auditMetaUpdate).be.undefined();
		});
	});

	describe('testing when "audit meta" pattern is added', function() {
		before(function() {
			Test.addPattern('audit meta');
			Test.register();
		});

		it('should have an auditMetaUpdate() method', function() {
			demand(Test.schema.methods.auditMetaUpdate).be.a.function();
		});

		it('should have a createdBy field', function() {
			demand(Test.fields.createdBy).be.an.instanceOf(Field);
		});

		it('should have a updatedBy field', function() {
			demand(Test.fields.updatedBy).be.an.instanceOf(Field);
		});

		it('should have a createdBy mapping', function() {
			demand(Test.mappings.createdBy).be('createdBy');
		});

		it('should have a modifiedBy mapping', function() {
			demand(Test.mappings.modifiedBy).be('updatedBy');
		});

		describe('testing an item created from model', function() {
			before(function() {
				item = new Test.model();
			});

			it('should have an auditMetaUpdate() method', function() {
				demand(item.auditMetaUpdate).be.a.function();
			});
			
			describe('calling auditMetaUpdate(item, isNew, userId)', function() {

				it('should update both createdBy and updatedBy when isNew = true', function() {
					item.auditMetaUpdate(item, true, createdByUserId);
					demand(item.get('createdBy')).be(createdByUserId);
					demand(item.get('updatedBy')).be(createdByUserId);
				});

				it('should update only the updatedBy when isNew = false', function() {
					item.auditMetaUpdate(item, false, updatedByUserId);
					demand(item.get('createdBy')).be(createdByUserId);
					demand(item.get('updatedBy')).be(updatedByUserId);
				});
			});

		});

	});
});
