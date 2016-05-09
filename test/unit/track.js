var keystone = require('../../index.js');
var Types = require('../../lib/fieldTypes');
var request = require('supertest');
var demand = require('must');
var async = require('async');
var getExpressApp = require('../helpers/getExpressApp');
var removeModel = require('../helpers/removeModel');

describe('List "track" option', function () {
	var app = getExpressApp();
	var userModelName = 'User';
	var testModelName = 'Test';
	var User;
	var Test;
	var dummyUser1;
	var dummyUser2;
	var post;

	before(function (done) {
		var tasks = [];

		// in case model names were previously used and not cleaned up
		removeModel(userModelName);
		removeModel(testModelName);

		// define user model
		keystone.set('user model', userModelName);
		User = keystone.List(userModelName);
		User.add({
			name: { type: String, required: true, index: true }
		});
		User.register();

		function getItem(id, done) {
			if (id) {
				Test.model.findById(id).exec(function (err, found) {
					if (err) {
						throw err;
					}

					if (!found) {
						throw new Error('test document not found')
					}

					item = found;
					done(item);
				});
			} else {
				item = new Test.model();
				done(item);
			}
		}

		// route to simulate use of updateHandler()
		app.post('/using-update-handler/:id?', function (req, res) {
			getItem(req.params.id, function (item) {
				req.user = req.params.id ? dummyUser2 : dummyUser1;
				var updateHandler = item.getUpdateHandler(req);
				updateHandler.process(req.body, function (err, data) {
					if (err) {
						res.send('BAD');
					} else {
						res.send('GOOD');
					}
				});
			});
		});

		// route to simulate use of .save()
		app.post('/using-save/:id?', function (req, res) {
			getItem(req.params.id, function (item) {
				item._req_user = req.params.id ? dummyUser2 : dummyUser1;
				item.set(req.body);
				item.save(function (err, data) {
					if (err) {
						res.send('BAD');
					} else {
						res.send('GOOD');
					}
				});
			});
		});

		tasks.push(function (done) {
			User.model.remove({}, function (err) {
				if (err) {
					throw err;
				}
				done();
			});
		});

		tasks.push(function (done) {
			dummyUser1 = new User.model({
				'name': 'John Doe'
			}).save(function (err, data) {
				if (err) {
					throw err;
				}
				dummyUser1 = data;
				done();
			});
		});

		tasks.push(function (done) {
			dummyUser2 = new User.model({
				'name': 'Jane Doe'
			}).save(function (err, data) {
				if (err) {
					throw err;
				}
				dummyUser2 = data;
				done();
			});
		});

		async.series(tasks, function (err) {
			if (err) {
				throw err;
			}
			done();
		});
	});

	describe('when "track" option is not valid', function () {

		afterEach(function () {
			removeModel(testModelName);
		});

		it('should throw an error if "track" is not a boolean or an object', function () {
			function badList() {
				Test = keystone.List(testModelName, { track: 'bad setting' });
				Test.add({ name: { type: String } });
				Test.register();
			}
			badList.must.throw(/"track" must be a boolean or an object/);
		});

		it('should throw an error if "track" fields are not booleans or strings', function () {
			function badList() {
				Test = keystone.List(testModelName, { track: { createdBy: 5 } });
				Test.add({ name: { type: String } });
				Test.register();
			}
			badList.must.throw(/must be a boolean or a string/);
		});

		it('should throw an error if "track" has an invalid field name', function () {
			function badList() {
				Test = keystone.List(testModelName, { track: { createdAt: true, badfield: true } });
				Test.add({ name: { type: String } });
				Test.register();
			}
			badList.must.throw(/valid field options are/);
		});

		it('should not register the plugin if all fields are false', function () {
			Test = keystone.List(testModelName, {
				track: { createdAt: false, createdBy: false, updatedAt: false, updatedBy: false }
			});
			Test.add({ name: { type: String } });
			Test.register();

			demand(Test.field('createdAt')).be.undefined();
			demand(Test.field('createdBy')).be.undefined();
			demand(Test.field('updatedAt')).be.undefined();
			demand(Test.field('updatedBy')).be.undefined();
		});

	});

	describe('when "track" option is set to true', function () {

		describe('using updateHandler()', function () {

			before(function () {
				Test = keystone.List(testModelName, { track: true });
				Test.add({ name: { type: String } });

				Test.schema.post('save', function () {
					post = this;
				});

				Test.register();
			});

			after(function (done) {
				// post test cleanup
				Test.model.remove({}, function (err) {
					if (err) {
						throw err;
					}
					removeModel(testModelName);
					done();
				});
			});

			it('should have all the default fields', function () {
				demand(Test.field('createdAt')).be.an.object();
				demand(Test.field('createdBy')).be.an.object();
				demand(Test.field('updatedAt')).be.an.object();
				demand(Test.field('updatedBy')).be.an.object();
				demand(Test.field('createdAt').type).be('datetime');
				demand(Test.field('createdBy').type).be('relationship');
				demand(Test.field('updatedAt').type).be('datetime');
				demand(Test.field('updatedBy').type).be('relationship');
			});

			it('should updated all fields when adding a document', function (done) {
				request(app)
					.post('/using-update-handler')
					.send({ name: 'test1' })
					.expect('GOOD')
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						demand(post.get('name')).be('test1');
						demand(post.get('createdBy').toString()).be(dummyUser1.get('id'));
						demand(post.get('updatedBy').toString()).be(dummyUser1.get('id'));

						post.get('createdAt').must.be.a.date();
						post.get('updatedAt').must.be.a.date();

						demand(post.get('createdAt')).equal(post.get('updatedAt'));
						done();
					});
			});

			it('should updated "updatedAt/updatedBy" when modifying a document', function (done) {

				setTimeout(function () {
					request(app)
						.post('/using-update-handler/' + post.get('id'))
						.send({ name: 'test2', 'updatedBy': dummyUser2.get('id'), 'createdBy': dummyUser1.get('id') })
						.expect('GOOD')
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							demand(post.get('name')).be('test2');
							demand(post.get('createdBy').toString()).be(dummyUser1.get('id'));
							demand(post.get('updatedBy').toString()).be(dummyUser2.get('id'));

							post.get('createdAt').must.be.a.date();
							post.get('updatedAt').must.be.a.date();

							demand(post.get('updatedAt')).be.after(post.get('createdAt'));
							done();
						});
				}, 250);
			});

		});

		describe('using .save()', function () {

			before(function () {
				Test = keystone.List(testModelName, { track: true });
				Test.add({ name: { type: String } });

				Test.schema.post('save', function () {
					post = this;
				});

				Test.register();
			});

			after(function (done) {
				// post test cleanup
				Test.model.remove({}, function (err) {
					if (err) {
						throw err;
					}
					removeModel(testModelName);
					done();
				});
			});

			it('should have all the default fields', function () {
				demand(Test.field('createdAt')).be.an.object();
				demand(Test.field('createdBy')).be.an.object();
				demand(Test.field('updatedAt')).be.an.object();
				demand(Test.field('updatedBy')).be.an.object();

				demand(Test.field('createdAt').type).be('datetime');
				demand(Test.field('createdBy').type).be('relationship');
				demand(Test.field('updatedAt').type).be('datetime');
				demand(Test.field('updatedBy').type).be('relationship');
			});

			it('should updated all fields when adding a document', function (done) {

				request(app)
					.post('/using-save')
					.send({ name: 'test1' })
					.expect('GOOD')
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						demand(post.get('name')).be('test1');
						demand(post.get('createdBy').toString()).be(dummyUser1.get('id'));
						demand(post.get('updatedBy').toString()).be(dummyUser1.get('id'));

						post.get('createdAt').must.be.a.date();
						post.get('updatedAt').must.be.a.date();

						demand(post.get('createdAt')).equal(post.get('updatedAt'));
						done();
					});

			});

			it('should updated "updatedAt/updatedBy" when modifying a document', function (done) {

				setTimeout(function () {
					request(app)
						.post('/using-save/' + post._id)
						.send({ name: 'test2' })
						.expect('GOOD')
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							demand(post.get('name')).be('test2');
							demand(post.get('createdBy').toString()).be(dummyUser1.get('id'));
							demand(post.get('updatedBy').toString()).be(dummyUser2.get('id'));

							post.get('createdAt').must.be.a.date();
							post.get('updatedAt').must.be.a.date();

							demand(post.get('updatedAt')).be.after(post.get('createdAt'));
							done();
						});
				}, 250);

			});

		});

	});

	describe('when "track" option fields are selectively enabled', function () {
		var previousUpdatedAt;

		describe('using updateHandler()', function () {

			before(function () {
				Test = keystone.List(testModelName, {
					track: { updatedAt: true, updatedBy: true }
				});
				Test.add({ name: { type: String } });

				Test.schema.post('save', function () {
					post = this;
				});

				Test.register();
			});

			after(function (done) {
				// post test cleanup
				Test.model.remove({}, function (err) {
					if (err) {
						throw err;
					}
					removeModel(testModelName);
					done();
				});
			});

			it('should have all the default fields', function () {
				demand(Test.field('createdAt')).be.undefined();
				demand(Test.field('createdBy')).be.undefined();
				demand(Test.field('updatedAt')).be.an.object();
				demand(Test.field('updatedBy')).be.an.object();

				demand(Test.field('updatedAt').type).be('datetime');
				demand(Test.field('updatedBy').type).be('relationship');
			});

			it('should updated all enabled fields when adding a document', function (done) {
				request(app)
					.post('/using-update-handler')
					.send({ name: 'test1' })
					.expect('GOOD')
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						demand(post.get('name')).be('test1');
						demand(post.get('updatedBy').toString()).be(dummyUser1.get('id'));
						post.get('updatedAt').must.be.a.date();
						previousUpdatedAt = post.get('updatedAt');
						done();
					});
			});

			it('should updated "updatedAt/updatedBy" when modifying a document', function (done) {

				setTimeout(function () {
					request(app)
						.post('/using-update-handler/' + post._id)
						.send({ name: 'test2' })
						.expect('GOOD')
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							demand(post.get('name')).be('test2');
							demand(post.get('updatedBy').toString()).be(dummyUser2.get('id'));
							post.get('updatedAt').must.be.a.date();

							demand(post.get('updatedAt')).be.after(previousUpdatedAt);
							done();
						});
				}, 250);

			});

		});

		describe('using .save()', function () {

			before(function () {
				Test = keystone.List(testModelName, {
					track: { updatedAt: true, updatedBy: true }
				});
				Test.add({ name: { type: String } });

				Test.schema.post('save', function () {
					post = this;
				});

				Test.register();
			});

			after(function (done) {
				// post test cleanup
				Test.model.remove({}, function (err) {
					if (err) {
						throw err;
					}
					removeModel(testModelName);
					done();
				});
			});

			it('should have all the default fields', function () {
				demand(Test.field('createdAt')).be.undefined();
				demand(Test.field('createdBy')).be.undefined();
				demand(Test.field('updatedAt')).be.an.object();
				demand(Test.field('updatedBy')).be.an.object();

				demand(Test.field('updatedAt').type).be('datetime');
				demand(Test.field('updatedBy').type).be('relationship');
			});

			it('should updated all enabled fields when adding a document', function (done) {
				request(app)
					.post('/using-save')
					.send({ name: 'test1' })
					.expect('GOOD')
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						demand(post.get('name')).be('test1');
						demand(post.get('updatedBy').toString()).be(dummyUser1.get('id'));
						post.get('updatedAt').must.be.a.date();
						previousUpdatedAt = post.get('updatedAt');
						done();
					});
			});

			it('should updated "updatedAt/updatedBy" when modifying a document', function (done) {

				setTimeout(function () {
					request(app)
						.post('/using-save/' + post._id)
						.send({ name: 'test2' })
						.expect('GOOD')
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							demand(post.get('name')).be('test2');
							demand(post.get('updatedBy').toString()).be(dummyUser2.get('id'));
							post.get('updatedAt').must.be.a.date();

							demand(post.get('updatedAt')).be.after(previousUpdatedAt);
							done();
						});
				}, 250);

			});

		});

	});

	describe('when "track" option has custom field names', function () {
		var previousUpdatedAt;

		describe('using updateHandler()', function () {

			before(function () {
				Test = keystone.List(testModelName, {
					track: {
						createdAt: 'customCreatedAt',
						createdBy: 'customCreatedBy',
						updatedAt: 'customUpdatedAt',
						updatedBy: 'customUpdatedBy'
					}
				});
				Test.add({ name: { type: String } });

				Test.schema.post('save', function () {
					post = this;
				});

				Test.register();
			});

			after(function (done) {
				// post test cleanup
				Test.model.remove({}, function (err) {
					if (err) {
						throw err;
					}
					removeModel(testModelName);
					done();
				});
			});

			it('should no have any of the default fields', function () {
				demand(Test.field('createdAt')).be.undefined();
				demand(Test.field('createdBy')).be.undefined();
				demand(Test.field('updatedAt')).be.undefined();
				demand(Test.field('updatedBy')).be.undefined();
			});

			it('should have all the custom fields', function () {
				demand(Test.field('customCreatedAt')).be.an.object();
				demand(Test.field('customCreatedBy')).be.an.object();
				demand(Test.field('customUpdatedAt')).be.an.object();
				demand(Test.field('customUpdatedBy')).be.an.object();

				demand(Test.field('customCreatedAt').type).be('datetime');
				demand(Test.field('customCreatedBy').type).be('relationship');
				demand(Test.field('customUpdatedAt').type).be('datetime');
				demand(Test.field('customUpdatedBy').type).be('relationship');
			});

			it('should updated all custom fields when adding a document', function (done) {
				request(app)
					.post('/using-update-handler')
					.send({ name: 'test1' })
					.expect('GOOD')
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						demand(post.get('name')).be('test1');
						demand(post['customCreatedBy'].toString()).be(dummyUser1.get('id'));
						demand(post['customUpdatedBy'].toString()).be(dummyUser1.get('id'));

						post['customCreatedAt'].must.be.a.date();
						post['customUpdatedAt'].must.be.a.date();

						demand(post['customCreatedAt']).equal(post['customUpdatedAt']);
						done();
					});
			});

			it('should updated "UpdatedAt/UpdatedBy" custom when modifying a document', function (done) {

				setTimeout(function () {
					request(app)
						.post('/using-update-handler/' + post._id)
						.send({ name: 'test2' })
						.expect('GOOD')
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							demand(post.get('name')).be('test2');
							demand(post['customUpdatedBy'].toString()).be(dummyUser2.get('id'));
							post['customUpdatedAt'].must.be.a.date();

							demand(post['customUpdatedAt']).be.after(post['customCreatedAt']);
							done();
						});
				}, 250);

			});

		});

		describe('using save()', function () {

			before(function () {
				Test = keystone.List(testModelName, {
					track: {
						createdAt: 'customCreatedAt',
						createdBy: 'customCreatedBy',
						updatedAt: 'customUpdatedAt',
						updatedBy: 'customUpdatedBy'
					}
				});
				Test.add({ name: { type: String } });

				Test.schema.post('save', function () {
					post = this;
				});

				Test.register();
			});

			after(function (done) {
				// post test cleanup
				Test.model.remove({}, function (err) {
					if (err) {
						throw err;
					}
					removeModel(testModelName);
					done();
				});
			});

			it('should no have any of the default fields', function () {
				demand(Test.field('createdAt')).be.undefined();
				demand(Test.field('createdBy')).be.undefined();
				demand(Test.field('updatedAt')).be.undefined();
				demand(Test.field('updatedBy')).be.undefined();
			});

			it('should have all the custom fields', function () {
				demand(Test.field('customCreatedAt')).be.an.object();
				demand(Test.field('customCreatedBy')).be.an.object();
				demand(Test.field('customUpdatedAt')).be.an.object();
				demand(Test.field('customUpdatedBy')).be.an.object();

				demand(Test.field('customCreatedAt').type).be('datetime');
				demand(Test.field('customCreatedBy').type).be('relationship');
				demand(Test.field('customUpdatedAt').type).be('datetime');
				demand(Test.field('customUpdatedBy').type).be('relationship');
			});

			it('should updated all custom fields when adding a document', function (done) {
				request(app)
					.post('/using-save')
					.send({ name: 'test1' })
					.expect('GOOD')
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						demand(post.get('name')).be('test1');
						demand(post['customCreatedBy'].toString()).be(dummyUser1.get('id'));
						demand(post['customUpdatedBy'].toString()).be(dummyUser1.get('id'));

						post['customCreatedAt'].must.be.a.date();
						post['customUpdatedAt'].must.be.a.date();

						demand(post['customCreatedAt']).equal(post['customUpdatedAt']);
						done();
					});
			});

			it('should updated "UpdatedAt/UpdatedBy" custom when modifying a document', function (done) {

				setTimeout(function () {
					request(app)
						.post('/using-save/' + post._id)
						.send({ name: 'test2' })
						.expect('GOOD')
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							demand(post.get('name')).be('test2');
							demand(post['customUpdatedBy'].toString()).be(dummyUser2.get('id'));
							post['customUpdatedAt'].must.be.a.date();

							demand(post['customUpdatedAt']).be.after(post['customCreatedAt']);
							done();
						});
				}, 250);

			});

		});

	});

});
